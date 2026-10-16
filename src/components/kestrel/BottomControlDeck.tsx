import React from 'react';
import { KestrelCarrierCard } from './KestrelCarrierCard';
import { TacticalModeCards } from './TacticalModeCards';
import { FleetStatusCard } from './FleetStatusCard';

export const BottomControlDeck: React.FC = () => {
  return (
    <footer className="absolute bottom-4 left-6 right-6 z-40 select-none pointer-events-auto">
      <div className="grid grid-cols-12 gap-3 items-stretch">
        {/* Module A: Carrier USV Vessel (Left 3 columns) */}
        <div className="col-span-3">
          <KestrelCarrierCard />
        </div>

        {/* Module B: 10 Tactical Mission Modes (Center 6 columns) */}
        <div className="col-span-6 kestrel-panel p-2.5 rounded-2xl shadow-kestrel-card flex flex-col justify-between">
          <TacticalModeCards />
        </div>

        {/* Module C: Drone Fleet Squad (Right 3 columns) */}
        <div className="col-span-3">
          <FleetStatusCard />
        </div>
      </div>
    </footer>
  );
};
