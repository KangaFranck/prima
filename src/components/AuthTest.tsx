import React, { useState } from 'react';
import { useAuthStore } from '../store/pbAuthStore';

const AuthTest = () => {
  const { login, logout, user, isAuthenticated, loading, error } = useAuthStore();
  const [email, setEmail] = useState('communicationprimacenter@gmail.com');
  const [password, setPassword] = useState('Prima@center2025');

  const handleLogin = async () => {
    await login(email, password);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Test d'authentification PocketBase</h2>
      
      <div className="mb-4">
        <p className="text-gray-600">
          Status: {isAuthenticated ? ' Connecté' : ' Non connecté'}
        </p>
        {user && (
          <p className="text-gray-600">
            Utilisateur: {user.email} (ID: {user.id})
          </p>
        )}
        {loading && <p className="text-blue-600">Chargement...</p>}
        {error && <p className="text-red-600">Erreur: {error}</p>}
      </div>

      {!isAuthenticated ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Se déconnecter
        </button>
      )}
    </div>
  );
};

export default AuthTest;
