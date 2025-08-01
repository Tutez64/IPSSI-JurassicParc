require('dotenv').config();
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { connectWithRetry, initTables } = require('./db');

const app = express();
app.use(express.json());

async function startServer() {
  const client = await connectWithRetry();
  await initTables(); // crée les tables une fois connecté

  // ---- KEEPERS ----
  app.get('/keepers', async (req, res) => {
    try {
      const result = await client.query('SELECT * FROM keepers');
      res.json(result.rows);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  app.get('/keepers/:id', async (req, res) => {
    try {
      const result = await client.query('SELECT * FROM keepers WHERE id=$1', [req.params.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Keeper non trouvé' });
      res.json(result.rows[0]);
    } catch (e) {
      console.error(e);
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
      const result = await client.query(
        `INSERT INTO keepers (id, name, specialty, sector, available, experience)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;`,
        [id, name, specialty, sector, available ?? true, experience]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erreur insertion keeper:', error);
      if (error.code === '23505') res.status(409).json({ error: 'ID déjà existant' });
      else res.status(500).json({ error: 'Erreur serveur lors de l\'insertion' });
    }
  });

  app.put('/keepers/:id', async (req, res) => {
    const { name, specialty, sector, available, experience } = req.body;
    try {
      const result = await client.query(
        `UPDATE keepers SET name=$1, specialty=$2, sector=$3, available=$4, experience=$5
         WHERE id=$6 RETURNING *;`,
        [name, specialty, sector, available, experience, req.params.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Keeper non trouvé' });
      res.json(result.rows[0]);
    } catch (e) {
      console.error('Erreur update keeper:', e);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  app.delete('/keepers/:id', async (req, res) => {
    try {
      const result = await client.query('DELETE FROM keepers WHERE id=$1 RETURNING *;', [req.params.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Keeper non trouvé' });
      res.json({ deleted: true });
    } catch (e) {
      console.error('Erreur delete keeper:', e);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // ---- DINOSAURS ----
  app.get('/dinosaurs', async (req, res) => {
    try {
      const result = await client.query('SELECT * FROM dinosaurs');
      res.json(result.rows);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  app.get('/dinosaurs/:id', async (req, res) => {
    try {
      const result = await client.query('SELECT * FROM dinosaurs WHERE id=$1', [req.params.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Dinosaur non trouvé' });
      res.json(result.rows[0]);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  app.post('/dinosaurs', async (req, res) => {
    const { name, species, enclosure, health_status, danger_level } = req.body;
    if (!name || !species) return res.status(400).json({ error: 'name et species requis' });
    const id = uuidv4();
    try {
      const result = await client.query(
        `INSERT INTO dinosaurs (id, name, species, enclosure, health_status, danger_level)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;`,
        [id, name, species, enclosure || null, health_status || 'healthy', danger_level || 1]
      );
      res.status(201).json(result.rows[0]);
    } catch (e) {
      console.error('Erreur insertion dinosaur:', e);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  app.put('/dinosaurs/:id', async (req, res) => {
    const { name, species, enclosure, health_status, danger_level } = req.body;
    try {
      const result = await client.query(
        `UPDATE dinosaurs SET name=$1, species=$2, enclosure=$3, health_status=$4, danger_level=$5
         WHERE id=$6 RETURNING *;`,
        [name, species, enclosure, health_status, danger_level, req.params.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Dinosaur non trouvé' });
      res.json(result.rows[0]);
    } catch (e) {
      console.error('Erreur update dinosaur:', e);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  app.delete('/dinosaurs/:id', async (req, res) => {
    try {
      const result = await client.query('DELETE FROM dinosaurs WHERE id=$1 RETURNING *;', [req.params.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Dinosaur non trouvé' });
      res.json({ deleted: true });
    } catch (e) {
      console.error('Erreur delete dinosaur:', e);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // ---- INCIDENTS ----
  app.get('/incidents', async (req, res) => {
    try {
      const result = await client.query('SELECT * FROM incidents');
      res.json(result.rows);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  app.get('/incidents/:id', async (req, res) => {
    try {
      const result = await client.query('SELECT * FROM incidents WHERE id=$1', [req.params.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Incident non trouvé' });
      res.json(result.rows[0]);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  app.post('/incidents', async (req, res) => {
    const { dinosaur_id, description, severity, status } = req.body;
    if (!dinosaur_id || !description) return res.status(400).json({ error: 'dinosaur_id et description requis' });
    const id = uuidv4();
    try {
      const result = await client.query(
        `INSERT INTO incidents (id, dinosaur_id, description, severity, status)
         VALUES ($1,$2,$3,$4,$5) RETURNING *;`,
        [id, dinosaur_id, description, severity || 'low', status || 'open']
      );
      res.status(201).json(result.rows[0]);
    } catch (e) {
      console.error('Erreur insertion incident:', e);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  app.put('/incidents/:id', async (req, res) => {
    const { dinosaur_id, description, severity, status } = req.body;
    try {
      const result = await client.query(
        `UPDATE incidents SET dinosaur_id=$1, description=$2, severity=$3, status=$4
         WHERE id=$5 RETURNING *;`,
        [dinosaur_id, description, severity, status, req.params.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Incident non trouvé' });
      res.json(result.rows[0]);
    } catch (e) {
      console.error('Erreur update incident:', e);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  app.delete('/incidents/:id', async (req, res) => {
    try {
      const result = await client.query('DELETE FROM incidents WHERE id=$1 RETURNING *;', [req.params.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Incident non trouvé' });
      res.json({ deleted: true });
    } catch (e) {
      console.error('Erreur delete incident:', e);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // health
  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(`API Parc2 écoute sur le port ${PORT}`);
  });
}

startServer();
