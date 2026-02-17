# Prima Center - Centre Commercial Abidjan

Une application web moderne pour le centre commercial Prima Center à Abidjan, construite avec React, TypeScript et Vite.

## 🏢 À propos

Prima Center est une plateforme web complète pour le centre commercial Prima Center à Abidjan, offrant :
- **Boutiques** : Découvrez nos boutiques de mode et accessoires
- **Restaurants** : Une expérience culinaire unique
- **Loisirs** : Votre espace bien-être et sport
- **Événements** : Actualités et événements du centre

## 🚀 Technologies utilisées

### Frontend
- **React 19** - Framework JavaScript moderne
- **TypeScript** - Typage statique pour JavaScript
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **Framer Motion** - Animations fluides
- **Swiper** - Carousel moderne
- **React Router** - Navigation côté client

### Backend & Base de données
- **PocketBase** - Backend-as-a-Service
- **MongoDB** - Base de données NoSQL
- **Node.js** - Runtime JavaScript
- **Express** - Framework web

### Gestion d'état
- **Zustand** - Gestion d'état légère et moderne
- **React Query** - Gestion des données serveur

### Déploiement
- **Vercel** - Hébergement et déploiement automatique
- **GitHub** - Contrôle de version

## 📋 Prérequis

- **Node.js** 18+ 
- **npm** 8+ ou **yarn**
- **Git**

## 🛠️ Installation

1. **Cloner le repository**
```bash
git clone https://github.com/KangaFranck/projet-prima.git
cd projet-prima
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des variables d'environnement**
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer les variables d'environnement
nano .env
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📜 Scripts disponibles

```bash
# Développement
npm run dev          # Lance le serveur de développement
npm run server       # Lance sur le port 3000

# Production
npm run build        # Crée une version de production
npm run preview      # Prévisualise la version de production

# Qualité du code
npm run lint         # Vérifie le code avec ESLint
npm run test         # Lance les tests

# Déploiement
npm run vercel-build # Build optimisé pour Vercel
```

## 🏗️ Structure du projet

```
prima-center/
├── src/
│   ├── admin/           # Interface d'administration
│   │   ├── components/  # Composants admin
│   │   ├── pages/       # Pages admin
│   │   └── hooks/       # Hooks personnalisés
│   ├── components/      # Composants réutilisables
│   ├── pages/          # Pages de l'application
│   ├── store/          # Gestion d'état (Zustand)
│   ├── services/       # Services API
│   ├── utils/         # Utilitaires
│   └── types/         # Types TypeScript
├── api/               # API Backend
├── public/           # Ressources statiques
├── pocketbase/       # Configuration PocketBase
└── dist/            # Build de production
```

## 🎨 Fonctionnalités

### Pour les visiteurs
- ✅ **Page d'accueil** avec vidéos et carousel
- ✅ **Boutiques** - Catalogue des boutiques
- ✅ **Restaurants** - Guide des restaurants
- ✅ **Loisirs** - Espaces de détente et sport
- ✅ **Événements** - Actualités et événements
- ✅ **Recherche** - Recherche dans tous les commerces
- ✅ **Responsive** - Optimisé mobile/tablette/desktop

### Pour les administrateurs
- ✅ **Dashboard** - Vue d'ensemble
- ✅ **Gestion des boutiques** - CRUD complet
- ✅ **Gestion des restaurants** - CRUD complet
- ✅ **Gestion des loisirs** - CRUD complet
- ✅ **Gestion des événements** - CRUD complet
- ✅ **Authentification** - Système de connexion sécurisé

## 🚀 Déploiement

### Vercel (Recommandé)

1. **Connecter le repository GitHub à Vercel**
2. **Configurer les variables d'environnement** dans Vercel :
   ```
   VITE_API_URL=https://votre-domaine.vercel.app/api
   MONGODB_URI=votre_uri_mongodb
   JWT_SECRET=votre_secret_jwt
   ```

3. **Déploiement automatique** à chaque push sur `main`

### Configuration Vercel

Le fichier `vercel.json` est déjà configuré pour :
- ✅ Build automatique avec Vite
- ✅ Routing SPA (Single Page Application)
- ✅ API routes
- ✅ Headers CORS
- ✅ Cache optimization

## 🔧 Configuration

### Variables d'environnement

```env
# API
VITE_API_URL=https://votre-domaine.vercel.app/api

# Base de données
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database

# JWT
JWT_SECRET=votre_secret_jwt_secure

# PocketBase
POCKETBASE_URL=https://votre-pocketbase.herokuapp.com
```

## 🧪 Tests

```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 📱 Responsive Design

L'application est entièrement responsive avec :
- **Mobile First** - Design optimisé pour mobile
- **Breakpoints** - sm, md, lg, xl, 2xl
- **Touch Friendly** - Interactions tactiles optimisées
- **Performance** - Chargement rapide sur tous les appareils

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**Franck Kanga**
- GitHub: [@KangaFranck](https://github.com/KangaFranck)
- Email: franckkanga0707@gmail.com

## 🙏 Remerciements

- **PocketBase** - Backend-as-a-Service
- **Vercel** - Hébergement et déploiement
- **Tailwind CSS** - Framework CSS
- **React** - Framework JavaScript
- **TypeScript** - Typage statique

---

**Prima Center** - Le centre commercial de référence à Abidjan 🇨🇮