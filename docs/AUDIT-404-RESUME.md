# Audit 404 /api/login – Résumé et plan d’action

Après audit du projet, le **code et le `vercel.json` sont corrects**. La 404 vient très probablement du **projet Vercel** qui sert **prima-six-eta.vercel.app** (réglages ou mauvais projet).

---

## Ce qui est correct dans le repo

| Élément | Statut |
|--------|--------|
| `api/login.ts` | Présent, export `default`, dépendances OK |
| `vercel.json` | `framework: null`, builds avec `api/login.ts`, rewrite `/api/login` → `/api/login` |
| `apiClient.ts` | En prod appelle bien `/api/login` (URL relative) |
| Pas de `.vercelignore` qui exclut `api/` | OK |

---

## Cause la plus probable : projet Vercel

L’URL **prima-six-eta.vercel.app** peut être :

1. Un **autre projet** que celui où tu as mis Framework = Other (ex. projet « prima-six-eta » vs « prima »).
2. Un projet où le **Framework Preset** est resté **Vite** → Vercel ne déploie que le front, pas les fonctions dans `api/` → 404 sur tout `/api/*`.
3. Un projet avec **Root Directory** rempli → le build ne voit pas `api/login.ts`.

---

## Plan d’action (à faire dans l’ordre)

### Étape 1 : Quel projet sert prima-six-eta.vercel.app ?

1. Va sur **vercel.com** → **Dashboard**.
2. Ouvre **chaque projet** qui pourrait servir cette URL (ex. « prima », « prima-six-eta », « prima-center »).
3. Dans chaque projet : **Settings** → **Domains**.
4. Repère **quel projet** a le domaine **prima-six-eta.vercel.app** (en production). C’est **ce projet-là** qu’il faut configurer.

### Étape 2 : Configurer CE projet

Sur **le projet qui a le domaine prima-six-eta.vercel.app** :

1. **Settings** → **Build and Deployment**  
   - **Framework Preset** → **Other** (pas Vite).  
   - **Root Directory** → **vide**.  
   - **Save**.

2. **Settings** → **Git**  
   - Vérifier que le repo est bien **KangaFranck/prima** (ou le bon dépôt).  
   - **Production Branch** = **main** ou **master** (celle où tu push).

3. **Deployments**  
   - Ouvrir le **dernier déploiement**.  
   - Vérifier que le **commit** est bien celui qui contient `api/login.ts` et le `vercel.json` avec `api/login` dans les builds.  
   - Onglet **Building** (ou **Functions**) : pas d’erreur, et si une liste de fonctions existe, **api/login** doit apparaître.

### Étape 3 : Redéployer

- **Redeploy** sur le dernier déploiement.  
- Choisir **Clear cache and redeploy** si possible.  
- Attendre 2–3 min.

### Étape 4 : Déployer depuis ta machine (si la 404 continue)

Dans un terminal, à la racine du projet :

```powershell
cd "c:\Users\DELL\Desktop\Prima-center"
npx vercel --prod
```

- Quand on te demande à quel projet lier, choisis **celui qui a le domaine prima-six-eta.vercel.app**.  
- À la fin, réessaie **https://prima-six-eta.vercel.app/login**.

---

## Vérifications rapides

| Question | Où vérifier |
|----------|-------------|
| Quel projet a le domaine prima-six-eta.vercel.app ? | Chaque projet → **Settings** → **Domains** |
| Framework = Other sur CE projet ? | Ce projet → **Settings** → **Build and Deployment** |
| Root Directory vide ? | **Settings** → **Build and Deployment** (défiler) |
| Dernier déploiement = bon commit ? | **Deployments** → dernier → commit hash / message |
| Fonction api/login listée ? | **Deployments** → dernier → onglet **Functions** ou **Building** |

---

## Si après tout ça la 404 est toujours là

- Envoie une capture d’écran de **Settings** → **Domains** du projet qui a **prima-six-eta.vercel.app**.
- Une capture de **Build and Deployment** (Framework Preset + Root Directory).
- Une capture du **dernier déploiement** (commit + onglet Building/Functions si visible).

Avec ça on pourra cibler la dernière cause possible (mauvais projet, cache, ou comportement spécifique du compte Vercel).
