/**
 * Domaine perso (ex. primacenter.store) : sans VITE_API_URL au build, les appels /api
 * partent sur le même domaine alors que l’API est sur Render → aucune donnée.
 * Charge /api-config.json (copié depuis public/ vers dist/) pour définir l’URL de base de l’API.
 */
export async function bootstrapApiBase(): Promise<void> {
  if (import.meta.env.VITE_API_URL) return;

  if (typeof window === 'undefined') return;

  const host = window.location.hostname;
  if (/localhost|127\.0\.0\.1|\.onrender\.com$|\.vercel\.app$/i.test(host)) return;

  try {
    const r = await fetch('/api-config.json', { cache: 'no-store' });
    if (!r.ok) return;
    const j = (await r.json()) as { apiBaseUrl?: string };
    const u = typeof j.apiBaseUrl === 'string' ? j.apiBaseUrl.trim() : '';
    if (u) {
      (window as unknown as { __PRIMA_API_BASE_URL__: string }).__PRIMA_API_BASE_URL__ = u.replace(/\/$/, '');
    }
  } catch {
    /* réseau ou JSON invalide : apiClient utilisera /api relatif */
  }
}
