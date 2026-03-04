import { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from './db';
import Restaurant from './models/Restaurant';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const restaurants = await Restaurant.find({ statut: 'actif' });
        res.status(200).json(restaurants);
      } catch {
        res.status(500).json({ error: 'Erreur lors de la récupération des restaurants' });
      }
      break;

    case 'POST':
      try {
        const restaurant = await Restaurant.create(req.body);
        res.status(201).json(restaurant);
      } catch {
        res.status(400).json({ error: 'Erreur lors de la création du restaurant' });
      }
      break;

    case 'PUT':
      try {
        const { id } = req.query;
        const restaurant = await Restaurant.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!restaurant) {
          return res.status(404).json({ error: 'Restaurant non trouvé' });
        }
        res.status(200).json(restaurant);
      } catch {
        res.status(400).json({ error: 'Erreur lors de la mise à jour du restaurant' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        const restaurant = await Restaurant.findByIdAndDelete(id);
        if (!restaurant) {
          return res.status(404).json({ error: 'Restaurant non trouvé' });
        }
        res.status(200).json({ message: 'Restaurant supprimé avec succès' });
      } catch {
        res.status(400).json({ error: 'Erreur lors de la suppression du restaurant' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 