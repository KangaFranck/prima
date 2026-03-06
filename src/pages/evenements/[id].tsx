import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEvenementStore } from '../../store/evenementStore';
import { apiClient } from '../../services/apiClient';
import { Calendar, Clock, MapPin, Phone, Mail, ArrowRight, Facebook, Instagram, Plus, X } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate, formatEventDateRange } from '../../utils/date';

/** Forme attendue par la page détail (liste ou détail par ID). */
type DetailEvenement = {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  images?: string[];
  lieu?: string;
  heure?: string;
  dateFin?: string;
  heureFin?: string;
  statut?: string;
};

function mapApiToDetail(r: any): DetailEvenement {
  const rawImages = r?.images ?? r?.Images;
  const images = Array.isArray(rawImages) ? rawImages.slice(0, 3).filter((u: unknown) => typeof u === 'string' && u.length > 0) : [];
  return {
    id: r.id,
    title: r.titre ?? r.title ?? '',
    description: r.description ?? '',
    date: r.date ?? '',
    image: r.image ?? r.affiche ?? '',
    images: images.length > 0 ? images : undefined,
    lieu: r.lieu,
    heure: r.heure,
    dateFin: r.dateFin,
    heureFin: r.heureFin,
    statut: r.statut,
  };
}

const EventDetail = () => {
  const { id } = useParams();
  const { evenements, fetchEvenements, loading, error } = useEvenementStore();
  const fromList = evenements.find(e => e.id === id);
  const [detailEvenement, setDetailEvenement] = useState<DetailEvenement | null>(null);
  const [detailLoading, setDetailLoading] = useState(true);
  const [mainImageError, setMainImageError] = useState(false);
  const [galleryErrors, setGalleryErrors] = useState<Set<number>>(new Set());
  /** Image affichée en lightbox (cliquable) ; null = fermé */
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchEvenements();
  }, [fetchEvenements]);

  useEffect(() => {
    if (!lightboxUrl) return;
    const onEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxUrl(null); };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [lightboxUrl]);

  useEffect(() => {
    if (!id) {
      setDetailLoading(false);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    apiClient.evenements
      .get(id)
      .then((data) => {
        if (!cancelled) setDetailEvenement(mapApiToDetail(data));
      })
      .catch(() => {
        if (!cancelled) setDetailEvenement(null);
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

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

  const evenement = detailEvenement ?? (fromList ? mapApiToDetail(fromList) : null);

  if (loading || (id && detailLoading && !evenement)) {
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

  const hasGalerie = evenement.images && evenement.images.length > 0;
  const galerieCount = hasGalerie ? evenement.images!.length : 0;

  return (
    <div className="min-h-screen bg-white" style={{ paddingTop: 'var(--navbar-height)' }}>
      {/* 1) Bloc images : galerie au-dessus, affiche en dessous. Si une seule image galerie elle occupe tout le bloc ; sinon partagé. Toutes cliquables → lightbox. */}
      <div className="w-full max-w-6xl mx-auto">
        {/* Galerie (au-dessus de l'affiche) : 1 image = bloc plein, 2–3 = partagé */}
        {hasGalerie && (
          <div
            className={`grid gap-3 overflow-hidden px-4 sm:px-6 pt-4 sm:pt-6 ${
              galerieCount === 1
                ? 'grid-cols-1'
                : galerieCount === 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {evenement.images!.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLightboxUrl(url)}
                className={`overflow-hidden rounded-lg bg-[#F8F7F4] text-left focus:outline-none focus:ring-2 focus:ring-black/20 cursor-pointer ${
                  galerieCount === 1
                    ? 'aspect-[16/10] min-h-[200px] sm:min-h-[280px]'
                    : 'aspect-[4/3] min-h-[160px] sm:min-h-[200px]'
                }`}
              >
                {!galleryErrors.has(i) ? (
                  <img
                    src={url}
                    alt={`${evenement.title} - image ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                    onError={() => setGalleryErrors(prev => new Set(prev).add(i))}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-gray-300" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Affiche principale (en dessous de la galerie si présente, sinon en tête) */}
        <div className={`w-full px-4 sm:px-6 ${hasGalerie ? 'pt-3 pb-4' : 'pt-4 sm:pt-6 pb-4'}`}>
          <div className="aspect-[16/10] sm:aspect-[2/1] max-h-[60vh] overflow-hidden rounded-lg bg-[#F8F7F4]">
            {evenement.image && !mainImageError ? (
              <button
                type="button"
                onClick={() => setLightboxUrl(evenement.image)}
                className="w-full h-full block text-left focus:outline-none focus:ring-2 focus:ring-black/20 cursor-pointer"
              >
                <img
                  src={evenement.image}
                  alt={evenement.title}
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                  onError={() => setMainImageError(true)}
                />
              </button>
            ) : (
              <div className="w-full h-full min-h-[280px] bg-[#F8F7F4] flex items-center justify-center">
                <Calendar className="w-20 h-20 text-gray-300" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2) Bloc infos en grand type cover (pleine largeur, typo grande) */}
      <div className="w-full bg-[#F8F7F4] py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs md:text-sm font-sofia font-medium text-gray-500 uppercase tracking-widest mb-3">
            Prochain événement
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-ogg font-bold text-gray-900 tracking-tight mb-6 break-words leading-tight">
            {evenement.title}
          </h1>
          {evenement.lieu && (
            <div className="flex items-start gap-2 text-gray-600 mb-3">
              <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-gray-500" />
              <span className="font-sofia text-base md:text-lg">{evenement.lieu}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600 mb-8">
            <Clock className="w-5 h-5 shrink-0 text-gray-500" />
            <span className="font-sofia text-base md:text-lg">
              {formatEventDateRange({ date: evenement.date, heure: evenement.heure, dateFin: evenement.dateFin, heureFin: evenement.heureFin })}
            </span>
          </div>

          {evenement.description && (
            <div className="font-sofia text-gray-700 text-lg md:text-xl leading-relaxed mb-10 whitespace-pre-line">
              {evenement.description}
            </div>
          )}

          <button
            type="button"
            onClick={addToCalendar}
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-sofia font-medium text-base hover:bg-gray-800 transition-colors justify-center mb-10"
          >
            <Plus className="w-5 h-5 flex-shrink-0" />
            Ajouter au calendrier
          </button>

          <div className="pt-8 border-t border-gray-300">
            <p className="text-xs font-sofia text-gray-500 uppercase tracking-wider mb-4">Partager</p>
            <div className="flex gap-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrlFull)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                aria-label="Partager sur Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-200">
            <h3 className="text-base font-sofia font-semibold text-gray-700 mb-3">Contact</h3>
            <a href="tel:+22507880080" className="flex items-center gap-2 text-gray-600 font-sofia text-base hover:text-black">
              <Phone className="w-5 h-5" /> +225 07 88 00 80
            </a>
            <a href="mailto:communicationprimacenter@gmail.com" className="flex items-center gap-2 text-gray-600 font-sofia text-base hover:text-black mt-2">
              <Mail className="w-5 h-5" /> communicationprimacenter@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox : image cliquée, bouton X pour fermer */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxUrl(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Voir l'image en grand"
        >
          <button
            type="button"
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxUrl}
            alt=""
            className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

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