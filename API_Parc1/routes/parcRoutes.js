
// On importe Express pour créer un routeur
const express = require('express');

// On importe les fonctions du contrôleur qui gère la logique métier
const { getAllParcs, createParc, getParcById } = require('../controllers/parcController');

// On crée un nouveau routeur Express
const router = express.Router();

// Route GET /api/parcs - Récupérer tous les parcs
router.get('/', getAllParcs);

// Route POST /api/parcs - Créer un nouveau parc
router.post('/', createParc);

// Route GET /api/parcs/:id - Récupérer un parc par son ID
router.get('/:id', getParcById);

// On exporte le routeur pour l'utiliser dans app.js
module.exports = router;
