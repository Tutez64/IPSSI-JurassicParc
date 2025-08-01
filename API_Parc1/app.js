// Importation des modules nécessaires
const express = require('express');
const dotenv = require('dotenv');
const parcRoutes = require('./routes/parcRoutes');
const errorHandler = require('./middleware/errorHandler');

// Chargement des variables d'environnement à partir du fichier .env
dotenv.config();

// Création d'une application Express
const app = express();

// Middleware pour parser les données JSON dans les requêtes
app.use(express.json());

// Routes principales de l’API (ex : /api/parcs)
app.use('/api/parcs', parcRoutes);

// Middleware de gestion des erreurs personnalisé
app.use(errorHandler);

// Définition du port sur lequel le serveur va écouter
const PORT = process.env.PORT || 5000;

// Démarrage du serveur Express
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
