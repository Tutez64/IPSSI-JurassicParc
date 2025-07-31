require('dotenv').config();
const express = require('express');
const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
app.use(express.json());

async function startServer() {
  try {
    await client.connect();
    console.log("Connecté à la DB");

    // Endpoint GET pour récupérer tous les keepers
    app.get('/keepers', async (req, res) => {
      try {
        const result = await client.query('SELECT * FROM keepers');
        res.json(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
      }
    });

    // Endpoint POST pour créer un nouveau keeper avec UUID généré automatiquement
    app.post('/keepers', async (req, res) => {
      const { name, specialty, sector, available, experience } = req.body;

      // Validation simple des champs requis
      if (!name || !specialty || !sector || experience === undefined) {
        return res.status(400).json({ error: 'Champs manquants' });
      }

      const id = uuidv4(); // Génération d'un nouvel UUID

      try {
        const query = `
          INSERT INTO keepers (id, name, specialty, sector, available, experience)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *;
        `;
        const values = [id, name, specialty, sector, available ?? true, experience];

        const result = await client.query(query, values);
        res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error('Erreur lors de l\'insertion :', error);
        res.status(500).json({ error: 'Erreur serveur lors de l\'insertion' });
      }
    });

    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
      console.log(`API Parc2 écoute sur le port ${PORT}`);
    });

  } catch (error) {
    console.error("Erreur lors du démarrage du serveur:", error);
  }
}

startServer();
