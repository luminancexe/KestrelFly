import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFlightStore } from '../../store/flightStore';
import { 
  Zap, 
  Cpu, 
  Video, 
  RotateCw, 
  Compass
} from 'lucide-react';

interface CalloutPosition {
  x: number;
  y: number;
  visible: boolean;
}

export const DroneCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { telemetry } = useFlightStore();

  // Screen positions for 3D spatial callouts
  const [callouts, setCallouts] = useState<{
    gimbal: CalloutPosition;
    motorFL: CalloutPosition;
    battery: CalloutPosition;
    core: CalloutPosition;
  }>({
    gimbal: { x: 0, y: 0, visible: false },
    motorFL: { x: 0, y: 0, visible: false },
    battery: { x: 0, y: 0, visible: false },
    core: { x: 0, y: 0, visible: false },
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06080c, 0.04);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(4.5, 3.2, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e6, 2.8);
    keyLight.position.set(8, 12, 10);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xea580c, 3.5);
    rimLight.position.set(-8, -4, -8);
    scene.add(rimLight);

    const bottomGlow = new THREE.PointLight(0xea580c, 2.5, 8);
    bottomGlow.position.set(0, -1.2, 0);
    scene.add(bottomGlow);

    // 3. Materials
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x141820,
      metalness: 0.85,
      roughness: 0.3,
    });

    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x0a0d12,
      metalness: 0.95,
      roughness: 0.2,
    });

    const orangeAccentMat = new THREE.MeshStandardMaterial({
      color: 0xea580c,
      emissive: 0xea580c,
      emissiveIntensity: 0.6,
      metalness: 0.5,
      roughness: 0.2,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f2fe,
      emissive: 0x005577,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
    });

    const rotorBlurMat = new THREE.MeshStandardMaterial({
      color: 0x2a303c,
      transparent: true,
      opacity: 0.35,
      roughness: 0.6,
      side: THREE.DoubleSide,
    });

    // 4. Construct 3D Drone Hierarchy
    const droneGroup = new THREE.Group();
    scene.add(droneGroup);

    // Central Fuselage / Pod
    const bodyGeo = new THREE.CylinderGeometry(0.55, 0.75, 0.45, 8);
    const bodyMesh = new THREE.Mesh(bodyGeo, carbonMat);
    bodyMesh.castShadow = true;
    droneGroup.add(bodyMesh);

    // Top Canopy / Dome
    const topDomeGeo = new THREE.SphereGeometry(0.48, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const topDome = new THREE.Mesh(topDomeGeo, darkMetalMat);
    topDome.position.y = 0.22;
    droneGroup.add(topDome);

    // Glowing Sensor Ring
    const ringGeo = new THREE.TorusGeometry(0.48, 0.025, 8, 32);
    const ringMesh = new THREE.Mesh(ringGeo, orangeAccentMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.22;
    droneGroup.add(ringMesh);

    // 4 Carbon Arms & Motor Pods
    const armPositions = [
      { x: 1.4, z: 1.4, angle: Math.PI / 4 },
      { x: -1.4, z: 1.4, angle: (3 * Math.PI) / 4 },
      { x: -1.4, z: -1.4, angle: (5 * Math.PI) / 4 },
      { x: 1.4, z: -1.4, angle: (7 * Math.PI) / 4 },
    ];

    const rotors: THREE.Group[] = [];

    armPositions.forEach((pos, idx) => {
      // Carbon Boom Arm
      const armLength = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
      const armGeo = new THREE.BoxGeometry(0.12, 0.08, armLength);
      const armMesh = new THREE.Mesh(armGeo, carbonMat);
      armMesh.position.set(pos.x / 2, 0, pos.z / 2);
      armMesh.rotation.y = pos.angle;
      droneGroup.add(armMesh);

      // Motor Mount Cylinder
      const motorGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16);
      const motorMesh = new THREE.Mesh(motorGeo, darkMetalMat);
      motorMesh.position.set(pos.x, 0.1, pos.z);
      droneGroup.add(motorMesh);

      // Motor Orange Stripe
      const motorStripeGeo = new THREE.CylinderGeometry(0.205, 0.205, 0.05, 16);
      const motorStripe = new THREE.Mesh(motorStripeGeo, orangeAccentMat);
      motorStripe.position.set(pos.x, 0.1, pos.z);
      droneGroup.add(motorStripe);

      // Rotor Assembly
      const rotorGroup = new THREE.Group();
      rotorGroup.position.set(pos.x, 0.26, pos.z);

      // Dual Carbon Blades
      const bladeGeo = new THREE.BoxGeometry(1.3, 0.015, 0.1);
      const blade = new THREE.Mesh(bladeGeo, darkMetalMat);
      rotorGroup.add(blade);

      // Spinning Blur Disc
      const blurDiscGeo = new THREE.CircleGeometry(0.7, 24);
      const blurDisc = new THREE.Mesh(blurDiscGeo, rotorBlurMat);
      blurDisc.rotation.x = -Math.PI / 2;
      rotorGroup.add(blurDisc);

      droneGroup.add(rotorGroup);
      rotors.push(rotorGroup);

      // Wingtip LED Navigation Beacon
      const ledGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const ledMat = new THREE.MeshBasicMaterial({
        color: idx === 0 ? 0xef4444 : idx === 1 ? 0x10b981 : 0xea580c,
      });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(pos.x * 1.08, 0.05, pos.z * 1.08);
      droneGroup.add(led);
    });

    // Underslung 4K Gimbal Camera Assembly
    const gimbalGroup = new THREE.Group();
    gimbalGroup.position.set(0, -0.32, 0.4);

    const gimbalArmGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.22, 8);
    const gimbalArm = new THREE.Mesh(gimbalArmGeo, darkMetalMat);
    gimbalGroup.add(gimbalArm);

    const camBallGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const camBall = new THREE.Mesh(camBallGeo, carbonMat);
    camBall.position.set(0, -0.15, 0);
    gimbalGroup.add(camBall);

    // Front Camera Lens
    const lensGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
    const lens = new THREE.Mesh(lensGeo, glassMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, -0.15, 0.18);
    gimbalGroup.add(lens);

    droneGroup.add(gimbalGroup);

    // Carbon Landing Skids
    [-0.5, 0.5].forEach((xSide) => {
      const skidGeo = new THREE.BoxGeometry(0.06, 0.04, 1.4);
      const skid = new THREE.Mesh(skidGeo, carbonMat);
      skid.position.set(xSide, -0.55, 0);
      droneGroup.add(skid);

      // Skid Struts
      [-0.4, 0.4].forEach((zSide) => {
        const strutGeo = new THREE.BoxGeometry(0.04, 0.35, 0.04);
        const strut = new THREE.Mesh(strutGeo, darkMetalMat);
        strut.position.set(xSide, -0.38, zSide);
        strut.rotation.z = xSide > 0 ? -0.2 : 0.2;
        droneGroup.add(strut);
      });
    });

    // Subtle Ground Radar Reflection Grid
    const gridHelper = new THREE.GridHelper(16, 24, 0xea580c, 0x141a24);
    gridHelper.position.y = -1.6;
    gridHelper.material.opacity = 0.25;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Tracking Vector 3D Anchors for Callout Projections
    const gimbalAnchor = new THREE.Vector3(0, -0.35, 0.4);
    const motorFLAnchor = new THREE.Vector3(1.4, 0.3, 1.4);
    const batteryAnchor = new THREE.Vector3(0, -0.1, -0.3);
    const coreAnchor = new THREE.Vector3(0, 0.35, 0);

    // Mouse Interaction Controls (Orbit Drag)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0.4;
    let targetRotationX = 0.2;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;
      targetRotationX = Math.max(-0.6, Math.min(0.8, targetRotationX));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Helper: Project 3D vector to 2D screen coordinates
    const projectToScreen = (vec: THREE.Vector3) => {
      const worldPos = vec.clone();
      droneGroup.localToWorld(worldPos);
      worldPos.project(camera);

      const halfW = container.clientWidth / 2;
      const halfH = container.clientHeight / 2;
      return {
        x: worldPos.x * halfW + halfW,
        y: -(worldPos.y * halfH) + halfH,
        visible: worldPos.z < 1,
      };
    };

    // 5. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Spin Rotors at high speed
      rotors.forEach((rotor, i) => {
        rotor.rotation.y += (i % 2 === 0 ? 0.45 : -0.45);
      });

      // Smooth Gentle Cinematic Hover Dynamics
      const hoverY = Math.sin(elapsedTime * 1.8) * 0.08;
      const hoverRoll = Math.sin(elapsedTime * 1.4) * 0.03;
      const hoverPitch = Math.cos(elapsedTime * 1.2) * 0.02;

      droneGroup.position.y = hoverY;

      // Smooth interpolation for mouse drag rotation
      droneGroup.rotation.y += (targetRotationY - droneGroup.rotation.y) * 0.08;
      droneGroup.rotation.x += (targetRotationX + hoverPitch - droneGroup.rotation.x) * 0.08;
      droneGroup.rotation.z += (hoverRoll - droneGroup.rotation.z) * 0.08;

      // Slowly rotate ground radar grid for depth
      gridHelper.rotation.y = elapsedTime * 0.02;

      // Render
      renderer.render(scene, camera);

      // Update 2D Spatial Callout Positions
      setCallouts({
        gimbal: projectToScreen(gimbalAnchor),
        motorFL: projectToScreen(motorFLAnchor),
        battery: projectToScreen(batteryAnchor),
        core: projectToScreen(coreAnchor),
      });
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
      {/* Three.js WebGL Canvas Mount Container */}
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Click and drag to rotate 3D UAV model"
      />

      {/* 3D Spatial Telemetry Callout 1: FLIR Gimbal Camera */}
      {callouts.gimbal.visible && (
        <div 
          className="absolute pointer-events-none transition-transform duration-75 flex items-center space-x-2.5 z-20"
          style={{
            transform: `translate(${callouts.gimbal.x}px, ${callouts.gimbal.y}px)`,
          }}
        >
          {/* Target Marker Dot */}
          <div className="w-3 h-3 rounded-full bg-raktor-orange flex items-center justify-center shadow-raktor-glow -translate-x-1.5 -translate-y-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          </div>
          {/* Spatial Connecting Line */}
          <div className="w-10 h-[1px] bg-gradient-to-r from-raktor-orange to-white/40" />
          {/* Glass Badge */}
          <div className="raktor-panel px-3 py-1.5 rounded-2xl flex items-center space-x-2 shadow-raktor-card whitespace-nowrap">
            <Video className="w-3.5 h-3.5 text-raktor-orange shrink-0" />
            <div>
              <div className="text-[10px] font-mono font-bold text-raktor-cream leading-tight">
                FLIR 4K DUAL GIMBAL
              </div>
              <div className="text-[8px] font-mono text-raktor-creamDark">
                PITCH: -14.2° | AI AUTO-TRACK
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D Spatial Telemetry Callout 2: Motor 1 Brushless Rotor */}
      {callouts.motorFL.visible && (
        <div 
          className="absolute pointer-events-none transition-transform duration-75 flex items-center space-x-2.5 z-20"
          style={{
            transform: `translate(${callouts.motorFL.x}px, ${callouts.motorFL.y}px)`,
          }}
        >
          <div className="w-3 h-3 rounded-full bg-raktor-orange flex items-center justify-center shadow-raktor-glow -translate-x-1.5 -translate-y-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <div className="w-10 h-[1px] bg-gradient-to-r from-raktor-orange to-white/40" />
          <div className="raktor-panel px-3 py-1.5 rounded-2xl flex items-center space-x-2 shadow-raktor-card whitespace-nowrap">
            <RotateCw className="w-3.5 h-3.5 text-raktor-emerald shrink-0" />
            <div>
              <div className="text-[10px] font-mono font-bold text-raktor-cream leading-tight">
                BRUSHLESS ROTOR M1
              </div>
              <div className="text-[8px] font-mono text-raktor-emerald font-semibold">
                8,450 RPM • NOMINAL (48°C)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D Spatial Telemetry Callout 3: 6S LiPo Battery Pack */}
      {callouts.battery.visible && (
        <div 
          className="absolute pointer-events-none transition-transform duration-75 flex flex-row-reverse items-center space-x-reverse space-x-2.5 z-20"
          style={{
            transform: `translate(${callouts.battery.x - 190}px, ${callouts.battery.y}px)`,
          }}
        >
          <div className="w-3 h-3 rounded-full bg-raktor-orange flex items-center justify-center shadow-raktor-glow translate-x-1.5 -translate-y-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <div className="w-10 h-[1px] bg-gradient-to-l from-raktor-orange to-white/40" />
          <div className="raktor-panel px-3 py-1.5 rounded-2xl flex items-center space-x-2 shadow-raktor-card whitespace-nowrap">
            <Zap className="w-3.5 h-3.5 text-raktor-orange shrink-0" />
            <div>
              <div className="text-[10px] font-mono font-bold text-raktor-cream leading-tight">
                6S LIPO POWER PACK
              </div>
              <div className="text-[8px] font-mono text-raktor-creamDark">
                {telemetry.voltage.toFixed(1)}V • {telemetry.battery}% ({telemetry.currentDraw.toFixed(1)}A)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D Spatial Telemetry Callout 4: AI Neural Edge Core */}
      {callouts.core.visible && (
        <div 
          className="absolute pointer-events-none transition-transform duration-75 flex flex-row-reverse items-center space-x-reverse space-x-2.5 z-20"
          style={{
            transform: `translate(${callouts.core.x - 200}px, ${callouts.core.y - 40}px)`,
          }}
        >
          <div className="w-3 h-3 rounded-full bg-raktor-orange flex items-center justify-center shadow-raktor-glow translate-x-1.5 -translate-y-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <div className="w-10 h-[1px] bg-gradient-to-l from-raktor-orange to-white/40" />
          <div className="raktor-panel px-3 py-1.5 rounded-2xl flex items-center space-x-2 shadow-raktor-card whitespace-nowrap">
            <Cpu className="w-3.5 h-3.5 text-raktor-cyan shrink-0" />
            <div>
              <div className="text-[10px] font-mono font-bold text-raktor-cream leading-tight">
                KESTREL AI CORE (42 TOPS)
              </div>
              <div className="text-[8px] font-mono text-raktor-cyan font-semibold">
                AUTONOMOUS NAV ACTIVE
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D Model Interaction Hint */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-mono text-raktor-creamMuted opacity-60 hover:opacity-100 transition-opacity">
        <Compass className="w-3.5 h-3.5 text-raktor-orange animate-spin" style={{ animationDuration: '8s' }} />
        <span>INTERACTIVE 3D UAV // CLICK & DRAG TO ORBIT</span>
      </div>
    </div>
  );
};
