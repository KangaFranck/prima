import React, { useEffect } from 'react';
import { useServiceStore } from '../store/serviceStore';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const Services = () => {
  const { services, loading, error, fetchServices } = useServiceStore();

  useEffect(() => {
    fetchServices();
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
          onClick={fetchServices}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen antialiased w-full max-w-full min-w-0 overflow-x-hidden">
      <div className="relative h-[42vh] min-h-[240px] max-h-[380px] w-full overflow-hidden">
        <img
          src="/images/NOS UNIVERS SERVIVCES.png"
          alt="Services Prima Center"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/sections/loisirs-hero-2.jpg';
          }}
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute bottom-6 left-0 right-0 content-wrap">
          <h1 className="text-[48px] sm:text-[56px] md:text-[64px] lg:text-[80px] font-ogg font-semibold text-white leading-tight tracking-wide drop-shadow-sm [-webkit-font-smoothing:antialiased]">
            Services
          </h1>
        </div>
      </div>

      <div className="py-20 w-full bg-cover bg-center" style={{ backgroundImage: "url('/images/bg-beige.png')", backgroundColor: '#efece6' }}>
        <div className="content-wrap">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5"
          >
            {[...services].sort((a, b) => (a.name || '').localeCompare(b.name || '', 'fr')).map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="group block w-full max-w-[200px] sm:max-w-[220px] mx-auto aspect-square relative overflow-hidden bg-transparent transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-400"
              >
                <motion.div
                  variants={itemVariants}
                  className="w-full h-full flex flex-col items-center justify-start p-4"
                >
                  <div className="w-full h-24 sm:h-28 flex-shrink-0 flex items-center justify-center">
                    {(service.logo || service.image) ? (
                      <img
                        src={service.logo || service.image}
                        alt={service.name}
                        className="max-w-full max-h-full w-auto h-auto object-contain object-center"
                      />
                    ) : (
                      <span className="text-2xl font-sofia font-light text-neutral-400">{service.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="mt-3 text-center flex-shrink-0 min-h-0 flex-1 flex items-center justify-center">
                    <h3 className="text-neutral-800 font-sofia font-medium text-sm uppercase break-words line-clamp-3">
                      {service.name}
                    </h3>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
          {services.length === 0 && (
            <p className="text-center text-slate-600 py-12">Aucun service pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;
