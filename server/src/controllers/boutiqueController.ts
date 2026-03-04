import { Request, Response } from '../types/express';
import Boutique, { IBoutique } from '../models/Boutique';
import mongoose from 'mongoose';

export const getAllBoutiques = async (req: Request, res: Response): Promise<void> => {
  try {
    const boutiques: IBoutique[] = await Boutique.find().sort({ createdAt: -1 });
    res.status(200).json(boutiques);
  } catch (error) {
    console.error('Erreur getAllBoutiques:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des boutiques' });
  }
};

export const getBoutiqueById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: 'ID de boutique invalide' });
      return;
    }

    const boutique: IBoutique | null = await Boutique.findById(id);
    if (!boutique) {
      res.status(404).json({ message: 'Boutique non trouvée' });
      return;
    }
    res.status(200).json(boutique);
  } catch (error) {
    console.error('Erreur getBoutiqueById:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la boutique' });
  }
};

// Récupère logo et images depuis req (multer fields ou body JSON)
function getLogoAndImages(req: Request): { logo?: string; images: string[] } {
  const files = req.files as { logo?: Express.Multer.File[]; images?: Express.Multer.File[] } | undefined;
  const logo = files?.logo?.[0]?.filename ?? req.file?.filename ?? req.body?.logo;
  const images = files?.images?.map((f) => f.filename) ?? (Array.isArray(req.body?.images) ? req.body.images : []);
  return { logo, images: images || [] };
}

// Normalise horaires et reseauxSociaux (FormData envoie des chaînes)
function normalizeBody(body: Record<string, unknown>): Record<string, unknown> {
  const b = { ...body };
  if (typeof b.horaires === 'string') {
    try {
      b.horaires = JSON.parse(b.horaires as string);
    } catch {
      b.horaires = [];
    }
  }
  if (typeof b.ouvertLeDimanche === 'string') b.ouvertLeDimanche = b.ouvertLeDimanche === 'true';
  if ((b.instagram !== undefined || b.facebook !== undefined) && !b.reseauxSociaux) {
    b.reseauxSociaux = { instagram: b.instagram as string, facebook: b.facebook as string };
  }
  if (typeof (b.reseauxSociaux as any)?.instagram === 'undefined' && b.instagram) (b.reseauxSociaux as any).instagram = b.instagram;
  if (typeof (b.reseauxSociaux as any)?.facebook === 'undefined' && b.facebook) (b.reseauxSociaux as any).facebook = b.facebook;
  return b;
}

export const createBoutique = async (req: Request, res: Response): Promise<void> => {
  try {
    const { logo, images } = getLogoAndImages(req);
    const body = normalizeBody({ ...req.body } as Record<string, unknown>);
    delete body._id;
    delete body.createdAt;
    delete body.updatedAt;
    const boutique = new Boutique({
      ...body,
      ...(logo !== undefined && { logo }),
      images: images.length ? images : (Array.isArray(req.body?.images) ? req.body.images : [])
    });

    const savedBoutique = await boutique.save();
    res.status(201).json(savedBoutique);
  } catch (error) {
    console.error('Erreur createBoutique:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: 'Données de boutique invalides', errors: error.errors });
      return;
    }
    res.status(500).json({ message: 'Erreur lors de la création de la boutique' });
  }
};

export const updateBoutique = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: 'ID de boutique invalide' });
      return;
    }

    const { logo, images } = getLogoAndImages(req);
    const updateData: Record<string, unknown> = normalizeBody({ ...req.body } as Record<string, unknown>);
    delete updateData._id;
    delete updateData.createdAt;
    if (logo !== undefined) updateData.logo = logo;
    if (images.length > 0) updateData.images = images;

    const boutique = await Boutique.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!boutique) {
      res.status(404).json({ message: 'Boutique non trouvée' });
      return;
    }
    res.status(200).json(boutique);
  } catch (error) {
    console.error('Erreur updateBoutique:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: 'Données de boutique invalides', errors: error.errors });
      return;
    }
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la boutique' });
  }
};

export const deleteBoutique = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: 'ID de boutique invalide' });
      return;
    }

    const boutique = await Boutique.findByIdAndDelete(id);
    if (!boutique) {
      res.status(404).json({ message: 'Boutique non trouvée' });
      return;
    }
    res.status(200).json({ message: 'Boutique supprimée avec succès' });
  } catch (error) {
    console.error('Erreur deleteBoutique:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la boutique' });
  }
}; 