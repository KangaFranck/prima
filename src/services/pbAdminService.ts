import { pb, getFileUrl } from './pbClient';
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

function toTimeStr(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'string') {
    const s = v.trim();
    const mT = s.match(/T(\d{1,2}):(\d{2})/);
    if (mT) return `${mT[1].padStart(2, '0')}:${mT[2]}`;
    const mSpace = s.match(/\s(\d{1,2}):(\d{2})/);
    if (mSpace) return `${mSpace[1].padStart(2, '0')}:${mSpace[2]}`;
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(s)) return s.slice(0, 5);
    return '';
  }
  if (v instanceof Date && !isNaN(v.getTime())) {
    const h = v.getHours();
    const m = v.getMinutes();
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
  return '';
}

/** Convertit une heure "HH:MM", "HH:MM:SS" ou ISO (ex. 2000-01-01T10:30:00) en ISO pour la BDD. Sans "Z" pour affichage correct dans PocketBase. */
function toTimeISO(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  if (!s) return null;
  let h: string, m: string;
  const matchShort = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (matchShort) {
    h = matchShort[1].padStart(2, '0');
    m = matchShort[2];
  } else {
    const matchISO = s.match(/T(\d{1,2}):(\d{2})/);
    if (matchISO) {
      h = matchISO[1].padStart(2, '0');
      m = matchISO[2];
    } else return null;
  }
  if (import.meta.env.DEV) devLog('toTimeISO entrée:', s, '→ sortie:', `2000-01-01T${h}:${m}:00.000`);
  return `2000-01-01T${h}:${m}:00.000`;
}

function str(v: any): string {
  if (v == null || v === undefined) return '';
  const s = String(v).trim();
  return s;
}

function mapBoutiqueRecord(record: any) {
  return {
    id: record.id,
    nom: record.nom ?? '',
    description: record.description ?? record.description_ ?? '',
    logo: record.logo ? getFileUrl(record, record.logo) : undefined,
    image: record.image ? getFileUrl(record, record.image) : undefined,
    logoCarousel: record.logoCarousel ? getFileUrl(record, record.logoCarousel) : undefined,
    website: str(record?.website ?? record?.site_web),
    horaires: record.horaires ?? '',
    heureOuverture: toTimeStr(record.heureOuverture) || '',
    heureFermeture: toTimeStr(record.heureFermeture) || '',
    openSunday: !!record.openSunday,
    statut: record.statut ?? 'actif',
    universe: record.universe ?? 'Général',
    telephone: str(record?.telephone),
    email: str(record?.mail ?? record?.email ?? record?.Email),
    instagram: str(record?.instagram ?? record?.instagram_url ?? record?.instagramUrl ?? record?.Instagram ?? record?.instagramLink ?? record?.lien_instagram),
    facebook: str(record?.facebook ?? record?.Facebook),
    tiktok: str(record?.tiktok ?? record?.tiktok_url ?? record?.tiktokUrl ?? record?.TikTok ?? record?.tiktokLink ?? record?.lien_tiktok),
    createdAt: record.created,
    updatedAt: record.updated
  };
}

function mapRestaurantRecord(record: any) {
  return {
    id: record.id,
    nom: record.nom ?? '',
    description: record.description ?? record.description_ ?? '',
    logo: record.logo ? getFileUrl(record, record.logo) : undefined,
    image: record.image ? getFileUrl(record, record.image) : undefined,
    logoCarousel: record.logoCarousel ? getFileUrl(record, record.logoCarousel) : undefined,
    website: str(record?.website ?? record?.site_web),
    horaires: record.horaires ?? '',
    heureOuverture: toTimeStr(record.heureOuverture) || '',
    heureFermeture: toTimeStr(record.heureFermeture) || '',
    openSunday: !!record.openSunday,
    statut: record.statut ?? 'actif',
    universe: record.universe ?? 'Général',
    telephone: str(record?.telephone),
    email: str(record?.mail ?? record?.email ?? record?.Email),
    instagram: str(record?.instagram ?? record?.instagram_url ?? record?.instagramUrl ?? record?.Instagram ?? record?.instagramLink ?? record?.lien_instagram),
    facebook: str(record?.facebook ?? record?.Facebook),
    tiktok: str(record?.tiktok ?? record?.tiktok_url ?? record?.tiktokUrl ?? record?.TikTok ?? record?.tiktokLink ?? record?.lien_tiktok),
    createdAt: record.created,
    updatedAt: record.updated
  };
}

