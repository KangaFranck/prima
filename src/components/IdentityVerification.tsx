import React, { useState } from 'react';
import { Lock, Shield, AlertTriangle } from 'lucide-react';
import { pb } from '../services/pbClient';

interface IdentityVerificationProps {
  onVerified: () => void;
  onCancel: () => void;
}

export const IdentityVerification: React.FC<IdentityVerificationProps> = ({ onVerified, onCancel }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Vérifier l'identité avec le mot de passe
      const currentUser = pb.authStore.model;
      
      if (!currentUser || currentUser.email !== 'communicationprimacenter@gmail.com') {
        setError('Accès refusé. Seul l\'administrateur principal peut accéder aux paramètres.');
        return;
      }

      // Tenter de se reconnecter avec le mot de passe pour vérifier l'identité
      await pb.collection('users').authWithPassword('communicationprimacenter@gmail.com', password);
      
      console.log(' Identité vérifiée avec succès');
      onVerified();
    } catch (error) {
      console.error('Erreur de vérification d\'identité:', error);
      setError('Mot de passe incorrect. Accès refusé.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Vérification d'identité</h1>
          <p className="text-gray-600">
            Pour accéder aux paramètres, veuillez confirmer votre identité en saisissant votre mot de passe.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Mot de passe administrateur
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Saisissez votre mot de passe"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="flex items-center p-3 bg-red-100 text-red-800 rounded-lg">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !password}
              className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Vérification...' : 'Vérifier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
