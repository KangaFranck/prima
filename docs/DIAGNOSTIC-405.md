# Diagnostic : erreur 405 au login (API / environnement)

Quand le login admin renvoie **405** en production malgré le code, la cause est souvent **l’environnement** (Vercel, Neon, CORS). Suivre cette checklist dans l’ordre.

**Si `/api/debug` affiche la page du site (footer) au lieu du JSON :** le fallback SPA prenait toute l’URL. Le `vercel.json` utilise maintenant `rewrites` pour que `/api/*` aille d’abord à la fonction API. **Redéploie** (Redeploy sur Vercel) puis réessaie `/api/debug`.

**Si `/api/debug` ou `/api/auth/login` renvoie 404 NOT_FOUND :**
- **Cause :** Avec un tableau **builds** explicite dans `vercel.json`, Vercel ne déploie que les fichiers listés. Si `api/auth/login.ts` n’est pas dans **builds**, la route `/api/auth/login` n’existe pas → 404.
- **Solution :** ajouter `{ "src": "api/auth/login.ts", "use": "@vercel/node" }` dans **builds** de `vercel.json`, puis redéployer.
- Vérifier que **Root Directory** est vide (ou `.`) dans Vercel → Settings → General.
- Après push : **Redeploy** → **Clear cache and redeploy**, puis réessayer après 2–3 min.

---

## 1. Vérifier ce que reçoit l’API (debug)

Après déploiement, ouvre dans le navigateur :

```
https://prima-six-eta.vercel.app/api/debug
```

(Remplace `TON-URL` par l’URL réelle de ton déploiement, ex. `prima-kanga` ou `prima-six-eta`.)

Tu dois voir un JSON avec :

- **path** : doit être `debug` (OK).
- **method** : doit être `GET` (OK).
- **hasDatabaseUrl** : `true` (sinon Neon n’est pas configuré).
- **hasJwtSecret** : `true` (sinon JWT non configuré).
- **allowedOriginsCount** : au moins 1 (sinon CORS peut bloquer).
- **originReceived** : l’origine du site (ex. `https://prima-kanga.vercel.app`).

Si **hasDatabaseUrl** ou **hasJwtSecret** est `false` → aller au §2 (variables Vercel).  
Si tout est OK sur `/api/debug`, tester le login ; si tu as encore 405, vérifier les logs Vercel pour la route **`/api/routes`** (pas `/api/auth/login`) au moment du clic sur « Connexion ».

---

## 2. Variables d’environnement Vercel

**Vercel** → ton projet **prima** → **Settings** → **Environment Variables**.

Vérifier que ces variables existent **pour Production** (et si tu testes en Preview, aussi pour Preview) :

| Variable          | Obligatoire | Exemple / remarque |
|-------------------|------------|---------------------|
| `DATABASE_URL`    | Oui        | URL de connexion Neon (commence par `postgresql://...`) |
| `JWT_SECRET`      | Oui        | Chaîne secrète (ex. `prima_secret_key_2024_secure_jwt`) |
| `ALLOWED_ORIGINS` | Oui        | URL du site **sans** slash final, ex. `https://prima-kanga.vercel.app` |

**Important pour ALLOWED_ORIGINS :**

- Utiliser **exactement** l’URL affichée dans la barre d’adresse quand tu es sur ton site (sans `/` à la fin).
- Si tu as plusieurs URLs (prod + preview), les séparer par des virgules :  
  `https://prima-kanga.vercel.app,https://prima-git-xxx.vercel.app`

Après toute modification : **redéployer** (nouveau déploiement ou « Redeploy » sur le dernier).

---

## 3. Neon (base de données)

- **Neon** → ton projet → **Dashboard** → onglet **SQL** (ou équivalent).
- Exécuter :

```sql
SELECT id, email, name FROM admins LIMIT 5;
```

Si la table n’existe pas ou si tu as une erreur : exécuter le schéma du projet, par exemple :

```bash
# Depuis la racine du repo
cat scripts/neon-schema.sql
```

Puis créer les tables dans Neon (copier/coller les `CREATE TABLE` et les exécuter).  
Vérifier qu’au moins un admin existe (sinon en créer un avec un mot de passe hashé bcrypt).

La variable **DATABASE_URL** dans Vercel doit pointer vers ce projet Neon (même branche, même région si possible).

---

## 4. Repo Git et déploiement Vercel

- **Vercel** → **Settings** → **Git** : vérifier que le repo connecté est le bon (**KangaFranck/prima**) et la branche de prod (souvent `main` ou `master`).
- **Deployments** : ouvrir le **dernier déploiement** et vérifier qu’il est « Ready » et qu’il correspond au dernier commit (celui avec les correctifs 405).
- Si tu as changé des variables d’environnement ou du code, faire un **Redeploy** (bouton « Redeploy » sur le dernier déploiement) pour être sûr que la config et le code sont à jour.

---

## 5. CORS et origine du site

Le code accepte désormais toute origine en `*.vercel.app`. Si ton site est ailleurs (domaine perso, autre hébergeur), il **faut** ajouter cette URL dans **ALLOWED_ORIGINS** sur Vercel (sans slash final).

Tu peux vérifier l’origine reçue via `/api/debug` : **originReceived** doit correspondre à l’URL de la page depuis laquelle tu te connectes.

---

## 6. Cloudflare (si utilisé)

Si ton domaine passe par **Cloudflare** (proxy, DNS, etc.) :

- Désactiver temporairement le proxy (nuage orange → gris) pour le sous-domaine qui pointe vers Vercel, ou
- Vérifier qu’aucune règle ne modifie la méthode HTTP (POST doit rester POST) et qu’il n’y a pas de redirection 301/302 sur `/api/*`.

---

## Résumé des causes possibles du 405

| Cause probable              | Où vérifier / quoi faire |
|-----------------------------|---------------------------|
| Méthode reçue ≠ POST       | `/api/debug` + logs Vercel (route `/api/routes`) |
| CORS / mauvaise origine    | ALLOWED_ORIGINS = URL exacte du site (sans slash) |
| Variables manquantes       | Vercel → Settings → Environment Variables |
| Mauvais déploiement / cache| Redeploy + vérifier que le bon commit est déployé |
| Table `admins` absente     | Neon → exécuter le schéma + vérifier un admin |

Commencer par **§1 (api/debug)** puis **§2 (variables Vercel)** et **§4 (repo + redeploy)** ; en général cela suffit pour cibler ou corriger le problème.
