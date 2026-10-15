export type DroneStatus = 'STANDBY' | 'PREFLIGHT' | 'ARMED' | 'IN_FLIGHT' | 'HOVERING' | 'RTH' | 'EMERGENCY_LAND';

export type FlightMode = 'MANUAL' | 'ASSISTED' | 'AUTONOMOUS_NAV' | 'ORBIT' | 'PERIMETER_SURVEY';

export interface TelemetryData {
  altitude: number;          // meters AGL
  targetAltitude: number;    // meters
  groundSpeed: number;       // m/s
  verticalSpeed: number;     // m/s
  pitch: number;             // degrees (-90 to +90)
  roll: number;              // degrees (-180 to +180)
  yaw: number;               // degrees (0 to 359)
  battery: number;           // percentage (0-100)
  voltage: number;           // volts (e.g. 24.8V)
  cellVoltages: number[];    // individual cell voltages [4.12, 4.14, 4.13, 4.15, ...]
  currentDraw: number;       // Amperes (e.g. 18.4A)
  flightTime: number;        // seconds elapsed
  estimatedTimeLeft: number; // minutes remaining
  satellites: number;        // count of locked GPS satellites
  hdop: number;              // horizontal dilution of precision (< 1.0 is ideal)
  rssi: number;              // signal dBm (e.g. -64 dBm)
  signalQuality: number;     // percentage 0-100%
  linkLatency: number;       // ms (e.g. 18ms)
  latitude: number;
  longitude: number;
  cpuTemp: number;           // Celsius
  motorTemps: number[];      // 4 or 6 motor temps in C
}

export interface DroneVehicle {
  id: string;
  callsign: string;
  model: string;
  type: 'QUADROTOR' | 'HEXACOPTER' | 'VTOL_FIXED_WING';
  status: DroneStatus;
  mode: FlightMode;
  payload: string;
  ipAddress: string;
  firmware: string;
}

export interface AlertNotification {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'CRITICAL';
  title: string;
  detail: string;
  acknowledged?: boolean;
}

export interface MissionProfile {
  id: string;
  code: string;
  name: string;
  type: 'RECON' | 'PERIMETER_PATROL' | 'INFRASTRUCTURE_INSPECT' | 'THERMAL_SURVEY';
  waypointCount: number;
  totalDistanceKm: number;
  estimatedDurationMin: number;
  active: boolean;
}
