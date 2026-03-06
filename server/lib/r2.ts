/**
 * Cloudflare R2 (S3-compatible) : upload de fichiers.
 * Les URLs retournées sont à enregistrer en BDD (Neon) pour logo_url, image_url, etc.
 */
import { S3Client, PutObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.R2_PUBLIC_URL; // optionnel : domaine custom pour accès public

function getClient(): S3Client {
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY requis.');
  }
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

/** Durée de cache conseillée pour les médias R2 (1 an) : après 1er chargement, le navigateur ne re-télécharge pas. */
const R2_CACHE_CONTROL = 'public, max-age=31536000, immutable';

/**
 * Upload un buffer vers R2 et retourne l'URL à stocker en BDD.
 * key: ex. "boutiques/abc-123/logo.png"
 * Les objets sont envoyés avec Cache-Control pour que le navigateur les mette en cache.
 */
export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  if (!bucketName) throw new Error('R2_BUCKET_NAME requis.');
  const client = getClient();
  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: R2_CACHE_CONTROL,
    })
  );
  // Si domaine public configuré : URL directe
  if (publicUrl) {
    const base = publicUrl.replace(/\/$/, '');
    return `${base}/${key}`;
  }
  // Sinon : URL R2 dev (si activée) ou l'app devra utiliser des URLs signées plus tard
  return `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${key}`;
}

/** Vérifie que R2 est joignable (pour /api/health). */
export async function checkR2(): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!bucketName || !accountId || !accessKeyId || !secretAccessKey) {
      return { ok: false, error: 'Variables R2 manquantes' };
    }
    const client = getClient();
    await client.send(new HeadBucketCommand({ Bucket: bucketName }));
    return { ok: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  }
}
