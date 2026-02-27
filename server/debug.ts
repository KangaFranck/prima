/**
 * GET /api/debug — diagnostic déployé comme fonction dédiée (évite 404 si rewrite échoue).
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const origin = (req.headers.origin || '').replace(/\/$/, '');
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Cache-Control', 'no-store');
  if ((req.method || '').toUpperCase() === 'OPTIONS') {
    return res.status(204).end();
  }
  if ((req.method || '').toUpperCase() !== 'GET') {
    return res.status(405).json({ error: 'GET only' });
  }
  return res.status(200).json({
    ok: true,
    path: 'debug',
    method: req.method,
    xForwardedMethod: req.headers['x-vercel-forwarded-method'],
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    hasJwtSecret: Boolean(process.env.JWT_SECRET),
    allowedOriginsCount: (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean).length,
    originReceived: origin || null,
    hint: 'Si method !== POST sur login, le problème vient du routage. Ajoute ton URL dans ALLOWED_ORIGINS sur Vercel.',
  });
}
