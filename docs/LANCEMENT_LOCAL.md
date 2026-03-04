# Test en local avant déploiement Vercel

Ce guide permet de faire tourner **Prima Center** en local avec l’API Neon + R2 (sans PocketBase), comme en production.

## Prérequis

- Node.js 18+
- Un projet **Neon** avec le schéma appliqué (`scripts/neon-schema.sql`)
- (Optionnel) Compte **Cloudflare R2** pour les uploads de médias

## 1. Variables d’environnement

Créez un fichier **`.env.local`** à la racine du projet (ou copiez depuis `.env.example`) :

```env
# Obligatoire : BDD Neon
DATABASE_URL=postgresql://user:password@host.neon.tech/neondb?sslmode=require

# Obligatoire : JWT pour l’auth admin
JWT_SECRET=une-cle-secrete-longue-et-aleatoire

# CORS (origines autorisées)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Optionnel : R2 (uploads). Si absent, l’API renverra une erreur sur POST /api/upload
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=prima-center-media
R2_PUBLIC_URL=https://pub-xxxx.r2.dev
```

Pour que le **frontend** utilise l’API au lieu de PocketBase, ajoutez (dans `.env.local` ou dans un fichier chargé par Vite, ex. `.env.development`) :

```env
# URL de l’API. Avec « vercel dev », l’API est sur le port 3000.
VITE_API_URL=http://localhost:3000
```

Sans `VITE_API_URL`, le front continuera d’utiliser PocketBase (nécessite `npm run pb:serve`).

## 2. Créer un admin (une seule fois)

À la racine du projet :

```bash
npm run seed:admin
```

Par défaut, le script crée ou met à jour l’admin :

- **Email :** `communicationprimacenter@gmail.com`
- **Mot de passe :** `Pr!ma@center#2025`

Pour un autre compte :

```bash
node scripts/seed-admin.js votre@email.com VotreMotDePasse
```

Ou définissez `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` dans `.env.local` et relancez `npm run seed:admin`.

## 3. Lancer l’application en local (recommandé : 2 terminaux)

Même principe qu’avec PocketBase : **un processus pour l’API, un pour le front**.

**Terminal 1 — API (Neon + R2) :**
```bash
npm run api
```
→ Affiche `API locale: http://localhost:3001`

**Terminal 2 — Front (Vite) :**
```bash
npm run dev
```
→ Ouvre **http://localhost:5173** dans le navigateur.

- **Frontend :** http://localhost:5173
- **API :** http://localhost:3001 (health : http://localhost:3001/api/health)
- Le fichier `.env.development` définit déjà `VITE_API_URL=http://localhost:3001`, donc le front appelle la bonne API.

Alternative (un seul port, si ça fonctionne chez toi) : `npm run vercel-dev` puis ouvre l’URL indiquée dans le terminal. En cas de souci (SPA au lieu de JSON sur `/api/health`), utilise la méthode 2 terminaux ci-dessus.

## 4. Vérifier la connectivité (Neon + R2)

Comme avec PocketBase (vérifier que le serveur répond), tu peux tester que **Neon** et **Cloudflare R2** sont joignables :

1. Lance **`npm run api`** (Terminal 1) puis **`npm run dev`** (Terminal 2).
2. Ouvre **http://localhost:3001/api/health** (API) et **http://localhost:5173** (site).
3. Tu dois voir un JSON du type :
   - **`"database": "ok"`** → Neon est connecté.
   - **`"r2": "ok"`** → R2 (Cloudflare) est joignable.
   - Si l’un des deux est en erreur, le champ indiquera `"error": "..."` et `ok` sera `false`.

C’est l’équivalent de vérifier que PocketBase répond sur le port 8090.

## Dépannage : « Réponse serveur invalide (non-JSON) » au login

- Vérifiez que **`.env`** (ou **`.env.local`**) est bien à la **racine** du projet (à côté de `package.json`) avec au minimum **`DATABASE_URL`** et **`JWT_SECRET`**.
- Arrêtez `vercel dev` (Ctrl+C), puis relancez **`npm run vercel-dev`**.
- Ouvrez **uniquement** l’URL indiquée dans le terminal (ex. http://localhost:3000).
- Optionnel : exécutez **`vercel env pull`** pour créer `.env.local` à partir des variables du projet Vercel.

## 5. Vérifications

1. **Connexion admin**  
   Allez sur la page de login du back-office et connectez-vous avec l’email/mot de passe de l’admin seedé.  
   Si `VITE_API_URL` est bien défini, la requête part vers `/api?path=auth/login`.

2. **Listes publiques**  
   Pages Boutiques, Restaurants, Loisirs, Événements : les données viennent de Neon via `GET /api?path=boutiques`, etc.

3. **CRUD + upload**  
   Création / édition d’une boutique, restaurant, loisir ou événement avec image :  
   - Les fichiers sont envoyés en base64 à `POST /api?path=upload`, qui renvoie une URL (R2).  
   - Puis création/mise à jour avec cette URL dans les champs `*_url`.

## 6. Déploiement sur Vercel

- Dans le projet Vercel, configurez les **Variables d’environnement** :  
  `DATABASE_URL`, `JWT_SECRET`, `ALLOWED_ORIGINS`, et les variables R2 si vous utilisez les uploads.
- Pour la **production**, vous pouvez :
  - Soit laisser **`VITE_API_URL`** vide (ou non définie) : le front utilisera des requêtes relatives (`/api?path=...`), donc le même domaine que le déploiement.
  - Soit définir `VITE_API_URL` sur l’URL du déploiement (ex. `https://votre-app.vercel.app`) si vous servez le front ailleurs.
- Déployez comme d’habitude (push ou `vercel --prod`).

## Résumé des commandes

| Commande            | Rôle                                  |
|---------------------|----------------------------------------|
| `npm run vercel-dev`| Front + API en local (un seul port)   |
| `npm run seed:admin`| Créer ou mettre à jour l’admin Neon   |
| `npm run dev`       | Front seul (Vite), si pas de vercel dev |
| `npm run pb:serve`  | PocketBase (si vous n’utilisez pas l’API) |
