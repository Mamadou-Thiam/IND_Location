const Car = require('../models/Car');

const getVoitures = async (req, res) => {
  try {
    const filtre = {};
    if (req.query.disponible) filtre.disponible = req.query.disponible === 'true';
    if (req.query.categorie) filtre.categorie = req.query.categorie;

    const voitures = await Car.find(filtre).sort('-createdAt');
    res.json(voitures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVoiture = async (req, res) => {
  try {
    const voiture = await Car.findById(req.params.id);
    if (!voiture) {
      return res.status(404).json({ message: 'Voiture non trouvée' });
    }
    res.json(voiture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const creerVoiture = async (req, res) => {
  try {
    const voiture = await Car.create(req.body);
    res.status(201).json(voiture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const modifierVoiture = async (req, res) => {
  try {
    const voiture = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!voiture) {
      return res.status(404).json({ message: 'Voiture non trouvée' });
    }
    res.json(voiture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const supprimerVoiture = async (req, res) => {
  try {
    const voiture = await Car.findByIdAndDelete(req.params.id);
    if (!voiture) {
      return res.status(404).json({ message: 'Voiture non trouvée' });
    }
    res.json({ message: 'Voiture supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVoitures,
  getVoiture,
  creerVoiture,
  modifierVoiture,
  supprimerVoiture,
};
