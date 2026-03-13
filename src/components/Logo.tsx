import React from 'react';

interface LogoProps {
  className?: string;
  color?: string;
  variant?: 'light' | 'dark';
  /** 'left' = aligné à gauche (navbar, pour respecter la marge). 'center' = centré (défaut). */
  align?: 'left' | 'center';
}

const Logo: React.FC<LogoProps> = ({ 
  className = "h-12", 
  color = "currentColor",
  variant = 'light',
  align = 'center'
}) => {
  // Configuration des logos
  const logos = {
    light: "/images/logo-prima-center-light.png",     // Logo clair
    dark: "/images/logo-prima-center-dark.png",        // Logo sombre (si vous en avez un)
    new: "/images/logo-prima-center-new.png"           // Nouveau logo
  };
  
  // Sélection du logo selon le variant
  const logoSrc = logos[variant] || logos.light;
  const alignClass = align === 'left' ? 'justify-start' : 'justify-center';
  const imgMarginClass = align === 'left' ? 'ml-0 mr-auto' : 'mx-auto';
  /* align="left" (navbar) : origin à gauche pour que scale(2) n’étende pas le logo vers la gauche = respect de la marge */
  const transformOrigin = align === 'left' ? 'left center' : '50% 50%';

  return (
    <div className={`${className} flex items-center ${alignClass}`}>
      <img 
        src={logoSrc}
        alt="PRIMA CENTER"
        className={`h-full w-auto object-contain max-w-none ${imgMarginClass}`}
        style={{ 
          filter: color === 'white' ? 'brightness(0) invert(1)' : 'none',
          transform: 'scale(2.0)',
          transformOrigin,
          width: 'auto',
          height: '100%',
          display: 'block'
        }}
      />  
    </div>
  );
};

export default Logo;