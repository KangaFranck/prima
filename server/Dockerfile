# Build et run du backend Express (Neon + R2)
# Railway : Root Directory = server, builder = Dockerfile

FROM node:20-alpine

WORKDIR /app

# Dépendances
COPY package.json package-lock.json ./
RUN npm ci

# Code source et build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Pas besoin de devDependencies au run
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/index.js"]
