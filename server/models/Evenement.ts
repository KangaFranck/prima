import mongoose from 'mongoose';

const evenementSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
  },
  type: {
    type: String,
    required: [true, 'Le type d\'événement est requis'],
    enum: ['promotion', 'evenement', 'actualite'],
  },
  image: {
    type: String,
    required: [true, 'L\'image est requise'],
  },
  dateDebut: {
    type: Date,
    required: [true, 'La date de début est requise'],
  },
  dateFin: {
    type: Date,
    required: [true, 'La date de fin est requise'],
  },
  lieu: {
    type: String,
    required: [true, 'Le lieu est requis'],
  },
  statut: {
    type: String,
    enum: ['actif', 'inactif'],
    default: 'actif',
  },
  boutiques: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Boutique'
  }],
  restaurants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }],
  loisirs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loisir'
  }]
}, {
  timestamps: true,
});

export default mongoose.models.Evenement || mongoose.model('Evenement', evenementSchema); 