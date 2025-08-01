FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src .

EXPOSE 3001

CMD ["node", "index.js"]
