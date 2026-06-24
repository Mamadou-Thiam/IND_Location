const Reservation = require('../models/Reservation');
const Car = require('../models/Car');

const getReservations = async (req, res) => {
  try {
    let reservations;
    if (req.user.role === 'admin') {
      reservations = await Reservation.find({})
        .populate('utilisateur', 'nom email telephone')
        .populate('voiture')
        .sort('-createdAt');
    } else {
      reservations = await Reservation.find({ utilisateur: req.user._id })
        .populate('utilisateur', 'nom email telephone')
        .populate('voiture')
        .sort('-createdAt');
    }
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('utilisateur', 'nom email telephone')
      .populate('voiture');

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    if (reservation.utilisateur._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const creerReservation = async (req, res) => {
  try {
    const { voiture: voitureId, dateDebut, dateFin } = req.body;

    const voiture = await Car.findById(voitureId);
    if (!voiture) {
      return res.status(404).json({ message: 'Voiture non trouvée' });
    }

    if (!voiture.disponible) {
      return res.status(400).json({ message: 'Cette voiture n\'est pas disponible' });
    }

    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    const nbJours = Math.ceil((fin - debut) / (1000 * 60 * 60 * 24));
    const prixTotal = nbJours * voiture.prixParJour;

    const reservation = await Reservation.create({
      utilisateur: req.user._id,
      voiture: voitureId,
      dateDebut: debut,
      dateFin: fin,
      prixTotal,
    });

    const reservationComplete = await Reservation.findById(reservation._id)
      .populate('utilisateur', 'nom email telephone')
      .populate('voiture');

    res.status(201).json(reservationComplete);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const modifierStatutReservation = async (req, res) => {
  try {
    const { statut } = req.body;
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { statut },
      { new: true }
    )
      .populate('utilisateur', 'nom email telephone')
      .populate('voiture');

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const annulerReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    if (reservation.utilisateur.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    reservation.statut = 'annulee';
    await reservation.save();

    res.json({ message: 'Réservation annulée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReservations,
  getReservation,
  creerReservation,
  modifierStatutReservation,
  annulerReservation,
};
