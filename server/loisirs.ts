import { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from './db';
import Loisir from './models/Loisir';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const loisirs = await Loisir.find({ statut: 'actif' });
        res.status(200).json(loisirs);
      } catch {
        res.status(500).json({ error: 'Erreur lors de la récupération des loisirs' });
      }
      break;

    case 'POST':
      try {
        const loisir = await Loisir.create(req.body);
        res.status(201).json(loisir);
      } catch {
        res.status(400).json({ error: 'Erreur lors de la création du loisir' });
      }
      break;

    case 'PUT':
      try {
        const { id } = req.query;
        const loisir = await Loisir.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!loisir) {
          return res.status(404).json({ error: 'Loisir non trouvé' });
        }
        res.status(200).json(loisir);
      } catch {
        res.status(400).json({ error: 'Erreur lors de la mise à jour du loisir' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        const loisir = await Loisir.findByIdAndDelete(id);
        if (!loisir) {
          return res.status(404).json({ error: 'Loisir non trouvé' });
        }
        res.status(200).json({ message: 'Loisir supprimé avec succès' });
      } catch {
        res.status(400).json({ error: 'Erreur lors de la suppression du loisir' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 