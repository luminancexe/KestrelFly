import React from 'react';
import { useFlightStore } from '../../store/flightStore';
import { NuclearDangerAtom3D } from './NuclearDangerAtom3D';

export const NuclearDangerCard: React.FC = () => {
  const { inspection } = useFlightStore();

  return (
    <div className="w-60 hazard-panel p-3.5 rounded-2xl select-none shadow-hazard-glow pointer-events-auto transition-all duration-300">
      {/* Hazard Title */}
      <div className="text-xs font-semibold text-white tracking-wide mb-1 flex items-center justify-between">
        <span>Nuclear Danger!</span>
        <span className="w-2 h-2 rounded-full bg-kestrel-orange animate-ping" />
      </div>

      {/* Real Three.js 3D Animated Atomic Nucleus with Orbiting Electrons */}
      <div className="relative w-full h-28 my-1 flex items-center justify-center">
        <NuclearDangerAtom3D />
      </div>

      {/* Hazard Chemical Breakdown Metrics */}
      <div className="space-y-2 mt-1">
        {/* Hydrogen */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono text-kestrel-muted mb-0.5">
            <span>Hydrogen</span>
            <span className="text-white font-medium">{inspection.hydrogenPercent}%</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#a3e635] rounded-full transition-all duration-500 shadow-[0_0_6px_#a3e635]" 
              style={{ width: `${inspection.hydrogenPercent}%` }}
            />
          </div>
        </div>

        {/* Uranium Oxide */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono text-kestrel-muted mb-0.5">
            <span>Uranium Oxide</span>
            <span className="text-kestrel-orange font-medium">{inspection.uraniumOxidePercent}%</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-[0_0_8px_#ff4500] transition-all duration-500" 
              style={{ width: `${inspection.uraniumOxidePercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
