import React, { useState } from 'react';
import { useFlightStore } from '../../store/flightStore';
import { FlightMode } from '../../types/telemetry';
import { 
  Play, 
  RotateCcw, 
  AlertOctagon, 
  PauseCircle, 
  Sliders, 
  ShieldCheck, 
  Square 
} from 'lucide-react';

export const BottomDock: React.FC = () => {
  const { 
    activeDrone, 
    executeCommand, 
    setFlightMode 
  } = useFlightStore();
  const drone = activeDrone();

  const [confirmAbort, setConfirmAbort] = useState(false);

  const handleAbort = () => {
    if (!confirmAbort) {
      setConfirmAbort(true);
      setTimeout(() => setConfirmAbort(false), 4000);
      return;
    }
    executeCommand('ABORT');
    setConfirmAbort(false);
  };

  const flightModes: FlightMode[] = [
    'MANUAL',
    'AUTONOMOUS_NAV',
    'ORBIT',
    'PERIMETER_SURVEY'
  ];

  return (
    <footer className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 select-none pointer-events-none max-w-[94vw]">
      <div className="raktor-panel p-1.5 pl-3 pr-2.5 rounded-full flex items-center space-x-2 pointer-events-auto shadow-raktor-dock overflow-x-auto scrollbar-none whitespace-nowrap">
        {/* Mode Selector */}
        <div className="flex items-center space-x-1 border-r border-white/10 pr-2 shrink-0">
          <div className="text-[9px] font-mono uppercase text-raktor-creamDark hidden md:flex items-center space-x-1 mr-1">
            <Sliders className="w-3 h-3 text-raktor-orange shrink-0" />
            <span>MODE:</span>
          </div>
          <div className="flex space-x-1 shrink-0">
            {flightModes.map((mode) => {
              const isActive = drone.mode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setFlightMode(mode)}
                  className={`px-2.5 py-1 text-[10px] font-mono rounded-full transition-all shrink-0 ${
                    isActive
                      ? 'bg-raktor-orange text-white font-bold shadow-raktor-glow'
                      : 'text-raktor-creamMuted hover:text-raktor-cream hover:bg-white/[0.04]'
                  }`}
                >
                  {mode.replace('_', ' ')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Mission Command Actions */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {/* Main Action Trigger */}
          {drone.status === 'STANDBY' ? (
            <button
              onClick={() => executeCommand('ARM')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-raktor-amber/20 text-raktor-amber border border-raktor-amber/40 hover:bg-raktor-amber/30 text-xs font-mono font-bold transition-all shrink-0"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ARM</span>
            </button>
          ) : drone.status === 'ARMED' ? (
            <button
              onClick={() => executeCommand('LAUNCH')}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-raktor-orange hover:bg-raktor-orangeBright text-white font-mono font-bold text-xs shadow-raktor-glow transition-all shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>LAUNCH MISSION</span>
            </button>
          ) : (
            <button
              onClick={() => executeCommand('DISARM')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] text-raktor-creamMuted hover:bg-white/10 text-xs font-mono transition-all shrink-0"
            >
              <Square className="w-3 h-3" />
              <span>DISARM</span>
            </button>
          )}

          {/* Hold / Loiter */}
          <button
            onClick={() => executeCommand('HOLD')}
            disabled={drone.status === 'STANDBY'}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/10 text-raktor-cream text-xs font-mono disabled:opacity-40 disabled:pointer-events-none transition-all shrink-0"
          >
            <PauseCircle className="w-3.5 h-3.5 text-raktor-creamMuted" />
            <span>HOLD</span>
          </button>

          {/* Return to Home (RTH) */}
          <button
            onClick={() => executeCommand('RTH')}
            disabled={drone.status === 'STANDBY'}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/10 text-raktor-cream text-xs font-mono font-semibold disabled:opacity-40 disabled:pointer-events-none transition-all shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-raktor-orange" />
            <span>RTH</span>
          </button>

          {/* Emergency Abort */}
          <button
            onClick={handleAbort}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-mono font-bold border transition-all shrink-0 ${
              confirmAbort
                ? 'bg-raktor-rose text-white border-raktor-rose animate-pulse'
                : 'bg-raktor-rose/15 border-raktor-rose/30 text-raktor-rose hover:bg-raktor-rose/25'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>{confirmAbort ? 'CONFIRM?' : 'ABORT'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
