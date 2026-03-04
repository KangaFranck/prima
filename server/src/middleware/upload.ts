import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const uploadPath = path.resolve(process.cwd(), UPLOAD_DIR);

// Créer le dossier uploads s'il n'existe pas (important en production)
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log(`Dossier ${UPLOAD_DIR} créé`);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadPath),
  filename: (_req, file, cb) => cb(null, Date.now() + path.extname(file.originalname || '.bin'))
});

// 10 Mo max par fichier (évite 413 sur Render / hébergement)
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
