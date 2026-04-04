/**
 * Client API Prima Center (Neon + R2).
 *
 * --- Architecture durable (choisir UNE logique en prod) ---
 *
 * 1) Même origine (recommandé pour éviter CORS + oublis d’URL)
 *    Un seul service (ex. Render) avec `server.ts` : le site et `/api/*` partagent le même domaine
 *    (dont domaine perso). Ne pas définir VITE_API_URL : les appels restent `/api/...` sur ce domaine.
 *
 * 2) Front et API sur deux hôtes (ex. primacenter.store + xxx.onrender.com)
 *    - Au BUILD : VITE_API_URL=https://xxx.onrender.com (sans /api à la fin), OU
 *    - Fichier public/api-config.json déployé avec { "apiBaseUrl": "https://xxx.onrender.com" }
 *      (lu au démarrage ; utile sans refaire un build).
 *    Sur l’API : ALLOWED_ORIGINS doit inclure https://primacenter.store (et www si utilisé).
 *
 * Les hôtes *.onrender.com et *.vercel.app utilisent `/api/` en relatif (même origine sur ces plateformes).
 */

import type { Boutique, Restaurant, Loisir, Service, Evenement } from '../types/admin';

function getBaseURL(): string {
  const fromEnv = (import.meta.env.VITE_API_URL as string) || '';
  if (fromEnv) return fromEnv;
  if (typeof window !== 'undefined') {
    const injected = (window as unknown as { __PRIMA_API_BASE_URL__?: string }).__PRIMA_API_BASE_URL__;
    if (injected) return injected.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && /localhost|127\.0\.0\.1/.test(window.location.hostname)) {
    return 'http://localhost:3002';
  }
  return '';
}

/** Cache données publiques : pas d’expiration par temps, vidé uniquement quand l’admin modifie les données. */
const dataCache = new Map<string, unknown>();

/** Token admin : sessionStorage = reconnexion obligatoire à chaque nouvelle session (onglet fermé). */
function getToken(): string | null {
  return sessionStorage.getItem('pb_token');
}

/** Construit l’URL complète vers l’API (voir doc en tête de fichier). */
function apiPath(segment: string): string {
  if (typeof window !== 'undefined' && (/\.onrender\.com$/i.test(window.location.hostname) || /\.vercel\.app$/i.test(window.location.hostname))) {
    return `/api/${segment}`;
  }
  const base = getBaseURL().replace(/\/$/, '');
  if (base) return `${base}/api/${segment}`;
  return `/api/${segment}`;
}

/** Invalide le cache (après création/modification/suppression côté admin). */
export function invalidateDataCache(segment?: string): void {
  if (segment) {
    dataCache.delete(segment);
    if (segment.startsWith('boutiques')) dataCache.delete('boutiques');
    if (segment.startsWith('restaurants')) dataCache.delete('restaurants');
    if (segment.startsWith('loisirs')) dataCache.delete('loisirs');
    if (segment.startsWith('services')) dataCache.delete('services');
    if (segment.startsWith('evenements')) dataCache.delete('evenements');
    if (segment.startsWith('home-settings')) dataCache.delete('home-settings');
  } else {
    dataCache.clear();
  }
}

async function request<T>(
  pathSegment: string,
  options: RequestInit & { parseJson?: boolean } = {}
): Promise<T> {
  const { parseJson = true, ...init } = options;
  const method = (init.method || 'GET').toUpperCase();
  const isGet = method === 'GET';
  if (isGet) {
    const cached = dataCache.get(pathSegment);
    if (cached !== undefined) return cached as T;
  }
  const url = apiPath(pathSegment);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Pour POST/PUT/DELETE, ne pas suivre les redirections (évite POST→GET et 405 en prod)
  const fetchOpts: RequestInit =
    method !== 'GET'
      ? { ...init, headers, redirect: 'manual' as RequestRedirect }
      : { ...init, headers };
  const res = await fetch(url, fetchOpts);
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const text = await res.text();
  if (!res.ok) {
    const err = isJson && text ? (() => { try { return JSON.parse(text); } catch { return {}; } })() : {};
    throw new Error((err as { error?: string }).error || `API ${res.status}`);
  }
  if (!parseJson) return undefined as T;
  if (!isJson || !text || text.trim().startsWith('<')) {
    const hint = import.meta.env.DEV
      ? ' Ouvrez l’URL affichée par « vercel dev » dans le terminal (souvent http://localhost:3000), pas http://localhost:3001.'
      : '';
    throw new Error('Réponse serveur invalide (non-JSON).' + hint);
  }
  const data = JSON.parse(text) as T;
  if (isGet) dataCache.set(pathSegment, data);
  return data;
}

export interface AuthRecord {
  id: string;
  email: string;
  name?: string;
  role?: string;
  permissions?: string[];
  isActive?: boolean;
}

export interface AuthResponse {
  token: string;
  record: AuthRecord;
}

