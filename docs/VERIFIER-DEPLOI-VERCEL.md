# Vérifier pourquoi /api/login renvoie 404

Tes **variables d'environnement sont correctes** (DATABASE_URL, JWT_SECRET, ALLOWED_ORIGINS, R2).  
La 404 signifie que la **fonction serverless** `/api/login` n'existe pas sur le déploiement.

**Solution issue de la doc Vercel :** avec un projet **Vite**, le Framework Preset peut faire que Vercel ne déploie que le build statique et **ignore le dossier `api/`**. Il faut forcer **Framework = Other** pour que la section `builds` (static + api) soit appliquée.
- Dans le repo : `vercel.json` contient **`"framework": null`** pour forcer "Other".
- Dans le **dashboard Vercel** : **Settings** → **General** → **Framework Preset** → choisir **Other** (pas Vite), puis **Redeploy**.

---

## 1. Projet et branche

- Dans **Vercel** → projet qui a le domaine **prima-six-eta.vercel.app**.
- **Settings** → **Git** :
  - **Repository** = `KangaFranck/prima` (ou le bon repo).
  - **Production Branch** = `main` ou `master` (celle où tu push).
- **Settings** → **General** → **Root Directory** = **vide** (ne pas mettre de dossier).  
  Si un dossier est indiqué, Vercel build depuis ce sous-dossier et ne voit pas ton `api/` à la racine → 404.
- **Settings** → **General** → **Framework Preset** = **Other**.  
  Si c’est sur **Vite**, Vercel peut ne déployer que le front et ignorer les fonctions dans `api/` → 404. Avec **Other**, le `vercel.json` (builds + rewrites) est bien pris en compte.

---

## 2. Dernier déploiement

- **Deployments** → cliquer sur le **dernier déploiement**.
- Vérifier que le **commit** est bien celui qui contient `api/login.ts` et le `vercel.json` avec `api/login` dans les builds.
- Onglet **Building** (ou logs) : vérifier qu’il n’y a pas d’erreur sur les fonctions (`api/login.ts`, etc.).
- S’il existe un onglet **Functions** : vérifier que **api/login** (et éventuellement api/debug, api/routes) apparaissent.

---

## 3. Déployer depuis ta machine (recommandé)

Pour être sûr que le code local (avec `api/login.ts`) est déployé :

```powershell
cd "c:\Users\DELL\Desktop\Prima-center"
npx vercel --prod
```

- Choisir le bon **projet** (celui lié à prima-six-eta.vercel.app) si demandé.
- À la fin, Vercel donne une URL : ouvre **prima-six-eta.vercel.app** (ou l’URL indiquée) et réessaie le login.

Cela force un déploiement à partir du dossier actuel, avec le `vercel.json` et le dossier `api/` présents.

---

## 4. Résumé

| À vérifier | Où | Bonne valeur |
|------------|-----|--------------|
| Repo connecté | Settings → Git | KangaFranck/prima |
| Branche de prod | Settings → Git | main ou master |
| Root Directory | Settings → General | **vide** |
| Dernier commit | Deployments | Celui avec api/login.ts |
| Déploiement forcé | Terminal | `npx vercel --prod` |

Une fois **Root Directory** vide et un déploiement fait depuis le bon commit (ou avec `vercel --prod`), **/api/login** doit répondre et le login peut fonctionner.
