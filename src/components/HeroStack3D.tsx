import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Generates perimeter points for a rounded square (squircle).
 */
function getSquirclePoints(
  size: number,
  radius: number,
  cornerSegments = 8
): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [];
  const half = size / 2;
  const inner = half - radius;

  const pushArc = (cx: number, cy: number, startAngle: number) => {
    for (let i = 0; i <= cornerSegments; i++) {
      const theta = startAngle + (i / cornerSegments) * (Math.PI / 2);
      pts.push(new THREE.Vector2(cx + Math.cos(theta) * radius, cy + Math.sin(theta) * radius));
    }
  };

  // Bottom-right corner (-90° to 0°)
  pushArc(inner, -inner, -Math.PI / 2);
  // Top-right / front corner (0° to 90°)
  pushArc(inner, inner, 0);
  // Top-left corner (90° to 180°)
  pushArc(-inner, inner, Math.PI / 2);
  // Bottom-left corner (180° to 270°)
  pushArc(-inner, -inner, Math.PI);

  return pts;
}

/**
 * Builds a watertight outward-facing vertical wall between [yBottom, yTop]
 * with smooth vertex normals so edges never shimmer or show barcode stripes.
 */
function createSmoothWallGeometry(
  pts: THREE.Vector2[],
  yBottom: number,
  yTop: number
): THREE.BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const n = pts.length;

  // Compute smooth outward 2D normals at each perimeter point
  const ptNormals: THREE.Vector2[] = [];
  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n];
    const curr = pts[i];
    const next = pts[(i + 1) % n];

    const t1 = new THREE.Vector2(curr.x - prev.x, curr.y - prev.y).normalize();
    const t2 = new THREE.Vector2(next.x - curr.x, next.y - curr.y).normalize();
    const avgTangent = t1.add(t2).normalize();
    // Outward normal in (x, z=y) plane
    ptNormals.push(new THREE.Vector2(avgTangent.y, -avgTangent.x).normalize());
  }

  for (let i = 0; i < n; i++) {
    const nextIdx = (i + 1) % n;
    const p0 = pts[i];
    const p1 = pts[nextIdx];
    const n0 = ptNormals[i];
    const n1 = ptNormals[nextIdx];

    // Outward-facing vertical quad (2 triangles)
    positions.push(p0.x, yBottom, p0.y);
    positions.push(p0.x, yTop, p0.y);
    positions.push(p1.x, yTop, p1.y);

    normals.push(n0.x, 0, n0.y);
    normals.push(n0.x, 0, n0.y);
    normals.push(n1.x, 0, n1.y);

    positions.push(p0.x, yBottom, p0.y);
    positions.push(p1.x, yTop, p1.y);
    positions.push(p1.x, yBottom, p1.y);

    normals.push(n0.x, 0, n0.y);
    normals.push(n1.x, 0, n1.y);
    normals.push(n1.x, 0, n1.y);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  return geo;
}

/**
 * Builds a watertight upward-facing (+Y normal) flat cap geometry sharing exact perimeter vertices.
 */
