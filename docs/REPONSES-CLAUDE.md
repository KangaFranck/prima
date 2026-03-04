# Réponses pour Claude (diagnostic Vercel / api/health)

## 1. Quel framework tu utilises ?

**Frontend** : **Vite + React** (TypeScript). Pas Next.js, pas Express.  
**API** : dossier **`api/`** avec des **Serverless Functions Vercel** (@vercel/node) : 3 points d’entrée (`api/health.js`, `api/login.ts`, `api/index.ts`). Le reste de la logique API est dans **`server/`** à la racine (Neon, JWT, routes).  
En local, l’API est servie par un script **`scripts/serve-api.ts`** (Node + tsx) qui importe `server/routes`.

---

## 2. Comment est structuré ton projet ? (arborescence)

```
Prima-center/
├── api/                    # 3 fichiers uniquement (limite 12 fonctions Hobby)
│   ├── health.js           # GET /api/health
│   ├── login.ts            # POST /api/login
│   └── index.ts            # point d’entrée unique (rewrite /api/* → ici, query path=...)
├── server/                 # logique API partagée (Neon, JWT, routes, middleware, lib)
│   ├── routes.ts
│   ├── db.ts
│   ├── middleware/
│   ├── lib/
│   ├── auth.ts
│   ├── models/
│   └── ...
├── src/                    # front React (Vite)
│   ├── App.tsx
│   ├── pages/
│   ├── components/
│   ├── services/
│   └── ...
├── scripts/
│   └── serve-api.ts        # serveur API local (port 3002)
├── vercel.json             # framework: null, builds [static + api/health.js, api/login.ts, api/index.ts], rewrites
├── package.json
└── dist/                   # sortie du build Vite (buildCommand)
```

- **Build** : `npm run build` → `tsc && vite build` → sortie dans `dist/`.
- **Vercel** : `vercel.json` avec `builds` (1 build static package.json → dist, 3 fonctions dans `api/`), `rewrites` pour `/api/*` → `/api/index?path=...` (sauf `/api/health` et `/api/login` qui ont leur propre fonction).

---

## 3. C’est quoi le contenu de ton fichier `health` ?

Le fichier s’appelle **`api/health.js`** (pas `health.ts`). Contenu :

```js
/**
 * GET /api/health — Handler Node pour @vercel/node (builds explicites).
 */
export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ ok: true, message: 'API Vercel OK' });
}
```

En local, `/api/health` est géré soit par ce handler (si on charge les routes Vercel), soit par le même `server/routes` qui expose un endpoint health avec `database` et `r2` (Neon + R2). Sur Vercel, la fonction déployée est bien **`api/health.js`** (déclarée dans `builds`).

---

**Contexte du problème** : en local, `http://localhost:3002/api/health` répond bien. Sur Vercel (prima-kanga.vercel.app), `/api/health` renvoie **404**. Plan Hobby (max 12 Serverless Functions) ; on a réduit à 3 fonctions dans `api/` et déplacé le reste dans `server/`. On a aussi mis `framework: null` dans `vercel.json` pour que la config (builds + rewrites) soit bien prise en compte.
