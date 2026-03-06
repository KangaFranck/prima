import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/date';
import { useEvenementStore } from '../store/evenementStore';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Facebook, Instagram, Plus } from 'lucide-react';
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

function addToCalendar(e: React.MouseEvent, evenement: { id: string; title: string; date: string; description?: string; lieu?: string; heure?: string }) {
  e.preventDefault();
  e.stopPropagation();
  const d = evenement.date ? new Date(evenement.date) : new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const start = `${y}${m}${day}T100000Z`;
  const end = `${y}${m}${day}T210000Z`;
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(evenement.title)}&dates=${start}/${end}&details=${encodeURIComponent(evenement.description || '')}&location=${encodeURIComponent(evenement.lieu || '')}`;
  window.open(url, '_blank');
}

function shareUrl(path: string): string {
  if (typeof window === 'undefined') return '';
  return window.location.origin + path;
}

/** Carte événement style Bal Harbour : image à gauche, infos à droite (titre, lieu, date/heure, Ajouter au calendrier, Partager) */
function EventRow({
  evenement,
  index,
  onSeeMore,
}: {
  evenement: { id: string; title: string; date: string; image: string; lieu?: string; heure?: string; description?: string };
  index: number;
  onSeeMore: () => void;
}) {
  const isReversed = index % 2 === 1;
  const eventPath = `/evenements/${evenement.id}`;
  const url = shareUrl(eventPath);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} bg-white border border-gray-100 overflow-hidden max-w-6xl w-full mx-auto mb-12 lg:mb-16`}
    >
      <div className="w-full lg:w-[70%] aspect-[1020/1350] flex-shrink-0 overflow-hidden">
        <button type="button" onClick={onSeeMore} className="block w-full h-full text-left">
          {evenement.image ? (
            <img
              src={evenement.image}
              alt={evenement.title}
              className="w-full h-full object-cover hover:opacity-95 transition-opacity"
              width={1020}
              height={1350}
            />
          ) : (
            <div className="w-full h-full bg-[#F8F7F4] flex items-center justify-center">
              <Calendar className="w-16 h-16 text-gray-300" />
            </div>
          )}
        </button>
      </div>
      <div className="flex-1 lg:w-[30%] lg:flex-shrink-0 flex flex-col justify-center p-6 md:p-8 lg:p-10">
        <p className="text-xs md:text-sm font-sofia font-medium text-gray-500 uppercase tracking-widest mb-2">
          Prochain événement
        </p>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-ogg font-bold text-gray-900 tracking-tight mb-4">
          {evenement.title}
        </h2>
        {evenement.lieu && (
          <div className="flex items-start gap-2 text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-500" />
            <span className="font-sofia text-sm md:text-base">{evenement.lieu}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-600 mb-6">
          <Clock className="w-4 h-4 shrink-0 text-gray-500" />
          <span className="font-sofia text-sm md:text-base">
            {formatDate(evenement.date)}
            {evenement.heure ? ` — ${evenement.heure}` : ''}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-auto">
          <button
            type="button"
            onClick={(e) => addToCalendar(e, evenement)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white font-sofia font-medium text-sm hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter au calendrier
          </button>
          <button
            type="button"
            onClick={onSeeMore}
            className="inline-flex items-center gap-2 px-5 py-3 border-2 border-gray-800 text-gray-800 font-sofia font-medium text-sm hover:bg-gray-800 hover:text-white transition-colors"
          >
            En savoir plus
          </button>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs font-sofia text-gray-500 uppercase tracking-wider mb-2">Partager</p>
          <div className="flex gap-2">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
              aria-label="Partager sur Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={`https://www.instagram.com/`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
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

  const allUpcoming = featured ? [featured, ...upcoming] : upcoming;

  return (
    <div className="min-h-screen bg-white w-full max-w-full min-w-0 overflow-x-hidden">
      <div className="relative min-h-[calc(100vh-var(--navbar-height))] pb-16">
        <div className="content-wrap">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-ogg text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight pt-16 mb-12 md:mb-16"
          >
            Actualités & Événements
          </motion.h1>

          {isEmpty ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 flex items-center justify-center mx-auto mb-6 rounded-full">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-ogg font-semibold text-gray-800 mb-3">Aucun événement à afficher</h3>
              <p className="text-gray-500 max-w-md mx-auto font-sofia">
                D'autres événements seront bientôt ajoutés. Revenez plus tard !
              </p>
            </div>
          ) : (
            <>
              {allUpcoming.map((evenement, index) => (
                <EventRow
                  key={evenement.id}
                  evenement={evenement}
                  index={index}
                  onSeeMore={() => navigate(`/evenements/${evenement.id}`)}
                />
              ))}

              {past.length > 0 && (
                <section className="mt-16 pt-12 border-t border-gray-200">
                  <h2 className="font-ogg text-xl md:text-2xl font-semibold text-gray-600 uppercase tracking-wider mb-8">
                    Événements passés
                  </h2>
                  <div className="space-y-8">
                    {past.map((evenement, index) => (
                      <EventRow
                        key={evenement.id}
                        evenement={evenement}
                        index={allUpcoming.length + index}
                        onSeeMore={() => navigate(`/evenements/${evenement.id}`)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {!featured && upcoming.length === 0 && past.length === 0 && evenements.length > 0 && (
                <div className="space-y-12">
                  {evenements.map((evenement, index) => (
                    <EventRow
                      key={evenement.id}
                      evenement={evenement}
                      index={index}
                      onSeeMore={() => navigate(`/evenements/${evenement.id}`)}
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