import { create } from 'zustand';
import { NavTab, TacticalMissionMode, FleetDrone, InspectionData } from '../types/telemetry';

export type MissionPhase = 'approach' | 'bridge_scan' | 'deck_sweep' | 'threat_locked';

interface FlightStoreState {
  activeTab: NavTab;
  activeMode: TacticalMissionMode;
  inspection: InspectionData;
  fleet: FleetDrone[];
  
  // Cinematic Mission Reel & Timeline
  missionPhase: MissionPhase;
  timelineProgress: number; // 0 to 100%
  isPlayingReel: boolean;
  playbackSpeed: number;

  // Camera Zoom & Pan Dynamics
  cameraZoom: number; // 1.0 to 1.8
  cameraPan: { x: number; y: number };

  // Actions
  setActiveTab: (tab: NavTab) => void;
  setActiveMode: (mode: TacticalMissionMode) => void;
  setMissionPhase: (phase: MissionPhase) => void;
  setTimelineProgress: (progress: number) => void;
  togglePlayReel: () => void;
  setPlaybackSpeed: (speed: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setCameraPan: (pan: { x: number; y: number }) => void;
  triggerReturn: (droneId: string) => void;
  triggerUSVReturn: () => void;
  updateThreatLevels: (hydrogen: number, uranium: number) => void;
}

const INITIAL_FLEET: FleetDrone[] = [
  { id: '1', callsign: 'Axs-332.01', status: 'Low', batteryPercent: 48, isStation: false, hasReturnButton: true },
  { id: '2', callsign: 'Axs-332.02', status: 'Good', batteryPercent: 74, isStation: false, hasReturnButton: true },
  { id: '3', callsign: 'Axs-332.03', status: 'Station', batteryPercent: 100, isStation: true, hasReturnButton: false },
  { id: '4', callsign: 'Axs-332.04', status: 'Station', batteryPercent: 100, isStation: true, hasReturnButton: false },
];

export const useFlightStore = create<FlightStoreState>((set) => ({
  activeTab: 'Mission',
  activeMode: 'Inspection',
  inspection: {
    threatLevel: 'Nuclear',
    hydrogenPercent: 32,
    uraniumOxidePercent: 71,
    inspectionDistanceKm: 1.331,
    inspectionProgressPercent: 68,
    scanPhase: 'cargo_threat',
  },
  fleet: INITIAL_FLEET,

  // Cinematic Reel
  missionPhase: 'threat_locked',
  timelineProgress: 75,
  isPlayingReel: true,
  playbackSpeed: 1,

  // Camera Dynamics
  cameraZoom: 1.05,
  cameraPan: { x: 0, y: 0 },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setActiveMode: (mode) => {
    set({ activeMode: mode });
    if (mode === 'Inspection') {
      set({ missionPhase: 'threat_locked', cameraZoom: 1.15 });
    } else if (mode === 'Perimeter' || mode === 'Tracking') {
      set({ missionPhase: 'bridge_scan', cameraZoom: 1.0 });
    } else if (mode === 'Swarm Attack') {
      set({ missionPhase: 'deck_sweep', cameraZoom: 1.25 });
    } else {
      set({ missionPhase: 'approach', cameraZoom: 0.95 });
    }
  },

  setMissionPhase: (phase) => {
    let progress = 20;
    let zoom = 1.0;
    if (phase === 'bridge_scan') {
      progress = 45;
      zoom = 1.1;
    } else if (phase === 'deck_sweep') {
      progress = 65;
      zoom = 1.15;
    } else if (phase === 'threat_locked') {
      progress = 85;
      zoom = 1.2;
    }
    set({ missionPhase: phase, timelineProgress: progress, cameraZoom: zoom });
  },

  setTimelineProgress: (progress) => {
    let phase: MissionPhase = 'approach';
    if (progress > 70) phase = 'threat_locked';
    else if (progress > 45) phase = 'deck_sweep';
    else if (progress > 20) phase = 'bridge_scan';
    set({ timelineProgress: progress, missionPhase: phase });
  },

  togglePlayReel: () => set((s) => ({ isPlayingReel: !s.isPlayingReel })),
  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),

  zoomIn: () => set((s) => ({ cameraZoom: Math.min(1.8, s.cameraZoom + 0.15) })),
  zoomOut: () => set((s) => ({ cameraZoom: Math.max(0.85, s.cameraZoom - 0.15) })),
  setCameraPan: (cameraPan) => set({ cameraPan }),

  triggerReturn: (droneId) =>
    set((s) => ({
      fleet: s.fleet.map((d) => (d.id === droneId ? { ...d, status: 'Station' as const, hasReturnButton: false } : d)),
    })),

  triggerUSVReturn: () => {
    // USV boat return action
  },

  updateThreatLevels: (hydrogenPercent, uraniumOxidePercent) =>
    set((s) => ({
      inspection: { ...s.inspection, hydrogenPercent, uraniumOxidePercent },
    })),
}));
