# Déploiement de l’API PrimaCenter sur Railway (via GitHub)

Railway héberge le **backend Express** (API boutiques, restaurants, loisirs). Une fois le repo connecté et le dossier **server** indiqué, **Railway détecte tout automatiquement** (build + start). Tu n’as qu’à **renseigner les variables d’environnement**.

---

## 1. Prérequis

- Compte [Railway](https://railway.app) (connexion GitHub).
- Repo GitHub **KangaFranck/prima** à jour.
- **Base de données** : [Neon](https://neon.tech) (PostgreSQL) **ou** MongoDB (Atlas). Le serveur utilise **Neon** si `DATABASE_URL` est défini, sinon `MONGODB_URI`.
- **Médias (photos, logos)** : optionnellement [Cloudflare R2](https://developers.cloudflare.com/r2/) ; sinon stockage local (dossier `uploads/`).

---

## 2. Créer le projet sur Railway

1. Va sur **[railway.app](https://railway.app)** et connecte-toi avec **GitHub**.
2. **New Project** → **Deploy from GitHub repo**.
3. Choisis le dépôt **KangaFranck/prima** (autorise l’accès si demandé).
4. Railway crée un premier service. On va le configurer pour le dossier **server**.

---

## 3. Configurer le service (backend)

1. Clique sur le service déployé.
2. Onglet **Settings** :
   - **Root Directory** : **obligatoire** — indique **`server`**. Sans ça, Railway build depuis la racine du repo (frontend) et l’erreur « npm could not be found » apparaît.
   - **Start Command** : laisse vide (le projet utilise `node dist/index.js` via Procfile / nixpacks). Si un champ existe et contient `npm start`, remplace par **`node dist/index.js`**.
   - **Build Command** : ne rien remplir (déjà dans `server/`).
   - **Watch Paths** : optionnel (`server/**`).

3. **Variables** (Settings → **Variables**) — **c’est la seule chose à renseigner** :

   **Base de données (un des deux)**  
   | Variable | Valeur | Obligatoire |
   |----------|--------|-------------|
   | `DATABASE_URL` | URI Neon (ex. `postgresql://user:pass@ep-xxx.aws.neon.tech/neondb?sslmode=require`) | Si tu utilises **Neon** |
   | `MONGODB_URI`  | URI MongoDB Atlas (ex. `mongodb+srv://user:pass@cluster.xxx.mongodb.net/primacenter?retryWrites=true&w=majority`) | Si tu n’utilises **pas** Neon |

   **Médias (Cloudflare R2, optionnel)** — si toutes sont définies, les photos/logos sont stockés sur R2.  
   | Variable | Valeur |
   |----------|--------|
   | `R2_ACCOUNT_ID` | ID compte Cloudflare |
   | `R2_ACCESS_KEY_ID` | Clé d’accès R2 |
   | `R2_SECRET_ACCESS_KEY` | Clé secrète R2 |
   | `R2_BUCKET` | Nom du bucket |
   | `R2_PUBLIC_URL` | URL publique du bucket (ex. `https://pub-xxx.r2.dev` ou domaine perso) |

   **Autres**  
   | Variable | Valeur | Obligatoire |
   |----------|--------|-------------|
   | `NODE_ENV` | `production` | Oui |
   | `JWT_SECRET` | Longue chaîne aléatoire | Oui |
   | `JWT_EXPIRATION` | `24h` | Non |
   | `CORS_ORIGIN` | URL du **frontend** (sans slash final) | Oui |
   | `UPLOAD_DIR` | `uploads` (si pas R2) | Non |

   **Important :** Railway définit **`PORT`** ; ne pas le mettre dans les variables.  
   Exemple complet : voir `server/.env.railway.example`.

4. **Domain** : dans **Settings** → **Networking** → **Generate Domain**. Tu obtiens une URL du type `https://votreservice-production-xxxx.up.railway.app`. Note-la.

---

## 4. Premier déploiement

1. Sauvegarde les réglages (Root Directory = `server`, variables).
2. Railway lance le build puis le start. Les logs doivent afficher :
   - `Serveur démarré sur le port XXXX`
   - `Base de données : Neon (PostgreSQL)` si `DATABASE_URL` est défini, ou `Connecté à MongoDB` si `MONGODB_URI` est utilisé.

3. Teste l’API :
   - **Santé :** `https://TON-DOMAINE.up.railway.app/api/health` → doit renvoyer `{"status":"ok","port":...}`.
   - **Test :** `https://TON-DOMAINE.up.railway.app/api/test` → `{"message":"API fonctionne correctement"}`.

---

## 5. Connecter le frontend

1. Dans le projet **frontend** (Vercel ou autre), définis la variable d’environnement :
   - **`VITE_API_URL`** = `https://TON-DOMAINE.up.railway.app/api`  
   (remplace par ton URL Railway **sans** `/api` à la fin si ton front ajoute déjà `/api` ; ici on met l’URL de base de l’API, souvent avec `/api`.)

2. Dans Railway, **CORS_ORIGIN** doit être exactement l’URL d’origine du frontend (ex. `https://prima-kanga.vercel.app`), sans slash final.

3. Redéploie le frontend pour que la nouvelle `VITE_API_URL` soit prise en compte.

---

## 6. Déploiements automatiques (GitHub)

À chaque **push** sur la branche suivie (souvent `master`), Railway redéploie automatiquement si le service est lié au repo et que le **Root Directory** est `server`.

---

## 7. Dépannage

| Problème | Piste |
|----------|--------|
| **« The executable npm could not be found »** (Deploy > Create container) | 1) **Root Directory** doit être **`server`** (Settings). 2) **Start Command** dans Settings : vide ou **`node dist/index.js`** (pas `npm start`). 3) Puis redéployer. |
| Build échoue (tsc / modules) | Vérifier que **Root Directory** = `server`. Vérifier les logs de build. |
| « PORT non défini » | Ne pas définir `PORT` dans les variables ; Railway l’injecte. |
| CORS / requêtes bloquées | Vérifier que `CORS_ORIGIN` = URL exacte du front (sans slash final). |
| 503 / pas de réponse | Vérifier les logs (démarrage, Neon ou MongoDB). Si Neon : `DATABASE_URL` ; si Mongo : `MONGODB_URI` et IP Atlas 0.0.0.0/0. |
| Fichiers uploadés perdus | Sur Railway le disque est éphémère. Définir **R2_*** pour stocker les médias sur Cloudflare R2. |
| Erreur « relation does not exist » (Neon) | Exécuter une fois le schéma SQL : `server/src/db/schema.sql` dans le SQL Editor du dashboard Neon. |

---

## Résumé

- **Toi tu fais** : connecter le repo GitHub, mettre **Root Directory** = `server` une fois, puis **remplir uniquement les variables d’environnement**. Railway gère le reste (build + start).
- **Frontend** : `VITE_API_URL` = URL Railway de l’API ; **CORS_ORIGIN** sur Railway = URL du frontend.
- **Base de données** : **Neon** (`DATABASE_URL`) ou **MongoDB** (`MONGODB_URI`). Avec Neon, exécuter une fois `server/src/db/schema.sql` dans le SQL Editor Neon.
- **Médias** : **Cloudflare R2** (variables `R2_*`) pour photos/logos persistants ; sinon stockage local (éphémère sur Railway).
