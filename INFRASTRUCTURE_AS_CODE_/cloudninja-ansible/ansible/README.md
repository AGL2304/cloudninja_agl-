## Les Manuscrits d’Ansible

## Description

Ce projet automatise le déploiement et la configuration de l’infrastructure CloudNinja en utilisant Ansible. Il couvre la configuration des serveurs frontend, backend, et database, ainsi que la gestion sécurisée des secrets avec Ansible Vault.



## Objectifs

- Configurer le serveur web (Nginx)
- Déployer l’application Node.js sur le backend avec PM2
- Installer et configurer la base de données (ex : nginx sur serveur DB)
- Implémenter des rôles Ansible réutilisables pour chaque composant
- Gérer les secrets via Ansible Vault
- Utiliser un inventaire statique (avec possibilité d’évolution vers inventaire dynamique)



## Arborescence du projet

ansible/
├── inventory.ini # Inventaire des hôtes
├── site.yml # Playbook principal
├── roles/ # Rôles Ansible
│ ├── frontend/ # Rôle pour Nginx
│ ├── backend/ # Rôle pour Node.js + PM2
│ └── database/ # Rôle pour serveur DB / Nginx DB
├── group_vars/ # Variables par groupe
├── host_vars/ # Variables par hôte
├── vault/ # Fichiers chiffrés Vault
└── README.md # Documentation projet


## Description des rôles

- **frontend** : installation et configuration de Nginx, démarrage du service.
- **backend** : installation Node.js, PM2, déploiement de l’application, gestion des dépendances et démarrage avec PM2.
- **database** : installation de Nginx (interface), copie des fichiers statiques.


## Gestion des secrets

Les secrets sont sécurisés via Ansible Vault, utilisés dans les playbooks et rôles.

### Commandes principales Vault


ansible-vault create vault/secret.yml
ansible-vault edit vault/secret.yml
ansible-playbook site.yml --ask-vault-pass

## Utilisation
1. Vérifier la connectivité SSH vers les serveurs cibles.

2. Lancer le playbook principal avec la commande suivante :

ansible-playbook -i inventory.ini site.yml --ask-vault-pass


## Inventaire
Inventaire statique avec les groupes frontend, backend et database dans inventory.ini :

[frontend]
192.168.56.10

[backend]
192.168.56.20

[database]
192.168.56.30