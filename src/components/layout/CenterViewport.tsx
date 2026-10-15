import React from 'react';
import { useFlightStore } from '../../store/flightStore';
import { 
  Navigation, 
  ShieldAlert 
} from 'lucide-react';

export const CenterViewport: React.FC = () => {
  const { telemetry } = useFlightStore();

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#06080C] raktor-map-grid select-none pointer-events-auto flex items-center justify-center">
      {/* Tactical Map Atmosphere & Radar Concentric Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[720px] h-[720px] rounded-full border border-white/[0.03]" />
        <div className="w-[520px] h-[520px] rounded-full border border-white/[0.04]" />
        <div className="w-[340px] h-[340px] rounded-full border border-white/[0.06]" />
        <div className="w-[180px] h-[180px] rounded-full border border-raktor-orange/15 shadow-raktor-glow" />

        {/* Tactical Crosshair Axes */}
        <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
      </div>

      {/* Centered Tactical Stage Container (Guarantees path is between the sidebars) */}
      <div className="relative w-[540px] h-[380px] pointer-events-none">
        {/* Waypoint Flight Corridor SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
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

          {/* Smooth Closed Flight Corridor Loop */}
          <path
            d="M 60 260 C 100 140, 200 60, 320 80 C 440 100, 500 180, 460 290 C 420 370, 240 370, 160 340 Z"
            fill="rgba(234, 88, 12, 0.04)"
            stroke="url(#raktorRoute)"
            strokeWidth="3"
            strokeDasharray="8 6"
            filter="url(#glow)"
          />
        </svg>

        {/* WP-01 */}
        <div className="absolute top-[65px] left-[305px] pointer-events-none flex items-center space-x-1.5 -translate-x-1/2">
          <div className="w-5 h-5 rounded-full bg-raktor-orange/20 border-2 border-raktor-orange flex items-center justify-center shadow-raktor-glow">
            <span className="text-[9px] font-mono font-bold text-white">1</span>
          </div>
          <div className="bg-black/85 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 text-[9px] font-mono text-raktor-cream whitespace-nowrap shadow-md">
            WP-01 <span className="text-raktor-creamDark">(100m)</span>
          </div>
        </div>

        {/* WP-02 */}
        <div className="absolute top-[280px] left-[450px] pointer-events-none flex items-center space-x-1.5 -translate-x-1/2">
          <div className="w-5 h-5 rounded-full bg-raktor-orange/20 border-2 border-raktor-orange flex items-center justify-center shadow-raktor-glow">
            <span className="text-[9px] font-mono font-bold text-white">2</span>
          </div>
          <div className="bg-black/85 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 text-[9px] font-mono text-raktor-cream whitespace-nowrap shadow-md">
            WP-02 <span className="text-raktor-creamDark">(120m)</span>
          </div>
        </div>

        {/* WP-03 Active Waypoint */}
        <div className="absolute top-[330px] left-[150px] pointer-events-none flex items-center space-x-1.5 -translate-x-1/2">
          <div className="w-5 h-5 rounded-full bg-raktor-orange flex items-center justify-center shadow-raktor-glow animate-pulse">
            <span className="text-[9px] font-mono font-bold text-white">3</span>
          </div>
          <div className="bg-raktor-orange/25 backdrop-blur-md px-2 py-0.5 rounded-lg border border-raktor-orange/50 text-[10px] font-mono text-raktor-cream font-bold whitespace-nowrap shadow-md">
            WP-03 (125m ACTIVE)
          </div>
        </div>

        {/* Live Animated Drone Marker */}
        <div 
          className="absolute z-20 pointer-events-none transition-all duration-700 flex flex-col items-center"
          style={{
            top: '330px',
            left: '150px',
            transform: `translate(-50%, -50%) rotate(${telemetry.yaw}deg)`
          }}
        >
          {/* Radar Wave Ping */}
          <div className="absolute w-14 h-14 rounded-full bg-raktor-orange/25 animate-ping" />
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-raktor-orange to-amber-500 flex items-center justify-center shadow-raktor-glow border border-white/20">
            <Navigation className="w-4 h-4 text-white fill-white" />
          </div>
        </div>
      </div>

      {/* Restricted Airspace (NFZ) Warning Pill */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none flex items-center space-x-1.5 bg-raktor-rose/10 backdrop-blur-md border border-raktor-rose/30 px-3 py-1 rounded-full text-[11px] font-mono text-raktor-rose whitespace-nowrap shadow-md">
        <ShieldAlert className="w-3.5 h-3.5 text-raktor-rose shrink-0" />
        <span className="font-semibold">RESTRICTED AIRSPACE: NFZ-SECTOR-08 (520m AWAY)</span>
      </div>
    </div>
  );
};
