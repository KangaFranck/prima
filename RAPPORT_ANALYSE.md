# Rapport d'analyse – Prima Center

> **Stack actuelle** : Neon (PostgreSQL) + Cloudflare R2. MongoDB et PocketBase ne sont plus utilisés.

## 1. FAILLES DE SÉCURITÉ

### 🔴 CRITIQUE – Secrets exposés

| Fichier | Problème |
|---------|----------|
| **`projet-prima-main/api/db.ts`** | URI MongoDB complète en fallback : `mongodb+srv://franckkanga0707:csNtNgcYQp2raCoq@...` |
| **`projet-prima-main/vercel.json`** | `MONGODB_URI` et `JWT_SECRET` en clair (lignes 43-44) |
| **`projet-prima-main/DEPLOYMENT.md`** | Documentation avec identifiants MongoDB |
| **`server/.env.backup`** | Contient des identifiants (ignoré par Git via `*.backup`) |

### 🔴 CRITIQUE – Mots de passe en dur

| Fichier | Problème |
|---------|----------|
| **`scripts/testAuth.js`** | `communicationprimacenter@gmail.com` + `Prima@center2025` |
| **`scripts/seed-admin.js`** | Mot de passe par défaut : `Pr!ma@center#2025` |
| **`src/services/pbAuthService.ts`** | Mot de passe admin : `Pr!ma@center#2025` |
| **`src/services/userSyncService.ts`** | Mot de passe : `admin123` |

### 🟠 MOYEN – projet-prima-main (dossier dupliqué)

- Copie de l’ancienne version du projet
- Contient `.env`, `.env.production` avec secrets
- `api/auth.ts`, `api/auth/register.ts` : `admin123` en dur
- `projet-prima-main/src/pages/Login.tsx` : mot de passe affiché en clair
- **Recommandation** : supprimer ce dossier ou le retirer du dépôt Git

### 🟡 À surveiller

- **Route `/api/debug`** : accessible sans auth, à désactiver en production
- **CORS** : en cas d’erreur, l’origine peut être `*`
- **JWT_SECRET** : s’assurer qu’il est défini en production

---

## 2. FICHIERS INUTILES OU OBSOLÈTES

### Dossier `projet-prima-main/` (entier)

- **~150 fichiers** trackés dans Git
- Non référencé par le projet principal
- Duplication complète de l’ancienne version
- **Action** : supprimer du dépôt

### Fichiers `.skip`

- `server/auth/login.ts.skip`
- `server/auth/register.ts.skip`  
→ Fichiers désactivés, non utilisés

### Fichiers de backup / temporaires

- `server/.env.backup` (déjà ignoré par Git)
- `projet-prima-main/carousel_*.txt`, `new_*.txt`, `*.ps1` (scripts de fix ponctuels)

### Imports inutilisés

- **`src/App.tsx`** : `Menu, ShoppingBag, Phone, MapPin, Clock, ChevronRight, Facebook, Instagram, Twitter` (lucide-react) non utilisés

### Composants de test (projet-prima-main)

- `projet-prima-main/src/components/AuthTest.tsx`
- `projet-prima-main/src/components/AdminTest.tsx`
- `projet-prima-main/src/test-api.ts`

---

## 3. ACTIONS PRIORITAIRES

### Sécurité (urgent)

1. **Révoquer** le mot de passe MongoDB et générer une nouvelle clé
2. **Supprimer** `server/.env.backup` du disque
3. **Utiliser des variables d’environnement** pour tous les secrets (voir `.env.example`)
4. **Retirer** les secrets de `projet-prima-main/vercel.json` si ce dossier est conservé

### Nettoyage

1. Supprimer le dossier `projet-prima-main/` du dépôt
2. Supprimer `server/auth/*.skip`
3. Nettoyer les imports inutilisés dans `App.tsx`

---

## 4. MIGRATION NEON + CLOUDFLARE (MongoDB / PocketBase obsolètes)

### Code mort à supprimer

| Élément | Fichiers / Emplacements |
|---------|-------------------------|
| **PocketBase** | `pbClient.ts`, chemins PocketBase dans `pbAuthService`, `userSyncService`, stores, `Settings.tsx` |
| **MongoDB / Mongoose** | `server/src/` (models Mongoose), `server/package.json` (mongoose), `package.json` (mongoose) |
| **Scripts obsolètes** | `pb:serve`, `pb:rules`, `migrate:pb`, `testAuth.js`, `createAdmin.js`, `migratePocketBase.js` |
| **Dossier projet-prima-main** | Copie obsolète avec MongoDB/PocketBase |

### Déploiement

- **Vercel** : utilise `server/routes.ts` (Neon + R2) ✅
- **Render** : `render.yaml` pointe vers `server/` (Express + Mongoose). À migrer vers la racine (`server.ts` + `server/routes.ts`) avec `DATABASE_URL` (Neon).
