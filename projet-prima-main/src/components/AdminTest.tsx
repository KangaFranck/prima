import React, { useEffect, useState } from 'react';
import { usePbAdminStore } from '../store/pbAdminStore';

const AdminTest = () => {
  const { boutiques, fetchBoutiques, loading, error } = usePbAdminStore();
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setTestResult('Test de connexion en cours...');
      await fetchBoutiques();
      setTestResult(` Connexion réussie ! ${boutiques.length} boutiques trouvées.`);
    } catch (err) {
      setTestResult(` Erreur de connexion: ${err}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Test de connexion PocketBase</h2>
      <div className="mb-4">
        <p className="text-gray-600">Status: {testResult}</p>
        {loading && <p className="text-blue-600">Chargement...</p>}
        {error && <p className="text-red-600">Erreur: {error}</p>}
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Boutiques trouvées:</h3>
        <ul className="list-disc list-inside">
          {boutiques.map((boutique) => (
            <li key={boutique.id} className="text-gray-700">
              {boutique.nom} (ID: {boutique.id})
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={testConnection}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Tester à nouveau
      </button>
    </div>
  );
};

export default AdminTest;