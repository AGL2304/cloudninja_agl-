#!/bin/bash

# Mettre à jour les paquets
apt update -y
apt install -y debconf-utils

# Préconfigurer les réponses pour l'installation de MySQL (mot de passe root)
echo "mysql-server mysql-server/root_password password root" | debconf-set-selections
echo "mysql-server mysql-server/root_password_again password root" | debconf-set-selections

# Installer MySQL
apt install -y mysql-server

# Sécuriser et configurer la base de données
mysql -uroot -proot <<EOF
CREATE DATABASE cloudninja;
CREATE USER 'ninja'@'%' IDENTIFIED BY 'ninjapass';
GRANT ALL PRIVILEGES ON cloudninja.* TO 'ninja'@'%';
FLUSH PRIVILEGES;
EOF

# Autoriser les connexions distantes
sed -i 's/bind-address.*/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf

# Redémarrer MySQL
systemctl restart mysql
