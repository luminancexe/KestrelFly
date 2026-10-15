import React from 'react';
import { useFlightStore } from '../../store/flightStore';
import { 
  CheckCircle2, 
  CircleDot, 
  Plane 
} from 'lucide-react';

export const LeftSidebar: React.FC = () => {
  const { 
    fleet, 
    activeDroneId, 
    setActiveDrone, 
    missions, 
    activeMissionId 
  } = useFlightStore();

  const currentMission = missions.find(m => m.id === activeMissionId) || missions[0];

  const waypoints = [
    { id: 'wp-1', name: 'Launch & Vertical Climb', alt: '100m', speed: '12m/s', status: 'COMPLETED' },
    { id: 'wp-2', name: 'North Transit Corridor', alt: '120m', speed: '16m/s', status: 'COMPLETED' },
    { id: 'wp-3', name: 'Perimeter Thermal Sweep', alt: '125m', speed: '14m/s', status: 'IN_PROGRESS' },
    { id: 'wp-4', name: 'Facility Structure Inspect', alt: '110m', speed: '10m/s', status: 'PENDING' },
    { id: 'wp-5', name: 'Return Home & Auto-Land', alt: '0m', speed: '8m/s', status: 'PENDING' },
  ];

  return (
    <aside className="w-80 max-h-full overflow-y-auto pointer-events-auto select-none space-y-2.5 pr-0.5">
      {/* Main Mission Journey Card */}
      <div className="raktor-panel p-3.5 rounded-3xl space-y-3 shadow-raktor-card">
        {/* Mission Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-raktor-orange font-bold bg-raktor-orange/15 px-2 py-0.5 rounded-full border border-raktor-orange/30">
              {currentMission.code}
            </span>
            <span className="text-[10px] font-mono text-raktor-emerald flex items-center space-x-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-raktor-emerald animate-ping" />
              <span>AUTONOMOUS</span>
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-raktor-cream font-display tracking-wide truncate">
            {currentMission.name}
          </h2>
        </div>

        {/* Mission Progress Bar & Distance Stats */}
        <div className="p-2.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-raktor-creamMuted">Mission Progress</span>
            <span className="text-raktor-orange font-bold">62% COMPLETED</span>
          </div>
          {/* Progress Bar with Raktor Orange Accent */}
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-raktor-orangeDark via-raktor-orange to-amber-400 w-[62%] rounded-full shadow-raktor-glow" />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-raktor-creamDark pt-0.5">
            <span>DIST: 4.2 / {currentMission.totalDistanceKm} km</span>
            <span>ETA: 8m 40s</span>
          </div>
        </div>

        {/* Waypoint Steps Timeline */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono uppercase text-raktor-creamDark tracking-wider flex items-center justify-between px-1">
            <span>Flight Path Timeline</span>
            <span>5 Waypoints</span>
          </div>

          <div className="space-y-1">
            {waypoints.map((wp, index) => {
              const isDone = wp.status === 'COMPLETED';
              const isCurrent = wp.status === 'IN_PROGRESS';

              return (
                <div
                  key={wp.id}
                  className={`p-2 rounded-xl border flex items-center justify-between transition-all gap-2 ${
                    isCurrent
                      ? 'bg-raktor-orange/15 border-raktor-orange/40 shadow-raktor-glow'
                      : isDone
                      ? 'bg-white/[0.02] border-white/[0.04] opacity-80'
                      : 'bg-transparent border-white/[0.03] opacity-40'
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <div className="shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-raktor-emerald" />
                      ) : isCurrent ? (
                        <CircleDot className="w-3.5 h-3.5 text-raktor-orange animate-pulse" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-white/20 flex items-center justify-center text-[8px] font-mono text-white/40">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`text-[11px] font-medium leading-snug truncate ${isCurrent ? 'text-raktor-cream font-semibold' : 'text-raktor-creamMuted'}`}>
                        {wp.name}
                      </div>
                      <div className="text-[9px] font-mono text-raktor-creamDark">
                        {wp.alt} • {wp.speed}
                      </div>
                    </div>
                  </div>

                  {isCurrent && (
                    <span className="shrink-0 text-[8px] font-mono text-raktor-orange bg-raktor-orange/20 px-1.5 py-0.5 rounded-full border border-raktor-orange/30 font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fleet Switcher Dock */}
      <div className="raktor-panel p-2.5 rounded-2xl space-y-1.5 shadow-raktor-card">
        <div className="text-[10px] font-mono uppercase text-raktor-creamDark tracking-wider px-1 flex items-center justify-between">
          <span>Active Fleet [{fleet.length}]</span>
          <Plane className="w-3 h-3 text-raktor-creamDark" />
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {fleet.map((uav) => {
            const isSelected = uav.id === activeDroneId;
            return (
              <button
                key={uav.id}
                onClick={() => setActiveDrone(uav.id)}
                className={`py-1.5 px-2 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-raktor-orange text-white border-raktor-orange shadow-raktor-glow font-bold'
                    : 'bg-white/[0.03] border-white/[0.06] text-raktor-creamMuted hover:border-white/20'
                }`}
              >
                <div className="text-[11px] font-mono leading-tight">{uav.callsign.split('-')[1]}</div>
                <div className={`text-[8px] font-mono leading-tight ${isSelected ? 'text-white/80' : 'text-raktor-creamDark'}`}>
                  {uav.status === 'IN_FLIGHT' ? '84%' : 'STANDBY'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
