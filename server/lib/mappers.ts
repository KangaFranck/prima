/**
 * Mappers DB (snake_case) <-> API (camelCase) pour le frontend.
 */

const R2_PUBLIC_BASE = process.env.R2_PUBLIC_URL?.replace(/\/$/, '');

/** Réécrit une URL R2 privée (cloudflarestorage.com) en URL publique si R2_PUBLIC_URL est configuré. */
function publicImageUrl(url: unknown): string | undefined {
  if (url == null || typeof url !== 'string' || !url) return undefined;
  if (!R2_PUBLIC_BASE || !url.includes('r2.cloudflarestorage.com')) return url;
  try {
    const path = new URL(url).pathname;
    return `${R2_PUBLIC_BASE}${path}`;
  } catch {
    return url;
  }
}

function timeToStr(v: unknown): string {
  if (v == null) return '';
  const s = String(v).trim();
  const m = s.match(/^(\d{1,2}):(\d{2})/);
  return m ? `${m[1].padStart(2, '0')}:${m[2]}` : s.slice(0, 5);
}

export function rowToBoutique(r: Record<string, unknown>) {
  return {
    id: r.id,
    nom: r.nom ?? '',
    description: r.description ?? '',
    logo: publicImageUrl(r.logo_url) ?? undefined,
    image: publicImageUrl(r.image_url) ?? undefined,
    logoCarousel: publicImageUrl(r.logo_carousel_url) ?? undefined,
    website: r.website ?? undefined,
    horaires: r.horaires ?? '',
    heureOuverture: timeToStr(r.heure_ouverture),
    heureFermeture: timeToStr(r.heure_fermeture),
    openSunday: Boolean(r.open_sunday),
    statut: r.statut ?? 'actif',
    universe: r.universe ?? 'Général',
    telephone: r.telephone ?? undefined,
    email: r.email ?? undefined,
    instagram: r.instagram ?? undefined,
    facebook: r.facebook ?? undefined,
    tiktok: r.tiktok ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function rowToRestaurant(r: Record<string, unknown>) {
  return {
    id: r.id,
    nom: r.nom ?? '',
    description: r.description ?? '',
    cuisine: r.cuisine ?? '',
    logo: r.logo_url ?? undefined,
    image: r.image_url ?? undefined,
    logoCarousel: r.logo_carousel_url ?? undefined,
    website: r.website ?? undefined,
    menu: r.menu_url ?? undefined,
    horaires: r.horaires ?? '',
    heureOuverture: timeToStr(r.heure_ouverture),
    heureFermeture: timeToStr(r.heure_fermeture),
    openSunday: Boolean(r.open_sunday),
    statut: r.statut ?? 'actif',
    universe: r.universe ?? 'Général',
    telephone: r.telephone ?? undefined,
    email: r.email ?? undefined,
    instagram: r.instagram ?? undefined,
    facebook: r.facebook ?? undefined,
    tiktok: r.tiktok ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function rowToLoisir(r: Record<string, unknown>) {
  return {
    id: r.id,
    nom: r.nom ?? '',
    description: r.description ?? '',
    logo: publicImageUrl(r.logo_url) ?? undefined,
    image: publicImageUrl(r.image_url) ?? undefined,
    logoCarousel: publicImageUrl(r.logo_carousel_url) ?? undefined,
    website: r.website ?? undefined,
    type: r.type ?? '',
    level: r.level ?? '',
    horaires: r.horaires ?? '',
    heureOuverture: timeToStr(r.heure_ouverture),
    heureFermeture: timeToStr(r.heure_fermeture),
    openSunday: Boolean(r.open_sunday),
    statut: r.statut ?? 'actif',
    universe: r.universe ?? 'Général',
    telephone: r.telephone ?? undefined,
    email: r.email ?? undefined,
    instagram: r.instagram ?? undefined,
    facebook: r.facebook ?? undefined,
    tiktok: r.tiktok ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function parseImages(val: unknown): string[] {
  if (val == null) return [];
  if (Array.isArray(val)) return val.slice(0, 3).filter((u): u is string => typeof u === 'string' && u.length > 0).map(u => publicImageUrl(u) ?? u);
  if (typeof val === 'string') {
    try {
      const arr = JSON.parse(val) as unknown[];
      return Array.isArray(arr) ? arr.slice(0, 3).filter((u): u is string => typeof u === 'string' && u.length > 0).map(u => publicImageUrl(u) ?? u) : [];
    } catch { return []; }
  }
  return [];
}

/** Récupère le champ images depuis la row (colonne JSONB, clé possible selon le driver). */
function getRowImages(r: Record<string, unknown>): unknown {
  if (r.images !== undefined && r.images !== null) return r.images;
  const key = Object.keys(r).find((k) => k.toLowerCase() === 'images');
  return key ? r[key] : undefined;
}

export function rowToEvenement(r: Record<string, unknown>) {
  const images = parseImages(getRowImages(r));
  return {
    id: r.id,
    titre: r.titre ?? '',
    title: r.titre ?? '',
    description: r.description ?? '',
    date: r.date,
    heure: r.heure ?? undefined,
    dateFin: r.date_fin ?? undefined,
    heureFin: r.heure_fin ?? undefined,
    lieu: r.lieu ?? '',
    statut: r.statut ?? 'planifié',
    affiche: publicImageUrl(r.affiche_url) ?? undefined,
    image: publicImageUrl(r.image_url ?? r.affiche_url) ?? undefined,
    images: images.length > 0 ? images : undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function rowToService(r: Record<string, unknown>) {
  const reseaux = r.reseaux_sociaux as Record<string, string> | undefined;
  const images = Array.isArray(r.images) ? r.images : (typeof r.images === 'string' ? (() => { try { return JSON.parse(r.images as string); } catch { return []; } })() : []);
  return {
    id: r.id,
    nom: r.nom ?? '',
    type: r.type ?? undefined,
    description: r.description ?? undefined,
    horaires: r.horaires ?? undefined,
    telephone: r.telephone ?? undefined,
    email: r.email ?? undefined,
    adresse: r.adresse ?? undefined,
    logo: publicImageUrl(r.logo) ?? (r.logo as string) ?? undefined,
    images,
    statut: r.statut ?? 'actif',
    ouvertLeDimanche: Boolean(r.ouvert_le_dimanche),
    reseauxSociaux: reseaux ?? {},
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

/** Convertit heure "HH:MM" ou "HH:MM:SS" en valeur TIME Postgres (string "HH:MM:00") */
export function toTimePg(v: unknown): string {
  if (v == null || v === '') return '09:00:00';
  const s = String(v).trim();
  const m = s.match(/^(\d{1,2}):(\d{2})/);
  if (m) return `${m[1].padStart(2, '0')}:${m[2]}:00`;
  return '09:00:00';
}
