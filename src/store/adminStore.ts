import { create } from 'zustand';
import { Boutique, Restaurant, Loisir } from '../types/entity';
import { Evenement } from '../types/Evenement';

interface FitnessCenter {
  id: string;
  nom: string;
  description: string;
  equipements: string[];
  horaires: string;
  tarifs: string;
  image?: string;
  statut: 'actif' | 'inactif';
}

interface AdminStore {
  boutiques: Boutique[];
  evenements: Evenement[];
  restaurants: Restaurant[];
  fitness: FitnessCenter[];
  loisirs: Loisir[];
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setBoutiques: (boutiques: Boutique[]) => void;
  setEvenements: (evenements: Evenement[]) => void;
  setRestaurants: (restaurants: Restaurant[]) => void;
  setFitness: (fitness: FitnessCenter[]) => void;
  setLoisirs: (loisirs: Loisir[]) => void;
  addBoutique: (boutique: Boutique) => void;
  addEvenement: (evenement: Evenement) => void;
  addRestaurant: (restaurant: Restaurant) => void;
  addFitness: (fitness: FitnessCenter) => void;
  addLoisir: (loisir: Loisir) => void;
  updateBoutique: (id: string, boutique: Partial<Boutique>) => void;
  updateEvenement: (id: string, evenement: Partial<Evenement>) => void;
  updateRestaurant: (id: string, restaurant: Partial<Restaurant>) => void;
  updateFitness: (id: string, fitness: Partial<FitnessCenter>) => void;
  updateLoisir: (id: string, loisir: Partial<Loisir>) => void;
  deleteBoutique: (id: string) => void;
  deleteEvenement: (id: string) => void;
  deleteRestaurant: (id: string) => void;
  deleteFitness: (id: string) => void;
  deleteLoisir: (id: string) => void;
  fetchBoutiques: () => Promise<void>;
  fetchRestaurants: () => Promise<void>;
}

