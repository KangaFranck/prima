import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash, Search, X } from 'lucide-react';
import { EntityModal } from '../components/EntityModal';
import { Evenement } from '../../types/entity';
import { usePbAdminStore } from '../../store/pbAdminStore';

export const Evenements = () => {
  const { evenements, createEvenement, updateEvenement, deleteEvenement, fetchEvenements, loading, error } = usePbAdminStore();

  useEffect(() => {
    fetchEvenements();
  }, [fetchEvenements]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvenement, setSelectedEvenement] = useState<Evenement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrage des événements basé sur la recherche
  const filteredEvenements = evenements.filter(evenement =>
    (evenement.titre || evenement.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (evenement.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (evenement.lieu || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (formData: FormData) => {
    console.log('=== DÉBUT HANDLE SUBMIT ÉVÉNEMENT ===');
    
    try {
      // Construction de l'objet événement à partir du FormData
      const evenement: Partial<Evenement> = {
        titre: formData.get('titre') as string,
        description: formData.get('description') as string,
        date: formData.get('date') as string,
        lieu: formData.get('lieu') as string,
        statut: formData.get('statut') as 'planifié' | 'annulé' | 'terminé',
        email: formData.get('email') as string || undefined
      };

      // Gestion du fichier affiche
      const afficheFile = formData.get('affiche') as File;
      if (afficheFile && afficheFile.size > 0) {
        console.log('Affiche File détectée:', afficheFile.name, afficheFile.type, afficheFile.size);
        evenement.affiche = afficheFile;
      } else if (selectedEvenement?.affiche) {
        console.log('Utilisation de l\'affiche existante');
        evenement.affiche = selectedEvenement.affiche;
      }

      console.log('Objet événement final:', {
        ...evenement,
        afficheType: evenement.affiche ? typeof evenement.affiche : 'undefined',
        afficheIsFile: evenement.affiche instanceof File
      });

      if (selectedEvenement) {
        console.log('Mise à jour de l\'événement existant...');
        await updateEvenement(selectedEvenement.id, evenement);
        console.log('Événement mis à jour avec succès');
      } else {
        console.log('Création d\'un nouvel événement...');
        await createEvenement(evenement);
        console.log('Événement créé avec succès');
      }
      
      setIsModalOpen(false);
      setSelectedEvenement(null);
      fetchEvenements();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const handleEdit = (evenement: Evenement) => {
    setSelectedEvenement(evenement);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        await deleteEvenement(id);
        fetchEvenements();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleAdd = () => {
    setSelectedEvenement(null);
    setIsModalOpen(true);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        <p>Erreur: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-50 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-1 sm:mb-2">Gestion des Événements</h1>
            <p className="text-sm sm:text-base text-stone-600">Gérez vos événements et manifestations</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center justify-center px-4 py-3 sm:px-6 w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus className="w-5 h-5 mr-2 shrink-0" />
            Ajouter un événement
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un événement (titre, description, lieu)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-600">
            {filteredEvenements.length} événement(s) trouvé(s) pour "{searchTerm}"
          </p>
        )}
      </div>

      {/* Tableau des événements */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-amber-200/50">
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <table className="min-w-[600px] sm:min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-amber-50 to-amber-100">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Lieu
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvenements.map((evenement) => (
                <tr key={evenement.id} className="hover:bg-amber-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-stone-800">
                      {evenement.titre || evenement.title || 'Sans titre'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                    {evenement.date ? new Date(evenement.date).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Non définie'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                    {evenement.lieu || 'Non défini'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      evenement.statut === 'planifié' 
                        ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                        : evenement.statut === 'annulé'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-green-100 text-green-800 border border-green-200'
                    }`}>
                      {evenement.statut || 'planifié'}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(evenement)}
                        className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(evenement.id)}
                        className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors"
                        title="Supprimer"
                      >
                        <Trash className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message si aucun événement trouvé */}
      {filteredEvenements.length === 0 && searchTerm && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-stone-800 mb-4">Aucun événement trouvé</h3>
          <p className="text-stone-600 mb-8 max-w-md mx-auto">
            Aucun événement ne correspond à votre recherche "{searchTerm}". Essayez avec d'autres mots-clés.
          </p>
          <button
            onClick={clearSearch}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <X className="w-5 h-5 mr-2" />
            Effacer la recherche
          </button>
        </div>
      )}

      {/* Message si aucun événement */}
      {evenements.length === 0 && !searchTerm && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl font-bold text-amber-600">E</span>
          </div>
          <h3 className="text-2xl font-bold text-stone-800 mb-4">Aucun événement enregistré</h3>
          <p className="text-stone-600 mb-8 max-w-md mx-auto">
            Commencez par ajouter votre premier événement en cliquant sur le bouton "Ajouter un événement".
          </p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter votre premier événement
          </button>
        </div>
      )}

      <EntityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvenement(null);
        }}
        onSubmit={handleSubmit}
        title={selectedEvenement ? "Modifier l'événement" : "Ajouter un événement"}
        entityData={selectedEvenement}
        entityType="evenements"
      />
    </div>
  );
};
