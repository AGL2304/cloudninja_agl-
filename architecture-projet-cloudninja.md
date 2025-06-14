# 🔷 Architecture 3-Tiers – Projet CloudNinja

**Quête 8 : "L'Architecte des Nuages"**

---

## 1. Présentation globale

### Objectif
L'objectif de cette architecture est de mettre en place une application web robuste en suivant le modèle 3-Tiers. Cette approche garantit une **séparation claire des responsabilités** entre la présentation, la logique applicative et le stockage des données. Le but est d'obtenir un système **scalable**, **sécurisé** et **maintenable** sur le long terme.

---

## 2. Architecture logique (3 Tiers)

L'application est décomposée en trois couches distinctes, chacune ayant un rôle bien défini.

### 🧱 Couche 1 – Présentation (Frontend)
Cette couche est la porte d'entrée de l'application, responsable de l'interface utilisateur.

*   **Serveur web :** **Nginx**
*   **Rôle :**
    *   Sert les fichiers statiques (HTML, TailwndCSS, JavaScript) au client.
    *   Agit comme un reverse proxy pour les requêtes API vers le backend.
    *   Gère la terminaison SSL/TLS pour sécuriser les communications.
*   **Communication :** Accède au backend via des appels HTTP (AJAX) sur des routes d'API définies.

### 🧱 Couche 2 – Application (Backend)
Le cerveau de l'application, où toute la logique métier est exécutée.

*   **Application :** **Node.js** avec le framework **Express**
*   **Rôle :**
    *   Fournit une API RESTful sécurisée pour le frontend.
    *   Gère la logique métier (calculs, traitements, etc.).
    *   Gère l'authentification et les autorisations des utilisateurs.
    *   Centralise la gestion des logs d'accès et d'erreurs.
*   **Communication :** Reçoit les requêtes du frontend et interagit avec la base de données.

### 🧱 Couche 3 – Données (Database)
La couche de persistance, responsable du stockage et de la récupération des données.

*   **SGBD :** **MYSQL**
*   **Rôle :**
    *   Stocke les données critiques de l'application : comptes utilisateurs, services, logs, etc.
*   **Communication :** L'accès à cette couche est **strictement limité** au backend. Aucune connexion directe depuis le frontend ou l'extérieur n'est autorisée.

---

## 3. Diagramme d'architecture

*Ci-dessous, un diagramme schématique du flux. 

