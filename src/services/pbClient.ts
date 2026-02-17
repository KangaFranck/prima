import PocketBase from 'pocketbase';

const PB_URL = import.meta.env.VITE_PB_URL || 'https://primacenter.fly.dev';

export const pb = new PocketBase(PB_URL);

export function getFileUrl(record: any, fileName?: string): string | null {
  if (!record || !fileName) return null;
  try {
    return pb.files.getURL(record, fileName);
  } catch {
    return `${PB_URL}/api/files/${record.collectionId || record.collection || "boutiques"}/${record.id}/${fileName}`;
  }
}
