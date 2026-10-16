import React, { useEffect, useRef } from 'react';
import { useFlightStore } from '../../store/flightStore';

export const OceanSimulationCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { missionPhase, timelineProgress, cameraZoom } = useFlightStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Dynamic Camera Zoom & Interpolation
    let currentZoom = cameraZoom;

    // Draw the Cargo Vessel
    const drawShip = (time: number, w: number, h: number, phase: string, progress: number) => {
      const shipX = w * 0.46;
      const shipY = h * 0.44;
      const baseScale = Math.min(w / 1400, 1.1) * currentZoom;

      ctx.save();
      ctx.translate(shipX, shipY);
      ctx.scale(baseScale, baseScale);
      ctx.rotate(-0.48); // Diagonal perspective of the ship

      // 1. Fluid Water Wakes (Port & Starboard)
      ctx.save();
      const wakeLength = 560;

      // Port Wake (Left)
      const gradWakeL = ctx.createLinearGradient(0, -90, -wakeLength, -240);
      gradWakeL.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
      gradWakeL.addColorStop(0.25, 'rgba(180, 220, 240, 0.3)');
      gradWakeL.addColorStop(1, 'rgba(180, 220, 240, 0)');
      ctx.fillStyle = gradWakeL;
      ctx.beginPath();
      ctx.moveTo(120, -70);
      ctx.bezierCurveTo(-100, -120, -280, -180, -wakeLength, -220);
      ctx.lineTo(-wakeLength + 40, -250);
      ctx.bezierCurveTo(-260, -170, -100, -110, 100, -85);
      ctx.closePath();
      ctx.fill();

      // Starboard Wake (Right)
      const gradWakeR = ctx.createLinearGradient(0, 90, -wakeLength, 240);
      gradWakeR.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
      gradWakeR.addColorStop(0.25, 'rgba(180, 220, 240, 0.3)');
      gradWakeR.addColorStop(1, 'rgba(180, 220, 240, 0)');
      ctx.fillStyle = gradWakeR;
      ctx.beginPath();
      ctx.moveTo(120, 70);
      ctx.bezierCurveTo(-100, 120, -280, 180, -wakeLength, 220);
      ctx.lineTo(-wakeLength + 40, 250);
      ctx.bezierCurveTo(-260, 170, -100, 110, 100, 85);
      ctx.closePath();
      ctx.fill();

      // Stern Propeller Wash
      for (let i = 0; i < 4; i++) {
        const offset = ((time * 70 + i * 80) % 320);
        const alpha = Math.max(0, 1 - offset / 320) * 0.4;
        ctx.fillStyle = `rgba(235, 248, 255, ${alpha})`;
        ctx.beginPath();
        ctx.ellipse(-280 - offset, Math.sin(time * 3 + i) * 6, 25 + offset * 0.15, 12 + offset * 0.08, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 2. Ship Main Hull (Bulk Carrier Profile)
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
      ctx.shadowBlur = 35;
      ctx.shadowOffsetX = 12;
      ctx.shadowOffsetY = 30;

      const hullGrad = ctx.createLinearGradient(0, -90, 0, 90);
      hullGrad.addColorStop(0, '#1c2430');
      hullGrad.addColorStop(0.5, '#121822');
      hullGrad.addColorStop(1, '#0a0e16');
      ctx.fillStyle = hullGrad;
      ctx.strokeStyle = '#2c394b';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(-280, -65);
      ctx.lineTo(160, -78);
      ctx.bezierCurveTo(280, -60, 360, -20, 390, 0);
      ctx.bezierCurveTo(360, 20, 280, 60, 160, 78);
      ctx.lineTo(-280, 65);
      ctx.bezierCurveTo(-295, 40, -295, -40, -280, -65);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Red Keel Waterline
      ctx.strokeStyle = 'rgba(180, 40, 30, 0.65)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-275, 67);
      ctx.lineTo(160, 80);
      ctx.bezierCurveTo(275, 62, 355, 22, 385, 0);
      ctx.stroke();
      ctx.restore();

      // 3. Cargo Deck Area & Cargo Holds
      ctx.save();
      ctx.fillStyle = '#0f141c';
      ctx.fillRect(-220, -56, 380, 112);

      const holds = [
        { x: -190, y: -45, w: 75, h: 40, id: 1 },
        { x: -190, y: 5, w: 75, h: 40, id: 2 },
        { x: -100, y: -45, w: 75, h: 40, id: 3 },
        { x: -100, y: 5, w: 75, h: 40, id: 4 },
        { x: -10, y: -45, w: 75, h: 40, id: 5 },
        { x: -10, y: 5, w: 75, h: 40, id: 6, isNuclear: true },
        { x: 80, y: -45, w: 70, h: 40, id: 7 },
        { x: 80, y: 5, w: 70, h: 40, id: 8 },
      ];

      // Laser scanner position along deck based on timeline progress
      const laserX = -220 + (progress / 100) * 380;

      holds.forEach((h) => {
        const isPastLaser = laserX > h.x;

        if (h.isNuclear && (phase === 'threat_locked' || progress > 70)) {
          // GOWING ORANGE NUCLEAR HAZARD CONTAINER
          const pulse = 0.7 + Math.sin(time * 6) * 0.3;
          ctx.save();
          ctx.shadowColor = 'rgba(255, 102, 51, 1)';
          ctx.shadowBlur = 28 * pulse;
          ctx.fillStyle = `rgba(255, 102, 51, ${0.45 * pulse})`;
          ctx.strokeStyle = `rgba(255, 160, 80, ${0.95 * pulse})`;
          ctx.lineWidth = 2.5;
          ctx.fillRect(h.x, h.y, h.w, h.h);
          ctx.strokeRect(h.x, h.y, h.w, h.h);

          // Diagonal Hazard Stripes
          ctx.strokeStyle = 'rgba(255, 220, 120, 0.65)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          for (let gx = h.x; gx < h.x + h.w; gx += 9) {
            ctx.moveTo(gx, h.y);
            ctx.lineTo(gx + 12, h.y + h.h);
          }
          ctx.stroke();
          ctx.restore();
        } else if (isPastLaser && phase !== 'approach') {
          // Cyan Holographic Scanned Wireframe Container
          ctx.save();
          ctx.fillStyle = 'rgba(60, 230, 184, 0.14)';
          ctx.strokeStyle = 'rgba(60, 230, 184, 0.75)';
          ctx.lineWidth = 1.5;
          ctx.fillRect(h.x, h.y, h.w, h.h);
          ctx.strokeRect(h.x, h.y, h.w, h.h);

          ctx.strokeStyle = 'rgba(60, 230, 184, 0.35)';
          ctx.lineWidth = 0.8;
          ctx.strokeRect(h.x + 4, h.y + 4, h.w - 8, h.h - 8);
          ctx.restore();
        } else {
          // Standard Dark Cargo Hatch
          ctx.fillStyle = '#171e29';
          ctx.strokeStyle = '#273244';
          ctx.lineWidth = 1;
          ctx.fillRect(h.x, h.y, h.w, h.h);
          ctx.strokeRect(h.x, h.y, h.w, h.h);
        }
      });

      // Active Inspection Laser Sweep Line (Active during scan phases)
      if (phase !== 'approach') {
        ctx.save();
        ctx.strokeStyle = 'rgba(60, 230, 184, 0.95)';
        ctx.shadowColor = 'rgba(60, 230, 184, 1)';
        ctx.shadowBlur = 18;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(laserX, -60);
        ctx.lineTo(laserX, 60);
        ctx.stroke();

        const trailGrad = ctx.createLinearGradient(laserX - 55, 0, laserX, 0);
        trailGrad.addColorStop(0, 'rgba(60, 230, 184, 0)');
        trailGrad.addColorStop(1, 'rgba(60, 230, 184, 0.28)');
        ctx.fillStyle = trailGrad;
        ctx.fillRect(laserX - 55, -60, 55, 120);
        ctx.restore();
      }

      // 4. Superstructure / Bridge & Radar Mast
      ctx.save();
      ctx.translate(-230, 0);

      const isBridgeScanned = phase !== 'approach';

      // Base Tower
      ctx.fillStyle = isBridgeScanned ? 'rgba(32, 45, 62, 0.95)' : '#202a38';
      ctx.strokeStyle = isBridgeScanned ? '#3ce6b8' : '#34455c';
      ctx.lineWidth = isBridgeScanned ? 2 : 1.5;
      if (isBridgeScanned) {
        ctx.shadowColor = 'rgba(60, 230, 184, 0.6)';
        ctx.shadowBlur = 12;
      }
      ctx.beginPath();
      ctx.roundRect(-40, -42, 80, 84, 6);
      ctx.fill();
      ctx.stroke();

      // Bridge Deck Level & Wireframe Glow
      ctx.fillStyle = isBridgeScanned ? 'rgba(44, 65, 88, 0.9)' : '#2c3a4e';
      ctx.fillRect(-28, -32, 56, 64);
      if (isBridgeScanned) {
        ctx.strokeStyle = 'rgba(60, 230, 184, 0.4)';
        ctx.strokeRect(-28, -32, 56, 64);
      }

      // Windows
      ctx.fillStyle = '#68d391';
      ctx.shadowColor = '#68d391';
      ctx.shadowBlur = 6;
      ctx.fillRect(15, -28, 6, 56);

      // Lifeboat
      ctx.fillStyle = '#ff6633';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.ellipse(-15, 42, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Radar Mast & Rotating Antenna
      ctx.strokeStyle = '#8ea0b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -65);
      ctx.stroke();

      ctx.save();
      ctx.translate(0, -65);
      ctx.rotate(time * 4);
      ctx.strokeStyle = '#3ce6b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-16, 0);
      ctx.lineTo(16, 0);
      ctx.stroke();
      ctx.restore();

      ctx.restore(); // Superstructure restore
      ctx.restore(); // Ship restore
    };

    // Draw Autonomous Drones in Formation
    const drawDrone = (
      x: number,
      y: number,
      time: number,
      scale: number,
      hasScannerBeam: boolean,
      label: string
    ) => {
      ctx.save();
      const hoverY = Math.sin(time * 2.5 + x) * 6;
      ctx.translate(x, y + hoverY);
      ctx.scale(scale * currentZoom, scale * currentZoom);

      // 1. Projected Conic Scanner Beam down toward ship
      if (hasScannerBeam) {
        ctx.save();
        const beamGrad = ctx.createLinearGradient(0, 10, 0, 190);
        beamGrad.addColorStop(0, 'rgba(60, 230, 184, 0.45)');
        beamGrad.addColorStop(0.4, 'rgba(60, 230, 184, 0.18)');
        beamGrad.addColorStop(1, 'rgba(60, 230, 184, 0)');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(-95, 195);
        ctx.lineTo(95, 195);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(60, 230, 184, 0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(-50, 100);
        ctx.lineTo(50, 100);
        ctx.moveTo(-80, 160);
        ctx.lineTo(80, 160);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Drone Carbon-Fiber Airframe
      ctx.strokeStyle = '#2d3b4e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-28, -20);
      ctx.lineTo(28, 20);
      ctx.moveTo(-28, 20);
      ctx.lineTo(28, -20);
      ctx.stroke();

      // Central Body Pod
      ctx.fillStyle = '#1e2838';
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#4e617d';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Top Status LED
      ctx.fillStyle = '#3ce6b8';
      ctx.shadowColor = '#3ce6b8';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(0, -2, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 4 Spinning Propeller Discs with Motion Blur
      const armEndPoints = [
        { x: -28, y: -20 },
        { x: 28, y: -20 },
        { x: -28, y: 20 },
        { x: 28, y: 20 },
      ];

      armEndPoints.forEach((pt, i) => {
        ctx.fillStyle = '#0f141d';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fill();

        const propRot = time * 25 + i * Math.PI;
        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(propRot);
        ctx.fillStyle = 'rgba(200, 220, 240, 0.45)';
        ctx.fillRect(-14, -1.5, 28, 3);
        ctx.fillStyle = 'rgba(60, 230, 184, 0.16)';
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Drone HUD Tag Label
      ctx.fillStyle = 'rgba(10, 15, 22, 0.88)';
      ctx.strokeStyle = 'rgba(60, 230, 184, 0.45)';
      ctx.lineWidth = 1;
      ctx.fillRect(16, -24, 64, 16);
      ctx.strokeRect(16, -24, 64, 16);
      ctx.fillStyle = '#3ce6b8';
      ctx.font = '8px monospace';
      ctx.fillText(label, 20, -13);

      ctx.restore();
    };

    // 5. Animation Loop
    const render = () => {
      t += 0.02;
      const w = canvas.width;
      const h = canvas.height;

      // Smooth camera zoom interpolation
      currentZoom += (cameraZoom - currentZoom) * 0.05;

      // Deep Ocean Shader
      const oceanGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, 100, w * 0.5, h * 0.45, w * 0.85);
      oceanGrad.addColorStop(0, '#101722');
      oceanGrad.addColorStop(0.5, '#0b1118');
      oceanGrad.addColorStop(1, '#06090e');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, w, h);

      // Water Swell Waves
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1.5;
      for (let y = 0; y < h; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < w; x += 60) {
          const dy = Math.sin(x * 0.008 + t + y * 0.02) * 5;
          ctx.lineTo(x, y + dy);
        }
        ctx.stroke();
      }

      // Draw Cruising Cargo Vessel
      drawShip(t, w, h, missionPhase, timelineProgress);

      // Draw Drone 1 (Primary Scanner)
      drawDrone(w * 0.76, h * 0.18, t, 1.25, true, 'AXS-332.01');

      // Draw Drone 2 (Flank Scout)
      drawDrone(w * 0.26, h * 0.32, t + 1.5, 0.95, false, 'AXS-332.02');

      // Draw Drone 3 (High-Altitude Sentry)
      drawDrone(w * 0.12, h * 0.12, t + 3, 0.75, true, 'AXS-332.03');

      // Trailing USV Boat in the Water (Bottom Right)
      ctx.save();
      const usvX = w * 0.82;
      const usvY = h * 0.64;
      ctx.translate(usvX, usvY);
      ctx.scale(currentZoom, currentZoom);
      ctx.rotate(-0.48);

      const usvWake = ctx.createLinearGradient(0, 0, -120, 0);
      usvWake.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      usvWake.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = usvWake;
      ctx.beginPath();
      ctx.moveTo(-15, -4);
      ctx.lineTo(-120, -18);
      ctx.lineTo(-120, 18);
      ctx.lineTo(-15, 4);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#1c2430';
      ctx.strokeStyle = '#3ce6b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(25, 0);
      ctx.lineTo(-20, -9);
      ctx.lineTo(-25, 0);
      ctx.lineTo(-20, 9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#3ce6b8';
      ctx.fillRect(-8, -4, 8, 8);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [missionPhase, timelineProgress, cameraZoom]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
    />
  );
};
