/**
 * Serveur API local (Neon + R2) — comme pb:serve pour PocketBase.
 * Lancer: npm run api   puis dans un autre terminal: npm run dev
 */
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function loadEnv() {
  for (const name of ['.env.local', '.env']) {
    try {
      const content = readFileSync(join(root, name), 'utf8');
      for (const line of content.split('\n')) {
        const i = line.indexOf('=');
        if (i <= 0 || line.startsWith('#')) continue;
        const key = line.slice(0, i).trim();
        const val = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) process.env[key] = val;
      }
    } catch (_) {}
  }
}
loadEnv();

const PORT = Number(process.env.API_PORT || process.env.PORT) || 3001;
let handler: (req: any, res: any) => Promise<void>;

function parsePath(pathname: string) {
  const m = pathname.match(/^\/api\/?(.*)$/);
  return m ? (m[1] || '').replace(/\/$/, '') : '';
}

function collectBody(req: import('http').IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    let buf = '';
    req.on('data', (c) => { buf += c; });
    req.on('end', () => {
      if (!buf) return resolve(undefined);
      try { resolve(JSON.parse(buf)); } catch { resolve(undefined); }
    });
  });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  const pathname = url.pathname || '/';

  if (pathname === '/' || pathname === '') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      api: 'prima-center',
      message: 'API locale. Health: /api/health',
      health: `http://localhost:${PORT}/api/health`,
    }));
    return;
  }

  const path = parsePath(pathname);

  const vercelReq = {
    method: req.method,
    headers: req.headers,
    url: req.url,
    query: { path },
    body: undefined as unknown,
  };
  if (req.method === 'POST' || req.method === 'PUT') {
    vercelReq.body = await collectBody(req);
  }

  const vercelRes = {
    _status: 200,
    _headers: {} as Record<string, string>,
    setHeader(k: string, v: string) { this._headers[k] = v; return this; },
    status(code: number) { this._status = code; return this; },
    end(body?: string) {
      Object.entries(this._headers).forEach(([k, v]) => res.setHeader(k, v));
      res.statusCode = this._status;
      res.end(body);
    },
    json(obj: object) {
      this.setHeader('Content-Type', 'application/json');
      this.end(JSON.stringify(obj));
    },
  };

  try {
    if (!handler) {
      const mod = await import('../api/routes');
      handler = mod.default;
    }
    await handler(vercelReq as any, vercelRes as any);
  } catch (err) {
    const origin = req.headers.origin || req.headers.referer?.replace(/\/[^/]*$/, '') || 'http://localhost:5173';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: (err as Error).message || String(err) }));
  }
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\nLe port ${PORT} est déjà utilisé.`);
    console.error('  → Ferme l’autre terminal où tourne "npm run api", ou tue le processus.');
    console.error(`  → Ou dans .env.local mets API_PORT=3002 puis dans .env.development mets VITE_API_URL=http://localhost:3002\n`);
  } else {
    console.error(err);
  }
  process.exit(1);
});

server.listen(PORT, async () => {
  const mod = await import('../api/routes');
  handler = mod.default;
  console.log(`API locale (Neon + R2): http://localhost:${PORT}`);
  console.log(`  Health: http://localhost:${PORT}/api/health`);
  console.log(`  Puis: npm run dev  ->  http://localhost:5173`);
});
