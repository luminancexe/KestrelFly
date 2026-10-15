import { create } from 'zustand';
import { DroneVehicle, TelemetryData, AlertNotification, MissionProfile, DroneStatus, FlightMode } from '../types/telemetry';

interface FlightStoreState {
  // Fleet & Active Unit
  fleet: DroneVehicle[];
  activeDroneId: string;
  activeDrone: () => DroneVehicle;

  // Real-time Telemetry
  telemetry: TelemetryData;

  // Missions & Alerts
  missions: MissionProfile[];
  activeMissionId: string;
  alerts: AlertNotification[];

  // View & UI Modes
  viewMode: 'MAP_PRIMARY' | 'SPLIT_VIEW' | 'GIMBAL_PRIMARY';
  isSimulating: boolean;

  // Actions
  setActiveDrone: (id: string) => void;
  setDroneStatus: (status: DroneStatus) => void;
  setFlightMode: (mode: FlightMode) => void;
  setViewMode: (mode: 'MAP_PRIMARY' | 'SPLIT_VIEW' | 'GIMBAL_PRIMARY') => void;
  dismissAlert: (id: string) => void;
  toggleSimulation: () => void;
  executeCommand: (command: 'ARM' | 'DISARM' | 'LAUNCH' | 'HOLD' | 'RTH' | 'ABORT') => void;
  updateTelemetry: (partial: Partial<TelemetryData>) => void;
}

const INITIAL_FLEET: DroneVehicle[] = [
  {
    id: 'kestrel-01',
    callsign: 'KESTREL-ALPHA',
    model: 'Kestrel-X4 Heavy',
    type: 'QUADROTOR',
    status: 'IN_FLIGHT',
    mode: 'AUTONOMOUS_NAV',
    payload: 'FLIR Dual 4K Thermal + 30x Zoom',
    ipAddress: '192.168.10.142',
    firmware: 'v3.4.2-kestrelOS',
  },
  {
    id: 'kestrel-02',
    callsign: 'KESTREL-BRAVO',
    model: 'Kestrel-V6 Hexa',
    type: 'HEXACOPTER',
    status: 'STANDBY',
    mode: 'MANUAL',
    payload: 'LiDAR HD Spatial Sensor',
    ipAddress: '192.168.10.143',
    firmware: 'v3.4.2-kestrelOS',
  },
  {
    id: 'kestrel-03',
    callsign: 'KESTREL-CHARLIE',
    model: 'Kestrel-VTOL LongRange',
    type: 'VTOL_FIXED_WING',
    status: 'STANDBY',
    mode: 'MANUAL',
    payload: 'Multispectral NDVI Sensor',
    ipAddress: '192.168.10.144',
    firmware: 'v3.4.1-kestrelOS',
  },
];

const INITIAL_TELEMETRY: TelemetryData = {
  altitude: 124.6,
  targetAltitude: 125.0,
  groundSpeed: 14.8,
  verticalSpeed: 0.2,
  pitch: -3.4,
  roll: 4.8,
  yaw: 142.0,
  battery: 84,
  voltage: 24.6,
  cellVoltages: [4.11, 4.10, 4.12, 4.11, 4.10, 4.11],
  currentDraw: 16.4,
  flightTime: 742,
  estimatedTimeLeft: 26.5,
  satellites: 18,
  hdop: 0.68,
  rssi: -58,
  signalQuality: 98,
  linkLatency: 14,
  latitude: 37.7749,
  longitude: -122.4194,
  cpuTemp: 44.2,
  motorTemps: [48.1, 49.3, 47.9, 48.6],
};

const INITIAL_MISSIONS: MissionProfile[] = [
  {
    id: 'm-01',
    code: 'SEC-RECON-99',
    name: 'Sector 7 Perimeter Autonomous Recon',
    type: 'PERIMETER_PATROL',
    waypointCount: 14,
    totalDistanceKm: 6.8,
    estimatedDurationMin: 22,
    active: true,
  },
  {
    id: 'm-02',
    code: 'GRID-SURV-12',
    name: 'Harbor Pipeline Thermal Assessment',
    type: 'THERMAL_SURVEY',
    waypointCount: 28,
    totalDistanceKm: 12.4,
    estimatedDurationMin: 38,
    active: false,
  },
  {
    id: 'm-03',
    code: 'INSPEC-TWR-04',
    name: 'Communications Relay Orbit Scan',
    type: 'INFRASTRUCTURE_INSPECT',
    waypointCount: 8,
    totalDistanceKm: 3.2,
    estimatedDurationMin: 15,
    active: false,
  },
];

const INITIAL_ALERTS: AlertNotification[] = [
  {
    id: 'a-01',
    timestamp: '02:04:12 UTC',
    level: 'INFO',
    title: 'Waypoint WP-05 Reached',
    detail: 'Autonomous camera sweep initiated at heading 142°',
  },
  {
    id: 'a-02',
    timestamp: '02:01:45 UTC',
    level: 'WARNING',
    title: 'Wind Gust Exceeds 12 m/s',
    detail: 'Gimbal vibration stabilization compensating smoothly',
  },
  {
    id: 'a-03',
    timestamp: '01:58:10 UTC',
    level: 'INFO',
    title: 'Geofence Buffer Safe',
    detail: 'Distance to closest NFZ boundary: 480 meters',
  },
];

export const useFlightStore = create<FlightStoreState>((set, get) => ({
  fleet: INITIAL_FLEET,
  activeDroneId: 'kestrel-01',
  activeDrone: () => {
    const state = get();
    return state.fleet.find(d => d.id === state.activeDroneId) || state.fleet[0];
  },

  telemetry: INITIAL_TELEMETRY,
  missions: INITIAL_MISSIONS,
  activeMissionId: 'm-01',
  alerts: INITIAL_ALERTS,

  viewMode: 'SPLIT_VIEW',
  isSimulating: true,

  setActiveDrone: (id: string) => set({ activeDroneId: id }),

  setDroneStatus: (status: DroneStatus) =>
    set(state => ({
      fleet: state.fleet.map(d =>
        d.id === state.activeDroneId ? { ...d, status } : d
      ),
    })),

  setFlightMode: (mode: FlightMode) =>
    set(state => ({
      fleet: state.fleet.map(d =>
        d.id === state.activeDroneId ? { ...d, mode } : d
      ),
    })),

  setViewMode: (viewMode) => set({ viewMode }),

  dismissAlert: (id: string) =>
    set(state => ({
      alerts: state.alerts.filter(a => a.id !== id),
    })),

  toggleSimulation: () => set(state => ({ isSimulating: !state.isSimulating })),

  updateTelemetry: (partial) =>
    set(state => ({
      telemetry: { ...state.telemetry, ...partial },
    })),

  executeCommand: (command) => {
    const { setDroneStatus, setFlightMode } = get();
    switch (command) {
      case 'ARM':
        setDroneStatus('ARMED');
        break;
      case 'DISARM':
        setDroneStatus('STANDBY');
        break;
      case 'LAUNCH':
        setDroneStatus('IN_FLIGHT');
        setFlightMode('AUTONOMOUS_NAV');
        break;
      case 'HOLD':
        setDroneStatus('HOVERING');
        break;
      case 'RTH':
        setDroneStatus('RTH');
        break;
      case 'ABORT':
        setDroneStatus('EMERGENCY_LAND');
        break;
    }
  },
}));
