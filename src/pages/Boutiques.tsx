import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useShopStore } from '../store/shopStore';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
const Boutiques = () => {
  const { shops, loading, error, fetchShops } = useShopStore();

  useEffect(() => {
    fetchShops();
  }, []);

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
          onClick={fetchShops}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen antialiased w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Hero réduit : image pleine largeur + titre en overlay (décalage navbar géré par le layout) */}
      <div className="relative h-[42vh] min-h-[240px] max-h-[380px] w-full overflow-hidden">
        <img
          src="/images/NOS UNIVERS BOUTIQUES.png"
          alt="Boutiques Prima Center"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute bottom-6 left-0 right-0 content-wrap">
          <h1 className="text-[48px] sm:text-[56px] md:text-[64px] lg:text-[80px] font-ogg font-semibold text-white leading-tight tracking-wide drop-shadow-sm [-webkit-font-smoothing:antialiased]">
            Boutiques
          </h1>
        </div>
      </div>

      <div className="py-20 w-full bg-cover bg-center" style={{ backgroundImage: "url('/images/bg-beige.png')", backgroundColor: '#efece6' }}>
        <div className="content-wrap">
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5"
          >
            {[...shops].sort((a, b) => (a.name || '').localeCompare(b.name || '', 'fr')).map((shop) => (
                <Link
                  key={shop.id}
                  to={`/boutiques/${shop.id}`}
                  className="group block w-full max-w-[200px] sm:max-w-[220px] mx-auto aspect-square relative overflow-hidden bg-transparent transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-400"
                >
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                    }}
                    className="w-full h-full flex flex-col items-center justify-start p-4"
                  >
                    <div className="w-full h-24 sm:h-28 flex-shrink-0 flex items-center justify-center">
                      {(shop.logo || shop.image) ? (
                        <img
                          src={shop.logo || shop.image}
                          alt={shop.name}
                          className="max-w-full max-h-full w-auto h-auto object-contain object-center"
                        />
                      ) : (
                        <span className="text-2xl font-sofia font-light text-neutral-400">{shop.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="mt-3 text-center flex-shrink-0 min-h-0 flex-1 flex items-center justify-center">
                      <h3 className="text-neutral-800 font-sofia font-medium text-sm uppercase break-words line-clamp-3">
                        {shop.name}
                      </h3>
                    </div>
                  </motion.div>
                </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Boutiques;