function createSolidCapGeometry(pts: THREE.Vector2[], y: number): THREE.BufferGeometry {
  const positions: number[] = [];
  const n = pts.length;

  for (let i = 0; i < n; i++) {
    const p0 = pts[i];
    const p1 = pts[(i + 1) % n];

    // Upward (+Y) winding in (x, y, z) where z = p.y
    positions.push(0, y, 0);
    positions.push(p1.x, y, p1.y);
    positions.push(p0.x, y, p0.y);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  return geo;
}

/**
 * Builds a flat upward-facing (+Y normal) ring geometry between innerPts and outerPts at height y.
 */
function createFlatRingGeometry(
  outerPts: THREE.Vector2[],
  innerPts: THREE.Vector2[],
  y: number
): THREE.BufferGeometry {
  const positions: number[] = [];
  const n = outerPts.length;

  for (let i = 0; i < n; i++) {
    const o0 = outerPts[i];
    const o1 = outerPts[(i + 1) % n];
    const n0 = innerPts[i];
    const n1 = innerPts[(i + 1) % n];

    positions.push(n0.x, y, n0.y);
    positions.push(o1.x, y, o1.y);
    positions.push(o0.x, y, o0.y);

    positions.push(n0.x, y, n0.y);
    positions.push(n1.x, y, n1.y);
    positions.push(o1.x, y, o1.y);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  return geo;
}

export const HeroStack3D = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Skip WebGL setup in JSDOM unit tests
    if (typeof window === 'undefined' || /jsdom/i.test(window.navigator?.userAgent || '')) {
      return;
    }

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    // Use at least 2x supersampling so diagonal edges never shimmer on 1x displays
    renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio || 1, 2), 2.5));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();

    // Isometric orthographic camera
    const frustumSize = 3.9;
    const camera = new THREE.OrthographicCamera(
      -frustumSize / 2,
      frustumSize / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      50
    );
    camera.position.set(5.5, 4.4, 5.5);
    camera.lookAt(0, -0.05, 0);

    // Directional lighting to shade left wall, rounded front corner, and right wall cleanly
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
    keyLight.position.set(-5, 6, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xc4b5fd, 0.75);
    fillLight.position.set(6, 3, 2);
    scene.add(fillLight);

    const disposables: Array<{ dispose: () => void }> = [];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    const plateSize = 2.22;
    const cornerRadius = 0.44;
    const rimThickness = 0.052;

    const outerPts = getSquirclePoints(plateSize, cornerRadius, 10);
    const innerPts = getSquirclePoints(
      plateSize - rimThickness * 2,
      Math.max(0.1, cornerRadius - rimThickness),
      10
    );

    // ─── LOWER PLATE (Filled Sleek Purple Top + Smooth 3D Shaded Purple Walls) ───
    const lowerGroup = new THREE.Group();
    const lowerHeight = 0.34;
    const lowerHalfH = lowerHeight / 2;

    const lowerWallGeo = track(
      createSmoothWallGeometry(outerPts, -lowerHalfH, lowerHalfH)
    );
    const lowerWallMat = track(
      new THREE.MeshLambertMaterial({
        color: 0x6d28d9,
        emissive: 0x2e1065,
        emissiveIntensity: 0.35,
        side: THREE.FrontSide,
      })
    );
    const lowerWallMesh = new THREE.Mesh(lowerWallGeo, lowerWallMat);
    lowerGroup.add(lowerWallMesh);

    const lowerInnerCapGeo = track(createSolidCapGeometry(innerPts, lowerHalfH));
    const lowerTopFillMat = track(
      new THREE.MeshBasicMaterial({
        color: 0x9b5de5,
        side: THREE.FrontSide,
      })
    );
    const lowerTopCap = new THREE.Mesh(lowerInnerCapGeo, lowerTopFillMat);
    lowerGroup.add(lowerTopCap);

    const lowerRimGeo = track(
      createFlatRingGeometry(outerPts, innerPts, lowerHalfH)
    );
    const lowerRimMat = track(
      new THREE.MeshBasicMaterial({
        color: 0xb784f7,
        side: THREE.FrontSide,
      })
    );
    const lowerTopRim = new THREE.Mesh(lowerRimGeo, lowerRimMat);
    lowerGroup.add(lowerTopRim);

    lowerGroup.position.y = -0.56;
    scene.add(lowerGroup);

    // ─── UPPER PLATE (Theme-Adaptive Top Cap, Rim & Sculpted Side Walls) ───
    const upperGroup = new THREE.Group();
    const upperHeight = 0.25;
    const upperHalfH = upperHeight / 2;

    const upperWallGeo = track(
      createSmoothWallGeometry(outerPts, -upperHalfH, upperHalfH)
    );
    const upperWallMat = track(
      new THREE.MeshLambertMaterial({
        color: 0x23232f,
        emissive: 0x0b0b10,
        emissiveIntensity: 0.4,
        side: THREE.FrontSide,
      })
    );
    const upperWallMesh = new THREE.Mesh(upperWallGeo, upperWallMat);
    upperGroup.add(upperWallMesh);

    const upperInnerCapGeo = track(createSolidCapGeometry(innerPts, upperHalfH));
    const upperCapMat = track(
      new THREE.MeshBasicMaterial({
        color: 0x070708,
        side: THREE.FrontSide,
      })
    );
    const upperTopCap = new THREE.Mesh(upperInnerCapGeo, upperCapMat);
    upperGroup.add(upperTopCap);

    const upperRimGeo = track(
      createFlatRingGeometry(outerPts, innerPts, upperHalfH)
    );
    const upperRimMat = track(
      new THREE.MeshBasicMaterial({
        color: 0x9ca3af,
        side: THREE.FrontSide,
      })
    );
    const upperTopRim = new THREE.Mesh(upperRimGeo, upperRimMat);
    upperGroup.add(upperTopRim);

    upperGroup.position.y = 0.52;
    scene.add(upperGroup);

    const isDarkThemeActive = (): boolean => {
      const root = document.documentElement;
      if (root.classList.contains('light')) return false;
      return root.classList.contains('dark');
    };

    const applyThemePalette = (isDark: boolean) => {
      if (isDark) {
        // Dark Mode: Designer Black top plate with silver rim & obsidian walls
        ambientLight.intensity = 0.9;
        keyLight.intensity = 1.35;
        fillLight.color.setHex(0xc4b5fd);
        fillLight.intensity = 0.75;

        upperCapMat.color.setHex(0x070708);
        upperRimMat.color.setHex(0x9ca3af);
        upperWallMat.color.setHex(0x23232f);
        upperWallMat.emissive.setHex(0x0b0b10);
        upperWallMat.emissiveIntensity = 0.4;

        lowerTopFillMat.color.setHex(0x9b5de5);
        lowerRimMat.color.setHex(0xb784f7);
        lowerWallMat.color.setHex(0x6d28d9);
        lowerWallMat.emissive.setHex(0x2e1065);
        lowerWallMat.emissiveIntensity = 0.35;
      } else {
        // Light / White Mode: Crisp alabaster-white top plate with slate rim & sculpted silver-slate walls
        ambientLight.intensity = 0.95;
        keyLight.intensity = 1.25;
        fillLight.color.setHex(0xddd6fe);
        fillLight.intensity = 0.65;

        upperCapMat.color.setHex(0xffffff);
        upperRimMat.color.setHex(0x64748b);
        upperWallMat.color.setHex(0xcbd5e1);
        upperWallMat.emissive.setHex(0x475569);
        upperWallMat.emissiveIntensity = 0.22;

        lowerTopFillMat.color.setHex(0x9b5de5);
        lowerRimMat.color.setHex(0x7c3aed);
        lowerWallMat.color.setHex(0x6d28d9);
        lowerWallMat.emissive.setHex(0x3b0764);
        lowerWallMat.emissiveIntensity = 0.26;
      }
    };

    applyThemePalette(isDarkThemeActive());

    // Mount canvas
    const domElement = renderer.domElement;
    domElement.style.width = '100%';
    domElement.style.height = '100%';
    domElement.style.display = 'block';
    container.appendChild(domElement);

    const updateSize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth || 420;
      const height = container.clientHeight || 420;
      const aspect = width / height;
      camera.left = (-frustumSize * aspect) / 2;
      camera.right = (frustumSize * aspect) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateSize();
      });
      resizeObserver.observe(container);
    }

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let isVisible = true;
    let isTabActive = !document.hidden;
    let rafId: number | null = null;
    const startTime = performance.now();

    const renderFrame = (now: number) => {
      if (!renderer) return;
      const t = (now - startTime) * 0.001;

      if (!prefersReducedMotion) {
        // Pure vertical float with zero rotational wobble so diagonal edges never shimmer
        upperGroup.position.y = 0.52 + Math.sin(t * 1.4) * 0.1;
        lowerGroup.position.y = -0.56 - Math.sin(t * 1.4) * 0.08;
      }

      renderer.render(scene, camera);

      if (!prefersReducedMotion && isVisible && isTabActive) {
        rafId = window.requestAnimationFrame(renderFrame);
      } else {
        rafId = null;
      }
    };

    const startLoop = () => {
      if (rafId === null && isVisible && isTabActive && !prefersReducedMotion) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    const stopLoop = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    // Initial render
    renderFrame(performance.now());

    // Pause when scrolled out of viewport
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isVisible = Boolean(entry?.isIntersecting);
          if (isVisible) {
            startLoop();
          } else {
            stopLoop();
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(container);
    }

    const onVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isTabActive) {
        startLoop();
      } else {
        stopLoop();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    let themeObserver: MutationObserver | null = null;
    if (typeof MutationObserver !== 'undefined') {
      themeObserver = new MutationObserver(() => {
        applyThemePalette(isDarkThemeActive());
        if (renderer) {
          renderer.render(scene, camera);
        }
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    return () => {
      stopLoop();
      window.removeEventListener('resize', updateSize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (resizeObserver) resizeObserver.disconnect();
      if (observer) observer.disconnect();
      if (themeObserver) themeObserver.disconnect();

      for (const item of disposables) {
        item.dispose();
      }
      if (renderer) {
        renderer.dispose();
        if (domElement.parentNode === container) {
          container.removeChild(domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      role="img"
      aria-label="VaultScope 3D Infrastructure Stack"
      className="relative w-full max-w-[460px] lg:max-w-[540px] xl:max-w-[600px] h-[340px] sm:h-[390px] lg:h-[490px] xl:h-[550px] pointer-events-none select-none"
    />
  );
};
