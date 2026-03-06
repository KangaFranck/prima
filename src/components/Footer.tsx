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
      <div className="content-wrap py-10 md:py-12 relative">
        <div className="flex flex-col lg:grid lg:grid-cols-5 lg:gap-x-8 xl:gap-x-12 gap-10 lg:items-start pr-24 pb-8 sm:pr-28 sm:pb-10 lg:pr-64 lg:pb-0 xl:pr-72">
          {/* BOUTIQUES */}
          <div className="flex flex-col">
            <Link to="/boutiques" onClick={scrollToTop} className="text-base md:text-lg lg:text-xl font-sofia font-bold mb-3 md:mb-4 text-white uppercase hover:opacity-90 transition-opacity w-fit">
              BOUTIQUES
            </Link>
            <div className="space-y-1.5 md:space-y-2 text-gray-300 font-sofia text-base md:text-lg">
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
            <Link to="/restaurants" onClick={scrollToTop} className="text-base md:text-lg lg:text-xl font-sofia font-bold mb-3 md:mb-4 text-white uppercase hover:opacity-90 transition-opacity w-fit">
              RESTAURANTS
            </Link>
            <div className="space-y-1.5 md:space-y-2 text-gray-300 font-sofia text-base md:text-lg">
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
            <Link to="/contact" onClick={scrollToTop} className="text-base md:text-lg lg:text-xl font-sofia font-bold mb-3 md:mb-4 text-white uppercase hover:opacity-90 transition-opacity w-fit">
              HORAIRES 7j/7
            </Link>
            <div className="space-y-1.5 md:space-y-2 text-gray-300 font-sofia text-base md:text-lg">
              <p>Galerie : 09h00 – 20h00</p>
              <p>Restaurants & cinéma : 09h00 – 00h00</p>
              <p>Hypermarché : 08h30 – 23h00</p>
              <p className="text-gray-400 text-sm md:text-base mt-2">Les horaires peuvent varier selon les enseignes.</p>
            </div>
          </div>

          {/* DÉCOUVRIR */}
          <div className="flex flex-col">
            <Link to="/" onClick={scrollToTop} className="text-base md:text-lg lg:text-xl font-sofia font-bold mb-3 md:mb-4 text-white uppercase hover:opacity-90 transition-opacity w-fit">
              DÉCOUVRIR
            </Link>
            <div className="space-y-1.5 md:space-y-2 text-gray-300 font-sofia text-base md:text-lg">
              <Link to="/boutiques" className="block hover:text-white transition-colors">Boutiques</Link>
              <Link to="/restaurants" className="block hover:text-white transition-colors">Restaurants</Link>
              <Link to="/loisirs" className="block hover:text-white transition-colors">Loisirs</Link>
              <Link to="/services" className="block hover:text-white transition-colors">Services</Link>
              <Link to="/evenements" className="block hover:text-white transition-colors">Actus & Events</Link>
            </div>
          </div>

          {/* CONTACT : colonne dédiée, indépendante — le texte ne dépend pas des icônes/logo */}
          <div className="flex flex-col">
            <Link to="/contact" onClick={scrollToTop} className="text-base md:text-lg lg:text-xl font-sofia font-bold mb-3 md:mb-4 text-white uppercase hover:opacity-90 transition-opacity w-fit">
              CONTACT
            </Link>
            <div className="space-y-1.5 md:space-y-2 text-gray-300 font-sofia text-base md:text-lg">
              <p className="font-ogg font-semibold text-white">PRIMA CENTER</p>
              <p>Marcory Zone 4 – Abidjan</p>
              <a href="mailto:primacenterabidjan@gmail.com" className="hover:text-white transition-colors">primacenterabidjan@gmail.com</a>
            </div>
            {/* Mobile uniquement : comme l'exemple — icônes à gauche (empilées), logo à droite sur la même ligne */}
            <div className="lg:hidden flex flex-row items-end justify-between gap-4 mt-4 w-full">
              <div className="flex flex-col gap-4 flex-shrink-0">
                <a
                  href="https://www.facebook.com/PrimaCenter225"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent border border-white hover:border-white hover:shadow-[0_0_14px_rgba(255,255,255,0.9)] transition-all duration-200"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://www.instagram.com/primacenter_marcory/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent border border-white hover:border-white hover:shadow-[0_0_14px_rgba(255,255,255,0.9)] transition-all duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://www.tiktok.com/@prima.center"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent border border-white hover:border-white hover:shadow-[0_0_14px_rgba(255,255,255,0.9)] transition-all duration-200"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0011.14-4.02v-7a8.16 8.16 0 004.65 1.48V7.1a4.79 4.79 0 01-1.2-.41z" />
                  </svg>
                </a>
              </div>
              <Link to="/" className="flex-shrink-0" onClick={scrollToTop}>
                <img
                  src="/images/logo%20blanc.jpeg"
                  alt="Prima Center"
                  className="h-40 sm:h-48 md:h-52 w-auto object-contain object-right"
                />
              </Link>
            </div>
          </div>

        {/* Icônes + logo : desktop uniquement, position absolue, respectent la marge droite universelle */}
        <div className="max-lg:hidden footer-icons-logo-wrap absolute right-0 bottom-6 flex flex-col items-end justify-end gap-4 z-10 pointer-events-none">
          <div className="flex flex-col gap-4 pointer-events-auto">
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
          <Link to="/" className="inline-block flex-shrink-0 pointer-events-auto" onClick={scrollToTop}>
            <img
              src="/images/logo%20blanc.jpeg"
              alt="Prima Center"
              className="h-36 sm:h-44 md:h-48 lg:h-52 xl:h-64 2xl:h-72 w-auto object-contain object-right"
            />
          </Link>
        </div>
        </div>
      </div>

      <div className="border-t border-white w-full" />

      <div className="bg-black w-full">
        <div className="content-wrap py-6 md:py-7">
          <p className="font-sofia text-white text-center text-base md:text-lg">© 2025 Prima Center.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;