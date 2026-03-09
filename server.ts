/**
 * Serveur production : API (/api/*) + frontend statique (dist/).
 * Pour Render ou tout hébergeur Node.
 * Usage: npm run build && npm run start
 */
import { createServer, type IncomingMessage, type ServerResponse } from 'http';
import { readFileSync, existsSync, statSync, createReadStream } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname);
const distDir = join(root, 'dist');

function loadEnv() {
  for (const name of ['.env.production', '.env.local', '.env']) {
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

const PORT = Number(process.env.PORT) || 3000;
let apiHandler: (req: unknown, res: unknown) => Promise<void>;

function parsePath(pathname: string): string {
  const m = pathname.match(/^\/api\/?(.*)$/);
  return m ? (m[1] || '').replace(/\/$/, '') : '';
}

function collectBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    let buf = '';
    req.on('data', (c) => { buf += c; });
    req.on('end', () => {
      if (!buf) return resolve(undefined);
      try {
        resolve(JSON.parse(buf));
      } catch {
        resolve(undefined);
      }
    });
  });
}

const MIMES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
};

/**
 * Cache conseillé :
 * - Médias / polices / JS-CSS : 1 an (31536000) → pas de re-téléchargement, moins de lenteur.
 * - HTML : pas de cache long → les utilisateurs récupèrent les mises à jour tout de suite.
 */
const CACHEABLE_EXT = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico',
  '.mp4', '.webm', '.ogg',
  '.woff', '.woff2',
  '.js', '.css', '.json',
]);
const CACHE_MAX_AGE_MEDIA = 31536000; // 1 an (recommandé pour images, vidéos, fonts, assets buildés)
const CACHE_MAX_AGE_HTML = 0; // pas de cache pour HTML (index.html) pour voir les mises à jour

const VIDEO_EXT = new Set(['.mp4', '.webm', '.ogg']);

/** Parse Range header "bytes=0-1023" → { start, end } ou null */
function parseRange(rangeHeader: string | undefined, fileSize: number): { start: number; end: number } | null {
  if (!rangeHeader || !rangeHeader.startsWith('bytes=')) return null;
  const part = rangeHeader.slice(6).trim().split('-');
  const start = parseInt(part[0], 10);
  const end = part[1] ? parseInt(part[1], 10) : fileSize - 1;
  if (isNaN(start) || isNaN(end) || start > end || start < 0 || end >= fileSize) return null;
  return { start, end };
}

function serveStatic(pathname: string, req: IncomingMessage, res: ServerResponse): boolean {
  let decoded: string;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    decoded = pathname;
  }
  if (decoded.includes('..')) return false;
  const file = decoded === '/' || decoded === '' ? 'index.html' : decoded.slice(1);
  const filePath = join(distDir, file);
  if (!filePath.startsWith(distDir)) return false;
  try {
    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
      const indexHtml = join(distDir, 'index.html');
      if (existsSync(indexHtml)) {
        res.writeHead(200, {
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=' + CACHE_MAX_AGE_HTML + ', must-revalidate',
        });
        res.end(readFileSync(indexHtml));
        return true;
      }
      return false;
    }
    const ext = extname(filePath);
    const contentType = MIMES[ext] || 'application/octet-stream';
    const headers: Record<string, string> = { 'Content-Type': contentType };
    if (CACHEABLE_EXT.has(ext)) {
      headers['Cache-Control'] = `public, max-age=${CACHE_MAX_AGE_MEDIA}, immutable`;
    } else if (ext === '.html') {
      headers['Cache-Control'] = `public, max-age=${CACHE_MAX_AGE_HTML}, must-revalidate`;
    }

    const stat = statSync(filePath);
    const fileSize = stat.size;
    const range = VIDEO_EXT.has(ext) ? parseRange(req.headers['range'], fileSize) : null;

    if (range) {
      const { start, end } = range;
      const chunkSize = end - start + 1;
      headers['Content-Range'] = `bytes ${start}-${end}/${fileSize}`;
      headers['Accept-Ranges'] = 'bytes';
      headers['Content-Length'] = String(chunkSize);
      res.writeHead(206, headers);
      const stream = createReadStream(filePath, { start, end });
      stream.pipe(res);
    } else {
      headers['Accept-Ranges'] = 'bytes';
      res.writeHead(200, headers);
      res.end(readFileSync(filePath));
    }
    return true;
  } catch {
    return false;
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  const pathname = url.pathname || '/';

  if (pathname.startsWith('/api')) {
    const path = parsePath(pathname);
    const maxUploadBytes = 20 * 1024 * 1024; // 20 MB par requête upload (base64 ~+33%, donc ~15 Mo image réelle)
    const contentLength = req.headers['content-length'];
    if (path === 'upload' && req.method === 'POST' && contentLength && Number(contentLength) > maxUploadBytes) {
      res.writeHead(413, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Image trop volumineuse. Réduisez la taille (max ~15 Mo par image) ou enregistrez sans image.' }));
      return;
    }
    const query: Record<string, string> = { path };
    url.searchParams.forEach((v, k) => { query[k] = v; });
    const vercelReq = {
      method: req.method,
      headers: req.headers,
      url: req.url,
      query,
      body: undefined as unknown,
    };
    if (req.method === 'POST' || req.method === 'PUT') {
      vercelReq.body = await collectBody(req);
    }
    const vercelRes = {
      _status: 200,
      _headers: {} as Record<string, string>,
      setHeader(k: string, v: string | number) {
        this._headers[k.toLowerCase()] = String(v);
        return this;
      },
      status(code: number) {
        this._status = code;
        return this;
      },
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
      if (!apiHandler) {
        const mod = await import('./server/routes.ts');
        apiHandler = mod.default;
      }
      await apiHandler(vercelReq, vercelRes);
    } catch (err) {
      const origin = req.headers.origin || req.headers.referer?.toString().replace(/\/[^/]*$/, '') || '*';
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: (err as Error).message || String(err) }));
    }
    return;
  }

  if (serveStatic(pathname, req, res)) return;
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, '0.0.0.0', async () => {
  try {
    const mod = await import('./server/routes.ts');
    apiHandler = mod.default;
    console.log(`Serveur Prima Center: http://0.0.0.0:${PORT}`);
    console.log(`  API: http://0.0.0.0:${PORT}/api/health`);
  } catch (err) {
    console.error('Erreur au chargement de l\'API:', err);
    process.exit(1);
  }
});
