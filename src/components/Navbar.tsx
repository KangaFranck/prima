/**
 * Composant Navbar - Barre de navigation principale
 * 
 * Ce composant gère la barre de navigation du site avec :
 * - Un logo à gauche
 * - Un menu de navigation au centre
 * - Une barre de recherche à droite
 * - Une version mobile avec menu hamburger
 * 
 * Il s'adapte à la visibilité de la barre d'information supérieure (TopInfoBar)
 * et se déplace automatiquement vers le haut quand celle-ci disparaît.
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { X, Search, Store, ChevronDown, Utensils, Dumbbell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { useSearch } from '../hooks/useSearch';

// Liste des univers
const universList = [
  { path: '/boutiques', label: 'Boutiques' },
  { path: '/restaurants', label: 'Restaurants' },
  { path: '/loisirs', label: 'Loisirs' },
  { path: '/services', label: 'Services' }
];

// Liste des liens de navigation
const navigationLinks = [
  { path: '/a-propos', label: 'À propos' },
  { type: 'univers', label: 'Nos univers' },
  { path: '/actualites', label: 'Actualités & Événements' },
  { path: '/contact', label: 'Infos pratiques' }
];

const Navbar = () => {
  // États locaux
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUniversOpen, setIsUniversOpen] = useState(false);
  const [isMobileUniversOpen, setIsMobileUniversOpen] = useState(false);
  const [isTopInfoBarVisible, setIsTopInfoBarVisible] = useState(true);
  
  // Hooks React Router
  const location = useLocation();
  const navigate = useNavigate();

  // Synchroniser --navbar-height sur :root pour les pages qui l’utilisent (ActusEvents, APropos) et tous navigateurs
  useEffect(() => {
    const value = isTopInfoBarVisible ? 'calc(152px + var(--safe-area-top))' : 'calc(112px + var(--safe-area-top))';
    document.documentElement.style.setProperty('--navbar-height', value);
  }, [isTopInfoBarVisible]);
  
  // Hook personnalisé pour la recherche
  const { searchQuery, setSearchQuery, results, isLoading, handleResultClick } = useSearch();

  // Gestionnaires d'événements
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
    window.location.reload();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
    if (isUniversOpen) setIsUniversOpen(false);
  };

  // Composant pour le menu déroulant des univers
  const UniversDropdown = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg py-2 mt-2 w-48 z-50 md:block"
    >
      {universList.map((univers) => (
        <Link
          key={univers.path}
          to={univers.path}
          className="block px-4 py-2 text-gray-800 hover:bg-[#F8F7F4] transition-colors text-base"
          onClick={() => setIsUniversOpen(false)}
        >
          {univers.label}
        </Link>
      ))}
    </motion.div>
  );

  // Composant pour afficher les résultats de recherche
  const SearchResults = () => (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      className="absolute top-full right-0 w-96 max-h-[80vh] bg-white rounded-lg shadow-lg overflow-y-auto border border-gray-200 mt-2 z-[60]"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            <span>Recherche en cours...</span>
          </div>
        </div>
      ) : results.length > 0 ? (
        <div className="py-2">
          {results.map((result) => {
            console.log('�� Résultat mobile:', {
              name: result.name,
              image: result.image,
              hasImage: !!result.image
            });
            
            return (
              <div
                key={result.id}
                onClick={() => {
                  handleResultClick(result);
                  setIsSearchOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-[#F8F7F4] flex items-start space-x-3 border-b border-gray-100 last:border-0 cursor-pointer group"
              >
                {/* Logo du commerce - Structure simplifiée */}
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                  {result.image && result.image !== '/images/logos/default.png' ? (
                    <img 
                      src={result.image} 
                      alt={result.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('❌ Erreur de chargement de l\'image:', result.image);
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                      onLoad={() => {
                        console.log('✅ Image chargée avec succès:', result.image);
                      }}
                    />
                  ) : null}
                  
                  {/* Icône de fallback */}
                  <div className={`w-full h-full bg-gray-200 flex items-center justify-center ${result.image && result.image !== '/images/logos/default.png' ? 'hidden' : ''}`}>
                    <Store className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
                
                <div className="flex-grow min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-medium text-gray-900 truncate">{result.name}</p>
                  </div>
                  
                  {result.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {result.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {result.universe && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {result.universe}
                      </span>
                    )}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {result.type === 'boutique' && 'Boutique'}
                      {result.type === 'restaurant' && 'Restaurant'}
                      {result.type === 'loisir' && 'Loisirs'}
                      {result.type === 'service' && 'Services'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : searchQuery.length > 0 ? (
        <div className="p-4 text-center text-gray-500">
          <div className="flex flex-col items-center space-y-2">
            <Search className="w-8 h-8 text-gray-400" />
            <p>Aucun résultat trouvé pour "{searchQuery}"</p>
            <p className="text-xs text-gray-400">Essayez avec d'autres mots-clés</p>
          </div>
        </div>
      ) : null}
    </motion.div>
  );

  // Fermer le menu déroulant quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.univers-menu') && isUniversOpen) {
        setIsUniversOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUniversOpen]);

  // Fermer le menu déroulant lors du changement de route
  useEffect(() => {
    setIsUniversOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const topInfoBarHeight = 40;
      setIsTopInfoBarVisible(scrollPosition < topInfoBarHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* En-tête fixe avec animation */}
      <motion.header 
        className="fixed left-0 right-0 w-full z-40 bg-white shadow-none transition-all duration-300 pt-[var(--safe-area-top)]"
        style={{
          '--navbar-height': isTopInfoBarVisible ? 'calc(152px + var(--safe-area-top))' : 'calc(112px + var(--safe-area-top))',
          top: isTopInfoBarVisible ? '40px' : '0px',
          width: '100%',
        } as React.CSSProperties}
      >
        {/* Même conteneur que TopInfoBar et Footer : content-wrap = marge identique */}
        <div className="content-wrap">
          <div className="flex items-center h-24 md:h-28 relative min-w-0">
            {/* Logo : même marge gauche que "Ouvert" et footer */}
              <Link to="/" className="flex-shrink-0 flex items-center header-logo" onClick={handleLogoClick}>
                <Logo className="h-[4.5rem] md:h-[5.5rem] w-auto" align="left" />
              </Link>

            {/* Menu desktop : centré entre logo et recherche */}
            <div className="hidden lg:flex flex-1 justify-center min-w-0">
              <nav className={`flex items-center justify-center space-x-8 ${isSearchOpen ? 'hidden' : 'flex'}`}>
              {navigationLinks.map((link) => (
                <div key={link.label} className="relative flex-shrink-0">
                  {link.type === 'univers' ? (
                    <div className="relative univers-menu">
                      <button
                        onClick={() => setIsUniversOpen(!isUniversOpen)}
                        className="flex items-center text-lg font-sofia font-light hover:text-gray-600 transition-colors"
                      >
                        {link.label}
                        <ChevronDown className="ml-1 w-4 h-4 transition-transform" />
                      </button>
                      <AnimatePresence>
                        {isUniversOpen && <UniversDropdown />}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={link.path!}
                      className="text-lg font-sofia font-light hover:text-gray-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              </nav>
            </div>

            {/* Boutons tablette / mobile : hamburger jusqu'à lg (iPad mini, Air, Pro) */}
            <div className="lg:hidden flex-1 flex justify-end items-center space-x-3">
              {/* Bouton de recherche mobile */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleSearch}
                className="relative p-3 rounded-2xl bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                {isSearchOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Search className="w-6 h-6 text-gray-700" />
                )}
              </motion.button>

              {/* Bouton menu hamburger */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMenu}
                className="relative p-3 rounded-2xl bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <motion.div
                  animate={isMenuOpen ? { rotate: 45 } : { rotate: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-6 h-6 flex flex-col justify-center items-center"
                >
                  <motion.span
                    animate={isMenuOpen ? { y: 0, rotate: 45 } : { y: -6, rotate: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-5 h-0.5 bg-gray-700 rounded-full"
                  />
                  <motion.span
                    animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-0.5 bg-gray-700 rounded-full"
                  />
                  <motion.span
                    animate={isMenuOpen ? { y: 0, rotate: -45 } : { y: 6, rotate: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-5 h-0.5 bg-gray-700 rounded-full"
                  />
                </motion.div>
              </motion.button>
            </div>

            {/* Menu mobile moderne */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30,
                    duration: 0.3 
                  }}
                  className="fixed inset-0 z-50 lg:hidden"
                  style={{
                    top: isTopInfoBarVisible ? '40px' : '0px',
                  }}
                >
                  {/* Overlay avec effet glassmorphism */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/30 to-black/40 backdrop-blur-md"
                    onClick={toggleMenu}
                  />
                  
                  {/* Menu principal avec design moderne */}
                  <motion.div 
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl border-l border-gray-200"
                    style={{
                      height: isTopInfoBarVisible ? 'calc(100vh - 40px)' : '100vh',
                    }}
                  >
                    {/* Header du menu — même fond que la navbar */}
                    <div className="relative h-24 bg-white border-b border-gray-200">
                      <div className="relative flex items-center justify-between p-6">
                        <div>
                          <h2 className="font-ogg font-semibold text-gray-900">Prima Center</h2>
                          <p className="text-sm font-ogg text-gray-500">Menu de navigation</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={toggleMenu}
                          className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Contenu du menu — fond unique (navbar) */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-2 bg-white">
                      {navigationLinks.map((link, index) => (
                        <motion.div 
                          key={link.label}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                          className="mb-4"
                        >
                          {link.type === "univers" ? (
                            <div className="space-y-1">
                              <button
                                type="button"
                                onClick={() => setIsMobileUniversOpen(!isMobileUniversOpen)}
                                className="flex items-center justify-between w-full py-3 text-left font-ogg text-lg font-medium text-gray-900"
                              >
                                <span className="font-ogg relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-gray-900 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300">
                                  {link.label}
                                </span>
                                <motion.div
                                  animate={{ rotate: isMobileUniversOpen ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                </motion.div>
                              </button>
                              
                              <AnimatePresence>
                                {isMobileUniversOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                    animate={{ opacity: 1, height: "auto", y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                  >
                                    <div className="pl-4 space-y-1 pt-1">
                                      {universList.map((univers, subIndex) => (
                                        <motion.div
                                          key={univers.path}
                                          initial={{ opacity: 0, x: 20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: subIndex * 0.1 }}
                                        >
                                          <Link
                                            to={univers.path}
                                            className="block py-2 font-ogg font-medium text-gray-700 hover:text-gray-900 relative w-fit after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-gray-900 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300"
                                            onClick={() => {
                                              setIsMobileUniversOpen(false);
                                              setIsMenuOpen(false);
                                            }}
                                          >
                                            {univers.label}
                                          </Link>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ) : (
                            <Link
                              to={link.path!}
                              className="block py-3 text-lg font-ogg font-medium text-gray-900 relative w-fit after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-gray-900 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {link.label}
                            </Link>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {/* Footer du menu — même fond */}
                    <div className="p-6 border-t border-gray-200 bg-white">
                      <div className="text-center">
                        <p className="text-sm font-ogg font-medium text-gray-900 mb-1">Prima Center</p>
                        <p className="text-xs font-ogg text-gray-500">Votre centre commercial de référence</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Barre de recherche desktop : prend la place du nav quand ouverte */}
            <div className={`hidden lg:flex items-center flex-shrink-0 ${isSearchOpen ? 'flex-1 min-w-0 justify-end' : ''}`}>
              <AnimatePresence mode="wait">
                {isSearchOpen ? (
                  <motion.div
                    key="search-open"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: '100%' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative flex items-center w-full max-w-md ml-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative flex items-center flex-1 min-w-0">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher une boutique ou catégorie..."
                        className="flex-1 min-w-0 w-full bg-transparent border-0 border-b border-gray-300 focus:border-black focus:outline-none py-2 pr-16 text-gray-700 placeholder-gray-400"
                        autoFocus
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-8 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                      <span className="absolute right-0 text-gray-400 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                    <SearchResults />
                  </motion.div>
                ) : null}
              </AnimatePresence>
              <button
                onClick={toggleSearch}
                className="p-3 hover:bg-[#F8F7F4] rounded-full transition-colors flex-shrink-0"
                aria-label="Rechercher"
              >
                {isSearchOpen ? (
                  <X className="w-6 h-6 text-gray-800" />
                ) : (
                  <Search className="w-6 h-6 text-gray-800" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Barre de recherche mobile */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-50 lg:hidden"
            style={{
              top: isTopInfoBarVisible ? '72px' : '80px',
            }}
          >
            <div className="bg-white shadow-lg border-b border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher boutiques, restaurants, loisirs..."
                      className="flex-1 bg-transparent border-0 border-b border-gray-300 focus:border-black focus:outline-none py-2 pr-16 text-gray-700 placeholder-gray-400"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-8 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    <button
                      type="submit"
                      className="absolute right-0 text-gray-400 hover:text-black transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <SearchResults />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleSearch}
                  className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay sombre pour mobile */}
      <AnimatePresence>
        {(isMenuOpen || isSearchOpen || isUniversOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => {
              setIsMenuOpen(false);
              setIsSearchOpen(false);
              setIsUniversOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;

