import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { formatEventDateRange, getEventStatus } from '../utils/date';
import { useEvenementStore } from '../store/evenementStore';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Facebook, Instagram, Plus } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';


function addToCalendar(e: React.MouseEvent, evenement: { id: string; title: string; date: string; description?: string; lieu?: string; heure?: string; dateFin?: string; heureFin?: string }) {
  e.preventDefault();
  e.stopPropagation();
  const d = evenement.date ? new Date(evenement.date) : new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = evenement.heure ? parseInt(evenement.heure.slice(0, 2), 10) || 10 : 10;
  const min = evenement.heure ? parseInt(evenement.heure.slice(3, 5), 10) || 0 : 0;
  const start = `${y}${m}${day}T${String(h).padStart(2, '0')}${String(min).padStart(2, '0')}00Z`;
  let end: string;
  if (evenement.dateFin) {
    const df = new Date(evenement.dateFin);
    const ye = df.getFullYear();
    const me = String(df.getMonth() + 1).padStart(2, '0');
    const daye = String(df.getDate()).padStart(2, '0');
    const he = evenement.heureFin ? parseInt(evenement.heureFin.slice(0, 2), 10) || 21 : 21;
    const mine = evenement.heureFin ? parseInt(evenement.heureFin.slice(3, 5), 10) || 0 : 0;
    end = `${ye}${me}${daye}T${String(he).padStart(2, '0')}${String(mine).padStart(2, '0')}00Z`;
  } else {
    end = `${y}${m}${day}T210000Z`;
  }
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(evenement.title)}&dates=${start}/${end}&details=${encodeURIComponent(evenement.description || '')}&location=${encodeURIComponent(evenement.lieu || '')}`;
  window.open(url, '_blank');
}

function shareUrl(path: string): string {
  if (typeof window === 'undefined') return '';
  return window.location.origin + path;
}

/** Libellé selon le statut */
const STATUS_LABEL: Record<string, string> = {
  en_cours: 'Actus & Events en cours',
  avenir: 'À venir',
  passe: 'Actus & Events passées',
};

/** Carte événement style Bal Harbour : image à gauche, infos à droite */
function EventRow({
  evenement,
  index,
  statusLabel,
  onSeeMore,
}: {
  evenement: { id: string; title: string; date: string; image: string; lieu?: string; heure?: string; description?: string; dateFin?: string; heureFin?: string };
  index: number;
  statusLabel: string;
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
          {statusLabel}
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
            {formatEventDateRange({ date: evenement.date, heure: evenement.heure, dateFin: evenement.dateFin, heureFin: evenement.heureFin })}
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

  const { enCours, avenir, past } = useMemo(() => {
    const withStatus = evenements
      .filter((e) => e.date)
      .map((e) => ({ ...e, status: getEventStatus({ date: e.date, heure: e.heure, dateFin: e.dateFin, heureFin: e.heureFin }) }))
      .filter((e) => e.status);
    const enCoursList = withStatus.filter((e) => e.status === 'en_cours').sort((a, b) => a.date.localeCompare(b.date));
    const avenirList = withStatus.filter((e) => e.status === 'avenir').sort((a, b) => a.date.localeCompare(b.date));
    const pastList = withStatus.filter((e) => e.status === 'passe').sort((a, b) => (b.dateFin || b.date).localeCompare(a.dateFin || a.date));
    return { enCours: enCoursList, avenir: avenirList, past: pastList };
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

  const allCurrentAndUpcoming = [...enCours, ...avenir];

  return (
    <div className="min-h-screen bg-white w-full max-w-full min-w-0 overflow-x-hidden">
      <div className="relative min-h-[calc(100vh-var(--navbar-height))] pb-16">
        <div className="content-wrap">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-ogg text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight pt-16 mb-12 md:mb-16"
          >
            Actus & Events
          </motion.h1>

          {isEmpty ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 flex items-center justify-center mx-auto mb-6 rounded-full">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-ogg font-semibold text-gray-800 mb-3">Aucun Actus & Events à afficher</h3>
              <p className="text-gray-500 max-w-md mx-auto font-sofia">
                D'autres Actus & Events seront bientôt ajoutés. Revenez plus tard !
              </p>
            </div>
          ) : (
            <>
              {enCours.length > 0 && (
                <section className="mb-16">
                  <div className="space-y-12">
                    {enCours.map((evenement, index) => (
                      <EventRow
                        key={evenement.id}
                        evenement={evenement}
                        index={index}
                        statusLabel={STATUS_LABEL.en_cours}
                        onSeeMore={() => navigate(`/evenements/${evenement.id}`)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {avenir.length > 0 && (
                <section className={enCours.length > 0 ? 'mb-16' : ''}>
                  <h2 className="font-ogg text-xl md:text-2xl font-semibold text-gray-600 uppercase tracking-wider mb-8">
                    À venir
                  </h2>
                  <div className="space-y-12">
                    {avenir.map((evenement, index) => (
                      <EventRow
                        key={evenement.id}
                        evenement={evenement}
                        index={enCours.length + index}
                        statusLabel={STATUS_LABEL.avenir}
                        onSeeMore={() => navigate(`/evenements/${evenement.id}`)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {past.length > 0 && (
                <section className="mt-16 pt-12 border-t border-gray-200">
                  <h2 className="font-ogg text-xl md:text-2xl font-semibold text-gray-600 uppercase tracking-wider mb-8">
                    Actus & Events passées
                  </h2>
                  <div className="space-y-8">
                    {past.map((evenement, index) => (
                      <EventRow
                        key={evenement.id}
                        evenement={evenement}
                        index={allCurrentAndUpcoming.length + index}
                        statusLabel={STATUS_LABEL.passe}
                        onSeeMore={() => navigate(`/evenements/${evenement.id}`)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {enCours.length === 0 && avenir.length === 0 && past.length === 0 && evenements.length > 0 && (
                <div className="space-y-12">
                  {evenements.map((evenement, index) => (
                    <EventRow
                      key={evenement.id}
                      evenement={evenement}
                      index={index}
                      statusLabel="Actus & Events"
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