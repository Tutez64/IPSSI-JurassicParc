
// Importation du modèle Parc 
const Parc = require('../models/parcModel');

// Contrôleur pour obtenir tous les parcs
exports.getAllParcs = async (req, res) => {
    try {
        //  Mongoose pour récupérer tous les documents de la collection Parc
        const parcs = await Parc.find();

        // Renvoie les parcs trouvés avec le code HTTP 200 
        res.status(200).json(parcs);
    } catch (error) {
        // En cas d'erreur (ex : problème de connexion DB), renvoie une erreur 500 (Server Error)
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// Contrôleur pour créer un nouveau parc
exports.createParc = async (req, res) => {
    try {
        // pour crée une nouvelle instance du modèle Parc avec les données du corps de la requête
        const newParc = new Parc(req.body);

        // Sauvegarde le nouveau parc dans la base de données
        await newParc.save();

        // Renvoie une réponse avec code 201 (Created) et le parc créé
        res.status(201).json(newParc);
    } catch (error) {
        // Si une erreur survient (ex : validation), renvoie une erreur 400 (Bad Request)
        res.status(400).json({ message: 'Échec de création', error });
    }
};
