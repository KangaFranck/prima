import React from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

// Footer component with contact information and social links
const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex justify-between items-start">
          {/* Colonnes à l'extrême gauche */}
          <div className="flex gap-16">
            {/* Colonne MAGASINS */}
            <div className="flex flex-col">
              <h3 className="text-xl font-neue font-bold mb-4 text-white uppercase border-b border-white pb-2">
                MAGASINS
              </h3>
              <div className="space-y-2 text-gray-300 font-neue">
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

            {/* Colonnes HORAIRE et CONTACT empilées */}
            <div className="flex flex-col gap-8">
              {/* Colonne HORAIRE */}
              <div className="flex flex-col">
                <h3 className="text-xl font-neue font-bold mb-4 text-white uppercase border-b border-white pb-2">
                  HORAIRE
                </h3>
                <div className="space-y-2 text-gray-300 font-neue">
                  <p>du lundi au dimanche</p>
                  <p>ouvert de 9h00 à 00h00</p>
                </div>
              </div>

              {/* Colonne CONTACT */}
              <div className="flex flex-col">
                <h3 className="text-xl font-neue font-bold mb-4 text-white uppercase border-b border-white pb-2">
                  CONTACT
                </h3>
                <div className="space-y-2 text-gray-300 font-neue">
                  <p>info@primacenter.ci</p>
                  <p>+225 07 88 00 80</p>
                  <p>Marcory Zone 4, Abidjan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Icônes sociales dans des cercles noirs à l'extrême droite */}
          <div className="flex flex-col space-y-4">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-black border-2 border-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <Facebook className="w-6 h-6 text-white" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-black border-2 border-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <Instagram className="w-6 h-6 text-white" />
            </a>
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-black border-2 border-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <svg 
                className="w-6 h-6 text-white" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0011.14-4.02v-7a8.16 8.16 0 004.65 1.48V7.1a4.79 4.79 0 01-1.2-.41z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      {/* Séparateur blanc */}
      <div className="border-t border-white"></div>
      
      {/* Copyright */}
      <div className="bg-black w-full">
        <div className="max-w-7xl mx-auto py-6">
          <p className="font-neue text-white text-center">© 2025 Prima Center.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;