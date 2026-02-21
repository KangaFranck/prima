import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEvenementStore } from '../../store/evenementStore';
import { Calendar, Clock, MapPin, Phone, Mail, Sparkles, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/date';

const EventDetail = () => {
  const { id } = useParams();
  const { evenements, fetchEvenements, loading, error } = useEvenementStore();
  const evenement = evenements.find(e => e.id === id);

  useEffect(() => {
    fetchEvenements();
  }, [fetchEvenements]);

  // Fonction pour ajouter l'événement au calendrier
  const addToCalendar = () => {
    if (!evenement) return;

    // Formatage des dates pour l'URL du calendrier
    const formatDateForCalendar = (dateString: string) => {
      const date = new Date(dateString);
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const startDate = formatDateForCalendar(evenement.dateDebut);
    const endDate = formatDateForCalendar(evenement.dateFin || evenement.dateDebut);

    // Création de l'URL Google Calendar
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(evenement.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(evenement.description || '')}&location=${encodeURIComponent(evenement.lieu || '')}`;

    // Ouverture du lien dans un nouvel onglet
    window.open(googleCalendarUrl, '_blank');
  };

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
    <div className="min-h-screen bg-[#F8F7F4]" style={{ paddingTop: '120px' }}>
      {/* Hero Section - Grande image */}
      <div className="relative h-[70vh] overflow-hidden">
        {evenement.image ? (
          <img
            src={evenement.image}
            alt={evenement.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#F8F7F4] to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <Calendar className="w-32 h-32 text-gray-400 mx-auto mb-6" />
              <span className="text-6xl font-bold text-gray-500">{evenement.title.charAt(0)}</span>
            </div>
          </div>
        )}
        
        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Contenu overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full p-8 lg:p-16">
            <div className="max-w-4xl mx-auto">
              {/* Date et lieu */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2">
                  <div className="flex items-center space-x-2 text-black">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">{formatDate(evenement.date)}</span>
                  </div>
                </div>
                {evenement.heure && (
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2">
                    <div className="flex items-center space-x-2 text-black">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">{evenement.heure}</span>
                    </div>
                  </div>
                )}
                {evenement.lieu && (
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2">
                    <div className="flex items-center space-x-2 text-black">
                      <MapPin className="w-5 h-5" />
                      <span className="font-medium">{evenement.lieu}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Titre principal */}
              <h1 className="text-5xl lg:text-7xl font-ogg text-white mb-6 leading-tight">
                {evenement.title}
              </h1>
              
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="w-full px-4 sm:px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Colonne principale - Description */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 lg:p-12">
              <h2 className="text-3xl font-ogg text-black mb-6">À propos de cet événement</h2>
              
              {evenement.description ? (
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg mb-8">
                    {evenement.description}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 text-lg">Aucune description disponible pour le moment.</p>
              )}

              {/* Informations détaillées */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="bg-[#F8F7F4] p-6">
                  <h3 className="text-xl font-bold text-black mb-4">Informations pratiques</h3>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 text-black mr-3" />
                      <span className="font-medium">Date: {formatDate(evenement.date)}</span>
                    </div>
                    
                    {evenement.heure && (
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-5 h-5 text-black mr-3" />
                        <span className="font-medium">Heure: {evenement.heure}</span>
                      </div>
                    )}
                    
                    {evenement.lieu && (
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-5 h-5 text-black mr-3" />
                        <span className="font-medium">Lieu: {evenement.lieu}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-[#F8F7F4] p-6">
                  <h3 className="text-xl font-bold text-black mb-4">Contact</h3>
                  <div className="space-y-4">
                    <a href="tel:+22507880080" className="flex items-center text-gray-700 hover:text-black transition-colors">
                      <Phone className="w-5 h-5 text-black mr-3" />
                      <span className="font-medium">+225 07 88 00 80</span>
                    </a>
                    <a href="mailto:info@primacenter.ci" className="flex items-center text-gray-700 hover:text-black transition-colors">
                      <Mail className="w-5 h-5 text-black mr-3" />
                      <span className="font-medium">info@primacenter.ci</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Informations rapides */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 lg:p-12 sticky top-8">
              <h3 className="text-2xl font-bold text-black mb-6">Détails de l'événement</h3>
              
              <div className="space-y-6">
                {/* Date */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Calendar className="w-6 h-6 text-black" />
                    <span className="font-bold text-black">Date</span>
                  </div>
                  <p className="text-gray-700 text-lg">{formatDate(evenement.date)}</p>
                </div>

                {/* Heure */}
                {evenement.heure && (
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <Clock className="w-6 h-6 text-black" />
                      <span className="font-bold text-black">Heure</span>
                    </div>
                    <p className="text-gray-700 text-lg">{evenement.heure}</p>
                  </div>
                )}

                {/* Lieu */}
                {evenement.lieu && (
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <MapPin className="w-6 h-6 text-black" />
                      <span className="font-bold text-black">Lieu</span>
                    </div>
                    <p className="text-gray-700 text-lg">{evenement.lieu}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-4">
                  <button 
                    onClick={addToCalendar}
                    className="w-full border-2 border-black text-black py-4 font-bold text-lg hover:bg-black hover:text-white transition-colors flex items-center justify-center"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Ajouter au calendrier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section autres événements */}
      <div className="bg-white py-16 w-full">
        <div className="w-full px-4 sm:px-6 md:px-8">
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