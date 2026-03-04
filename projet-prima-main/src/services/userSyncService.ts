import { pb } from './pbClient';

export interface UserUpdateData {
  email?: string;
  password?: string;
  name?: string;
}

export const userSyncService = {
  // Synchroniser les modifications de l'utilisateur admin
  async syncAdminUser(updateData: UserUpdateData) {
    try {
      console.log('=== SYNCHRONISATION UTILISATEUR ADMIN ===');
      console.log('Données à synchroniser:', updateData);
      
      // Vérifier l'état de connexion
      console.log('État de connexion PocketBase:', {
        isValid: pb.authStore.isValid,
        token: pb.authStore.token ? 'Présent' : 'Absent',
        model: pb.authStore.model
      });
      
      // Récupérer l'utilisateur admin actuel depuis le localStorage ou la session
      let currentUser = pb.authStore.model;
      
      if (!currentUser) {
        // Essayer de récupérer depuis le localStorage
        const storedUser = localStorage.getItem('pb_user');
        if (storedUser) {
          currentUser = JSON.parse(storedUser);
          console.log('Utilisateur récupéré depuis localStorage:', currentUser);
        }
      }
      
      if (!currentUser) {
        throw new Error('Aucun utilisateur connecté. Veuillez vous reconnecter.');
      }
      
      console.log('Utilisateur actuel:', currentUser);
      
      // Préparer les données de mise à jour
      const updatePayload: any = {};
      
      if (updateData.email) {
        updatePayload.email = updateData.email;
      }
      
      if (updateData.name) {
        updatePayload.name = updateData.name;
      }
      
      if (updateData.password) {
        updatePayload.password = updateData.password;
        updatePayload.passwordConfirm = updateData.password;
      }
      
      console.log('Payload de mise à jour:', updatePayload);
      
      // Mettre à jour l'utilisateur dans la collection users
      if (Object.keys(updatePayload).length > 0) {
        const updatedUser = await pb.collection('users').update(currentUser.id, updatePayload);
        console.log(' Utilisateur synchronisé avec succès:', updatedUser);
        
        // Mettre à jour le store local
        pb.authStore.save(pb.authStore.token, updatedUser);
        
        // Mettre à jour le localStorage
        localStorage.setItem('pb_user', JSON.stringify(updatedUser));
        
        return updatedUser;
      }
      
      return currentUser;
    } catch (error) {
      console.error(' Erreur lors de la synchronisation:', error);
      throw error;
    }
  },
  
  // Récupérer les informations de l'utilisateur admin
  async getAdminUser() {
    try {
      // Essayer d'abord depuis le store PocketBase
      let currentUser = pb.authStore.model;
      
      if (!currentUser) {
        // Essayer depuis le localStorage
        const storedUser = localStorage.getItem('pb_user');
        if (storedUser) {
          currentUser = JSON.parse(storedUser);
        }
      }
      
      if (!currentUser) {
        console.warn('Aucun utilisateur trouvé dans le store ou localStorage');
        return null;
      }
      
      // Récupérer les informations complètes depuis la collection users
      try {
        const userRecord = await pb.collection('users').getOne(currentUser.id);
        return userRecord;
      } catch (error) {
        console.warn('Impossible de récupérer depuis la collection users, utilisation des données locales:', error);
        return currentUser;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  },
  
  // Vérifier si l'utilisateur existe dans la collection users
  async checkUserExists(email: string) {
    try {
      const users = await pb.collection('users').getList(1, 1, {
        filter: `email = "${email}"`
      });
      
      return users.items.length > 0;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'utilisateur:', error);
      return false;
    }
  },
  
  // Créer un utilisateur admin dans la collection users si nécessaire
  async createAdminUserIfNeeded() {
    try {
      console.log('=== VÉRIFICATION ET CRÉATION UTILISATEUR ADMIN ===');
      
      const adminEmail = 'admin@primacenter.fr';
      const userExists = await this.checkUserExists(adminEmail);
      
      if (!userExists) {
        console.log('Création de l\'utilisateur admin dans la collection users...');
        
        const adminUser = await pb.collection('users').create({
          email: adminEmail,
          password: 'admin123',
          passwordConfirm: 'admin123',
          name: 'Administrateur Prima Center',
          role: 'admin'
        });
        
        console.log(' Utilisateur admin créé:', adminUser);
        return adminUser;
      } else {
        console.log(' Utilisateur admin existe déjà');
        return null;
      }
    } catch (error) {
      console.error(' Erreur lors de la création de l\'utilisateur admin:', error);
      throw error;
    }
  }
};
