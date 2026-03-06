import React from 'react';
import { motion } from 'framer-motion';

/**
 * Bannière newsletter affichée au-dessus du footer sur toutes les pages.
 * Modèle type BHS Roundup : titre deux tons, description grise, input souligné, flèche.
 */
const NewsletterBanner = () => {
  return (
    <section className="pt-10 pb-6 md:pt-12 md:pb-8 bg-white w-full">
      <div className="content-wrap">
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: '-50px' }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-10 md:gap-16"
          >
            {/* Bloc gauche : titre sans soulignement + description (rendu type BHS) */}
            <div className="space-y-1.5 flex-shrink-0 md:max-w-[48%]">
              <h2 className="font-ogg text-2xl md:text-3xl lg:text-4xl tracking-tight leading-tight">
                <span className="text-black uppercase"> Les actualités </span>
                <span className="text-gray-400 font-sofia font-normal text-xl md:text-2xl lg:text-3xl normal-case">Prima Center</span>
              </h2>
              <p className="text-gray-400 text-sm md:text-base font-sofia leading-relaxed max-w-md">
                Recevez en avant-première les événements, nouveautés et actualités de la galerie.
              </p>
            </div>

            {/* Bloc droit : une seule ligne horizontale sous input + flèche (comme référence) */}
            <form className="flex w-full md:w-auto md:flex-1 md:max-w-sm md:min-w-[280px]">
              <div className="flex items-end flex-1 min-w-0 border-b border-gray-300 focus-within:border-gray-500 transition-colors">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-1 min-w-0 bg-transparent border-0 py-2 pr-1 text-gray-500 placeholder-gray-400 focus:outline-none font-sofia text-sm md:text-base"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 pb-2.5 pl-1 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="S'inscrire à la newsletter"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </form>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterBanner;
