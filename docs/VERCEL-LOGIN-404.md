# Résoudre le 404 sur le login (Vercel)

Si le front appelle bien `/api/login` mais reçoit **404**, la cause est presque toujours **côté Vercel**, pas dans le code.

## 1. Vérifier le Root Directory (cause #1)

1. Va sur **https://vercel.com** → ton projet **prima** (ou prima-six-eta).
2. **Settings** → **General**.
3. Regarde **Root Directory** :
   - Doit être **vide** ou **`.`**
   - Si c’est un dossier (ex. `frontend`, `app`, `src`), le dossier `api/` n’est pas à la racine du déploiement → **toutes** les routes API renvoient 404.
4. Si tu changes : mets **vide** ou **`.`**, sauvegarde, puis **Redeploy** (Deployments → dernier déploiement → Redeploy).

## 2. Vérifier que les fonctions sont déployées

1. **Deployments** → ouvre le **dernier déploiement** (vert).
2. Onglet **Functions** (ou **Serverless Functions**).
3. Tu dois voir au moins : `api/login`, `api/debug`, `api/routes`, etc.
4. Si la liste est **vide** → les fonctions ne sont pas buildées (voir §1 ou les logs de build).

## 3. Tester une route en GET (navigateur)

Ouvre dans l’ordre :

1. **https://prima-six-eta.vercel.app/api/debug**  
   - Si **404** → aucune fonction API n’est servie (souvent Root Directory ou build).
   - Si **JSON** (ok, path, method…) → les fonctions marchent ; le souci peut être limité au login.

2. **https://prima-six-eta.vercel.app/api/login**  
   - En GET tu dois avoir **405 Method Not Allowed** (normal).  
   - Si **404** → la route `api/login` n’existe pas côté Vercel.

## 4. Variables d’environnement

**Settings** → **Environment Variables** (Production) :

- `DATABASE_URL` : URL Neon (postgresql://…)
- `JWT_SECRET` : chaîne secrète
- `ALLOWED_ORIGINS` : `https://prima-six-eta.vercel.app` (sans slash final)

Après toute modif → **Redeploy**.

## 5. Logs de build

**Deployments** → dernier déploiement → **Building** (ou **Logs**).

- Si une étape qui build les fichiers `api/*` échoue (erreur TypeScript, module manquant), les fonctions ne seront pas déployées.
- Corriger l’erreur, push, puis redéployer.

## En résumé

| Symptôme | Action |
|----------|--------|
| `/api/debug` en 404 | Root Directory vide ou `.` ; vérifier onglet Functions et logs de build |
| `/api/debug` OK, `/api/login` en 404 | Vérifier que `api/login.ts` est bien buildé (Functions + build logs) |
| Tout en 404 | Très souvent **Root Directory** incorrect |

Une fois Root Directory corrigé et redeploy fait, réessaie le login.
