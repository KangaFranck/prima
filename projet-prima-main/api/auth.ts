import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import dbConnect from './db';
import User from './models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await dbConnect();

  // Route pour le test de connexion à la base de données
  if (req.method === 'GET' && req.url === '/test-db') {
    try {
      await dbConnect();
      return res.status(200).json({ message: 'Connexion à la base de données réussie' });
    } catch (error) {
      return res.status(500).json({ error: 'Erreur de connexion à la base de données' });
    }
  }

  // Route pour l'inscription
  if (req.method === 'POST' && req.url === '/register') {
    try {
      // Vérifier si un admin existe déjà
      const adminExists = await User.findOne({ role: 'admin' });
      if (adminExists) {
        return res.status(400).json({ error: 'Un administrateur existe déjà' });
      }

      // Créer l'admin
      const admin = await User.create({
        email: 'admin@primacenter.fr',
        password: 'admin123',
        role: 'admin',
        nom: 'Admin',
        prenom: 'Prima'
      });

      return res.status(201).json({
        message: 'Administrateur créé avec succès',
        user: {
          id: admin._id,
          email: admin.email,
          role: admin.role,
          nom: admin.nom,
          prenom: admin.prenom
        }
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erreur lors de la création de l\'administrateur' });
    }
  }

  // Route pour la connexion
  if (req.method === 'POST' && req.url === '/login') {
    try {
      const { email, password } = req.body;

      // Vérifier si l'utilisateur existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      // Vérifier le mot de passe
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      // Générer le token JWT
      const token = jwt.sign(
        { 
          userId: user._id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          nom: user.nom,
          prenom: user.prenom
        }
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
  }

  // Route par défaut
  return res.status(404).json({ error: 'Route non trouvée' });
} 