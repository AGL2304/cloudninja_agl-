#!/bin/bash

# Mettre à jour les paquets
apt update -y

# Installer nginx
apt install -y nginx

# Activer nginx au démarrage et démarrer le service
systemctl enable nginx
systemctl start nginx

# Ajouter une page d'accueil personnalisée
echo "<h1>Bienvenue sur la couche Frontend (NGINX)</h1>" > /var/www/html/index.html
