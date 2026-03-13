import React from 'react';
import { Car } from 'lucide-react';

/** Carte de situation stylisée type brochure : beige / doré, quartiers Abidjan, temps de trajet depuis PRIMA CENTER */
export function PrimaLocationMap() {
  const travelTimes = [
    { label: 'Vers Plateau 7 min', x: '8%', y: '18%' },
    { label: 'Riviera 15 min', x: '68%', y: '12%' },
    { label: 'II Plateaux Vallons 8 min', x: '64%', y: '28%' },
    { label: 'Zone 4 12 min', x: '72%', y: '78%' },
    { label: 'Aéroport FHB 30 min', x: '8%', y: '80%' },
  ];

  return (
    <div className="relative w-full min-h-[400px] md:min-h-[500px] rounded-lg overflow-hidden bg-[#f0ebe3]">
      <svg
        viewBox="0 0 520 380"
        className="absolute inset-0 w-full h-full object-cover"
        aria-label="Carte de situation PRIMA CENTER - Zone 4 Marcory"
      >
        <defs>
          <linearGradient id="water" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c5d4e0" />
            <stop offset="100%" stopColor="#a8bcc9" />
          </linearGradient>
          <linearGradient id="land" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e8e2d8" />
            <stop offset="100%" stopColor="#ddd6c9" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>

        <rect width="520" height="380" fill="url(#land)" />
        <path
          d="M 80 80 Q 120 60 180 80 T 220 140 T 200 220 T 140 280 T 60 260 T 40 180 T 80 80"
          fill="url(#water)"
          stroke="#a8bcc9"
          strokeWidth="1"
        />

        <path d="M 100 200 L 320 200" stroke="#b8956e" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M 320 200 L 420 120" stroke="#b8956e" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 320 200 L 380 280" stroke="#b8956e" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 200 320 L 320 200" stroke="#b8956e" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 120 120 L 260 180" stroke="#b8956e" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        <text x="380" y="95" fontSize="10" fontWeight="600" fill="#8b7355" fontFamily="system-ui, sans-serif">COCODY</text>
        <text x="420" y="260" fontSize="10" fontWeight="600" fill="#8b7355" fontFamily="system-ui, sans-serif">TREICHVILLE</text>
        <text x="260" y="340" fontSize="10" fontWeight="600" fill="#8b7355" fontFamily="system-ui, sans-serif">MARCORY</text>
        <text x="260" y="165" fontSize="10" fontWeight="600" fill="#8b7355" fontFamily="system-ui, sans-serif">LE PLATEAU</text>
        <text x="90" y="140" fontSize="10" fontWeight="600" fill="#8b7355" fontFamily="system-ui, sans-serif">YOPOUGON</text>
        <text x="160" y="300" fontSize="10" fontWeight="600" fill="#8b7355" fontFamily="system-ui, sans-serif">ZONE 4</text>

        <g filter="url(#shadow)" transform="translate(268, 188)">
          <rect x="-14" y="-14" width="28" height="28" rx="4" fill="#fff" stroke="#b8956e" strokeWidth="2" />
          <line x1="-6" y1="-6" x2="6" y2="-6" stroke="#b8956e" strokeWidth="1.2" />
          <line x1="-6" y1="0" x2="6" y2="0" stroke="#b8956e" strokeWidth="1.2" />
          <line x1="-6" y1="6" x2="6" y2="6" stroke="#b8956e" strokeWidth="1.2" />
          <line x1="-6" y1="-6" x2="-6" y2="6" stroke="#b8956e" strokeWidth="1.2" />
          <line x1="0" y1="-6" x2="0" y2="6" stroke="#b8956e" strokeWidth="1.2" />
          <line x1="6" y1="-6" x2="6" y2="6" stroke="#b8956e" strokeWidth="1.2" />
        </g>
        <text x="268" y="228" textAnchor="middle" fontSize="11" fontWeight="600" fill="#5c4a3a" fontFamily="system-ui, sans-serif">PRIMA CENTER</text>
      </svg>

      {/* Encarts temps de trajet en overlay */}
      {travelTimes.map((item, i) => (
        <div
          key={i}
          className="absolute flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c9b896]/95 border border-[#b8956e] shadow-sm"
          style={{ left: item.x, top: item.y, transform: 'translate(-50%, -50%)' }}
        >
          <Car className="w-4 h-4 text-[#5c4a3a] shrink-0" strokeWidth={2} />
          <span className="text-[11px] md:text-xs font-medium text-[#5c4a3a] whitespace-nowrap">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

