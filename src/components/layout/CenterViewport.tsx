import React from 'react';
import { useFlightStore } from '../../store/flightStore';
import { 
  Navigation, 
  ShieldAlert, 
  Layers, 
  MapPin, 
  Compass, 
  Crosshair 
} from 'lucide-react';

export const CenterViewport: React.FC = () => {
  const { telemetry } = useFlightStore();

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#06080C] raktor-map-grid select-none pointer-events-auto">
      {/* Tactical Map Atmosphere & Radar Concentric Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[880px] h-[880px] rounded-full border border-white/[0.03]" />
        <div className="w-[640px] h-[640px] rounded-full border border-white/[0.04]" />
        <div className="w-[420px] h-[420px] rounded-full border border-white/[0.06]" />
        <div className="w-[220px] h-[220px] rounded-full border border-raktor-orange/15 shadow-raktor-glow" />

        {/* Tactical Crosshair Axes */}
        <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
      </div>

      {/* Waypoint Flight Corridor SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="raktorRoute" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EA580C" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#F97316" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FB923C" stopOpacity="0.6" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Flight Path with Glow */}
        <path
          d="M 380 540 C 440 460, 520 380, 620 320 C 740 260, 840 330, 950 280 C 1040 240, 1120 360, 1020 480 C 920 580, 780 620, 680 560 Z"
          fill="rgba(234, 88, 12, 0.03)"
          stroke="url(#raktorRoute)"
          strokeWidth="3"
          strokeDasharray="8 6"
          filter="url(#glow)"
        />
      </svg>

      {/* Waypoint Nodes on the Map */}
      <div className="absolute top-[310px] left-[610px] pointer-events-none flex items-center space-x-2">
        <div className="w-5 h-5 rounded-full bg-raktor-orange/20 border-2 border-raktor-orange flex items-center justify-center shadow-raktor-glow">
          <span className="text-[9px] font-mono font-bold text-white">1</span>
        </div>
        <div className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 text-[10px] font-mono text-raktor-cream">
          WP-01 <span className="text-raktor-creamDark">(100m)</span>
        </div>
      </div>

      <div className="absolute top-[270px] left-[940px] pointer-events-none flex items-center space-x-2">
        <div className="w-5 h-5 rounded-full bg-raktor-orange/20 border-2 border-raktor-orange flex items-center justify-center shadow-raktor-glow">
          <span className="text-[9px] font-mono font-bold text-white">2</span>
        </div>
        <div className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 text-[10px] font-mono text-raktor-cream">
          WP-02 <span className="text-raktor-creamDark">(120m)</span>
        </div>
      </div>

      {/* Active Waypoint 3 */}
      <div className="absolute top-[470px] left-[1010px] pointer-events-none flex items-center space-x-2">
        <div className="w-6 h-6 rounded-full bg-raktor-orange flex items-center justify-center shadow-raktor-glow animate-pulse">
          <span className="text-[10px] font-mono font-bold text-white">3</span>
        </div>
        <div className="bg-raktor-orange/20 backdrop-blur-md px-2.5 py-1 rounded-xl border border-raktor-orange/50 text-[11px] font-mono text-raktor-cream font-bold">
          WP-03 (ACTIVE 125m)
        </div>
      </div>

      {/* Live Animated Drone Marker */}
      <div 
        className="absolute z-20 pointer-events-none transition-all duration-700 flex flex-col items-center"
        style={{
          top: '475px',
          left: '1005px',
          transform: `translate(-50%, -50%) rotate(${telemetry.yaw}deg)`
        }}
      >
        {/* Radar Wave Ping */}
        <div className="absolute w-16 h-16 rounded-full bg-raktor-orange/25 animate-ping" />
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-raktor-orange to-amber-500 flex items-center justify-center shadow-raktor-glow border border-white/20">
          <Navigation className="w-5 h-5 text-white fill-white" />
        </div>
      </div>

      {/* Restricted Airspace (NFZ) Warning Polygon */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none flex items-center space-x-2 bg-raktor-rose/10 backdrop-blur-md border border-raktor-rose/30 px-3.5 py-1.5 rounded-full text-xs font-mono text-raktor-rose">
        <ShieldAlert className="w-4 h-4 text-raktor-rose" />
        <span className="font-semibold">RESTRICTED AIRSPACE: NFZ-SECTOR-08 (520m AWAY)</span>
      </div>

      {/* Map Layer Switcher Floating Pill */}
      <div className="absolute bottom-6 right-6 pointer-events-auto flex items-center space-x-1.5 raktor-panel p-1 rounded-2xl text-xs font-mono text-raktor-creamMuted">
        <button className="px-3 py-1.5 bg-raktor-orange text-white rounded-xl font-bold shadow-raktor-glow">
          TACTICAL 2D
        </button>
        <button className="px-3 py-1.5 hover:text-raktor-cream rounded-xl">
          TERRAIN 3D
        </button>
        <button className="px-3 py-1.5 hover:text-raktor-cream rounded-xl">
          SATELLITE
        </button>
      </div>
    </div>
  );
};
