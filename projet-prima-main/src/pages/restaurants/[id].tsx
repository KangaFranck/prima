import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRestaurantStore } from "../../store/restaurantStore";
import { Instagram, Facebook, Mail, MapPin, Phone, Clock, ArrowLeft, Utensils } from "lucide-react";
import { isCurrentlyOpen } from "../../utils/timeUtils";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Link } from "react-router-dom";

interface StatusBadgeProps {
  heureOuverture?: string;
  heureFermeture?: string;
  openSunday?: boolean;
  statut?: "actif" | "inactif";
}

const StatusBadge = ({ heureOuverture, heureFermeture, openSunday, statut }: StatusBadgeProps) => {
  const open = isCurrentlyOpen({
    heureOuverture: heureOuverture || "",
    heureFermeture: heureFermeture || "",
    openSunday,
    statut
  });
  
  return (
    <div className={`inline-flex items-center px-3 py-1 text-sm ${
      open ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${
        open ? "bg-green-500" : "bg-red-500"
      }`} />
      {open ? "Ouvert" : "Fermé"}
    </div>
  );
};

const RestaurantDetail = () => {
  const { id } = useParams();
  const { restaurants, fetchRestaurants, loading, error } = useRestaurantStore();
  const restaurant = restaurants.find(r => r.id === id);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-500 text-xl">Erreur: {error}</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-xl text-gray-600">Restaurant non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Section 1: Image pleine écran */}
      <div className="relative h-screen">
        {restaurant.image ? (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-24 h-24 bg-gray-200 flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-lg">Image du restaurant</p>
            </div>
          </div>
        )}
        
        {/* Bouton retour */}
        <Link
          to="/restaurants"
          className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm p-3 hover:bg-white transition-colors shadow-lg"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </Link>
      </div>

      {/* Section 2: Design Bonpoint - 3 blocs verticaux */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Bloc 1 - Logo et statut */}
          <div className="lg:w-1/3">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-black mb-2" style={{ fontFamily: 'serif' }}>
                {restaurant.name}
              </h1>
              <div className="w-24 h-0.5 bg-black"></div>
            </div>
            
            {/* Statut */}
            <div className="mt-8">
              <StatusBadge
                heureOuverture={restaurant.heureOuverture}
                heureFermeture={restaurant.heureFermeture}
                openSunday={restaurant.openSunday}
                statut={restaurant.statut}
              />
            </div>
          </div>

          {/* Bloc 2 - Description et informations */}
          <div className="lg:w-1/3">
            {/* Description */}
            {restaurant.description && (
              <div className="mb-8">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {restaurant.description}
                </p>
              </div>
            )}

            {/* Informations de contact */}
            <div className="space-y-6">
              {/* Adresse */}
              {restaurant.adresse && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700">{restaurant.adresse}</p>
                  </div>
                </div>
              )}

              {/* Téléphone */}
              {restaurant.telephone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-black flex-shrink-0" />
                  <a 
                    href={`tel:${restaurant.telephone}`}
                    className="text-gray-700 hover:text-black transition-colors"
                  >
                    {restaurant.telephone}
                  </a>
                </div>
              )}

              {/* Horaires */}
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                <div>
                  {restaurant.horaires ? (
                    <p className="text-gray-700 whitespace-pre-line">{restaurant.horaires}</p>
                  ) : (
                    <div className="text-gray-700">
                      <p>Du lundi au vendredi</p>
                      <p className="font-medium">{restaurant.heureOuverture} - {restaurant.heureFermeture}</p>
                      {restaurant.openSunday && (
                        <p className="text-sm text-gray-600">Ouvert le dimanche</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bloc 3 - Réseaux sociaux */}
          <div className="lg:w-1/3 flex justify-end">
            <div className="flex flex-col space-y-4">
              {/* Icônes de réseaux sociaux */}
              {restaurant.facebook && (
                <a 
                  href={restaurant.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                  title="Facebook"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              )}
              
              {restaurant.instagram && (
                <a 
                  href={restaurant.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              )}
              
              {restaurant.tiktok && (
                <a 
                  href={restaurant.tiktok} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                  title="TikTok"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;