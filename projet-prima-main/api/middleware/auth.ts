import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface DecodedToken {
  userId: string;
  email: string;
  role: string;
}

export function withAuth(handler: Function) {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ error: 'Token manquant' });
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        req.user = decoded;
        return handler(req, res);
      } catch (error) {
        return res.status(401).json({ error: 'Token invalide' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Erreur d\'authentification' });
    }
  };
}

export function withAdminAuth(handler: Function) {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ error: 'Token manquant' });
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        if (decoded.role !== 'admin') {
          return res.status(403).json({ error: 'Accès non autorisé' });
        }
        req.user = decoded;
        return handler(req, res);
      } catch (error) {
        return res.status(401).json({ error: 'Token invalide' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Erreur d\'authentification' });
    }
  };
} 