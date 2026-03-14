# Rapport de sécurité – Prima Center

## ✅ Points positifs

| Élément | Statut |
|--------|--------|
| **SQL Injection** | ✅ Protégé – requêtes paramétrées (Neon `sql\`...\${var}\``) |
| **XSS** | ✅ Aucun `dangerouslySetInnerHTML` ou `eval` détecté |
| **Mots de passe** | ✅ Hashés avec bcrypt |
| **JWT** | ✅ JWT_SECRET requis (erreur si absent) |
| **Fichiers .env** | ✅ Dans .gitignore |
| **Auth admin** | ✅ Routes protégées par token Bearer |

## 🔧 Corrections appliquées

1. **Upload** : sanitization du nom de fichier (évite path traversal)
2. **Upload** : validation du type (images uniquement : JPEG, PNG, GIF, WebP, SVG)
3. **Upload** : limite de 5 Mo par fichier
4. **Newsletter** : limite de longueur de l’email (254 caractères)
5. **API /debug** : désactivée en production

## ⚠️ Recommandations

### Priorité haute

1. **Dépendances** : GitHub signale 4 vulnérabilités. Exécuter :
   ```bash
   npm audit
   npm audit fix
   ```
   Puis vérifier https://github.com/KangaFranck/prima/security/dependabot

2. **JWT_SECRET** : utiliser une clé longue et aléatoire (32+ caractères) dans les variables d’environnement Vercel.

3. **Rate limiting** : ajouter une limite sur `/api/login` pour limiter les tentatives de brute-force (ex. 5 tentatives / 15 min par IP).

### Priorité moyenne

4. **CORS** : vérifier que `ALLOWED_ORIGINS` sur Vercel contient uniquement les domaines autorisés.

5. **Headers de sécurité** : ajouter dans `vercel.json` :
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY` ou `SAMEORIGIN`
   - `Referrer-Policy: strict-origin-when-cross-origin`

6. **HTTPS** : s’assurer que le site est servi uniquement en HTTPS (Vercel le fait par défaut).

### Priorité basse

7. **Session** : le token est en `sessionStorage` (perdu à la fermeture de l’onglet) – comportement adapté.

8. **Scripts** : `scripts/seed-admin.js` utilise un mot de passe par défaut – ne l’utiliser qu’en local et toujours passer le mot de passe en argument ou via `.env`.
