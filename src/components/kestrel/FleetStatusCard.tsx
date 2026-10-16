import React from 'react';
import { useFlightStore } from '../../store/flightStore';

export const FleetStatusCard: React.FC = () => {
  const { fleet, triggerReturn } = useFlightStore();

  const progressBars = [
    { label: '74%', width: '74%', active: true },
    { label: '56%', width: '56%', active: true },
    { label: '48%', width: '48%', active: true },
    { label: '100%', width: '100%', active: false },
    { label: '100%', width: '100%', active: false },
  ];

  return (
    <div className="kestrel-panel p-3 rounded-2xl flex flex-col justify-between shadow-kestrel-card select-none h-full">
      {/* Top Readiness Progress Bars */}
      <div className="flex items-center justify-between space-x-1.5 pb-1.5 border-b border-white/[0.06]">
        {progressBars.map((bar, i) => (
          <div key={i} className="flex-1">
            <div className="text-[8px] font-mono text-kestrel-muted text-center mb-0.5">{bar.label}</div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${bar.active ? 'bg-kestrel-teal' : 'bg-white/40'}`} 
                style={{ width: bar.width }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 4 Drone Units (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-2 my-1">
        {fleet.map((drone) => (
          <div 
            key={drone.id} 
            className="p-2 rounded-xl bg-black/25 border border-white/[0.05] flex flex-col justify-between space-y-1.5 relative overflow-hidden"
          >
            {/* Slot Header */}
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-kestrel-cream font-medium">{drone.callsign}</span>
              <span className={`text-[9px] font-semibold ${
                drone.status === 'Low' ? 'text-[#a3e635]' : drone.status === 'Good' ? 'text-kestrel-teal' : 'text-kestrel-muted'
              }`}>
                {drone.status}
              </span>
            </div>

            {/* Action or Drone 3D Isometric Wireframe */}
            {drone.hasReturnButton ? (
              <button
                onClick={() => triggerReturn(drone.id)}
                className="w-full py-1.5 rounded-lg bg-[#263742] hover:bg-[#344856] text-kestrel-teal text-[10px] font-mono font-medium border border-kestrel-teal/30 hover:border-kestrel-teal transition-all shadow-sm flex items-center justify-center space-x-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-kestrel-teal animate-ping" />
                <span>Return</span>
              </button>
            ) : (
              <div className="w-full h-8 flex items-center justify-center relative">
                {/* 3D Isometric Drone Silhouette with Landing Skids and Rotors */}
                <svg className="w-12 h-7" viewBox="0 0 48 28" fill="none">
                  {/* Arms */}
                  <line x1="8" y1="8" x2="40" y2="20" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  <line x1="8" y1="20" x2="40" y2="8" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  {/* Landing Skids */}
                  <line x1="14" y1="18" x2="34" y2="18" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
                  <line x1="14" y1="23" x2="34" y2="23" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
                  <line x1="18" y1="14" x2="16" y2="18" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                  <line x1="30" y1="14" x2="32" y2="18" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                  {/* Fuselage Pod */}
                  <rect x="20" y="10" width="8" height="6" rx="1.5" fill="#1c2734" stroke="#3ce6b8" strokeWidth="1" />
                  <circle cx="24" cy="13" r="1.5" fill="#3ce6b8" />
                  {/* 4 Rotor Discs */}
                  <ellipse cx="8" cy="8" rx="5" ry="2" stroke="#3ce6b8" strokeWidth="0.8" fill="rgba(60,230,184,0.15)" />
                  <ellipse cx="40" cy="8" rx="5" ry="2" stroke="#3ce6b8" strokeWidth="0.8" fill="rgba(60,230,184,0.15)" />
                  <ellipse cx="8" cy="20" rx="5" ry="2" stroke="#3ce6b8" strokeWidth="0.8" fill="rgba(60,230,184,0.15)" />
                  <ellipse cx="40" cy="20" rx="5" ry="2" stroke="#3ce6b8" strokeWidth="0.8" fill="rgba(60,230,184,0.15)" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
