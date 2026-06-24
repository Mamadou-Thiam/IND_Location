const User = require('../models/User');
const jwt = require('jsonwebtoken');

const genererToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const inscrire = async (req, res) => {
  try {
    const { nom, email, telephone, motDePasse } = req.body;

    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const utilisateur = await User.create({ nom, email, telephone, motDePasse });

    res.status(201).json({
      _id: utilisateur._id,
      nom: utilisateur.nom,
      email: utilisateur.email,
      telephone: utilisateur.telephone,
      role: utilisateur.role,
      token: genererToken(utilisateur._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const connecter = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    const utilisateur = await User.findOne({ email }).select('+motDePasse');
    if (!utilisateur) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    const estValide = await utilisateur.comparerMotDePasse(motDePasse);
    if (!estValide) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    res.json({
      _id: utilisateur._id,
      nom: utilisateur.nom,
      email: utilisateur.email,
      telephone: utilisateur.telephone,
      role: utilisateur.role,
      token: genererToken(utilisateur._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfil = async (req, res) => {
  try {
    const utilisateur = await User.findById(req.user._id);
    res.json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { inscrire, connecter, getProfil };
