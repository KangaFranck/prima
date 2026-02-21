import PocketBase from 'pocketbase';

/** URL PocketBase : en local par défaut (Fly désactivé). Définir VITE_PB_URL dans .env si besoin. */
const PB_URL = import.meta.env.VITE_PB_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(PB_URL);

/**
 * Options à passer aux create/update pour éviter "The request was autocancelled"
 * quand deux requêtes identiques sont lancées (double-clic, re-render).
 * Ex: pb.collection('boutiques').create(formData, { requestKey: null })
 * En cas d'erreur 400 (validation), logger error.data pour voir les champs refusés.
 */

export function getFileUrl(record: any, fileName?: string): string | null {
  if (!record || !fileName) return null;
  try {
    return pb.files.getURL(record, fileName);
  } catch {
    return `${PB_URL}/api/files/${record.collectionId || record.collection || "boutiques"}/${record.id}/${fileName}`;
  }
}
