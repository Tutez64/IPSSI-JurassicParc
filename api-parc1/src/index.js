const sequelize = require('./config/sequelize');
const app = require('./app');

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
    .then(() => {
        console.log('Connexion à la base de données réussie');

        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log('Modèles synchronisés avec la DB');

        // Start server
        app.listen(PORT, () => {
            console.log(`Serveur lancé sur http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Erreur de connexion à la base de données :', error);
    });