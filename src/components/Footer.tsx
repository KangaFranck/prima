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
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:gap-x-8 xl:gap-x-12 gap-10">
          {/* BOUTIQUES */}
          <div className="flex flex-col">
            <h3 className="text-sm md:text-lg font-sofia font-bold mb-3 md:mb-4 text-white uppercase">
              BOUTIQUES
            </h3>
            <div className="space-y-1.5 md:space-y-2 text-gray-300 font-sofia text-sm md:text-base">
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
            <h3 className="text-sm md:text-lg font-sofia font-bold mb-3 md:mb-4 text-white uppercase">
              RESTAURANTS
            </h3>
            <div className="space-y-1.5 md:space-y-2 text-gray-300 font-sofia text-sm md:text-base">
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
            <h3 className="text-sm md:text-lg font-sofia font-bold mb-3 md:mb-4 text-white uppercase">
              HORAIRES 7j/7
            </h3>
            <div className="space-y-1.5 md:space-y-2 text-gray-300 font-sofia text-sm md:text-base">
              <p>Galerie : 09h00 – 20h00</p>
              <p>Restaurants & cinéma : 09h00 – 00h00</p>
              <p>Hypermarché : 08h30 – 23h00</p>
              <p className="text-gray-400 text-xs md:text-sm mt-2">Les horaires peuvent varier selon les enseignes.</p>
            </div>
          </div>

          {/* DÉCOUVRIR */}
          <div className="flex flex-col">
            <h3 className="text-sm md:text-lg font-sofia font-bold mb-3 md:mb-4 text-white uppercase">
              DÉCOUVRIR
            </h3>
            <div className="space-y-1.5 md:space-y-2 text-gray-300 font-sofia text-sm md:text-base">
              <Link to="/boutiques" className="block hover:text-white transition-colors">Boutiques</Link>
              <Link to="/restaurants" className="block hover:text-white transition-colors">Restaurants</Link>
              <Link to="/loisirs" className="block hover:text-white transition-colors">Loisirs</Link>
              <Link to="/services" className="block hover:text-white transition-colors">Services</Link>
              <Link to="/evenements" className="block hover:text-white transition-colors">Actus & Events</Link>
            </div>
          </div>

          {/* CONTACT + icônes + logo à côté (desktop) ; CONTACT aligné en haut comme les autres colonnes */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex flex-col">
              <h3 className="text-sm md:text-lg font-sofia font-bold mb-3 md:mb-4 text-white uppercase">
                CONTACT
              </h3>
              <div className="space-y-1.5 md:space-y-2 text-gray-300 font-sofia text-sm md:text-base">
                <p className="font-ogg font-semibold text-white">PRIMA CENTER</p>
                <p>Marcory Zone 4 – Abidjan</p>
                <a href="mailto:primacenterabidjan@gmail.com" className="hover:text-white transition-colors">primacenterabidjan@gmail.com</a>
              </div>
            </div>
            {/* Desktop : icônes et logo à droite, position actuelle maintenue (mt-auto = restent en bas) */}
            <div className="hidden lg:flex flex-col items-end flex-shrink-0 lg:mt-auto">
              <div className="flex flex-col gap-4 flex-shrink-0">
                <a
                  href="https://www.facebook.com/PrimaCenter225"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent border border-white hover:border-white hover:shadow-[0_0_14px_rgba(255,255,255,0.9)] transition-all duration-200"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </a>
                <a
                  href="https://www.instagram.com/primacenter_marcory/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent border border-white hover:border-white hover:shadow-[0_0_14px_rgba(255,255,255,0.9)] transition-all duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </a>
                <a
                  href="https://www.tiktok.com/@prima.center"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent border border-white hover:border-white hover:shadow-[0_0_14px_rgba(255,255,255,0.9)] transition-all duration-200"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0011.14-4.02v-7a8.16 8.16 0 004.65 1.48V7.1a4.79 4.79 0 01-1.2-.41z" />
                  </svg>
                </a>
              </div>
              <Link to="/" className="inline-block flex-shrink-0 mt-6" onClick={scrollToTop}>
                <img
                  src="/images/logo%20blanc.jpeg"
                  alt="Prima Center"
                  className="h-48 lg:h-56 xl:h-72 2xl:h-80 w-auto object-contain object-right"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile uniquement : ligne pleine largeur, logo à l'extrême droite (point orange) */}
      <div className="footer-logo-row lg:hidden flex flex-row items-center pt-6 pb-2 md:pt-8 md:pb-4">
        <div className="flex flex-col gap-4 flex-shrink-0">
          <a
            href="https://www.facebook.com/PrimaCenter225"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent border border-white hover:border-white hover:shadow-[0_0_14px_rgba(255,255,255,0.9)] transition-all duration-200"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </a>
          <a
            href="https://www.instagram.com/primacenter_marcory/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent border border-white hover:border-white hover:shadow-[0_0_14px_rgba(255,255,255,0.9)] transition-all duration-200"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </a>
          <a
            href="https://www.tiktok.com/@prima.center"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent border border-white hover:border-white hover:shadow-[0_0_14px_rgba(255,255,255,0.9)] transition-all duration-200"
            aria-label="TikTok"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0011.14-4.02v-7a8.16 8.16 0 004.65 1.48V7.1a4.79 4.79 0 01-1.2-.41z" />
            </svg>
          </a>
        </div>
        <Link to="/" className="inline-block flex-shrink-0 ml-auto mr-0" onClick={scrollToTop}>
          <img
            src="/images/logo%20blanc.jpeg"
            alt="Prima Center"
            className="h-40 sm:h-48 md:h-52 w-auto object-contain object-right"
          />
        </Link>
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