**Représentation textuelle du flux :**
```csharp
[Client (Navigateur Web)]
        |
        | Requête HTTP/HTTPS (Port 80/443)
        v
[Load Balancer]
        |
        | Trafic distribué
        v
[Serveur Nginx (Couche Présentation)]
        |
        | Requêtes API REST (Proxy Pass)
        v
[Application Node.js (Couche Application)]
        |
        | Connexion DB sécurisée (TCP 3306)
        v
[Base de données MYSQL (Couche Données)]

---

### 4. Détails des flux de communication

Le flux de communication est conçu pour être sécurisé et efficace.

1.  **Client vers Frontend :** L'utilisateur accède à l'application via son navigateur. Nginx reçoit la requête HTTPS et renvoie les fichiers statiques (HTML, CSS, JS).
2.  **Frontend vers Backend :** Le JavaScript côté client exécute une requête (ex: `fetch('/api/status')`). Nginx intercepte cette requête et, grâce à sa configuration de reverse proxy, la transfère à l'application Node.js.
3.  **Backend vers Base de données :** L'application Node.js reçoit la requête API. Elle la traite, puis exécute une requête SQL (ex: `SELECT * FROM logs;`) sur la base de données PostgreSQL via une connexion TCP sécurisée.
4.  **Retour du flux :** La base de données renvoie les résultats au backend, qui formate une réponse JSON et la renvoie au frontend. Le frontend met enfin à jour l'interface utilisateur.

---

## 5. 🔐 Sécurité

Une stratégie de sécurité est appliquée à chaque couche pour minimiser les risques.

### 🔸 Présentation (Nginx)

*   **HTTPS (TLS) :** Activation systématique pour chiffrer tout le trafic entre le client et le serveur.
*   **Headers de sécurité :** Utilisation de `Helmet` (ou configuration manuelle) pour ajouter des en-têtes comme `Content-Security-Policy`, `X-Content-Type-Options`, etc.
*   **CORS (Cross-Origin Resource Sharing) :** Configuration stricte pour n'autoriser que les origines connues à accéder à l'API.

### 🔸 Application (Node.js)

*   **Authentification JWT (JSON Web Token) :** Les routes API critiques sont protégées et nécessitent un token valide.
*   **Limitation de requêtes (Rate Limiting) :** Utilisation de `express-rate-limit` pour prévenir les attaques par force brute ou par déni de service.
*   **Validation des entrées :** Utilisation de `express-validator` pour nettoyer et valider toutes les données provenant des utilisateurs afin de prévenir les injections (SQL, XSS).
*   **Logs d'accès et d'erreurs :** Journalisation de toutes les requêtes et erreurs pour l'audit et le débogage.

### 🔸 Données (MYSQL)

*   **Accès réseau restreint :** Le port de la base de données (ex: 3306) n'est **jamais exposé publiquement**. Seules les adresses IP des serveurs backend sont autorisées à s'y connecter (via des groupes de sécurité ou un pare-feu).
*   **Utilisateur avec privilèges limités :** L'application se connecte à la base de données avec un utilisateur qui ne dispose que des permissions strictement nécessaires (CRUD sur certaines tables, mais pas de droits d'administration).
*   **Gestion des secrets :** Les identifiants de la base de données sont stockés de manière sécurisée (variables d'environnement, gestionnaire de secrets) et ne sont jamais codés en dur.

---

## 6. 📈 Stratégie de scalabilité

L'architecture est conçue pour évoluer en fonction de la charge.

### 🔹 Frontend (Nginx)

*   **Scaling Horizontal :** Les serveurs Nginx sont "stateless". Ils peuvent être facilement répliqués. Dans un environnement comme Kubernetes, un `Deployment` avec plusieurs `replicas` et un `Service` de type `LoadBalancer` permettent une mise à l'échelle automatique.

### 🔹 Backend (Node.js)

*   **Scaling Horizontal :** L'application Node.js est conçue pour être "stateless" (l'état est géré par la base de données ou un cache externe). Elle peut donc être répliquée facilement via un `Deployment` Kubernetes.
*   **Auto-scaling :** Un `Horizontal Pod Autoscaler` (HPA) peut être configuré pour augmenter ou diminuer automatiquement le nombre de `replicas` en fonction de l'utilisation du CPU ou de la mémoire.
*   **Sondes de santé :** Des `readiness` et `liveness probes` sont configurées pour que le trafic ne soit envoyé qu'aux instances saines.

### 🔹 Database (MYSQL)

*   **Scaling Vertical :** La première approche consiste à augmenter les ressources (CPU, RAM, IOPS) de l'instance de base de données.
*   **Réplication :** Mise en place d'une réplication **maître-esclave (read replicas)**. Les écritures vont sur le maître, et les lectures peuvent être distribuées sur les esclaves pour réduire la charge.
*   **Backups réguliers :** Des sauvegardes automatiques (snapshots) sont planifiées pour permettre une restauration rapide en cas d'incident.

---

## 7. Choix techniques

| Composant             | Technologie               | Justification |
|---                    |---                        |            ---|
| **Frontend**          | **Nginx**                 | Extrêmement performant pour servir des fichiers statiques         et                                                      comme reverse proxy. Gestion robuste de TLS. |
| **Backend**           | **Node.js (Express)**     | Idéal pour les applications I/O intensives (API REST). Écosystème riche (NPM) et légèreté.|
| **Database**          | **MYSQL**                 | SGBD relationnel robuste, open-source, respectueux des standards SQL et réputé pour sa fiabilité et ses fonctionnalités avancées. |

---

## 8. Analyse des risques & Mitigation

| Risque                | Impact                    | Mitigation |
|---                    |---                        |         ---|
| **Surcharge de l'API**|Élevé(Service indisponible)| **Auto-scaling horizontal** du backend + **Load Balancer** pour distribuer la charge + **Rate Limiting**. |
| **Perte de la base de données** | Critique | **Backups quotidiens automatisés** + **Réplication** maître-esclave pour la haute disponibilité. |
| **Failles de sécurité (XSS, Injection SQL)** | Moyenne à Critique | **Validation systématique des entrées** (côté backend) + **Headers de sécurité** (CSP via Helmet) + **ORM/Requêtes paramétrées**. |
| **Divulgation de secrets (clés API, DB pass)** | Critique | Utilisation d'un **gestionnaire de secrets** (ex: AWS Secrets Manager, HashiCorp Vault) et de **variables d'environnement**. Jamais de secrets dans le code source. |