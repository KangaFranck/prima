# Audit du backend (prima)

## Structure actuelle

Le projet contient **deux backends** :

1. **Express (server/src/)** — utilisé par **Railway**
   - Point d’entrée : `server/src/index.ts`
   - Compilé par `tsconfig` (`include: ["src/**/*"]`)
   - Routes : `/api/restaurants`, `/api/boutiques`, `/api/loisirs`
   - BD : Neon (si `DATABASE_URL`) ou MongoDB (sinon)
   - Médias : Cloudflare R2 (si variables `R2_*`) ou dossier `uploads/`

2. **Vercel serverless (api/ + server/ à la racine)**
   - `vercel.json` appelle `api/index.ts` → `server/routes.ts`
   - Utilisé par **Vercel** (build avec `includeFiles: server/**`)
   - Fichiers utilisés : `server/routes.ts`, `server/db.ts`, `server/middleware/auth.ts`, `server/lib/r2.ts`, `server/lib/mappers.ts`
   - Login : `api/login.ts` (standalone, Neon + JWT)

---

## Fichiers inutilisés ou cassés (server/ à la racine)

Ces fichiers **ne sont pas référencés** par `server/routes.ts` ni par `api/`. Plusieurs importent `dbConnect` depuis `./db`, alors que **`server/db.ts` n’exporte que `sql` (Neon)** et pas de `dbConnect`. Ils sont donc **cassés** en cas d’exécution.

| Fichier | Raison |
|--------|--------|
| `server/boutiques.ts` | Importe `dbConnect` (inexistant) + Mongoose. Jamais appelé par Vercel. |
| `server/restaurants.ts` | Idem |
| `server/loisirs.ts` | Idem |
| `server/evenements.ts` | Idem |
| `server/infos.ts` | Idem |
| `server/auth.ts` | Idem + `User` model |
| `server/test-db.ts` | Importe `dbConnect`. Script de test. |
| `server/test.ts` | Script de test Vercel. |
| `server/debug.ts` | Debug ; la route debug est déjà dans `routes.ts`. |
| `server/config.ts` | Jamais importé nulle part. |
| `server/auth/login.ts` | Login Vercel = `api/login.ts` (racine), pas ce fichier. |
| `server/models/User.ts` | Utilisé uniquement par `auth.ts` (cassé). |
| `server/models/Restaurant.ts` | Utilisé uniquement par `restaurants.ts` (cassé). |
| `server/models/Boutique.ts` | Utilisé uniquement par `boutiques.ts` (cassé). |
| `server/models/Loisir.ts` | Utilisé uniquement par `loisirs.ts` (cassé). |
| `server/models/Info.ts` | Utilisé uniquement par `infos.ts` (cassé). |
| `server/models/Evenement.ts` | Utilisé uniquement par `evenements.ts` (cassé). |

**Recommandation :** supprimer tous ces fichiers pour éviter la confusion et le code mort. La stack Vercel repose sur `routes.ts` + Neon + `lib/mappers` + `lib/r2`, pas sur ces handlers Mongoose.

---

## Doublons

- **Modèles** : `server/models/` (racine, Mongoose, pour handlers cassés) vs `server/src/models/` (Boutique, Restaurant, Loisir — utilisés par l’Express **src**). Seuls ceux dans `src/` sont utilisés par le backend Railway.
- **R2** : `server/lib/r2.ts` (Vercel, utilisé par `routes.ts`) vs `server/src/lib/r2.ts` (Express, utilisé par les controllers **src**). Les deux sont utilisés mais par des backends différents ; pas un doublon à supprimer, mais à savoir.
- **Neon** : `server/db.ts` (Vercel) vs `server/src/db/neon.ts` (Express). Même remarque.

---

## Nettoyage dans server/src

- **`server/src/index.ts`** : déclaration locale de `multer` (storage + upload) et import de `path` **non utilisés**. Les routes utilisent `uploadBoutique`, `uploadRestaurant`, `uploadLoisir` depuis `middleware/upload.ts`. À supprimer : le bloc multer/path inutile dans `index.ts`.

---

## Fichiers à conserver

**Express (server/src/)**  
- `src/index.ts` (sans le multer/path inutile)  
- `src/routes/*.ts`, `src/controllers/*.ts`, `src/models/Boutique|Restaurant|Loisir.ts`  
- `src/db/neon.ts`, `src/db/*.neon.ts`, `src/db/schema.sql`  
- `src/lib/r2.ts`, `src/middleware/upload.ts`, `src/middleware/validation.ts`  
- `src/types/*.d.ts`

**Vercel (server/ racine + api/)**  
- `server/routes.ts`, `server/db.ts`, `server/middleware/auth.ts`  
- `server/lib/r2.ts`, `server/lib/mappers.ts`  
- `api/index.ts`, `api/login.ts`, `api/health.js` (si utilisé)

---

## Résumé des actions effectuées

1. **Supprimés** : `server/boutiques.ts`, `server/restaurants.ts`, `server/loisirs.ts`, `server/evenements.ts`, `server/infos.ts`, `server/auth.ts`, `server/test.ts`, `server/test-db.ts`, `server/debug.ts`, `server/config.ts`, `server/auth/login.ts`, et tous les modèles dans `server/models/` (User, Restaurant, Boutique, Loisir, Info, Evenement).
2. **Nettoyé** : `server/src/index.ts` — suppression des imports et du code multer/path inutilisés (l’upload est géré par `middleware/upload.ts` dans les routes).

Les dossiers `server/auth/` et `server/models/` peuvent être vides ; tu peux les supprimer à la main si besoin.

**État après nettoyage**  
- **Express (Railway)** : `server/src/` uniquement.  
- **Vercel** : `server/routes.ts`, `server/db.ts`, `server/middleware/auth.ts`, `server/lib/r2.ts`, `server/lib/mappers.ts` + `api/index.ts`, `api/login.ts`.
