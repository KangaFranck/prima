import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '../services/apiClient';

/**
 * Bannière newsletter affichée au-dessus du footer sur toutes les pages.
 * Modèle type BHS Roundup : titre deux tons, description grise, input souligné, flèche.
 * Enregistre les inscriptions via POST /api/newsletter.
 */
const NewsletterBanner = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await apiClient.newsletter.subscribe(trimmed);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-16 pb-10 md:pt-20 md:pb-12 bg-white w-full">
      <div className="content-wrap">
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: '-50px' }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-10 md:gap-16"
          >
            {/* Bloc gauche : titre sans soulignement + description (rendu type BHS) */}
            <div className="space-y-1.5 flex-shrink-0 md:max-w-[48%] overflow-visible">
              <h2 className="font-ogg text-2xl md:text-3xl lg:text-4xl tracking-tight leading-snug overflow-visible">
                <span className="text-black uppercase">LES ACTUALITÉS </span>
                <span className="text-gray-400 font-sofia font-normal text-xl md:text-2xl lg:text-3xl normal-case">Prima Center</span>
              </h2>
              <p className="text-gray-400 text-sm md:text-base font-sofia leading-relaxed max-w-md">
                Recevez en avant-première les événements, nouveautés et actualités de la galerie.
              </p>
            </div>

            {/* Bloc droit : une seule ligne horizontale sous input + flèche (comme référence) */}
            <form onSubmit={handleSubmit} className="flex flex-col w-full md:w-auto md:flex-1 md:max-w-sm md:min-w-[280px] gap-1 mt-4 md:mt-0">
              <div className="flex items-end flex-1 min-w-0 border-b border-gray-300 focus-within:border-gray-500 transition-colors">
                <input
                  type="email"
                  placeholder="Votre adresse e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="flex-1 min-w-0 bg-transparent border-0 py-2 pr-1 text-gray-500 placeholder-gray-400 focus:outline-none font-sofia text-sm md:text-base disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-shrink-0 pb-2.5 pl-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-60"
                  aria-label="S'inscrire à la newsletter"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
              {success && <p className="text-sm text-green-600 font-sofia">Inscription enregistrée. Merci !</p>}
              {error && <p className="text-sm text-red-600 font-sofia">{error}</p>}
            </form>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterBanner;
