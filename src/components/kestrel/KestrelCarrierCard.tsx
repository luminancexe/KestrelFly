import React, { useState } from 'react';
import { useFlightStore } from '../../store/flightStore';

export const KestrelCarrierCard: React.FC = () => {
  const { triggerUSVReturn } = useFlightStore();
  const [isReturning, setIsReturning] = useState(false);

  const handleReturn = () => {
    setIsReturning(true);
    triggerUSVReturn();
    setTimeout(() => setIsReturning(false), 4000);
  };

  return (
    <div className="kestrel-panel p-3 rounded-2xl flex flex-col justify-between shadow-kestrel-card relative overflow-hidden select-none h-full">
      {/* Header */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-kestrel-cream">KestrelCarrier #123-33KX-1</span>
        <span className="text-[10px] font-mono text-kestrel-muted flex items-center space-x-1">
          <span className={`w-1.5 h-1.5 rounded-full ${isReturning ? 'bg-kestrel-orange animate-ping' : 'bg-kestrel-teal animate-pulse'}`} />
          <span>{isReturning ? 'Returning' : 'Medium'}</span>
        </span>
      </div>

      {/* Vector Stealth Drone-Carrier Boat Render */}
      <div className="relative w-full h-24 my-1 flex items-center justify-center">
        {/* Radiating Sonar/Radar Waves from Hull */}
        <div className="absolute w-24 h-12 rounded-full border border-kestrel-teal/20 animate-ping pointer-events-none" />
        <div className="absolute w-36 h-18 rounded-full border border-kestrel-teal/10 animate-ping pointer-events-none" style={{ animationDelay: '1s' }} />

        {/* Scalable Vector Stealth USV Drone-Boat */}
        <svg className="w-56 h-18" viewBox="0 0 220 70">
          <defs>
            <linearGradient id="usvHull" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#121822" />
              <stop offset="60%" stopColor="#1a2332" />
              <stop offset="100%" stopColor="#253246" />
            </linearGradient>
            <linearGradient id="usvDeck" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e2736" />
              <stop offset="100%" stopColor="#141b26" />
            </linearGradient>
          </defs>

          {/* Boat Hull Shape */}
          <path
            d="M 15 35 Q 25 15, 60 12 L 170 12 Q 195 22, 215 35 Q 195 48, 170 58 L 60 58 Q 25 55, 15 35 Z"
            fill="url(#usvHull)"
            stroke="#344358"
            strokeWidth="1.5"
          />

          {/* Stepped Stern Deck */}
          <rect x="25" y="20" width="30" height="30" rx="3" fill="#0f141d" stroke="#253142" />

          {/* Drone Docking Bay 1 */}
          <rect x="65" y="20" width="34" height="30" rx="4" fill="url(#usvDeck)" stroke="#3ce6b8" strokeWidth="1" strokeDasharray="3 2" />
          {/* Drone in Dock 1 */}
          <circle cx="82" cy="35" r="3" fill="#3ce6b8" />
          <line x1="74" y1="27" x2="90" y2="43" stroke="#3ce6b8" strokeWidth="1" />
          <line x1="74" y1="43" x2="90" y2="27" stroke="#3ce6b8" strokeWidth="1" />

          {/* Drone Docking Bay 2 */}
          <rect x="105" y="20" width="34" height="30" rx="4" fill="url(#usvDeck)" stroke="#3ce6b8" strokeWidth="1" strokeDasharray="3 2" />
          {/* Drone in Dock 2 */}
          <circle cx="122" cy="35" r="3" fill="#3ce6b8" />
          <line x1="114" y1="27" x2="130" y2="43" stroke="#3ce6b8" strokeWidth="1" />
          <line x1="114" y1="43" x2="130" y2="27" stroke="#3ce6b8" strokeWidth="1" />

          {/* Stealth Faceted Forward Bow Armor */}
          <path d="M 145 16 L 180 20 L 205 35 L 180 50 L 145 54 Z" fill="#222c3c" stroke="#384960" />
        </svg>

        {/* Interactive Return Button Overlaid on the Boat */}
        <button
          onClick={handleReturn}
          className={`absolute z-10 px-6 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all ${
            isReturning
              ? 'bg-kestrel-orange/30 text-kestrel-orange border-kestrel-orange animate-pulse shadow-kestrel-glow'
              : 'bg-[#263742]/95 hover:bg-[#344856] text-kestrel-teal border-kestrel-teal/40 hover:border-kestrel-teal shadow-md'
          }`}
        >
          {isReturning ? 'Returning...' : 'Return'}
        </button>
      </div>

      {/* Footer Coordinates */}
      <div className="flex items-center justify-between text-[9px] font-mono text-kestrel-muted pt-1 border-t border-white/[0.04]">
        <span>42.7219° N</span>
        <span>32.2210° E</span>
      </div>
    </div>
  );
};
