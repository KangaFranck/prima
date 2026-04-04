import { pbAuthService } from './pbAuthService';

export interface UserUpdateData {
  email?: string;
  password?: string;
  name?: string;
  currentPassword?: string;
}

export const userSyncService = {
  async syncAdminUser(updateData: UserUpdateData) {
    const current = pbAuthService.getCurrentUser();
    if (!current) {
      throw new Error('Aucun utilisateur connecté. Veuillez vous reconnecter.');
    }
    if (updateData.password && !updateData.currentPassword) {
      throw new Error('Le mot de passe actuel est requis pour changer le mot de passe.');
    }
    await pbAuthService.updateProfile({
      name: updateData.name,
      email: updateData.email,
      password: updateData.password,
      currentPassword: updateData.currentPassword,
    });
  },

  async getAdminUser() {
    return pbAuthService.getCurrentUser();
  },
};