// Fonctions utilitaires pour le localStorage
const loadFromLocalStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Erreur lors du chargement de ${key}:`, error);
    return [];
  }
};

const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
  }
};

const initialRestaurants: Restaurant[] = [
  {
    id: '1',
    nom: 'Le Food Hall',
    description: 'Un espace convivial proposant une cuisine variée et internationale',
    type: 'food',
    image: '/images/restaurants-hero-2.jpg',
    horaires: 'Lun-Dim: 11h30-22h00',
    heureOuverture: '11:30',
    heureFermeture: '22:00',
    openSunday: true,
    statut: 'actif'
  },
  {
    id: '2',
    nom: 'Café Gourmand',
    description: 'Pâtisseries artisanales et cafés de spécialité',
    type: 'cafe',
    image: '/images/restaurants-hero-2.jpg',
    horaires: 'Lun-Dim: 8h00-20h00',
    heureOuverture: '08:00',
    heureFermeture: '20:00',
    openSunday: true,
    statut: 'actif'
  },
  {
    id: '3',
    nom: 'Le Lounge',
    description: 'Bar à cocktails avec vue panoramique',
    type: 'bar',
    image: '/images/restaurants-hero-2.jpg',
    horaires: 'Lun-Dim: 17h00-02h00',
    heureOuverture: '17:00',
    heureFermeture: '02:00',
    openSunday: true,
    statut: 'actif'
  },
  {
    id: '4',
    nom: 'Prima Fitness',
    description: 'Salle de sport moderne et spacieuse',
    type: 'loisir',
    image: '/images/sections/loisirs-hero-2.jpg',
    horaires: 'Lun-Dim: 6h00-23h00',
    heureOuverture: '06:00',
    heureFermeture: '23:00',
    openSunday: true,
    statut: 'actif'
  }
];

const initialBoutiques: Boutique[] = [
  {
    id: '1',
    nom: 'Zara',
    description: 'Mode et accessoires',
    universe: 'Mode',
    image: '/images/sections/boutiques-hero.jpg',
    horaires: 'Lun-Sam: 10:00-20:00',
    heureOuverture: '10:00',
    heureFermeture: '20:00',
    openSunday: false,
    statut: 'actif'
  },
  {
    id: '2',
    nom: 'H&M',
    description: 'Mode pour toute la famille',
    universe: 'Mode',
    image: '/images/sections/boutiques-hero.jpg',
    horaires: 'Lun-Dim: 09:00-19:30',
    heureOuverture: '09:00',
    heureFermeture: '19:30',
    openSunday: true,
    statut: 'actif'
  }
];

const initialLoisirs: Loisir[] = [
  {
    id: '1',
    nom: 'Prima Fitness',
    description: 'Salle de sport moderne',
    type: 'sport',
    level: 'tous niveaux',
    image: '/images/sections/loisirs-hero.jpg',
    horaires: 'Lun-Dim: 06:00-23:00',
    heureOuverture: '06:00',
    heureFermeture: '23:00',
    openSunday: true,
    statut: 'actif'
  },
  {
    id: '2',
    nom: 'Prima Cinema',
    description: 'Cinéma multiplexe',
    type: 'divertissement',
    level: 'tous publics',
    image: '/images/sections/loisirs-hero.jpg',
    horaires: 'Lun-Dim: 10:00-00:00',
    heureOuverture: '10:00',
    heureFermeture: '00:00',
    openSunday: true,
    statut: 'actif'
  }
];

export const useAdminStore = create<AdminStore>((set, get) => ({
  boutiques: loadFromLocalStorage('boutiques') || initialBoutiques,
  evenements: loadFromLocalStorage('evenements'),
  restaurants: loadFromLocalStorage('restaurants') || initialRestaurants,
  fitness: loadFromLocalStorage('fitness'),
  loisirs: loadFromLocalStorage('loisirs') || initialLoisirs,
  loading: false,
  error: null,

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),

  fetchBoutiques: async () => {
    try {
      set({ loading: true, error: null });
      const boutiques = loadFromLocalStorage('boutiques');
      set({ boutiques });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Une erreur est survenue' });
      console.error('Erreur lors du chargement des boutiques:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchRestaurants: async () => {
    try {
      set({ loading: true, error: null });
      const restaurants = loadFromLocalStorage('restaurants') || initialRestaurants;
      set({ restaurants });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Une erreur est survenue' });
      console.error('Erreur lors du chargement des restaurants:', error);
    } finally {
      set({ loading: false });
    }
  },

  setBoutiques: (boutiques) => {
    set({ boutiques });
    saveToLocalStorage('boutiques', boutiques);
  },

  setEvenements: (evenements) => {
    set({ evenements });
    saveToLocalStorage('evenements', evenements);
  },

  setRestaurants: (restaurants) => {
    set({ restaurants });
    saveToLocalStorage('restaurants', restaurants);
  },

  setFitness: (fitness) => {
    set({ fitness });
    saveToLocalStorage('fitness', fitness);
  },

  setLoisirs: (loisirs) => {
    set({ loisirs });
    saveToLocalStorage('loisirs', loisirs);
  },

  addBoutique: (boutique) => {
    set((state) => {
      const newBoutiques = [...state.boutiques, boutique];
      saveToLocalStorage('boutiques', newBoutiques);
      return { boutiques: newBoutiques };
    });
  },

  addEvenement: (evenement) => {
    set((state) => {
      const newEvenements = [...state.evenements, evenement];
      saveToLocalStorage('evenements', newEvenements);
      return { evenements: newEvenements };
    });
  },

  addRestaurant: (restaurant) => {
    set((state) => {
      const newRestaurants = [...state.restaurants, restaurant];
      saveToLocalStorage('restaurants', newRestaurants);
      return { restaurants: newRestaurants };
    });
  },

  addFitness: (fitness) => {
    set((state) => {
      const newFitness = [...state.fitness, fitness];
      saveToLocalStorage('fitness', newFitness);
      return { fitness: newFitness };
    });
  },

  addLoisir: (loisir) => {
    set((state) => {
      const newLoisirs = [...state.loisirs, loisir];
      saveToLocalStorage('loisirs', newLoisirs);
      return { loisirs: newLoisirs };
    });
  },

  updateBoutique: (id, boutique) => {
    set((state) => {
      const newBoutiques = state.boutiques.map((b) =>
        b.id === id ? { ...b, ...boutique } : b
      );
      saveToLocalStorage('boutiques', newBoutiques);
      return { boutiques: newBoutiques };
    });
  },

  updateEvenement: (id, evenement) => {
    set((state) => {
      const newEvenements = state.evenements.map((e) =>
        e.id === id ? { ...e, ...evenement } : e
      );
      saveToLocalStorage('evenements', newEvenements);
      return { evenements: newEvenements };
    });
  },

  updateRestaurant: (id, restaurant) => {
    set((state) => {
      const newRestaurants = state.restaurants.map((r) =>
        r.id === id ? { ...r, ...restaurant } : r
      );
      saveToLocalStorage('restaurants', newRestaurants);
      return { restaurants: newRestaurants };
    });
  },

  updateFitness: (id, fitness) => {
    set((state) => {
      const newFitness = state.fitness.map((f) =>
        f.id === id ? { ...f, ...fitness } : f
      );
      saveToLocalStorage('fitness', newFitness);
      return { fitness: newFitness };
    });
  },

  updateLoisir: (id, loisir) => {
    set((state) => {
      const newLoisirs = state.loisirs.map((l) =>
        l.id === id ? { ...l, ...loisir } : l
      );
      saveToLocalStorage('loisirs', newLoisirs);
      return { loisirs: newLoisirs };
    });
  },

  deleteBoutique: (id) => {
    set((state) => {
      const newBoutiques = state.boutiques.filter((b) => b.id !== id);
      saveToLocalStorage('boutiques', newBoutiques);
      return { boutiques: newBoutiques };
    });
  },

  deleteEvenement: (id) => {
    set((state) => {
      const newEvenements = state.evenements.filter((e) => e.id !== id);
      saveToLocalStorage('evenements', newEvenements);
      return { evenements: newEvenements };
    });
  },

  deleteRestaurant: (id) => {
    set((state) => {
      const newRestaurants = state.restaurants.filter((r) => r.id !== id);
      saveToLocalStorage('restaurants', newRestaurants);
      return { restaurants: newRestaurants };
    });
  },

  deleteFitness: (id) => {
    set((state) => {
      const newFitness = state.fitness.filter((f) => f.id !== id);
      saveToLocalStorage('fitness', newFitness);
      return { fitness: newFitness };
    });
  },

  deleteLoisir: (id) => {
    set((state) => {
      const newLoisirs = state.loisirs.filter((l) => l.id !== id);
      saveToLocalStorage('loisirs', newLoisirs);
      return { loisirs: newLoisirs };
    });
  },
})); 