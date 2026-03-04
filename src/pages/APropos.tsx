import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Trophy, Leaf, ShoppingBag, Clock, MapPin, Phone } from 'lucide-react';
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
      <section className="py-16 md:py-24 bg-[#FFFEF2] w-full">
        <div className="content-wrap">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-ogg mb-6">Notre Histoire</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Depuis son inauguration, Prima Center s'est imposé comme la référence en matière de shopping et de divertissement à Abidjan. Notre centre commercial allie architecture moderne, confort et excellence pour offrir une expérience unique à nos visiteurs.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Situé au cœur de la ville, Prima Center est bien plus qu'un simple centre commercial : c'est un lieu de vie, de rencontres et d'échanges qui participe activement au dynamisme économique de la région.
              </p>
            </motion.div>
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[400px] overflow-hidden shadow-xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?ixlib=rb-4.0.3"
                alt="Prima Center"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Chiffres Clés */}
      <section className="py-16 md:py-24">
        <Stats />
      </section>

      {/* Section Nos Valeurs */}
      <section className="py-16 md:py-24 bg-[#E5DDD3]/10 w-full">
        <div className="content-wrap">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Nos Valeurs
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 shadow-lg"
            >
              <Trophy className="w-12 h-12 mb-6 text-[#E5DDD3]" />
              <h3 className="text-xl font-bold mb-4">Excellence</h3>
              <p className="text-gray-600">
                Nous nous engageons à maintenir les plus hauts standards de qualité dans tous nos services et à offrir une expérience shopping exceptionnelle.
              </p>
            </motion.div>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white p-8 shadow-lg"
            >
              <Users className="w-12 h-12 mb-6 text-[#E5DDD3]" />
              <h3 className="text-xl font-bold mb-4">Service Client</h3>
              <p className="text-gray-600">
                La satisfaction de notre clientèle est notre priorité. Nous mettons tout en œuvre pour répondre à vos besoins et attentes.
              </p>
            </motion.div>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="bg-white p-8 shadow-lg"
            >
              <Leaf className="w-12 h-12 mb-6 text-[#E5DDD3]" />
              <h3 className="text-xl font-bold mb-4">Développement Durable</h3>
              <p className="text-gray-600">
                Nous nous engageons pour un avenir plus vert avec des initiatives écologiques et une gestion responsable de nos ressources.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

    </motion.div>
  );
};

export default APropos; 