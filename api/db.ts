/**
 * Connexion Neon (PostgreSQL) pour l'API.
 * Connexion paresseuse : évite un crash au chargement si .env n’est pas encore lu (vercel dev).
 */
import { neon, NeonQueryFunction } from '@neondatabase/serverless';

let _sql: NeonQueryFunction<false, false> | null = null;

function getSql(): NeonQueryFunction<false, false> {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL non défini. Vérifiez .env à la racine ou "vercel env pull".');
    _sql = neon(url);
  }
  return _sql;
}

export const sql = new Proxy(function () {} as unknown as NeonQueryFunction<false, false>, {
  apply(_target, _thisArg, args: unknown[]) {
    return (getSql() as (...a: unknown[]) => unknown)(...args);
  },
});

export default sql;
