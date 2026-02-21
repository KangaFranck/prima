import { Boutique } from '../types/admin';
import { pb, getFileUrl } from './pbClient';
import { apiClient, useApi } from './apiClient';

/** Service public unifié sur PocketBase (plus d’appel à l’API MongoDB). */
export const publicService = {
  async getBoutiques(): Promise<Boutique[]> {
    try {
      if (useApi()) return apiClient.boutiques.list();
      const records = await pb.collection('boutiques').getFullList();
      return records.map((record: any) => ({
        id: record.id,
        nom: record.nom,
        description: record.description ?? record.description_,
        logo: record.logo ? getFileUrl(record, record.logo) : undefined,
        image: record.image ? getFileUrl(record, record.image) : undefined,
        horaires: record.horaires,
        heureOuverture: record.heureOuverture,
        heureFermeture: record.heureFermeture,
        openSunday: record.openSunday,
        statut: record.statut,
        universe: record.universe,
        telephone: record.telephone,
        email: record.email,
        instagram: record.instagram,
        facebook: record.facebook,
        tiktok: record.tiktok,
        logoCarousel: record.logoCarousel ? getFileUrl(record, record.logoCarousel) : undefined,
        website: record.website,
        createdAt: record.created,
        updatedAt: record.updated,
      })) as Boutique[];
    } catch (error) {
      if (import.meta.env.DEV) console.error('Erreur lors de la récupération des boutiques:', error);
      throw error;
    }
  },

  async createBoutique(boutique: Boutique): Promise<Boutique> {
    const { adminService } = await import('./pbAdminService');
    return adminService.createBoutique(boutique as any) as Promise<Boutique>;
  },
};

