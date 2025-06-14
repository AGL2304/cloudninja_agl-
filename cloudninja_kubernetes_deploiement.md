
# 📘 Documentation de déploiement Kubernetes – CloudNinja

## 🎯 Objectif
Déployer l’application CloudNinja sur un cluster Kubernetes local (Minikube) avec haute disponibilité, gestion des variables d’environnement, et configuration des sondes de santé.

---

## 🏗️ Étapes du déploiement

### 1. 🧱 Création des manifestes Kubernetes

#### ✅ Deployment
Fichier : `deployment.yaml`

- 3 réplicas pour assurer la haute disponibilité
- Image Docker hébergée sur GitHub Container Registry
- Utilisation d’un container nommé `cloudninja-container`
- Configuration de `livenessProbe` et `readinessProbe` :

```yaml
livenessProbe:
  httpGet:
    path: /
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
  timeoutSeconds: 1
readinessProbe:
  httpGet:
    path: /
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 1
```

#### ✅ Service
Fichier : `service.yaml`

- Type : `NodePort` pour permettre un accès depuis l’extérieur du cluster.
- Port exposé : `30080`

```yaml
spec:
  type: NodePort
  ports:
    - port: 80
      targetPort: 3000
      nodePort: 30080
```

#### ✅ ConfigMap et Secret
- `ConfigMap` : pour injecter les variables d’environnement non sensibles.
- `Secret` : pour injecter les données sensibles.

```yaml
envFrom:
  - configMapRef:
      name: cloudninja-config
  - secretRef:
      name: cloudninja-secret
```

---

## 🚀 Déploiement sur Minikube

### Commandes utilisées :

```bash
minikube start
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

### Vérification des ressources :

```bash
kubectl get all
```

Résultat :
```
NAME                                        READY   STATUS    RESTARTS   AGE
pod/cloudninja-deployment-xxxxx             1/1     Running   0          Xs
...

NAME                         TYPE        CLUSTER-IP     PORT(S)
service/cloudninja-service   NodePort    10.XXX.X.XXX   80:30080/TCP
```

---

## 📈 Test de disponibilité

### Accès à l’application :

```bash
minikube service cloudninja-service
```

Retour :
```
http://127.0.0.1:43391
```

### Test avec `curl` :

```bash
curl http://127.0.0.1:43391/api/status
```

Réponse :
```json
{"status":"ok","uptime":600.545636237}
```

---

## 🔁 Preuve de haute disponibilité

### Suppression manuelle d’un pod

```bash
kubectl delete pod cloudninja-deployment-xxxxx
```

Résultat :
```
pod "cloudninja-deployment-xxxxx" deleted
```

### Vérification immédiate :

```bash
kubectl get pods
```

Résultat :
```
Un nouveau pod est automatiquement recréé par le ReplicaSet.
```

### Application toujours accessible :

```bash
curl http://127.0.0.1:43391/api/status
```

Réponse :
```json
{"status":"ok","uptime":20.123}
```

---

## ✅ Résultat

Tous les critères de la quête sont remplis :

- [x] Déploiement avec plusieurs réplicas
- [x] Service exposé en NodePort
- [x] ConfigMap et Secret utilisés
- [x] Liveness et readiness probes
- [x] Test de haute dispo validé (pod supprimé, service toujours dispo)

> 🏆 **Quête 5 validée avec succès !**
