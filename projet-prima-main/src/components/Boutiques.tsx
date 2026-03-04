import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShopStore } from '../store/shopStore';
import { Link } from 'react-router-dom';

const shops = () => {
  const { shops, loading, error, fetchShops } = useShopStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    console.log('Composant monté, appel de fetchShops');
    fetchShops();
  }, [fetchShops]);

  // Pagination
  const totalPages = Math.ceil(shops.length / itemsPerPage);
  const currentShops = shops.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4">
        {/* État de chargement et erreurs */}
        {loading && (
          <div className="py-16 text-center">
            <p className="text-xl font-neue">Chargement des shops...</p>
          </div>
        )}

        {error && (
          <div className="py-16 text-center">
            <p className="text-xl font-neue text-red-500">Erreur: {error}</p>
          </div>
        )}

        {/* Affichage des shops */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {currentShops.map((shop) => (
                  <motion.div
                    key={shop.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <Link to={/shops/}>
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        {shop.logo ? (
                          <img
                            src={shop.logo}
                            alt={shop.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/images/logos/default.png';
                            }}
                          />
                        ) : (
                          <div className="text-gray-400 text-4xl"></div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-neue font-medium text-lg mb-2">{shop.name}</h3>
                        {shop.description && (
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {shop.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {shop.categories.map((category, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                  >
                    Précédent
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={px-4 py-2 rounded-lg transition-colors }
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}

            {/* Message si aucune boutique */}
            {shops.length === 0 && !loading && (
              <div className="py-16 text-center">
                <p className="text-xl font-neue text-gray-500">
                  Aucune boutique disponible pour le moment.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default shops;
