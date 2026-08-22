import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { WaitlistForm } from '../components/WaitlistForm';
import { Button } from '../components/Shared';
import {
  ArrowRight, Server, Shield, Cpu, Rocket,
  Code2, Wrench, Monitor, HardDrive, Settings,
} from 'lucide-react';
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
  const [shouldRender, setShouldRender] = useState(false);
  const scrollProgressRef = useRef(0);

  const { scrollY } = useScroll();
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  const canvasOpacity = useTransform(scrollY, [0, vh * 0.8, vh * 2.0], [1, 1, 0]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = document.createElement('canvas');
    const hasWebGL = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    const saveData = (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData;

    if (!isMobile && !prefersReducedMotion && hasWebGL && !saveData) {
      setShouldRender(true);
    }
  }, []);

  useEffect(() => {
    const el = mountRef.current;
    if (!el || !shouldRender) return;

    let disposed = false;
    let raf = 0;

    const init = async () => {
      const THREE = await import('three');
      const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');

      if (disposed) return;

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
      const camera = new THREE.PerspectiveCamera(45, width / height, 1, 5000);
      camera.position.set(0, 0, 560);

      scene.add(new THREE.AmbientLight(0xffffff, 50));

      const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
      keyLight.position.set(200, 400, 300);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0x3355ee, 0.7);
      rimLight.position.set(-250, -100, -200);
      scene.add(rimLight);

      const accentLight = new THREE.PointLight(0x00cc77, 0.8, 1200);
      accentLight.position.set(0, -300, 200);
      scene.add(accentLight);

      const rackGroup = new THREE.Group();
      rackGroup.position.y = -400;
      rackGroup.rotation.y = -0.25;
      scene.add(rackGroup);

      const onResize = () => {
        if (!el) return;
        const w = el.clientWidth;
        const h = el.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      const updateScroll = () => {
        scrollProgressRef.current = Math.min(1, window.scrollY / (window.innerHeight * 0.6));
      };
      window.addEventListener('scroll', updateScroll, { passive: true });
      updateScroll();

      const tick = () => {
        raf = requestAnimationFrame(tick);
        const progress = scrollProgressRef.current;
        const targetCamZ = 560 - progress * 190;
        camera.position.z += (targetCamZ - camera.position.z) * 0.05;
        renderer.render(scene, camera);
      };
      tick();

      const loader = new GLTFLoader();
      loader.load(
        '/3d/server_rack.glb',
        (gltf) => {
          const model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model);
          const size = new THREE.Vector3();
          box.getSize(size);
          const scaleFactor = 700 / Math.max(size.x, size.y, size.z);
          model.scale.setScalar(scaleFactor);
          box.setFromObject(model);
          const center = new THREE.Vector3();
          box.getCenter(center);
          model.position.sub(center);
          rackGroup.add(model);
        },
        undefined,
        (error) => console.error('Failed to load server rack model:', error),
      );

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('scroll', updateScroll);
        renderer.dispose();
        scene.traverse((child: any) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m: any) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      };
    };

    let cleanup: (() => void) | undefined;
    init().then((c) => { cleanup = c; });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanup?.();
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <motion.div
      ref={mountRef}
      aria-hidden="true"
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

// ─── Product Overview Section ──────────────────────────────────────────────────

