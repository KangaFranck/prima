import { create } from 'zustand';
import { Boutique, Restaurant } from '../types/admin';
import { ActusEvent } from '../data/actus-events';

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

// Données simulées pour les restaurants
const restaurantsData = [
  {
    id: '1',
    nom: 'Le Food Hall',
    cuisine: 'Internationale',
    horaires: 'Lun-Dim: 11h30-22h00',
    statut: 'actif',
  },
  {
    id: '2',
    nom: 'Café Gourmand',
    cuisine: 'Française',
    horaires: 'Lun-Dim: 8h00-20h00',
    statut: 'actif',
  },
  {
    id: '3',
    nom: 'Le Lounge',
    cuisine: 'Internationale',
    horaires: 'Lun-Dim: 17h00-02h00',
    statut: 'actif',
  },
];

interface PublicStore {
  boutiques: Boutique[];
  restaurants: Restaurant[];
  loisirs: any[];
  actusEvents: ActusEvent[];
  loading: boolean;
  error: string | null;
  fetchBoutiques: () => Promise<void>;
  fetchRestaurants: () => Promise<void>;
  fetchLoisirs: () => Promise<void>;
  fetchActusEvents: () => Promise<void>;
  updateRestaurant: (updatedRestaurant: any) => void;
  deleteRestaurant: (id: string) => void;
  addRestaurant: (newRestaurant: any) => void;
}

export const usePublicStore = create<PublicStore>((set, get) => ({
  boutiques: [],
  restaurants: [],
  loisirs: [],
  actusEvents: [],
  loading: false,
  error: null,

  fetchBoutiques: async () => {
    set({ loading: true, error: null });
    try {
      const storedBoutiques = localStorage.getItem('boutiques');
      const boutiques = storedBoutiques ? JSON.parse(storedBoutiques) : [];
      set({ boutiques, loading: false });
    } catch (error) {
      console.error('Erreur lors du chargement des boutiques:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Une erreur est survenue', 
        loading: false 
      });
    }
  },

  fetchRestaurants: async () => {
    set({ loading: true, error: null });
    try {
      const storedRestaurants = localStorage.getItem('restaurants');
      const restaurants = storedRestaurants ? JSON.parse(storedRestaurants) : [];
      const activeRestaurants = restaurants.filter((r: Restaurant) => r.statut === 'actif');
      set({ restaurants: activeRestaurants, loading: false });
    } catch (error) {
      console.error('Erreur lors du chargement des restaurants:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Une erreur est survenue', 
        loading: false 
      });
    }
  },

  fetchLoisirs: async () => {
    set({ loading: true, error: null });
    try {
      const storedLoisirs = localStorage.getItem('loisirs');
      const loisirs = storedLoisirs ? JSON.parse(storedLoisirs) : [];
      const activeLoisirs = loisirs.filter((l: any) => l.statut === 'actif');
      set({ loisirs: activeLoisirs, loading: false });
    } catch (error) {
      console.error('Erreur lors du chargement des loisirs:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Une erreur est survenue', 
        loading: false 
      });
    }
  },

  fetchActusEvents: async () => {
    try {
      set({ loading: true, error: null });
      const storedEvents = localStorage.getItem('actusEvents');
      if (storedEvents) {
        const events = JSON.parse(storedEvents);
        set({ actusEvents: events.filter((event: ActusEvent) => event.statut === 'actif') });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Une erreur est survenue' });
    } finally {
      set({ loading: false });
    }
  },

  updateRestaurant: (updatedRestaurant) => {
    const restaurants = loadFromLocalStorage('restaurants') || [];
    const updatedRestaurants = restaurants.map(r => 
      r.id === updatedRestaurant.id ? updatedRestaurant : r
    );
    saveToLocalStorage('restaurants', updatedRestaurants);
    const activeRestaurants = updatedRestaurants.filter(r => r.statut === 'actif');
    set({ restaurants: activeRestaurants });
  },

  deleteRestaurant: (id) => {
    const restaurants = loadFromLocalStorage('restaurants') || [];
    const updatedRestaurants = restaurants.filter(r => r.id !== id);
    saveToLocalStorage('restaurants', updatedRestaurants);
    const activeRestaurants = updatedRestaurants.filter(r => r.statut === 'actif');
    set({ restaurants: activeRestaurants });
  },

  addRestaurant: (newRestaurant) => {
    const restaurants = loadFromLocalStorage('restaurants') || [];
    const updatedRestaurants = [...restaurants, newRestaurant];
    saveToLocalStorage('restaurants', updatedRestaurants);
    const activeRestaurants = updatedRestaurants.filter(r => r.statut === 'actif');
    set({ restaurants: activeRestaurants });
  },
})); 