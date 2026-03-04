import { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from './db';
import Boutique from './models/Boutique';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const boutiques = await Boutique.find({ statut: 'actif' });
        res.status(200).json(boutiques);
      } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des boutiques' });
      }
      break;

    case 'POST':
      try {
        const boutique = await Boutique.create(req.body);
        res.status(201).json(boutique);
      } catch (error) {
        res.status(400).json({ error: 'Erreur lors de la création de la boutique' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 