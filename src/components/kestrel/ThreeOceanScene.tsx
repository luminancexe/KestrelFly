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

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a121c, 0.028);

    const camera = new THREE.PerspectiveCamera(
      42,
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
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x243447, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xdbe8f5, 2.8);
    sunLight.position.set(-25, 45, -30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const cyanScannerLight = new THREE.SpotLight(0x3ce6b8, 12, 35, Math.PI / 6.5, 0.45, 1);
    cyanScannerLight.position.set(6, 12, 6);
    scene.add(cyanScannerLight);

    const orangeHazardLight = new THREE.PointLight(0xff6633, 0, 22);
    scene.add(orangeHazardLight);

    // 3. Procedural 3D Living Ocean (Vertex-Displaced Wave Geometry)
    const waterGeo = new THREE.PlaneGeometry(180, 180, 70, 70);
    const posAttr = waterGeo.attributes.position;
    const initialPositions = posAttr.array.slice();

    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x091420,
      metalness: 0.88,
      roughness: 0.16,
      flatShading: true,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.y = -0.6;
    waterMesh.receiveShadow = true;
    scene.add(waterMesh);

    // 4. Cargo Vessel Model Group
    // Aligned diagonally across screen: Stern (lower-left) -> Bow (upper-right)
    const shipGroup = new THREE.Group();
    // Rotate ship so stern is lower-left and bow is upper-right
    shipGroup.rotation.y = Math.PI * 0.28;
    scene.add(shipGroup);

    // Shared Materials
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x18202b,
      metalness: 0.8,
      roughness: 0.35,
    });
    const deckMat = new THREE.MeshStandardMaterial({
      color: 0x111722,
      metalness: 0.65,
      roughness: 0.45,
    });
    const superstructureMat = new THREE.MeshStandardMaterial({
      color: 0x223040,
      metalness: 0.7,
      roughness: 0.38,
    });
    const hatchMat = new THREE.MeshStandardMaterial({
      color: 0x161e2a,
      metalness: 0.75,
      roughness: 0.4,
    });
    const hazardOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xff6633,
      emissive: 0xff4500,
      emissiveIntensity: 0.9,
      metalness: 0.3,
      roughness: 0.2,
    });
    const cyanWireframeMat = new THREE.LineBasicMaterial({
      color: 0x3ce6b8,
      transparent: true,
      opacity: 0.7,
    });

    // Hull (Main body)
    const hullGeo = new THREE.BoxGeometry(7.2, 3.4, 27);
    const hullMesh = new THREE.Mesh(hullGeo, hullMat);
    hullMesh.position.y = 0.6;
    hullMesh.castShadow = true;
    hullMesh.receiveShadow = true;
    shipGroup.add(hullMesh);

    // Tapered Bow Wedge
    const bowGeo = new THREE.ConeGeometry(3.6, 7.5, 4);
    const bowMesh = new THREE.Mesh(bowGeo, hullMat);
    bowMesh.rotation.x = -Math.PI / 2;
    bowMesh.rotation.y = Math.PI / 4;
    bowMesh.position.set(0, 0.6, 17.2);
    bowMesh.castShadow = true;
    shipGroup.add(bowMesh);

    // Forecastle Deck & Mast at Bow
    const forecastleGeo = new THREE.BoxGeometry(6.4, 0.6, 4);
    const forecastle = new THREE.Mesh(forecastleGeo, deckMat);
    forecastle.position.set(0, 2.5, 14.5);
    shipGroup.add(forecastle);

    const bowMastGeo = new THREE.CylinderGeometry(0.06, 0.1, 3.2, 8);
    const bowMast = new THREE.Mesh(bowMastGeo, superstructureMat);
    bowMast.position.set(0, 4.4, 15);
    shipGroup.add(bowMast);

    // Main Weather Deck Surface
    const deckGeo = new THREE.BoxGeometry(6.8, 0.2, 24.5);
    const deckMesh = new THREE.Mesh(deckGeo, deckMat);
    deckMesh.position.y = 2.3;
    deckMesh.receiveShadow = true;
    shipGroup.add(deckMesh);

    // 8 Cargo Hatch Blocks (4 pairs along deck)
    const hatchWireframes: THREE.LineSegments[] = [];
    let hazardHatchMesh: THREE.Mesh | null = null;
    let hazardWireframe: THREE.LineSegments | null = null;

    const hatchPositions = [
      { x: -1.7, z: 9.5 }, { x: 1.7, z: 9.5 },
      { x: -1.7, z: 5.5 }, { x: 1.7, z: 5.5 },
      { x: -1.7, z: 1.5 }, { x: 1.7, z: 1.5, isHazard: true },
      { x: -1.7, z: -2.5 }, { x: 1.7, z: -2.5 },
    ];

    hatchPositions.forEach((pos) => {
      const hGeo = new THREE.BoxGeometry(2.8, 0.9, 3.2);
      const isHaz = pos.isHazard;
      const hMesh = new THREE.Mesh(hGeo, isHaz ? hazardOrangeMat : hatchMat);
      hMesh.position.set(pos.x, 2.8, pos.z);
      hMesh.castShadow = true;
      shipGroup.add(hMesh);

      // Cyan Wireframe Grid around each cargo hatch (as seen in screenshot 144405)
      const wireGeo = new THREE.WireframeGeometry(hGeo);
      const wireMat = isHaz
        ? new THREE.LineBasicMaterial({ color: 0xffaa44, transparent: true, opacity: 0.95 })
        : new THREE.LineBasicMaterial({ color: 0x3ce6b8, transparent: true, opacity: 0.45 });
      const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
      wireMesh.scale.set(1.04, 1.04, 1.04);
      hMesh.add(wireMesh);
      hatchWireframes.push(wireMesh);

      if (isHaz) {
        hazardHatchMesh = hMesh;
        hazardWireframe = wireMesh;
      }
    });

    // Bridge Superstructure (Stern Deckhouse)
    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(0, 4.3, -8.2);
    shipGroup.add(bridgeGroup);

    // Main multi-tiered bridge base
    const bridgeBaseGeo = new THREE.BoxGeometry(5.8, 3.8, 5.2);
    const bridgeBase = new THREE.Mesh(bridgeBaseGeo, superstructureMat);
    bridgeBase.castShadow = true;
    bridgeGroup.add(bridgeBase);

    // Bridge Navigation Wings extending port & starboard
    const wingGeo = new THREE.BoxGeometry(8.2, 0.8, 2.2);
    const bridgeWings = new THREE.Mesh(wingGeo, superstructureMat);
    bridgeWings.position.set(0, 1.4, 0.8);
    bridgeGroup.add(bridgeWings);

    // Bridge Windows (Emissive Teal Glass)
    const windowGeo = new THREE.BoxGeometry(7.8, 0.5, 0.2);
    const windowMat = new THREE.MeshBasicMaterial({ color: 0x6ee7b7 });
    const windows = new THREE.Mesh(windowGeo, windowMat);
    windows.position.set(0, 1.5, 1.92);
    bridgeGroup.add(windows);

    // Slanted Black Exhaust Funnel / Smokestack
    const funnelGeo = new THREE.CylinderGeometry(0.7, 0.9, 3.6, 12);
    const funnelMat = new THREE.MeshStandardMaterial({ color: 0x12161f, roughness: 0.5 });
    const funnel = new THREE.Mesh(funnelGeo, funnelMat);
    funnel.rotation.x = 0.15;
    funnel.position.set(0, 3.4, -1.2);
    bridgeGroup.add(funnel);

    // Orange Free-Fall Enclosed Lifeboat on Port Davit
    const lifeboatGeo = new THREE.CapsuleGeometry(0.45, 1.4, 8, 12);
    const lifeboatMat = new THREE.MeshStandardMaterial({
      color: 0xff6600,
      roughness: 0.3,
      metalness: 0.1,
    });
    const lifeboat = new THREE.Mesh(lifeboatGeo, lifeboatMat);
    lifeboat.rotation.x = Math.PI / 2;
    lifeboat.position.set(-3.2, 0.8, -0.6);
    bridgeGroup.add(lifeboat);

    // Radar Mast & Rotating Scanner Antenna
    const mastGeo = new THREE.CylinderGeometry(0.08, 0.14, 3.6, 8);
    const mast = new THREE.Mesh(mastGeo, superstructureMat);
    mast.position.set(0, 3.6, 0.6);
    bridgeGroup.add(mast);

    const radarBarGeo = new THREE.BoxGeometry(2.4, 0.16, 0.25);
    const radarBarMat = new THREE.MeshStandardMaterial({
      color: 0x3ce6b8,
      emissive: 0x10b981,
      emissiveIntensity: 0.6,
    });
    const radarBar = new THREE.Mesh(radarBarGeo, radarBarMat);
    radarBar.position.set(0, 5.4, 0.6);
    bridgeGroup.add(radarBar);

    // Cyan Holographic Superstructure Wireframe (Illuminates in Bridge Scan)
    const bridgeWireGeo = new THREE.WireframeGeometry(bridgeBaseGeo);
    const bridgeWire = new THREE.LineSegments(bridgeWireGeo, cyanWireframeMat);
    bridgeWire.scale.set(1.03, 1.03, 1.03);
    bridgeGroup.add(bridgeWire);

    // 5. Trailing Kestrel USV Stealth Boat in Starboard Ocean
    const usvGroup = new THREE.Group();
    usvGroup.position.set(13, -0.2, 4);
    usvGroup.rotation.y = Math.PI * 0.28;
    scene.add(usvGroup);

    const usvHullGeo = new THREE.BoxGeometry(1.6, 0.6, 4.2);
    const usvHullMat = new THREE.MeshStandardMaterial({ color: 0x1c2734, metalness: 0.9, roughness: 0.3 });
    const usvHull = new THREE.Mesh(usvHullGeo, usvHullMat);
    usvGroup.add(usvHull);

    const usvBowGeo = new THREE.ConeGeometry(0.8, 1.6, 4);
    const usvBow = new THREE.Mesh(usvBowGeo, usvHullMat);
    usvBow.rotation.x = -Math.PI / 2;
    usvBow.rotation.y = Math.PI / 4;
    usvBow.position.set(0, 0, 2.8);
    usvGroup.add(usvBow);

    // 6. Water Wakes (White Foamy Trailing Planes)
    const wakeMat = new THREE.MeshBasicMaterial({
      color: 0xd8eeff,
      transparent: true,
      opacity: 0.38,
      side: THREE.DoubleSide,
    });
    const wakeGeo = new THREE.PlaneGeometry(10, 32);
    const wakeMesh = new THREE.Mesh(wakeGeo, wakeMat);
    wakeMesh.rotation.x = -Math.PI / 2;
    wakeMesh.rotation.z = Math.PI * 0.28;
    wakeMesh.position.set(-10, -0.48, -14);
    scene.add(wakeMesh);

    // USV Wake
    const usvWakeGeo = new THREE.PlaneGeometry(3, 12);
    const usvWakeMesh = new THREE.Mesh(usvWakeGeo, wakeMat);
    usvWakeMesh.rotation.x = -Math.PI / 2;
    usvWakeMesh.rotation.z = Math.PI * 0.28;
    usvWakeMesh.position.set(10, -0.5, -3);
    scene.add(usvWakeMesh);

    // 7. 3D Autonomous UAV Drones
    const create3DDrone = (ledColor: number) => {
      const drone = new THREE.Group();

      // Fuselage
      const bodyGeo = new THREE.BoxGeometry(0.8, 0.28, 0.8);
      const bMat = new THREE.MeshStandardMaterial({ color: 0x151d27, metalness: 0.9, roughness: 0.25 });
      const body = new THREE.Mesh(bodyGeo, bMat);
      drone.add(body);

      // Camera Gimbal Underneath
      const gimbalGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const gMat = new THREE.MeshStandardMaterial({ color: 0x05080c, metalness: 0.9 });
      const gimbal = new THREE.Mesh(gimbalGeo, gMat);
      gimbal.position.y = -0.22;
      drone.add(gimbal);

      // Status LED
      const ledGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const ledMat = new THREE.MeshBasicMaterial({ color: ledColor });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.y = 0.16;
      drone.add(led);

      // 4 Carbon Arms & Rotor Discs
      const droneRotors: THREE.Mesh[] = [];
      const armCoords = [
        { x: -0.9, z: -0.9 }, { x: 0.9, z: -0.9 },
        { x: -0.9, z: 0.9 }, { x: 0.9, z: 0.9 },
      ];

      armCoords.forEach((pt) => {
        const armG = new THREE.BoxGeometry(0.1, 0.08, 1.25);
        const armM = new THREE.Mesh(armG, bMat);
        armM.position.set(pt.x / 2, 0, pt.z / 2);
        armM.rotation.y = pt.x * pt.z > 0 ? Math.PI / 4 : -Math.PI / 4;
        drone.add(armM);

        // High-Speed Rotor Disc
        const discG = new THREE.CircleGeometry(0.65, 16);
        const discM = new THREE.MeshBasicMaterial({
          color: 0x3ce6b8,
          transparent: true,
          opacity: 0.35,
          side: THREE.DoubleSide,
        });
        const rotor = new THREE.Mesh(discG, discM);
        rotor.rotation.x = Math.PI / 2;
        rotor.position.set(pt.x, 0.12, pt.z);
        drone.add(rotor);
        droneRotors.push(rotor);
      });

      scene.add(drone);
      return { drone, droneRotors };
    };

    // Drone 1: Primary Scanner (Hovering top-right overlooking ship deck)
    const drone1 = create3DDrone(0x3ce6b8);
    drone1.drone.position.set(8, 13, 8);

    // Volumetric 3D Scanner Light Cone from Drone 1 onto cargo deck
    const coneGeo = new THREE.ConeGeometry(6, 12, 28, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x3ce6b8,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const coneMesh = new THREE.Mesh(coneGeo, coneMat);
    coneMesh.rotation.x = Math.PI;
    coneMesh.position.set(0, -6, 0);
    drone1.drone.add(coneMesh);

    // Drone 2: Flank Scout Drone (Hovering near port stern/bridge)
    const drone2 = create3DDrone(0x10b981);
    drone2.drone.position.set(-8, 9, -5);

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

    // 9. Main Animation Loop
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
        const wave =
          Math.sin(u * 0.22 + elapsedTime * 1.6) * 0.28 +
          Math.cos(v * 0.18 + elapsedTime * 1.3) * 0.24;
        positions.setZ(i, wave);
      }
      positions.needsUpdate = true;

      // Gentle Ship Hydrodynamic Buoyancy (Pitching and rolling)
      shipGroup.position.y = Math.sin(elapsedTime * 1.3) * 0.16;
      shipGroup.rotation.z = Math.sin(elapsedTime * 0.8) * 0.014;
      shipGroup.rotation.x = Math.cos(elapsedTime * 0.9) * 0.012;

      // USV boat bobbing
      usvGroup.position.y = -0.2 + Math.sin(elapsedTime * 2.2) * 0.12;

      // Spinning Radar Scanner Antenna
      radarBar.rotation.y = elapsedTime * 4.8;

      // High-speed Drone Rotor Spin
      drone1.droneRotors.forEach((r, idx) => {
        r.rotation.z += idx % 2 === 0 ? 0.65 : -0.65;
      });
      drone2.droneRotors.forEach((r, idx) => {
        r.rotation.z += idx % 2 === 0 ? 0.65 : -0.65;
      });

      // Realistic Drone Autonomous Hover Turbulence
      drone1.drone.position.y = 12.5 + Math.sin(elapsedTime * 2.6) * 0.35;
      drone1.drone.position.x = 8.0 + Math.cos(elapsedTime * 1.1) * 0.4;
      drone2.drone.position.y = 8.8 + Math.sin(elapsedTime * 2.1 + 1) * 0.28;

      // Dynamic Scanner Light & Volumetric Sweep Target
      if (hazardHatchMesh) {
        const worldPos = new THREE.Vector3();
        hazardHatchMesh.getWorldPosition(worldPos);
        cyanScannerLight.target = hazardHatchMesh;
        orangeHazardLight.position.copy(worldPos).add(new THREE.Vector3(0, 1.2, 0));
      }

      // Phase Shaders & Holographic Lighting
      if (currentPhase === 'threat_locked') {
        // High alert: Pulsating Radioactive Orange Glow
        const hazPulse = 0.55 + Math.sin(elapsedTime * 8) * 0.45;
        orangeHazardLight.intensity = 12 * hazPulse;
        if (hazardHatchMesh) {
          (hazardHatchMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.7 + hazPulse * 0.6;
        }
        if (hazardWireframe) {
          hazardWireframe.scale.set(1.06 + hazPulse * 0.06, 1.06 + hazPulse * 0.06, 1.06 + hazPulse * 0.06);
          (hazardWireframe.material as THREE.LineBasicMaterial).opacity = 0.95;
        }
        bridgeWire.material.opacity = 0.25;
        coneMat.opacity = 0.18 + hazPulse * 0.08;
      } else if (currentPhase === 'bridge_scan') {
        // Superstructure scan active: highlight bridge wireframe in glowing cyan
        const bridgePulse = 0.75 + Math.sin(elapsedTime * 6) * 0.25;
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
          (hw.material as THREE.LineBasicMaterial).opacity = isCurrent ? 0.9 : 0.35;
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
