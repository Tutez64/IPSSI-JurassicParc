require('dotenv').config();
const express = require('express');
const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 2000;

async function connectWithRetry(retries = 0) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("Connecté à la DB");
    return client;  // On renvoie le client connecté
  } catch (err) {
    if (retries >= MAX_RETRIES) {
      console.error("Échec de connexion à PostgreSQL après plusieurs tentatives:", err);
      process.exit(1);
    }
    console.warn(`Connexion à la DB refusée, nouvelle tentative dans ${RETRY_DELAY_MS}ms... (${retries + 1})`);
    await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    return connectWithRetry(retries + 1);
  }
}

const app = express();
app.use(express.json());

async function startServer() {
  const client = await connectWithRetry();  // Récupération du client connecté

  // S'assurer que la table existe
  await client.query(`
    CREATE TABLE IF NOT EXISTS keepers (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      specialty TEXT CHECK (specialty IN ('carnivores','herbivores','medical','security')),
      sector TEXT,
      available BOOLEAN DEFAULT true,
      experience INT CHECK (experience BETWEEN 1 AND 10),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  app.get('/keepers', async (req, res) => {
    try {
      const result = await client.query('SELECT * FROM keepers');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  app.post('/keepers', async (req, res) => {
    const { name, specialty, sector, available, experience } = req.body;
    if (!name || !specialty || !sector || experience === undefined) {
      return res.status(400).json({ error: 'Champs manquants' });
    }

    const id = uuidv4();
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
      if (error.code === '23505') {
        res.status(409).json({ error: 'ID déjà existant' });
      } else {
        res.status(500).json({ error: 'Erreur serveur lors de l\'insertion' });
      }
    }
  });

  // Health check
  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(`API Parc2 écoute sur le port ${PORT}`);
  });
}

startServer();
