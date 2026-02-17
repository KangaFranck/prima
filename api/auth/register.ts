import { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../db';
import User from '../models/User';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

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

    res.status(201).json({
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
    console.error('Erreur lors de la création de l\'admin:', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'administrateur' });
  }
} 