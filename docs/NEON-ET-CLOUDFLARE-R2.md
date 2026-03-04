# Neon (BD) et Cloudflare R2 (médias)

L’API PrimaCenter peut utiliser **Neon** pour la base de données et **Cloudflare R2** pour les photos et logos.

---

## Neon (PostgreSQL)

1. **Créer un projet** sur [neon.tech](https://neon.tech) et noter l’URI de connexion (format `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`).

2. **Créer les tables** : dans le dashboard Neon, aller dans **SQL Editor** et exécuter le contenu du fichier **`server/src/db/schema.sql`** (tables `boutiques`, `restaurants`, `loisirs`).

3. **Variable d’environnement** (Railway, Vercel, ou `.env` local) :
   ```bash
   DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
   Dès que `DATABASE_URL` est défini, le serveur utilise Neon au lieu de MongoDB (`MONGODB_URI`).

---

## Cloudflare R2 (photos, logos)

1. **Créer un bucket R2** dans le [dashboard Cloudflare](https://dash.cloudflare.com) → **R2** → **Create bucket**.

2. **Activer l’accès public** (pour que les URLs des images soient accessibles) :
   - Soit activer **Public access** sur le bucket et noter l’URL (type `https://pub-xxxx.r2.dev`).
   - Soit attacher un **domaine personnalisé** au bucket.

3. **Créer des identifiants API** : **R2** → **Manage R2 API Tokens** → **Create API token** (permissions : Object Read & Write). Noter **Access Key ID**, **Secret Access Key**, et l’**Account ID** (visible dans l’URL ou dans Overview).

4. **Variables d’environnement** (toutes requises pour activer R2) :
   ```bash
   R2_ACCOUNT_ID=ton_account_id
   R2_ACCESS_KEY_ID=cle_acces
   R2_SECRET_ACCESS_KEY=cle_secrete
   R2_BUCKET=nom_du_bucket
   R2_PUBLIC_URL=https://pub-xxxx.r2.dev
   ```
   Si **toutes** ces variables sont définies, les uploads (logo, images) sont envoyés sur R2 et l’API renvoie les URLs publiques. Sinon, les fichiers sont stockés en local (dossier `uploads/`).

---

## Résumé

| Besoin        | Variable(s)              | Effet                          |
|---------------|--------------------------|--------------------------------|
| BD PostgreSQL | `DATABASE_URL` (Neon)    | Utilise Neon au lieu de Mongo  |
| Médias R2     | `R2_*` (les 5)           | Stockage des photos/logos sur R2 |

Voir aussi **`server/.env.railway.example`** pour un exemple complet et **`docs/RAILWAY.md`** pour le déploiement sur Railway.
