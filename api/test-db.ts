import { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await dbConnect();
    res.status(200).json({ message: 'Connexion à la base de données réussie' });
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    res.status(500).json({ error: 'Erreur de connexion à la base de données' });
  }
} 