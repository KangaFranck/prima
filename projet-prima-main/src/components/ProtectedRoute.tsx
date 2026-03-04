import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/pbAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuthStore();

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers la page de login si pas authentifié
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Vérifier que l'utilisateur a les permissions d'administration
  if (!user.permissions || !user.permissions.includes('dashboard')) {
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
            Vous n'avez pas les permissions nécessaires pour accéder à l'interface d'administration.
            <br />
            <span className="text-sm text-gray-500 mt-2 block">
              Contactez l'administrateur pour obtenir l'accès.
            </span>
            <span className="text-xs text-gray-400 mt-1 block">
              Email actuel: {user?.email || 'Non connecté'}
            </span>
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
