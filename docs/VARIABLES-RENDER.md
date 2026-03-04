# Variables d'environnement Render

À renseigner dans **Render** → ton service → **Environment**.

---

## Obligatoire

| Nom | Valeur |
|-----|--------|
| `NODE_ENV` | `production` |

`PORT` est injecté automatiquement par Render ; ne pas le définir.

---

## Neon (base de données PostgreSQL)

| Nom | Où la trouver |
|-----|----------------|
| `DATABASE_URL` | Neon Dashboard → Connection string (format URI avec `?sslmode=require`) |

---

## Cloudflare R2 (photos, logos)

Les 5 variables doivent être définies pour activer R2 :

| Nom | Où la trouver |
|-----|----------------|
| `R2_ACCOUNT_ID` | Cloudflare → R2 → Account ID |
| `R2_ACCESS_KEY_ID` | R2 → Manage R2 API Tokens → Create token → Access Key ID |
| `R2_SECRET_ACCESS_KEY` | Même écran, Secret Access Key (affiché une seule fois) |
| `R2_BUCKET` | Nom du bucket R2 |
| `R2_PUBLIC_URL` | URL publique du bucket (ex. `https://pub-xxxxx.r2.dev`) |

---

## Optionnel

| Nom | Exemple |
|-----|---------|
| `CORS_ORIGIN` | `https://prima-liwx.onrender.com` (URL du frontend, sans slash final) |
| `JWT_SECRET` | Une longue chaîne aléatoire |
| `JWT_EXPIRATION` | `24h` |

---

Voir **`server/.env.render.example`** pour un exemple complet.
