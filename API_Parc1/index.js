// index.js

// Importation du fichier de configuration Sequelize
const sequelize = require('./config/sequelize');
// Importation de l'application Express
const app = require('./src/app');

// Définition du port depuis le fichier .env ou défaut à 5000
const PORT = process.env.PORT || 5000;

// Connexion à la base de données PostgreSQL via Sequelize
sequelize.sync({ alter: true }) // alter:true pour adapter la structure si besoin
  .then(() => {
    console.log('Connexion à la base de données réussie');

    // Démarrage du serveur Express après la connexion à la DB
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erreur de connexion à la base de données :', error);
  });
