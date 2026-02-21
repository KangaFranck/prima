/**
 * Client API Prima Center (Neon + R2).
 * Utilisé quand VITE_API_URL est défini (test local avec vercel dev ou prod Vercel).
 */

import type { Boutique, Restaurant, Loisir, Evenement } from '../types/admin';

// En dev sans URL : requête relative (même host que la page = vercel dev). En prod : même domaine ou VITE_API_URL.
const baseURL = (import.meta.env.VITE_API_URL as string) || '';

/** Cache données publiques : pas d’expiration par temps, vidé uniquement quand l’admin modifie les données. */
const dataCache = new Map<string, unknown>();

/** Token admin : sessionStorage = reconnexion obligatoire à chaque nouvelle session (onglet fermé). */
function getToken(): string | null {
  return sessionStorage.getItem('pb_token');
}

// Vercel réécrit /api/(.*) vers /api/routes?path=$1 — il faut donc appeler /api/auth/login, pas /api?path=...
function apiPath(segment: string): string {
  const base = baseURL.replace(/\/$/, '');
  const prefix = base ? `${base}/api` : '/api';
  return `${prefix}/${segment}`;
}

/** Invalide le cache (après création/modification/suppression côté admin). */
export function invalidateDataCache(segment?: string): void {
  if (segment) {
    dataCache.delete(segment);
    if (segment.startsWith('boutiques')) dataCache.delete('boutiques');
    if (segment.startsWith('restaurants')) dataCache.delete('restaurants');
    if (segment.startsWith('loisirs')) dataCache.delete('loisirs');
    if (segment.startsWith('evenements')) dataCache.delete('evenements');
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
    if (cached && cached.expiry > Date.now()) return cached.data as T;
  }
  const url = apiPath(pathSegment);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { ...init, headers });
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
  auth: {
    async login(email: string, password: string): Promise<AuthResponse> {
      return request<AuthResponse>('auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
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

  upload: {
    async upload(fileBase64: string, folder: string, name: string, contentType?: string): Promise<{ url: string; key: string }> {
      return request<{ url: string; key: string }>('upload', {
        method: 'POST',
        body: JSON.stringify({ file: fileBase64, folder, name, contentType }),
      });
    },
  },
};

/** true si le front doit utiliser l’API (Neon/R2) au lieu de PocketBase */
export function useApi(): boolean {
  return Boolean(baseURL) || import.meta.env.DEV;
}
