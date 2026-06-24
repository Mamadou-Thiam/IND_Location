const mongoose = require('mongoose');

const carSchema = mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
    },
    categorie: {
      type: String,
      required: true,
      enum: ['citadine', 'berline', 'suv'],
    },
    prixParJour: {
      type: Number,
      required: [true, 'Le prix par jour est requis'],
      min: 0,
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    disponible: {
      type: Boolean,
      default: true,
    },
    transmission: {
      type: String,
      enum: ['manuelle', 'automatique'],
      default: 'manuelle',
    },
    places: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Car', carSchema);
