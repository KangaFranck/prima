# Vercel + Neon : faire fonctionner l’admin (connexion à la base)

Sur **Render**, l’API a accès aux variables d’environnement (DATABASE_URL, JWT_SECRET, etc.) donc la connexion à Neon fonctionne et tu peux te connecter à l’interface admin.

Sur **Vercel**, si tu ne peux pas te connecter à l’admin, c’est en général parce que **les variables d’environnement ne sont pas définies** pour le projet Vercel. L’API tourne bien, mais sans `DATABASE_URL` elle ne peut pas joindre Neon.

---

## 1. Variables à configurer sur Vercel

Dans **Vercel** → ton projet → **Settings** → **Environment Variables**, ajoute les mêmes variables que sur Render (ou que dans ton `.env` local) :

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `DATABASE_URL` | **Oui** | URL de connexion Neon (ex. `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`) |
| `JWT_SECRET` | **Oui** | Clé secrète pour les tokens admin (même valeur que sur Render) |
| `ALLOWED_ORIGINS` | Recommandé | Origines CORS, ex. `https://ton-site.vercel.app` (sans slash final) |
| `R2_ACCOUNT_ID` | Si tu utilises les uploads | Compte Cloudflare R2 |
| `R2_ACCESS_KEY_ID` | Si tu utilises les uploads | Clé d’accès R2 |
| `R2_SECRET_ACCESS_KEY` | Si tu utilises les uploads | Secret R2 |
| `R2_BUCKET_NAME` | Si tu utilises les uploads | Nom du bucket |
| `R2_PUBLIC_URL` | Optionnel | URL publique du bucket (pour afficher les images) |

- Coche **Production**, **Preview** et **Development** pour que ça marche sur tous les déploiements.
- Après avoir ajouté ou modifié des variables, **redéploie** le projet (Deployments → … → Redeploy).

---

## 2. Vérifier que l’API voit bien Neon

Une fois déployé :

1. **Santé API + base**  
   Ouvre dans le navigateur :  
   `https://ton-projet.vercel.app/api/health`  
   - Si la base est OK, tu verras quelque chose comme :  
     `{"ok":true,"api":"prima-center","database":"ok","r2":"ok"}`  
   - Si `database` contient une erreur, c’est que `DATABASE_URL` manque ou est incorrect.

2. **Diagnostic (optionnel)**  
   `https://ton-projet.vercel.app/api/debug`  
   Tu verras notamment si `hasDatabaseUrl` et `hasJwtSecret` sont à `true`.

---

## 3. Pourquoi l’erreur « API 404 » peut persister ?

Plusieurs causes possibles :

1. **Fonction non déployée**  
   Si le build de la fonction `api/login.ts` échoue (par ex. import `./db` non résolu), Vercel ne déploie pas la route `/api/login` → le navigateur reçoit 404. Le projet utilise maintenant un **fichier `api/login.ts` autonome** (sans import local, connexion Neon directe) pour éviter ce cas.

2. **Modifs non déployées**  
   Les changements dans `vercel.json` ou `api/login.ts` ne sont pris en compte qu’après un **push** vers la branche connectée à Vercel et un **nouveau déploiement**. Vérifie que le dernier déploiement correspond bien à ton dernier commit.

3. **Variables d’environnement manquantes**  
   Sans `DATABASE_URL` ou `JWT_SECRET`, la fonction peut planter au premier accès à la BDD ou au JWT ; selon la config, tu peux voir 404, 500 ou 503. Définis ces variables dans **Vercel → Settings → Environment Variables** puis redéploie.

4. **Framework Preset = Vite → les API ne sont pas déployées**  
   Si le projet est en **Framework Preset « Vite »**, Vercel ne déploie que le front (build Vite → `dist/`) et **ignore le dossier `api/`**. Résultat : `/api/health` et `/api/login` renvoient **404** même si tout fonctionne en local.  
   **Correction** : le `vercel.json` du projet contient maintenant **`"framework": null`** pour forcer le preset « Other » et que Vercel utilise toute la config (dont `builds` avec `api/health.js`, `api/login.ts`, `api/index.ts`). Après un **nouveau déploiement**, les routes API doivent répondre.  
   Si besoin, tu peux aussi le faire à la main : **Vercel** → ton projet → **Settings** → **General** → **Framework Preset** → choisir **« Other »** → **Save** → **Redeploy**.

5. **Vérifier dans le dashboard Vercel**  
   - **Deployments** → dernier déploiement → onglet **Functions** : les fonctions `api/health`, `api/login`, `api/index` doivent apparaître.  
   - Si elles n’apparaissent pas, le build des API a échoué : regarde les **logs de build**.  
   - Si elles apparaissent mais que tu as encore 404, regarde les **logs d’exécution** de la fonction au moment de la requête.

---

## 4. Pourquoi ça marche sur Render et pas sur Vercel ?

- **Render** : tu as défini les variables dans le dashboard (ou dans un fichier d’env), donc l’API les a au démarrage.
- **Vercel** : les variables ne sont **pas** lues depuis ton `.env` en production. Il faut les saisir dans **Vercel → Settings → Environment Variables**. Sans ça, `process.env.DATABASE_URL` est vide et l’API ne peut pas se connecter à Neon.

En résumé : **même code, même base Neon** ; la seule différence est la **configuration des variables d’environnement** dans l’interface Vercel.

---

## 5. Récap

1. Ajouter **DATABASE_URL** et **JWT_SECRET** (et éventuellement **ALLOWED_ORIGINS** et R2) dans Vercel → Settings → Environment Variables.
2. Redéployer le projet.
3. Tester `/api/health` puis la connexion sur `/admin` (ou la page de login admin).

Si après ça le login admin échoue encore, regarder les **logs** dans Vercel (Functions → sélectionner la fonction → Logs) pour voir l’erreur exacte (connexion refusée, timeout, etc.).
