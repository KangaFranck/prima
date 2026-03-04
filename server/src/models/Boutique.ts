import mongoose, { Document } from 'mongoose';

export interface IBoutique extends Document {
  nom: string;
  type?: string;
  description?: string;
  horaires?: {
    jour: string;
    heureOuverture: string;
    heureFermeture: string;
  }[];
  telephone?: string;
  email?: string;
  adresse?: string;
  logo?: string;
  images: string[];
  statut: 'actif' | 'inactif';
  ouvertLeDimanche: boolean;
  reseauxSociaux: {
    instagram?: string;
    facebook?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const boutiqueSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  type: { type: String },
  description: { type: String },
  horaires: [{
    jour: { type: String, required: true },
    heureOuverture: { type: String, required: true },
    heureFermeture: { type: String, required: true }
  }],
  telephone: { type: String },
  email: { type: String },
  adresse: { type: String },
  logo: { type: String },
  images: [{ type: String }],
  statut: { type: String, enum: ['actif', 'inactif'], default: 'actif' },
  ouvertLeDimanche: { type: Boolean, default: false },
  reseauxSociaux: {
    instagram: { type: String },
    facebook: { type: String }
  }
}, {
  timestamps: true
});

export default mongoose.model<IBoutique>('Boutique', boutiqueSchema); 