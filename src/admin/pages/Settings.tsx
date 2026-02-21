import React, { useState, useEffect } from 'react';
import { User, Save, Eye, EyeOff, Mail, Lock, User as UserIcon, Users, Settings as SettingsIcon } from 'lucide-react';
import { userSyncService, UserUpdateData } from '../../services/userSyncService';
import { pb } from '../../services/pbClient';
import { UserManagement } from './UserManagement';
import { IdentityVerification } from '../../components/IdentityVerification';

export const UserSettings = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'users'>('profile');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur a besoin de vérification d'identité
    const currentUser = pb.authStore.model;
    if (currentUser && currentUser.email === 'communicationprimacenter@gmail.com') {
      setNeedsVerification(true);
    } else {
      loadUserData();
    }
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setMessage(null);
      
      // Vérifier d'abord l'état de connexion
      console.log('État de connexion:', {
        isValid: pb.authStore.isValid,
        token: pb.authStore.token ? 'Présent' : 'Absent',
        model: pb.authStore.model
      });
      
      const user = await userSyncService.getAdminUser();
      if (user) {
        setUserData(user);
        setFormData({
          email: user.email || '',
          name: user.name || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        console.log('Données utilisateur chargées:', user);
      } else {
        setMessage({ type: 'error', text: 'Aucun utilisateur connecté. Veuillez vous reconnecter.' });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des données' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Vérifier l'état de connexion avant de continuer
      if (!pb.authStore.isValid && !sessionStorage.getItem('pb_user')) {
        setMessage({ type: 'error', text: 'Session expirée. Veuillez vous reconnecter.' });
        return;
      }

      // Validation
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
        return;
      }

      if (formData.newPassword && formData.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
        return;
      }

      // Préparer les données de mise à jour
      const updateData: UserUpdateData = {};
      
      if (formData.email !== userData?.email) {
        updateData.email = formData.email;
      }
      
      if (formData.name !== userData?.name) {
        updateData.name = formData.name;
      }
      
      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      // Synchroniser les modifications
      if (Object.keys(updateData).length > 0) {
        await userSyncService.syncAdminUser(updateData);
        setMessage({ type: 'success', text: 'Paramètres mis à jour avec succès' });
        
        // Recharger les données
        await loadUserData();
      } else {
        setMessage({ type: 'error', text: 'Aucune modification détectée' });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour des paramètres' });
    } finally {
      setLoading(false);
    }
  };

  const handleIdentityVerified = () => {
    setNeedsVerification(false);
    loadUserData();
  };

  const handleIdentityCancel = () => {
    // Rediriger vers le dashboard
    window.location.href = '/admin';
  };

  // Si l'utilisateur a besoin de vérification d'identité
  if (needsVerification) {
    return (
      <IdentityVerification 
        onVerified={handleIdentityVerified}
        onCancel={handleIdentityCancel}
      />
    );
  }

  if (loading && !userData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-stone-50 via-amber-50 to-stone-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-amber-100 overflow-hidden mb-4 sm:mb-6 md:mb-8">
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4 sm:p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold">Paramètres du compte</h1>
                <p className="text-amber-100 text-sm sm:text-base">Gérez vos informations et les utilisateurs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-amber-100 overflow-hidden mb-4 sm:mb-6 md:mb-8">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex space-x-4 sm:space-x-8 px-3 sm:px-6 min-w-0">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-5 h-5" />
                  <span>Mon profil</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Gestion des utilisateurs</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'profile' ? (
          <div className="bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden">
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Message */}
              {message && (
                <div className={`p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Adresse email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="admin@primacenter.fr"
                  autoComplete="email"
                />
              </div>

              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Nom complet
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Administrateur Prima Center"
                  autoComplete="name"
                />
              </div>

              {/* Mot de passe actuel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Mot de passe actuel
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent pr-12"
                    placeholder="Mot de passe actuel"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Nouveau mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Nouveau mot de passe (optionnel)"
                  autoComplete="new-password"
                />
              </div>

              {/* Confirmer mot de passe */}
              {formData.newPassword && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Confirmer le nouveau mot de passe"
                    autoComplete="new-password"
                  />
                </div>
              )}

              {/* Boutons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={loadUserData}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? 'Mise à jour...' : 'Sauvegarder'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <UserManagement />
        )}
      </div>
    </div>
  );
};
