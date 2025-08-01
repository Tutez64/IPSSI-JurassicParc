# IPSSI-JurassicParc

## Description
Infrastructure DevOps pour Jurassic Park : deux APIs Node.js gérant la gestion des dinosaures, incidents et gardiens (keepers), avec une architecture microservices, utilisant Docker, volumes partagés, NGINX en reverse proxy, PostgreSQL, Redis pour le cache, et CI/CD automatisé via GitHub Actions.

---

## Membres de l'Équipe
- Rakem — Responsable API Parc 2 (Node.js + PostgreSQL + Redis)  
- Bechir — Responsable API Parc 1 (Node.js + PostgreSQL + volume Docker partagé)  
- Enzo — Responsable Infrastructure, Docker Compose, NGINX, CI/CD, Monitoring  

---

## Villes des Campus
- Lille  
- Montpellier  
- Nice  

---

## URLs
- GitHub Project : https://github.com/Tutez64/IPSSI-JurassicParc  
- Production : https://jurassic-prod.onrender.com  
- Staging : https://jurassic-staging.onrender.com  

---

## Fonctionnalités principales

- API Parc 1 et Parc 2 :  
  - Gestion CRUD des dinosaures, incidents, et gardiens  
  - Uploads et gestion des images (API Parc 1)  
  - Caching avec Redis (API Parc 2)  
- Architecture Dockerisée avec orchestration via `docker-compose`  
- Reverse proxy NGINX pour router `/parc1` et `/parc2` vers les bonnes APIs  
- CI/CD automatisé déclenché par push sur branches `main` et `develop`  
- Monitoring centralisé des logs et santé des APIs  
- Volume Docker partagé entre services pour la persistance des données  

---

## Guide d'utilisation

1. Clonez le dépôt :  
   ```bash
   git clone https://github.com/Tutez64/IPSSI-JurassicParc.git
   cd IPSSI-JurassicParc
2 .Créez un fichier .env à la racine avec les variables suivantes :

env
 `
DB_NAME=jurassic_db
DB_USER=postgres
DB_PASSWORD=motdepasse
DB_HOST=postgres1
REDIS_HOST=redis
PORT=3000 `
3 .Lancez tous les services avec Docker Compose :

 `
docker-compose up --build`
4 .Accédez à l'API Parc 1 via NGINX :
`http://localhost/parc1/dinosaurs`

5.Pour déployer, poussez sur les branches main ou develop déclenche le pipeline CI/CD configuré.

# Prochaines étapes / Ce qu'il manque à faire
Compléter le fichier .env avec toutes les variables nécessaires pour chaque service

Vérifier et stabiliser la connexion Redis dans l'API Parc 2 (éviter erreurs ClientClosedError)

Finaliser la configuration NGINX pour un routage propre et gestion des erreurs (404, 500)

Ajouter des tests unitaires et d'intégration pour améliorer la robustesse

Mettre en place un monitoring temps réel plus complet (logs centralisés, alertes)

S’assurer que la CI/CD est entièrement opérationnelle et déclenche les déploiements automatiquement

Documenter précisément l’architecture, le workflow et la procédure de déploiement pour les nouveaux arrivants
