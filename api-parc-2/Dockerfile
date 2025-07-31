FROM node:18

WORKDIR /usr/src/app

# Copier les manifestes et installer les dépendances
COPY package*.json ./
RUN npm ci --omit=dev

# Copier le code
COPY . .

EXPOSE 3002

CMD ["node", "index.js"]
