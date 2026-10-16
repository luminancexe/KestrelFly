import React from 'react';
import { useFlightStore } from '../../store/flightStore';
import { ThreeOceanScene } from './ThreeOceanScene';
import { NuclearDangerCard } from './NuclearDangerCard';

export const OceanScene: React.FC = () => {
  const { inspection, missionPhase } = useFlightStore();

  const showHazardCard = missionPhase === 'threat_locked' || inspection.scanPhase === 'cargo_threat';

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
      {/* 1. Real-time 3D WebGL Living Ocean & Cruising Cargo Ship (Three.js) */}
      <ThreeOceanScene />

      {/* 2. Semicircular Tactical Radar Scanner Reticle Arc Over Ship Deck */}
      <div className="absolute top-[32%] left-[46%] -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] pointer-events-none">
        <svg className="w-full h-full opacity-60" viewBox="0 0 200 200">
          {/* Outer dashed arc */}
          <circle 
            cx="100" cy="100" r="75" 
            fill="none" 
            stroke="rgba(255,255,255,0.4)" 
            strokeWidth="0.75" 
            strokeDasharray="4 4" 
          />
          {/* Inner guide ring */}
          <circle 
            cx="100" cy="100" r="45" 
            fill="none" 
            stroke="rgba(60,230,184,0.3)" 
            strokeWidth="0.5" 
          />
          {/* Rotating Heading Tick */}
          <line x1="100" y1="20" x2="100" y2="35" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
          <polygon points="100,10 96,22 104,22" fill="rgba(255,255,255,0.8)" />
        </svg>
      </div>

      {/* 3. Inspection Progress Bar across the Ship Deck */}
      <div className="absolute top-[67%] left-[23%] right-[38%] pointer-events-none flex items-center space-x-3 text-[10px] font-mono text-kestrel-muted z-20">
        <span className="text-white font-semibold">{inspection.inspectionDistanceKm.toFixed(3)} km</span>
        <span className="text-kestrel-muted">Inspection Progress</span>
        <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-transparent via-[#d4df48] to-[#d4df48] rounded-full"
            style={{ width: `${inspection.inspectionProgressPercent}%` }}
          />
        </div>
      </div>

      {/* 4. Floating 3D Nuclear Danger! Card (Pinned right near the Hazard Cargo Hold) */}
      {showHazardCard && (
        <div className="absolute top-[22%] right-[16%] z-30 animate-fade-in">
          <NuclearDangerCard />
        </div>
      )}
    </div>
  );
};