function mapLoisirRecord(record: any) {
  return {
    id: record.id,
    nom: record.nom ?? '',
    description: record.description ?? '',
    logo: record.logo ? getFileUrl(record, record.logo) : undefined,
    image: record.image ? getFileUrl(record, record.image) : undefined,
    logoCarousel: record.logoCarousel ? getFileUrl(record, record.logoCarousel) : undefined,
    website: str(record?.website ?? record?.site_web),
    horaires: record.horaires ?? '',
    heureOuverture: toTimeStr(record.heureOuverture) || '',
    heureFermeture: toTimeStr(record.heureFermeture) || '',
    openSunday: !!record.openSunday,
    statut: record.statut ?? 'actif',
    universe: record.universe ?? 'Général',
    telephone: str(record?.telephone),
    email: str(record?.mail ?? record?.email ?? record?.Email),
    instagram: str(record?.instagram ?? record?.instagram_url ?? record?.instagramUrl ?? record?.Instagram ?? record?.instagramLink ?? record?.lien_instagram),
    facebook: str(record?.facebook ?? record?.Facebook),
    tiktok: str(record?.tiktok ?? record?.tiktok_url ?? record?.tiktokUrl ?? record?.TikTok ?? record?.tiktokLink ?? record?.lien_tiktok),
    createdAt: record.created,
    updatedAt: record.updated
  };
}

