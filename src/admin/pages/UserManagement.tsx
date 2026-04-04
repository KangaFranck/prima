import React from 'react';
import { Users } from 'lucide-react';

/**
 * La table Neon `users` (comptes staff) existe dans le schéma, mais aucune route API
 * n’expose encore la liste / création / suppression. Gérer ces comptes via SQL ou script.
 */
export const UserManagement = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-8 text-center text-gray-600 max-w-2xl mx-auto">
      <Users className="w-12 h-12 mx-auto text-amber-600 mb-4 opacity-80" />
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Gestion des utilisateurs</h2>
      <p className="text-sm leading-relaxed">
        Cette section dépendait d’une ancienne intégration PocketBase. La gestion des comptes staff
        (table <code className="text-amber-800 bg-amber-50 px-1 rounded">users</code> sur Neon) pourra être
        branchée ici lorsque des routes API dédiées seront ajoutées.
      </p>
    </div>
  );
};
