import { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from './db';
import Evenement from './models/Evenement';
import { withAdminAuth } from './middleware/auth';

async function handler(req: VercelRequest, res: VercelResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const { type, actif } = req.query;
        let query: any = {};
        
        if (type) {
          query.type = type;
        }
        
        if (actif === 'true') {
          query.statut = 'actif';
          query.dateFin = { $gte: new Date() };
        }

        const evenements = await Evenement.find(query)
          .populate('boutiques', 'nom image')
          .populate('restaurants', 'nom image')
          .populate('loisirs', 'nom image')
          .sort({ dateDebut: -1 });

        res.status(200).json(evenements);
      } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des événements' });
      }
      break;

    case 'POST':
      try {
        const evenement = await Evenement.create(req.body);
        res.status(201).json(evenement);
      } catch (error) {
        res.status(400).json({ error: 'Erreur lors de la création de l\'événement' });
      }
      break;

    case 'PUT':
      try {
        const { id } = req.query;
        const evenement = await Evenement.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!evenement) {
          return res.status(404).json({ error: 'Événement non trouvé' });
        }
        res.status(200).json(evenement);
      } catch (error) {
        res.status(400).json({ error: 'Erreur lors de la mise à jour de l\'événement' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        const evenement = await Evenement.findByIdAndDelete(id);
        if (!evenement) {
          return res.status(404).json({ error: 'Événement non trouvé' });
        }
        res.status(200).json({ message: 'Événement supprimé avec succès' });
      } catch (error) {
        res.status(400).json({ error: 'Erreur lors de la suppression de l\'événement' });
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