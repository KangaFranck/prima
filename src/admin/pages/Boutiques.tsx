import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash, Search, X } from 'lucide-react';
import { EntityModal } from '../components/EntityModal';
import { Boutique } from '../../types/entity';
import { usePbAdminStore } from '../../store/pbAdminStore';

export const Boutiques = () => {
  const { boutiques, createBoutique, updateBoutique, deleteBoutique, fetchBoutiques, loading, error } = usePbAdminStore();

  useEffect(() => {
    fetchBoutiques();
  }, [fetchBoutiques]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBoutique, setSelectedBoutique] = useState<Boutique | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrage des boutiques basé sur la recherche
  const filteredBoutiques = boutiques.filter(boutique =>
    boutique.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (boutique.description && boutique.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (boutique.telephone && boutique.telephone.includes(searchTerm)) ||
    (boutique.email && boutique.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (formData: FormData) => {
    console.log('=== DÉBUT HANDLE SUBMIT BOUTIQUE ===');
    
    try {
      // Construction de l'objet boutique à partir du FormData
      const heureOuverture = String(formData.get('heureOuverture') ?? '').trim();
      const heureFermeture = String(formData.get('heureFermeture') ?? '').trim();
      if (import.meta.env.DEV) console.log('Boutiques handleSubmit – heures FormData:', { heureOuverture: heureOuverture || '(vide)', heureFermeture: heureFermeture || '(vide)' });

      const boutique: Partial<Boutique> = {
        nom: formData.get('nom') as string,
        description: formData.get('description') as string,
        horaires: formData.get('horaires') as string,
        heureOuverture,
        heureFermeture,
        openSunday: formData.get('openSunday') === 'true',
        statut: formData.get('statut') as 'actif' | 'inactif',
        universe: formData.get('universe') as string || 'Général',
        telephone: formData.get('telephone') as string || undefined,
        email: formData.get('email') as string || undefined,
        instagram: (formData.get('instagram') as string)?.trim() || undefined,
        facebook: formData.get('facebook') as string || undefined,
        tiktok: (formData.get('tiktok') as string)?.trim() || undefined,
        website: formData.get('website') as string || undefined
      };

      // Gestion des fichiers
      const logoFile = formData.get('logo') as File;
      if (logoFile && logoFile.size > 0) {
        console.log('Logo File détecté:', logoFile.name, logoFile.type, logoFile.size);
        boutique.logo = logoFile;
      } else if (selectedBoutique?.logo) {
        console.log('Utilisation du logo existant');
        boutique.logo = selectedBoutique.logo;
      }

      const imageFile = formData.get('image') as File;
      if (imageFile && imageFile.size > 0) {
        boutique.image = imageFile;
      } else if (selectedBoutique?.image) {
        boutique.image = selectedBoutique.image;
      }

      const image2File = formData.get('image2') as File;
      if (image2File && image2File.size > 0) {
        boutique.image2 = image2File;
      } else if (selectedBoutique?.logoCarousel) {
        boutique.logoCarousel = selectedBoutique.logoCarousel;
      }

      console.log('Objet boutique final:', {
        ...boutique,
        logoType: boutique.logo ? typeof boutique.logo : 'undefined',
        logoIsFile: boutique.logo instanceof File,
        imageType: boutique.image ? typeof boutique.image : 'undefined',
        imageIsFile: boutique.image instanceof File
      });

      if (selectedBoutique) {
        console.log('Mise à jour de la boutique existante...');
        await updateBoutique(selectedBoutique.id, boutique);
        console.log('Boutique mise à jour avec succès');
      } else {
        console.log('Création d\'une nouvelle boutique...');
        await createBoutique(boutique);
        console.log('Boutique créée avec succès');
      }
      
      setIsModalOpen(false);
      setSelectedBoutique(null);
      fetchBoutiques();
    } catch (error: any) {
      console.error('❌ Erreur lors de la soumission:', error);
      if (error?.data) console.error('Détails PocketBase (error.data):', error.data);

      let errorMessage = 'Erreur lors de la sauvegarde de la boutique.';
      if (error?.status === 400 && error?.data) {
        const data = error.data;
        if (typeof data === 'object' && data !== null && data.data && typeof data.data === 'object') {
          const details = data.data as Record<string, { code?: string; message?: string }>;
          if (details.image?.code === 'validation_file_size_limit') {
            errorMessage = 'L\'image dépasse la taille maximale autorisée (5 Mo). Réduisez la taille du fichier ou choisissez une image plus légère.';
          } else {
            const parts: string[] = [];
            Object.entries(details).forEach(([field, err]) => {
              const msg = err?.message || String(err);
              parts.push(`${field}: ${msg}`);
            });
            if (parts.length) errorMessage = parts.join('\n');
          }
        } else if (typeof data === 'object' && data !== null && (data as { message?: string }).message) {
          errorMessage = (data as { message: string }).message;
        }
      }
      if (errorMessage === 'Erreur lors de la sauvegarde de la boutique.' && error?.message) {
        errorMessage = error.message;
      } else if (errorMessage === 'Erreur lors de la sauvegarde de la boutique.' && error?.data?.message) {
        errorMessage = error.data.message;
      }

      alert(`❌ ${errorMessage}`);
    }
  };

  const handleEdit = (boutique: Boutique) => {
    setSelectedBoutique(boutique);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette boutique ?')) {
      try {
        await deleteBoutique(id);
        fetchBoutiques();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleAdd = () => {
    setSelectedBoutique(null);
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
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-1 sm:mb-2">Boutiques</h1>
            <p className="text-sm sm:text-base text-stone-600">Gérez vos boutiques et commerces</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center justify-center px-4 py-3 sm:px-6 w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus className="w-5 h-5 mr-2 shrink-0" />
            Ajouter une boutique
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
            placeholder="Rechercher une boutique (nom, description, téléphone, email)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white shadow-sm"
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
            {filteredBoutiques.length} boutique(s) trouvée(s) pour "{searchTerm}"
          </p>
        )}
      </div>

      {/* Grid des boutiques - DESIGN ULTRA SIMPLIFIÉ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {filteredBoutiques.map((boutique) => (
          <div key={boutique.id} className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-amber-100 hover:border-amber-300 transform hover:-translate-y-2">
            {/* Image de fond avec overlay */}
            <div className="relative h-40 sm:h-48 overflow-hidden">
              {boutique.image ? (
                <img
                  src={boutique.image}
                  alt={boutique.nom}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-amber-300 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-white">B</span>
                    </div>
                    <p className="text-amber-600 font-medium">Boutique</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Logo flottant - SEULEMENT CELUI-CI */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-2 flex items-center justify-center">
                {boutique.logo ? (
                  <img
                    src={boutique.logo}
                    alt={boutique.nom}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <span className="text-amber-600 font-bold text-sm">B</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="absolute top-4 left-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(boutique)}
                  className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                  title="Modifier"
                >
                  <Pencil className="w-4 h-4 text-amber-600" />
                </button>
                <button
                  onClick={() => handleDelete(boutique.id)}
                  className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors shadow-lg"
                  title="Supprimer"
                >
                  <Trash className="w-4 h-4 text-red-600" />
                </button>
              </div>

              {/* Statut badge - SEULEMENT CELUI-CI */}
              <div className="absolute bottom-4 left-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  boutique.statut === 'actif' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {boutique.statut === 'actif' ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
            
            {/* NOM SEULEMENT EN DESSOUS */}
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-stone-800 group-hover:text-amber-700 transition-colors">
                {boutique.nom}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Message si aucune boutique trouvée */}
      {filteredBoutiques.length === 0 && searchTerm && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-stone-800 mb-4">Aucune boutique trouvée</h3>
          <p className="text-stone-600 mb-8 max-w-md mx-auto">
            Aucune boutique ne correspond à votre recherche "{searchTerm}". Essayez avec d'autres mots-clés.
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

      {/* Message si aucune boutique */}
      {boutiques.length === 0 && !searchTerm && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl font-bold text-amber-600">B</span>
          </div>
          <h3 className="text-2xl font-bold text-stone-800 mb-4">Aucune boutique enregistrée</h3>
          <p className="text-stone-600 mb-8 max-w-md mx-auto">
            Commencez par ajouter votre première boutique en cliquant sur le bouton "Ajouter une boutique".
          </p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter votre première boutique
          </button>
        </div>
      )}

      <EntityModal
        key={selectedBoutique?.id ?? 'new'}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBoutique(null);
        }}
        onSubmit={handleSubmit}
        title={selectedBoutique ? "Modifier la boutique" : "Ajouter une boutique"}
        entityData={selectedBoutique ?? undefined}
        entityType="boutiques"
      />
    </div>
  );
};
