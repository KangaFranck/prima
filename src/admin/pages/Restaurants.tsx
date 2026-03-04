import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash, Search, X } from 'lucide-react';
import { EntityModal } from '../components/EntityModal';
import { Restaurant } from '../../types/entity';
import { usePbAdminStore } from '../../store/pbAdminStore';

export const Restaurants = () => {
  const { restaurants, createRestaurant, updateRestaurant, deleteRestaurant, fetchRestaurants, loading, error } = usePbAdminStore();

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrage des restaurants basé sur la recherche
  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (restaurant.description && restaurant.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (restaurant.telephone && restaurant.telephone.includes(searchTerm)) ||
    (restaurant.email && restaurant.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (formData: FormData) => {
    console.log('=== DÉBUT HANDLE SUBMIT RESTAURANT ===');
    
    try {
      // Construction de l'objet restaurant à partir du FormData
      const restaurant: Partial<Restaurant> = {
        nom: formData.get('nom') as string,
        description: formData.get('description') as string,
        horaires: formData.get('horaires') as string,
        heureOuverture: String(formData.get('heureOuverture') ?? '').trim(),
        heureFermeture: String(formData.get('heureFermeture') ?? '').trim(),
        openSunday: formData.get('openSunday') === 'true',
        statut: formData.get('statut') as 'actif' | 'inactif',
        universe: formData.get('universe') as string || 'Général',
        telephone: (formData.get('telephone') as string)?.trim() || undefined,
        email: (formData.get('email') as string)?.trim() || undefined,
        instagram: (formData.get('instagram') as string)?.trim() || undefined,
        facebook: (formData.get('facebook') as string)?.trim() || undefined,
        tiktok: (formData.get('tiktok') as string)?.trim() || undefined,
        website: (formData.get('website') as string)?.trim() || undefined
      };

      // Gestion des fichiers
      const logoFile = formData.get('logo') as File;
      if (logoFile && logoFile.size > 0) {
        console.log('Logo File détecté:', logoFile.name, logoFile.type, logoFile.size);
        restaurant.logo = logoFile;
      } else if (selectedRestaurant?.logo) {
        console.log('Utilisation du logo existant');
        restaurant.logo = selectedRestaurant.logo;
      }

      const imageFile = formData.get('image') as File;
      if (imageFile && imageFile.size > 0) {
        restaurant.image = imageFile;
      } else if (selectedRestaurant?.image) {
        restaurant.image = selectedRestaurant.image;
      }

      const image2File = formData.get('image2') as File;
      if (image2File && image2File.size > 0) {
        restaurant.image2 = image2File;
      } else if (selectedRestaurant?.logoCarousel) {
        restaurant.logoCarousel = selectedRestaurant.logoCarousel;
      }


      console.log('Objet restaurant final:', {
        ...restaurant,
        logoType: restaurant.logo ? typeof restaurant.logo : 'undefined',
        logoIsFile: restaurant.logo instanceof File,
        imageType: restaurant.image ? typeof restaurant.image : 'undefined',
        imageIsFile: restaurant.image instanceof File
      });

      if (selectedRestaurant) {
        console.log('Mise à jour du restaurant existant...');
        await updateRestaurant(selectedRestaurant.id, restaurant);
        console.log('Restaurant mis à jour avec succès');
      } else {
        console.log('Création d\'un nouveau restaurant...');
        await createRestaurant(restaurant);
        console.log('Restaurant créé avec succès');
      }
      
      setIsModalOpen(false);
      setSelectedRestaurant(null);
      fetchRestaurants();
    } catch (error: unknown) {
      console.error('Erreur lors de la soumission:', error);
      const err = error as { status?: number; data?: { data?: Record<string, { code?: string; message?: string }>; message?: string }; message?: string };
      let msg = 'Erreur lors de la sauvegarde du restaurant.';
      if (err?.status === 400 && err?.data?.data && typeof err.data.data === 'object') {
        const d = err.data.data;
        if (d.image?.code === 'validation_file_size_limit') {
          msg = 'L\'image dépasse la taille maximale (5 Mo). Réduisez la taille du fichier ou choisissez une image plus légère.';
        } else {
          const parts = Object.entries(d).map(([f, e]) => `${f}: ${e?.message || ''}`);
          if (parts.length) msg = parts.join('\n');
        }
      } else if (err?.message) msg = err.message;
      alert('❌ ' + msg);
    }
  };

  const handleEdit = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce restaurant ?')) {
      try {
        await deleteRestaurant(id);
        fetchRestaurants();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleAdd = () => {
    setSelectedRestaurant(null);
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
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-1 sm:mb-2">Restaurants</h1>
            <p className="text-sm sm:text-base text-stone-600">Gérez vos restaurants et établissements</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center justify-center px-4 py-3 sm:px-6 w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus className="w-5 h-5 mr-2 shrink-0" />
            Ajouter un restaurant
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
            placeholder="Rechercher un restaurant (nom, description, téléphone, email)..."
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
            {filteredRestaurants.length} restaurant(s) trouvé(s) pour "{searchTerm}"
          </p>
        )}
      </div>

      {/* Grid des restaurants - DESIGN ULTRA SIMPLIFIÉ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRestaurants.map((restaurant) => (
          <div key={restaurant.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-amber-100 hover:border-amber-300 transform hover:-translate-y-2">
            {/* Image de fond avec overlay */}
            <div className="relative h-48 overflow-hidden">
              {restaurant.image ? (
                <img
                  src={restaurant.image}
                  alt={restaurant.nom}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-amber-300 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-white">R</span>
                    </div>
                    <p className="text-amber-600 font-medium">Restaurant</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Logo flottant - SEULEMENT CELUI-CI */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-2 flex items-center justify-center">
                {restaurant.logo ? (
                  <img
                    src={restaurant.logo}
                    alt={restaurant.nom}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <span className="text-amber-600 font-bold text-sm">R</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="absolute top-4 left-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(restaurant)}
                  className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                  title="Modifier"
                >
                  <Pencil className="w-4 h-4 text-amber-600" />
                </button>
                <button
                  onClick={() => handleDelete(restaurant.id)}
                  className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors shadow-lg"
                  title="Supprimer"
                >
                  <Trash className="w-4 h-4 text-red-600" />
                </button>
              </div>

              {/* Statut badge - SEULEMENT CELUI-CI */}
              <div className="absolute bottom-4 left-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  restaurant.statut === 'actif' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {restaurant.statut === 'actif' ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
            
            {/* NOM SEULEMENT EN DESSOUS */}
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-stone-800 group-hover:text-amber-700 transition-colors">
                {restaurant.nom}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Message si aucun restaurant trouvé */}
      {filteredRestaurants.length === 0 && searchTerm && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-stone-800 mb-4">Aucun restaurant trouvé</h3>
          <p className="text-stone-600 mb-8 max-w-md mx-auto">
            Aucun restaurant ne correspond à votre recherche "{searchTerm}". Essayez avec d'autres mots-clés.
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

      {/* Message si aucun restaurant */}
      {restaurants.length === 0 && !searchTerm && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl font-bold text-amber-600">R</span>
          </div>
          <h3 className="text-2xl font-bold text-stone-800 mb-4">Aucun restaurant enregistré</h3>
          <p className="text-stone-600 mb-8 max-w-md mx-auto">
            Commencez par ajouter votre premier restaurant en cliquant sur le bouton "Ajouter un restaurant".
          </p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter votre premier restaurant
          </button>
        </div>
      )}

      <EntityModal
        key={selectedRestaurant?.id ?? 'new'}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRestaurant(null);
        }}
        onSubmit={handleSubmit}
        title={selectedRestaurant ? "Modifier le restaurant" : "Ajouter un restaurant"}
        entityData={selectedRestaurant ?? undefined}
        entityType="restaurants"
      />
    </div>
  );
};
