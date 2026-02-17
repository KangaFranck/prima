import { pb } from './pbClient';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'user';
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
}

export const userManagementService = {
  // Vérifier l'identité de l'administrateur principal
  async verifyMainAdmin(): Promise<boolean> {
    try {
      const currentUser = pb.authStore.model;
      
      if (!currentUser) {
        console.log(' Aucun utilisateur connecté');
        return false;
      }
      
      // Vérification stricte de l'email
      const isMainAdmin = currentUser.email === 'communicationprimacenter@gmail.com';
      
      console.log('=== VÉRIFICATION IDENTITÉ ADMIN PRINCIPAL ===');
      console.log('Email utilisateur:', currentUser.email);
      console.log('Email autorisé:', 'communicationprimacenter@gmail.com');
      console.log('Correspondance:', isMainAdmin);
      console.log('=== FIN VÉRIFICATION ===');
      
      return isMainAdmin;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'identité:', error);
      return false;
    }
  },

  // Récupérer tous les utilisateurs (seulement pour super_admin)
  async getAllUsers(): Promise<User[]> {
    try {
      console.log('=== RÉCUPÉRATION DE TOUS LES UTILISATEURS ===');
      
      // Vérifier l'identité de l'administrateur principal
      const isAuthorized = await this.verifyMainAdmin();
      if (!isAuthorized) {
        throw new Error('Accès refusé. Seuls les super administrateurs peuvent gérer les utilisateurs.');
      }
      
      const users = await pb.collection('users').getFullList();
      return users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name || '',
        role: user.role || 'user',
        permissions: user.permissions || [],
        isActive: user.isActive !== false,
        createdAt: user.created,
        updatedAt: user.updated
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  },

  // Créer un nouvel utilisateur
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      console.log('=== CRÉATION D\'UN NOUVEAU UTILISATEUR ===');
      console.log('Données utilisateur:', userData);
      
      // Vérifier l'identité de l'administrateur principal
      const isAuthorized = await this.verifyMainAdmin();
      if (!isAuthorized) {
        throw new Error('Accès refusé. Seuls les super administrateurs peuvent créer des utilisateurs.');
      }
      
      // Définir les permissions selon le rôle
      let permissions: string[] = [];
      if (userData.role === 'admin') {
        permissions = ['boutiques', 'restaurants', 'loisirs', 'evenements', 'dashboard'];
      } else {
        permissions = ['dashboard'];
      }
      
      const newUser = await pb.collection('users').create({
        email: userData.email,
        password: userData.password,
        passwordConfirm: userData.password,
        name: userData.name,
        role: userData.role,
        permissions: permissions,
        isActive: true
      });
      
      console.log(' Utilisateur créé avec succès:', newUser);
      return {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        permissions: newUser.permissions,
        isActive: newUser.isActive,
        createdAt: newUser.created,
        updatedAt: newUser.updated
      };
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  },

  // Supprimer un utilisateur
  async deleteUser(userId: string): Promise<void> {
    try {
      console.log('=== SUPPRESSION D\'UN UTILISATEUR ===');
      console.log('ID utilisateur:', userId);
      
      // Vérifier l'identité de l'administrateur principal
      const isAuthorized = await this.verifyMainAdmin();
      if (!isAuthorized) {
        throw new Error('Accès refusé. Seuls les super administrateurs peuvent supprimer des utilisateurs.');
      }
      
      // Empêcher la suppression de soi-même
      const currentUser = pb.authStore.model;
      if (currentUser && currentUser.id === userId) {
        throw new Error('Vous ne pouvez pas supprimer votre propre compte.');
      }
      
      await pb.collection('users').delete(userId);
      console.log(' Utilisateur supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  },

  // Activer/Désactiver un utilisateur
  async toggleUserStatus(userId: string, isActive: boolean): Promise<User> {
    try {
      console.log('=== CHANGEMENT DE STATUT UTILISATEUR ===');
      console.log('ID utilisateur:', userId, 'Statut:', isActive);
      
      // Vérifier l'identité de l'administrateur principal
      const isAuthorized = await this.verifyMainAdmin();
      if (!isAuthorized) {
        throw new Error('Accès refusé. Seuls les super administrateurs peuvent modifier le statut des utilisateurs.');
      }
      
      const updatedUser = await pb.collection('users').update(userId, {
        isActive: isActive
      });
      
      console.log(' Statut utilisateur mis à jour:', updatedUser);
      return {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        permissions: updatedUser.permissions,
        isActive: updatedUser.isActive,
        createdAt: updatedUser.created,
        updatedAt: updatedUser.updated
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  },

  // Vérifier les permissions de l'utilisateur actuel
  hasPermission(permission: string): boolean {
    const currentUser = pb.authStore.model;
    if (!currentUser) return false;
    
    // Super admin a tous les droits
    if (currentUser.email === 'communicationprimacenter@gmail.com') return true;
    
    // Vérifier les permissions spécifiques
    return currentUser.permissions && currentUser.permissions.includes(permission);
  },

  // Vérifier si l'utilisateur peut accéder aux paramètres
  canAccessSettings(): boolean {
    const currentUser = pb.authStore.model;
    if (!currentUser) return false;
    
    // Seuls les super admins peuvent accéder aux paramètres
    return currentUser.email === 'communicationprimacenter@gmail.com';
  }
};
