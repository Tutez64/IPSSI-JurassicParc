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

app.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;  // Export the app instance