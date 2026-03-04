import mongoose, { Document } from 'mongoose';

export interface ILoisir extends Document {
  nom: string;
  type?: string;
  description?: string;
  horaires?: string;
  telephone?: string;
  email?: string;
  adresse?: string;
  logo?: string;
  images?: string[];
  statut: 'actif' | 'inactif';
  ouvertLeDimanche: boolean;
  reseauxSociaux?: {
    instagram?: string;
    facebook?: string;
  };
  tarifs?: Array<{
    description: string;
    prix: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const loisirSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  type: { type: String },
  description: { type: String },
  horaires: { type: String },
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
  },
  tarifs: [{
    description: { type: String },
    prix: { type: Number }
  }]
}, {
  timestamps: true
});

export default mongoose.model<ILoisir>('Loisir', loisirSchema); 