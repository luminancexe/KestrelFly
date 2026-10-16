import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFlightStore, MissionPhase } from '../../store/flightStore';

export const ThreeOceanScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { missionPhase, cameraZoom } = useFlightStore();
  const phaseRef = useRef<MissionPhase>(missionPhase);
  phaseRef.current = missionPhase;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, High-Performance WebGL Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09121c, 0.024);

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      600
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.appendChild(renderer.domElement);

    // 2. Cinematic Lighting Rig (Sun, Oceanic Specular, Spot Scanner, Hazard Point)
    const ambientLight = new THREE.AmbientLight(0x22364c, 1.5);
    scene.add(ambientLight);

    // Sun key light angled to produce ocean specular glint on waves
    const sunLight = new THREE.DirectionalLight(0xdde8f5, 3.2);
    sunLight.position.set(-28, 48, -25);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.camera.left = -25;
    sunLight.shadow.camera.right = 25;
    sunLight.shadow.camera.top = 25;
    sunLight.shadow.camera.bottom = -25;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    // Subtle sky fill light
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x091420, 0.6);
    scene.add(hemiLight);

    // Volumetric Cyan Scanner Spotlight from Drone
    const cyanScannerLight = new THREE.SpotLight(0x3ce6b8, 14, 40, Math.PI / 6.5, 0.45, 1.2);
    cyanScannerLight.position.set(6, 13, 8);
    scene.add(cyanScannerLight);

    // Radioactive Orange Hazard Light inside Hold #6
    const orangeHazardLight = new THREE.PointLight(0xff6622, 0, 24, 1.5);
    scene.add(orangeHazardLight);

    // 3. Living 3D Ocean Surface (Vertex-Displaced Wave Simulation)
    const waterGeo = new THREE.PlaneGeometry(200, 200, 75, 75);
    const posAttr = waterGeo.attributes.position;
    const initialPositions = posAttr.array.slice();

    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x091522,
      metalness: 0.9,
      roughness: 0.12,
      flatShading: false,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.y = -0.55;
    waterMesh.receiveShadow = true;
    scene.add(waterMesh);

    // 4. Detailed 3D Bulk Carrier Cargo Vessel
    // Positioned diagonally: Stern (lower-left) -> Bow (upper-right)
    const shipGroup = new THREE.Group();
    shipGroup.rotation.y = Math.PI * 0.28;
    scene.add(shipGroup);

    // Materials Palette
    const topsideMat = new THREE.MeshStandardMaterial({
      color: 0x18222e,
      metalness: 0.75,
      roughness: 0.38,
    });
    const redBottomMat = new THREE.MeshStandardMaterial({
      color: 0x7c1d1d, // Antifouling red hull bottom
      metalness: 0.65,
      roughness: 0.45,
    });
    const weatherDeckMat = new THREE.MeshStandardMaterial({
      color: 0x1f2c34, // Dark weathered maritime green-grey deck
      metalness: 0.55,
      roughness: 0.52,
    });
    const superstructureMat = new THREE.MeshStandardMaterial({
      color: 0xc4d1d2, // Off-white painted wheelhouse
      metalness: 0.4,
      roughness: 0.35,
    });
    const funnelMat = new THREE.MeshStandardMaterial({
      color: 0x12171f, // Charcoal black engine exhaust funnel
      metalness: 0.8,
      roughness: 0.4,
    });
    const hatchMat = new THREE.MeshStandardMaterial({
      color: 0x141b24,
      metalness: 0.82,
      roughness: 0.35,
    });
    const hazardOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xff6622,
      emissive: 0xff4500,
      emissiveIntensity: 0.95,
      metalness: 0.2,
      roughness: 0.2,
    });
    const cyanWireframeMat = new THREE.LineBasicMaterial({
      color: 0x3ce6b8,
      transparent: true,
      opacity: 0.85,
    });

    // Main Upper Hull
    const upperHullGeo = new THREE.BoxGeometry(7.4, 2.2, 28);
    const upperHull = new THREE.Mesh(upperHullGeo, topsideMat);
    upperHull.position.y = 1.1;
    upperHull.castShadow = true;
    upperHull.receiveShadow = true;
    shipGroup.add(upperHull);

    // Red Antifouling Lower Hull & Keel (Below Waterline)
    const lowerHullGeo = new THREE.BoxGeometry(7.0, 1.4, 27.4);
    const lowerHull = new THREE.Mesh(lowerHullGeo, redBottomMat);
    lowerHull.position.y = -0.4;
    lowerHull.receiveShadow = true;
    shipGroup.add(lowerHull);

    // Tapered Bow Wedge
    const bowGeo = new THREE.ConeGeometry(3.7, 7.8, 4);
    const bowMesh = new THREE.Mesh(bowGeo, topsideMat);
    bowMesh.rotation.x = -Math.PI / 2;
    bowMesh.rotation.y = Math.PI / 4;
    bowMesh.position.set(0, 1.1, 17.8);
    bowMesh.castShadow = true;
    shipGroup.add(bowMesh);

    // Rounded Stern Counter Transom
    const sternCounterGeo = new THREE.CylinderGeometry(3.7, 3.5, 2.2, 16, 1, false, 0, Math.PI);
    const sternCounter = new THREE.Mesh(sternCounterGeo, topsideMat);
    sternCounter.position.set(0, 1.1, -14);
    sternCounter.rotation.y = -Math.PI / 2;
    sternCounter.castShadow = true;
    shipGroup.add(sternCounter);

    // Weather Deck Surface
    const deckGeo = new THREE.BoxGeometry(7.0, 0.2, 25.2);
    const deckMesh = new THREE.Mesh(deckGeo, weatherDeckMat);
    deckMesh.position.y = 2.22;
    deckMesh.receiveShadow = true;
    shipGroup.add(deckMesh);

    // Port & Starboard Raised Bulwarks (Edge Coamings)
    const bulwarkGeo = new THREE.BoxGeometry(0.2, 0.5, 25.2);
    const portBulwark = new THREE.Mesh(bulwarkGeo, topsideMat);
    portBulwark.position.set(-3.5, 2.5, 0.5);
    shipGroup.add(portBulwark);

    const stbdBulwark = new THREE.Mesh(bulwarkGeo, topsideMat);
    stbdBulwark.position.set(3.5, 2.5, 0.5);
    shipGroup.add(stbdBulwark);

    // Raised Forecastle Deck at Bow
    const forecastleGeo = new THREE.BoxGeometry(6.6, 0.8, 4.5);
    const forecastle = new THREE.Mesh(forecastleGeo, weatherDeckMat);
    forecastle.position.set(0, 2.6, 15);
    shipGroup.add(forecastle);

    // Bow Jackstaff Mast
    const bowMastGeo = new THREE.CylinderGeometry(0.06, 0.1, 3.8, 8);
    const bowMast = new THREE.Mesh(bowMastGeo, superstructureMat);
    bowMast.position.set(0, 4.6, 15.6);
    shipGroup.add(bowMast);

    // White Forward Masthead Navigation Light
    const navLightGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const navLightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const bowNavLight = new THREE.Mesh(navLightGeo, navLightMat);
    bowNavLight.position.set(0, 6.4, 15.6);
    shipGroup.add(bowNavLight);

    // 8 Cargo Hatches (2x4 Grid with Multi-Cell Grid Cages)
    const hatchWireframes: THREE.LineSegments[] = [];
    let hazardHatchMesh: THREE.Mesh | null = null;
    let hazardWireframe: THREE.LineSegments | null = null;

    const hatchPositions = [
      { x: -1.75, z: 10.2 }, { x: 1.75, z: 10.2 },
      { x: -1.75, z: 6.0 },  { x: 1.75, z: 6.0 },
      { x: -1.75, z: 1.8 },  { x: 1.75, z: 1.8, isHazard: true },
      { x: -1.75, z: -2.4 }, { x: 1.75, z: -2.4 },
    ];

    hatchPositions.forEach((pos) => {
      // Raised Coaming & Hatch Cover
      const hGeo = new THREE.BoxGeometry(2.9, 0.95, 3.4);
      const isHaz = pos.isHazard;
      const hMesh = new THREE.Mesh(hGeo, isHaz ? hazardOrangeMat : hatchMat);
      hMesh.position.set(pos.x, 2.8, pos.z);
      hMesh.castShadow = true;
      hMesh.receiveShadow = true;
      shipGroup.add(hMesh);

      // Multi-Cell High-Tech Grid Cage (Matching screenshot 144405)
      const wireGeo = new THREE.WireframeGeometry(hGeo);
      const wireMat = isHaz
        ? new THREE.LineBasicMaterial({ color: 0xffaa33, transparent: true, opacity: 0.95 })
        : new THREE.LineBasicMaterial({ color: 0x3ce6b8, transparent: true, opacity: 0.5 });
      const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
      wireMesh.scale.set(1.05, 1.05, 1.05);
      hMesh.add(wireMesh);
      hatchWireframes.push(wireMesh);

      if (isHaz) {
        hazardHatchMesh = hMesh;
        hazardWireframe = wireMesh;
      }
    });

    // Bridge Superstructure (Wheelhouse, Wings, Lifeboat, Funnel, Radar Mast)
    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(0, 4.4, -8.6);
    shipGroup.add(bridgeGroup);

    // Multi-tier Wheelhouse Base
    const bridgeBaseGeo = new THREE.BoxGeometry(5.8, 4.0, 5.4);
    const bridgeBase = new THREE.Mesh(bridgeBaseGeo, superstructureMat);
    bridgeBase.castShadow = true;
    bridgeGroup.add(bridgeBase);

    // Bridge Navigation Wings extending horizontally past the hull
    const wingGeo = new THREE.BoxGeometry(8.6, 0.8, 2.4);
    const bridgeWings = new THREE.Mesh(wingGeo, superstructureMat);
    bridgeWings.position.set(0, 1.5, 0.9);
    bridgeWings.castShadow = true;
    bridgeGroup.add(bridgeWings);

    // Panoramic Wheelhouse Navigation Windows
    const windowGeo = new THREE.BoxGeometry(8.2, 0.55, 0.2);
    const windowMat = new THREE.MeshBasicMaterial({ color: 0x6ee7b7 });
    const windows = new THREE.Mesh(windowGeo, windowMat);
    windows.position.set(0, 1.6, 2.02);
    bridgeGroup.add(windows);

    // Slanted Charcoal Engine Exhaust Funnel
    const funnelGeo = new THREE.CylinderGeometry(0.75, 0.95, 4.0, 16);
    const funnel = new THREE.Mesh(funnelGeo, funnelMat);
    funnel.rotation.x = 0.16;
    funnel.position.set(0, 3.6, -1.3);
    funnel.castShadow = true;
    bridgeGroup.add(funnel);

    // Enclosed Orange Free-Fall Lifeboat on Port Davit Frame (Matching screenshot 144333)
    const lifeboatGroup = new THREE.Group();
    lifeboatGroup.position.set(-3.25, 0.9, -0.6);
    bridgeGroup.add(lifeboatGroup);

    const lifeboatGeo = new THREE.CapsuleGeometry(0.48, 1.5, 8, 16);
    const lifeboatMat = new THREE.MeshStandardMaterial({
      color: 0xee5a10, // Safety maritime orange
      roughness: 0.28,
      metalness: 0.1,
    });
    const lifeboat = new THREE.Mesh(lifeboatGeo, lifeboatMat);
    lifeboat.rotation.x = Math.PI / 2.3;
    lifeboatGroup.add(lifeboat);

    // Main Radar Mast with Cross-Tree Yardarm
    const mastGeo = new THREE.CylinderGeometry(0.08, 0.15, 4.2, 8);
    const mast = new THREE.Mesh(mastGeo, superstructureMat);
    mast.position.set(0, 4.0, 0.8);
    bridgeGroup.add(mast);

    const yardarmGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.6, 8);
    const yardarm = new THREE.Mesh(yardarmGeo, superstructureMat);
    yardarm.rotation.z = Math.PI / 2;
    yardarm.position.set(0, 4.8, 0.8);
    bridgeGroup.add(yardarm);

    // High-Speed Rotating Radar Scanner Antenna Bar
    const radarBarGeo = new THREE.BoxGeometry(2.5, 0.16, 0.28);
    const radarBarMat = new THREE.MeshStandardMaterial({
      color: 0x3ce6b8,
      emissive: 0x10b981,
      emissiveIntensity: 0.7,
    });
    const radarBar = new THREE.Mesh(radarBarGeo, radarBarMat);
    radarBar.position.set(0, 6.0, 0.8);
    bridgeGroup.add(radarBar);

    // Holographic Superstructure Cyan Wireframe (Activated in Bridge Scan)
    const bridgeWireGeo = new THREE.WireframeGeometry(bridgeBaseGeo);
    const bridgeWire = new THREE.LineSegments(bridgeWireGeo, cyanWireframeMat);
    bridgeWire.scale.set(1.03, 1.03, 1.03);
    bridgeGroup.add(bridgeWire);

    // 5. Water Wakes: Realistic Kelvin V-Wake & Propeller Wash Foam
    const wakeGroup = new THREE.Group();
    scene.add(wakeGroup);

    const foamMat = new THREE.MeshBasicMaterial({
      color: 0xdff0fc,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });

    // Stern Propeller Wash (Expanding turbulent foam behind the vessel)
    const washGeo = new THREE.PlaneGeometry(8, 28);
    const washMesh = new THREE.Mesh(washGeo, foamMat);
    washMesh.rotation.x = -Math.PI / 2;
    washMesh.rotation.z = Math.PI * 0.28;
    washMesh.position.set(-10, -0.48, -14);
    wakeGroup.add(washMesh);

    // Port V-Wake Flare
    const portWakeGeo = new THREE.PlaneGeometry(5, 36);
    const portWake = new THREE.Mesh(portWakeGeo, foamMat);
    portWake.rotation.x = -Math.PI / 2;
    portWake.rotation.z = Math.PI * 0.28 - 0.22;
    portWake.position.set(-14, -0.5, -12);
    wakeGroup.add(portWake);

    // Starboard V-Wake Flare
    const stbdWakeGeo = new THREE.PlaneGeometry(5, 36);
    const stbdWake = new THREE.Mesh(stbdWakeGeo, foamMat);
    stbdWake.rotation.x = -Math.PI / 2;
    stbdWake.rotation.z = Math.PI * 0.28 + 0.22;
    stbdWake.position.set(-6, -0.5, -16);
    wakeGroup.add(stbdWake);

    // 6. Trailing Kestrel Stealth USV Chase Boat in Starboard Ocean
    const usvGroup = new THREE.Group();
    usvGroup.position.set(13.5, -0.2, 3.8);
    usvGroup.rotation.y = Math.PI * 0.28;
    scene.add(usvGroup);

    const usvHullGeo = new THREE.BoxGeometry(1.6, 0.65, 4.4);
    const usvHullMat = new THREE.MeshStandardMaterial({
      color: 0x1b2633,
      metalness: 0.88,
      roughness: 0.3,
    });
    const usvHull = new THREE.Mesh(usvHullGeo, usvHullMat);
    usvGroup.add(usvHull);

    const usvBowGeo = new THREE.ConeGeometry(0.8, 1.8, 4);
    const usvBow = new THREE.Mesh(usvBowGeo, usvHullMat);
    usvBow.rotation.x = -Math.PI / 2;
    usvBow.rotation.y = Math.PI / 4;
    usvBow.position.set(0, 0, 3.0);
    usvGroup.add(usvBow);

    // USV Antenna Mast
    const usvMastGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 6);
    const usvMast = new THREE.Mesh(usvMastGeo, superstructureMat);
    usvMast.position.set(0, 0.8, -0.5);
    usvGroup.add(usvMast);

    // USV Wake
    const usvWakeGeo = new THREE.PlaneGeometry(2.4, 14);
    const usvWake = new THREE.Mesh(usvWakeGeo, foamMat);
    usvWake.rotation.x = -Math.PI / 2;
    usvWake.rotation.z = Math.PI * 0.28;
    usvWake.position.set(11, -0.52, -2.5);
    scene.add(usvWake);

    // 7. High-Fidelity 3D Autonomous UAV Drones
    const createIndustrialDrone = (ledColor: number) => {
      const drone = new THREE.Group();

      // Fuselage Carbon Core
      const bodyGeo = new THREE.BoxGeometry(0.85, 0.3, 0.85);
      const bMat = new THREE.MeshStandardMaterial({
        color: 0x161e28,
        metalness: 0.9,
        roughness: 0.25,
      });
      const body = new THREE.Mesh(bodyGeo, bMat);
      body.castShadow = true;
      drone.add(body);

      // Top Avionics Dome
      const domeGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.1, 16);
      const domeMat = new THREE.MeshStandardMaterial({ color: 0x223040, metalness: 0.7 });
      const dome = new THREE.Mesh(domeGeo, domeMat);
      dome.position.y = 0.18;
      drone.add(dome);

      // Camera Gimbal Pod with Sphere Lens
      const gimbalGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const gMat = new THREE.MeshStandardMaterial({ color: 0x05080c, metalness: 0.95 });
      const gimbal = new THREE.Mesh(gimbalGeo, gMat);
      gimbal.position.y = -0.25;
      drone.add(gimbal);

      // Status Beacon LED
      const ledGeo = new THREE.SphereGeometry(0.07, 8, 8);
      const ledMat = new THREE.MeshBasicMaterial({ color: ledColor });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.y = 0.22;
      drone.add(led);

      // Dual U-Shaped Landing Gear Skids (Matching screenshot 144333)
      const skidMat = new THREE.MeshStandardMaterial({ color: 0x0c1117, metalness: 0.8 });
      [-0.45, 0.45].forEach((sx) => {
        const skidTube = new THREE.BoxGeometry(0.06, 0.06, 1.4);
        const skid = new THREE.Mesh(skidTube, skidMat);
        skid.position.set(sx, -0.55, 0);
        drone.add(skid);

        // Leg struts
        [-0.4, 0.4].forEach((sz) => {
          const strutGeo = new THREE.BoxGeometry(0.05, 0.35, 0.05);
          const strut = new THREE.Mesh(strutGeo, skidMat);
          strut.position.set(sx, -0.38, sz);
          drone.add(strut);
        });
      });

      // 4 Carbon Fiber Motor Arms & 1500 RPM Spinning Rotors
      const droneRotors: THREE.Mesh[] = [];
      const armCoords = [
        { x: -1.0, z: -1.0 }, { x: 1.0, z: -1.0 },
        { x: -1.0, z: 1.0 },  { x: 1.0, z: 1.0 },
      ];

      armCoords.forEach((pt) => {
        // Arm
        const armG = new THREE.BoxGeometry(0.12, 0.08, 1.4);
        const armM = new THREE.Mesh(armG, bMat);
        armM.position.set(pt.x / 2, 0, pt.z / 2);
        armM.rotation.y = pt.x * pt.z > 0 ? Math.PI / 4 : -Math.PI / 4;
        drone.add(armM);

        // Motor Bell
        const motorG = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 12);
        const motor = new THREE.Mesh(motorG, bMat);
        motor.position.set(pt.x, 0.08, pt.z);
        drone.add(motor);

        // Semi-Transparent High-Speed Rotor Disc with Motion Blur
        const discG = new THREE.CircleGeometry(0.7, 16);
        const discM = new THREE.MeshBasicMaterial({
          color: 0x3ce6b8,
          transparent: true,
          opacity: 0.32,
          side: THREE.DoubleSide,
        });
        const rotor = new THREE.Mesh(discG, discM);
        rotor.rotation.x = Math.PI / 2;
        rotor.position.set(pt.x, 0.16, pt.z);
        drone.add(rotor);
        droneRotors.push(rotor);
      });

      scene.add(drone);
      return { drone, droneRotors, led };
    };

    // Drone 1: Primary Scanner (Hovering top-right overlooking ship deck)
    const drone1 = createIndustrialDrone(0x3ce6b8);
    drone1.drone.position.set(8.5, 13.5, 8.5);

    // Volumetric 3D Scanner Light Cone Mesh from Drone 1 to Ship
    const coneGeo = new THREE.ConeGeometry(6.5, 13.5, 32, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x3ce6b8,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const coneMesh = new THREE.Mesh(coneGeo, coneMat);
    coneMesh.rotation.x = Math.PI;
    coneMesh.position.set(0, -6.8, 0);
    drone1.drone.add(coneMesh);

    // Drone 2: Flank Scout Drone (Hovering near port stern/bridge)
    const drone2 = createIndustrialDrone(0x10b981);
    drone2.drone.position.set(-8.5, 9.2, -5.2);

    // 8. Real-time Interactive 3D Camera Orbit & Pan Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    // Set initial camera spherical angles so the ship spans from lower-left (stern) to upper-right (bow)
    let targetCamRotY = -0.55;
    let targetCamRotX = 0.52;
    let camDistance = 32;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      targetCamRotY -= dx * 0.005;
      targetCamRotX = Math.max(0.12, Math.min(1.25, targetCamRotX + dy * 0.005));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      camDistance = Math.max(14, Math.min(50, camDistance + e.deltaY * 0.025));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel);

    // 9. Main Animation Loop (Waves, Wakes, Rotors, Lighting, Buoyancy)
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const currentPhase = phaseRef.current;

      // 3D Living Ocean Wave Simulation (Displacing vertices in real time)
      const positions = waterGeo.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const u = initialPositions[i * 3];
        const v = initialPositions[i * 3 + 1];
        // Gerstner-like multi-frequency ocean swells
        const wave =
          Math.sin(u * 0.22 + elapsedTime * 1.6) * 0.28 +
          Math.cos(v * 0.18 + elapsedTime * 1.3) * 0.24 +
          Math.sin((u + v) * 0.1 + elapsedTime * 2.1) * 0.12;
        positions.setZ(i, wave);
      }
      positions.needsUpdate = true;
      waterGeo.computeVertexNormals(); // Recompute normals so specular highlights sparkle on crests

      // Gentle Ship Hydrodynamic Buoyancy (Pitching and rolling on ocean swells)
      shipGroup.position.y = Math.sin(elapsedTime * 1.3) * 0.16;
      shipGroup.rotation.z = Math.sin(elapsedTime * 0.8) * 0.014;
      shipGroup.rotation.x = Math.cos(elapsedTime * 0.9) * 0.012;

      // USV boat bobbing
      usvGroup.position.y = -0.2 + Math.sin(elapsedTime * 2.2) * 0.12;
      usvGroup.rotation.z = Math.sin(elapsedTime * 1.8) * 0.03;

      // Spinning Radar Scanner Antenna Bar
      radarBar.rotation.y = elapsedTime * 4.8;

      // High-speed Drone Rotor Spin
      drone1.droneRotors.forEach((r, idx) => {
        r.rotation.z += idx % 2 === 0 ? 0.75 : -0.75;
      });
      drone2.droneRotors.forEach((r, idx) => {
        r.rotation.z += idx % 2 === 0 ? 0.75 : -0.75;
      });

      // Realistic Drone Autonomous Hover Turbulence & Banking
      drone1.drone.position.y = 13.0 + Math.sin(elapsedTime * 2.6) * 0.35;
      drone1.drone.position.x = 8.5 + Math.cos(elapsedTime * 1.1) * 0.4;
      drone1.drone.rotation.z = Math.sin(elapsedTime * 1.2) * 0.03;

      drone2.drone.position.y = 9.0 + Math.sin(elapsedTime * 2.1 + 1) * 0.28;
      drone2.drone.rotation.z = Math.sin(elapsedTime * 1.5) * 0.04;

      // Foam Opacity Pulse with Wave Surge
      foamMat.opacity = 0.36 + Math.sin(elapsedTime * 2.5) * 0.08;

      // Dynamic Scanner Light & Volumetric Sweep Target
      if (hazardHatchMesh) {
        const worldPos = new THREE.Vector3();
        hazardHatchMesh.getWorldPosition(worldPos);
        cyanScannerLight.target = hazardHatchMesh;
        orangeHazardLight.position.copy(worldPos).add(new THREE.Vector3(0, 1.4, 0));
      }

      // Phase Shaders & Holographic Lighting
      if (currentPhase === 'threat_locked') {
        // High alert: Pulsating Radioactive Orange Glow
        const hazPulse = 0.55 + Math.sin(elapsedTime * 8) * 0.45;
        orangeHazardLight.intensity = 14 * hazPulse;
        if (hazardHatchMesh) {
          (hazardHatchMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.75 + hazPulse * 0.65;
        }
        if (hazardWireframe) {
          hazardWireframe.scale.set(1.06 + hazPulse * 0.06, 1.06 + hazPulse * 0.06, 1.06 + hazPulse * 0.06);
          (hazardWireframe.material as THREE.LineBasicMaterial).opacity = 0.95;
        }
        bridgeWire.material.opacity = 0.3;
        coneMat.opacity = 0.18 + hazPulse * 0.08;
      } else if (currentPhase === 'bridge_scan') {
        // Superstructure scan active: highlight bridge wireframe in glowing cyan
        const bridgePulse = 0.8 + Math.sin(elapsedTime * 6) * 0.25;
        bridgeWire.material.opacity = bridgePulse;
        orangeHazardLight.intensity = 0;
        if (hazardHatchMesh) {
          (hazardHatchMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.2;
        }
      } else if (currentPhase === 'deck_sweep') {
        // Laser sweep across all hatches
        const sweepT = (Math.sin(elapsedTime * 3) + 1) / 2;
        hatchWireframes.forEach((hw, idx) => {
          const isCurrent = Math.abs(idx / hatchWireframes.length - sweepT) < 0.25;
          (hw.material as THREE.LineBasicMaterial).opacity = isCurrent ? 0.95 : 0.35;
        });
        bridgeWire.material.opacity = 0.2;
        orangeHazardLight.intensity = 0;
      } else {
        // Normal Approach Phase
        bridgeWire.material.opacity = 0.2;
        orangeHazardLight.intensity = 0;
        if (hazardHatchMesh) {
          (hazardHatchMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.2;
        }
      }

      // Smooth Camera Positioning & Interpolation
      const dist = camDistance / cameraZoom;
      const camX = Math.sin(targetCamRotY) * Math.cos(targetCamRotX) * dist;
      const camY = Math.sin(targetCamRotX) * dist + 2;
      const camZ = Math.cos(targetCamRotY) * Math.cos(targetCamRotX) * dist;

      camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.06);
      camera.lookAt(0, 1.8, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [cameraZoom]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
      title="Click and drag to orbit 3D camera in real-time. Use wheel or +/- to zoom."
    />
  );
};
