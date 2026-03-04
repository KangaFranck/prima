import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { useR2 } from '../lib/r2';

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const uploadPath = path.resolve(process.cwd(), UPLOAD_DIR);

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => cb(null, Date.now() + path.extname(file.originalname || '.bin'))
});

const memoryStorage = multer.memoryStorage();

// Avec Cloudflare R2 : memoryStorage pour envoyer les buffers vers R2. Sinon : disque local.
const storage = useR2() ? memoryStorage : diskStorage;

// 10 Mo max par fichier
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Logo (1 fichier) + images (plusieurs) — utilisé pour boutique, restaurant, loisir
const logoAndImages = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]);
export const uploadBoutique = logoAndImages;
export const uploadRestaurant = logoAndImages;
export const uploadLoisir = logoAndImages;
