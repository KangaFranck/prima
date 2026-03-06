/**
 * Upload de fichiers vers Cloudflare R2 (S3-compatible).
 * Variables : R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET;
const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, ''); // ex. https://pub-xxx.r2.dev ou domaine perso

const isConfigured = !!(accountId && accessKeyId && secretAccessKey && bucket && publicUrl);

let client: S3Client | null = null;

function getClient(): S3Client {
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey! },
    });
  }
  return client;
}

/** Retourne true si R2 est configuré (on envoie les médias sur Cloudflare). */
export function useR2(): boolean {
  return isConfigured;
}

/**
 * Envoie un fichier vers R2 et retourne l’URL publique.
 * key: chemin dans le bucket (ex. "boutiques/123-logo.jpg")
 */
export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string = 'image/jpeg'
): Promise<string> {
  if (!isConfigured) throw new Error('R2 non configuré');
  const cmd = new PutObjectCommand({
    Bucket: bucket!,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  });
  await getClient().send(cmd);
  return `${publicUrl}/${key}`;
}

/** Génère une clé unique pour un fichier (dossier + timestamp + extension). */
export function r2Key(folder: string, originalName: string): string {
  const ext = originalName?.match(/\.[a-z0-9]+$/i)?.[0] || '.bin';
  return `${folder}/${Date.now()}${ext}`;
}

/** Fichier Multer (avec buffer si memoryStorage). */
interface MulterFile {
  fieldname: string;
  originalname?: string;
  mimetype?: string;
  buffer?: Buffer;
  filename?: string;
}

/**
 * À partir de req (multer), retourne logo + images : URLs R2 si configuré, sinon noms de fichiers locaux.
 */
export async function resolveLogoAndImages(
  files: { logo?: MulterFile[]; images?: MulterFile[] } | undefined,
  bodyLogo?: string,
  bodyImages?: string[],
  folder: string = 'media'
): Promise<{ logo?: string; images: string[] }> {
  const images: string[] = [];
  let logo: string | undefined;

  if (useR2()) {
    const upload = async (file: MulterFile): Promise<string> => {
      const buf = file.buffer;
      if (!buf) throw new Error('Fichier sans buffer (utilisez memoryStorage quand R2 est activé)');
      const key = r2Key(folder, file.originalname || 'file');
      return uploadToR2(key, buf, file.mimetype || 'application/octet-stream');
    };
    if (files?.logo?.[0]) logo = await upload(files.logo[0]);
    if (files?.images?.length) for (const f of files.images) images.push(await upload(f));
  } else {
    logo = files?.logo?.[0]?.filename ?? bodyLogo;
    if (files?.images?.length) images.push(...files.images.map((f) => f.filename!).filter(Boolean));
  }

  if (Array.isArray(bodyImages) && bodyImages.length && !images.length) return { logo, images: bodyImages };
  return { logo, images: images.length ? images : (bodyImages || []) };
}
