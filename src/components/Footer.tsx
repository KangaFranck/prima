import React from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

// Footer component with contact information and social links
const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-black text-white w-full">
      <div className="content-wrap py-8 md:py-10">
        {/* Grille pleine largeur : colonnes de gauche à droite + bloc icônes + logo alignés à droite */}
        <div className="flex flex-col md:grid md:grid-cols-[1fr_1fr_auto] md:gap-x-10 lg:gap-x-16 gap-8">
          {/* Colonne 1 : MAGASINS */}
          <div className="flex flex-col">
            <h3 className="text-sm md:text-xl font-sofia font-bold mb-3 md:mb-4 text-white uppercase">
              MAGASINS
            </h3>
            <div className="space-y-1.5 md:space-y-2 text-gray-300 font-sofia text-sm md:text-base">
              <p>Grands magasins spécialisés</p>
              <p>Mode féminine</p>
              <p>Mode homme / femme</p>
              <p>Mode masculine</p>
              <p>Chaussures, sacs et maroquinerie</p>
              <p>Bijoux</p>
              <p>Vêtements pour enfants</p>
              <p>Livres, cadeaux et maison</p>
              <p>Soins personnels</p>
            </div>
          </div>

          {/* Colonne 2 : HORAIRE + CONTACT */}
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col">
              <h3 className="text-sm md:text-xl font-sofia font-bold mb-3 md:mb-4 text-white uppercase">
                HORAIRE
              </h3>
              <div className="space-y-1.5 md:space-y-2 text-gray-300 font-sofia text-sm md:text-base">
                <p>du lundi au dimanche</p>
                <p>ouvert de 9h00 à 00h00</p>
              </div>
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm md:text-xl font-sofia font-bold mb-3 md:mb-4 text-white uppercase">
                CONTACT
              </h3>
              <div className="space-y-1.5 md:space-y-2 text-gray-300 font-sofia text-sm md:text-base">
                <p>info@primacenter.ci</p>
                <p>+225 07 88 00 80</p>
                <p>Marcory Zone 4, Abidjan</p>
              </div>
            </div>
          </div>

          {/* Colonne 3 : icônes et logo empilés, même alignement à droite (comme la référence) */}
          <div className="flex flex-col items-end justify-start gap-5 md:gap-6 w-full md:w-auto">
            <div className="flex flex-col gap-4 flex-shrink-0">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent border border-white hover:border-white hover:shadow-[0_0_14px_rgba(255,255,255,0.9)] focus:border-white focus:shadow-[0_0_14px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-2 focus:ring-white/60 transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent border border-white hover:border-white hover:shadow-[0_0_14px_rgba(255,255,255,0.9)] focus:border-white focus:shadow-[0_0_14px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-2 focus:ring-white/60 transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent border border-white hover:border-white hover:shadow-[0_0_14px_rgba(255,255,255,0.9)] focus:border-white focus:shadow-[0_0_14px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-2 focus:ring-white/60 transition-all duration-200"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0011.14-4.02v-7a8.16 8.16 0 004.65 1.48V7.1a4.79 4.79 0 01-1.2-.41z" />
                </svg>
              </a>
            </div>
            <Link to="/" className="inline-block flex-shrink-0" onClick={scrollToTop}>
              <img
                src="/images/logo%20blanc.jpeg"
                alt="Prima Center"
                className="h-24 md:h-28 lg:h-32 xl:h-40 w-auto object-contain object-right"
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white w-full" />

      <div className="bg-black w-full">
        <div className="content-wrap py-5 md:py-6">
          <p className="font-sofia text-white text-center text-sm md:text-base">© 2025 Prima Center.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;