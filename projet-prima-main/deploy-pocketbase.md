# Déploiement PocketBase (optionnel)

PocketBase peut être déployé sur un hébergeur supportant Docker (ex. Render, Fly.io, un VPS).

## Étapes générales

1. Créez un compte sur l’hébergeur choisi (ex. [render.com](https://render.com)).
2. Créez un **Web Service** (ou équivalent) à partir du repo.
3. Utilisez le **Dockerfile** du projet si disponible pour PocketBase.
4. Variables d’environnement : `PORT` (ex. 8080), `POCKETBASE_URL` (URL publique du service).
5. Après déploiement, accédez à l’interface admin via `https://votre-url/_/`.

## Liens utiles

- [PocketBase Documentation](https://pocketbase.io/docs/)
