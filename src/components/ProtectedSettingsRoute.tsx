import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/pbAuthStore';

interface ProtectedSettingsRouteProps {
  children: React.ReactNode;
}

export const ProtectedSettingsRoute: React.FC<ProtectedSettingsRouteProps> = ({ children }) => {  
  const { canAccessSettings, user } = useAuthStore();

  console.log(' Vérification accès paramètres:', {
    user: user?.email,
    canAccess: canAccessSettings()
  });

  if (!canAccessSettings()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Accès refusé</h1>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à cette section.
            <br />
            <span className="text-sm text-gray-500 mt-2 block">
              Seul l'administrateur principal peut gérer les paramètres.
            </span>
            <span className="text-xs text-gray-400 mt-1 block">
              Email actuel: {user?.email || 'Non connecté'}
            </span>
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
