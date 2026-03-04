import { Document } from 'mongoose';

export interface IBoutique extends Document {
  nom: string;
  description?: string;
  images: string[];
  logo?: string;
  type?: string;
  horaires?: {
    jour: string;
    heureOuverture: string;
    heureFermeture: string;
  }[];
  contact?: {
    telephone?: string;
    email?: string;
    adresse?: string;
  };
  reseauxSociaux?: {
    facebook?: string;
    instagram?: string;
  };
  statut: 'actif' | 'inactif';
  ouvertLeDimanche: boolean;
}

export interface IRestaurant extends Document {
  nom: string;
  description?: string;
  images: string[];
  logo?: string;
  type?: string;
  horaires?: {
    jour: string;
    heureOuverture: string;
    heureFermeture: string;
  }[];
  contact?: {
    telephone?: string;
    email?: string;
    adresse?: string;
  };
  reseauxSociaux?: {
    facebook?: string;
    instagram?: string;
  };
  statut: 'actif' | 'inactif';
  ouvertLeDimanche: boolean;
}

export interface ILoisir extends Document {
  nom: string;
  description?: string;
  images: string[];
  logo?: string;
  type?: string;
  horaires?: {
    jour: string;
    heureOuverture: string;
    heureFermeture: string;
  }[];
  contact?: {
    telephone?: string;
    email?: string;
    adresse?: string;
  };
  reseauxSociaux?: {
    facebook?: string;
    instagram?: string;
  };
  statut: 'actif' | 'inactif';
  ouvertLeDimanche: boolean;
  tarifs: {
    description?: string;
    prix?: number;
  }[];
} 