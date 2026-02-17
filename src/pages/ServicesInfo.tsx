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
    <div className="min-h-screen bg-white antialiased">
      {/* Hero Section avec ajustement pour la navbar */}
      <section className="relative h-[75vh] mt-[76px] overflow-hidden flex items-center justify-center will-change-transform">
        <img 
          src="/images/electronique.jpg"
          alt="Services et Informations"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-filter">
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4 py-20">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-[45px] sm:text-[60px] md:text-[75px] lg:text-[90px] font-sofia font-extralight text-white leading-[0.9] tracking-wider uppercase mb-4 [-webkit-font-smoothing:antialiased] [text-rendering:optimizeLegibility]"
            >
              Services & Informations
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] font-sofia font-extralight text-white [-webkit-font-smoothing:antialiased]"
            >
              Tout ce dont vous avez besoin pour votre visite
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
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

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            {/* Carte à gauche */}
            <div className="h-[500px] bg-gray-200 overflow-hidden">
              {/* Intégrez ici votre carte Google Maps ou autre */}
              <div className="w-full h-full bg-gray-300" />
            </div>

            {/* Texte explicatif à droite */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-4">NOTRE POSITION</h3>
                <h2 className="text-4xl md:text-5xl font-ogg font-bold text-black mb-6">
                  <span className="block">ZONE 4</span>
                  <span className="block">MARCORY</span>
                </h2>
                <div className="w-16 h-0.5 bg-black mb-6"></div>
              </div>
              
              <p className="text-gray-700 text-lg leading-relaxed">
                Situé au cœur de la Zone 4 à Marcory, le Prima Center vous accueille dans un emplacement stratégique et facilement accessible. 
                Notre centre commercial est entouré des principales artères de la ville, offrant une expérience shopping unique 
                dans un cadre moderne et convivial.
              </p>

              <div className="space-y-3 pt-4">
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

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
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