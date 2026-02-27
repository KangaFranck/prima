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

export function rowToEvenement(r: Record<string, unknown>) {
  return {
    id: r.id,
    titre: r.titre ?? '',
    title: r.titre ?? '',
    description: r.description ?? '',
    date: r.date,
    heure: r.heure ?? undefined,
    lieu: r.lieu ?? '',
    statut: r.statut ?? 'planifié',
    affiche: publicImageUrl(r.affiche_url) ?? undefined,
    image: publicImageUrl(r.image_url ?? r.affiche_url) ?? undefined,
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
