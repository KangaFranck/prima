/**
 * Client Neon (PostgreSQL) pour l'API.
 * Utilisé quand DATABASE_URL (Neon) est défini à la place de MONGODB_URI.
 */

import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;
export const useNeon = (): boolean => !!connectionString;

let sqlInstance: ReturnType<typeof neon> | null = null;

export function getNeonSql() {
  if (!connectionString) throw new Error('DATABASE_URL non configuré');
  if (!sqlInstance) sqlInstance = neon(connectionString);
  return sqlInstance;
}
