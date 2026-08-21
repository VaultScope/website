import { useEffect, useRef, useState, useMemo } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useInView,
  useTransform,
} from 'framer-motion';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { WaitlistForm } from '../components/WaitlistForm';
import { ArrowRight, Server, Shield, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Helper Components ─────────────────────────────────────────────────────────

const FadeIn = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

// ─── Three.js VaultScope Canvas ────────────────────────────────────────────────

const VaultScopeCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const scrollProgressRef = useRef(0);
  const rackGroupRef = useRef<THREE.Group | null>(null);

  // Scroll-driven opacity: stays visible through hero + infra section, then fades to 0
  const { scrollY } = useScroll();
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  const canvasOpacity = useTransform(scrollY, [0, vh * 0.8, vh * 2.0], [1, 1, 0]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    const el = mountRef.current;
    if (!el || !loaded) return;

    const width = el.clientWidth;
    const height = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // Camera starts close — rack already fills ~half the frame at page load
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 5000);
    camera.position.set(0, 0, 560);

    // ── Lighting ──────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 50));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(200, 400, 300);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x3355ee, 0.7);
    rimLight.position.set(-250, -100, -200);
    scene.add(rimLight);

    // Green accent from below — server-room atmosphere
    const accentLight = new THREE.PointLight(0x00cc77, 0.8, 1200);
    accentLight.position.set(0, -300, 200);
    scene.add(accentLight);

    // ── Rack group — shifted down so the rack sits lower in the viewport ────
    const rackGroup = new THREE.Group();
    rackGroup.position.y = -400;
    rackGroup.rotation.y = -0.25; // fixed slight angle — shows depth without animating
    scene.add(rackGroup);
    rackGroupRef.current = rackGroup;

    // ── Events ────────────────────────────────────────────────────────────────
    const onResize = () => {
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Fly-in progress: 0 → 1 over the first 60 % of viewport height
    const updateScroll = () => {
      scrollProgressRef.current = Math.min(
        1,
        window.scrollY / (window.innerHeight * 0.6),
      );
    };
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();

    // ── Render loop — only scroll changes state; lerp settles quickly ─────────
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);

      const progress = scrollProgressRef.current;

      // Camera zooms from z=560 → z=370 as the user scrolls  (25% smaller start, 30% smaller end)
      const targetCamZ = 560 - progress * 190;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', updateScroll);
      renderer.dispose();
      scene.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [loaded]);

  // ── Load GLB model ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    const loader = new GLTFLoader();
    loader.load(
      '/3d/server_rack.glb',
      (gltf) => {
        const model = gltf.scene;

        // Normalise: fit the longest axis to 700 world-units (way larger)
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const scaleFactor = 700 / Math.max(size.x, size.y, size.z);
        model.scale.setScalar(scaleFactor);

        // Centre on origin
        box.setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center);

        rackGroupRef.current?.add(model);
      },
      undefined,
      (error) => console.error('Failed to load server rack model:', error),
    );
  }, [loaded]);

  return (
    <motion.div
      ref={mountRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: canvasOpacity,
      }}
    />
  );
};

// ─── Hosting Compare Section ───────────────────────────────────────────────────

