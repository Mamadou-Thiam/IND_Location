const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema(
  {
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    voiture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    dateDebut: {
      type: Date,
      required: [true, 'La date de début est requise'],
    },
    dateFin: {
      type: Date,
      required: [true, 'La date de fin est requise'],
    },
    prixTotal: {
      type: Number,
      required: true,
    },
    statut: {
      type: String,
      enum: ['en_attente', 'confirmee', 'annulee', 'terminee'],
      default: 'en_attente',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Reservation', reservationSchema);
