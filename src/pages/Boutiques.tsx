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
    <div className="min-h-screen antialiased">
      <div className="relative h-[75vh] will-change-transform">
        <img 
          src="/images/boutiques-hero-2.jpg"
          alt="Boutiques Prima Center"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-filter">
          <div className="absolute bottom-8 left-4 md:left-8 lg:left-12 w-5/6 md:w-2/3 lg:w-1/2">
            <h1 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] font-ogg text-white leading-[0.9] tracking-wider mb-2 [-webkit-font-smoothing:antialiased] [text-rendering:optimizeLegibility]">
              Boutiques
            </h1>
            <p className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-sofia font-extralight text-white [-webkit-font-smoothing:antialiased]">
              Découvrez notre sélection de marques
            </p>
          </div>
          {/* Ligne horizontale qui s'étend jusqu'à l'extrême droite */}
          <div className="absolute bottom-8 left-4 md:left-8 lg:left-12 right-0 h-0.5 bg-white mt-16"></div>
        </div>
      </div>

      <div className="bg-[#f5f3ef] py-20 w-full">
        <div className="w-full px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
            {shops.map((shop) => (
                <Link
                  key={shop.id}
                  to={`/boutiques/${shop.id}`}
                  className="group block w-full max-w-[140px] mx-auto aspect-[3/4] relative overflow-hidden bg-transparent transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-400"
                >
                  <div className="w-full h-full flex flex-col items-center justify-center p-4">
                    {/* Par défaut : logo carousel (sans fond) ; au survol : logo (avec fond) */}
                    <div className="flex-1 w-full flex items-center justify-center min-h-0 relative">
                      {shop.logoCarousel && shop.logo ? (
                        <>
                          <img
                            src={shop.logoCarousel}
                            alt={shop.name}
                            className="max-w-full max-h-full w-auto h-auto object-contain object-center absolute inset-0 m-auto transition-opacity duration-300 group-hover:opacity-0"
                          />
                          <img
                            src={shop.logo}
                            alt={shop.name}
                            className="max-w-full max-h-full w-auto h-auto object-contain object-center absolute inset-0 m-auto opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          />
                        </>
                      ) : (shop.logoCarousel || shop.logo) ? (
                        <img
                          src={shop.logoCarousel || shop.logo}
                          alt={shop.name}
                          className="max-w-full max-h-full w-auto h-auto object-contain object-center"
                        />
                      ) : (
                        <span className="text-2xl font-sofia font-light text-neutral-400">{shop.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="mt-3 text-center flex-shrink-0">
                      <h3 className="text-neutral-800 font-sofia font-medium text-sm">
                        {shop.name}
                      </h3>
                    </div>
                  </div>
                </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Boutiques;