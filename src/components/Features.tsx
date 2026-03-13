import React from 'react';
import { ShoppingBag, Clock, MapPin, Phone, Users, Building2, Wallet, Coffee } from 'lucide-react';

// Features section highlighting mall amenities
const Features = () => {
  const features = [
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Plus de 100 Boutiques",
      description: "Une sélection variée de marques locales et internationales",
      color: "bg-orange-50"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Horaires Flexibles",
      description: "Ouvert 7j/7 de 10h à 22h",
      color: "bg-blue-50"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Emplacement Idéal",
      description: "Situé au cœur d'Abidjan",
      color: "bg-green-50"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Service Client",
      description: "Une équipe à votre écoute",
      color: "bg-purple-50"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Espace Détente",
      description: "Des zones de repos confortables",
      color: "bg-pink-50"
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Centre d'Affaires",
      description: "Espaces professionnels modernes",
      color: "bg-yellow-50"
    },
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "Services Bancaires",
      description: "Toutes vos opérations financières",
      color: "bg-indigo-50"
    },
    {
      icon: <Coffee className="w-8 h-8" />,
      title: "Restauration",
      description: "Une variété de restaurants et cafés",
      color: "bg-red-50"
    }
  ];

  return (
    <section className="py-24 bg-white w-full">
      <div className="content-wrap">
        {/* En-tête de section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 relative inline-block">
            Nos Services
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-pink-500 transform scale-x-50 group-hover:scale-x-100 transition-transform duration-500"></div>
          </h2>
          <p className="text-xl text-gray-600">
            Découvrez tout ce que PRIMA CENTER a à vous offrir
          </p>
        </div>

        {/* Grille des features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group p-8 rounded-2xl transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 cursor-pointer ${feature.color}`}
              style={{
                transitionDelay: `${index * 50}ms`
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-full"></div>
                <div className="text-gray-800 mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
              <div className="mt-4 h-1 w-12 bg-gradient-to-r from-gray-200 to-gray-300 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;