const ProductOverview = () => {
  const products = [
    {
      icon: Server,
      label: 'Infrastructure',
      title: 'Infrastructure',
      desc: 'Cloud VPS and Dedicated Servers on EU infrastructure.',
      link: '/infrastructure/',
    },
    {
      icon: Rocket,
      label: 'Deploy',
      title: 'Deploy',
      desc: 'One-click deployment for pre-configured services.',
      link: '/deploy/',
    },
    {
      icon: Code2,
      label: 'Software',
      title: 'Software',
      desc: 'Products built and operated by VaultScope.',
      link: '/software/pegasus/',
    },
    {
      icon: Wrench,
      label: 'Managed',
      title: 'Managed',
      desc: 'Infrastructure designed for your business.',
      link: '/infrastructure/managed/',
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-background border-t border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-border">
            {products.map((product, i) => {
              const Icon = product.icon;
              return (
                <Link
                  key={product.title}
                  to={product.link}
                  className={`group p-8 flex flex-col gap-6 hover:bg-foreground/[0.02] transition-colors ${
                    i < products.length - 1 ? 'border-b lg:border-b-0 lg:border-r border-border' : ''
                  }`}
                >
                  <div className="w-12 h-12 border border-border flex items-center justify-center group-hover:border-foreground/30 transition-colors">
                    <Icon className="w-5 h-5 text-foreground/50" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-foreground/30 mb-2">
                      {product.label}
                    </p>
                    <h3 className="text-xl font-medium text-foreground tracking-tight mb-2">
                      {product.title}
                    </h3>
                    <p className="text-sm text-foreground/50 font-light leading-relaxed">
                      {product.desc}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-foreground/30 group-hover:text-foreground/60 transition-colors">
                    Learn more
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

// ─── Infrastructure Section ────────────────────────────────────────────────────

const InfrastructureSection = () => {
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
            <div className="text-foreground">EU</div>
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
          <div className="border border-foreground/20 px-4 py-2 bg-foreground/[0.02]">
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
            <div className="text-foreground">EU</div>
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
                Infrastructure
              </p>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-foreground leading-[0.88] mb-6">
                Cloud VPS &<br />
                <span className="text-foreground/50">Dedicated Servers.</span>
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
                  className={`text-left px-6 py-5 border transition-all duration-300 cursor-pointer ${
                    activeTab === 'vps'
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-background text-foreground border-border hover:border-foreground/50'
                  }`}
                >
                  <span className="block text-xs font-mono mb-2 uppercase tracking-widest">Tier 01</span>
                  <span className="text-2xl font-medium uppercase tracking-wider">Cloud VPS</span>
                  <p className={`text-xs mt-3 ${activeTab === 'vps' ? 'text-background/60' : 'text-foreground/60'}`}>Virtualized. Shared Hardware.</p>
                </button>
                <button
                  onClick={() => setActiveTab('dedicated')}
                  className={`text-left px-6 py-5 border transition-all duration-300 cursor-pointer ${
                    activeTab === 'dedicated'
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-background text-foreground border-border hover:border-foreground/50'
                  }`}
                >
                  <span className="block text-xs font-mono mb-2 uppercase tracking-widest">Tier 02</span>
                  <span className="text-2xl font-medium uppercase tracking-wider">Dedicated</span>
                  <p className={`text-xs mt-3 ${activeTab === 'dedicated' ? 'text-background/60' : 'text-foreground/60'}`}>Physical. Full Control.</p>
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

          <FadeIn delay={0.5}>
            <div className="mt-12 text-center">
              <Link to="/infrastructure/" className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-foreground/50 hover:text-foreground transition-colors">
                Explore Infrastructure<ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// ─── ODP Section ───────────────────────────────────────────────────────────────

const DeploySection = () => {
  const steps = [
    { step: '01', title: 'Choose', desc: 'Select from pre-configured services.' },
    { step: '02', title: 'Configure', desc: 'Set parameters — name, region, resources.' },
    { step: '03', title: 'Running', desc: 'Live on infrastructure in seconds.' },
  ];

  const categories = ['Game Servers', 'Databases', 'Applications', 'Development Tools', 'Infrastructure Tools'];

  return (
    <section className="py-24 lg:py-32 bg-background border-t border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="mb-16">
              <p className="text-[10px] font-medium uppercase tracking-widest text-foreground/30 mb-4">
                One-Click Deploy
              </p>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-foreground leading-[0.88] mb-6">
                Deploy in seconds.
              </h2>
              <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-2xl">
                Pre-built images and pre-configured settings. Launch a fully managed service on our
                infrastructure without manual setup.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="grid md:grid-cols-3 gap-0 border border-border mb-12">
              {steps.map((item, i) => (
                <div
                  key={item.step}
                  className={`p-10 flex flex-col gap-4 ${
                    i < steps.length - 1 ? 'border-b md:border-b-0 md:border-r border-border' : ''
                  }`}
                >
                  <span className="text-xs font-medium text-foreground/20 tracking-widest uppercase">{item.step}</span>
                  <h3 className="text-2xl font-medium text-foreground tracking-tight">{item.title}</h3>
                  <p className="text-sm text-foreground/40 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-wrap gap-3 mb-12">
              {categories.map((cat) => (
                <span key={cat} className="border border-border px-4 py-2 text-xs font-medium text-foreground/40 uppercase tracking-widest">
                  {cat}
                </span>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <Link to="/deploy/" className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-foreground/50 hover:text-foreground transition-colors">
              Explore Deploy<ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// ─── Managed Infrastructure Section ────────────────────────────────────────────

const ManagedSection = () => {
  const capabilities = [
    { icon: Settings, title: 'Architecture', desc: 'Infrastructure designed for your requirements.' },
    { icon: Rocket, title: 'Deployment', desc: 'Provisioned and configured by engineers.' },
    { icon: Monitor, title: 'Monitoring', desc: 'Proactive health tracking and alerting.' },
    { icon: Wrench, title: 'Maintenance', desc: 'Updates, patches, and ongoing management.' },
    { icon: HardDrive, title: 'Migration', desc: 'Move existing workloads with zero downtime.' },
  ];

  return (
    <section className="py-24 lg:py-32 bg-foreground text-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="w-full h-full"
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
            <div className="mb-16">
              <p className="text-[10px] font-medium uppercase tracking-widest text-background/30 mb-4">
                Managed Infrastructure
              </p>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-background leading-[0.88] mb-6">
                Infrastructure designed for<br />
                your business.
              </h2>
              <p className="text-xl text-background/50 font-light leading-relaxed max-w-2xl">
                Operated by engineers. Architecture, deployment, monitoring, and maintenance —
                all handled for you.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-0 border border-background/20">
              {capabilities.map((cap, i) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={cap.title}
                    className={`p-8 ${
                      i < capabilities.length - 1 ? 'border-b lg:border-b-0 lg:border-r border-background/20' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5 text-background/40 mb-4" />
                    <h3 className="text-base font-medium text-background mb-2">{cap.title}</h3>
                    <p className="text-sm text-background/40 font-light leading-relaxed">{cap.desc}</p>
                  </div>
                );
              })}
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-12">
              <Link to="/company/contact/">
                <Button variant="outline" className="border-background/30 text-background hover:bg-background/10 hover:border-background/50">
                  Talk to an Engineer
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// ─── Software / Pegasus Section ────────────────────────────────────────────────

const SoftwareSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-background border-t border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-foreground/30 mb-4">
                  Software
                </p>
                <h2 className="text-5xl md:text-6xl font-medium tracking-tighter text-foreground leading-[0.88] mb-6">
                  Software built by<br />VaultScope.
                </h2>
                <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-xl mb-8">
                  VaultScope develops software alongside its infrastructure services. Pegasus is
                  a full-featured Discord community management platform — self-hostable and
                  source-available.
                </p>
                <Link to="/software/pegasus/" className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-foreground/50 hover:text-foreground transition-colors">
                  Learn about Pegasus<ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="border border-border p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 border border-border flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-foreground/50" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">Pegasus</h3>
                    <p className="text-xs text-foreground/40 uppercase tracking-widest">Discord Platform</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-0 border border-border">
                  {[
                    { label: 'Modules', value: '8' },
                    { label: 'License', value: 'PolyForm NC' },
                    { label: 'Stack', value: 'TypeScript' },
                    { label: 'Dashboard', value: 'Next.js' },
                  ].map((stat) => (
                    <div key={stat.label} className="border-b border-r border-border last:border-r-0 px-5 py-4">
                      <div className="text-xs text-foreground/30 uppercase tracking-widest mb-1">{stat.label}</div>
                      <div className="text-sm font-medium text-foreground">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// ─── Why VaultScope Section ────────────────────────────────────────────────────

const WhyVaultScope = () => {
  return (
    <section className="py-24 lg:py-32 bg-background border-t border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-20">
              <p className="text-[10px] font-medium uppercase tracking-widest text-foreground/30 mb-4">Principles</p>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-foreground leading-[0.88]">
                Why VaultScope.
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8">
            <FadeIn delay={0.1}>
              <div className="border-l-2 border-foreground/20 pl-8">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-foreground/30 mb-3">01</p>
                <h3 className="text-3xl font-medium text-foreground mb-4">Engineering</h3>
                <p className="text-lg text-foreground/50 font-light leading-relaxed">
                  Infrastructure designed deliberately. Every component has purpose, every
                  decision is intentional. No layers of unnecessary abstraction.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="border-l-2 border-foreground/20 pl-8">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-foreground/30 mb-3">02</p>
                <h3 className="text-3xl font-medium text-foreground mb-4">Transparency</h3>
                <p className="text-lg text-foreground/50 font-light leading-relaxed">
                  Open-source stack you can inspect and audit. Infrastructure should be
                  understandable, observable, and controllable.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="border-l-2 border-foreground/20 pl-8">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-foreground/30 mb-3">03</p>
                <h3 className="text-3xl font-medium text-foreground mb-4">Integration</h3>
                <p className="text-lg text-foreground/50 font-light leading-relaxed">
                  Infrastructure and software, engineered together. Services that work as a
                  system, not isolated products bolted to third-party platforms.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="border-l-2 border-foreground/20 pl-8">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-foreground/30 mb-3">04</p>
                <h3 className="text-3xl font-medium text-foreground mb-4">Personal Service</h3>
                <p className="text-lg text-foreground/50 font-light leading-relaxed">
                  Talk to engineers, not support tiers. Problems get solved by the people who
                  built the infrastructure — directly.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Technology Transparency Section ───────────────────────────────────────────

const TechnologySection = () => {
  const technologies = [
    { name: 'PROXMOX', category: 'Virtualization', desc: 'Open-source hypervisor platform' },
    { name: 'DEBIAN', category: 'Operating System', desc: 'Stable, production-grade Linux' },
    { name: 'COOLIFY', category: 'Deployment', desc: 'Self-hosted application management' },
    { name: 'FORGEJO', category: 'Development', desc: 'Self-hosted Git platform' },
    { name: 'UPTIME KUMA', category: 'Monitoring', desc: 'Service uptime tracking' },
    { name: 'BESZEL', category: 'Monitoring', desc: 'Infrastructure health' },
  ];

  return (
    <section className="py-24 lg:py-32 bg-foreground text-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="w-full h-full"
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
            <div className="mb-16">
              <p className="text-[10px] font-medium uppercase tracking-widest text-background/30 mb-4">The Stack</p>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-background leading-[0.88] mb-6">
                Built on open<br />
                infrastructure.
              </h2>
              <p className="text-xl text-background/50 font-light leading-relaxed max-w-2xl">
                VaultScope runs on curated open-source tools — each chosen for stability,
                performance, and community support.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border border-background/20 mb-12">
              {technologies.map((tech) => (
                <div key={tech.name} className="group border-b border-r border-background/20 p-8 hover:bg-background/10 transition-colors">
                  <div className="text-5xl font-medium text-background/10 mb-3 group-hover:text-background/20 transition-colors">
                    {tech.name[0]}
                  </div>
                  <h3 className="text-lg font-medium text-background mb-1">{tech.name}</h3>
                  <p className="text-sm text-background/50 font-light">{tech.category}</p>
                  <p className="text-xs text-background/40 font-light mt-2">{tech.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <Link to="/company/open-source/" className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-background/50 hover:text-background transition-colors">
              See the full stack<ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// ─── Pre-Launch / Waitlist Section ─────────────────────────────────────────────

const WaitlistSection = () => {
  return (
    <section id="waitlist" className="py-24 lg:py-32 bg-background border-t border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-[10px] font-medium uppercase tracking-widest text-foreground/30 mb-4">Pre-Launch</p>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-foreground leading-[0.88] mb-6">
                Built before the<br />first customer.
              </h2>
              <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-2xl mx-auto">
                Cloud VPS, Dedicated Servers, and One-Click Deploy are in preparation.
                Join the waitlist to be notified when services launch.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="border border-border p-10 text-center">
              <h3 className="text-2xl font-medium text-foreground mb-6">Get notified at launch</h3>
              <div className="max-w-md mx-auto">
                <WaitlistForm />
              </div>
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
    <section className="py-24 lg:py-32 bg-background border-t border-border relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-foreground leading-[0.88] mb-8">
              Ready to talk<br />
              infrastructure?
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-xl md:text-2xl text-foreground/50 font-light leading-relaxed max-w-2xl mx-auto mb-16">
              Cloud VPS, Dedicated Servers, and managed infrastructure — built for applications
              that need engineering they can rely on.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/company/contact/">
                <Button>
                  Contact VaultScope<ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="#waitlist">
                <Button variant="outline">
                  Join the Waitlist
                </Button>
              </a>
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

  useEffect(() => {
    document.title = 'VaultScope — Infrastructure and Software, Engineered Together';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'VaultScope builds Cloud VPS, Dedicated Servers, and software on transparent, open-source infrastructure. German engineering. EU infrastructure.'
      );
    }
  }, []);

  return (
    <div className="flex flex-col w-full overflow-x-hidden bg-background text-foreground">
      <VaultScopeCanvas />

      <div ref={heroRef} className="relative min-h-screen overflow-hidden border-b border-border flex items-center justify-center">
        <div className="relative flex flex-col items-center justify-center px-6 py-40">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-5xl"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter text-foreground leading-[0.92] mb-8">
              Infrastructure and software,<br />
              <span className="text-foreground/50">engineered together.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-center text-foreground/50 max-w-xl text-base md:text-lg font-light leading-relaxed mb-14"
          >
            Cloud VPS, Dedicated Servers, One-Click Deploy, and software — built on
            transparent infrastructure with German engineering.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/infrastructure/">
              <Button>
                Explore Infrastructure<ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/company/contact/">
              <Button variant="outline">
                Talk to VaultScope
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <ProductOverview />

      <InfrastructureSection />

      <DeploySection />

      <ManagedSection />

      <SoftwareSection />

      <WhyVaultScope />

      <TechnologySection />

      <WaitlistSection />

      <FinalCTASection />
    </div>
  );
};
