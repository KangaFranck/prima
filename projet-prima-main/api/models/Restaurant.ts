import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
  },
  cuisine: {
    type: String,
    required: [true, 'Le type de cuisine est requis'],
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
  menu: [{
    nom: String,
    description: String,
    prix: Number,
    categorie: String
  }]
}, {
  timestamps: true,
});

export default mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema); 