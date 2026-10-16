import React from 'react';

export const LeftOverheadInfo: React.FC = () => {
  return (
    <div className="absolute top-[52%] left-6 -translate-y-1/2 pointer-events-auto select-none space-y-3 z-30">
      {/* 6 Vertical Battery Matrix Dots */}
      <div className="flex flex-col space-y-1">
        {[1, 2, 3, 4, 5, 6].map((dot) => (
          <span 
            key={dot} 
            className="w-1.5 h-1.5 rounded-full bg-[#a3e635] shadow-[0_0_6px_#a3e635]" 
          />
        ))}
      </div>

      {/* Expiration & Spec Metadata */}
      <div className="text-[9px] font-mono text-kestrel-muted leading-tight space-y-0.5">
        <div>Exp: 03-23-2026</div>
        <div>UAV-SEC-994</div>
      </div>

      {/* Potential Range */}
      <div className="pt-2 text-[10px] font-mono text-kestrel-muted">
        <div className="text-white/80 font-medium">Potential Range</div>
        <div className="text-[#a3e635] font-semibold">1.331 km</div>
      </div>
    </div>
  );
};
