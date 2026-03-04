import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement
dotenv.config();

const config = {
  // Configuration du serveur
  port: process.env.PORT || 3000,
  
  // Configuration de la base de données
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/primacenter',
  
  // Configuration JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  
  // Configuration du serveur de fichiers
  uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads'),
};

export default config; 