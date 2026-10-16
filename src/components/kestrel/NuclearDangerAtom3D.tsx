import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const NuclearDangerAtom3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 5.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Glowing Core (Plasma Nucleus)
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Bright White-Yellow Central Core
    const coreGeo = new THREE.SphereGeometry(0.38, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Inner Warm Corona
    const corona1Geo = new THREE.SphereGeometry(0.52, 24, 24);
    const corona1Mat = new THREE.MeshBasicMaterial({
      color: 0xffbb33,
      transparent: true,
      opacity: 0.8,
    });
    const corona1 = new THREE.Mesh(corona1Geo, corona1Mat);
    coreGroup.add(corona1);

    // Outer Orange Corona
    const corona2Geo = new THREE.SphereGeometry(0.72, 24, 24);
    const corona2Mat = new THREE.MeshBasicMaterial({
      color: 0xff4500,
      transparent: true,
      opacity: 0.45,
    });
    const corona2 = new THREE.Mesh(corona2Geo, corona2Mat);
    coreGroup.add(corona2);

    // 3. Three 3D Orbital Electron Rings with multiple electrons
    const createOrbitRing = (rx: number, ry: number, rz: number, colorHex: number) => {
      const ringGroup = new THREE.Group();
      ringGroup.rotation.set(rx, ry, rz);

      // Orbital ellipse track line
      const curve = new THREE.EllipseCurve(0, 0, 1.95, 0.8, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(96);
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.85,
        linewidth: 2,
      });
      const line = new THREE.Line(geom, mat);
      ringGroup.add(line);

      // Primary Electron Sphere
      const eGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const eMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const electron1 = new THREE.Mesh(eGeo, eMat);
      ringGroup.add(electron1);

      // Secondary Opposing Electron
      const electron2 = new THREE.Mesh(eGeo, new THREE.MeshBasicMaterial({ color: 0xffe066 }));
      ringGroup.add(electron2);

      // Halo around electron
      const haloGeo = new THREE.SphereGeometry(0.22, 12, 12);
      const haloMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.6,
      });
      const halo1 = new THREE.Mesh(haloGeo, haloMat);
      electron1.add(halo1);

      scene.add(ringGroup);
      return { ringGroup, curve, electron1, electron2 };
    };

    const orbit1 = createOrbitRing(Math.PI / 3, Math.PI / 5, 0, 0xffaa33);
    const orbit2 = createOrbitRing(Math.PI / 3, -Math.PI / 3.8, Math.PI / 2.8, 0xff5511);
    const orbit3 = createOrbitRing(0, Math.PI / 2.2, -Math.PI / 5, 0xffcc22);

    // 4. Point Light for atmospheric glow
    const pointLight = new THREE.PointLight(0xff6622, 5, 12);
    scene.add(pointLight);

    // 5. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Core pulsating breathing
      const pulse = 1 + Math.sin(t * 6) * 0.14;
      coreGroup.scale.set(pulse, pulse, pulse);
      corona1.material.opacity = 0.65 + Math.sin(t * 8) * 0.25;
      corona2.material.opacity = 0.35 + Math.sin(t * 5 + 1) * 0.2;

      // Rotate orbital planes smoothly in 3D
      orbit1.ringGroup.rotation.z += 0.009;
      orbit2.ringGroup.rotation.z -= 0.007;
      orbit3.ringGroup.rotation.x += 0.008;

      // Orbit 1 electrons
      const p1a = orbit1.curve.getPoint((t * 0.5) % 1);
      orbit1.electron1.position.set(p1a.x, p1a.y, 0);
      const p1b = orbit1.curve.getPoint((t * 0.5 + 0.5) % 1);
      orbit1.electron2.position.set(p1b.x, p1b.y, 0);

      // Orbit 2 electrons
      const p2a = orbit2.curve.getPoint((t * 0.6 + 0.3) % 1);
      orbit2.electron1.position.set(p2a.x, p2a.y, 0);
      const p2b = orbit2.curve.getPoint((t * 0.6 + 0.8) % 1);
      orbit2.electron2.position.set(p2b.x, p2b.y, 0);

      // Orbit 3 electrons
      const p3a = orbit3.curve.getPoint((t * 0.45 + 0.6) % 1);
      orbit3.electron1.position.set(p3a.x, p3a.y, 0);
      const p3b = orbit3.curve.getPoint((t * 0.45 + 0.1) % 1);
      orbit3.electron2.position.set(p3b.x, p3b.y, 0);

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
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-28 pointer-events-none select-none" />;
};
