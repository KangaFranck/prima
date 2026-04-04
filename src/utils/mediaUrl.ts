/**
 * Résout une URL d’asset : l’API Neon/R2 renvoie en général des URLs absolues.
 * (Anciennement via PocketBase files.getURL.)
 */
export function getFileUrl(_record: unknown, fileName?: string): string {
  if (!fileName || typeof fileName !== 'string') return '';
  if (/^https?:\/\//i.test(fileName)) return fileName;
  return fileName;
}
