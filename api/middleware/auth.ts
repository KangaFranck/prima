import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

function getJwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET doit être défini (env).');
  return s;
}

export interface AdminPayload {
  adminId: string;
  email: string;
  permissions: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AdminPayload;
    }
  }
}

export function getAdminFromToken(req: VercelRequest): AdminPayload | null {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  try {
    return jwt.verify(token, getJwtSecret()) as AdminPayload;
  } catch {
    return null;
  }
}

export function withAdminAuth(
  handler: (req: VercelRequest, res: VercelResponse) => Promise<void | VercelResponse>
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    const admin = getAdminFromToken(req);
    if (!admin) {
      res.status(401).json({ error: 'Token manquant ou invalide' });
      return;
    }
    (req as VercelRequest & { user?: AdminPayload }).user = admin;
    return handler(req, res);
  };
}
