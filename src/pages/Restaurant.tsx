import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePublicStore } from '../store/publicStore';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { isCurrentlyOpen } from '../utils/timeUtils';

// Fonction pour extraire les heures du format "Lun-Dim: 11h30-22h00"
const parseRestaurantHours = (horaires: string) => {
  console.group('🔍 Analyse des horaires du restaurant');
  console.log('Horaires reçus:', horaires);
  
  if (!horaires) {
    console.log('❌ Pas d\'horaires fournis');
    console.groupEnd();
    return null;
  }

  try {
    const [days, hours] = horaires.split(': ');
    console.log('Jours:', days);
    console.log('Heures brutes:', hours);

    const [start, end] = hours.split('-').map(time => {
      const timeStr = time.replace('h', ':');
      console.log('Conversion heure:', time, '→', timeStr);
      return timeStr;
    });

    const openSunday = days.includes('Dim');
    const result = {
      heureOuverture: start,
      heureFermeture: end,
      openSunday,
      statut: 'actif' as const
    };

    console.log('✅ Résultat du parsing:', result);
    console.groupEnd();
    return result;
  } catch (error) {
    console.log('❌ Erreur lors du parsing:', error);
    console.groupEnd();
    return null;
  }
};

const Restaurant = () => {
  const { restaurants, loading, error, fetchRestaurants } = usePublicStore();

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  // Filtrer uniquement les restaurants actifs
  const activeRestaurants = restaurants?.filter(restaurant => restaurant.statut === 'actif') || [];

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
    <div className="flex-grow flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-sofia">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-grow pt-[76px] antialiased">
      {/* Hero Section avec fond noir et image */}
      <div className="relative h-[75vh] will-change-transform">
        {/* Image de fond */}
        <img 
          src="/images/restaurants-hero-2.jpg"
          alt="Restaurants Prima Center"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-filter">
          {/* Contenu centré */}
          <div className="relative h-full flex items-center justify-center text-center">
            <div className="transform translate-y-8 will-change-transform">
              <h1 className="text-[45px] sm:text-[60px] md:text-[75px] lg:text-[90px] font-sofia font-extralight text-white leading-[0.9] tracking-wider uppercase mb-4 [-webkit-font-smoothing:antialiased] [text-rendering:optimizeLegibility]">
                Nos Restaurants
              </h1>
              <p className="text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] font-sofia font-extralight text-white [-webkit-font-smoothing:antialiased]">
                Découvrez nos restaurants et cafés
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurants Grid */}
      <section className="bg-[#f5f3ef] py-20">
        <div className="max-w-7xl mx-auto px-4">
          {activeRestaurants.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl font-sofia text-gray-600">Aucun restaurant n'est disponible pour le moment.</p>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center"
            >
              {activeRestaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  to={`/restaurants/${restaurant.id}`}
                  className="group block w-[200px]"
                >
                  <motion.div
                    variants={itemVariants}
                    className="w-[200px]"
                  >
                    <div className="h-[160px] relative flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      {restaurant.logo ? (
                        <img
                          src={restaurant.logo}
                          alt={restaurant.nom}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-3xl font-sofia font-light text-gray-400">{restaurant.nom.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="h-[40px] flex items-center justify-center gap-2">
                      <h3 className="text-center text-gray-900 font-sofia font-light text-base group-hover:text-blue-600 transition-colors duration-300 px-3 truncate">
                        {restaurant.nom}
                      </h3>
                      <span className={`text-xs font-sofia font-medium px-1.5 py-0.5 rounded ${
                        isCurrentlyOpen({
                          heureOuverture: restaurant.heureOuverture,
                          heureFermeture: restaurant.heureFermeture,
                          openSunday: restaurant.openSunday,
                          statut: restaurant.statut
                        })
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isCurrentlyOpen({
                          heureOuverture: restaurant.heureOuverture,
                          heureFermeture: restaurant.heureFermeture,
                          openSunday: restaurant.openSunday,
                          statut: restaurant.statut
                        }) ? 'Ouvert' : 'Fermé'}
                      </span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Restaurant; 