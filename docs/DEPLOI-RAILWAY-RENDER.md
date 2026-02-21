# Déploiement sans Vercel (Render / Railway)

Pour éviter les 404/405 avec les serverless Vercel, tu peux héberger **tout le projet** (frontend + API) sur **Render** (ou Railway) avec un **seul serveur Node**.

## Principe

- **Build** : `npm run build` (génère `dist/` + le code API est déjà en TypeScript).
- **Démarrage** : `npm run start` lance `server.ts`, qui :
  - sert l’API sur `/api/*` (même logique que `api/routes.ts`) ;
  - sert les fichiers statiques depuis `dist/` (SPA React).

Aucune config serverless, aucun rewrite : un seul process Node. Render fournit `PORT`, le serveur l’utilise automatiquement.

---

## Render (étape par étape)

1. Va sur **[render.com](https://render.com)** et connecte ton compte **GitHub**.
2. **New +** → **Web Service**.
3. Connecte le repo **KangaFranck/prima** (s’il n’apparaît pas, autorise Render à accéder au repo).
4. Paramètres du service :
   - **Name** : `prima-center` (ou autre).
   - **Region** : choisir la plus proche (ex. Frankfurt).
   - **Branch** : `main` ou `master` selon ta branche par défaut.
   - **Root Directory** : laisser **vide**.
   - **Runtime** : **Node**.
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm run start`
5. **Environment** (variables d’environnement) — **Add Environment Variable** :
   - `DATABASE_URL` = ton URL Neon (PostgreSQL), ex. `postgresql://user:pass@host/db?sslmode=require`
   - `JWT_SECRET` = une chaîne secrète (ex. `prima_secret_xxx`)
   - `ALLOWED_ORIGINS` = l’URL du service **sans slash final**. Au premier déploiement tu peux mettre `https://prima-center.onrender.com` (adapter au nom du service). Après le premier déploiement, Render affiche l’URL réelle ; si différente, mets-la dans `ALLOWED_ORIGINS` et redéploie.
   - Si tu utilises R2 (uploads) : ajoute les variables présentes dans ton `.env` (ex. `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_ENDPOINT`, etc.).
6. **Create Web Service**. Render lance le build puis le serveur. La première fois, le build peut prendre 2–3 min.
7. Une fois en ligne, ouvre l’URL du service (ex. `https://prima-center.onrender.com`) puis :
   - Page d’accueil : OK  
   - `https://prima-center.onrender.com/api/health` → doit renvoyer `{"ok":true,"api":"prima-center",...}`  
   - Login admin : même origine, pas de CORS.

**Option Blueprint :** le fichier `render.yaml` à la racine du repo peut être utilisé par Render pour pré-remplir la config (Blueprint → New Blueprint Instance → repo prima).

---

## Railway

1. Va sur [railway.app](https://railway.app), connecte GitHub.
2. **New Project** → **Deploy from GitHub repo** → choisis `KangaFranck/prima`.
3. Paramètres du service :
   - **Root Directory** : laisser vide.
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm run start`
   - **Variables** : `DATABASE_URL`, `JWT_SECRET`, `ALLOWED_ORIGINS` (URL Railway sans slash final), + R2 si besoin.
4. Déploie ; URL du type `https://xxx.up.railway.app`.

---

## Test en local (comme en prod)

```bash
npm run build
npm run start
```

Puis ouvre http://localhost:3000 (ou le port indiqué).  
- Front : http://localhost:3000  
- API health : http://localhost:3000/api/health  
- Login : même origine, pas de souci CORS.

---

## Arrêter d’utiliser Vercel pour ce projet

- Dans Vercel : Settings du projet → tu peux supprimer le projet ou le laisser inactif.
- Le site et l’API tournent uniquement sur Railway (ou Render). Une seule URL, plus de 404/405 liés aux serverless.
