# 🦅 KestrelFly — Autonomous UAV Mission Control Dashboard

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> **KestrelFly** is a next-generation autonomous drone mission control and telemetry dashboard inspired by **Raktor** (RonDesignLab). Designed for commercial and defense-grade autonomous operations, KestrelFly unifies real-time flight telemetry, geospatial waypoint planning, AI payload computer vision, and fleet command into a single, high-visibility tactical HUD.

---

## 📸 Key Capabilities

```
┌────────────────────────────────────────────────────────────────────────┐
│  TOP BAR: Mission Status | Active Drones (Fleet) | UTC Time | Comms Link │
├──────────────┬──────────────────────────────────────────┬──────────────┤
│              │                                          │              │
│  FLEET &     │  CENTRAL INTERACTIVE MAP / MISSION HUD   │  REAL-TIME   │
│  MISSIONS    │  - 2D/3D Tactical Dark Map (Waypoints)   │  TELEMETRY   │
│  - Active    │  - Geofences & No-Fly Zones (NFZ)        │  - Altitude  │
│    Fleet     │  - Real-time Flight Path & Vector Trails │  - Speed     │
│  - Mission   │  - Autonomous Waypoint Re-routing        │  - Battery % │
│    Queue     ├──────────────────────────────────────────┤  - Pitch/Yaw │
│  - Launch    │  LIVE PAYLOAD / CAMERA STREAM (HUD/AI)   │  - Satellites│
│    Presets   │  - Gimbal Feed | Thermal / Optical       │              │
│              │  - AI Object Detection Bounding Boxes    │  EMERGENCY   │
│              │  - Autonomous Target Lock & Tracking     │  CONTROLS    │
│              │  - Flight Commands: [RTH] [HOLD] [LAND]  │  [ABORT]     │
└──────────────┴──────────────────────────────────────────┴──────────────┘
```

* 🗺️ **Tactical Geospatial Core**: Dark vector mapping with 3D terrain elevation, dynamic waypoint corridor editing, geofencing (No-Fly Zones), and live flight breadcrumbs.
* 🧭 **Military-Grade Telemetry HUD**: 60 FPS Primary Flight Display (PFD) with an artificial horizon (Pitch/Roll), 360° compass tape, altitude/airspeed ladders, and battery cell health metrics.
* 🎯 **AI Computer Vision Overlay**: Real-time payload camera feed with switchable modes (RGB, Thermal, Night Vision) and dynamic bounding boxes for autonomous object and vehicle tracking.
* 🛡️ **Mission State Machine**: Strict lifecycle state transitions (`STANDBY` $\rightarrow$ `PRE_FLIGHT_CHECK` $\rightarrow$ `ARMED` $\rightarrow$ `IN_FLIGHT` $\rightarrow$ `RETURNING` $\rightarrow$ `LANDED`) with safety gates for emergency abort and Return-to-Home (RTH).
* 📡 **Simulator & Hardware Agnostic**: Built to interface seamlessly with mock telemetry generators, PX4/ArduPilot SITL, and MAVLink WebSocket gateways.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **React / Vite** (TypeScript) | High-speed component rendering & strict type safety |
| **Styling & HUD Design** | **Tailwind CSS** + **Framer Motion** | Glassmorphic cyber-tactical design system and smooth micro-interactions |
| **Icons & UI Primitives** | **Lucide React** + **Radix UI** | Tactical iconography and accessible command modals |
| **Geospatial & Mapping** | **MapLibre GL JS** / **Turf.js** | High-performance vector map rendering and geodesic route calculations |
| **Telemetry HUD & 3D** | **HTML5 Canvas** / **Three.js** | 60 FPS Artificial Horizon and orientation instrumentation |
| **State Management** | **Zustand** | Zero-latency global telemetry state synchronization |
| **Real-time Pipeline** | **WebSockets** / **MQTT** | Sub-50ms bidirectional flight telemetry and command dispatch |

---

## 📁 Project Directory Structure

```text
kestrel-fly/
├── public/                # Static assets, map markers, and audio cues
├── src/
│   ├── assets/            # Brand marks, SVG icons, and shaders
│   ├── components/
│   │   ├── common/        # Glassmorphic cards, buttons, badges, modals
│   │   ├── layout/        # TopBar, LeftSidebar, BottomDock, Viewport
│   │   ├── map/           # MapLibre map, Waypoints, Geofences, DroneMarker
│   │   ├── hud/           # Artificial Horizon, Compass, Altitude/Speed ladders
│   │   ├── payload/       # Live video stream, Thermal filter, AI Bounding Boxes
│   │   └── controls/      # Mission action buttons, Arming slider, Abort modal
│   ├── hooks/             # useTelemetry, useGamepad, useGeolocation
│   ├── services/          # WebSocket telemetry client, MAVLink adapter, Simulator
│   ├── store/             # Zustand stores (flightStore, missionStore, alertStore)
│   ├── types/             # Telemetry, Waypoint, and Mission TypeScript interfaces
│   ├── App.tsx            # Root application layout
│   └── main.tsx           # Entry point
├── .gitignore             # Git ignore rules
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.0.0 or higher recommended)
* **pnpm** (recommended) or **npm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/kestrel-fly.git
   cd kestrel-fly
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the local development server:**
   ```bash
   pnpm run dev
   # or
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173` to view the KestrelFly mission control dashboard.

---

## 🗺️ Roadmap & Milestones

For the detailed phase-by-phase development roadmap (including Phase 1 through Phase 7 milestones), refer to the internal architectural documentation:
- **Phase 1**: Design System & HUD Layout Shell
- **Phase 2**: Interactive Geospatial Waypoint Engine
- **Phase 3**: Real-Time Telemetry HUD & Attitude Instrument
- **Phase 4**: Payload Video Stream & AI Vision Overlays
- **Phase 5**: Mission State Machine & Safety Interlocks
- **Phase 6**: Autonomous Simulation & MAVLink / SITL Bridge
- **Phase 7**: Production Hardening & Offline Desktop Packaging

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
