import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePublicStore } from '../store/publicStore';
import { Link } from 'react-router-dom';

const Restaurants = () => {
  const { restaurants, loading, error, fetchRestaurants } = usePublicStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  // Pagination
  const totalPages = Math.ceil(restaurants.length / itemsPerPage);
  const currentItems = restaurants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4">
        {/* État de chargement et erreurs */}
        {loading && (
          <div className="py-16 text-center">
            <p className="text-xl">Chargement des restaurants...</p>
          </div>
        )}

        {error && (
          <div className="py-16 text-center text-red-600">
            <p className="text-xl">{error}</p>
          </div>
        )}

        {/* Grille des restaurants */}
        {!loading && !error && (
          <div className="py-16">
            {restaurants.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xl text-gray-600">Aucun restaurant trouvé</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {currentItems.map((restaurant) => (
                    <Link 
                      to={`/restaurants/${restaurant.id}`} 
                      key={restaurant.id}
                      className="block"
                    >
                      <motion.div 
                        className="cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="aspect-square flex items-center justify-center bg-gray-50 rounded-md overflow-hidden">
                          {restaurant.logo ? (
                            <img 
                              src={restaurant.logo} 
                              alt={restaurant.nom}
                              className="w-full h-full object-contain p-2"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/placeholder.png';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <span className="text-4xl font-ogg">{restaurant.nom.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <h3 className="mt-2 text-base font-ogg text-center truncate px-1">{restaurant.nom}</h3>
                      </motion.div>
                    </Link>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="pb-8">
            <div className="flex items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center border border-black/10 disabled:opacity-50 rounded"
              >
                ←
              </motion.button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded ${
                      currentPage === page 
                        ? 'bg-black text-white' 
                        : 'border border-black/10 hover:border-black'
                    }`}
                  >
                    {page}
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center border border-black/10 disabled:opacity-50 rounded"
              >
                →
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants; 