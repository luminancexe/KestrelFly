import React, { useEffect, useRef } from 'react';
import { useFlightStore } from '../../store/flightStore';
import { TacticalMissionMode } from '../../types/telemetry';

export const TacticalModeCards: React.FC = () => {
  const { activeMode, setActiveMode, setMissionPhase } = useFlightStore();
  const inspectionCanvasRef = useRef<HTMLCanvasElement>(null);

  // Live 3D Topographical Mesh undulating animation for the "Inspection" card
  useEffect(() => {
    const canvas = inspectionCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const renderMesh = () => {
      frame += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const rows = 12;
      const cols = 18;
      const cellW = canvas.width / (cols + 2);
      const cellH = canvas.height / (rows + 4);

      // Precompute 2D grid of 3D terrain points
      const grid: { x: number; y: number; elevation: number }[][] = [];
      for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
          const elevation = 
            Math.sin(c * 0.45 + frame) * 5 +
            Math.cos(r * 0.5 + frame * 0.8) * 6 -
            (Math.sin((c - cols / 2) * 0.35) * Math.cos((r - rows / 2) * 0.35)) * 14;

          const isoX = 12 + c * cellW + (rows - r) * 1.6;
          const isoY = 16 + r * cellH + elevation;
          grid[r][c] = { x: isoX, y: isoY, elevation };
        }
      }

      // 1. Draw Longitudinal Row Lines
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const pt = grid[r][c];
          if (c === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        const rowPeak = Math.sin(r * 0.5 + frame);
        ctx.strokeStyle = rowPeak > 0.3 ? 'rgba(245, 158, 11, 0.85)' : rowPeak > -0.2 ? 'rgba(16, 185, 129, 0.75)' : 'rgba(56, 189, 248, 0.65)';
        ctx.lineWidth = 0.85;
        ctx.stroke();
      }

      // 2. Draw Transverse Column Lines for 3D Lattice Grid
      for (let c = 0; c < cols; c += 2) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const pt = grid[r][c];
          if (r === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // 3. Draw Peak Summit Point Cloud Particles (Gold & Lime)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const pt = grid[r][c];
          if (pt.elevation < -6) {
            ctx.fillStyle = '#fde047';
            ctx.fillRect(pt.x - 0.75, pt.y - 0.75, 1.5, 1.5);
          }
        }
      }

      animId = requestAnimationFrame(renderMesh);
    };

    renderMesh();
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleSelectMode = (mode: TacticalMissionMode) => {
    setActiveMode(mode);
    if (mode === 'Inspection') setMissionPhase('threat_locked');
    else if (mode === 'Perimeter' || mode === 'Tracking') setMissionPhase('bridge_scan');
    else setMissionPhase('approach');
  };

  return (
    <div className="grid grid-cols-5 gap-1.5 h-full select-none">
      
      {/* 1. TRACKING */}
      <button
        onClick={() => handleSelectMode('Tracking')}
        className={`p-2 rounded-xl flex flex-col items-center justify-between transition-all ${
          activeMode === 'Tracking' ? 'kestrel-panel-active' : 'bg-black/30 hover:bg-white/[0.04]'
        }`}
      >
        <span className="text-[10px] font-mono text-kestrel-muted self-start">Tracking</span>
        <div className="w-11 h-11 relative flex items-center justify-center my-0.5">
          {/* Static Concentric Circles */}
          <div className="w-9 h-9 rounded-full border border-white/20" />
          <div className="w-5 h-5 rounded-full border border-white/10 absolute" />
          {/* Rotating Conic Radar Sweep */}
          <div className="absolute inset-1 rounded-full border-t-2 border-r border-kestrel-teal animate-spin-slow" />
          <span className="w-1.5 h-1.5 rounded-full bg-kestrel-teal shadow-[0_0_6px_#3ce6b8]" />
          {/* Detected Target Blip */}
          <span className="absolute top-2 right-2 w-1 h-1 rounded-full bg-white animate-ping" />
        </div>
      </button>

      {/* 2. PERIMETER */}
      <button
        onClick={() => handleSelectMode('Perimeter')}
        className={`p-2 rounded-xl flex flex-col items-center justify-between transition-all ${
          activeMode === 'Perimeter' ? 'kestrel-panel-active' : 'bg-black/30 hover:bg-white/[0.04]'
        }`}
      >
        <span className="text-[10px] font-mono text-kestrel-muted self-start">Perimeter</span>
        <div className="w-11 h-11 relative flex items-center justify-center my-0.5">
          {/* Pulsing Boundary Ring */}
          <div className="w-8 h-8 rounded-full border border-dashed border-white/40 animate-pulse" />
          <div className="w-4 h-4 border border-white/30 absolute" />
          {/* 4 Corner Boundary Chevrons */}
          <span className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 border-t-2 border-l-2 border-kestrel-teal" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 border-t-2 border-r-2 border-kestrel-teal" />
          <span className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 border-b-2 border-l-2 border-kestrel-teal" />
          <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 border-b-2 border-r-2 border-kestrel-teal" />
        </div>
      </button>

      {/* 3. INSPECTION (ACTIVE - Hero Mode with 3D Mesh & Flanking Drones) */}
      <button
        onClick={() => handleSelectMode('Inspection')}
        className={`p-2 rounded-xl flex flex-col items-center justify-between transition-all relative overflow-hidden ${
          activeMode === 'Inspection'
            ? 'bg-[#152332] border border-kestrel-teal/70 shadow-[0_0_20px_rgba(60,230,184,0.2)]'
            : 'bg-black/30 hover:bg-white/[0.04]'
        }`}
      >
        <div className="w-full flex items-center justify-between">
          <span className="text-[10px] font-mono text-kestrel-teal font-semibold">Inspection</span>
          <span className="w-1.5 h-1.5 rounded-full bg-kestrel-teal animate-ping" />
        </div>

        {/* 3D Wireframe Box Container with Undulating Canvas Mesh */}
        <div className="w-full h-11 relative flex items-center justify-between px-1 my-0.5">
          {/* Left Flanking Drone */}
          <div className="w-5 h-5 relative flex items-center justify-center">
            <div className="w-3.5 h-2 bg-[#172330] border border-kestrel-teal/80 rounded-sm relative">
              <span className="w-1 h-1 bg-kestrel-teal rounded-full absolute top-0.5 left-1 shadow-[0_0_4px_#3ce6b8]" />
            </div>
            {/* 4 Rotors with spinning blades */}
            <span className="absolute -top-1 -left-1 w-2.5 h-[1.5px] bg-[#a3e635] animate-spin" />
            <span className="absolute -top-1 -right-1 w-2.5 h-[1.5px] bg-[#a3e635] animate-spin" />
            <span className="absolute -bottom-1 -left-1 w-2.5 h-[1.5px] bg-[#a3e635] animate-spin" />
            <span className="absolute -bottom-1 -right-1 w-2.5 h-[1.5px] bg-[#a3e635] animate-spin" />
          </div>

          {/* Center 3D Wireframe Box & Canvas Mesh */}
          <div className="relative flex-1 h-full mx-1 border border-white/20 rounded-md overflow-hidden bg-black/40 shadow-inner">
            <canvas ref={inspectionCanvasRef} width={110} height={42} className="w-full h-full" />
          </div>

          {/* Right Flanking Drone */}
          <div className="w-5 h-5 relative flex items-center justify-center">
            <div className="w-3.5 h-2 bg-[#172330] border border-kestrel-teal/80 rounded-sm relative">
              <span className="w-1 h-1 bg-kestrel-teal rounded-full absolute top-0.5 left-1 shadow-[0_0_4px_#3ce6b8]" />
            </div>
            {/* 4 Rotors with spinning blades */}
            <span className="absolute -top-1 -left-1 w-2.5 h-[1.5px] bg-[#a3e635] animate-spin" />
            <span className="absolute -top-1 -right-1 w-2.5 h-[1.5px] bg-[#a3e635] animate-spin" />
            <span className="absolute -bottom-1 -left-1 w-2.5 h-[1.5px] bg-[#a3e635] animate-spin" />
            <span className="absolute -bottom-1 -right-1 w-2.5 h-[1.5px] bg-[#a3e635] animate-spin" />
          </div>
        </div>
      </button>

      {/* 4. ESCORT */}
      <button
        onClick={() => handleSelectMode('Escort')}
        className={`p-2 rounded-xl flex flex-col items-center justify-between transition-all ${
          activeMode === 'Escort' ? 'kestrel-panel-active' : 'bg-black/30 hover:bg-white/[0.04]'
        }`}
      >
        <span className="text-[10px] font-mono text-kestrel-muted self-start">Escort</span>
        <div className="w-11 h-11 relative flex items-center justify-center my-0.5">
          {/* Concentric Elliptical Orbits */}
          <div className="w-9 h-6 rounded-full border border-white/30 rotate-12" />
          <div className="w-7 h-5 rounded-full border border-white/20 -rotate-12 absolute" />
          <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff]" />
          {/* Orbiting Drone Node */}
          <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-kestrel-teal shadow-[0_0_8px_#3ce6b8] animate-pulse" />
        </div>
      </button>

      {/* 5. RELAY */}
      <button
        onClick={() => handleSelectMode('Relay')}
        className={`p-2 rounded-xl flex flex-col items-center justify-between transition-all ${
          activeMode === 'Relay' ? 'kestrel-panel-active' : 'bg-black/30 hover:bg-white/[0.04]'
        }`}
      >
        <span className="text-[10px] font-mono text-kestrel-muted self-start">Relay</span>
        <div className="w-11 h-11 relative flex items-center justify-center space-x-1 my-0.5">
          {/* Parabolic Antenna Pulses */}
          <span className="w-2 h-4 border-l-2 border-white/40 rounded-l-full" />
          <div className="w-6 h-6 rounded-full border border-dotted border-kestrel-teal flex items-center justify-center animate-spin-slow">
            <span className="w-1.5 h-1.5 bg-kestrel-teal rounded-full shadow-[0_0_6px_#3ce6b8]" />
          </div>
          <span className="w-2 h-4 border-r-2 border-white/40 rounded-r-full" />
        </div>
      </button>

      {/* 6. POINT ATTACK */}
      <button
        onClick={() => handleSelectMode('Point Attack')}
        className={`p-2 rounded-xl flex flex-col items-center justify-between transition-all ${
          activeMode === 'Point Attack' ? 'kestrel-panel-active' : 'bg-black/30 hover:bg-white/[0.04]'
        }`}
      >
        <span className="text-[10px] font-mono text-kestrel-muted self-start">Point Attack</span>
        <div className="w-11 h-11 relative flex items-center justify-center my-0.5">
          {/* Target Reticle */}
          <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full border border-kestrel-orange" />
          </div>
          {/* Incoming Attack Arrow Vector */}
          <div className="absolute w-5 h-[1.5px] bg-kestrel-orange -rotate-45 translate-x-1.5 -translate-y-1.5 shadow-[0_0_6px_#ff6633]" />
        </div>
      </button>

      {/* 7. GUARD */}
      <button
        onClick={() => handleSelectMode('Guard')}
        className={`p-2 rounded-xl flex flex-col items-center justify-between transition-all ${
          activeMode === 'Guard' ? 'kestrel-panel-active' : 'bg-black/30 hover:bg-white/[0.04]'
        }`}
      >
        <span className="text-[10px] font-mono text-kestrel-muted self-start">Guard</span>
        <div className="w-11 h-11 relative flex items-center justify-center my-0.5">
          {/* Defensive Shield */}
          <div className="w-6 h-7 border-2 border-white/40 rounded-b-xl flex items-center justify-center relative">
            <span className="w-2 h-2 rounded-full bg-kestrel-teal shadow-[0_0_8px_#3ce6b8]" />
          </div>
          {/* Orbiting Defense Nodes */}
          <span className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full animate-ping" />
        </div>
      </button>

      {/* 8. SWARM ATTACK */}
      <button
        onClick={() => handleSelectMode('Swarm Attack')}
        className={`p-2 rounded-xl flex flex-col items-center justify-between transition-all ${
          activeMode === 'Swarm Attack' ? 'kestrel-panel-active' : 'bg-black/30 hover:bg-white/[0.04]'
        }`}
      >
        <span className="text-[10px] font-mono text-kestrel-muted self-start">Swarm Attack</span>
        <div className="w-11 h-11 relative flex items-center justify-center my-0.5">
          {/* Central Target Ring */}
          <div className="w-6 h-6 rounded-full border border-dashed border-kestrel-orange" />
          {/* 4 Synchronized Swarm Nodes */}
          <span className="absolute top-1.5 left-1.5 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_4px_#fff]" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_4px_#fff]" />
          <span className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_4px_#fff]" />
          <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_4px_#fff]" />
        </div>
      </button>

      {/* 9. JAMMING */}
      <button
        onClick={() => handleSelectMode('Jamming')}
        className={`p-2 rounded-xl flex flex-col items-center justify-between transition-all ${
          activeMode === 'Jamming' ? 'kestrel-panel-active' : 'bg-black/30 hover:bg-white/[0.04]'
        }`}
      >
        <span className="text-[10px] font-mono text-kestrel-muted self-start">Jamming</span>
        <div className="w-11 h-11 relative flex items-center justify-center my-0.5">
          {/* Electronic Interference Waves */}
          <div className="w-6 h-6 rounded-full border border-white/30 animate-ping" />
          <div className="w-8 h-8 rounded-full border border-kestrel-teal/40 absolute -ml-2" />
          <span className="w-1.5 h-1.5 bg-kestrel-teal rounded-full" />
        </div>
      </button>

      {/* 10. ENCIRCLEMENT */}
      <button
        onClick={() => handleSelectMode('Encirclement')}
        className={`p-2 rounded-xl flex flex-col items-center justify-between transition-all ${
          activeMode === 'Encirclement' ? 'kestrel-panel-active' : 'bg-black/30 hover:bg-white/[0.04]'
        }`}
      >
        <span className="text-[10px] font-mono text-kestrel-muted self-start">Encirclement</span>
        <div className="w-11 h-11 relative flex items-center justify-center my-0.5">
          <div className="w-8 h-8 rounded-full border border-white/40" />
          <div className="absolute w-full h-[1.5px] bg-white/30 rotate-45" />
          <span className="absolute top-1 right-2 w-1.5 h-1.5 bg-kestrel-teal rounded-full shadow-[0_0_6px_#3ce6b8]" />
        </div>
      </button>

    </div>
  );
};
