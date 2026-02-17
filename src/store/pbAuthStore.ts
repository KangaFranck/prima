import { create } from 'zustand';
import { pbAuthService, User } from '../services/pbAuthService';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, passwordConfirm: string, name?: string) => Promise<void>;
  checkAuth: () => void;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  canAccessSettings: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      console.log(' Tentative de connexion...');
      
      const authData = await pbAuthService.login(email, password);
      set({ 
        user: authData.record, 
        isAuthenticated: true, 
        loading: false 
      });
      
      console.log(' Connexion réussie pour:', email);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
      console.error(' Erreur de connexion:', errorMessage);
      set({ 
        error: errorMessage, 
        loading: false 
      });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await pbAuthService.logout();
      set({ 
        user: null, 
        isAuthenticated: false, 
        loading: false 
      });
      console.log(' Déconnexion réussie');
    } catch (error) {
      set({ 
        error: 'Erreur lors de la déconnexion', 
        loading: false 
      });
    }
  },

  register: async (email, password, passwordConfirm, name) => {
    set({ loading: true, error: null });
    try {
      // L'inscription est désactivée - seuls les admins peuvent créer des comptes
      throw new Error('L\'inscription est désactivée. Contactez l\'administrateur.');
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors de l\'inscription', 
        loading: false 
      });
    }
  },

  checkAuth: () => {
    const user = pbAuthService.getCurrentUser();
    const isAuthenticated = pbAuthService.isAuthenticated();
    
    console.log(' Vérification de l\'authentification:', {
      user: user?.email,
      isAuthenticated,
      permissions: user?.permissions
    });
    
    set({ user, isAuthenticated });
  },

  clearError: () => set({ error: null }),

  hasPermission: (permission: string) => {
    return pbAuthService.hasPermission(permission);
  },

  canAccessSettings: () => {
    return pbAuthService.canAccessSettings();
  }
}));
