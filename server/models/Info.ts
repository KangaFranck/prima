import mongoose from 'mongoose';

const infoSchema = new mongoose.Schema({
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
    required: [true, 'Le type d\'information est requis'],
    enum: ['service', 'info', 'faq'],
  },
  icon: {
    type: String,
  },
  image: {
    type: String,
  },
  ordre: {
    type: Number,
    default: 0,
  },
  statut: {
    type: String,
    enum: ['actif', 'inactif'],
    default: 'actif',
  },
  contenu: {
    type: String,
    required: [true, 'Le contenu est requis'],
  },
  horaires: {
    type: String,
  },
  contact: {
    telephone: String,
    email: String,
    adresse: String
  }
}, {
  timestamps: true,
});

export default mongoose.models.Info || mongoose.model('Info', infoSchema); 