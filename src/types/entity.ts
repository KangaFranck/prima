export interface Entity {
  id?: string;
  nom: string;
  description: string;
  heureOuverture: string;
  heureFermeture: string;
  horaires?: string;
  openSunday: boolean;
  logo?: File | string;
  images?: File[] | string[];
  statut: 'actif' | 'inactif';
  createdAt?: string;
  updatedAt?: string;
  telephone?: string;
  instagram?: string;
  facebook?: string;
  email?: string;
  website?: string;
  logoCarousel?: File | string;
}

export interface Boutique extends Entity {
  type: 'boutique';
  categorie?: string;
}

export interface Restaurant extends Entity {
  type: 'restaurant';
  cuisine?: string;
}

export interface Loisir extends Entity {
  type: 'loisir';
  activites?: string[];
}

export interface Service extends Entity {
  type: 'service';
  adresse?: string;
}

export type { Evenement } from './admin'; 