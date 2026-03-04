import { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from './db';
import Info from './models/Info';
import { withAdminAuth } from './middleware/auth';

async function handler(req: VercelRequest, res: VercelResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const { type } = req.query;
        const query: Record<string, unknown> = { statut: 'actif' };
        
        if (type) {
          query.type = type;
        }

        const infos = await Info.find(query).sort({ ordre: 1 });
        res.status(200).json(infos);
      } catch {
        res.status(500).json({ error: 'Erreur lors de la récupération des informations' });
      }
      break;

    case 'POST':
      try {
        const info = await Info.create(req.body);
        res.status(201).json(info);
      } catch {
        res.status(400).json({ error: 'Erreur lors de la création de l\'information' });
      }
      break;

    case 'PUT':
      try {
        const { id } = req.query;
        const info = await Info.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!info) {
          return res.status(404).json({ error: 'Information non trouvée' });
        }
        res.status(200).json(info);
      } catch {
        res.status(400).json({ error: 'Erreur lors de la mise à jour de l\'information' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        const info = await Info.findByIdAndDelete(id);
        if (!info) {
          return res.status(404).json({ error: 'Information non trouvée' });
        }
        res.status(200).json({ message: 'Information supprimée avec succès' });
      } catch {
        res.status(400).json({ error: 'Erreur lors de la suppression de l\'information' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Protéger toutes les routes sauf GET avec l'authentification admin
export default async function (req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return handler(req, res);
  }
  return withAdminAuth(handler)(req, res);
} 