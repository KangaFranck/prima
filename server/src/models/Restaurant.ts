import mongoose, { Document } from 'mongoose';

export interface IRestaurant extends Document {
  nom: string;
  description?: string;
  cuisine?: string;
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
  createdAt: Date;
  updatedAt: Date;
}

const restaurantSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String },
  cuisine: { type: String },
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
  }
}, {
  timestamps: true
});

export default mongoose.model<IRestaurant>('Restaurant', restaurantSchema); 