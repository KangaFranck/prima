export type FilterType = 'tgtg' | 'rdv' | 'click';

export type CategoryType = 
  | 'Mode'
  | 'Restaurant & FastFood'
  | 'Bien-être et Santé'
  | 'Sports et Loisirs'
  | 'Enfant'
  | 'Déco maison et cadeau'
  | 'Divers'
  | 'Électro et Tech'
  | 'Services'
  | 'Parfumerie';

export interface OpeningHours {
  day: string;
  hours: string;
}

export interface Shop {
  id: string;
  name: string;
  logo: string;
  categories: CategoryType[];
  filters?: FilterType[];
  slug: string;
  description?: string;
  openingHours?: OpeningHours[];
  phone?: string;
}

export interface UniverseDescription {
  name: CategoryType;
  description: string;
  count: number;
  icon: string;
} 