/**
 * Login admin – Neon (PostgreSQL) + JWT.
 * Déployé par Vercel comme /api/auth/login (plus de conflit 405).
 */
import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim().replace(/\/$/, ''))
  .filter(Boolean);

function cors(res: VercelResponse, origin: string | undefined) {
  const originNorm = origin ? origin.replace(/\/$/, '') : '';
  const allowed = originNorm && ALLOWED_ORIGINS.includes(originNorm);
  const vercelApp = originNorm && /\.vercel\.app$/i.test(originNorm);
  const o = allowed ? originNorm : (vercelApp ? originNorm : ALLOWED_ORIGINS[0] || '*');
  res.setHeader('Access-Control-Allow-Origin', (typeof o === 'string' ? o.replace(/\/$/, '') : o) || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Debug prod : voir dans Vercel > Logs ce qui est reçu (méthode, URL)
  console.log('[login] method=', req.method, 'url=', req.url, 'headers.method=', (req.headers as Record<string, string>)['x-vercel-forwarded-method']);

  cors(res, req.headers.origin);

  if ((req.method || '').toUpperCase() === 'OPTIONS') {
    return res.status(204).end();
  }

  if ((req.method || '').toUpperCase() !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { email, password } = body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const rows = await sql`SELECT id, email, password_hash, name, permissions FROM admins WHERE email = ${email} LIMIT 1`;
    const admin = rows[0] as { id: string; email: string; password_hash: string; name?: string; permissions?: string[] } | undefined;
    if (!admin) {
      return res.status(401).json({ error: 'Identifiants incorrects.' });
    }

    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Identifiants incorrects.' });
    }

    const permissions = admin.permissions || ['dashboard', 'boutiques', 'restaurants', 'loisirs', 'evenements', 'settings', 'users'];
    const token = jwt.sign(
      { adminId: admin.id, email: admin.email, permissions },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    const record = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: 'super_admin',
      permissions,
      isActive: true,
    };
    return res.status(200).json({ token, record });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
