# Étape 1 : image Node.js officielle
FROM node:18

# Dossier de travail dans le container
WORKDIR /usr/src/app

# Copier package.json et package-lock.json puis installer les dépendances
COPY package*.json ./
RUN npm install

# Copier tout le code
COPY . .

# Exposer le port que l'app utilise
EXPOSE 3002

# Commande pour démarrer l'API
CMD ["node", "index.js"]
