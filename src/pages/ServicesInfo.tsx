import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  Car,
  ShoppingBag,
  Coffee,
  Wifi,
  CreditCard,
  Heart,
  Accessibility,
  Shield
} from 'lucide-react';

export default function ServicesInfo() {
  const services = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Horaires d'ouverture",
      description: "Lundi - Dimanche : 6h00 - 23h00",
      color: "bg-[#e7e4dd]"
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: "Parking",
      description: "Parking souterrain sécurisé",
      color: "bg-[#d4d1ca]"
    },
    {
      icon: <Wifi className="w-8 h-8" />,
      title: "Wifi Gratuit",
      description: "Connexion haut débit dans tout le centre",
      color: "bg-[#e7e4dd]"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Paiement",
      description: "Tous types de paiements acceptés",
      color: "bg-[#d4d1ca]"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Espace Famille",
      description: "Zone dédiée aux familles",
      color: "bg-[#e7e4dd]"
    },
    {
      icon: <Accessibility className="w-8 h-8" />,
      title: "Accessibilité",
      description: "Centre accessible à tous",
      color: "bg-[#d4d1ca]"
    }
  ];

  const contact = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Adresse",
      info: "123 Avenue Example, 75000 Paris"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Téléphone",
      info: "+33 1 23 45 67 89"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      info: "contact@primacenter.fr"
    }
  ];

  return (
    <div className="min-h-screen bg-white antialiased w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Hero : même style que Boutiques / Restaurants / Loisirs, taille augmentée (décalage navbar géré par le layout) */}
      <section className="relative h-[85vh] min-h-[480px] max-h-[900px] w-full overflow-hidden">
        <img
          src="/images/electronique.jpg"
          alt="Services et Informations"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute bottom-6 left-4 md:left-8 lg:left-12 right-4 md:right-8 lg:right-12">
          <h1 className="text-[28px] sm:text-[34px] md:text-[42px] lg:text-[48px] font-ogg font-semibold text-white leading-tight tracking-wide drop-shadow-sm [-webkit-font-smoothing:antialiased]">
            Services & Informations
          </h1>
          <p className="mt-2 text-sm sm:text-base md:text-lg font-sofia font-light text-white/95 drop-shadow-sm">
            Tout ce dont vous avez besoin pour votre visite
          </p>
        </div>
      </section>

      {/* Services Grid - pleine largeur */}
      <section className="py-20 bg-white w-full">
        <div className="content-wrap">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="text-lg font-bold text-black mb-2">{service.title}</h3>
                <div className="w-24 h-0.5 bg-black mx-auto mb-3"></div>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section - pleine largeur */}
      <section className="py-20 bg-white w-full">
        <div className="content-wrap">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            {/* Carte Google Maps sans flou ni voile */}
            <div className="h-[400px] md:h-[500px] w-full overflow-hidden rounded-lg shadow-lg bg-[#f5f3ef] p-2 md:p-3">
              <div className="relative w-full h-full rounded-md overflow-hidden">
                <iframe
                  title="Carte Prima Center - Zone 4 Marcory"
                  src="https://maps.google.com/maps?q=5.295272,-3.983574&z=15&output=embed&hl=fr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Texte explicatif à droite - Ogg Roman (titres) + Sofia Pro (corps) - page Contact */}
            <div className="space-y-6 font-sofia">
              <div>
                <h3 className="text-sm font-ogg font-medium text-gray-600 uppercase tracking-wider mb-4">NOTRE POSITION</h3>
                <h2 className="text-4xl md:text-5xl font-ogg font-bold text-black mb-6">
                  <span className="block">ZONE 4</span>
                  <span className="block">MARCORY</span>
                </h2>
                <div className="w-16 h-0.5 bg-black mb-6"></div>
              </div>
              
              <p className="text-gray-700 text-lg leading-relaxed font-sofia">
                Situé au cœur de la Zone 4 à Marcory, le Prima Center vous accueille dans un emplacement stratégique et facilement accessible. 
                Notre centre commercial est entouré des principales artères de la ville, offrant une expérience shopping unique 
                dans un cadre moderne et convivial.
              </p>

              <div className="space-y-3 pt-4 font-sofia">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-gray-600">Proche de l'aéroport Félix Houphouët-Boigny</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-gray-600">Accès direct depuis le Boulevard de la République</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-gray-600">Parking sécurisé disponible</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section - pleine largeur */}
      <section className="py-20 bg-white w-full">
        <div className="content-wrap">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
            >
              {/* Texte à gauche */}
              <div className="space-y-2">
                <div className="w-full">
                  <h2 className="text-2xl font-ogg text-black">
                    <span className="block">Restez</span>
                    <span className="block">informé</span>
                  </h2>
                  <div className="w-full h-0.5 bg-black mt-2"></div>
                </div>
                <p className="text-gray-500 text-sm">
                  Recevez les dernières actualités, événements et offres exclusives
                </p>
              </div>

              {/* Formulaire à droite */}
              <form className="flex items-center space-x-4 w-full md:w-auto">
                <div className="relative flex-1 md:min-w-[300px]">
                  <input
                    type="email"
                    placeholder="Entrez votre adresse email*"
                    className="w-full bg-transparent border-0 border-b border-gray-300 focus:border-black focus:outline-none py-2 text-gray-500 placeholder-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
} 