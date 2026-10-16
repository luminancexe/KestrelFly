import React, { useEffect } from 'react';
import { TopNavigation } from './components/kestrel/TopNavigation';
import { OceanScene } from './components/kestrel/OceanScene';
import { LeftOverheadInfo } from './components/kestrel/LeftOverheadInfo';
import { RightControls } from './components/kestrel/RightControls';
import { BottomControlDeck } from './components/kestrel/BottomControlDeck';
import { MissionReelControls } from './components/kestrel/MissionReelControls';
import { useFlightStore } from './store/flightStore';

export const App: React.FC = () => {
  const { updateThreatLevels } = useFlightStore();

  // Subtle breathing simulation for hazard levels
  useEffect(() => {
    const interval = setInterval(() => {
      const hydJitter = Math.min(100, Math.max(10, 32 + Math.floor(Math.sin(Date.now() / 2000) * 4)));
      const uraniumJitter = Math.min(100, Math.max(20, 71 + Math.floor(Math.cos(Date.now() / 1500) * 5)));
      updateThreatLevels(hydJitter, uraniumJitter);
    }, 1000);

    return () => clearInterval(interval);
  }, [updateThreatLevels]);

  return (
    <div className="relative w-screen h-screen bg-kestrel-bg text-kestrel-cream overflow-hidden font-sans select-none">
      {/* 1. Procedural High-Performance Living Ocean & Cruising Cargo Ship Canvas */}
      <OceanScene />

      {/* 2. Top Navigation Bar (KestrelFly Brand, Tabs, Action Icons) */}
      <TopNavigation />

      {/* 3. Cinematic Mission Reel Interactive Timeline Controller */}
      <MissionReelControls />

      {/* 4. Left Overhead Telemetry (Battery dots, Range, Serial) */}
      <LeftOverheadInfo />

      {/* 5. Right Controls (Smooth Camera Zoom Pill & Dual Radar Dials) */}
      <RightControls />

      {/* 6. Master Bottom Control Deck (USV Boat, 10 Mission Modes, Fleet Squad) */}
      <BottomControlDeck />
    </div>
  );
};

export default App;
