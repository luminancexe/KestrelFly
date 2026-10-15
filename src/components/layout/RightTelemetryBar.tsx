import React, { useState } from 'react';
import { useFlightStore } from '../../store/flightStore';
import { 
  Gauge, 
  Wind, 
  Compass, 
  Zap, 
  Navigation2 
} from 'lucide-react';

export const RightTelemetryBar: React.FC = () => {
  const { telemetry } = useFlightStore();

  const [cameraMode, setCameraMode] = useState<'OPTICAL' | 'THERMAL' | 'NIGHT_VISION'>('OPTICAL');

  return (
    <aside className="w-80 max-h-full overflow-y-auto pointer-events-auto select-none space-y-2.5 pr-0.5">
      {/* Primary Flight Telemetry Card */}
      <div className="raktor-panel p-3.5 rounded-3xl space-y-3 shadow-raktor-card">
        {/* Header */}
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-raktor-creamDark">
          <div className="flex items-center space-x-1.5">
            <Gauge className="w-3.5 h-3.5 text-raktor-orange" />
            <span className="text-raktor-cream font-bold">Flight Dynamics</span>
          </div>
          <span className="text-raktor-orange text-[9px] bg-raktor-orange/15 px-1.5 py-0.5 rounded-full border border-raktor-orange/30 font-bold">
            60 FPS
          </span>
        </div>

        {/* Dual Cards: Altitude & Speed */}
        <div className="grid grid-cols-2 gap-2">
          {/* Altitude */}
          <div className="p-2.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl relative">
            <div className="text-[9px] font-mono text-raktor-creamDark uppercase tracking-wider truncate">
              Altitude (AGL)
            </div>
            <div className="mt-0.5 flex items-baseline space-x-1">
              <span className="text-2xl font-mono font-bold text-raktor-cream tracking-tight">
                {telemetry.altitude.toFixed(1)}
              </span>
              <span className="text-[10px] font-mono text-raktor-creamDark">m</span>
            </div>
            <div className="mt-1.5 text-[9px] font-mono text-raktor-creamDark flex items-center justify-between border-t border-white/[0.04] pt-1">
              <span>Target:</span>
              <span className="text-raktor-orange font-bold">{telemetry.targetAltitude}m</span>
            </div>
          </div>

          {/* Speed */}
          <div className="p-2.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl relative">
            <div className="text-[9px] font-mono text-raktor-creamDark uppercase tracking-wider flex items-center justify-between">
              <span>Ground Speed</span>
              <Wind className="w-2.5 h-2.5 text-raktor-creamDark" />
            </div>
            <div className="mt-0.5 flex items-baseline space-x-1">
              <span className="text-2xl font-mono font-bold text-raktor-cream tracking-tight">
                {telemetry.groundSpeed.toFixed(1)}
              </span>
              <span className="text-[10px] font-mono text-raktor-creamDark">m/s</span>
            </div>
            <div className="mt-1.5 text-[9px] font-mono text-raktor-creamDark flex items-center justify-between border-t border-white/[0.04] pt-1">
              <span>Mach:</span>
              <span className="text-raktor-cream font-bold">{(telemetry.groundSpeed * 3.6).toFixed(0)} km/h</span>
            </div>
          </div>
        </div>

        {/* Artificial Horizon & Attitude Gyro */}
        <div className="p-2.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
          <div className="flex items-center justify-between text-[10px] font-mono text-raktor-creamDark mb-1.5">
            <span className="flex items-center space-x-1">
              <Compass className="w-3 h-3 text-raktor-orange" />
              <span>Attitude Gyro</span>
            </span>
            <span className="text-raktor-cream font-bold">HEADING {telemetry.yaw.toFixed(0)}°</span>
          </div>

          <div className="flex items-center justify-center py-1.5 relative">
            <div className="w-18 h-18 rounded-full border border-white/10 bg-black/40 flex items-center justify-center relative">
              {/* Compass Needle */}
              <div 
                className="absolute w-full h-full flex items-center justify-center transition-transform duration-300"
                style={{ transform: `rotate(${telemetry.yaw}deg)` }}
              >
                <Navigation2 className="w-6 h-6 text-raktor-orange fill-raktor-orange/40" />
              </div>
              <span className="text-[10px] font-mono font-bold text-raktor-cream z-10 bg-black/80 px-1 rounded-full border border-white/10">
                {telemetry.yaw.toFixed(0)}°
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-1.5 pt-1.5 border-t border-white/[0.05] text-[11px] font-mono text-center">
            <div className="bg-black/30 py-1 px-1.5 rounded-xl">
              <div className="text-[9px] text-raktor-creamDark">PITCH</div>
              <div className="font-bold text-raktor-cream">{telemetry.pitch > 0 ? `+${telemetry.pitch.toFixed(1)}` : telemetry.pitch.toFixed(1)}°</div>
            </div>
            <div className="bg-black/30 py-1 px-1.5 rounded-xl">
              <div className="text-[9px] text-raktor-creamDark">ROLL</div>
              <div className="font-bold text-raktor-cream">{telemetry.roll > 0 ? `+${telemetry.roll.toFixed(1)}` : telemetry.roll.toFixed(1)}°</div>
            </div>
          </div>
        </div>

        {/* 6S Battery Pack Cells */}
        <div className="p-2.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="flex items-center space-x-1 text-raktor-creamDark">
              <Zap className="w-3 h-3 text-raktor-orange" />
              <span>6S LiPo Cells</span>
            </span>
            <span className="text-raktor-emerald font-bold">{telemetry.voltage.toFixed(1)}V • {telemetry.currentDraw.toFixed(1)}A</span>
          </div>

          <div className="grid grid-cols-6 gap-1">
            {telemetry.cellVoltages.map((volt, idx) => (
              <div key={idx} className="bg-black/40 py-1 px-0.5 rounded-lg text-center border border-white/[0.05]">
                <div className="text-[7px] font-mono text-raktor-creamDark">C{idx + 1}</div>
                <div className="text-[9px] font-mono font-bold text-raktor-cream">{volt.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Payload Live Camera Feed Preview */}
      <div className="raktor-panel p-2.5 rounded-3xl space-y-1.5 shadow-raktor-card relative overflow-hidden">
        <div className="flex items-center justify-between text-[11px] font-mono px-1">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-raktor-rose animate-pulse" />
            <span className="text-raktor-cream font-bold">Gimbal AI Vision</span>
          </div>
          <span className="text-[9px] font-mono text-raktor-creamDark bg-white/[0.05] px-1.5 py-0.5 rounded-full">
            4K 60FPS
          </span>
        </div>

        {/* Video Canvas Container */}
        <div className={`w-full h-28 rounded-2xl relative overflow-hidden flex items-center justify-center ${
          cameraMode === 'THERMAL' 
            ? 'bg-gradient-to-tr from-purple-950 via-orange-900 to-amber-500' 
            : cameraMode === 'NIGHT_VISION'
            ? 'bg-gradient-to-b from-green-950 via-emerald-950 to-black'
            : 'bg-gradient-to-b from-zinc-900 to-black'
        }`}>
          {/* Target Reticle */}
          <div className="w-12 h-12 border border-raktor-orange/40 rounded-full flex items-center justify-center pointer-events-none">
            <div className="w-1 h-1 rounded-full bg-raktor-orange" />
          </div>

          {/* AI Bounding Box */}
          <div className="absolute top-2 left-4 border border-raktor-orange bg-raktor-orange/10 rounded px-1 py-0.5 pointer-events-none">
            <div className="text-[7px] font-mono font-bold text-raktor-orange bg-black/80 px-1 rounded">
              VEHICLE 98.4%
            </div>
          </div>

          {/* Camera Filter Buttons */}
          <div className="absolute bottom-1.5 left-1.5 flex items-center space-x-1 bg-black/80 backdrop-blur px-1.5 py-0.5 rounded-xl border border-white/10 text-[9px] font-mono">
            <button
              onClick={() => setCameraMode('OPTICAL')}
              className={`px-1.5 py-0.5 rounded-lg transition-colors ${cameraMode === 'OPTICAL' ? 'bg-raktor-orange text-white font-bold' : 'text-raktor-creamMuted'}`}
            >
              RGB
            </button>
            <button
              onClick={() => setCameraMode('THERMAL')}
              className={`px-1.5 py-0.5 rounded-lg transition-colors ${cameraMode === 'THERMAL' ? 'bg-raktor-orange text-white font-bold' : 'text-raktor-creamMuted'}`}
            >
              FLIR
            </button>
            <button
              onClick={() => setCameraMode('NIGHT_VISION')}
              className={`px-1.5 py-0.5 rounded-lg transition-colors ${cameraMode === 'NIGHT_VISION' ? 'bg-raktor-orange text-white font-bold' : 'text-raktor-creamMuted'}`}
            >
              NIGHT
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
