import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/date';
import { useEvenementStore } from '../store/evenementStore';
import GoldStar from '../components/GoldStar';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Clock } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const ActusEvents = () => {
  const { evenements, loading, error, fetchEvenements } = useEvenementStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvenements();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4]">
      <LoadingSpinner />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4]">
      <div className="text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchEvenements}
          className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <div className="relative min-h-[calc(100vh-var(--navbar-height))] mt-[var(--navbar-height)] bg-[#F8F7F4] pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center pt-16 mb-16"
          >
            <div className="flex-1 h-0.5 bg-gray-300"></div>
            <h1 className="text-[35px] sm:text-[45px] md:text-[55px] lg:text-[65px] font-['Playfair_Display'] font-semibold text-gray-600 leading-[0.9] tracking-wider uppercase px-8 [-webkit-font-smoothing:antialiased] [text-rendering:optimizeLegibility]">
              Les événements
            </h1>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {evenements.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="w-24 h-24 bg-black flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">Aucun événement à afficher</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  D'autres événements seront bientôt ajoutés. Revenez plus tard pour découvrir nos prochains événements !
                </p>
              </div>
            ) : (
              evenements.map((evenement) => (
                <motion.div
                  key={evenement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-100"
                  style={{ 
                    aspectRatio: '4/3',
                    minHeight: '400px',
                    minWidth: '300px'
                  }} // Hauteur +3cm, largeur +2cm
                  onClick={() => navigate(`/evenements/${evenement.id}`)}
                >
                  {/* Image carrée parfaite - Format Instagram */}
                  <div className="relative w-full h-full">
                    {evenement.image ? (
                      <img
                        src={evenement.image}
                        alt={evenement.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#F8F7F4] to-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <span className="text-lg font-bold text-gray-500">{evenement.title.charAt(0)}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    {/* Gold Star */}
                    <div className="absolute top-2 right-2">
                      <GoldStar />
                    </div>
                    
                    {/* Date badge */}
                    <div className="absolute top-2 left-2">
                      <div className="bg-white/90 backdrop-blur-sm px-2 py-1">
                        <div className="flex items-center space-x-1 text-black">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs font-medium">{formatDate(evenement.date)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content overlay - Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white font-bold text-lg mb-3 line-clamp-2 drop-shadow-lg">
                        {evenement.title}
                      </h3>
                      
                      {/* Event info */}
                      <div className="flex items-center space-x-3 text-base text-white/90 mb-3">
                        {evenement.heure && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{evenement.heure}</span>
                          </div>
                        )}
                        {evenement.lieu && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{evenement.lieu}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* CTA */}
                      <div className="flex items-center text-white font-medium text-base group-hover:text-white/80 transition-colors">
                        <span>En savoir plus</span>
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActusEvents;