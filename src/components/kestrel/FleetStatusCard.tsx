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
              <div className="w-full h-7 flex items-center justify-center">
                {/* Animated Isometric Drone Vector with Rotating Props */}
                <div className="w-8 h-5 border border-white/30 rounded flex items-center justify-center relative">
                  <span className="w-1 h-1 bg-kestrel-teal rounded-full shadow-[0_0_6px_#3ce6b8]" />
                  {/* Rotor 1 */}
                  <div className="absolute -top-1 -left-1 w-2.5 h-[1.5px] bg-white animate-spin" />
                  {/* Rotor 2 */}
                  <div className="absolute -top-1 -right-1 w-2.5 h-[1.5px] bg-white animate-spin" />
                  {/* Rotor 3 */}
                  <div className="absolute -bottom-1 -left-1 w-2.5 h-[1.5px] bg-white animate-spin" />
                  {/* Rotor 4 */}
                  <div className="absolute -bottom-1 -right-1 w-2.5 h-[1.5px] bg-white animate-spin" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
