import { create } from "zustand";
import { adminService } from "../services/pbAdminService";
import { apiAdminService } from "../services/apiAdminService";

// Quand VITE_API_URL est défini (ex: backend sur Render), utiliser l'API Express au lieu de PocketBase pour les boutiques
const USE_EXPRESS_API = !!(import.meta.env.VITE_API_URL?.trim());

interface Boutique {
  id: string;
  nom: string;
  description: string;
  logo?: string;
  image?: string;
  heureOuverture: string;
  heureFermeture: string;
  openSunday: boolean;
  statut: "actif" | "inactif";
  universe: string;
  telephone?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Restaurant {
  id: string;
  nom: string;
  description: string;
  logo?: string;
  heureOuverture: string;
  heureFermeture: string;
  openSunday: boolean;
  statut: "actif" | "inactif";
  universe: string;
  telephone?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  createdAt: string;
  updatedAt: string;
}

interface Loisir {
  id: string;
  nom: string;
  description: string;
  logo?: string;
  heureOuverture: string;
  heureFermeture: string;
  openSunday: boolean;
  statut: "actif" | "inactif";
  universe: string;
  telephone?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  createdAt: string;
  updatedAt: string;
}

interface Evenement {
  id: string;
  titre: string;
  description: string;
  date: string;
  lieu: string;
  heure: string;
  affiche?: string;
  statut: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminStore {
  boutiques: Boutique[];
  restaurants: Restaurant[];
  loisirs: Loisir[];
  evenements: Evenement[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchBoutiques: () => Promise<void>;
  fetchRestaurants: () => Promise<void>;
  fetchLoisirs: () => Promise<void>;
  fetchEvenements: () => Promise<void>;
  
  createBoutique: (data: any) => Promise<void>;
  updateBoutique: (id: string, data: any) => Promise<void>;
  deleteBoutique: (id: string) => Promise<void>;
  
  createRestaurant: (data: any) => Promise<void>;
  updateRestaurant: (id: string, data: any) => Promise<void>;
  deleteRestaurant: (id: string) => Promise<void>;
  
  createLoisir: (data: any) => Promise<void>;
  updateLoisir: (id: string, data: any) => Promise<void>;
  deleteLoisir: (id: string) => Promise<void>;
  
  createEvenement: (data: any) => Promise<void>;
  updateEvenement: (id: string, data: any) => Promise<void>;
  deleteEvenement: (id: string) => Promise<void>;
}

export const usePbAdminStore = create<AdminStore>((set, get) => ({
  boutiques: [],
  restaurants: [],
  loisirs: [],
  evenements: [],
  loading: false,
  error: null,

  fetchBoutiques: async () => {
    const state = get();
    if (state.loading) return;
    
    set({ loading: true, error: null });
    try {
      const boutiques = USE_EXPRESS_API ? await apiAdminService.getBoutiques() : await adminService.getBoutiques();
      set({ boutiques, loading: false });
    } catch (error) {
      console.error('Erreur lors de la récupération des boutiques:', error);
      const msg = USE_EXPRESS_API
        ? 'API injoignable ou erreur réseau. Réessayez dans 1 minute. Si le problème persiste, vérifiez que le service API est bien actif sur Render.'
        : 'Erreur lors de la récupération des boutiques';
      set({ error: msg, loading: false });
    }
  },

  fetchRestaurants: async () => {
    const state = get();
    if (state.loading) return;
    
    set({ loading: true, error: null });
    try {
      const restaurants = USE_EXPRESS_API ? await apiAdminService.getRestaurants() : await adminService.getRestaurants();
      set({ restaurants, loading: false });
    } catch (error) {
      console.error('Erreur lors de la récupération des restaurants:', error);
      const msg = USE_EXPRESS_API
        ? 'API injoignable ou erreur réseau. Réessayez dans 1 minute. Si le problème persiste, vérifiez que le service API est bien actif sur Render.'
        : 'Erreur lors de la récupération des restaurants';
      set({ error: msg, loading: false });
    }
  },

  fetchLoisirs: async () => {
    const state = get();
    if (state.loading) return;
    
    set({ loading: true, error: null });
    try {
      const loisirs = USE_EXPRESS_API ? await apiAdminService.getLoisirs() : await adminService.getLoisirs();
      set({ loisirs, loading: false });
    } catch (error) {
      console.error('Erreur lors de la récupération des loisirs:', error);
      const msg = USE_EXPRESS_API
        ? 'API injoignable ou erreur réseau. Réessayez dans 1 minute. Si le problème persiste, vérifiez que le service API est bien actif sur Render.'
        : 'Erreur lors de la récupération des loisirs';
      set({ error: msg, loading: false });
    }
  },

  fetchEvenements: async () => {
    const state = get();
    if (state.loading) return;
    
    set({ loading: true, error: null });
    try {
      const evenements = await adminService.getEvenements();
      set({ evenements, loading: false });
    } catch (error) {
      console.error('Erreur lors de la récupération des evenements:', error);
      set({ error: 'Erreur lors de la récupération des evenements', loading: false });
    }
  },

  // CRUD Actions
  createBoutique: async (data) => {
    try {
      const boutique = USE_EXPRESS_API ? await apiAdminService.createBoutique(data) : await adminService.createBoutique(data);
      console.log('✅ Boutique créée dans le service, ajout au store...');
      
      set(state => ({ 
        boutiques: [...state.boutiques, boutique],
        error: null 
      }));
      
      console.log('✅ Boutique ajoutée au store avec succès');
    } catch (error: any) {
      console.error('❌ Erreur dans le store lors de la création de la boutique:', error);
      
      // Message d'erreur plus clair pour l'utilisateur
      let errorMessage = 'Erreur lors de la création de la boutique';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.data && error.data.message) {
        errorMessage = error.data.message;
      } else if (error.status === 400) {
        errorMessage = 'Données invalides. Vérifiez que tous les champs obligatoires sont remplis.';
      } else if (error.status === 401) {
        errorMessage = 'Vous n\'êtes pas autorisé à effectuer cette action.';
      } else if (error.status === 403) {
        errorMessage = 'Accès refusé. Vérifiez vos permissions.';
      }
      
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  updateBoutique: async (id, data) => {
    try {
      const boutique = USE_EXPRESS_API ? await apiAdminService.updateBoutique(id, data) : await adminService.updateBoutique(id, data);
      set(state => ({
        boutiques: state.boutiques.map(b => b.id === id ? boutique : b)
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la boutique:', error);
      throw error;
    }
  },

  deleteBoutique: async (id) => {
    try {
      await (USE_EXPRESS_API ? apiAdminService.deleteBoutique(id) : adminService.deleteBoutique(id));
      set(state => ({
        boutiques: state.boutiques.filter(b => b.id !== id)
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression de la boutique:', error);
      throw error;
    }
  },

  createRestaurant: async (data) => {
    try {
      const restaurant = USE_EXPRESS_API ? await apiAdminService.createRestaurant(data) : await adminService.createRestaurant(data);
      set(state => ({ restaurants: [...state.restaurants, restaurant] }));
    } catch (error) {
      console.error('Erreur lors de la création du restaurant:', error);
      throw error;
    }
  },

  updateRestaurant: async (id, data) => {
    try {
      const restaurant = USE_EXPRESS_API ? await apiAdminService.updateRestaurant(id, data) : await adminService.updateRestaurant(id, data);
      set(state => ({
        restaurants: state.restaurants.map(r => r.id === id ? restaurant : r)
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du restaurant:', error);
      throw error;
    }
  },

  deleteRestaurant: async (id) => {
    try {
      await (USE_EXPRESS_API ? apiAdminService.deleteRestaurant(id) : adminService.deleteRestaurant(id));
      set(state => ({
        restaurants: state.restaurants.filter(r => r.id !== id)
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression du restaurant:', error);
      throw error;
    }
  },

  createLoisir: async (data) => {
    try {
      const loisir = USE_EXPRESS_API ? await apiAdminService.createLoisir(data) : await adminService.createLoisir(data);
      set(state => ({ loisirs: [...state.loisirs, loisir] }));
    } catch (error) {
      console.error('Erreur lors de la création du loisir:', error);
      throw error;
    }
  },

  updateLoisir: async (id, data) => {
    try {
      const loisir = USE_EXPRESS_API ? await apiAdminService.updateLoisir(id, data) : await adminService.updateLoisir(id, data);
      set(state => ({
        loisirs: state.loisirs.map(l => l.id === id ? loisir : l)
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du loisir:', error);
      throw error;
    }
  },

  deleteLoisir: async (id) => {
    try {
      await (USE_EXPRESS_API ? apiAdminService.deleteLoisir(id) : adminService.deleteLoisir(id));
      set(state => ({
        loisirs: state.loisirs.filter(l => l.id !== id)
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression du loisir:', error);
      throw error;
    }
  },

  createEvenement: async (data) => {
    try {
      const evenement = await adminService.createEvenement(data);
      set(state => ({ evenements: [...state.evenements, evenement] }));
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      throw error;
    }
  },

  updateEvenement: async (id, data) => {
    try {
      const evenement = await adminService.updateEvenement(id, data);
      set(state => ({
        evenements: state.evenements.map(e => e.id === id ? evenement : e)
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'événement:', error);
      throw error;
    }
  },

  deleteEvenement: async (id) => {
    try {
      await adminService.deleteEvenement(id);
      set(state => ({
        evenements: state.evenements.filter(e => e.id !== id)
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
      throw error;
    }
  }
}));
