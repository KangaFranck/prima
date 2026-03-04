/**
 * Service admin qui appelle l'API Express (backend hébergé sur Render).
 * Utiliser quand VITE_API_URL pointe vers le backend Express (ex: prima-liwx.onrender.com).
 * Évite les erreurs 413 / PocketBase quand le site est déployé.
 */

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API_BASE = API_URL ? API_URL.replace(/\/api$/, '') : '';

function idOf(record: any) {
  return record?.id || record?._id?.toString?.() || record?._id;
}

function toBoutique(record: any) {
  if (!record) return null;
  return {
    id: idOf(record),
    nom: record.nom,
    description: record.description ?? '',
    logo: record.logo ? `${API_BASE}/uploads/${record.logo}` : null,
    image: record.images?.[0] ? `${API_BASE}/uploads/${record.images[0]}` : (record.logo ? `${API_BASE}/uploads/${record.logo}` : null),
    horaires: typeof record.horaires === 'string' ? record.horaires : (Array.isArray(record.horaires) ? record.horaires.map((h: any) => `${h.jour}: ${h.heureOuverture}-${h.heureFermeture}`).join(', ') : ''),
    heureOuverture: record.horaires?.[0]?.heureOuverture ?? '',
    heureFermeture: record.horaires?.[0]?.heureFermeture ?? '',
    openSunday: record.ouvertLeDimanche === true || record.ouvertLeDimanche === 'true',
    statut: record.statut || 'actif',
    universe: record.type || 'Général',
    telephone: record.telephone,
    email: record.email,
    instagram: record.reseauxSociaux?.instagram ?? record.instagram,
    facebook: record.reseauxSociaux?.facebook ?? record.facebook,
    tiktok: record.tiktok,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
}

function toRestaurant(record: any) {
  if (!record) return null;
  return {
    id: idOf(record),
    nom: record.nom,
    description: record.description ?? '',
    logo: record.logo ? `${API_BASE}/uploads/${record.logo}` : null,
    image: record.images?.[0] ? `${API_BASE}/uploads/${record.images[0]}` : (record.logo ? `${API_BASE}/uploads/${record.logo}` : null),
    horaires: record.horaires ?? '',
    heureOuverture: '',
    heureFermeture: '',
    openSunday: record.ouvertLeDimanche === true || record.ouvertLeDimanche === 'true',
    statut: record.statut || 'actif',
    universe: record.cuisine || 'Général',
    telephone: record.telephone,
    email: record.email,
    instagram: record.reseauxSociaux?.instagram ?? record.instagram,
    facebook: record.reseauxSociaux?.facebook ?? record.facebook,
    tiktok: record.tiktok,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
}

function toLoisir(record: any) {
  if (!record) return null;
  return {
    id: idOf(record),
    nom: record.nom,
    description: record.description ?? '',
    logo: record.logo ? `${API_BASE}/uploads/${record.logo}` : null,
    image: record.images?.[0] ? `${API_BASE}/uploads/${record.images[0]}` : (record.logo ? `${API_BASE}/uploads/${record.logo}` : null),
    horaires: record.horaires ?? '',
    heureOuverture: '',
    heureFermeture: '',
    openSunday: record.ouvertLeDimanche === true || record.ouvertLeDimanche === 'true',
    statut: record.statut || 'actif',
    universe: record.type || 'Général',
    telephone: record.telephone,
    email: record.email,
    instagram: record.reseauxSociaux?.instagram ?? record.instagram,
    facebook: record.reseauxSociaux?.facebook ?? record.facebook,
    tiktok: record.tiktok,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
}

export const apiAdminService = {
  async getBoutiques() {
    if (!API_URL) throw new Error('VITE_API_URL non configuré');
    const response = await fetch(`${API_URL}/boutiques`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des boutiques');
    const data = await response.json();
    return (Array.isArray(data) ? data : []).map(toBoutique).filter(Boolean);
  },

  async createBoutique(boutique: any) {
    if (!API_URL) throw new Error('VITE_API_URL non configuré');
    const formData = new FormData();
    formData.append('nom', (boutique.nom || '').trim());
    formData.append('description', (boutique.description || '').trim());
    formData.append('ouvertLeDimanche', boutique.openSunday ? 'true' : 'false');
    formData.append('statut', boutique.statut || 'actif');
    formData.append('type', boutique.universe || 'Général');
    if (boutique.telephone) formData.append('telephone', boutique.telephone);
    if (boutique.email) formData.append('email', boutique.email);
    if (boutique.instagram) formData.append('instagram', boutique.instagram);
    if (boutique.facebook) formData.append('facebook', boutique.facebook);
    if (boutique.tiktok) formData.append('tiktok', boutique.tiktok);
    const horairesArr = boutique.heureOuverture && boutique.heureFermeture
      ? [{ jour: 'Ouverture', heureOuverture: boutique.heureOuverture, heureFermeture: boutique.heureFermeture }]
      : [];
    formData.append('horaires', JSON.stringify(horairesArr));
    if (boutique.logo && boutique.logo instanceof File) formData.append('logo', boutique.logo);
    if (boutique.image && boutique.image instanceof File) formData.append('images', boutique.image);

    const response = await fetch(`${API_URL}/boutiques`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || `Erreur ${response.status} lors de la création`);
    }
    const record = await response.json();
    return toBoutique(record);
  },

  async updateBoutique(id: string, boutique: any) {
    if (!API_URL) throw new Error('VITE_API_URL non configuré');
    const formData = new FormData();
    formData.append('nom', (boutique.nom || '').trim());
    formData.append('description', (boutique.description || '').trim());
    formData.append('ouvertLeDimanche', boutique.openSunday ? 'true' : 'false');
    formData.append('statut', boutique.statut || 'actif');
    formData.append('type', boutique.universe || 'Général');
    if (boutique.telephone) formData.append('telephone', boutique.telephone);
    if (boutique.email) formData.append('email', boutique.email);
    if (boutique.instagram) formData.append('instagram', boutique.instagram);
    if (boutique.facebook) formData.append('facebook', boutique.facebook);
    if (boutique.tiktok) formData.append('tiktok', boutique.tiktok);
    const horairesArr = boutique.heureOuverture && boutique.heureFermeture
      ? [{ jour: 'Ouverture', heureOuverture: boutique.heureOuverture, heureFermeture: boutique.heureFermeture }]
      : [];
    formData.append('horaires', JSON.stringify(horairesArr));
    if (boutique.logo && boutique.logo instanceof File) formData.append('logo', boutique.logo);
    if (boutique.image && boutique.image instanceof File) formData.append('images', boutique.image);

    const response = await fetch(`${API_URL}/boutiques/${id}`, {
      method: 'PUT',
      body: formData
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || `Erreur ${response.status} lors de la mise à jour`);
    }
    const record = await response.json();
    return toBoutique(record);
  },

  async deleteBoutique(id: string) {
    if (!API_URL) throw new Error('VITE_API_URL non configuré');
    const response = await fetch(`${API_URL}/boutiques/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Erreur lors de la suppression');
  },

  // ——— RESTAURANTS ———
  async getRestaurants() {
    if (!API_URL) throw new Error('VITE_API_URL non configuré');
    const response = await fetch(`${API_URL}/restaurants`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des restaurants');
    const data = await response.json();
    return (Array.isArray(data) ? data : []).map(toRestaurant).filter(Boolean);
  },

  async createRestaurant(restaurant: any) {
    if (!API_URL) throw new Error('VITE_API_URL non configuré');
    const formData = new FormData();
    formData.append('nom', (restaurant.nom || '').trim());
    formData.append('description', (restaurant.description || '').trim());
    formData.append('horaires', restaurant.horaires || '');
    formData.append('ouvertLeDimanche', restaurant.openSunday ? 'true' : 'false');
    formData.append('statut', restaurant.statut || 'actif');
    formData.append('cuisine', restaurant.cuisine || restaurant.universe || '');
    if (restaurant.telephone) formData.append('telephone', restaurant.telephone);
    if (restaurant.email) formData.append('email', restaurant.email);
    if (restaurant.instagram) formData.append('instagram', restaurant.instagram);
    if (restaurant.facebook) formData.append('facebook', restaurant.facebook);
    if (restaurant.logo && restaurant.logo instanceof File) formData.append('logo', restaurant.logo);
    if (restaurant.image && restaurant.image instanceof File) formData.append('images', restaurant.image);

    const response = await fetch(`${API_URL}/restaurants`, { method: 'POST', body: formData });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || `Erreur ${response.status} lors de la création`);
    }
    return toRestaurant(await response.json());
  },

  async updateRestaurant(id: string, restaurant: any) {
    if (!API_URL) throw new Error('VITE_API_URL non configuré');
    const formData = new FormData();
    formData.append('nom', (restaurant.nom || '').trim());
    formData.append('description', (restaurant.description || '').trim());
    formData.append('horaires', restaurant.horaires || '');
    formData.append('ouvertLeDimanche', restaurant.openSunday ? 'true' : 'false');
    formData.append('statut', restaurant.statut || 'actif');
    formData.append('cuisine', restaurant.cuisine || restaurant.universe || '');
    if (restaurant.telephone) formData.append('telephone', restaurant.telephone);
    if (restaurant.email) formData.append('email', restaurant.email);
    if (restaurant.instagram) formData.append('instagram', restaurant.instagram);
    if (restaurant.facebook) formData.append('facebook', restaurant.facebook);
    if (restaurant.logo && restaurant.logo instanceof File) formData.append('logo', restaurant.logo);
    if (restaurant.image && restaurant.image instanceof File) formData.append('images', restaurant.image);

    const response = await fetch(`${API_URL}/restaurants/${id}`, { method: 'PUT', body: formData });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || `Erreur ${response.status} lors de la mise à jour`);
    }
    return toRestaurant(await response.json());
  },

  async deleteRestaurant(id: string) {
    if (!API_URL) throw new Error('VITE_API_URL non configuré');
    const response = await fetch(`${API_URL}/restaurants/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Erreur lors de la suppression');
  },

  // ——— LOISIRS ———
  async getLoisirs() {
    if (!API_URL) throw new Error('VITE_API_URL non configuré');
    const response = await fetch(`${API_URL}/loisirs`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des loisirs');
    const data = await response.json();
    return (Array.isArray(data) ? data : []).map(toLoisir).filter(Boolean);
  },

  async createLoisir(loisir: any) {
    if (!API_URL) throw new Error('VITE_API_URL non configuré');
    const formData = new FormData();
    formData.append('nom', (loisir.nom || '').trim());
    formData.append('description', (loisir.description || '').trim());
    formData.append('horaires', loisir.horaires || '');
    formData.append('ouvertLeDimanche', loisir.openSunday ? 'true' : 'false');
    formData.append('statut', loisir.statut || 'actif');
    formData.append('type', loisir.universe || loisir.type || 'Général');
    if (loisir.telephone) formData.append('telephone', loisir.telephone);
    if (loisir.email) formData.append('email', loisir.email);
    if (loisir.instagram) formData.append('instagram', loisir.instagram);
    if (loisir.facebook) formData.append('facebook', loisir.facebook);
    if (loisir.logo && loisir.logo instanceof File) formData.append('logo', loisir.logo);
    if (loisir.image && loisir.image instanceof File) formData.append('images', loisir.image);

    const response = await fetch(`${API_URL}/loisirs`, { method: 'POST', body: formData });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || `Erreur ${response.status} lors de la création`);
    }
    return toLoisir(await response.json());
  },

  async updateLoisir(id: string, loisir: any) {
    if (!API_URL) throw new Error('VITE_API_URL non configuré');
    const formData = new FormData();
    formData.append('nom', (loisir.nom || '').trim());
    formData.append('description', (loisir.description || '').trim());
    formData.append('horaires', loisir.horaires || '');
    formData.append('ouvertLeDimanche', loisir.openSunday ? 'true' : 'false');
    formData.append('statut', loisir.statut || 'actif');
    formData.append('type', loisir.universe || loisir.type || 'Général');
    if (loisir.telephone) formData.append('telephone', loisir.telephone);
    if (loisir.email) formData.append('email', loisir.email);
    if (loisir.instagram) formData.append('instagram', loisir.instagram);
    if (loisir.facebook) formData.append('facebook', loisir.facebook);
    if (loisir.logo && loisir.logo instanceof File) formData.append('logo', loisir.logo);
    if (loisir.image && loisir.image instanceof File) formData.append('images', loisir.image);

    const response = await fetch(`${API_URL}/loisirs/${id}`, { method: 'PUT', body: formData });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || `Erreur ${response.status} lors de la mise à jour`);
    }
    return toLoisir(await response.json());
  },

  async deleteLoisir(id: string) {
    if (!API_URL) throw new Error('VITE_API_URL non configuré');
    const response = await fetch(`${API_URL}/loisirs/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Erreur lors de la suppression');
  }
};
