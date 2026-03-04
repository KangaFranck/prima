# 🚀 Guide de Déploiement - Prima Center

Ce guide vous accompagne pour déployer le projet Prima Center sur GitHub et Vercel.

## 📋 Prérequis

- ✅ Compte GitHub
- ✅ Compte Vercel
- ✅ Node.js 18+ installé
- ✅ Git installé
- ✅ Projet Prima Center prêt

## 🔧 Étape 1: Préparation du projet

### 1.1 Vérifier la configuration
```bash
# Lancer le script de vérification
npm run prepare-deploy
```

### 1.2 Nettoyer le projet
```bash
# Supprimer les fichiers temporaires
rm -rf node_modules/.cache
rm -rf dist/
rm -rf .vite/

# Nettoyer les logs
rm -f *.log
```

### 1.3 Installer les dépendances
```bash
npm install
```

## 📦 Étape 2: Configuration Git

### 2.1 Initialiser Git (si pas déjà fait)
```bash
git init
```

### 2.2 Ajouter tous les fichiers
```bash
git add .
```

### 2.3 Premier commit
```bash
git commit -m "feat: Initial commit - Prima Center v1.0.0

- Application React/TypeScript complète
- Interface admin et publique
- Gestion des boutiques, restaurants, loisirs, événements
- Déploiement Vercel configuré
- Responsive design optimisé"
```

## 🐙 Étape 3: Créer le repository GitHub

### 3.1 Aller sur GitHub
- Ouvrir [https://github.com/new](https://github.com/new)
- Se connecter avec votre compte

### 3.2 Créer le repository
```
Repository name: projet-prima
Description: Centre commercial Prima Center - Abidjan 🇨🇮
Visibility: Public (recommandé) ou Private
```

### 3.3 Ne PAS initialiser avec README
- ❌ Ne pas cocher "Add a README file"
- ❌ Ne pas cocher "Add .gitignore"
- ❌ Ne pas cocher "Choose a license"

### 3.4 Connecter le repository local
```bash
# Ajouter le remote origin
git remote add origin https://github.com/KangaFranck/projet-prima.git

# Renommer la branche principale
git branch -M main

# Pousser le code
git push -u origin main
```

## 🌐 Étape 4: Déploiement sur Vercel

### 4.1 Aller sur Vercel
- Ouvrir [https://vercel.com](https://vercel.com)
- Se connecter avec GitHub

### 4.2 Importer le projet
1. Cliquer sur "New Project"
2. Sélectionner le repository `projet-prima`
3. Cliquer sur "Import"

### 4.3 Configuration du projet
```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 4.4 Variables d'environnement
Ajouter ces variables dans Vercel :

```env
# API Configuration
VITE_API_URL=https://prima-five.vercel.app/api

# Database
MONGODB_URI=mongodb+srv://franckkanga0707:csNtNgcYQp2raCoq@prima.l2xpx7h.mongodb.net/?retryWrites=true&w=majority&appName=prima

# JWT Secret
JWT_SECRET=prima_secret_key_2024_secure_jwt

# Environment
NODE_ENV=production
```

### 4.5 Déployer
1. Cliquer sur "Deploy"
2. Attendre la fin du déploiement
3. Votre site sera disponible sur : `https://prima-five.vercel.app`

## 🔄 Étape 5: Déploiement automatique

### 5.1 Configuration automatique
Vercel est maintenant configuré pour :
- ✅ Déploiement automatique à chaque push sur `main`
- ✅ Preview deployments pour les pull requests
- ✅ Build optimisé avec Vite
- ✅ Routing SPA configuré

### 5.2 Workflow de développement
```bash
# Faire des modifications
git add .
git commit -m "feat: Nouvelle fonctionnalité"
git push origin main

# Vercel déploie automatiquement! 🚀
```

## 🛠️ Étape 6: Configuration avancée

### 6.1 Domaine personnalisé (optionnel)
1. Aller dans les paramètres du projet Vercel
2. Section "Domains"
3. Ajouter votre domaine personnalisé

### 6.2 Variables d'environnement par environnement
- **Production** : Variables définies dans Vercel
- **Preview** : Variables de production
- **Development** : Fichier `.env.local`

### 6.3 Monitoring et analytics
- Vercel Analytics (gratuit)
- Vercel Speed Insights
- Logs en temps réel

## 🧪 Étape 7: Tests de déploiement

### 7.1 Vérifier le déploiement
```bash
# Tester localement
npm run build
npm run preview

# Vérifier que tout fonctionne
curl https://prima-five.vercel.app
```

### 7.2 Tests fonctionnels
- ✅ Page d'accueil se charge
- ✅ Navigation fonctionne
- ✅ Images s'affichent
- ✅ API endpoints répondent
- ✅ Responsive design

## 🚨 Dépannage

### Problème: Build échoue
```bash
# Vérifier les erreurs
npm run build

# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Problème: Variables d'environnement
- Vérifier que toutes les variables sont définies dans Vercel
- Redéployer après modification des variables

### Problème: Routing
- Vérifier que `vercel.json` est correct
- S'assurer que les routes API sont bien configurées

## 📊 Monitoring

### Métriques importantes
- **Performance** : Core Web Vitals
- **Disponibilité** : Uptime 99.9%
- **Trafic** : Analytics Vercel
- **Erreurs** : Logs en temps réel

### Alertes
- Configurer des alertes pour les erreurs critiques
- Monitoring des performances
- Surveillance de l'uptime

## 🎉 Félicitations!

Votre projet Prima Center est maintenant déployé et accessible au monde entier ! 🌍

### Liens utiles
- **Site de production** : https://prima-five.vercel.app
- **Repository GitHub** : https://github.com/KangaFranck/projet-prima
- **Dashboard Vercel** : https://vercel.com/dashboard

### Prochaines étapes
1. Tester toutes les fonctionnalités
2. Configurer un domaine personnalisé
3. Mettre en place le monitoring
4. Optimiser les performances
5. Ajouter des fonctionnalités

---

**Prima Center** - Le centre commercial de référence à Abidjan 🇨🇮
