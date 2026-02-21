import PocketBase from 'pocketbase';
import { apiClient, useApi } from './apiClient';

/** URL PocketBase : en local par défaut. Définir VITE_PB_URL dans .env si besoin. */
const PB_URL = import.meta.env.VITE_PB_URL || 'http://127.0.0.1:8090';
const pb = new PocketBase(PB_URL);

/** Stockage auth admin : sessionStorage = session uniquement, pas de cache du mot de passe entre les onglets/sessions. */
const authStorage = sessionStorage;

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  permissions?: string[];
  isActive?: boolean;
  created: string;
  updated: string;
}

export interface AuthResponse {
  token: string;
  record: User;
}

export const pbAuthService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      if (useApi()) {
        if (import.meta.env.DEV) console.log('🔐 Connexion API', email);
        const authData = await apiClient.auth.login(email, password);
        const userRecord: User = {
          ...authData.record,
          role: authData.record.role || 'super_admin',
          permissions: authData.record.permissions ?? ['dashboard', 'boutiques', 'restaurants', 'loisirs', 'evenements', 'settings', 'users'],
          isActive: true,
          created: '',
          updated: '',
        };
        authStorage.setItem('pb_token', authData.token);
        authStorage.setItem('pb_user', JSON.stringify(userRecord));
        authStorage.setItem('user_permissions', JSON.stringify(userRecord.permissions));
        authStorage.setItem('user_role', userRecord.role || '');
        return { token: authData.token, record: userRecord };
      }

      if (import.meta.env.DEV) console.log('🔐 Connexion', email, '→', PB_URL);
      await this.checkConnectivity();

      const response = await fetch(`${PB_URL}/api/admins/auth-with-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identity: email,
          password: password
        })
      });
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: 'Erreur de communication avec le serveur' };
        }
        
        console.error('❌ Erreur d\'authentification:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });
        
        if (response.status === 400) {
          throw new Error('Identifiants incorrects. Vérifiez votre email et mot de passe.');
        } else if (response.status === 401) {
          throw new Error('Non autorisé. Vérifiez vos identifiants.');
        } else if (response.status === 500) {
          throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
        } else if (response.status === 404) {
          throw new Error(
            'PocketBase n’est pas disponible (404). Le port 8090 est peut-être utilisé par un autre programme. Installez le binaire PocketBase dans pocketbase/ (voir pocketbase/README.md), puis lancez npm run pb:serve. Ensuite créez un admin sur http://127.0.0.1:8090/_/'
          );
        } else {
          throw new Error(`Erreur d'authentification: ${response.status} - ${errorData.message || 'Erreur inconnue'}`);
        }
      }
      
      const authData = await response.json();
      if (import.meta.env.DEV) console.log('✅ Connexion réussie');
      
      // Créer l'objet utilisateur avec les permissions
      const userRecord = {
        ...authData.record,
        role: 'super_admin',
        permissions: ['dashboard', 'boutiques', 'restaurants', 'loisirs', 'evenements', 'settings', 'users'],
        isActive: true
      };
      
      // Sauvegarder les données d'authentification
      localStorage.setItem('pb_token', authData.token);
      localStorage.setItem('pb_user', JSON.stringify(userRecord));
      localStorage.setItem('user_permissions', JSON.stringify(userRecord.permissions));
      localStorage.setItem('user_role', userRecord.role);
      
      pb.authStore.save(authData.token, userRecord);
      
      return {
        token: authData.token,
        record: userRecord
      };
      
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      throw error;
    }
  },

  // Vérifier que PocketBase est démarré et répond (évite 404 sur /api/admins)
  async checkConnectivity(): Promise<void> {
    try {
      const response = await fetch(`${PB_URL}/api/health`, { method: 'GET' });
      if (response.ok) return;
      if (response.status === 404) {
        throw new Error(
          'Le port 8090 n’est pas PocketBase (404). Arrêtez tout autre logiciel sur ce port, puis lancez le serveur PocketBase : 1) Téléchargez le binaire depuis https://github.com/pocketbase/pocketbase/releases (pocketbase_*_windows_amd64.zip), 2) Extrayez pocketbase.exe dans le dossier pocketbase/ du projet, 3) Exécutez npm run pb:serve dans un terminal.'
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error && (err.message?.includes('8090') || err.message?.includes('PocketBase'))) throw err;
      console.error('❌ PocketBase injoignable:', err);
      throw new Error(
        'PocketBase ne semble pas démarré. Installez le binaire (voir dossier pocketbase/README.md) puis lancez : npm run pb:serve dans un autre terminal.'
      );
    }
  },

  // Créer l'admin principal s'il n'existe pas
  async ensureAdminExists(): Promise<void> {
    try {
      console.log('🔐 Vérification de l\'admin principal...');
      
      // Vérifier si l'admin principal existe
      const adminResponse = await fetch(`${PB_URL}/api/admins`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (adminResponse.ok) {
        const admins = await adminResponse.json();
        const adminExists = admins.items?.some((admin: { email?: string }) => admin.email === 'communicationprimacenter@gmail.com');
        
        if (!adminExists) {
          console.log('🔐 Création de l\'admin principal...');
          
          // Créer l'admin principal avec le bon mot de passe
          const createResponse = await fetch(`${PB_URL}/api/admins`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: 'communicationprimacenter@gmail.com',
              password: 'Pr!ma@center#2025', // Mot de passe correct
              passwordConfirm: 'Pr!ma@center#2025',
              name: 'Administrateur Principal'
            })
          });
          
          if (createResponse.ok) {
            console.log('✅ Admin principal créé avec succès');
          } else {
            const errorData = await createResponse.json();
            console.log('⚠️ Admin principal existe peut-être déjà:', errorData);
          }
        } else {
          console.log('✅ Admin principal existe déjà');
        }
      } else {
        console.log('⚠️ Impossible de vérifier les admins existants');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'admin:', error);
      // Ne pas bloquer la connexion si la création échoue
    }
  },

  /** Vérifie le mot de passe de l'admin (API Admins, pas la collection users). */
  async verifyAdminPassword(email: string, password: string): Promise<boolean> {
    const response = await fetch(`${PB_URL}/api/admins/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: email, password }),
    });
    return response.ok;
  },

  async logout(): Promise<void> {
    try {
      pb.authStore.clear();
      for (const key of ['pb_token', 'pb_user', 'user_permissions', 'user_role']) {
        sessionStorage.removeItem(key);
        localStorage.removeItem(key);
      }
      console.log('✅ Déconnexion réussie');
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      throw error;
    }
  },

  getCurrentUser(): User | null {
    try {
      const userData = authStorage.getItem('pb_user');
      if (!userData || userData === 'undefined' || userData === 'null') return null;
      const user = JSON.parse(userData);
      if (!user || typeof user !== 'object') return null;
      const permsRaw = authStorage.getItem('user_permissions');
      const permissions = (permsRaw && permsRaw !== 'undefined' ? JSON.parse(permsRaw) : []) as string[];
      const role = authStorage.getItem('user_role') || user.role || 'user';
      return {
        ...user,
        role,
        permissions: Array.isArray(permissions) ? permissions : []
      };
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    const token = authStorage.getItem('pb_token');
    const user = this.getCurrentUser();
    
    if (!token || !user) {
      return false;
    }
    
    // Vérifier que l'utilisateur est toujours actif
    return user.isActive !== false;
  },

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.permissions) return false;
    
    return user.permissions.includes(permission);
  },

  canAccessSettings(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Seul communicationprimacenter@gmail.com peut accéder aux paramètres
    return user.email === 'communicationprimacenter@gmail.com';
  }
};
