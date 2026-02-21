import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/date';
import { useEvenementStore } from '../store/evenementStore';
import GoldStar from '../components/GoldStar';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Clock } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

function toDateStr(d: string): string {
  const date = new Date(d);
  if (isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const todayStr = () => {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
};

function EventCard({
  evenement,
  size = 'normal',
  onClick,
}: {
  evenement: { id: string; title: string; date: string; image: string; lieu?: string; heure?: string };
  size?: 'featured' | 'normal';
  onClick: () => void;
}) {
  const isFeatured = size === 'featured';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-white shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-100 ${isFeatured ? 'max-w-4xl mx-auto' : ''}`}
      style={{
        aspectRatio: isFeatured ? '21/9' : '4/3',
        minHeight: isFeatured ? '320px' : '280px',
        minWidth: isFeatured ? undefined : '260px',
      }}
      onClick={onClick}
    >
      <div className="relative w-full h-full">
        {evenement.image ? (
          <img
            src={evenement.image}
            alt={evenement.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#F8F7F4] to-gray-200 flex items-center justify-center">
            <Calendar className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-2 right-2">
          <GoldStar />
        </div>
        <div className="absolute top-2 left-2">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1">
            <div className="flex items-center space-x-1 text-black">
              <Calendar className="w-3 h-3" />
              <span className="text-xs font-medium">{formatDate(evenement.date)}</span>
            </div>
          </div>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 ${isFeatured ? 'p-8' : 'p-6'}`}>
          <h3 className={`text-white font-bold drop-shadow-lg line-clamp-2 ${isFeatured ? 'text-2xl md:text-3xl mb-4' : 'text-lg mb-3'}`}>
            {evenement.title}
          </h3>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-white/90 mb-3">
            {evenement.heure && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 shrink-0" />
                <span>{evenement.heure}</span>
              </div>
            )}
            {evenement.lieu && (
              <div className="flex items-center space-x-1 min-w-0">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{evenement.lieu}</span>
              </div>
            )}
          </div>
          <div className="flex items-center text-white font-medium group-hover:text-white/80 transition-colors">
            <span className={isFeatured ? 'text-lg' : 'text-base'}>En savoir plus</span>
            <ArrowRight className={`ml-2 group-hover:translate-x-1 transition-transform ${isFeatured ? 'w-6 h-6' : 'w-5 h-5'}`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const ActusEvents = () => {
  const { evenements, loading, error, fetchEvenements } = useEvenementStore();
  const navigate = useNavigate();

  const { featured, upcoming, past } = useMemo(() => {
    const today = todayStr();
    const withDate = evenements
      .filter((e) => e.date)
      .map((e) => ({ ...e, dateStr: toDateStr(e.date) }))
      .filter((e) => e.dateStr);
    const upcomingList = withDate.filter((e) => e.dateStr >= today).sort((a, b) => a.dateStr.localeCompare(b.dateStr));
    const pastList = withDate.filter((e) => e.dateStr < today).sort((a, b) => b.dateStr.localeCompare(a.dateStr));
    const featuredOne = upcomingList[0] ?? null;
    const otherUpcoming = upcomingList.slice(1);
    return {
      featured: featuredOne,
      upcoming: otherUpcoming,
      past: pastList,
    };
  }, [evenements]);

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
        <button onClick={fetchEvenements} className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors">
          Réessayer
        </button>
      </div>
    </div>
  );

  const isEmpty = evenements.length === 0;

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <div className="relative min-h-[calc(100vh-var(--navbar-height))] mt-[var(--navbar-height)] bg-[#F8F7F4] pb-16">
        <div className="w-full px-4 sm:px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center pt-16 mb-16"
          >
            <div className="flex-1 h-0.5 bg-gray-300" />
            <h1 className="text-[35px] sm:text-[45px] md:text-[55px] lg:text-[65px] font-ogg font-semibold text-gray-600 leading-[0.9] tracking-wider uppercase px-8">
              Les événements
            </h1>
            <div className="flex-1 h-0.5 bg-gray-300" />
          </motion.div>

          {isEmpty ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-black flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Aucun événement à afficher</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                D'autres événements seront bientôt ajoutés. Revenez plus tard pour découvrir nos prochains événements !
              </p>
            </div>
          ) : (
            <>
              {/* Événement central / à la une (le prochain à venir) — plus grand */}
              {featured && (
                <section className="mb-14">
                  <EventCard
                    evenement={featured}
                    size="featured"
                    onClick={() => navigate(`/evenements/${featured.id}`)}
                  />
                </section>
              )}

              {/* Événements à venir (reste des futurs) */}
              {upcoming.length > 0 && (
                <section className="mb-14">
                  <h2 className="font-ogg text-xl md:text-2xl font-semibold text-gray-700 uppercase tracking-wider mb-6">
                    Événements à venir
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcoming.map((evenement) => (
                      <EventCard
                        key={evenement.id}
                        evenement={evenement}
                        size="normal"
                        onClick={() => navigate(`/evenements/${evenement.id}`)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Événements passés */}
              {past.length > 0 && (
                <section>
                  <h2 className="font-ogg text-xl md:text-2xl font-semibold text-gray-700 uppercase tracking-wider mb-6">
                    Événements passés
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {past.map((evenement) => (
                      <EventCard
                        key={evenement.id}
                        evenement={evenement}
                        size="normal"
                        onClick={() => navigate(`/evenements/${evenement.id}`)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Si aucun à venir ni passés (données sans date valide) */}
              {!featured && upcoming.length === 0 && past.length === 0 && evenements.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {evenements.map((evenement) => (
                    <EventCard
                      key={evenement.id}
                      evenement={evenement}
                      size="normal"
                      onClick={() => navigate(`/evenements/${evenement.id}`)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActusEvents;