import React, { useEffect } from 'react';
import { Restaurant } from '../../types/admin';
import { motion } from 'framer-motion';
import { useAdminStore } from '../../store/adminStore';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminRestaurants = () => {
  const { 
    restaurants, 
    loading, 
    error, 
    addRestaurant, 
    updateRestaurant, 
    deleteRestaurant,
    fetchRestaurants 
  } = useAdminStore();

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<Partial<Restaurant>>({
    nom: '',
    cuisine: '',
    description: '',
    horaires: '',
    image: '',
    logo: '',
    statut: 'actif'
  });

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const handleAdd = () => {
    const newRestaurant: Restaurant = {
      id: Date.now().toString(),
      ...formData as Restaurant
    };
    addRestaurant(newRestaurant);
    setFormData({
      nom: '',
      cuisine: '',
      description: '',
      horaires: '',
      image: '',
      logo: '',
      statut: 'actif'
    });
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingId(restaurant.id);
    setFormData(restaurant);
  };

  const handleSave = () => {
    if (!editingId) return;
    updateRestaurant(editingId, formData);
    setEditingId(null);
    setFormData({
      nom: '',
      cuisine: '',
      description: '',
      horaires: '',
      image: '',
      logo: '',
      statut: 'actif'
    });
  };

  const handleDelete = (id: string) => {
    deleteRestaurant(id);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-light text-gray-800 mb-8"
        >
          Gestion des Restaurants
        </motion.h1>
        
        {/* Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-light text-gray-700 mb-6">
            {editingId ? 'Modifier le restaurant' : 'Ajouter un restaurant'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du restaurant</label>
                <input
                  type="text"
                  placeholder="Nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#e7e4dd] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de cuisine</label>
                <input
                  type="text"
                  placeholder="Type de cuisine"
                  value={formData.cuisine}
                  onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#e7e4dd] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horaires</label>
                <input
                  type="text"
                  placeholder="Horaires"
                  value={formData.horaires}
                  onChange={(e) => setFormData({ ...formData, horaires: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#e7e4dd] focus:border-transparent"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 focus:ring-2 focus:ring-[#e7e4dd] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
                <input
                  type="text"
                  placeholder="URL de l'image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#e7e4dd] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL du logo</label>
                <input
                  type="text"
                  placeholder="URL du logo"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#e7e4dd] focus:border-transparent"
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Statut :</label>
              <select
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#e7e4dd] focus:border-transparent"
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>
            <div className="flex space-x-4">
              {editingId ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-[#e7e4dd] text-gray-800 px-6 py-2 rounded-lg hover:bg-[#d4d1ca] transition-colors"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        nom: '',
                        cuisine: '',
                        description: '',
                        horaires: '',
                        image: '',
                        logo: '',
                        statut: 'actif'
                      });
                    }}
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Annuler
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAdd}
                  className="bg-[#e7e4dd] text-gray-800 px-6 py-2 rounded-lg hover:bg-[#d4d1ca] transition-colors"
                >
                  Ajouter
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Restaurants Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {restaurants.map((restaurant) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={restaurant.image || '/images/placeholder.jpg'}
                  alt={restaurant.nom}
                  className="w-full h-full object-cover"
                />
                {restaurant.logo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <img
                      src={restaurant.logo}
                      alt={`Logo ${restaurant.nom}`}
                      className="max-w-[50%] max-h-[50%] object-contain"
                    />
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-light text-gray-800">{restaurant.nom}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    restaurant.statut === 'actif' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {restaurant.statut}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{restaurant.cuisine}</p>
                <p className="text-gray-500 text-sm mb-4">{restaurant.horaires}</p>
                <p className="text-gray-700 text-sm line-clamp-2 mb-6">{restaurant.description}</p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleEdit(restaurant)}
                    className="text-[#e7e4dd] hover:text-[#d4d1ca] transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(restaurant.id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminRestaurants; 