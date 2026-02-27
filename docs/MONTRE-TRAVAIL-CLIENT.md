# Montrer ton travail au client

Deux façons de faire voir le site à ton client.

---

## 1. Déployer en ligne (recommandé)

Une fois déployé, tu envoies simplement le lien à ton client.

### Avec Railway

1. Pousse ton code sur GitHub : `git add .` → `git commit -m "..."` → `git push`.
2. Va sur [railway.app](https://railway.app) et connecte ton compte GitHub.
3. **New Project** → **Deploy from GitHub repo** → sélectionne ton repo.
4. Dans les paramètres du service :
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm run start`
   - **Variables** : `DATABASE_URL`, `JWT_SECRET`, `ALLOWED_ORIGINS` (voir [DEPLOI-RAILWAY-RENDER.md](./DEPLOI-RAILWAY-RENDER.md)).
5. Après le déploiement, Railway te donne une URL du type `https://ton-projet.up.railway.app`.
6. Envoie cette URL à ton client. Il pourra voir le site et (si tu veux) l’interface admin.

---

## 2. Montrer en direct sans déployer (tunnel)

Si tu veux montrer une version en cours de dev sur ta machine sans déployer :

1. Lance le site en local :
   ```bash
   npm run build
   npm run start
   ```
   (ou en dev : `npm run dev` dans un terminal et `npm run api` dans un autre)

2. Expose ton port avec un tunnel (choisis un outil) :
   - **ngrok** : `ngrok http 3000` (ou 5173 si tu utilises `npm run dev`) → ngrok affiche une URL publique (ex. `https://abc123.ngrok.io`) à partager.
   - **localtunnel** : `npx localtunnel --port 3000` → tu obtiens une URL à partager.

3. Envoie le lien du tunnel à ton client. Attention : le lien change à chaque lancement (sauf avec un compte ngrok payant). Dès que tu arrêtes le tunnel, le lien ne fonctionne plus.

---

## Résumé

| Pourquoi | Solution |
|----------|----------|
| Montrer la version finale / stable | Déployer sur **Railway** (ou Render) et envoyer l’URL. |
| Montrer une maquette en cours rapidement | Lancer le site en local + **ngrok** ou **localtunnel** et envoyer l’URL du tunnel. |

Pour un client, la solution la plus propre est en général **Railway** : une URL fixe, toujours disponible.
