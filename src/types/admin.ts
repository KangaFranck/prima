export type StatutBoutique = 'actif' | 'inactif';
export type StatutEvenement = 'planifié' | 'en cours' | 'terminé';
export type StatutRestaurant = 'actif' | 'inactif';
export type StatutLoisir = 'actif' | 'inactif';

export interface Boutique {
  id: string;
  nom: string;
  description: string;
  image?: string;
  logo?: string;
  logoCarousel?: string;
  website?: string;
  statut: 'actif' | 'inactif';
  universe: string;
  createdAt?: string;
  updatedAt?: string;
  horaires?: string;
  heureOuverture: string;
  heureFermeture: string;
  openSunday: boolean;
}

export interface Restaurant {
  id: string;
  nom: string;
  cuisine: string;
  horaires: string;
  heureOuverture: string;
  heureFermeture: string;
  openSunday: boolean;
  statut: 'actif' | 'inactif';
  logo?: string;
  logoCarousel?: string;
  website?: string;
  menu?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Loisir {
  id: string;
  nom: string;
  description: string;
  image: string;
  logo?: string;
  logoCarousel?: string;
  website?: string;
  type: string;
  level: string;
  statut: StatutLoisir;
  horaires?: string;
  heureOuverture: string;
  heureFermeture: string;
  openSunday: boolean;
}

export interface Evenement {
  id: string;
  titre: string;
  description: string;
  date: string;
  lieu: string;
  statut: StatutEvenement;
  affiche?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminState {
  boutiques: Boutique[];
  restaurants: Restaurant[];
  loisirs: Loisir[];
  evenements: Evenement[];
  loading: boolean;
  error: string | null;
} 