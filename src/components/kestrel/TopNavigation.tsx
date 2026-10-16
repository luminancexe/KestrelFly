import React from 'react';
import { useFlightStore } from '../../store/flightStore';
import { NavTab } from '../../types/telemetry';
import { MapPin, Video, Navigation, Crosshair } from 'lucide-react';

export const TopNavigation: React.FC = () => {
  const { activeTab, setActiveTab } = useFlightStore();

  const tabs: NavTab[] = ['Mission', 'Area', 'Map', 'Routes', 'Control'];

  return (
    <header className="absolute top-4 left-6 right-6 z-40 flex items-center justify-between pointer-events-none select-none">
      {/* Top Left: Minimalist KestrelFly Brand */}
      <div className="flex items-center space-x-2.5 pointer-events-auto cursor-pointer group">
        {/* Minimalist Geometric Falcon Wing Vector */}
        <svg 
          className="w-5 h-5 text-kestrel-teal transition-transform duration-300 group-hover:scale-105" 
          viewBox="0 0 24 24" 
          fill="none"
        >
          {/* Left Wing Facet */}
          <path 
            d="M12 3L3.5 17L10 15L12 7V3Z" 
            fill="currentColor" 
            fillOpacity="0.75" 
          />
          {/* Right Wing Facet */}
          <path 
            d="M12 3L20.5 17L14 15L12 7V3Z" 
            fill="currentColor" 
          />
        </svg>

        {/* Clean Minimalist Typography */}
        <span className="font-display font-bold tracking-[0.22em] text-xs text-white group-hover:text-kestrel-teal transition-colors">
          KESTRELFLY
        </span>
      </div>

      {/* Top Center: Navigation Tab Pill */}
      <nav className="kestrel-panel px-1.5 py-1 rounded-2xl flex items-center space-x-1 pointer-events-auto shadow-kestrel-card">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-medium rounded-xl transition-all ${
                isActive
                  ? 'bg-white/10 text-white font-semibold shadow-inner'
                  : 'text-kestrel-muted hover:text-kestrel-cream hover:bg-white/[0.04]'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </nav>

      {/* Top Right: 4 Utility Action Pills */}
      <div className="flex items-center space-x-2 pointer-events-auto">
        <button 
          title="Location / GPS Target"
          className="w-9 h-9 rounded-xl kestrel-panel flex items-center justify-center text-kestrel-muted hover:text-kestrel-cream hover:border-white/20 transition-all"
        >
          <MapPin className="w-4 h-4" />
        </button>
        <button 
          title="Live Camera Stream"
          className="w-9 h-9 rounded-xl kestrel-panel flex items-center justify-center text-kestrel-muted hover:text-kestrel-cream hover:border-white/20 transition-all"
        >
          <Video className="w-4 h-4" />
        </button>
        <button 
          title="Navigation Vector"
          className="w-9 h-9 rounded-xl kestrel-panel flex items-center justify-center text-kestrel-muted hover:text-kestrel-cream hover:border-white/20 transition-all"
        >
          <Navigation className="w-4 h-4" />
        </button>
        <button 
          title="Target Reticle Lock"
          className="w-9 h-9 rounded-xl kestrel-panel flex items-center justify-center text-kestrel-muted hover:text-kestrel-cream hover:border-white/20 transition-all"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