export const apiClient = {
  /** Profil admin (table `admins` Neon) — JWT requis. */
  adminMe: {
    async update(body: {
      name?: string;
      email?: string;
      password?: string;
      currentPassword?: string;
    }): Promise<AuthResponse> {
      return request<AuthResponse>('admins/me', { method: 'PUT', body: JSON.stringify(body) });
    },
  },

  auth: {
    async login(email: string, password: string): Promise<AuthResponse> {
      const url = apiPath('login');
      const body = JSON.stringify({ email, password });
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        redirect: 'manual',
      });
      const text = await res.text();
      if (!res.ok) {
        const err = (() => { try { return text && JSON.parse(text); } catch { return {}; } })() as { error?: string };
        throw new Error(err?.error || `API ${res.status}`);
      }
      return JSON.parse(text) as AuthResponse;
    },
  },

  boutiques: {
    list(): Promise<Boutique[]> {
      return request<Boutique[]>('boutiques');
    },
    get(id: string): Promise<Boutique> {
      return request<Boutique>(`boutiques/${id}`);
    },
    create(body: Partial<Boutique>): Promise<Boutique> {
      return request<Boutique>('boutiques', { method: 'POST', body: JSON.stringify(body) });
    },
    update(id: string, body: Partial<Boutique>): Promise<Boutique> {
      return request<Boutique>(`boutiques/${id}`, { method: 'PUT', body: JSON.stringify(body) });
    },
    delete(id: string): Promise<{ ok: boolean }> {
      return request<{ ok: boolean }>(`boutiques/${id}`, { method: 'DELETE' });
    },
  },

  restaurants: {
    list(): Promise<Restaurant[]> {
      return request<Restaurant[]>('restaurants');
    },
    get(id: string): Promise<Restaurant> {
      return request<Restaurant>(`restaurants/${id}`);
    },
    create(body: Partial<Restaurant>): Promise<Restaurant> {
      return request<Restaurant>('restaurants', { method: 'POST', body: JSON.stringify(body) });
    },
    update(id: string, body: Partial<Restaurant>): Promise<Restaurant> {
      return request<Restaurant>(`restaurants/${id}`, { method: 'PUT', body: JSON.stringify(body) });
    },
    delete(id: string): Promise<{ ok: boolean }> {
      return request<{ ok: boolean }>(`restaurants/${id}`, { method: 'DELETE' });
    },
  },

  loisirs: {
    list(): Promise<Loisir[]> {
      return request<Loisir[]>('loisirs');
    },
    get(id: string): Promise<Loisir> {
      return request<Loisir>(`loisirs/${id}`);
    },
    create(body: Partial<Loisir>): Promise<Loisir> {
      return request<Loisir>('loisirs', { method: 'POST', body: JSON.stringify(body) });
    },
    update(id: string, body: Partial<Loisir>): Promise<Loisir> {
      return request<Loisir>(`loisirs/${id}`, { method: 'PUT', body: JSON.stringify(body) });
    },
    delete(id: string): Promise<{ ok: boolean }> {
      return request<{ ok: boolean }>(`loisirs/${id}`, { method: 'DELETE' });
    },
  },

  services: {
    list(): Promise<Service[]> {
      return request<Service[]>('services');
    },
    get(id: string): Promise<Service> {
      return request<Service>(`services/${id}`);
    },
    create(body: Partial<Service>): Promise<Service> {
      return request<Service>('services', { method: 'POST', body: JSON.stringify(body) });
    },
    update(id: string, body: Partial<Service>): Promise<Service> {
      return request<Service>(`services/${id}`, { method: 'PUT', body: JSON.stringify(body) });
    },
    delete(id: string): Promise<{ ok: boolean }> {
      return request<{ ok: boolean }>(`services/${id}`, { method: 'DELETE' });
    },
  },

  evenements: {
    list(): Promise<Evenement[]> {
      return request<Evenement[]>('evenements');
    },
    get(id: string): Promise<Evenement> {
      return request<Evenement>(`evenements/${id}`);
    },
    create(body: Partial<Evenement>): Promise<Evenement> {
      return request<Evenement>('evenements', { method: 'POST', body: JSON.stringify(body) });
    },
    update(id: string, body: Partial<Evenement>): Promise<Evenement> {
      return request<Evenement>(`evenements/${id}`, { method: 'PUT', body: JSON.stringify(body) });
    },
    delete(id: string): Promise<{ ok: boolean }> {
      return request<{ ok: boolean }>(`evenements/${id}`, { method: 'DELETE' });
    },
  },

  newsletter: {
    subscribe(email: string): Promise<{ ok: boolean; message?: string }> {
      return request<{ ok: boolean; message?: string }>('newsletter', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
    list(): Promise<{ id: string; email: string; created_at: string }[]> {
      return request<{ id: string; email: string; created_at: string }[]>('newsletter');
    },
    deleteMany(ids: string[]): Promise<{ ok: boolean; deleted: number }> {
      return request<{ ok: boolean; deleted: number }>('newsletter/delete', {
        method: 'POST',
        body: JSON.stringify({ ids }),
      });
    },
  },

  homeSettings: {
    get(): Promise<{ image_boutiques: string; image_restaurants: string; image_loisirs: string; image_services: string }> {
      return request<{ image_boutiques: string; image_restaurants: string; image_loisirs: string; image_services: string }>('home-settings');
    },
    update(body: { image_boutiques?: string; image_restaurants?: string; image_loisirs?: string; image_services?: string }) {
      return request<{ image_boutiques: string; image_restaurants: string; image_loisirs: string; image_services: string }>('home-settings', {
        method: 'PUT',
        body: JSON.stringify(body),
      });
    },
  },

  upload: {
    async upload(fileBase64: string, folder: string, name: string, contentType?: string): Promise<{ url: string; key: string }> {
      return request<{ url: string; key: string }>('upload', {
        method: 'POST',
        body: JSON.stringify({ file: fileBase64, folder, name, contentType }),
      });
    },
  },
};

/** Récupère l'URL de la miniature (cover) d'un post/reel Instagram via l'API oEmbed. Retourne null en cas d'erreur. */
export async function getInstagramThumbnail(postUrl: string): Promise<string | null> {
  if (!/instagram\.com\/(p|reel)\//i.test(postUrl)) return null;
  try {
    const segment = `instagram-oembed?url=${encodeURIComponent(postUrl)}`;
    const data = await request<{ thumbnail_url?: string | null }>(segment);
    return data.thumbnail_url ?? null;
  } catch {
    return null;
  }
}
