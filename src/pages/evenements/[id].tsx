import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEvenementStore } from '../../store/evenementStore';
import { Calendar, Clock, MapPin, Phone, Mail, ArrowRight, Facebook, Instagram, Plus } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/date';

const EventDetail = () => {
  const { id } = useParams();
  const { evenements, fetchEvenements, loading, error } = useEvenementStore();
  const evenement = evenements.find(e => e.id === id);

  useEffect(() => {
    fetchEvenements();
  }, [fetchEvenements]);

  const addToCalendar = () => {
    if (!evenement) return;
    const dateStr = evenement.date || new Date().toISOString();
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const start = `${y}${m}${day}T100000Z`;
    const end = `${y}${m}${day}T210000Z`;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(evenement.title)}&dates=${start}/${end}&details=${encodeURIComponent(evenement.description || '')}&location=${encodeURIComponent(evenement.lieu || '')}`;
    window.open(url, '_blank');
  };

  const shareUrlFull = typeof window !== 'undefined' ? window.location.href : '';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4]">
        <p className="text-red-500 text-xl">Erreur: {error}</p>
      </div>
    );
  }

  if (!evenement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4]">
        <p className="text-xl text-gray-600">Événement non trouvé.</p>
      </div>
    );
  }

  // Get other evenements (excluding current one) - show up to 6
  const otherEvenements = evenements.filter(e => e.id !== id).slice(0, 6);

  return (
    <div className="min-h-screen bg-white" style={{ paddingTop: 'var(--navbar-height)' }}>
      {/* Layout style Bal Harbour : image à gauche, infos à droite */}
      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto">
        {/* Colonne image : cover + galerie (peut rétrécir pour laisser place au texte) */}
        <div className="w-full lg:min-w-0 lg:max-w-[min(1020px,55%)] flex-shrink space-y-4">
          <div className="aspect-[1020/1350] overflow-hidden">
            {evenement.image ? (
              <img
                src={evenement.image}
                alt={evenement.title}
                className="w-full h-full object-cover"
                width={1020}
                height={1350}
              />
            ) : (
              <div className="w-full h-full min-h-[320px] bg-[#F8F7F4] flex items-center justify-center">
                <Calendar className="w-20 h-20 text-gray-300" />
              </div>
            )}
          </div>
          {evenement.images && evenement.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {evenement.images.map((url, i) => (
                <div key={i} className="aspect-[1020/1350] max-h-[280px] overflow-hidden rounded-md bg-[#F8F7F4]">
                  <img
                    src={url}
                    alt={`${evenement.title} - image ${i + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Colonne infos : largeur min pour éviter que le texte déborde ou soit coupé */}
        <div className="flex-1 flex flex-col min-w-0 lg:min-w-[320px] p-6 md:p-8 lg:p-10 lg:py-14 bg-white overflow-visible relative z-10">
          <p className="text-xs md:text-sm font-sofia font-medium text-gray-500 uppercase tracking-widest mb-2">
            Prochain événement
          </p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-ogg font-bold text-gray-900 tracking-tight mb-4 break-words">
            {evenement.title}
          </h1>
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

          {evenement.description && (
            <div className="font-sofia text-gray-700 leading-relaxed mb-8 whitespace-pre-line">
              {evenement.description}
            </div>
          )}

          <button
            type="button"
            onClick={addToCalendar}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-sofia font-medium text-sm hover:bg-gray-800 transition-colors w-full sm:w-auto justify-center mb-8"
          >
            <Plus className="w-4 h-4" />
            Ajouter au calendrier
          </button>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-xs font-sofia text-gray-500 uppercase tracking-wider mb-3">Partager</p>
            <div className="flex gap-2">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrlFull)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                aria-label="Partager sur Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-sofia font-semibold text-gray-700 mb-2">Contact</h3>
            <a href="tel:+22507880080" className="flex items-center gap-2 text-gray-600 font-sofia text-sm hover:text-black">
              <Phone className="w-4 h-4" /> +225 07 88 00 80
            </a>
            <a href="mailto:communicationprimacenter@gmail.com" className="flex items-center gap-2 text-gray-600 font-sofia text-sm hover:text-black mt-1">
              <Mail className="w-4 h-4" /> communicationprimacenter@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Section autres événements */}
      <div className="bg-white py-16 w-full">
        <div className="content-wrap">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-ogg text-black mb-4">Découvrez d'autres événements</h2>
            <div className="w-24 h-1 bg-black mx-auto"></div>
          </div>
          
          {otherEvenements.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {otherEvenements.map((otherEvenement) => (
                <a
                  key={otherEvenement.id}
                  href={`/evenements/${otherEvenement.id}`}
                  className="group relative bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-300 transform hover:-translate-y-2"
                  style={{ aspectRatio: '1/1' }}
                >
                  <div className="relative w-full h-full">
                    {otherEvenement.image ? (
                      <img
                        src={otherEvenement.image}
                        alt={otherEvenement.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#F8F7F4] to-gray-200 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    <div className="absolute top-2 left-2">
                      <div className="bg-white/90 backdrop-blur-sm px-2 py-1">
                        <div className="flex items-center space-x-1 text-black">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs font-medium">{formatDate(otherEvenement.date)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white font-bold text-sm mb-1 line-clamp-2 drop-shadow-lg">
                        {otherEvenement.title}
                      </h3>
                      
                      <div className="flex items-center text-white font-medium text-xs group-hover:text-white/80 transition-colors">
                        <span>Voir</span>
                        <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-black flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-black mb-4">Aucun autre événement disponible</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                D'autres événements seront bientôt ajoutés. Revenez plus tard pour découvrir nos prochains événements !
              </p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <a
              href="/actualites"
              className="inline-flex items-center px-12 py-6 bg-black text-white font-bold text-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Calendar className="w-6 h-6 mr-3" />
              Voir tous les événements
              <ArrowRight className="w-6 h-6 ml-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;