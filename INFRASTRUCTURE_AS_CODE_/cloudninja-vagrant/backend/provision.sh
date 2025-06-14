#!/bin/bash

echo "📦 [Backend] Mise à jour des paquets système"
sudo apt update && sudo apt upgrade -y

echo "📥 [Backend] Installation des dépendances de base"
sudo apt install -y curl git build-essential

echo "🔧 [Backend] Installation de Node.js v16.x via NodeSource"
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

echo "🚀 [Backend] Installation de PM2 pour gestion des processus Node.js"
sudo npm install -g pm2

echo "📁 [Backend] Création du répertoire de l'application"
mkdir -p /home/vagrant/app
chown -R vagrant:vagrant /home/vagrant/app

echo "✅ [Backend] Provisioning terminé. L'application sera déployée par Ansible."
