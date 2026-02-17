import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  role: 'admin';
}

interface Credentials {
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  credentials: Credentials;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setError: (error: string | null) => void;
  updateCredentials: (newEmail?: string, newPassword?: string) => void;
}

const defaultCredentials: Credentials = {
  email: 'admin@primacenter.fr',
  password: 'admin123'
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      credentials: defaultCredentials,

      login: async (email: string, password: string) => {
        try {
          set({ loading: true, error: null });
          const { credentials } = get();
          
          if (email === credentials.email && password === credentials.password) {
            const user = {
              id: '1',
              email,
              role: 'admin' as const
            };
            set({ 
              user, 
              token: 'fake-jwt-token', 
              isAuthenticated: true,
              loading: false 
            });
          } else {
            throw new Error('Email ou mot de passe incorrect');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Une erreur est survenue',
            loading: false
          });
        }
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          error: null 
        });
      },

      setError: (error: string | null) => set({ error }),

      updateCredentials: (newEmail?: string, newPassword?: string) => {
        const { credentials } = get();
        set({
          credentials: {
            email: newEmail || credentials.email,
            password: newPassword || credentials.password
          }
        });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        credentials: state.credentials
      })
    }
  )
); 