import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Zap,
  Accessibility,
  Banknote,
  Store,
  Shirt,
  Navigation
} from 'lucide-react';

/** Lien Google Maps : ouvrir l’itinéraire vers Prima Center (Zone 4 Marcory) */
const MAPS_PLACE_URL = 'https://www.google.com/maps/place/Prima+Center/@5.2952773,-3.9861489,17z/data=!3m1!4b1!4m6!3m5!1s0xfc1eeaa2fb3afbf:0x1456a227925d7ee3!8m2!3d5.295272!4d-3.983574!16s%2Fg%2F1hf2nj89n?entry=ttu';

export default function ServicesInfo() {
  const services = [
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Paiement",
      description: "Tous types de paiements acceptés",
      color: "bg-[#e7e4dd]"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Bornes de recharge",
      description: "Bornes pour véhicules électriques",
      color: "bg-[#d4d1ca]"
    },
    {
      icon: <Accessibility className="w-8 h-8" />,
      title: "Accessibilité",
      description: "Accessible aux personnes à mobilité réduite",
      color: "bg-[#e7e4dd]"
    },
    {
      icon: <Banknote className="w-8 h-8" />,
      title: "Services bancaires",
      description: "Banques, distributeurs automatiques et bureau de change",
      color: "bg-[#d4d1ca]"
    },
    {
      icon: <Store className="w-8 h-8" />,
      title: "Services du quotidien",
      description: "Hypermarché, pharmacie et centre médical",
      color: "bg-[#e7e4dd]"
    },
    {
      icon: <Shirt className="w-8 h-8" />,
      title: "Pressing",
      description: "Service de pressing disponible",
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
      info: "communicationprimacenter@gmail.com"
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
        <div className="absolute bottom-6 left-0 right-0 content-wrap">
          <h1 className="text-[32px] sm:text-[38px] md:text-[46px] lg:text-[54px] font-ogg font-semibold text-white leading-tight tracking-wide drop-shadow-sm [-webkit-font-smoothing:antialiased]">
            Infos pratiques
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
            {/* Carte Google Maps : clic ouvre Prima Center sur Maps (contourne l'erreur "Impossible de charger...") */}
            <div className="h-[400px] md:h-[500px] w-full overflow-hidden rounded-lg shadow-lg bg-[#f5f3ef] p-2 md:p-3">
              <div className="relative w-full h-full rounded-md overflow-hidden group">
                <iframe
                  title="Carte Prima Center - Zone 4 Marcory"
                  src="https://www.google.com/maps?q=5.295272,-3.983574&z=17&output=embed&hl=fr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full pointer-events-none"
                />
                <a
                  href={MAPS_PLACE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-auto cursor-pointer"
                  aria-label="Ouvrir Prima Center sur Google Maps"
                >
                  <span className="px-4 py-2 bg-white text-black font-sofia text-sm font-medium shadow-lg border border-gray-200">
                    Ouvrir dans Maps
                  </span>
                </a>
              </div>
            </div>

            {/* Texte explicatif à droite - Ogg Roman (titres) + Sofia Pro (corps) - page Contact */}
            <div className="space-y-6 font-sofia">
              <div>
                <p className="text-xs md:text-sm font-ogg uppercase tracking-widest text-gray-500 mb-2">
                  Notre position
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-ogg font-bold text-black uppercase tracking-tight leading-tight">
                  Zone 4
                </h2>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-ogg font-bold text-black uppercase tracking-tight leading-tight">
                  Marcory
                </h2>
                <div className="w-16 h-0.5 bg-black mt-2 mb-4"></div>
                <a
                  href={MAPS_PLACE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white font-sofia text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Obtenir l'itinéraire
                </a>
              </div>
              
              <p className="text-gray-700 text-lg leading-relaxed font-sofia">
                Situé au cœur de la Zone 4 à Marcory, PRIMA CENTER bénéficie d'un emplacement privilégié et facilement accessible. 
                La galerie s'inscrit dans l'un des quartiers les plus dynamiques d'Abidjan et réunit boutiques, restaurants, loisirs et services 
                dans un cadre moderne et convivial.
              </p>

              <div className="space-y-3 pt-4 font-sofia">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-gray-600">À quelques minutes de l'aéroport international Félix Houphouët-Boigny</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-gray-600">Accès direct depuis les principaux axes de Marcory</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-gray-600">Parking extérieur disponible pour les visiteurs</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
} 