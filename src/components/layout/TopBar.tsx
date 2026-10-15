import React, { useState, useEffect } from 'react';
import { useFlightStore } from '../../store/flightStore';
import { 
  Radio, 
  Battery, 
  Satellite, 
  Clock, 
  Wind, 
  CloudSun, 
  Play, 
  Pause,
  User
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const { 
    telemetry, 
    isSimulating, 
    toggleSimulation,
    missions,
    activeMissionId
  } = useFlightStore();
  const currentMission = missions.find(m => m.id === activeMissionId) || missions[0];

  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="absolute top-3 left-4 right-4 z-40 select-none flex items-center justify-between pointer-events-none gap-2">
      {/* Left: Brand & Active Mission Selector Pill */}
      <div className="flex items-center space-x-2.5 pointer-events-auto shrink-0">
        {/* Brand Mark */}
        <div className="raktor-panel px-3.5 py-2 rounded-2xl flex items-center space-x-2.5 shrink-0 shadow-raktor-card">
          <div className="w-7 h-7 rounded-xl bg-raktor-orange flex items-center justify-center shadow-raktor-glow shrink-0">
            <span className="font-display font-bold text-white text-base">R</span>
          </div>
          <div className="flex items-center space-x-2 whitespace-nowrap">
            <span className="font-display font-bold tracking-wider text-sm text-raktor-cream">
              RAKTOR<span className="text-raktor-orange">.</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest px-1.5 py-0.5 rounded-full bg-raktor-orange/15 text-raktor-orange border border-raktor-orange/30 font-bold">
              MISSION OS
            </span>
          </div>
        </div>

        {/* Mission Selector Card */}
        <div className="hidden md:flex items-center space-x-2.5 raktor-panel px-3.5 py-2 rounded-2xl shrink-0 shadow-raktor-card">
          <div className="w-2 h-2 rounded-full bg-raktor-orange animate-pulse shrink-0" />
          <div className="flex flex-col whitespace-nowrap leading-tight">
            <span className="text-[9px] font-mono text-raktor-creamDark uppercase tracking-wider">Active Mission</span>
            <span className="text-xs font-semibold text-raktor-cream truncate max-w-[200px]">{currentMission.name}</span>
          </div>
        </div>
      </div>

      {/* Center: Atmospheric & Flight Link Telemetry Pills */}
      <div className="hidden xl:flex items-center space-x-2 pointer-events-auto shrink-0">
        {/* Weather / Wind */}
        <div className="raktor-panel px-3 py-1.5 rounded-2xl flex items-center space-x-2 text-xs font-mono text-raktor-creamMuted shadow-raktor-card whitespace-nowrap">
          <Wind className="w-3.5 h-3.5 text-raktor-orange shrink-0" />
          <span className="text-raktor-cream font-semibold">4.8 m/s NE</span>
          <span className="text-white/20">|</span>
          <CloudSun className="w-3.5 h-3.5 text-raktor-creamDark shrink-0" />
          <span>22°C Clear</span>
        </div>

        {/* Satellite & Link Latency */}
        <div className="raktor-panel px-3 py-1.5 rounded-2xl flex items-center space-x-2.5 text-xs font-mono text-raktor-creamMuted shadow-raktor-card whitespace-nowrap">
          <div className="flex items-center space-x-1.5">
            <Satellite className="w-3.5 h-3.5 text-raktor-emerald shrink-0" />
            <span className="text-raktor-cream font-semibold">{telemetry.satellites}</span>
            <span className="text-[10px] text-raktor-creamDark">SAT</span>
          </div>
          <span className="text-white/20">|</span>
          <div className="flex items-center space-x-1.5">
            <Radio className="w-3.5 h-3.5 text-raktor-emerald shrink-0" />
            <span className="text-raktor-cream font-semibold">{telemetry.linkLatency}ms</span>
          </div>
        </div>
      </div>

      {/* Right: Battery, Clock, Sim Toggle, and Operator Profile */}
      <div className="flex items-center space-x-2 pointer-events-auto shrink-0">
        {/* Battery Status Pill */}
        <div className="raktor-panel px-3 py-1.5 rounded-2xl flex items-center space-x-2 shadow-raktor-card shrink-0">
          <Battery className={`w-4 h-4 shrink-0 ${telemetry.battery > 30 ? 'text-raktor-emerald' : 'text-raktor-rose animate-pulse'}`} />
          <div className="flex items-baseline space-x-1 whitespace-nowrap">
            <span className="text-xs font-mono font-bold text-raktor-cream">{telemetry.battery}%</span>
            <span className="text-[9px] font-mono text-raktor-creamDark">({telemetry.estimatedTimeLeft.toFixed(0)}m)</span>
          </div>
        </div>

        {/* UTC Clock */}
        <div className="hidden sm:flex items-center space-x-1.5 text-xs font-mono text-raktor-cream raktor-panel px-3 py-1.5 rounded-2xl shadow-raktor-card shrink-0 whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 text-raktor-orange shrink-0" />
          <span>{utcTime || '00:00:00 UTC'}</span>
        </div>

        {/* Simulation Pause / Resume */}
        <button
          onClick={toggleSimulation}
          title={isSimulating ? "Pause Telemetry Simulation" : "Resume Telemetry Simulation"}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl text-xs font-mono border transition-all shrink-0 whitespace-nowrap shadow-raktor-card ${
            isSimulating
              ? 'raktor-panel text-raktor-orange border-raktor-orange/40 shadow-raktor-glow'
              : 'bg-black/60 text-raktor-creamDark border-white/10'
          }`}
        >
          {isSimulating ? <Pause className="w-3.5 h-3.5 shrink-0" /> : <Play className="w-3.5 h-3.5 shrink-0" />}
          <span className="hidden lg:inline">{isSimulating ? 'SIM: ON' : 'SIM: OFF'}</span>
        </button>

        {/* Operator Profile */}
        <div className="raktor-panel p-1 pl-2.5 rounded-2xl flex items-center space-x-2 shadow-raktor-card shrink-0">
          <div className="hidden lg:flex flex-col text-right whitespace-nowrap leading-tight">
            <span className="text-xs font-semibold text-raktor-cream">Alex Vance</span>
            <span className="text-[9px] font-mono text-raktor-creamDark">Operator</span>
          </div>
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-raktor-orange to-amber-500 flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0">
            <User className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </header>
  );
};
