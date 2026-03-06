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
      <div className="content-wrap py-6 md:py-8">
        {/* Grille 6 colonnes : alignement compact type référence */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] lg:gap-x-4 xl:gap-x-6 gap-6 lg:items-start pr-20 pb-6 sm:pr-24 sm:pb-6 lg:pr-0">
          {/* BOUTIQUES */}
          <div className="flex flex-col">
            <Link to="/boutiques" onClick={scrollToTop} className="text-xs md:text-sm font-sofia font-bold mb-2 text-white uppercase hover:opacity-90 transition-opacity w-fit tracking-wide">
              BOUTIQUES
            </Link>
            <div className="space-y-1 text-gray-300 font-sofia text-xs md:text-sm">
              <p>Mode femme</p>
              <p>Mode homme</p>
              <p>Mode enfant</p>
              <p>Chaussures, sacs & maroquinerie</p>
              <p>Bijoux & accessoires</p>
              <p>Beauté & soins</p>
              <p>Technologie</p>
              <p>Maison & cadeaux</p>
            </div>
          </div>

          {/* RESTAURANTS */}
          <div className="flex flex-col">
            <Link to="/restaurants" onClick={scrollToTop} className="text-xs md:text-sm font-sofia font-bold mb-2 text-white uppercase hover:opacity-90 transition-opacity w-fit tracking-wide">
              RESTAURANTS
            </Link>
            <div className="space-y-1 text-gray-300 font-sofia text-xs md:text-sm">
              <p>Beyti</p>
              <p>Di Napoli</p>
              <p>Dipndip</p>
              <p>La Brioche</p>
              <p>Pistache & Chocolat</p>
              <p>Poz' Café</p>
              <p>Smöoy</p>
              <p>Velvet</p>
            </div>
          </div>

          {/* HORAIRES 7j/7 */}
          <div className="flex flex-col">
            <Link to="/contact" onClick={scrollToTop} className="text-xs md:text-sm font-sofia font-bold mb-2 text-white uppercase hover:opacity-90 transition-opacity w-fit tracking-wide">
              HORAIRES 7j/7
            </Link>
            <div className="space-y-1 text-gray-300 font-sofia text-xs md:text-sm">
              <p>Galerie : 09h00 – 20h00</p>
              <p>Restaurants & cinéma : 09h00 – 00h00</p>
              <p>Hypermarché : 08h30 – 23h00</p>
              <p className="text-gray-400 text-xs mt-1.5">Les horaires peuvent varier selon les enseignes.</p>
            </div>
          </div>

          {/* DÉCOUVRIR */}
          <div className="flex flex-col">
            <Link to="/" onClick={scrollToTop} className="text-xs md:text-sm font-sofia font-bold mb-2 text-white uppercase hover:opacity-90 transition-opacity w-fit tracking-wide">
              DÉCOUVRIR
            </Link>
            <div className="space-y-1 text-gray-300 font-sofia text-xs md:text-sm">
              <Link to="/boutiques" className="block hover:text-white transition-colors">Boutiques</Link>
              <Link to="/restaurants" className="block hover:text-white transition-colors">Restaurants</Link>
              <Link to="/loisirs" className="block hover:text-white transition-colors">Loisirs</Link>
              <Link to="/services" className="block hover:text-white transition-colors">Services</Link>
              <Link to="/evenements" className="block hover:text-white transition-colors">Actus & Events</Link>
            </div>
          </div>

          {/* CONTACT */}
          <div className="flex flex-col">
            <Link to="/contact" onClick={scrollToTop} className="text-xs md:text-sm font-sofia font-bold mb-2 text-white uppercase hover:opacity-90 transition-opacity w-fit tracking-wide">
              CONTACT
            </Link>
            <div className="space-y-1 text-gray-300 font-sofia text-xs md:text-sm">
              <p className="font-ogg font-semibold text-white text-xs md:text-sm">PRIMA CENTER</p>
              <p>Marcory Zone 4 – Abidjan</p>
              <a href="mailto:primacenterabidjan@gmail.com" className="hover:text-white transition-colors">primacenterabidjan@gmail.com</a>
            </div>
            {/* Mobile : icônes en colonne + logo */}
            <div className="lg:hidden flex flex-row items-end justify-between gap-3 mt-3 w-full">
              <div className="flex flex-col gap-2 flex-shrink-0 items-center">
                <a
                  href="https://www.facebook.com/PrimaCenter225"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent border border-white/80 hover:border-white hover:shadow-[0_0_10px_rgba(255,255,255,0.6)] transition-all duration-200"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 text-white" />
                </a>
                <a
                  href="https://www.instagram.com/primacenter_marcory/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent border border-white/80 hover:border-white hover:shadow-[0_0_10px_rgba(255,255,255,0.6)] transition-all duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 text-white" />
                </a>
                <a
                  href="https://www.tiktok.com/@prima.center"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent border border-white/80 hover:border-white hover:shadow-[0_0_10px_rgba(255,255,255,0.6)] transition-all duration-200"
                  aria-label="TikTok"
                >
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0011.14-4.02v-7a8.16 8.16 0 004.65 1.48V7.1a4.79 4.79 0 01-1.2-.41z" />
                  </svg>
                </a>
              </div>
              <Link to="/" className="flex-shrink-0" onClick={scrollToTop}>
                <img
                  src="/images/logo%20blanc.jpeg"
                  alt="Prima Center"
                  className="h-28 sm:h-32 md:h-36 w-auto object-contain object-right"
                />
              </Link>
            </div>
          </div>

          {/* 6e colonne desktop : icônes alignées en haut avec CONTACT, logo en dessous */}
          <div className="hidden lg:flex flex-col items-end justify-start gap-3 footer-icons-logo-wrap lg:self-start">
            <div className="flex flex-col gap-2 items-center">
              <a
                href="https://www.facebook.com/PrimaCenter225"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent border border-white/80 hover:border-white hover:shadow-[0_0_10px_rgba(255,255,255,0.6)] transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://www.instagram.com/primacenter_marcory/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent border border-white/80 hover:border-white hover:shadow-[0_0_10px_rgba(255,255,255,0.6)] transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://www.tiktok.com/@prima.center"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent border border-white/80 hover:border-white hover:shadow-[0_0_10px_rgba(255,255,255,0.6)] transition-all duration-200"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0011.14-4.02v-7a8.16 8.16 0 004.65 1.48V7.1a4.79 4.79 0 01-1.2-.41z" />
                </svg>
              </a>
            </div>
            <Link to="/" className="inline-block flex-shrink-0" onClick={scrollToTop}>
              <img
                src="/images/logo%20blanc.jpeg"
                alt="Prima Center"
                className="h-28 lg:h-32 xl:h-36 w-auto object-contain object-right"
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white w-full" />

      <div className="bg-black w-full">
        <div className="content-wrap py-4 md:py-5">
          <p className="font-sofia text-white text-center text-xs md:text-sm">© 2025 Prima Center.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;