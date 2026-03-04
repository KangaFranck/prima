import { Request, Response } from '../types/express';
import Service, { IService } from '../models/Service';
import mongoose from 'mongoose';
import { resolveLogoAndImages } from '../lib/r2';
import { useNeon } from '../db/neon';
import * as neonServices from '../db/services.neon';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isValidId(id: string): boolean {
  return useNeon() ? UUID_REGEX.test(id) : mongoose.isValidObjectId(id);
}

async function getLogoAndImages(req: Request): Promise<{ logo?: string; images: string[] }> {
  const files = req.files as { logo?: Express.Multer.File[]; images?: Express.Multer.File[] } | undefined;
  return resolveLogoAndImages(files, req.body?.logo, req.body?.images, 'services');
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

export const getAllServices = async (req: Request, res: Response): Promise<void> => {
  try {
    if (useNeon()) {
      const services = await neonServices.neonGetAllServices();
      res.status(200).json(services);
      return;
    }
    const services: IService[] = await Service.find().sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    console.error('Erreur getAllServices:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des services' });
  }
};

export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id || !isValidId(id)) {
      res.status(400).json({ message: 'ID de service invalide' });
      return;
    }
    if (useNeon()) {
      const service = await neonServices.neonGetServiceById(id);
      if (!service) { res.status(404).json({ message: 'Service non trouvé' }); return; }
      res.status(200).json(service);
      return;
    }
    const service: IService | null = await Service.findById(id);
    if (!service) {
      res.status(404).json({ message: 'Service non trouvé' });
      return;
    }
    res.status(200).json(service);
  } catch (error) {
    console.error('Erreur getServiceById:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du service' });
  }
};

export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { logo, images } = await getLogoAndImages(req);
    const body = normalizeBody({ ...req.body } as Record<string, unknown>);
    delete body._id;
    delete body.createdAt;
    delete body.updatedAt;
    body.logo = logo;
    body.images = images.length ? images : (Array.isArray(req.body?.images) ? req.body.images : []);

    if (useNeon()) {
      const saved = await neonServices.neonCreateService(body);
      if (!saved) { res.status(500).json({ message: 'Erreur création' }); return; }
      res.status(201).json(saved);
      return;
    }
    const service = new Service({ ...body, ...(logo !== undefined && { logo }), images: body.images as string[] });
    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    console.error('Erreur createService:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: 'Données de service invalides', errors: error.errors });
      return;
    }
    res.status(500).json({ message: 'Erreur lors de la création du service' });
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id || !isValidId(id)) {
      res.status(400).json({ message: 'ID de service invalide' });
      return;
    }
    const { logo, images } = await getLogoAndImages(req);
    const updateData: Record<string, unknown> = normalizeBody({ ...req.body } as Record<string, unknown>);
    delete updateData._id;
    delete updateData.createdAt;
    if (logo !== undefined) updateData.logo = logo;
    if (images.length > 0) updateData.images = images;

    if (useNeon()) {
      const updated = await neonServices.neonUpdateService(id, updateData);
      if (!updated) { res.status(404).json({ message: 'Service non trouvé' }); return; }
      res.status(200).json(updated);
      return;
    }
    const service = await Service.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!service) {
      res.status(404).json({ message: 'Service non trouvé' });
      return;
    }
    res.status(200).json(service);
  } catch (error) {
    console.error('Erreur updateService:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: 'Données de service invalides', errors: error.errors });
      return;
    }
    res.status(500).json({ message: 'Erreur lors de la mise à jour du service' });
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id || !isValidId(id)) {
      res.status(400).json({ message: 'ID de service invalide' });
      return;
    }
    if (useNeon()) {
      const deleted = await neonServices.neonDeleteService(id);
      if (!deleted) { res.status(404).json({ message: 'Service non trouvé' }); return; }
      res.status(200).json({ message: 'Service supprimé avec succès' });
      return;
    }
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      res.status(404).json({ message: 'Service non trouvé' });
      return;
    }
    res.status(200).json({ message: 'Service supprimé avec succès' });
  } catch (error) {
    console.error('Erreur deleteService:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du service' });
  }
};
