import React, { createContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, TiktokIcon } from 'lucide-react';

export const TopInfoBarContext = createContext(true);

export default function TopInfoBar() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <TopInfoBarContext.Provider value={isVisible}>
      <div 
        className="fixed w-full bg-black text-white z-50"
        style={{
          transform: `translateY(${isVisible ? '0' : '-100%'})`,
          transition: 'transform 0.3s ease'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="h-10 flex items-center justify-between">
            <div className="text-sm pl-[var(--header-content-start)]">
              Ouvert 7J/7 de 09h00 – 00h00
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="https://facebook.com/primacenter" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-[#e7e4dd] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com/primacenter" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-[#e7e4dd] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://tiktok.com/@primacenter" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-[#e7e4dd] transition-colors"
              >
                <svg 
                  className="w-4 h-4" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0011.14-4.02v-7a8.16 8.16 0 004.65 1.48V7.1a4.79 4.79 0 01-1.2-.41z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </TopInfoBarContext.Provider>
  );
} 