export const adminService = {
  // BOUTIQUES
  async getBoutiques() {
    try {
      if (useApi()) return apiClient.boutiques.list();
      const records = await pb.collection('boutiques').getFullList();
      return records.map(mapBoutiqueRecord);
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
        const logo_url = await uploadFileToApi(boutique.logo, 'boutiques', boutique.logo?.name || 'logo');
        const image_url = await uploadFileToApi(boutique.image, 'boutiques', boutique.image?.name || 'image');
        const logo_carousel_url = await uploadFileToApi(boutique.logoCarousel, 'boutiques', boutique.logoCarousel?.name || 'carousel');
        return apiClient.boutiques.create({
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
      }

      devLog('=== CRÉATION BOUTIQUE ===', boutique);
      if (!boutique.nom || boutique.nom.trim() === '') {
        throw new Error('Le nom de la boutique est obligatoire');
      }
      if (!boutique.description || boutique.description.trim() === '') {
        throw new Error('La description est obligatoire');
      }
      const formData = new FormData();
      
      // Champs obligatoires pour boutiques
      formData.append('nom', boutique.nom.trim());
      formData.append('description_', boutique.description.trim());
      formData.append('horaires', boutique.horaires || '');
      formData.append('openSunday', boutique.openSunday ? 'true' : 'false');
      formData.append('statut', boutique.statut || 'actif');
      formData.append('universe', boutique.universe || 'Général');
      
      const sentHeureOuv = toTimeISO(boutique.heureOuverture) ?? '2000-01-01T09:00:00.000';
      const sentHeureFerm = toTimeISO(boutique.heureFermeture) ?? '2000-01-01T18:00:00.000';
      formData.append('heureOuverture', sentHeureOuv);
      formData.append('heureFermeture', sentHeureFerm);
      devLog('createBoutique heures envoyées:', { reçu: { heureOuverture: boutique.heureOuverture, heureFermeture: boutique.heureFermeture }, envoyé: { heureOuverture: sentHeureOuv, heureFermeture: sentHeureFerm } });

      // Champs optionnels - seulement si remplis
      if (boutique.telephone) formData.append('telephone', boutique.telephone);
      if (boutique.email) formData.append('mail', boutique.email);
      if (boutique.instagram && String(boutique.instagram).trim()) { const v = String(boutique.instagram).trim(); formData.append('instagram', v); formData.append('instagram_url', v); formData.append('Instagram', v); }
      if (boutique.facebook) formData.append('facebook', boutique.facebook);
      if (boutique.tiktok && String(boutique.tiktok).trim()) { const v = String(boutique.tiktok).trim(); formData.append('tiktok', v); formData.append('tiktok_url', v); formData.append('TikTok', v); }
      if (boutique.website != null && String(boutique.website).trim()) formData.append('website', String(boutique.website).trim());
      if (boutique.logoCarousel && boutique.logoCarousel instanceof File) formData.append('logoCarousel', boutique.logoCarousel);

      // Fichiers - seulement si présents
      if (boutique.logo && boutique.logo instanceof File) {
        formData.append('logo', boutique.logo);
      }
      if (boutique.image && boutique.image instanceof File) {
        formData.append('image', boutique.image);
      }

      devLog('FormData entries:', Object.fromEntries([...formData.entries()].map(([k, v]) => [k, v instanceof File ? `[File ${v.name}]` : v])));
      const record = await pb.collection('boutiques').create(formData, { requestKey: null });
      devLog('Boutique créée:', record?.id);
      return record ? mapBoutiqueRecord(record) : record;
    } catch (error: any) {
      // #region agent log
      const errPayload = {
        location: 'pbAdminService.ts:createBoutique catch',
        message: 'createBoutique error',
        data: {
          errorName: error?.constructor?.name,
          errorMessage: error?.message,
          status: error?.status,
          cause: (error as { cause?: { message?: string } })?.cause?.message,
          hostname: typeof window !== 'undefined' ? window.location.hostname : '',
        },
        timestamp: Date.now(),
        hypothesisId: 'network-or-coldstart',
      };
      console.error('createBoutique error payload', errPayload);
      fetch('http://127.0.0.1:7242/ingest/1e8956d4-3852-4ddb-880e-25dd6e28173d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(errPayload) }).catch(() => {});
      // #endregion
      console.error('❌ Erreur lors de la création de la boutique:', error);
      console.error('Code d\'erreur:', error?.status);
      console.error('Détails complets PocketBase (error.data):', JSON.stringify(error?.data ?? {}, null, 2));
      const isNetworkError = error?.status === 0 || error?.message?.includes('fetch') || error?.message?.includes('Failed to fetch') || (error?.message && /ERR_HTTP2|network|injoignable/i.test(error.message));
      if (isNetworkError) {
        const onRender = typeof window !== 'undefined' && /\.onrender\.com$/i.test(window.location.hostname);
        const apiMsg = useApi()
          ? (onRender
            ? 'API injoignable ou erreur réseau. Sur un hébergement gratuit, le serveur peut s’endormir après inactivité et mettre jusqu’à 1 minute à répondre. Réessayez dans 1 minute (un seul clic sur Créer).'
            : 'API injoignable ou erreur réseau. Vérifiez que l’API tourne (npm run api) et que R2 est configuré si vous uploadez des images.')
          : 'PocketBase est injoignable. Lancez-le avec : npm run pb:serve (dans un autre terminal).';
        throw new Error(apiMsg);
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
        const logo_url = await uploadFileToApi(boutique.logo, 'boutiques', boutique.logo?.name || 'logo') ?? (typeof boutique.logo_url === 'string' ? boutique.logo_url : undefined) ?? (typeof boutique.logo === 'string' ? boutique.logo : undefined);
        const image_url = await uploadFileToApi(boutique.image, 'boutiques', boutique.image?.name || 'image') ?? (typeof boutique.image_url === 'string' ? boutique.image_url : undefined) ?? (typeof boutique.image === 'string' ? boutique.image : undefined);
        const logo_carousel_url = await uploadFileToApi(boutique.logoCarousel, 'boutiques', boutique.logoCarousel?.name || 'carousel') ?? (typeof boutique.logoCarousel === 'string' ? boutique.logoCarousel : undefined) ?? (typeof boutique.logo_carousel_url === 'string' ? boutique.logo_carousel_url : undefined);
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
      }

      const formData = new FormData();
      
      // Champs obligatoires pour boutiques
      formData.append('nom', boutique.nom.trim());
      formData.append('description_', boutique.description.trim());
      formData.append('horaires', boutique.horaires || '');
      formData.append('openSunday', boutique.openSunday ? 'true' : 'false');
      formData.append('statut', boutique.statut || 'actif');
      formData.append('universe', boutique.universe || 'Général');
      
      const sentHeureOuv = toTimeISO(boutique.heureOuverture) ?? '2000-01-01T09:00:00.000';
      const sentHeureFerm = toTimeISO(boutique.heureFermeture) ?? '2000-01-01T18:00:00.000';
      formData.append('heureOuverture', sentHeureOuv);
      formData.append('heureFermeture', sentHeureFerm);
      devLog('updateBoutique heures envoyées:', { reçu: { heureOuverture: boutique.heureOuverture, heureFermeture: boutique.heureFermeture }, envoyé: { heureOuverture: sentHeureOuv, heureFermeture: sentHeureFerm } });

      // Champs optionnels - seulement si remplis
      if (boutique.telephone) formData.append('telephone', boutique.telephone);
      if (boutique.email) formData.append('mail', boutique.email);
      if (boutique.instagram && String(boutique.instagram).trim()) { const v = String(boutique.instagram).trim(); formData.append('instagram', v); formData.append('instagram_url', v); formData.append('Instagram', v); }
      if (boutique.facebook) formData.append('facebook', boutique.facebook);
      if (boutique.tiktok && String(boutique.tiktok).trim()) { const v = String(boutique.tiktok).trim(); formData.append('tiktok', v); formData.append('tiktok_url', v); formData.append('TikTok', v); }
      if (boutique.website != null && String(boutique.website).trim()) formData.append('website', String(boutique.website).trim());
      if (boutique.logoCarousel && boutique.logoCarousel instanceof File) formData.append('logoCarousel', boutique.logoCarousel);

      // Fichiers - seulement si présents
      if (boutique.logo && boutique.logo instanceof File) {
        formData.append('logo', boutique.logo);
      }
      if (boutique.image && boutique.image instanceof File) {
        formData.append('image', boutique.image);
      }

      const record = await pb.collection('boutiques').update(id, formData, { requestKey: null });
      devLog('Boutique mise à jour:', record?.id);
      return record ? mapBoutiqueRecord(record) : record;
    } catch (error: any) {
      console.error('❌ Erreur lors de la mise à jour de la boutique:', error);
      console.error('Type d\'erreur:', error.constructor.name);
      console.error('Message d\'erreur:', error.message);
      console.error('Code d\'erreur:', error.status);
      console.error('Détails de l\'erreur:', error.data);
      throw error;
    }
  },

  async deleteBoutique(id: string) {
    try {
      if (useApi()) {
        await apiClient.boutiques.delete(id);
        invalidateDataCache('boutiques');
        return;
      }
      await pb.collection('boutiques').delete(id);
    } catch (error) {
      console.error('Erreur lors de la suppression de la boutique:', error);
      throw error;
    }
  },

  // RESTAURANTS
  async getRestaurants() {
    try {
      if (useApi()) return apiClient.restaurants.list();
      const records = await pb.collection('restaurants').getFullList();
      return records.map(mapRestaurantRecord);
    } catch (error) {
      console.error('Erreur lors de la récupération des restaurants:', error);
      throw error;
    }
  },

  async createRestaurant(restaurant: any) {
    try {
      if (useApi()) {
        if (!restaurant.nom?.trim()) throw new Error('Le nom est obligatoire');
        const logo_url = await uploadFileToApi(restaurant.logo, 'restaurants', restaurant.logo?.name || 'logo');
        const image_url = await uploadFileToApi(restaurant.image, 'restaurants', restaurant.image?.name || 'image');
        const logo_carousel_url = await uploadFileToApi(restaurant.logoCarousel, 'restaurants', restaurant.logoCarousel?.name || 'carousel');
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
      console.log('=== CRÉATION RESTAURANT - CORRECTION COMPLÈTE ===');
      console.log('Données reçues:', restaurant);
      console.log('Utilisateur connecté:', pb.authStore.model);
      console.log('Token:', pb.authStore.token);
      const formData = new FormData();

      // Champs obligatoires (la collection restaurants utilise "description" et "staut" (typo dans PocketBase))
      formData.append('nom', restaurant.nom || '');
      formData.append('description', restaurant.description || '');
      formData.append('horaires', restaurant.horaires || '');
      formData.append('statut', restaurant.statut || 'actif');
      formData.append('staut', restaurant.statut || 'actif');
      formData.append('openSunday', restaurant.openSunday ? 'true' : 'false');

      formData.append('heureOuverture', toTimeISO(restaurant.heureOuverture) ?? '2000-01-01T09:00:00.000');
      formData.append('heureFermeture', toTimeISO(restaurant.heureFermeture) ?? '2000-01-01T18:00:00.000');

      // Champs optionnels
      formData.append('universe', restaurant.universe || 'Général');
      if (restaurant.telephone) formData.append('telephone', restaurant.telephone);
      if (restaurant.email) formData.append('mail', restaurant.email);
      if (restaurant.instagram && String(restaurant.instagram).trim()) { const v = String(restaurant.instagram).trim(); formData.append('instagram', v); formData.append('instagram_url', v); formData.append('Instagram', v); }
      if (restaurant.facebook) formData.append('facebook', restaurant.facebook);
      if (restaurant.tiktok && String(restaurant.tiktok).trim()) { const v = String(restaurant.tiktok).trim(); formData.append('tiktok', v); formData.append('tiktok_url', v); formData.append('TikTok', v); }
      if (restaurant.website != null && String(restaurant.website).trim()) formData.append('website', String(restaurant.website).trim());
      if (restaurant.logoCarousel && restaurant.logoCarousel instanceof File) formData.append('logoCarousel', restaurant.logoCarousel);

      // Fichiers - seulement si présents
      if (restaurant.logo && restaurant.logo instanceof File) {
        formData.append('logo', restaurant.logo);
      }
      if (restaurant.image && restaurant.image instanceof File) {
        formData.append('image', restaurant.image);
      }

      console.log('FormData envoyé (avec toutes les corrections):');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const record = await pb.collection('restaurants').create(formData, { requestKey: null });
      console.log(' Restaurant créé avec succès:', record);
      return record ? mapRestaurantRecord(record) : record;
    } catch (error: any) {
      console.error('❌ Erreur lors de la création du restaurant:', error?.status);
      console.error('Détails complets PocketBase (error.data):', JSON.stringify(error?.data ?? {}, null, 2));
      throw error;
    }
  },

  async updateRestaurant(id: string, restaurant: any) {
    try {
      if (useApi()) {
        const logo_url = await uploadFileToApi(restaurant.logo, 'restaurants', restaurant.logo?.name || 'logo') ?? restaurant.logo;
        const image_url = await uploadFileToApi(restaurant.image, 'restaurants', restaurant.image?.name || 'image') ?? restaurant.image;
        const logoCarousel = await uploadFileToApi(restaurant.logoCarousel, 'restaurants', restaurant.logoCarousel?.name || 'carousel') ?? restaurant.logoCarousel;
        return apiClient.restaurants.update(id, {
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
          logoCarousel: logoCarousel || undefined,
        });
      }
      const formData = new FormData();

      formData.append('nom', restaurant.nom || '');
      formData.append('description', restaurant.description || '');
      formData.append('horaires', restaurant.horaires || '');
      formData.append('statut', restaurant.statut || 'actif');
      formData.append('staut', restaurant.statut || 'actif');
      formData.append('openSunday', restaurant.openSunday ? 'true' : 'false');

      formData.append('heureOuverture', toTimeISO(restaurant.heureOuverture) ?? '2000-01-01T09:00:00.000');
      formData.append('heureFermeture', toTimeISO(restaurant.heureFermeture) ?? '2000-01-01T18:00:00.000');

      formData.append('universe', restaurant.universe || 'Général');
      if (restaurant.telephone) formData.append('telephone', restaurant.telephone);
      if (restaurant.email) formData.append('mail', restaurant.email);
      if (restaurant.instagram && String(restaurant.instagram).trim()) { const v = String(restaurant.instagram).trim(); formData.append('instagram', v); formData.append('instagram_url', v); formData.append('Instagram', v); }
      if (restaurant.facebook) formData.append('facebook', restaurant.facebook);
      if (restaurant.tiktok && String(restaurant.tiktok).trim()) { const v = String(restaurant.tiktok).trim(); formData.append('tiktok', v); formData.append('tiktok_url', v); formData.append('TikTok', v); }
      if (restaurant.website != null && String(restaurant.website).trim()) formData.append('website', String(restaurant.website).trim());
      if (restaurant.logoCarousel && restaurant.logoCarousel instanceof File) formData.append('logoCarousel', restaurant.logoCarousel);

      if (restaurant.logo && restaurant.logo instanceof File) {
        formData.append('logo', restaurant.logo);
      }
      if (restaurant.image && restaurant.image instanceof File) {
        formData.append('image', restaurant.image);
      }

      const record = await pb.collection('restaurants').update(id, formData, { requestKey: null });
      return record ? mapRestaurantRecord(record) : record;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du restaurant:', error);
      console.error('Détails validation (error.data):', error?.data);
      throw error;
    }
  },

  async deleteRestaurant(id: string) {
    try {
      if (useApi()) {
        await apiClient.restaurants.delete(id);
        invalidateDataCache('restaurants');
        return;
      }
      await pb.collection('restaurants').delete(id);
    } catch (error) {
      console.error('Erreur lors de la suppression du restaurant:', error);
      throw error;
    }
  },

  // LOISIRS
  async getLoisirs() {
    try {
      if (useApi()) return apiClient.loisirs.list();
      const records = await pb.collection('loisirs').getFullList();
      return records.map(mapLoisirRecord);
    } catch (error) {
      console.error('Erreur lors de la récupération des loisirs:', error);
      throw error;
    }
  },

  async createLoisir(loisir: any) {
    try {
      if (useApi()) {
        if (!loisir.nom?.trim()) throw new Error('Le nom est obligatoire');
        const logo_url = await uploadFileToApi(loisir.logo, 'loisirs', loisir.logo?.name || 'logo');
        const image_url = await uploadFileToApi(loisir.image, 'loisirs', loisir.image?.name || 'image');
        const logo_carousel_url = await uploadFileToApi(loisir.logoCarousel, 'loisirs', loisir.logoCarousel?.name || 'carousel');
        return apiClient.loisirs.create({
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
      }
      console.log('=== CRÉATION LOISIR ===');
      console.log('Données reçues:', loisir);
      const formData = new FormData();
      
      // Champs obligatoires pour loisirs
      formData.append('nom', loisir.nom || '');
      formData.append('description', loisir.description || '');
      formData.append('horaires', loisir.horaires || '');
      formData.append('opensonday', loisir.openSunday ? 'true' : 'false');
      formData.append('statut', loisir.statut || 'actif');
      formData.append('universe', loisir.universe || 'Général');
      
      formData.append('heureOuverture', toTimeISO(loisir.heureOuverture) ?? '2000-01-01T09:00:00.000');
      formData.append('heureFermeture', toTimeISO(loisir.heureFermeture) ?? '2000-01-01T18:00:00.000');

      // Champs optionnels - seulement si remplis
      if (loisir.telephone) formData.append('telephone', loisir.telephone);
      if (loisir.email) formData.append('mail', loisir.email);
      if (loisir.instagram && String(loisir.instagram).trim()) { const v = String(loisir.instagram).trim(); formData.append('instagram', v); formData.append('instagram_url', v); formData.append('Instagram', v); }
      if (loisir.facebook) formData.append('facebook', loisir.facebook);
      if (loisir.tiktok && String(loisir.tiktok).trim()) { const v = String(loisir.tiktok).trim(); formData.append('tiktok', v); formData.append('tiktok_url', v); formData.append('TikTok', v); }
      
      // Fichiers - seulement si présents
      if (loisir.logo && loisir.logo instanceof File) {
        formData.append('logo', loisir.logo);
      }
      if (loisir.image && loisir.image instanceof File) {
        formData.append('image', loisir.image);
      }
      
      const record = await pb.collection('loisirs').create(formData, { requestKey: null });
      console.log('Loisir créé avec succès:', record);
      return record ? mapLoisirRecord(record) : record;
    } catch (error: any) {
      console.error('Erreur lors de la création du loisir:', error);
      console.error('Détails validation (error.data):', error?.data);
      throw error;
    }
  },

  async updateLoisir(id: string, loisir: any) {
    try {
      const formData = new FormData();
      
      formData.append('nom', loisir.nom || '');
      formData.append('description', loisir.description || '');
      formData.append('horaires', loisir.horaires || '');
      formData.append('opensonday', loisir.openSunday ? 'true' : 'false');
      formData.append('statut', loisir.statut || 'actif');
      formData.append('universe', loisir.universe || 'Général');
      
      formData.append('heureOuverture', toTimeISO(loisir.heureOuverture) ?? '2000-01-01T09:00:00.000');
      formData.append('heureFermeture', toTimeISO(loisir.heureFermeture) ?? '2000-01-01T18:00:00.000');

      if (loisir.telephone) formData.append('telephone', loisir.telephone);
      if (loisir.email) formData.append('mail', loisir.email);
      if (loisir.instagram && String(loisir.instagram).trim()) { const v = String(loisir.instagram).trim(); formData.append('instagram', v); formData.append('instagram_url', v); formData.append('Instagram', v); }
      if (loisir.facebook) formData.append('facebook', loisir.facebook);
      if (loisir.tiktok && String(loisir.tiktok).trim()) { const v = String(loisir.tiktok).trim(); formData.append('tiktok', v); formData.append('tiktok_url', v); formData.append('TikTok', v); }
      if (loisir.website) formData.append('website', loisir.website);
      
      if (loisir.logo && loisir.logo instanceof File) {
        formData.append('logo', loisir.logo);
      }
      if (loisir.image && loisir.image instanceof File) {
        formData.append('image', loisir.image);
      }
      if (loisir.logoCarousel && loisir.logoCarousel instanceof File) {
        formData.append('logoCarousel', loisir.logoCarousel);
      }
      
      const record = await pb.collection('loisirs').update(id, formData, { requestKey: null });
      return record ? mapLoisirRecord(record) : record;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du loisir:', error);
      console.error('Détails validation (error.data):', error?.data);
      throw error;
    }
  },

  async deleteLoisir(id: string) {
    try {
      if (useApi()) {
        await apiClient.loisirs.delete(id);
        invalidateDataCache('loisirs');
        return;
      }
      await pb.collection('loisirs').delete(id);
    } catch (error) {
      console.error('Erreur lors de la suppression du loisir:', error);
      throw error;
    }
  },

  // ÉVÉNEMENTS
  async getEvenements() {
    try {
      if (useApi()) return apiClient.evenements.list();
      const records = await pb.collection('evenements').getFullList();
      return records.map(record => ({
        id: record.id,
        titre: record.titre,
        title: record.titre, // Alias pour compatibilité
        description: record.description,
        date: record.date,
        lieu: record.lieu,
        statut: record.statut,
        affiche: record.affiche ? getFileUrl(record, record.affiche) : null,
        createdAt: record.created,
        updatedAt: record.updated
      }));
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
        const affiche_url = await uploadFileToApi(evenement.affiche, 'evenements', evenement.affiche?.name || 'affiche');
        const image_url = await uploadFileToApi(evenement.image ?? evenement.affiche, 'evenements', 'image');
        const dateVal = evenement.date ? new Date(evenement.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
        const out = await apiClient.evenements.create({
          titre: evenement.titre.trim(),
          description: evenement.description.trim(),
          date: dateVal,
          heure: evenement.heure || undefined,
          lieu: evenement.lieu.trim(),
          statut: (evenement.statut === 'annulé' ? 'planifié' : evenement.statut) || 'planifié',
          affiche_url: affiche_url || undefined,
          image_url: image_url || affiche_url || undefined,
        });
        invalidateDataCache('evenements');
        return out;
      }
      console.log('=== DIAGNOSTIC COMPLET - CRÉATION ÉVÉNEMENT ===');
      console.log('Données reçues:', evenement);
      console.log('Utilisateur connecté:', pb.authStore.model);
      console.log('Token:', pb.authStore.token);
      console.log('titre:', evenement.titre, typeof evenement.titre);
      console.log('description:', evenement.description, typeof evenement.description);
      console.log('date:', evenement.date, typeof evenement.date);
      console.log('lieu:', evenement.lieu, typeof evenement.lieu);
      console.log('statut:', evenement.statut, typeof evenement.statut);
      console.log('affiche:', evenement.affiche, typeof evenement.affiche, evenement.affiche instanceof File);
      const formData = new FormData();
      if (!evenement.titre || evenement.titre.trim() === '') {
        throw new Error('Le titre est obligatoire');
      }
      formData.append('titre', evenement.titre.trim());
      
      if (!evenement.description || evenement.description.trim() === '') {
        throw new Error('La description est obligatoire');
      }
      formData.append('description', evenement.description.trim());
      
      if (!evenement.date) {
        throw new Error('La date est obligatoire');
      }
      // Conversion de la date au format ISO
      const dateObj = new Date(evenement.date);
      if (isNaN(dateObj.getTime())) {
        throw new Error('Format de date invalide');
      }
      formData.append('date', dateObj.toISOString());
      
      if (!evenement.lieu || evenement.lieu.trim() === '') {
        throw new Error('Le lieu est obligatoire');
      }
      formData.append('lieu', evenement.lieu.trim());
      
      if (!evenement.statut || !['planifié', 'annulé', 'terminé'].includes(evenement.statut)) {
        throw new Error('Le statut doit être planifié, annulé ou terminé');
      }
      formData.append('statut', evenement.statut);
      
      // AFFICHE - OBLIGATOIRE
      if (!evenement.affiche || !(evenement.affiche instanceof File)) {
        throw new Error('L\'affiche est obligatoire et doit être un fichier');
      }
      formData.append('affiche', evenement.affiche);
      
      console.log('=== FORMDATA FINAL ===');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: [FILE] ${value.name} (${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      console.log('=== TENTATIVE DE CRÉATION ===');
      const record = await pb.collection('evenements').create(formData, { requestKey: null });
      console.log(' Événement créé avec succès:', record);
      return record;
    } catch (error: any) {
      console.error(' Erreur lors de la création de l\'événement:', error);
      console.error('Type d\'erreur:', error.constructor.name);
      console.error('Message d\'erreur:', error.message);
      console.error('Code d\'erreur:', error.status);
      console.error('Détails de l\'erreur:', error.data);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  },

  async updateEvenement(id: string, evenement: any) {
    try {
      if (useApi()) {
        if (!evenement.titre?.trim()) throw new Error('Le titre est obligatoire');
        const affiche_url = await uploadFileToApi(evenement.affiche, 'evenements', evenement.affiche?.name || 'affiche') ?? evenement.affiche ?? undefined;
        const image_url = await uploadFileToApi(evenement.image, 'evenements', 'image') ?? evenement.image ?? undefined;
        const dateVal = evenement.date ? new Date(evenement.date).toISOString().slice(0, 10) : undefined;
        return apiClient.evenements.update(id, {
          titre: evenement.titre.trim(),
          description: evenement.description?.trim() ?? '',
          date: dateVal,
          heure: evenement.heure,
          lieu: evenement.lieu?.trim() ?? '',
          statut: (evenement.statut === 'annulé' ? 'planifié' : evenement.statut) || 'planifié',
          affiche_url: affiche_url ?? undefined,
          image_url: image_url ?? undefined,
        });
      }
      console.log('=== MISE À JOUR ÉVÉNEMENT - DIAGNOSTIC COMPLET ===');
      console.log('ID:', id);
      console.log('Données reçues:', evenement);
      const formData = new FormData();
      if (!evenement.titre || evenement.titre.trim() === '') {
        throw new Error('Le titre est obligatoire');
      }
      formData.append('titre', evenement.titre.trim());
      
      if (!evenement.description || evenement.description.trim() === '') {
        throw new Error('La description est obligatoire');
      }
      formData.append('description', evenement.description.trim());
      
      if (!evenement.date) {
        throw new Error('La date est obligatoire');
      }
      // Conversion de la date au format ISO
      const dateObj = new Date(evenement.date);
      if (isNaN(dateObj.getTime())) {
        throw new Error('Format de date invalide');
      }
      formData.append('date', dateObj.toISOString());
      
      if (!evenement.lieu || evenement.lieu.trim() === '') {
        throw new Error('Le lieu est obligatoire');
      }
      formData.append('lieu', evenement.lieu.trim());
      
      if (!evenement.statut || !['planifié', 'annulé', 'terminé'].includes(evenement.statut)) {
        throw new Error('Le statut doit être planifié, annulé ou terminé');
      }
      formData.append('statut', evenement.statut);
      
      // AFFICHE - OBLIGATOIRE
      if (!evenement.affiche || !(evenement.affiche instanceof File)) {
        throw new Error('L\'affiche est obligatoire et doit être un fichier');
      }
      formData.append('affiche', evenement.affiche);
      
      console.log('=== FORMDATA FINAL POUR MISE À JOUR ===');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: [FILE] ${value.name} (${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      const record = await pb.collection('evenements').update(id, formData, { requestKey: null });
      console.log(' Événement mis à jour avec succès:', record);
      return record;
    } catch (error: any) {
      console.error(' Erreur lors de la mise à jour de l\'événement:', error);
      console.error('Type d\'erreur:', error.constructor.name);
      console.error('Message d\'erreur:', error.message);
      console.error('Code d\'erreur:', error.status);
      console.error('Détails de l\'erreur:', error.data);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  },

  async deleteEvenement(id: string) {
    try {
      if (useApi()) {
        await apiClient.evenements.delete(id);
        invalidateDataCache('evenements');
        return;
      }
      await pb.collection('evenements').delete(id);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
      throw error;
    }
  }
};
