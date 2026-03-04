import mongoose from 'mongoose';

const loisirSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
  },
  type: {
    type: String,
    required: [true, 'Le type de loisir est requis'],
    enum: ['sport', 'divertissement', 'culture'],
  },
  level: {
    type: String,
    required: [true, 'Le niveau est requis'],
  },
  image: {
    type: String,
    required: [true, 'L\'image est requise'],
  },
  logo: {
    type: String,
  },
  horaires: {
    type: String,
    required: [true, 'Les horaires sont requis'],
  },
  heureOuverture: {
    type: String,
    required: [true, 'L\'heure d\'ouverture est requise'],
  },
  heureFermeture: {
    type: String,
    required: [true, 'L\'heure de fermeture est requise'],
  },
  openSunday: {
    type: Boolean,
    default: false,
  },
  statut: {
    type: String,
    enum: ['actif', 'inactif'],
    default: 'actif',
  },
  telephone: String,
  instagram: String,
  facebook: String,
  email: String,
  tarifs: [{
    nom: String,
    prix: Number,
    description: String
  }]
}, {
  timestamps: true,
});

export default mongoose.models.Loisir || mongoose.model('Loisir', loisirSchema); 