import React from 'react';

interface GoldStarProps {
  className?: string;
}

const GoldStar: React.FC<GoldStarProps> = ({ className = "w-12 h-12" }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L14.4 9.2H22L16 13.8L18.4 21L12 16.4L5.6 21L8 13.8L2 9.2H9.6L12 2Z"
        fill="url(#goldGradient)"
        stroke="#C4A962"
        strokeWidth="1"
      />
      <defs>
        <linearGradient id="goldGradient" x1="2" y1="2" x2="22" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#C4A962"/>
          <stop offset="100%" stopColor="#DAA520"/>
        </linearGradient>
      </defs>
    </svg>
  );
};

export default GoldStar; 