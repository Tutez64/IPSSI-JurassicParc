# IPSSI-JurassicParc

## Description
Infrastructure DevOps pour Jurassic Park : 2 APIs Node.js gérant Dinosaurs, Incidents, Keepers, avec Docker, volume partagé, NGINX, et CI/CD.

## Membres de l'Équipe
- Rakem
- Bechir
- Enzo

## Villes des Campus
- Lille
- Montpellier
- Nice

## URLs
- GitHub Project: https://github.com/Tutez64/IPSSI-JurassicParc
- Production: https://jurassic-prod.onrender.com
- Staging: https://jurassic-staging.onrender.com

## Guide d'Utilisation
1. Clonez le repo.
2. Configurez .env avec DB credentials.
3. Lancez : `docker-compose up --build`
4. Accédez : http://localhost/parc1/dinosaurs (via NGINX)
5. Pour deploy : Push sur main/develop déclenche CI/CD.