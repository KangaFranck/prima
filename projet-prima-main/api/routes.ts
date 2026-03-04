import { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from './db';
import User from './models/User';
import Boutique from './models/Boutique';
import Restaurant from './models/Restaurant';
import Loisir from './models/Loisir';
import Evenement from './models/Evenement';
import Info from './models/Info';
import jwt from 'jsonwebtoken';
import { withAdminAuth } from './middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'prima_secret_key_2024_secure_jwt';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('API Request:', {
    method: req.method,
    path: req.query.path,
    url: req.url,
    headers: req.headers
  });

  // Activer CORS pour toutes les requêtes
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Gérer les requêtes OPTIONS (pre-flight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await dbConnect();
    console.log('Connected to MongoDB');

    const { path } = req.query;
    console.log('Processing path:', path);

    // Routes publiques en lecture seule
    if (req.method === 'GET') {
      try {
        let data;
        switch (path) {
          case 'boutiques':
            console.log('Fetching boutiques...');
            data = await Boutique.find();
            console.log('Found boutiques:', data.length);
            return res.status(200).json(data);
          
          case 'restaurants':
            console.log('Fetching restaurants...');
            data = await Restaurant.find();
            console.log('Found restaurants:', data.length);
            return res.status(200).json(data);
          
          case 'loisirs':
            console.log('Fetching loisirs...');
            data = await Loisir.find();
            console.log('Found loisirs:', data.length);
            return res.status(200).json(data);
          
          case 'evenements':
            console.log('Fetching evenements...');
            data = await Evenement.find()
              .populate('boutiques')
              .populate('restaurants')
              .populate('loisirs');
            console.log('Found evenements:', data.length);
            return res.status(200).json(data);
          
          case 'infos':
            console.log('Fetching infos...');
            const { type } = req.query;
            let query = type ? { type } : {};
            data = await Info.find(query).sort({ ordre: 1 });
            console.log('Found infos:', data.length);
            return res.status(200).json(data);
        }
      } catch (error) {
        console.error('Error in GET route:', error);
        return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      }
    }

    // Routes d'authentification
    if (path === 'auth/login') {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);
        
        const user = await User.findOne({ email });
        if (!user) {
          console.log('User not found:', email);
          return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const isValid = await user.comparePassword(password);
        if (!isValid) {
          console.log('Invalid password for:', email);
          return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign(
          { userId: user._id, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        console.log('Login successful for:', email);
        return res.status(200).json({
          token,
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
            nom: user.nom,
            prenom: user.preom
          }
        });
      } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Erreur lors de la connexion' });
      }
    }

    // Routes protégées nécessitant une authentification admin
    if (req.method !== 'GET') {
      return withAdminAuth(async () => {
        try {
          let result;
          switch (path) {
            case 'boutiques':
              if (req.method === 'POST') {
                console.log('Creating boutique:', req.body);
                result = await Boutique.create(req.body);
                console.log('Created boutique:', result);
                return res.status(201).json(result);
              }
              break;

            case 'restaurants':
              if (req.method === 'POST') {
                console.log('Creating restaurant:', req.body);
                result = await Restaurant.create(req.body);
                console.log('Created restaurant:', result);
                return res.status(201).json(result);
              }
              break;

            case 'loisirs':
              if (req.method === 'POST') {
                console.log('Creating loisir:', req.body);
                result = await Loisir.create(req.body);
                console.log('Created loisir:', result);
                return res.status(201).json(result);
              }
              break;

            case 'evenements':
              if (req.method === 'POST') {
                console.log('Creating evenement:', req.body);
                result = await Evenement.create(req.body);
                console.log('Created evenement:', result);
                return res.status(201).json(result);
              }
              break;

            case 'infos':
              if (req.method === 'POST') {
                console.log('Creating info:', req.body);
                result = await Info.create(req.body);
                console.log('Created info:', result);
                return res.status(201).json(result);
              }
              break;
          }
        } catch (error) {
          console.error('Error in protected route:', error);
          return res.status(500).json({ error: 'Erreur lors de l\'opération' });
        }
      })(req, res);
    }

    console.log('Route not found:', path);
    return res.status(404).json({ error: 'Route not found' });
  } catch (error) {
    console.error('Global error:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
} 