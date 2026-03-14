import { create } from 'zustand';
import { apiClient, invalidateDataCache } from '../services/apiClient';

export interface HomeSettings {
  image_boutiques: string;
  image_restaurants: string;
  image_loisirs: string;
  image_services: string;
}

const defaults: HomeSettings = {
  image_boutiques: '/images/BOUTIQUES.png',
  image_restaurants: '/images/RESTAURANTS.png',
  image_loisirs: '/images/LOISIRS.png',
  image_services: '/images/SERVICES.png',
};

interface HomeSettingsStore {
  settings: HomeSettings;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (updates: Partial<HomeSettings>) => Promise<void>;
}

export const useHomeSettingsStore = create<HomeSettingsStore>((set, get) => ({
  settings: { ...defaults },
  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiClient.homeSettings.get();
      set({ settings: { ...defaults, ...data }, loading: false });
    } catch (err) {
      console.error('Erreur chargement home settings:', err);
      set({ settings: { ...defaults }, loading: false });
    }
  },

  updateSettings: async (updates) => {
    set({ loading: true, error: null });
    try {
      const data = await apiClient.homeSettings.update(updates);
      invalidateDataCache('home-settings');
      set({ settings: { ...defaults, ...data }, loading: false });
    } catch (err) {
      console.error('Erreur mise à jour home settings:', err);
      set({ error: 'Erreur lors de la sauvegarde', loading: false });
      throw err;
    }
  },
}));
