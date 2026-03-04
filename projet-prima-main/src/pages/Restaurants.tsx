import React, { useEffect } from 'react';
import { useRestaurantStore } from '../store/restaurantStore';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { isCurrentlyOpen } from '../utils/timeUtils';

const Restaurants = () => {
  const { restaurants, loading, error, fetchRestaurants } = useRestaurantStore();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchRestaurants}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen antialiased">
      {/* Hero Section */}
      <div className="relative h-[75vh] will-change-transform">
        <img 
          src="/images/restaurants-hero-2.jpg"
          alt="Restaurants Prima Center"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-filter">
          <div className="absolute bottom-8 left-4 md:left-8 lg:left-12 w-5/6 md:w-2/3 lg:w-1/2">
            <h1 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] font-playfair text-white leading-[0.9] tracking-wider mb-2 [-webkit-font-smoothing:antialiased] [text-rendering:optimizeLegibility]">
              Restaurants
            </h1>
            <p className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-neue font-extralight text-white [-webkit-font-smoothing:antialiased]">
              Une expérience culinaire unique
            </p>
          </div>
          {/* Ligne horizontale qui s'étend jusqu'à l'extrême droite */}
          <div className="absolute bottom-8 left-4 md:left-8 lg:left-12 right-0 h-0.5 bg-white mt-16"></div>
        </div>
      </div>

      {/* Grille des restaurants */}
      <div className="bg-[#f5f3ef] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {restaurants.map((restaurant) => {
              const isOpen = isCurrentlyOpen({
                heureOuverture: restaurant.heureOuverture,
                heureFermeture: restaurant.heureFermeture,
                openSunday: restaurant.openSunday,
                statut: restaurant.statut
              });
              return (
                <Link
                  key={restaurant.id}
                  to={`/restaurants/${restaurant.id}`}
                  className="group block w-full aspect-square relative overflow-hidden bg-white border border-gray-300 hover:bg-gray-200 transition-colors duration-300"
                >
                  <motion.div
                    variants={itemVariants}
                    className="w-full h-full relative"
                  >
                    {/* Logo centré */}
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      {restaurant.logo ? (
                        <img
                          src={restaurant.logo}
                          alt={restaurant.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-2xl font-neue font-light text-gray-400">{restaurant.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Texte en bas */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-gray-900 font-neue font-medium text-sm mb-2 text-left">
                        {restaurant.name}
                      </h3>
                      <div className="text-left">
                        <span className={`text-xs font-neue font-medium px-2 py-1 rounded ${
                          isOpen
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {isOpen ? 'Ouvert' : 'Fermé'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Overlay noir clair au survol */}
                    <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Restaurants;