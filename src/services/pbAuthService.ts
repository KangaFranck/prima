import { apiClient, type AuthResponse } from './apiClient';

/** Stockage auth admin : sessionStorage = session uniquement. */
const authStorage = sessionStorage;

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  permissions?: string[];
  isActive?: boolean;
  created?: string;
  updated?: string;
}

function persistAuthResponse(authData: AuthResponse): void {
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
}

export const pbAuthService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    if (import.meta.env.DEV) console.log('🔐 Connexion API (Neon)', email);
    const authData = await apiClient.auth.login(email, password);
    persistAuthResponse(authData);
    return {
      token: authData.token,
      record: {
        ...authData.record,
        role: authData.record.role || 'super_admin',
        permissions: authData.record.permissions ?? ['dashboard', 'boutiques', 'restaurants', 'loisirs', 'evenements', 'settings', 'users'],
        isActive: true,
        created: '',
        updated: '',
      },
    };
  },

  /** Vérifie le mot de passe et rafraîchit le JWT en session (même flux que login). */
  async verifyAdminPassword(email: string, password: string): Promise<boolean> {
    try {
      const authData = await apiClient.auth.login(email, password);
      persistAuthResponse(authData);
      return true;
    } catch {
      return false;
    }
  },

  async logout(): Promise<void> {
    for (const key of ['pb_token', 'pb_user', 'user_permissions', 'user_role']) {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
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
        permissions: Array.isArray(permissions) ? permissions : [],
      };
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    const token = authStorage.getItem('pb_token');
    const user = this.getCurrentUser();
    if (!token || !user) return false;
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
    return user.email === 'communicationprimacenter@gmail.com';
  },

  async updateProfile(body: {
    name?: string;
    email?: string;
    password?: string;
    currentPassword?: string;
  }): Promise<AuthResponse> {
    const authData = await apiClient.adminMe.update(body);
    persistAuthResponse(authData);
    return authData;
  },
};
