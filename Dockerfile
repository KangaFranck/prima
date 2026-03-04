# API Express (prima-center) — build depuis la racine du repo.
# Utilise le code dans server/ pour éviter que Railway lance Nixpacks sur tout le repo.

FROM node:20-alpine

WORKDIR /app

# Copier et installer les dépendances du serveur
COPY server/package.json server/package-lock.json ./
RUN npm ci

# Copier le code source du serveur et compiler
COPY server/tsconfig.json ./
COPY server/src ./src
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/index.js"]
