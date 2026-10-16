import React from 'react';
import { useFlightStore } from '../../store/flightStore';
import { Plus, Minus } from 'lucide-react';

export const RightControls: React.FC = () => {
  const { zoomIn, zoomOut, cameraZoom } = useFlightStore();

  // Normalize zoom (0.85 to 1.8) into 5 discrete steps for the visual indicator
  const zoomStep = Math.min(5, Math.max(1, Math.round(((cameraZoom - 0.85) / 0.95) * 4) + 1));

  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-end space-y-6 pointer-events-none select-none z-30">
      {/* Vertical Zoom Pill Controls */}
      <div className="kestrel-panel p-1 rounded-2xl flex flex-col items-center space-y-2 pointer-events-auto shadow-kestrel-card">
        <button
          onClick={zoomIn}
          title="Zoom In (Smooth Camera Scale)"
          className="w-7 h-7 rounded-xl flex items-center justify-center text-kestrel-muted hover:text-white hover:bg-white/10 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* Vertical Slider Dots */}
        <div className="flex flex-col items-center space-y-1 py-1">
          {[5, 4, 3, 2, 1].map((step) => (
            <span
              key={step}
              className={`rounded-full transition-all ${
                zoomStep === step
                  ? 'w-2 h-2 bg-kestrel-teal shadow-[0_0_8px_#3ce6b8]'
                  : 'w-1 h-1 bg-white/20'
              }`}
            />
          ))}
        </div>

        <button
          onClick={zoomOut}
          title="Zoom Out (Smooth Camera Scale)"
          className="w-7 h-7 rounded-xl flex items-center justify-center text-kestrel-muted hover:text-white hover:bg-white/10 transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Dual Circular Radar Dials at Bottom Right */}
      <div className="flex items-center space-x-3 pointer-events-auto opacity-75 hover:opacity-100 transition-opacity">
        {/* Dial 1 */}
        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center relative">
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-kestrel-teal" />
          </div>
          <span className="absolute top-1 text-[7px] font-mono text-white/50">N</span>
        </div>

        {/* Dial 2 */}
        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center relative">
          <div className="w-8 h-8 rounded-full border border-kestrel-teal/30 flex items-center justify-center animate-spin-slow">
            <div className="w-full h-[1px] bg-kestrel-teal/40" />
          </div>
          <span className="absolute top-1 text-[7px] font-mono text-white/50">T</span>
        </div>
      </div>
    </div>
  );
};
