# 🛠️ Projet CloudNinja – Infrastructure 3-tiers avec Vagrant

## 🎯 Objectif
Déployer en local une architecture 3-tiers simulant une stack cloud avec :
- Frontend (NGINX)
- Backend (Node.js)
- Base de données (MySQL)
Le tout orchestré avec **Vagrant** et provisionné automatiquement.

---

## 🧱 Structure de l'infrastructure

| Couche     | VM         | IP               | Technologie      |
|------------|------------|------------------|------------------|
| Présentation | frontend  | 192.168.56.10     | Nginx             |
| Application  | backend   | 192.168.56.20     | Node.js + PM2     |
| Données      | database  | 192.168.56.30     | MySQL             |

---

## ⚙️ Installation

### 1. Pré-requis
- [Vagrant](https://www.vagrantup.com/downloads)
- [VirtualBox](https://www.virtualbox.org/)

### 2. Cloner ou créer la structure :
```bash
git clone <repo>
cd cloudninja-vagrant


### 3. Démarrer toutes les VM :
```bash
vagrant up

vagrant up frontend
vagrant up backend
vagrant up database


## 🔍 Tester l’infrastructure
###🔹 Frontend
Ouvrir dans le navigateur :
```bash
http://192.168.56.10
### 🔹 Backend
Depuis le poste hôte :

```bash
curl http://192.168.56.20:3000
Réponse attendue :

nginx
Backend CloudNinja opérationnel 🚀

###🔹 MySQL (depuis VM backend)
```bash
mysql -h 192.168.56.30 -u ninja -pninjapass cloudninja


### 🔁 Commandes utiles
```bash
vagrant ssh <nom_vm>         # Connexion SSH à la VM
vagrant reload <nom_vm> --provision  # Reprovisionner une VM
vagrant halt                 # Arrêter toutes les VM
vagrant destroy -f           # Supprimer toutes les VM


### 📂 Arborescence du projet
```bash
cloudninja-vagrant/
├── Vagrantfile
├── frontend/
│   └── provision.sh
├── backend/
│   └── provision.sh
├── database/
│   └── provision.sh
└── README.md