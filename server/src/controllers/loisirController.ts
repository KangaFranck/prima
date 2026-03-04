import { Request, Response } from '../types/express';
import Loisir, { ILoisir } from '../models/Loisir';
import mongoose from 'mongoose';
import { resolveLogoAndImages } from '../lib/r2';
import { useNeon } from '../db/neon';
import * as neonLoisirs from '../db/loisirs.neon';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isValidId(id: string): boolean {
  return useNeon() ? UUID_REGEX.test(id) : mongoose.isValidObjectId(id);
}

async function getLogoAndImages(req: Request): Promise<{ logo?: string; images: string[] }> {
  const files = req.files as { logo?: Express.Multer.File[]; images?: Express.Multer.File[] } | undefined;
  return resolveLogoAndImages(files, req.body?.logo, req.body?.images, 'loisirs');
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

export const getAllLoisirs = async (req: Request, res: Response): Promise<void> => {
  try {
    if (useNeon()) {
      const loisirs = await neonLoisirs.neonGetAllLoisirs();
      res.status(200).json(loisirs);
      return;
    }
    const loisirs: ILoisir[] = await Loisir.find().sort({ createdAt: -1 });
    res.status(200).json(loisirs);
  } catch (error) {
    console.error('Erreur getAllLoisirs:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des loisirs' });
  }
};

export const getLoisirById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id || !isValidId(id)) {
      res.status(400).json({ message: 'ID de loisir invalide' });
      return;
    }
    if (useNeon()) {
      const loisir = await neonLoisirs.neonGetLoisirById(id);
      if (!loisir) { res.status(404).json({ message: 'Loisir non trouvé' }); return; }
      res.status(200).json(loisir);
      return;
    }
    const loisir: ILoisir | null = await Loisir.findById(id);
    if (!loisir) {
      res.status(404).json({ message: 'Loisir non trouvé' });
      return;
    }
    res.status(200).json(loisir);
  } catch (error) {
    console.error('Erreur getLoisirById:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du loisir' });
  }
};

export const createLoisir = async (req: Request, res: Response): Promise<void> => {
  try {
    const { logo, images } = await getLogoAndImages(req);
    const body = normalizeBody({ ...req.body } as Record<string, unknown>);
    delete body._id;
    delete body.createdAt;
    delete body.updatedAt;
    body.logo = logo;
    body.images = images.length ? images : (Array.isArray(req.body?.images) ? req.body.images : []);

    if (useNeon()) {
      const saved = await neonLoisirs.neonCreateLoisir(body);
      if (!saved) { res.status(500).json({ message: 'Erreur création' }); return; }
      res.status(201).json(saved);
      return;
    }
    const loisir = new Loisir({ ...body, ...(logo !== undefined && { logo }), images: body.images as string[] });
    const savedLoisir = await loisir.save();
    res.status(201).json(savedLoisir);
  } catch (error) {
    console.error('Erreur createLoisir:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: 'Données de loisir invalides', errors: error.errors });
      return;
    }
    res.status(500).json({ message: 'Erreur lors de la création du loisir' });
  }
};

export const updateLoisir = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id || !isValidId(id)) {
      res.status(400).json({ message: 'ID de loisir invalide' });
      return;
    }
    const { logo, images } = await getLogoAndImages(req);
    const updateData: Record<string, unknown> = normalizeBody({ ...req.body } as Record<string, unknown>);
    delete updateData._id;
    delete updateData.createdAt;
    if (logo !== undefined) updateData.logo = logo;
    if (images.length > 0) updateData.images = images;

    if (useNeon()) {
      const updated = await neonLoisirs.neonUpdateLoisir(id, updateData);
      if (!updated) { res.status(404).json({ message: 'Loisir non trouvé' }); return; }
      res.status(200).json(updated);
      return;
    }
    const loisir = await Loisir.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!loisir) {
      res.status(404).json({ message: 'Loisir non trouvé' });
      return;
    }
    res.status(200).json(loisir);
  } catch (error) {
    console.error('Erreur updateLoisir:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: 'Données de loisir invalides', errors: error.errors });
      return;
    }
    res.status(500).json({ message: 'Erreur lors de la mise à jour du loisir' });
  }
};

export const deleteLoisir = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id || !isValidId(id)) {
      res.status(400).json({ message: 'ID de loisir invalide' });
      return;
    }
    if (useNeon()) {
      const deleted = await neonLoisirs.neonDeleteLoisir(id);
      if (!deleted) { res.status(404).json({ message: 'Loisir non trouvé' }); return; }
      res.status(200).json({ message: 'Loisir supprimé avec succès' });
      return;
    }
    const loisir = await Loisir.findByIdAndDelete(id);
    if (!loisir) {
      res.status(404).json({ message: 'Loisir non trouvé' });
      return;
    }
    res.status(200).json({ message: 'Loisir supprimé avec succès' });
  } catch (error) {
    console.error('Erreur deleteLoisir:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du loisir' });
  }
}; 