require('dotenv').config();
const { Client } = require('pg');

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 2000;

let client = null;

async function connectWithRetry(retries = 0) {
  if (client) return client; // déjà connecté

  client = new Client({
    host: process.env.DB_HOST || 'postgres2',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'jurassic_db2',
  });

  try {
    await client.connect();
    console.log('Connecté à la DB');
    return client;
  } catch (err) {
    if (retries >= MAX_RETRIES) {
      console.error('Échec de connexion à PostgreSQL après plusieurs tentatives:', err);
      process.exit(1);
    }
    console.warn(`Connexion refusée, tentative ${retries + 1}/${MAX_RETRIES} dans ${RETRY_DELAY_MS}ms...`);
    await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    client = null;
    return connectWithRetry(retries + 1);
  }
}

async function initTables() {
  const c = await connectWithRetry();

  await c.query(`
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

  await c.query(`
    CREATE TABLE IF NOT EXISTS dinosaurs (
                                           id UUID PRIMARY KEY,
                                           name TEXT NOT NULL,
                                           species TEXT NOT NULL,
                                           enclosure TEXT,
                                           health_status TEXT CHECK (health_status IN ('healthy','sick','critical')),
      last_fed_at TIMESTAMP,
      danger_level INT CHECK (danger_level BETWEEN 1 AND 10),
      created_at TIMESTAMP DEFAULT NOW()
      );
  `);

  await c.query(`
    CREATE TABLE IF NOT EXISTS incidents (
                                           id UUID PRIMARY KEY,
                                           dinosaur_id UUID REFERENCES dinosaurs(id),
      description TEXT,
      severity TEXT CHECK (severity IN ('low','medium','high','critical')),
      status TEXT CHECK (status IN ('open','in-progress','resolved')),
      created_at TIMESTAMP DEFAULT NOW()
      );
  `);
}

module.exports = {
  connectWithRetry,
  initTables,
};