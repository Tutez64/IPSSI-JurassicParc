// Importation des modules Sequelize
const { Sequelize } = require('api-parc1/src/config/sequelize');

// Connexion à PostgreSQL avec les variables d’environnement
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres', // on utilise PostgreSQL
  logging: false,      // désactive les logs SQL dans la console
});

// Vérifie la connexion
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log(' Connexion PostgreSQL réussie');
  } catch (error) {
    console.error('Connexion PostgreSQL échouée :', error);
  }
}

module.exports = { sequelize, connectDB };
