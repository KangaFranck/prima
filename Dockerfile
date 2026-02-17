FROM alpine:latest

# Installer les dépendances nécessaires
RUN apk add --no-cache ca-certificates curl unzip

# Version de PocketBase (modifiable via build-arg)
ARG PB_VERSION=0.22.6

# Répertoire de travail
WORKDIR /app

# Télécharger et extraire PocketBase pour Linux (amd64)
RUN curl -L -o /tmp/pocketbase.zip \
  https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip \
  && unzip /tmp/pocketbase.zip -d /app \
  && rm /tmp/pocketbase.zip \
  && chmod +x /app/pocketbase

# Créer le répertoire pour les données
RUN mkdir -p /app/pb_data

# Exposer le port
EXPOSE 8080

# Commande de démarrage
CMD ["./pocketbase", "serve", "--http=0.0.0.0:8080"] 