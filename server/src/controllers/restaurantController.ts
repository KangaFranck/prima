import { Request, Response } from '../types/express';
import Restaurant, { IRestaurant } from '../models/Restaurant';
import mongoose from 'mongoose';
import { resolveLogoAndImages } from '../lib/r2';
import { useNeon } from '../db/neon';
import * as neonRestaurants from '../db/restaurants.neon';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isValidId(id: string): boolean {
  return useNeon() ? UUID_REGEX.test(id) : mongoose.isValidObjectId(id);
}

async function getLogoAndImages(req: Request): Promise<{ logo?: string; images: string[] }> {
  const files = req.files as { logo?: Express.Multer.File[]; images?: Express.Multer.File[] } | undefined;
  return resolveLogoAndImages(files, req.body?.logo, req.body?.images, 'restaurants');
}

function normalizeBody(body: Record<string, unknown>): Record<string, unknown> {
  const b = { ...body };
  if (typeof b.ouvertLeDimanche === 'string') b.ouvertLeDimanche = b.ouvertLeDimanche === 'true';
  if ((b.instagram !== undefined || b.facebook !== undefined) && !b.reseauxSociaux) {
    b.reseauxSociaux = { instagram: b.instagram as string, facebook: b.facebook as string };
  }
  if (b.reseauxSociaux && typeof (b.reseauxSociaux as any)?.instagram === 'undefined' && b.instagram) (b.reseauxSociaux as any).instagram = b.instagram;
  if (b.reseauxSociaux && typeof (b.reseauxSociaux as any)?.facebook === 'undefined' && b.facebook) (b.reseauxSociaux as any).facebook = b.facebook;
  return b;
}

export const getAllRestaurants = async (req: Request, res: Response): Promise<void> => {
  try {
    if (useNeon()) {
      const restaurants = await neonRestaurants.neonGetAllRestaurants();
      res.status(200).json(restaurants);
      return;
    }
    const restaurants: IRestaurant[] = await Restaurant.find().sort({ createdAt: -1 });
    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Erreur getAllRestaurants:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des restaurants' });
  }
};

export const getRestaurantById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id || !isValidId(id)) {
      res.status(400).json({ message: 'ID de restaurant invalide' });
      return;
    }
    if (useNeon()) {
      const restaurant = await neonRestaurants.neonGetRestaurantById(id);
      if (!restaurant) { res.status(404).json({ message: 'Restaurant non trouvé' }); return; }
      res.status(200).json(restaurant);
      return;
    }
    const restaurant: IRestaurant | null = await Restaurant.findById(id);
    if (!restaurant) {
      res.status(404).json({ message: 'Restaurant non trouvé' });
      return;
    }
    res.status(200).json(restaurant);
  } catch (error) {
    console.error('Erreur getRestaurantById:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du restaurant' });
  }
};

export const createRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { logo, images } = await getLogoAndImages(req);
    const body = normalizeBody({ ...req.body } as Record<string, unknown>);
    delete body._id;
    delete body.createdAt;
    delete body.updatedAt;
    body.logo = logo;
    body.images = images.length ? images : (Array.isArray(req.body?.images) ? req.body.images : []);

    if (useNeon()) {
      const saved = await neonRestaurants.neonCreateRestaurant(body);
      if (!saved) { res.status(500).json({ message: 'Erreur création' }); return; }
      res.status(201).json(saved);
      return;
    }
    const restaurant = new Restaurant({ ...body, ...(logo !== undefined && { logo }), images: body.images as string[] });
    const savedRestaurant = await restaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    console.error('Erreur createRestaurant:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: 'Données de restaurant invalides', errors: error.errors });
      return;
    }
    res.status(500).json({ message: 'Erreur lors de la création du restaurant' });
  }
};

export const updateRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id || !isValidId(id)) {
      res.status(400).json({ message: 'ID de restaurant invalide' });
      return;
    }
    const { logo, images } = await getLogoAndImages(req);
    const updateData: Record<string, unknown> = normalizeBody({ ...req.body } as Record<string, unknown>);
    delete updateData._id;
    delete updateData.createdAt;
    if (logo !== undefined) updateData.logo = logo;
    if (images.length > 0) updateData.images = images;

    if (useNeon()) {
      const updated = await neonRestaurants.neonUpdateRestaurant(id, updateData);
      if (!updated) { res.status(404).json({ message: 'Restaurant non trouvé' }); return; }
      res.status(200).json(updated);
      return;
    }
    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!restaurant) {
      res.status(404).json({ message: 'Restaurant non trouvé' });
      return;
    }
    res.status(200).json(restaurant);
  } catch (error) {
    console.error('Erreur updateRestaurant:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: 'Données de restaurant invalides', errors: error.errors });
      return;
    }
    res.status(500).json({ message: 'Erreur lors de la mise à jour du restaurant' });
  }
};

export const deleteRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id || !isValidId(id)) {
      res.status(400).json({ message: 'ID de restaurant invalide' });
      return;
    }
    if (useNeon()) {
      const deleted = await neonRestaurants.neonDeleteRestaurant(id);
      if (!deleted) { res.status(404).json({ message: 'Restaurant non trouvé' }); return; }
      res.status(200).json({ message: 'Restaurant supprimé avec succès' });
      return;
    }
    const restaurant = await Restaurant.findByIdAndDelete(id);
    if (!restaurant) {
      res.status(404).json({ message: 'Restaurant non trouvé' });
      return;
    }
    res.status(200).json({ message: 'Restaurant supprimé avec succès' });
  } catch (error) {
    console.error('Erreur deleteRestaurant:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du restaurant' });
  }
}; 