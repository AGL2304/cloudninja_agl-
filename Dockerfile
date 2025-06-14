# Étape 1 : build
FROM node:18-alpine AS builder

# Dossier de travail
WORKDIR /app

# Copier package.json & package-lock.json
COPY package*.json ./

# Installer dépendances
RUN npm install --production

# Copier le code source
COPY . .

# Étape 2 : image finale plus légère
FROM node:18-alpine

# Créer un utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copier uniquement ce qui est nécessaire depuis builder
COPY --from=builder /app ./

# Changer les permissions
RUN chown -R appuser:appgroup /app

# Utilisateur non-root
USER appuser

# Exposer le port (à adapter)
EXPOSE 3000

# Démarrer l'application
CMD ["node", "src/server.js"]
