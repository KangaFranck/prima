import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Leaf } from 'lucide-react';
import Logo from '../components/Logo';
import Stats from '../components/Stats';

const APropos = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white antialiased w-full max-w-full min-w-0 overflow-x-hidden"
    >
      {/* Section Notre Histoire */}
      <section className="py-16 md:py-24 bg-white w-full">
        <div className="content-wrap">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-ogg mb-6">Notre Histoire</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Situé à Marcory, au cœur de la Zone 4, PRIMA CENTER est l'une des galeries commerciales emblématiques d'Abidjan. Depuis 1998, le centre réunit visiteurs et enseignes dans un lieu dédié au shopping, à la restauration, aux loisirs et aux services du quotidien.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Au fil des années, PRIMA CENTER est devenu une adresse incontournable où se mêlent commerce, détente et convivialité. Grâce à une offre variée de boutiques, restaurants, espaces de loisirs et services, le centre propose une expérience complète à ses visiteurs.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Pensé comme un véritable lieu de vie, PRIMA CENTER accueille chaque jour visiteurs et habitués dans un environnement animé et convivial.
              </p>
            </motion.div>
            {/* Bloc image rectangulaire paysage (largeur > hauteur) 16:9 — dimensions : 1920×1080 ou 1600×900 px */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[16/9] overflow-hidden shadow-xl bg-[#E5DDD3]"
            >
              <img 
                src="/images/NOTRE HISTOIRE IMG.png"
                alt="PRIMA CENTER"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Chiffres Clés */}
      <section className="py-16 md:py-24">
        <Stats />
      </section>

      {/* Section L'Expérience PRIMA CENTER */}
      <section className="py-16 md:py-24 bg-[#E5DDD3]/10 w-full">
        <div className="content-wrap">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            L'Expérience PRIMA CENTER
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#efece6] p-8 shadow-lg"
            >
              <div className="flex justify-center mb-6">
                <Trophy className="w-14 h-14 text-[#b8a898] stroke-[1.2]" strokeWidth={1.2} aria-hidden />
              </div>
              <h3 className="text-xl font-bold mb-4">Accueil & Expérience</h3>
              <p className="text-gray-600">
                PRIMA CENTER accorde une attention particulière à l'accueil et au confort de ses visiteurs afin d'offrir une expérience agréable à chaque passage.
              </p>
            </motion.div>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-[#efece6] p-8 shadow-lg"
            >
              <div className="flex justify-center mb-6">
                <Users className="w-14 h-14 text-[#b8a898] stroke-[1.2]" strokeWidth={1.2} aria-hidden />
              </div>
              <h3 className="text-xl font-bold mb-4">Service & Satisfaction</h3>
              <p className="text-gray-600">
                La satisfaction de notre clientèle est au cœur de nos priorités. Nous mettons tout en œuvre pour offrir un environnement agréable et des services de qualité.
              </p>
            </motion.div>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="bg-[#efece6] p-8 shadow-lg"
            >
              <div className="flex justify-center mb-6">
                <Leaf className="w-14 h-14 text-[#b8a898] stroke-[1.2]" strokeWidth={1.2} aria-hidden />
              </div>
              <h3 className="text-xl font-bold mb-4">Une Galerie Animée</h3>
              <p className="text-gray-600">
                Tout au long de l'année, PRIMA CENTER se transforme au rythme des grandes fêtes avec des décorations et des animations qui créent une atmosphère chaleureuse.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

    </motion.div>
  );
};

export default APropos; 
