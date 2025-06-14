#!/bin/bash

# Mettre à jour les paquets
apt update -y

# Installer dépendances
apt install -y curl build-essential

# Installer Node.js LTS (v18)
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
apt install -y nodejs

# Vérifier installation
node -v
npm -v

# Installer PM2
npm install -g pm2

# Créer dossier de l'app
mkdir -p /opt/cloudninja

# Créer serveur Node minimal
cat <<EOF > /opt/cloudninja/server.js
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Backend CloudNinja opérationnel 🚀');
});
server.listen(3000);
EOF

# Lancer le serveur avec PM2
pm2 start /opt/cloudninja/server.js
pm2 save
