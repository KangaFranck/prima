# 🚀 Déploiement PocketBase sur Railway

## **Étape 1 : Créer un compte Railway**
1. Allez sur [railway.app](https://railway.app)
2. Créez un compte (avec GitHub recommandé)
3. Connectez-vous à votre compte

## **Étape 2 : Créer un nouveau projet**
1. Cliquez sur "New Project"
2. Sélectionnez "Deploy from GitHub repo"
3. Connectez votre repository GitHub
4. Sélectionnez le repository `prima`

## **Étape 3 : Configurer le déploiement**
1. **Service Name :** `pocketbase-prima`
2. **Build Command :** Laissez vide (Railway utilisera le Dockerfile)
3. **Start Command :** Laissez vide (défini dans le Dockerfile)

## **Étape 4 : Variables d'environnement**
Ajoutez ces variables dans Railway :
- `PORT` = `8080`
- `POCKETBASE_URL` = (sera généré automatiquement)

## **Étape 5 : Déployer**
1. Cliquez sur "Deploy"
2. Attendez que le déploiement soit terminé
3. Railway vous donnera une URL (ex: `https://pocketbase-prima-production.up.railway.app`)

## **Étape 6 : Tester PocketBase**
1. Allez sur l'URL générée par Railway
2. Ajoutez `/_/` à la fin pour l'interface admin
3. Créez un compte admin

## **Étape 7 : Mettre à jour Vercel**
Une fois PocketBase déployé, mettez à jour votre application Vercel avec la nouvelle URL.

---

## **🔗 Liens utiles :**
- [Railway Documentation](https://docs.railway.app/)
- [PocketBase Documentation](https://pocketbase.io/docs/)

## **📞 Support :**
Si vous rencontrez des problèmes, dites-le moi et je vous aiderai ! 