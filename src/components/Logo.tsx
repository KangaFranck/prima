import React from 'react';

interface LogoProps {
  className?: string;
  color?: string;
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ 
  className = "h-12", 
  color = "currentColor",
  variant = 'light'
}) => {
  // Configuration des logos
  const logos = {
    light: "/images/logo-prima-center-light.png",     // Logo clair
    dark: "/images/logo-prima-center-dark.png",        // Logo sombre (si vous en avez un)
    new: "/images/logo-prima-center-new.png"           // Nouveau logo
  };
  
  // Sélection du logo selon le variant
  const logoSrc = logos[variant] || logos.light;
  
  return (
    <div className={`${className} flex items-center justify-center`}>
      <img 
        src={logoSrc}
        alt="Prima Center"
        className="h-full w-auto object-contain max-w-none mx-auto"
        style={{ 
          filter: color === 'white' ? 'brightness(0) invert(1)' : 'none',
          transform: 'scale(2.0)',  // Logo agrandi de 100% (taille maximale)
          width: 'auto',
          height: '100%',
          display: 'block'
        }}
      />  
    </div>
  );
};

export default Logo;