const HostingCompareSection = () => {
  const [activeTab, setActiveTab] = useState<'vps' | 'dedicated'>('vps');
  
  const scrollY = useScroll();
  const progress = useTransform(scrollY.scrollYProgress, [0, 0.3], [0, 1]);

  const CloudVPSVisual = () => {
    const cpuPct = useTransform(progress, [0, 0.5], ['5%', '85%']);
    const ramPct = useTransform(progress, [0, 0.5], ['10%', '72%']);
    const dskPct = useTransform(progress, [0, 0.5], ['15%', '61%']);

    return (
      <motion.div
        style={{
          transform: useTransform(progress, [0, 0.2], ['scale(0.95) translateY(20px)', 'scale(1) translateY(0)']),
          opacity: useTransform(progress, [0, 0.1], [0, 1]),
        }}
        className="w-full border border-border bg-background overflow-hidden"
      >
        <div className="border-b border-border px-6 py-4 flex items-center justify-between bg-foreground/[0.02]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
            </div>
            <span className="text-xs font-mono text-foreground">vps-eu-01</span>
          </div>
          <span className="text-xs font-medium uppercase tracking-widest text-foreground/40">Online</span>
        </div>

        <div className="px-6 pt-6 pb-4">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">CPU</span>
              <span className="text-[10px] font-mono text-foreground/60">85%</span>
            </div>
            <div className="h-[2px] bg-foreground/10 w-full overflow-hidden">
              <motion.div style={{ width: cpuPct }} className="h-full bg-foreground/60" />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">Memory</span>
              <span className="text-[10px] font-mono text-foreground/60">72%</span>
            </div>
            <div className="h-[2px] bg-foreground/10 w-full overflow-hidden">
              <motion.div style={{ width: ramPct }} className="h-full bg-foreground/60" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">Storage</span>
              <span className="text-[10px] font-mono text-foreground/60">61%</span>
            </div>
            <div className="h-[2px] bg-foreground/10 w-full overflow-hidden">
              <motion.div style={{ width: dskPct }} className="h-full bg-foreground/60" />
            </div>
          </div>
        </div>

        <div className="border-t border-border px-6 py-4 grid grid-cols-3 gap-4 text-xs font-mono text-foreground/40 uppercase tracking-widest">
          <div>
            <div className="mb-1">Location</div>
            <div className="text-foreground">EU · West</div>
          </div>
          <div>
            <div className="mb-1">CPU</div>
            <div className="text-foreground">8 Cores</div>
          </div>
          <div>
            <div className="mb-1">RAM</div>
            <div className="text-foreground">32 GB</div>
          </div>
        </div>
      </motion.div>
    );
  };

  const DedicatedVisual = () => {
    const cpuPct = useTransform(progress, [0, 0.5], ['5%', '100%']);
    const ramPct = useTransform(progress, [0, 0.5], ['8%', '100%']);
    const dskPct = useTransform(progress, [0, 0.5], ['12%', '100%']);

    return (
      <motion.div
        style={{
          transform: useTransform(progress, [0, 0.2], ['scale(0.95) translateY(20px)', 'scale(1) translateY(0)']),
          opacity: useTransform(progress, [0, 0.1], [0, 1]),
        }}
        className="w-full border border-border bg-background overflow-hidden"
      >
        <div className="border-b border-border px-6 py-4 flex items-center justify-between bg-foreground/[0.02]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
            </div>
            <span className="text-xs font-mono text-foreground">srv-eu-ded-01</span>
          </div>
          <span className="text-xs font-medium uppercase tracking-widest text-foreground/40">Dedicated</span>
        </div>

        <div className="px-6 pt-4 pb-2">
          <div className="border border-foreground/20 px-4 py-2 bg-foreground/[0.02] rounded-none">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-foreground/60" />
              <span className="text-[9px] font-medium uppercase tracking-widest text-foreground/60">
                100% Exclusive Resources
              </span>
            </div>
            <p className="text-[10px] text-foreground/40">
              No shared tenancy. Every resource belongs exclusively to you.
            </p>
          </div>
        </div>

        <div className="px-6 pt-4 pb-4">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">CPU</span>
              <span className="text-[10px] font-mono text-foreground/60">100%</span>
            </div>
            <div className="h-[3px] bg-foreground/10 w-full overflow-hidden">
              <motion.div style={{ width: cpuPct }} className="h-full bg-foreground" />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">Memory</span>
              <span className="text-[10px] font-mono text-foreground/60">100%</span>
            </div>
            <div className="h-[3px] bg-foreground/10 w-full overflow-hidden">
              <motion.div style={{ width: ramPct }} className="h-full bg-foreground" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">Storage</span>
              <span className="text-[10px] font-mono text-foreground/60">100%</span>
            </div>
            <div className="h-[3px] bg-foreground/10 w-full overflow-hidden">
              <motion.div style={{ width: dskPct }} className="h-full bg-foreground" />
            </div>
          </div>
        </div>

        <div className="border-t border-border px-6 py-4 grid grid-cols-3 gap-4 text-xs font-mono text-foreground/40 uppercase tracking-widest">
          <div>
            <div className="mb-1">Location</div>
            <div className="text-foreground">EU · West</div>
          </div>
          <div>
            <div className="mb-1">CPU</div>
            <div className="text-foreground">16 Cores</div>
          </div>
          <div>
            <div className="mb-1">RAM</div>
            <div className="text-foreground">64 GB</div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="py-24 lg:py-32 relative bg-background border-t border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-[10px] font-medium uppercase tracking-widest text-foreground/30 mb-4">
                Hosting Platform
              </p>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-foreground leading-[0.88] mb-6">
                Cloud VPS & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50">Dedicated Servers.</span>
              </h2>
              <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-2xl mx-auto">
                Modern infrastructure built on Proxmox and Debian. Full control, transparent
                technology, and engineering without unnecessary complexity.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-64 flex flex-col gap-3">
                <button
                  onClick={() => setActiveTab('vps')}
                  className={`text-left px-6 py-5 border transition-all duration-300 ${
                    activeTab === 'vps'
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-background text-foreground border-border hover:border-foreground/50'
                  }`}
                >
                  <span className="block text-xs font-mono mb-2 uppercase tracking-widest">Tier 01</span>
                  <span className="text-2xl font-medium uppercase tracking-wider">Cloud VPS</span>
                  <p className="text-xs mt-3 text-foreground/60">Virtualized. Shared Hardware.</p>
                </button>
                <button
                  onClick={() => setActiveTab('dedicated')}
                  className={`text-left px-6 py-5 border transition-all duration-300 ${
                    activeTab === 'dedicated'
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-background text-foreground border-border hover:border-foreground/50'
                  }`}
                >
                  <span className="block text-xs font-mono mb-2 uppercase tracking-widest">Tier 02</span>
                  <span className="text-2xl font-medium uppercase tracking-wider">Dedicated</span>
                  <p className="text-xs mt-3 text-foreground/60">Physical. Full Control.</p>
                </button>
              </div>

              <div className="flex-1 w-full">
                {activeTab === 'vps' ? <CloudVPSVisual /> : <DedicatedVisual />}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="mt-20 grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Modern Virtualization',
                  desc: 'Proxmox-based infrastructure provides enterprise-grade virtualization with clean resource isolation.',
                  icon: Server,
                },
                {
                  title: 'Full Control',
                  desc: 'Complete root access and infrastructure control. Deploy, manage, and monitor your resources.',
                  icon: Cpu,
                },
                {
                  title: 'Transparent Technology',
                  desc: 'Open-source stack you can inspect, audit, and understand. No black boxes, no vendor lock-in.',
                  icon: Shield,
                },
              ].map((item, i) => (
                <div key={i} className="border border-border p-8 hover:bg-foreground/[0.02] transition-colors">
                  <div className="w-12 h-12 border border-border flex items-center justify-center mb-6">
                    <item.icon className="w-6 h-6 text-foreground/60" />
                  </div>
                  <h3 className="text-2xl font-medium text-foreground mb-4">{item.title}</h3>
                  <p className="text-foreground/50 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// ─── Infrastructure Layers Section ─────────────────────────────────────────────

const InfrastructureLayers = () => {
  return (
    <section className="py-24 lg:py-32 bg-foreground text-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="mb-20">
              <p className="text-[10px] font-medium uppercase tracking-widest text-background/30 mb-4">The Stack</p>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-background leading-[0.88]">
                Built on open<br />
                infrastructure.
              </h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {[
                { name: 'PROXMOX', category: 'Virtualization', desc: 'Open-source hypervisor platform' },
                { name: 'DEBIAN', category: 'Operating System', desc: 'Stable, production-grade Linux' },
                { name: 'COOLIFY', category: 'Deployment', desc: 'Self-hosted application management' },
                { name: 'FORGEJO', category: 'Development', desc: 'Self-hosted Git platform' },
                { name: 'UPTIME KUMA', category: 'Monitoring', desc: 'Service uptime tracking' },
                { name: 'BESZEL', category: 'Monitoring', desc: 'Infrastructure health' },
              ].map((tech, i) => (
                <div key={i} className="group border border-background/20 p-8 hover:bg-background/10 transition-colors">
                  <div className="text-6xl font-medium text-background/10 mb-4 group-hover:text-background/20 transition-colors">
                    {tech.name[0]}
                  </div>
                  <h3 className="text-xl font-medium text-background mb-2">{tech.name}</h3>
                  <p className="text-sm text-background/50 font-light">{tech.category}</p>
                  <p className="text-xs text-background/40 font-light mt-2">{tech.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="border border-background/20 p-10 bg-background/10">
              <h3 className="text-2xl font-medium text-background mb-4">Infrastructure Philosophy</h3>
              <p className="text-background/50 font-light leading-relaxed max-w-2xl mb-8">
                We believe infrastructure should be visible, auditable, and controllable.
                That's why VaultScope's platform runs on curated open-source tools—each
                chosen for stability, performance, and community support.
              </p>
              <Link to="/open-source" className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-background hover:text-background/70 transition-colors">
                Explore the full stack<ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// ─── Principles Section ────────────────────────────────────────────────────────

const PrinciplesSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-background border-t border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-20">
              <p className="text-[10px] font-medium uppercase tracking-widest text-foreground/30 mb-4">Principles</p>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-foreground leading-[0.88]">
                Designed with<br />
                intention.
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8">
            <FadeIn delay={0.2}>
              <div className="border-l-2 border-foreground/20 pl-8">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-foreground/30 mb-3">01</p>
                <h3 className="text-3xl font-medium text-foreground mb-4">Control</h3>
                <p className="text-lg text-foreground/50 font-light leading-relaxed">
                  Your infrastructure should behave like your infrastructure. Full root access,
                  complete control, no vendor lock-in.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="border-l-2 border-foreground/20 pl-8">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-foreground/30 mb-3">02</p>
                <h3 className="text-3xl font-medium text-foreground mb-4">Transparency</h3>
                <p className="text-lg text-foreground/50 font-light leading-relaxed">
                  Infrastructure should be understandable, observable, and controllable.
                  We use only open technologies we can inspect.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="border-l-2 border-foreground/20 pl-8">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-foreground/30 mb-3">03</p>
                <h3 className="text-3xl font-medium text-foreground mb-4">Engineering</h3>
                <p className="text-lg text-foreground/50 font-light leading-relaxed">
                  Infrastructure designed deliberately instead of assembled from layers
                  of abstraction. Every component has purpose.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="border-l-2 border-foreground/20 pl-8">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-foreground/30 mb-3">04</p>
                <h3 className="text-3xl font-medium text-foreground mb-4">Observability</h3>
                <p className="text-lg text-foreground/50 font-light leading-relaxed">
                  Systems should be measurable, visible, and understandable. Uptime Kuma,
                  Beszel, and Coolify keep everything observable.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Pre-Launch Section ────────────────────────────────────────────────────────

const PreLaunchSection = () => {
  const timeline = [
    { step: '01', label: 'Infrastructure', desc: 'Server setup and network configuration' },
    { step: '02', label: 'Platform', desc: 'Virtualization and deployment systems' },
    { step: '03', label: 'Automation', desc: 'Provisioning and management workflows' },
    { step: '04', label: 'Observability', desc: 'Monitoring and health tracking' },
  ];

  return (
    <section className="py-24 lg:py-32 bg-foreground text-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-20">
              <p className="text-[10px] font-medium uppercase tracking-widest text-background/30 mb-4">Roadmap</p>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-background leading-[0.88]">
                Built before the<br />
                first customer.
              </h2>
              <p className="text-xl text-background/50 font-light leading-relaxed max-w-2xl mx-auto mt-8">
                Cloud VPS and Dedicated Servers are in preparation. We're refining the platform,
                optimizing performance, and ensuring everything meets our standards for reliability
                and transparency.
              </p>
            </div>
          </FadeIn>

          <div className="relative mt-20">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-background/20 -translate-y-1/2 hidden md:block" />
            
            <div className="space-y-16">
              {timeline.map((item, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="flex flex-col md:flex-row items-center gap-8 relative">
                    <div className="w-16 h-16 rounded-full border border-background/30 flex items-center justify-center shrink-0 relative z-10">
                      <span className="font-mono font-medium text-background/40">{item.step}</span>
                    </div>
                    <div className="hidden md:block w-full h-[1px] bg-background/20" />
                    <div className="flex-1">
                      <p className="font-medium text-background mb-2">{item.label}</p>
                      <p className="text-sm text-background/50 font-light">{item.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          <FadeIn delay={0.5}>
            <div className="mt-24 p-10 border border-background/30 bg-background/10 text-center">
              <h3 className="text-2xl font-medium text-background mb-6">Ready to get started?</h3>
              <p className="text-background/50 font-light mb-8 max-w-md mx-auto">
                Join the waitlist to be notified when Cloud VPS and Dedicated Servers launch.
              </p>
              <WaitlistForm />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// ─── Final CTA Section ─────────────────────────────────────────────────────────

const FinalCTASection = () => {
  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-[600px] h-[600px] bg-foreground/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-foreground leading-[0.88] mb-8">
              Your next server<br />
              starts here.
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-xl md:text-2xl text-foreground/50 font-light leading-relaxed max-w-2xl mx-auto mb-16">
              Cloud VPS and Dedicated Servers built for applications that need infrastructure
              they can rely on. Premium quality. Transparent technology. Engineering without
              unnecessary complexity.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/hosting">
                <div className="h-14 px-10 text-sm tracking-widest uppercase font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors cursor-pointer inline-flex items-center justify-center gap-2">
                  Explore Hosting<ArrowRight className="w-4 h-4" />
                </div>
              </Link>
              <Link to="/contact">
                <div className="h-14 px-10 text-sm tracking-widest uppercase font-medium border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer inline-flex items-center justify-center gap-2">
                  Contact VaultScope
                </div>
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// ─── Main Home Component ───────────────────────────────────────────────────────

export const Home = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(query.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    document.title = 'VaultScope — Infrastructure & Hosting';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'VaultScope — Cloud VPS and Dedicated Servers built on modern infrastructure, transparent technology, and engineering without unnecessary complexity.'
      );
    }
  }, []);

  return (
    <div className="flex flex-col w-full overflow-x-hidden bg-background text-foreground">
      <ScrollProgressBar />

      <CursorGlow />

      <div ref={heroRef} className="relative h-screen overflow-hidden border-b border-border">
        <VaultScopeCanvas />

        <div className="relative h-full flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 1.2,
              delay: 0,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-center max-w-5xl"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter text-foreground leading-[0.92] mb-5">
              Cloud infrastructure.
            </h1>
            <p className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter text-foreground/50 leading-[0.92]">
              Built for what's next.
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-center text-foreground/50 max-w-xl text-base md:text-lg font-light leading-relaxed mt-10 mb-14"
          >
            Cloud VPS and Dedicated Servers built on modern infrastructure, transparent
            technology, and engineering without unnecessary complexity.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4 mb-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link to="/hosting">
                <div className="h-14 px-10 text-sm tracking-widest uppercase font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors cursor-pointer inline-flex items-center justify-center gap-2">
                  Explore Hosting<ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>

            <div
              style={{ opacity: 0, animation: 'hero-infra-fade 0.9s cubic-bezier(0.16,1,0.3,1) 0.8s forwards' }}
              onAnimationEnd={(e: React.AnimationEvent<HTMLDivElement>) => {
                e.currentTarget.style.animation = 'none';
                e.currentTarget.style.opacity = '1';
              }}
            >
              <Link to="/open-source">
                <div
                  style={{ mixBlendMode: 'difference', borderColor: 'white', color: 'white' }}
                  className="h-14 px-10 text-sm tracking-widest uppercase font-medium border cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  Our Infrastructure
                </div>
              </Link>
            </div>
          </div>

          {!reducedMotion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0], y: [0, 12, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 2.5,
              }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
            >
              <span className="text-[9px] tracking-[0.3em] uppercase text-foreground/25 font-medium">
                Scroll to explore
              </span>
              <div
                className="w-[1px] h-12 bg-gradient-to-b from-foreground/30 to-transparent"
                style={{ transformOrigin: 'top' }}
              />
            </motion.div>
          )}
        </div>
      </div>

      <HostingCompareSection />

      <InfrastructureLayers />

      <PrinciplesSection />

      <PreLaunchSection />

      <FinalCTASection />
    </div>
  );
};

// ─── Additional Components (must be after Home export) ──────────────────────────

const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-foreground/30 z-[200] origin-left pointer-events-none"
    />
  );
};

const CursorGlow = () => {
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const cursorGlow = useMemo(
    () => `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.02), transparent 70%)`,
    [mousePos.x, mousePos.y]
  );

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[2]"
      style={{ background: cursorGlow }}
    />
  );
};
