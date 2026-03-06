import { apiClient, useApi, invalidateDataCache } from './apiClient';

const devLog = (...args: unknown[]) => { if (import.meta.env.DEV) console.log(...args); };

/** Envoie un fichier vers l’API (R2) et retourne l’URL, ou null. */
async function uploadFileToApi(file: File | string | undefined, folder: string, name: string): Promise<string | null> {
  if (!file) return null;
  if (typeof file === 'string') return file || null;
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const base64 = (r.result as string)?.split(',')[1] || (r.result as string);
      if (!base64) { resolve(null); return; }
      apiClient.upload.upload(base64, folder, file.name, file.type)
        .then(({ url }) => resolve(url))
        .catch((err) => {
          const msg = err?.message || String(err);
          if (msg.includes('R2_NOT_CONFIGURED') || msg.includes('R2 non configuré') || msg.includes('R2_') || msg.includes('503')) {
            resolve(null);
          } else {
            reject(err);
          }
        });
    };
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

export const adminService = {
  // BOUTIQUES
  async getBoutiques() {
    try {
      return apiClient.boutiques.list();
    } catch (error) {
      console.error('Erreur lors de la récupération des boutiques:', error);
      throw error;
    }
  },

  async createBoutique(boutique: any) {
    try {
      if (useApi()) {
        if (!boutique.nom?.trim()) throw new Error('Le nom de la boutique est obligatoire');
        if (!boutique.description?.trim()) throw new Error('La description est obligatoire');
        const [logo_url, image_url, logo_carousel_url] = await Promise.all([
          uploadFileToApi(boutique.logo, 'boutiques', boutique.logo?.name || 'logo'),
          uploadFileToApi(boutique.image, 'boutiques', boutique.image?.name || 'image'),
          uploadFileToApi(boutique.image2, 'boutiques', boutique.image2?.name || 'cover2').then((u) => u ?? (typeof boutique.logoCarousel === 'string' ? boutique.logoCarousel : undefined)),
        ]);
        const out = await apiClient.boutiques.create({
          nom: boutique.nom.trim(),
          description: boutique.description.trim(),
          horaires: boutique.horaires || '',
          heureOuverture: boutique.heureOuverture || '09:00',
          heureFermeture: boutique.heureFermeture || '18:00',
          openSunday: !!boutique.openSunday,
          statut: boutique.statut || 'actif',
          universe: boutique.universe || 'Général',
          telephone: boutique.telephone || undefined,
          email: boutique.email || undefined,
          instagram: boutique.instagram || undefined,
          facebook: boutique.facebook || undefined,
          tiktok: boutique.tiktok || undefined,
          website: boutique.website || undefined,
          logo_url: logo_url || undefined,
          image_url: image_url || undefined,
          logoCarousel: logo_carousel_url || undefined,
        });
        invalidateDataCache('boutiques');
        return out;
      }
      throw new Error('Seule l’API Node est supportée.');
    } catch (error: any) {
      console.error('❌ Erreur lors de la création de la boutique:', error);
      const isNetworkError = error?.status === 0 || error?.message?.includes('fetch') || error?.message?.includes('Failed to fetch') || (error?.message && /ERR_HTTP2|network|injoignable/i.test(error.message));
      if (isNetworkError) {
        const onRender = typeof window !== 'undefined' && /\.onrender\.com$/i.test(window.location.hostname);
        throw new Error(onRender
          ? 'API injoignable ou erreur réseau. Réessayez dans 1 minute. Si le problème persiste, vérifiez que le service API est bien actif sur Render.'
          : 'API injoignable. Vérifiez que l’API tourne (npm run api) et que R2 est configuré si vous uploadez des images.');
      }
      throw error;
    }
  },

  async updateBoutique(id: string, boutique: any) {
    try {
      devLog('Update boutique', id, boutique);

      if (!boutique.nom || boutique.nom.trim() === '') {
        throw new Error('Le nom de la boutique est obligatoire');
      }
      if (!boutique.description || boutique.description.trim() === '') {
        throw new Error('La description est obligatoire');
      }

      if (useApi()) {
        const [logo_url, image_url, logo_carousel_url] = await Promise.all([
          uploadFileToApi(boutique.logo, 'boutiques', boutique.logo?.name || 'logo').then((u) => u ?? (typeof boutique.logo_url === 'string' ? boutique.logo_url : undefined) ?? (typeof boutique.logo === 'string' ? boutique.logo : undefined)),
          uploadFileToApi(boutique.image, 'boutiques', boutique.image?.name || 'image').then((u) => u ?? (typeof boutique.image_url === 'string' ? boutique.image_url : undefined) ?? (typeof boutique.image === 'string' ? boutique.image : undefined)),
          uploadFileToApi(boutique.image2, 'boutiques', boutique.image2?.name || 'cover2').then((u) => u ?? (typeof boutique.logoCarousel === 'string' ? boutique.logoCarousel : undefined)),
        ]);
        const out = await apiClient.boutiques.update(id, {
          nom: boutique.nom.trim(),
          description: boutique.description.trim(),
          horaires: boutique.horaires || '',
          heureOuverture: boutique.heureOuverture || '09:00',
          heureFermeture: boutique.heureFermeture || '18:00',
          openSunday: !!boutique.openSunday,
          statut: boutique.statut || 'actif',
          universe: boutique.universe || 'Général',
          telephone: boutique.telephone || undefined,
          email: boutique.email || undefined,
          instagram: boutique.instagram || undefined,
          facebook: boutique.facebook || undefined,
          tiktok: boutique.tiktok || undefined,
          website: boutique.website || undefined,
          logo_url: logo_url || undefined,
          image_url: image_url || undefined,
          logoCarousel: logo_carousel_url || undefined,
        });
        invalidateDataCache('boutiques');
        return out;
      }
      throw new Error('Seule l’API Node est supportée.');
    } catch (error: any) {
      console.error('❌ Erreur lors de la mise à jour de la boutique:', error);
      throw error;
    }
  },

  async deleteBoutique(id: string) {
    try {
      await apiClient.boutiques.delete(id);
      invalidateDataCache('boutiques');
    } catch (error) {
      console.error('Erreur lors de la suppression de la boutique:', error);
      throw error;
    }
  },

  // RESTAURANTS
  async getRestaurants() {
    try {
      return apiClient.restaurants.list();
    } catch (error) {
      console.error('Erreur lors de la récupération des restaurants:', error);
      throw error;
    }
  },

  async createRestaurant(restaurant: any) {
    try {
      if (useApi()) {
        if (!restaurant.nom?.trim()) throw new Error('Le nom est obligatoire');
        const [logo_url, image_url, logo_carousel_url] = await Promise.all([
          uploadFileToApi(restaurant.logo, 'restaurants', restaurant.logo?.name || 'logo'),
          uploadFileToApi(restaurant.image, 'restaurants', restaurant.image?.name || 'image'),
          uploadFileToApi(restaurant.image2, 'restaurants', restaurant.image2?.name || 'cover2').then((u) => u ?? (typeof restaurant.logoCarousel === 'string' ? restaurant.logoCarousel : undefined)),
        ]);
        const out = await apiClient.restaurants.create({
          nom: restaurant.nom.trim(),
          description: restaurant.description || '',
          cuisine: restaurant.cuisine || '',
          horaires: restaurant.horaires || '',
          heureOuverture: restaurant.heureOuverture || '09:00',
          heureFermeture: restaurant.heureFermeture || '18:00',
          openSunday: !!restaurant.openSunday,
          statut: restaurant.statut || 'actif',
          universe: restaurant.universe || 'Général',
          telephone: restaurant.telephone,
          email: restaurant.email,
          instagram: restaurant.instagram,
          facebook: restaurant.facebook,
          tiktok: restaurant.tiktok,
          website: restaurant.website,
          menu_url: restaurant.menu,
          logo_url: logo_url || undefined,
          image_url: image_url || undefined,
          logoCarousel: logo_carousel_url || undefined,
        });
        invalidateDataCache('restaurants');
        return out;
      }
      throw new Error('Seule l’API Node est supportée.');
    } catch (error: any) {
      console.error('❌ Erreur lors de la création du restaurant:', error);
      throw error;
    }
  },

  async updateRestaurant(id: string, restaurant: any) {
    try {
      if (useApi()) {
        const [logo_url, image_url, logo_carousel_url] = await Promise.all([
          uploadFileToApi(restaurant.logo, 'restaurants', restaurant.logo?.name || 'logo').then((u) => u ?? restaurant.logo),
          uploadFileToApi(restaurant.image, 'restaurants', restaurant.image?.name || 'image').then((u) => u ?? restaurant.image),
          uploadFileToApi(restaurant.image2, 'restaurants', restaurant.image2?.name || 'cover2').then((u) => u ?? (typeof restaurant.logoCarousel === 'string' ? restaurant.logoCarousel : undefined)),
        ]);
        const out = await apiClient.restaurants.update(id, {
          nom: restaurant.nom || '',
          description: restaurant.description || '',
          cuisine: restaurant.cuisine || '',
          horaires: restaurant.horaires || '',
          heureOuverture: restaurant.heureOuverture || '09:00',
          heureFermeture: restaurant.heureFermeture || '18:00',
          openSunday: !!restaurant.openSunday,
          statut: restaurant.statut || 'actif',
          universe: restaurant.universe || 'Général',
          telephone: restaurant.telephone,
          email: restaurant.email,
          instagram: restaurant.instagram,
          facebook: restaurant.facebook,
          tiktok: restaurant.tiktok,
          website: restaurant.website,
          menu_url: restaurant.menu,
          logo_url: logo_url || undefined,
          image_url: image_url || undefined,
          logoCarousel: logo_carousel_url || undefined,
        });
        invalidateDataCache('restaurants');
        return out;
      }
      throw new Error('Seule l’API Node est supportée.');
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du restaurant:', error);
      throw error;
    }
  },

  async deleteRestaurant(id: string) {
    try {
      await apiClient.restaurants.delete(id);
      invalidateDataCache('restaurants');
    } catch (error) {
      console.error('Erreur lors de la suppression du restaurant:', error);
      throw error;
    }
  },

  // LOISIRS
  async getLoisirs() {
    try {
      return apiClient.loisirs.list();
    } catch (error) {
      console.error('Erreur lors de la récupération des loisirs:', error);
      throw error;
    }
  },

  async createLoisir(loisir: any) {
    try {
      if (useApi()) {
        if (!loisir.nom?.trim()) throw new Error('Le nom est obligatoire');
        const [logo_url, image_url, logo_carousel_url] = await Promise.all([
          uploadFileToApi(loisir.logo, 'loisirs', loisir.logo?.name || 'logo'),
          uploadFileToApi(loisir.image, 'loisirs', loisir.image?.name || 'image'),
          uploadFileToApi(loisir.image2, 'loisirs', loisir.image2?.name || 'cover2').then((u) => u ?? (typeof loisir.logoCarousel === 'string' ? loisir.logoCarousel : undefined)),
        ]);
        const out = await apiClient.loisirs.create({
          nom: loisir.nom.trim(),
          description: loisir.description || '',
          type: loisir.type || '',
          level: loisir.level || '',
          horaires: loisir.horaires || '',
          heureOuverture: loisir.heureOuverture || '09:00',
          heureFermeture: loisir.heureFermeture || '18:00',
          openSunday: !!loisir.openSunday,
          statut: loisir.statut || 'actif',
          universe: loisir.universe || 'Général',
          telephone: loisir.telephone,
          email: loisir.email,
          instagram: loisir.instagram,
          facebook: loisir.facebook,
          tiktok: loisir.tiktok,
          website: loisir.website,
          logo_url: logo_url || undefined,
          image_url: image_url || undefined,
          logoCarousel: logo_carousel_url || undefined,
        });
        invalidateDataCache('loisirs');
        return out;
      }
      throw new Error('Seule l’API Node est supportée.');
    } catch (error: any) {
      console.error('Erreur lors de la création du loisir:', error);
      throw error;
    }
  },

  async updateLoisir(id: string, loisir: any) {
    try {
      const [logo_url, image_url, logo_carousel_url] = await Promise.all([
        uploadFileToApi(loisir.logo, 'loisirs', loisir.logo?.name || 'logo').then((u) => u ?? (typeof loisir.logo === 'string' ? loisir.logo : undefined)),
        uploadFileToApi(loisir.image, 'loisirs', loisir.image?.name || 'image').then((u) => u ?? (typeof loisir.image === 'string' ? loisir.image : undefined)),
        uploadFileToApi(loisir.image2, 'loisirs', loisir.image2?.name || 'cover2').then((u) => u ?? (typeof loisir.logoCarousel === 'string' ? loisir.logoCarousel : undefined)),
      ]);
      const out = await apiClient.loisirs.update(id, {
        nom: loisir.nom || '',
        description: loisir.description || '',
        type: loisir.type || '',
        level: loisir.level || '',
        horaires: loisir.horaires || '',
        heureOuverture: loisir.heureOuverture || '09:00',
        heureFermeture: loisir.heureFermeture || '18:00',
        openSunday: !!loisir.openSunday,
        statut: loisir.statut || 'actif',
        universe: loisir.universe || 'Général',
        telephone: loisir.telephone,
        email: loisir.email,
        instagram: loisir.instagram,
        facebook: loisir.facebook,
        tiktok: loisir.tiktok,
        website: loisir.website,
        logo_url: logo_url || undefined,
        image_url: image_url || undefined,
        logoCarousel: logo_carousel_url || undefined,
      });
      invalidateDataCache('loisirs');
      return out;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du loisir:', error);
      throw error;
    }
  },

  async deleteLoisir(id: string) {
    try {
      await apiClient.loisirs.delete(id);
      invalidateDataCache('loisirs');
    } catch (error) {
      console.error('Erreur lors de la suppression du loisir:', error);
      throw error;
    }
  },

  // SERVICES
  async getServices() {
    try {
      return apiClient.services.list();
    } catch (error) {
      console.error('Erreur lors de la récupération des services:', error);
      throw error;
    }
  },

  async createService(service: any) {
    try {
      if (useApi()) {
        if (!service.nom?.trim()) throw new Error('Le nom est obligatoire');
        const [logo_url, image_url] = await Promise.all([
          uploadFileToApi(service.logo, 'services', service.logo?.name || 'logo'),
          service.image && service.image instanceof File && service.image.size > 0
            ? uploadFileToApi(service.image, 'services', service.image.name || 'image')
            : Promise.resolve(undefined),
        ]);
        // Ne jamais mettre le logo dans images : logo = logo, image de couverture = images[0]
        const images: string[] = image_url ? [image_url] : [];
        const out = await apiClient.services.create({
          nom: service.nom.trim(),
          description: service.description || '',
          type: service.type || service.universe || '',
          horaires: service.horaires || '',
          telephone: service.telephone || undefined,
          email: service.email || undefined,
          adresse: service.adresse || undefined,
          logo: logo_url || undefined,
          images: images.length ? images : undefined,
          statut: service.statut || 'actif',
          ouvertLeDimanche: !!service.openSunday,
          reseauxSociaux: {
            instagram: service.instagram || undefined,
            facebook: service.facebook || undefined,
          },
        });
        invalidateDataCache('services');
        return out;
      }
      throw new Error('Seule l’API Node est supportée.');
    } catch (error: any) {
      console.error('Erreur lors de la création du service:', error);
      throw error;
    }
  },

  async updateService(id: string, service: any) {
    try {
      const imageFile = service.image && service.image instanceof File && service.image.size > 0;
      const [logo_url, image_url] = await Promise.all([
        uploadFileToApi(service.logo, 'services', service.logo?.name || 'logo').then((u) => u ?? (typeof service.logo === 'string' ? service.logo : undefined)),
        imageFile ? uploadFileToApi(service.image, 'services', service.image.name || 'image') : Promise.resolve(undefined),
      ]);
      // Logo et image de couverture sont distincts : ne pas mettre le logo dans images
      const existingImages = Array.isArray(service.images) ? service.images.filter((url: string) => url !== service.logo) : [];
      const images: string[] = image_url ? [image_url] : existingImages;
      const out = await apiClient.services.update(id, {
        nom: service.nom || '',
        description: service.description || '',
        type: service.type || service.universe || '',
        horaires: service.horaires || '',
        telephone: service.telephone,
        email: service.email,
        adresse: service.adresse,
        logo: logo_url || undefined,
        images: images.length ? images : undefined,
        statut: service.statut || 'actif',
        ouvertLeDimanche: !!service.openSunday,
        reseauxSociaux: {
          instagram: service.instagram || undefined,
          facebook: service.facebook || undefined,
        },
      });
      invalidateDataCache('services');
      return out;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du service:', error);
      throw error;
    }
  },

  async deleteService(id: string) {
    try {
      await apiClient.services.delete(id);
      invalidateDataCache('services');
    } catch (error) {
      console.error('Erreur lors de la suppression du service:', error);
      throw error;
    }
  },

  // ÉVÉNEMENTS
  async getEvenements() {
    try {
      return apiClient.evenements.list();
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      throw error;
    }
  },

  async createEvenement(evenement: any) {
    try {
      if (useApi()) {
        if (!evenement.titre?.trim()) throw new Error('Le titre est obligatoire');
        if (!evenement.description?.trim()) throw new Error('La description est obligatoire');
        if (!evenement.lieu?.trim()) throw new Error('Le lieu est obligatoire');
        const [affiche_url, image_url, galerie1_url, galerie2_url, galerie3_url] = await Promise.all([
          uploadFileToApi(evenement.affiche, 'evenements', evenement.affiche?.name || 'affiche'),
          uploadFileToApi(evenement.image ?? evenement.affiche, 'evenements', 'image'),
          uploadFileToApi(evenement.galerie1, 'evenements', 'galerie1'),
          uploadFileToApi(evenement.galerie2, 'evenements', 'galerie2'),
          uploadFileToApi(evenement.galerie3, 'evenements', 'galerie3'),
        ]);
        const images = [galerie1_url, galerie2_url, galerie3_url].filter(Boolean) as string[];
        const dateVal = evenement.date ? new Date(evenement.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
        const out = await apiClient.evenements.create({
          titre: evenement.titre.trim(),
          description: evenement.description.trim(),
          date: dateVal,
          heure: evenement.heure || undefined,
          dateFin: evenement.dateFin || undefined,
          heureFin: evenement.heureFin || undefined,
          lieu: evenement.lieu.trim(),
          statut: (evenement.statut === 'annulé' ? 'planifié' : evenement.statut) || 'planifié',
          affiche_url: affiche_url || undefined,
          image_url: image_url || affiche_url || undefined,
          images: images.length > 0 ? images : undefined,
        });
        invalidateDataCache('evenements');
        return out;
      }
      throw new Error('Seule l’API Node est supportée.');
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'événement:', error);
      throw error;
    }
  },

  async updateEvenement(id: string, evenement: any) {
    try {
      if (useApi()) {
        if (!evenement.titre?.trim()) throw new Error('Le titre est obligatoire');
        const [affiche_url, image_url, galerie1_url, galerie2_url, galerie3_url] = await Promise.all([
          uploadFileToApi(evenement.affiche, 'evenements', evenement.affiche?.name || 'affiche').then((u) => u ?? (typeof evenement.affiche === 'string' ? evenement.affiche : undefined)),
          uploadFileToApi(evenement.image, 'evenements', 'image').then((u) => u ?? (typeof evenement.image === 'string' ? evenement.image : undefined)),
          uploadFileToApi(evenement.galerie1, 'evenements', 'galerie1'),
          uploadFileToApi(evenement.galerie2, 'evenements', 'galerie2'),
          uploadFileToApi(evenement.galerie3, 'evenements', 'galerie3'),
        ]);
        const existing = Array.isArray(evenement.images) ? evenement.images : [];
        const newUrls = [galerie1_url, galerie2_url, galerie3_url];
        const images = [
          newUrls[0] ?? existing[0],
          newUrls[1] ?? existing[1],
          newUrls[2] ?? existing[2],
        ].filter(Boolean) as string[];
        const dateVal = evenement.date ? new Date(evenement.date).toISOString().slice(0, 10) : undefined;
        const out = await apiClient.evenements.update(id, {
          titre: evenement.titre.trim(),
          description: evenement.description?.trim() ?? '',
          date: dateVal,
          heure: evenement.heure,
          dateFin: evenement.dateFin ?? null,
          heureFin: evenement.heureFin ?? null,
          lieu: evenement.lieu?.trim() ?? '',
          statut: (evenement.statut === 'annulé' ? 'planifié' : evenement.statut) || 'planifié',
          affiche_url: affiche_url ?? undefined,
          image_url: image_url ?? undefined,
          images: images.length > 0 ? images : undefined,
        });
        invalidateDataCache('evenements');
        return out;
      }
      throw new Error('Seule l’API Node est supportée.');
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de l\'événement:', error);
      throw error;
    }
  },

  async deleteEvenement(id: string) {
    try {
      await apiClient.evenements.delete(id);
      invalidateDataCache('evenements');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
      throw error;
    }
  }
};
