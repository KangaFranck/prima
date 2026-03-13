import React, { useState } from 'react';
import { Play, ArrowLeft, ChevronRight } from 'lucide-react';

// Hero section with video background and professional layout
const Hero = () => {
  const [activeVideo, setActiveVideo] = useState<string>('/videos/mall-background.mp4');
  const [isDefaultVideo, setIsDefaultVideo] = useState(true);

  const sections = [
    {
      id: 'boutiques',
      title: 'Plus de 100 Boutiques',
      subtitle: 'Mode, Beauté, High-tech',
      video: '/videos/boutiques-presentation.mp4',
      gradient: 'from-purple-600/80 to-pink-600/80'
    },
    {
      id: 'finance',
      title: 'Services Financiers',
      subtitle: 'Banques & Assurances',
      video: '/videos/services-financiers.mp4',
      gradient: 'from-blue-600/80 to-cyan-600/80'
    },
    {
      id: 'business',
      title: 'Centre d\'Affaires',
      subtitle: 'Espaces Professionnels',
      video: '/videos/centre-affaires.mp4',
      gradient: 'from-amber-600/80 to-orange-600/80'
    }
  ];

  const handleSectionClick = (video: string) => {
    setActiveVideo(video);
    setIsDefaultVideo(false);
  };

  const resetVideo = () => {
    setActiveVideo('/videos/mall-background.mp4');
    setIsDefaultVideo(true);
  };

  return (
    <div className="relative h-[180px] bg-gray-900">
      {/* Vidéo d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          key={activeVideo}
          autoPlay
          loop={isDefaultVideo}
          muted={isDefaultVideo}
          controls={!isDefaultVideo}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.6)' }}
          onEnded={resetVideo}
        >
          <source src={activeVideo} type="video/mp4" />
        </video>
      </div>

      {/* Contenu principal */}
      <div className="relative h-full z-10">
        <div className="w-full h-full px-4 sm:px-6 md:px-8">
          <div className="h-full flex items-center">
            {/* Titre principal */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                PRIMA CENTER
              </h1>
              <p className="text-lg text-gray-200 max-w-xl">
                Votre destination shopping et affaires au cœur d'Abidjan
              </p>
            </div>

            {/* Navigation des sections */}
            <div className="hidden md:flex items-center space-x-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.video)}
                  className={`group relative px-6 py-3 rounded-lg overflow-hidden transition-all duration-300
                    ${isDefaultVideo ? 'bg-white/10 hover:bg-white/20' : 'bg-black/20 hover:bg-black/30'}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${section.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative">
                    <p className="text-white font-medium">{section.title}</p>
                    <p className="text-xs text-gray-300">{section.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Version mobile des sections */}
            <div className="md:hidden">
              <button
                onClick={() => setIsDefaultVideo(!isDefaultVideo)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton de retour */}
      {!isDefaultVideo && (
        <button
          onClick={resetVideo}
          className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-lg 
            hover:bg-white transition-all duration-300 shadow-lg flex items-center space-x-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour</span>
        </button>
      )}
    </div>
  );
};

export default Hero;