/**
 * Point d'entrée API unique — format officiel Vercel (Web Handler fetch).
 * Doc: https://vercel.com/docs/functions/serverless-functions
 * vercel.json réécrit /api/* vers /api/index?path=...
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import routesHandler from './routes.js';

function makeReq(request: Request, path: string): VercelRequest {
  const headers: Record<string, string | string[] | undefined> = {};
  request.headers.forEach((v, k) => {
    headers[k.toLowerCase()] = v;
  });
  let body: unknown = null;
  return {
    method: request.method,
    url: request.url,
    headers,
    query: { path },
    body: null as unknown,
    get body() {
      return body;
    },
    set body(v: unknown) {
      body = v;
    },
  } as unknown as VercelRequest;
}

function makeRes(): VercelResponse & { getResponse: () => Response } {
  let status = 200;
  let body = '';
  const headers: Record<string, string> = {};
  const res = {
    setHeader(name: string, value: string | number) {
      headers[name.toLowerCase()] = String(value);
      return res;
    },
    status(code: number) {
      status = code;
      return res;
    },
    json(obj: unknown) {
      body = JSON.stringify(obj);
      return res;
    },
    end() {
      return res;
    },
    getResponse(): Response {
      if (status === 204) {
        return new Response(null, { status: 204, headers: headers as HeadersInit });
      }
      return new Response(body || null, {
        status,
        headers: { 'Content-Type': 'application/json', ...headers } as HeadersInit,
      });
    },
  };
  return res as VercelResponse & { getResponse: () => Response };
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = (url.searchParams.get('path') ?? '').replace(/\/$/, '').trim();
    const req = makeReq(request, path);
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      try {
        (req as { body: unknown }).body = await request.json();
      } catch {
        (req as { body: unknown }).body = {};
      }
    }
    const res = makeRes();
    await routesHandler(req, res);
    return res.getResponse();
  },
};
