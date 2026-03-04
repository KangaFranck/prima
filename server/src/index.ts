import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import restaurantRoutes from './routes/restaurantRoutes';
import boutiqueRoutes from './routes/boutiqueRoutes';
import loisirRoutes from './routes/loisirRoutes';
import { Request, Response, NextFunction } from './types/express';

dotenv.config();

const app = express();

// Récupère le port depuis les variables d'environnement
const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("Le port n'est pas défini dans les variables d'environnement.");
}

console.log('Configuration du port:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Middleware
const corsOrigin = process.env.CORS_ORIGIN;
app.use(cors(corsOrigin ? { origin: corsOrigin } : {}));
// Limite élevée pour éviter 413 Payload Too Large (hébergement Render, etc.)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/boutiques', boutiqueRoutes);
app.use('/api/loisirs', loisirRoutes);

// Route de test
app.get('/api/test', (req: Request, res: Response) => {
  res.status(200).json({ message: 'API fonctionne correctement' });
});

// Route racine
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Bienvenue sur l\'API PrimaCenter' });
});

// Route de santé
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', port: PORT });
});

// Gestion des erreurs
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur est survenue sur le serveur' });
});

// Démarrage du serveur (écoute même si MongoDB n'est pas encore disponible)
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`URL: http://localhost:${PORT}`);
});

// Connexion à MongoDB (en arrière-plan)
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/primacenter';
console.log('Tentative de connexion à MongoDB:', mongoUri);

mongoose.connect(mongoUri)
  .then(() => console.log('Connecté à MongoDB'))
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB:', err.message);
    console.warn('Le serveur répond quand même. Les routes API (restaurants, boutiques, loisirs) nécessitent MongoDB.');
  });
