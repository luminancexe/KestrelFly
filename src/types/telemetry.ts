export type NavTab = 'Mission' | 'Area' | 'Map' | 'Routes' | 'Control';

export type TacticalMissionMode = 
  | 'Tracking' 
  | 'Perimeter' 
  | 'Inspection' 
  | 'Escort' 
  | 'Relay' 
  | 'Point Attack' 
  | 'Guard' 
  | 'Swarm Attack' 
  | 'Jamming' 
  | 'Encirclement';

export interface FleetDrone {
  id: string;
  callsign: string;
  status: 'Low' | 'Good' | 'Station';
  batteryPercent: number;
  isStation: boolean;
  hasReturnButton: boolean;
}

export interface InspectionData {
  threatLevel: 'High' | 'Nuclear' | 'Nominal';
  hydrogenPercent: number;
  uraniumOxidePercent: number;
  inspectionDistanceKm: number;
  inspectionProgressPercent: number;
  scanPhase: 'clean' | 'bridge' | 'cargo_threat';
}
