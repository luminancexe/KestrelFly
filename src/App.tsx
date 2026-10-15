import React, { useEffect } from 'react';
import { TopBar } from './components/layout/TopBar';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { CenterViewport } from './components/layout/CenterViewport';
import { RightTelemetryBar } from './components/layout/RightTelemetryBar';
import { BottomDock } from './components/layout/BottomDock';
import { useFlightStore } from './store/flightStore';

export const App: React.FC = () => {
  const { isSimulating, updateTelemetry, telemetry } = useFlightStore();

  // Smooth Telemetry Simulation Loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      const jitterYaw = (telemetry.yaw + 0.25) % 360;
      const jitterPitch = -3.2 + Math.sin(Date.now() / 1400) * 1.2;
      const jitterRoll = 4.1 + Math.cos(Date.now() / 1100) * 1.8;
      const jitterAlt = 124.6 + Math.sin(Date.now() / 2200) * 1.1;
      const jitterSpeed = 14.8 + Math.cos(Date.now() / 1300) * 0.7;
      const jitterCurrent = 16.4 + Math.sin(Date.now() / 900) * 0.5;

      updateTelemetry({
        yaw: jitterYaw,
        pitch: jitterPitch,
        roll: jitterRoll,
        altitude: jitterAlt,
        groundSpeed: jitterSpeed,
        currentDraw: jitterCurrent,
        flightTime: telemetry.flightTime + 1,
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isSimulating, telemetry.yaw, telemetry.flightTime, updateTelemetry]);

  return (
    <div className="relative w-screen h-screen bg-raktor-bg text-raktor-cream overflow-hidden font-sans select-none">
      {/* 1. Fullscreen Immersive Geospatial Tactical Map */}
      <CenterViewport />

      {/* 2. Floating Top Navigation Bar */}
      <TopBar />

      {/* 3. Floating Left Mission & Waypoint Panel */}
      <div className="absolute top-18 left-4 bottom-20 z-30 pointer-events-none flex flex-col justify-start">
        <LeftSidebar />
      </div>

      {/* 4. Floating Right Telemetry & Vision Deck */}
      <div className="absolute top-18 right-4 bottom-20 z-30 pointer-events-none flex flex-col justify-start">
        <RightTelemetryBar />
      </div>

      {/* 5. Floating Bottom Command Dock */}
      <BottomDock />
    </div>
  );
};

export default App;
