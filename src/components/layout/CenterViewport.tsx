import React from 'react';
import { DroneCanvas } from '../3d/DroneCanvas';
import { ShieldAlert } from 'lucide-react';

export const CenterViewport: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#06080C] raktor-map-grid select-none flex items-center justify-center">
      {/* Background Tactical Radar Circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <div className="w-[840px] h-[840px] rounded-full border border-white/[0.04]" />
        <div className="w-[600px] h-[600px] rounded-full border border-white/[0.05]" />
        <div className="w-[380px] h-[380px] rounded-full border border-raktor-orange/15 shadow-raktor-glow" />

        {/* Tactical Crosshair Axes */}
        <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
        <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-white/[0.05] to-transparent" />
      </div>

      {/* Hero 3D UAV Drone Canvas with Spatial 3D Telemetry Callouts */}
      <DroneCanvas />

      {/* Restricted Airspace (NFZ) Warning Pill */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none flex items-center space-x-1.5 bg-raktor-rose/10 backdrop-blur-md border border-raktor-rose/30 px-3 py-1 rounded-full text-[11px] font-mono text-raktor-rose whitespace-nowrap shadow-md z-30">
        <ShieldAlert className="w-3.5 h-3.5 text-raktor-rose shrink-0" />
        <span className="font-semibold">RESTRICTED AIRSPACE: NFZ-SECTOR-08 (520m AWAY)</span>
      </div>
    </div>
  );
};
