require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function init() {
  await client.connect();
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
  console.log("DB initialized");
}

module.exports = {
  client,
  init,
};
