import React, { useEffect } from 'react';
import { useBoutiqueStore } from '../store/boutiqueStore';

export const BoutiqueList: React.FC = () => {
  const { boutiques, loading, error, fetchBoutiques } = useBoutiqueStore();

  // Charger les boutiques au montage du composant
  useEffect(() => {
    fetchBoutiques();
  }, []);

  // Rafraîchir les données toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBoutiques();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {boutiques.map((boutique) => (
        <div key={boutique._id} className="bg-white rounded-lg shadow-md p-4">
          <img
            src={boutique.image}
            alt={boutique.nom}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          {boutique.logo && (
            <img
              src={boutique.logo}
              alt={`Logo ${boutique.nom}`}
              className="w-16 h-16 object-contain mb-2"
            />
          )}
          <h3 className="text-xl font-bold mb-2">{boutique.nom}</h3>
          <p className="text-gray-600 mb-2">{boutique.description}</p>
          <p className="text-sm text-gray-500">
            <strong>Univers:</strong> {boutique.universe}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Horaires:</strong> {boutique.horaires}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Ouverture:</strong> {boutique.heureOuverture} - {boutique.heureFermeture}
          </p>
          {boutique.openSunday && (
            <p className="text-sm text-green-500">Ouvert le dimanche</p>
          )}
          <div className="mt-4 space-y-1">
            {boutique.telephone && (
              <p className="text-sm">
                <strong>Tél:</strong> {boutique.telephone}
              </p>
            )}
            {boutique.email && (
              <p className="text-sm">
                <strong>Email:</strong> {boutique.email}
              </p>
            )}
          </div>
          <div className="mt-4 flex space-x-4">
            {boutique.instagram && (
              <a
                href={boutique.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700"
              >
                Instagram
              </a>
            )}
            {boutique.facebook && (
              <a
                href={boutique.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                Facebook
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}; 