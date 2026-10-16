import React, { useEffect } from 'react';
import { useFlightStore, MissionPhase } from '../../store/flightStore';
import { Play, Pause, FastForward } from 'lucide-react';

export const MissionReelControls: React.FC = () => {
  const {
    missionPhase,
    setMissionPhase,
    timelineProgress,
    setTimelineProgress,
    isPlayingReel,
    togglePlayReel,
    playbackSpeed,
    setPlaybackSpeed,
  } = useFlightStore();

  // Continuous loop advancing timeline when playing reel
  useEffect(() => {
    if (!isPlayingReel) return;

    const interval = setInterval(() => {
      const nextProgress = (timelineProgress + 0.3 * playbackSpeed) % 100;
      setTimelineProgress(nextProgress);
    }, 50);

    return () => clearInterval(interval);
  }, [isPlayingReel, timelineProgress, playbackSpeed, setTimelineProgress]);

  const phases: { id: MissionPhase; label: string; min: number; max: number }[] = [
    { id: 'approach', label: '1. Approach & Recon', min: 0, max: 25 },
    { id: 'bridge_scan', label: '2. Superstructure Scan', min: 25, max: 50 },
    { id: 'deck_sweep', label: '3. Cargo Laser Sweep', min: 50, max: 75 },
    { id: 'threat_locked', label: '4. Nuclear Threat Locked', min: 75, max: 100 },
  ];

  return (
    <div className="absolute top-18 left-1/2 -translate-x-1/2 z-40 select-none pointer-events-auto flex items-center space-x-2 kestrel-panel py-1.5 px-3 rounded-full shadow-kestrel-card text-xs font-mono">
      {/* Play/Pause Button */}
      <button
        onClick={togglePlayReel}
        className="w-7 h-7 rounded-full bg-kestrel-teal/20 text-kestrel-teal hover:bg-kestrel-teal/30 flex items-center justify-center transition-all"
        title={isPlayingReel ? 'Pause Reel' : 'Play Animated Reel'}
      >
        {isPlayingReel ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
      </button>

      {/* Scrubbable Timeline Slider */}
      <div className="flex items-center space-x-2">
        <span className="text-[10px] text-kestrel-muted w-8">{Math.floor(timelineProgress)}%</span>
        <input
          type="range"
          min="0"
          max="100"
          value={timelineProgress}
          onChange={(e) => setTimelineProgress(Number(e.target.value))}
          className="w-36 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#3ce6b8]"
        />
      </div>

      {/* Phase Jump Pills */}
      <div className="hidden lg:flex items-center space-x-1 border-l border-white/10 pl-2">
        {phases.map((p) => {
          const isActive = missionPhase === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setMissionPhase(p.id)}
              className={`px-2.5 py-0.5 rounded-full text-[10px] transition-all ${
                isActive
                  ? 'bg-kestrel-teal text-black font-bold shadow-[0_0_10px_#3ce6b8]'
                  : 'text-kestrel-muted hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Speed Multiplier Toggle */}
      <button
        onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : 1)}
        className="px-2 py-0.5 rounded-md bg-white/[0.05] hover:bg-white/10 text-[9px] text-kestrel-muted hover:text-white transition-all flex items-center space-x-1"
        title="Toggle Playback Speed"
      >
        <FastForward className="w-3 h-3 text-kestrel-teal" />
        <span>{playbackSpeed}x</span>
      </button>
    </div>
  );
};
