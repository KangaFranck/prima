import PocketBase from 'pocketbase';

const PB_URL = import.meta.env.VITE_PB_URL || 'https://primacenter.fly.dev';
const pb = new PocketBase(PB_URL);

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
      console.log('🔐 Tentative de connexion avec:', email);
      console.log('🌐 URL PocketBase:', PB_URL);
      
      // ÉTAPE 0: Vérifier la connectivité
      await this.checkConnectivity();
      
      // ÉTAPE 1: Créer l'admin principal s'il n'existe pas
      await this.ensureAdminExists();
      
      // ÉTAPE 2: Authentification directe avec PocketBase
      console.log('🔐 Tentative d\'authentification...');
      
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
        } else {
          throw new Error(`Erreur d'authentification: ${response.status} - ${errorData.message || 'Erreur inconnue'}`);
        }
      }
      
      const authData = await response.json();
      console.log('✅ Connexion réussie!');
      
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

  // Vérifier la connectivité avec le serveur
  async checkConnectivity(): Promise<void> {
    try {
      console.log('🌐 Vérification de la connectivité...');
      
      const response = await fetch(`${PB_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        console.log('✅ Serveur accessible');
      } else {
        console.log('⚠️ Serveur accessible mais avec des erreurs:', response.status);
      }
    } catch (error) {
      console.error('❌ Impossible de joindre le serveur:', error);
      throw new Error('Impossible de joindre le serveur PocketBase. Vérifiez votre connexion internet.');
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
        const adminExists = admins.items?.some((admin: any) => admin.email === 'communicationprimacenter@gmail.com');
        
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

  async logout(): Promise<void> {
    try {
      pb.authStore.clear();
      localStorage.removeItem('pb_token');
      localStorage.removeItem('pb_user');
      localStorage.removeItem('user_permissions');
      localStorage.removeItem('user_role');
      console.log('✅ Déconnexion réussie');
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      throw error;
    }
  },

  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem('pb_user');
      if (!userData) return null;
      
      const user = JSON.parse(userData);
      const permissions = JSON.parse(localStorage.getItem('user_permissions') || '[]');
      const role = localStorage.getItem('user_role') || 'user';
      
      return {
        ...user,
        role,
        permissions
      };
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('pb_token');
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
