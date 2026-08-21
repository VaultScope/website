import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─── Config ───────────────────────────────────────────────────────────────────
const MOBILE        = window.innerWidth < 768;
const COLS          = MOBILE ? 2 : 3;
const UNITS_PER_COL = MOBILE ? 7 : 11;
const UNIT_W        = 180;
const UNIT_H        = 8;
const UNIT_D        = 40;
const UNIT_GAP      = 5;          // vertical gap between units
const COL_SPACING   = 220;        // horizontal spacing between columns
const FADE_DELAY    = 350;
const FADE_DUR      = 1900;
const AUTO_ROT      = 0.0003;    // rad/frame around Y

export const HeroCanvas: React.FC = () => {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    // ── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Scene / Camera ───────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, W / H, 1, 4000);
    camera.position.set(0, 0, 820);

    // ── Rack group (holds all columns, offset slightly left) ─────────────────
    const rackGroup = new THREE.Group();
    rackGroup.position.x = MOBILE ? 0 : 80;
    scene.add(rackGroup);

    // ── Shared server-unit materials ──────────────────────────────────────────
    const unitMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      wireframe: true,
      depthWrite: false,
    });

    // ── Build server units ────────────────────────────────────────────────────
    const unitGeo = new THREE.BoxGeometry(UNIT_W, UNIT_H, UNIT_D);

    interface LEDData {
      mesh: THREE.Mesh;
      mat:  THREE.MeshBasicMaterial;
      bright: boolean;
      phase:  number;
      speed:  number;
    }
    const leds: LEDData[] = [];

    const totalColsW  = (COLS - 1) * COL_SPACING;
    const totalUnitsH = UNITS_PER_COL * (UNIT_H + UNIT_GAP) - UNIT_GAP;

    for (let col = 0; col < COLS; col++) {
      const cx = col * COL_SPACING - totalColsW / 2;
      for (let row = 0; row < UNITS_PER_COL; row++) {
        const cy = row * (UNIT_H + UNIT_GAP) - totalUnitsH / 2;

        // Server body
        const unit = new THREE.Mesh(unitGeo, unitMat);
        unit.position.set(cx, cy, 0);
        rackGroup.add(unit);

        // Wireframe overlay
        const wire = new THREE.Mesh(unitGeo, wireMat);
        wire.position.copy(unit.position);
        rackGroup.add(wire);

        // LED sphere — front face, near left edge
        const ledGeo = new THREE.SphereGeometry(1.4, 6, 6);
        const bright  = Math.random() > 0.35;
        const ledMat  = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        });
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(
          cx - UNIT_W / 2 + 14,
          cy,
          UNIT_D / 2 + 1.5,
        );
        rackGroup.add(led);

        leds.push({
          mesh: led,
          mat:  ledMat,
          bright,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.9,
        });
      }
    }

    // ── Fade-in state ─────────────────────────────────────────────────────────
    const fadeStart = performance.now() + FADE_DELAY;
    let fadeDone    = false;
    let globalAlpha = 0;

    // ── Mouse parallax ────────────────────────────────────────────────────────
    let targetX = 0, targetY = 0;
    const onMouse = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth  - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // ── Render loop ───────────────────────────────────────────────────────────
    let raf  = 0;
    let camX = 0;
    let camY = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();

      // Fade in
      if (!fadeDone) {
        const t = Math.max(0, Math.min((now - fadeStart) / FADE_DUR, 1));
        const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        globalAlpha = e;
        if (t >= 1) fadeDone = true;
      }

      // Apply global opacity to shared materials
      unitMat.opacity = globalAlpha * 0.055;
      wireMat.opacity = globalAlpha * 0.18;

      // Pulse each LED
      for (const led of leds) {
        const pulse = 0.5 + 0.5 * Math.sin((now / 1000) * led.speed + led.phase);
        if (led.bright) {
          led.mat.opacity = globalAlpha * (0.50 + 0.35 * pulse);
        } else {
          led.mat.opacity = globalAlpha * (0.08 + 0.14 * pulse);
        }
      }

      // Slow auto-rotation
      rackGroup.rotation.y += AUTO_ROT;

      // Smooth camera parallax
      camX += (targetX * 65  - camX) * 0.02;
      camY += (-targetY * 32 - camY) * 0.02;
      camera.position.x = camX;
      camera.position.y = camY;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    tick();

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize',    onResize);

      unitGeo.dispose();
      unitMat.dispose();
      wireMat.dispose();
      for (const led of leds) {
        (led.mesh.geometry as THREE.BufferGeometry).dispose();
        led.mat.dispose();
      }
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mount}
      className="absolute inset-0"
      style={{ pointerEvents: 'none' }}
    />
  );
};
