import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Server,
  HardDrive,
  FolderLock,
  GitBranch,
  Sliders,
  Scale,
  Layers,
  Cpu,
  Shield,
} from 'lucide-react';
import { useLanguage } from '../i18n';
import { WaitlistForm } from '../components/WaitlistForm';
import { CatalogErrorState } from '../components/Shared';
import { api } from '../lib/api';
import { HeroStack3D } from '../components/HeroStack3D';

interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  provider: string;
  price: string;
  stock: number | null;
  specs: {
    cpu?: number;
    ram?: number;
    storage?: number;
    bandwidth?: string;
    location?: string;
    description?: string;
  } | null;
}

const VAT_MULTIPLIER = 1.19;

function formatPriceGross(netPriceStr: string): string {
  const numeric = parseFloat(netPriceStr);
  if (Number.isNaN(numeric)) return netPriceStr;
  return (numeric * VAT_MULTIPLIER).toFixed(2);
}

interface TypewriterSentence {
  highlight: string;
  rest: string;
}

const HERO_SENTENCES: TypewriterSentence[] = [
  {
    highlight: 'Infrastructure and Software.',
    rest: 'Engineered together.',
  },
  {
    highlight: 'Hosting.',
    rest: 'Built on Open-Source.',
  },
  {
    highlight: 'Beyond Today.',
    rest: "Built For What's Next.",
  },
];

const TYPE_SPEED_MS = 38;
const DELETE_SPEED_MS = 18;
const HOLD_AFTER_WRITE_MS = 1500;

export const Home = () => {
  const { t, locale, localePath } = useLanguage();
  const isDe = locale === 'de';

  // ─── Typewriter State ──────────────────────────────────────────────────────
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [charCount, setCharCount] = useState(
    HERO_SENTENCES[0].highlight.length + HERO_SENTENCES[0].rest.length
  );
  const [phase, setPhase] = useState<'typing' | 'waiting' | 'deleting'>('waiting');

  const currentSentence = HERO_SENTENCES[sentenceIndex];
  const fullLength = currentSentence.highlight.length + currentSentence.rest.length;

  useEffect(() => {
    let timer: number;

    if (phase === 'typing') {
      if (charCount < fullLength) {
        timer = window.setTimeout(() => {
          setCharCount((c) => c + 1);
        }, TYPE_SPEED_MS);
      } else {
        setPhase('waiting');
      }
    } else if (phase === 'waiting') {
      timer = window.setTimeout(() => {
        setPhase('deleting');
      }, HOLD_AFTER_WRITE_MS);
    } else if (phase === 'deleting') {
      if (charCount > 0) {
        timer = window.setTimeout(() => {
          setCharCount((c) => c - 1);
        }, DELETE_SPEED_MS);
      } else {
        setSentenceIndex((idx) => (idx + 1) % HERO_SENTENCES.length);
        setPhase('typing');
      }
    }

    return () => window.clearTimeout(timer);
  }, [charCount, phase, fullLength]);

  const typedHighlight = currentSentence.highlight.slice(
    0,
    Math.min(charCount, currentSentence.highlight.length)
  );
  const typedRest =
    charCount > currentSentence.highlight.length
      ? currentSentence.rest.slice(0, charCount - currentSentence.highlight.length)
      : '';

  // ─── Live Catalog State ────────────────────────────────────────────────────
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [catalogError, setCatalogError] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const fetchCatalog = () => {
    setLoadingCatalog(true);
    setCatalogError(false);
    api
      .get<CatalogProduct[]>('/catalog')
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setProducts([]);
        setCatalogError(true);
      })
      .finally(() => {
        setLoadingCatalog(false);
      });
  };

  useEffect(() => {
    let active = true;
    api
      .get<CatalogProduct[]>('/catalog')
      .then((data) => {
        if (active) {
          setProducts(Array.isArray(data) ? data : []);
          setCatalogError(false);
        }
      })
      .catch(() => {
        if (active) {
          setProducts([]);
          setCatalogError(true);
        }
      })
      .finally(() => {
        if (active) setLoadingCatalog(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category.toLowerCase() === activeCategory);

  const categories = [
    { id: 'all', label: isDe ? 'Alle Tarife' : 'All Plans' },
    { id: 'vps', label: isDe ? 'Cloud VPS' : 'Cloud VPS' },
    { id: 'dedicated', label: isDe ? 'Dediziert' : 'Dedicated' },
    { id: 'storage', label: isDe ? 'Speicher' : 'Storage' },
  ];

  useEffect(() => {
    document.title = t.home.seo.title;
  }, [t.home.seo.title]);

  const whyChooseItems = [
    {
      title: isDe ? 'Auf Open-Source aufgebaut' : 'Built on Open-Source',
      desc: isDe
        ? 'Unsere gesamte Plattform basiert auf überprüfbaren Open-Source-Technologien – ganz ohne proprietären Vendor-Lock-in.'
        : 'Every layer of our platform is built on verifiable open-source technologies with zero proprietary lock-in.',
      icon: GitBranch,
    },
    {
      title: isDe ? 'Durchdachte Bedienung' : 'User friendliness',
      desc: isDe
        ? 'Aufgeräumte Oberflächen, präzise APIs und klare Workflows, die den täglichen Infrastrukturbetrieb spürbar vereinfachen.'
        : 'Clean interfaces, predictable APIs, and straightforward workflows designed for effortless day-to-day operations.',
      icon: Sliders,
    },
    {
      title: isDe ? 'Faire & klare Preise' : 'Fair Pricing',
      desc: isDe
        ? 'Verlässliche monatliche Tarife ohne versteckte Einrichtungsgebühren, Überraschungskosten oder künstliche Bandbreitenlimits.'
        : 'Transparent monthly rates with no setup fees, surprise renewal hikes, or artificial bandwidth tiers.',
      icon: Scale,
    },
    {
      title: isDe ? 'Nahtlose Integration' : 'Integration',
      desc: isDe
        ? 'Compute-Instanzen, Storage-Volumes und Verwaltungs-APIs greifen ohne Reibungsverluste direkt ineinander.'
        : 'Compute instances, storage volumes, and management APIs work together as a single cohesive stack.',
      icon: Layers,
    },
  ];

  const principles = [
    {
      title: isDe ? 'Transparenz' : 'Transparency',
      desc: isDe
        ? 'Transparenz bildet das Fundament von VaultScope. Von offen einsehbaren Preisen und Hardwarespezifikationen bis hin zu unserem Quellcode und Betriebsstatus arbeiten wir ohne Blackboxen, versteckte Drosselungen oder intransparente Abhängigkeiten.'
        : 'Transparency is the foundation of VaultScope. From public pricing and hardware specifications to our open-source codebase and operational status, we operate in the open—with no black boxes, hidden throttling, or undisclosed dependencies.',
    },
    {
      title: 'Community',
      desc: isDe
        ? 'Wir entwickeln VaultScope im direkten Austausch mit den Entwicklern, Systemadministratoren und Teams, die unsere Plattform täglich nutzen. Öffentliche Roadmaps, offene Repositories und direkter technischer Dialog sorgen dafür, dass echtes Feedback unmittelbar in die Weiterentwicklung einfließt.'
        : 'We build VaultScope alongside the developers, system administrators, and teams who run on our platform. Public roadmaps, open repositories, and direct technical dialogue ensure real-world feedback directly shapes what we ship next.',
    },
    {
      title: isDe ? 'Vertrauen' : 'Trust',
      desc: isDe
        ? 'Vertrauen entsteht durch Verlässlichkeit und gegenseitigen Respekt. Wir begegnen unseren Kunden auf Augenhöhe – mit vollem Root-Zugriff, überprüfbarer Infrastruktur und klaren Zusagen statt restriktiver Verträge oder künstlichem Lock-in.'
        : 'Trust is earned through consistency and mutual respect. We treat our clients as engineering peers—providing full root access, verifiable infrastructure, and clear commitments rather than restrictive contracts or artificial lock-in.',
    },
  ];

  const productPillars = [
    {
      name: 'VPS',
      badge: isDe ? 'bald' : 'soon',
      title: 'VPS (soon)',
      desc: isDe
        ? 'KVM-isolierte virtuelle Server mit schnellem lokalem NVMe-Speicher und konstant hoher Rechenleistung.'
        : 'KVM-isolated virtual private servers backed by local NVMe storage and consistent compute performance.',
      href: '/infrastructure/cloud/',
      icon: Server,
    },
    {
      name: 'Dedicated',
      badge: isDe ? 'bald' : 'soon',
      title: 'Dedicated (soon)',
      desc: isDe
        ? 'Dedizierte Bare-Metal-Server mit vollem Root-Zugriff und maximaler Performance ohne Hypervisor-Overhead.'
        : 'Single-tenant bare-metal servers with full root access and maximum throughput without hypervisor overhead.',
      href: '/infrastructure/dedicated/',
      icon: HardDrive,
    },
    {
      name: 'Storage',
      badge: null,
      title: 'Storage (SFTP only as of now)',
      desc: isDe
        ? 'Verschlüsselter SFTP-Speicher für zuverlässige Off-Site-Backups, Langzeitarchive und sicheren Datentransfer.'
        : 'Encrypted SFTP storage volumes built for off-site backups, long-term archives, and secure file transfers.',
      href: '/infrastructure/storage/',
      icon: FolderLock,
    },
  ];

  const softwareList = [
    {
      name: 'Vamos',
      desc: isDe
        ? 'Unser in Rust entwickeltes Kernsystem für Ressourcen-Provisionierung, Authentifizierung, Abrechnung und Storefront-APIs.'
        : 'Our core Rust backend engine handling resource provisioning, authentication, billing lifecycles, and storefront APIs.',
      href: '/software/vamos/',
      icon: Cpu,
    },
    {
      name: 'Camos',
      desc: isDe
        ? 'Unsere Administrations-Suite zur zentralen Verwaltung von Kunden, Produkten, Mitarbeitern, rollenbasierter Zugriffskontrolle (RBAC) und Betriebsabläufen.'
        : 'Our Administration Suite built to manage customers, products, staff, role-based access control (RBAC), and internal operations.',
      href: '/software/camos/',
      icon: Shield,
    },
  ];

  // ─── Scroll-Linked Fade-Out for Hero Background ────────────────────────────
  const heroBgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateHeroBgFade = () => {
      const el = heroBgRef.current;
      if (!el) return;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const fadeDistance = Math.max((window.innerHeight || 840) * 0.75, 420);
      const progress = Math.min(Math.max(scrollY / fadeDistance, 0), 1);
      const opacity = Math.max(0, 1 - Math.pow(progress, 1.15));
      el.style.opacity = opacity.toFixed(3);
      el.style.transform = `translate3d(0, ${(scrollY * 0.12).toFixed(1)}px, 0)`;
    };

    updateHeroBgFade();
    window.addEventListener('scroll', updateHeroBgFade, { passive: true });
    window.addEventListener('resize', updateHeroBgFade, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateHeroBgFade);
      window.removeEventListener('resize', updateHeroBgFade);
    };
  }, []);

  return (
    <div className="bg-[var(--bg)] text-[var(--fg)]">
      {/* ─── SECTION 1: HERO (Pixelated Typewriter + Sleek Purple Highlight + Floating Stack) ─── */}
      <section className="relative pt-28 pb-16 lg:min-h-screen lg:pt-20 lg:pb-12 lg:flex lg:items-center overflow-hidden">
        {/* Animated Architectural Background that Slowly Fades Out on Scroll */}
        <div
          ref={heroBgRef}
          aria-hidden="true"
          data-testid="hero-animated-bg"
          className="pointer-events-none select-none absolute inset-0 z-0 overflow-hidden will-change-[opacity,transform]"
        >
          {/* Drifting Ambient Volumetric Glows */}
          <div
            className="absolute -top-24 -left-24 w-[480px] h-[480px] lg:w-[640px] lg:h-[640px] rounded-full animate-ocd-drift-b"
            style={{
              background:
                'radial-gradient(circle, rgba(109, 40, 217, 0.16) 0%, rgba(155, 93, 229, 0.05) 48%, transparent 72%)',
            }}
          />
          <div
            className="absolute top-[12%] right-[-8%] w-[520px] h-[520px] lg:w-[720px] lg:h-[720px] rounded-full animate-ocd-drift-a"
            style={{
              background:
                'radial-gradient(circle, rgba(155, 93, 229, 0.20) 0%, rgba(109, 40, 217, 0.08) 45%, transparent 72%)',
            }}
          />
          <div
            className="absolute bottom-[6%] left-[28%] w-[420px] h-[420px] lg:w-[560px] lg:h-[560px] rounded-full animate-ocd-drift-c"
            style={{
              background:
                'radial-gradient(circle, rgba(124, 58, 237, 0.11) 0%, transparent 70%)',
            }}
          />

          {/* Panning Architectural Grid & Vertex Matrix */}
          <div
            className="absolute inset-0"
            style={{
              maskImage:
                'radial-gradient(ellipse 85% 75% at 52% 45%, #000 25%, rgba(0,0,0,0.55) 62%, transparent 96%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 85% 75% at 52% 45%, #000 25%, rgba(0,0,0,0.55) 62%, transparent 96%)',
            }}
          >
            <div
              className="absolute -top-16 inset-x-0 -bottom-16 animate-hero-grid-pan"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(155, 93, 229, 0.085) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(155, 93, 229, 0.085) 1px, transparent 1px),
                  radial-gradient(circle, rgba(155, 93, 229, 0.28) 1px, transparent 1.5px)
                `,
                backgroundSize: '64px 64px, 64px 64px, 64px 64px',
                backgroundPosition: '0 0, 0 0, 0 0',
              }}
            />

            {/* Animated Telemetry Signal Beams Gliding Along Grid Tracks */}
            <div className="absolute top-[192px] left-0 w-64 h-[1px] bg-gradient-to-r from-transparent via-[#9B5DE5]/70 to-transparent animate-hero-beam-x" />
            <div className="absolute top-[384px] left-0 w-72 h-[1px] bg-gradient-to-r from-transparent via-[#6D28D9]/65 to-transparent animate-hero-beam-x-delayed" />
            <div className="absolute top-0 left-[256px] lg:left-[384px] w-[1px] h-56 bg-gradient-to-b from-transparent via-[#9B5DE5]/60 to-transparent animate-hero-beam-y" />
            <div className="absolute top-0 right-[192px] lg:right-[320px] w-[1px] h-64 bg-gradient-to-b from-transparent via-[#9B5DE5]/55 to-transparent animate-hero-beam-y-delayed" />
          </div>

          {/* Spatial Bottom Fade into Page Canvas */}
          <div className="absolute inset-x-0 bottom-0 h-44 sm:h-56 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/80 to-transparent" />
        </div>

        <div className="vs-container relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 xl:gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="grid mb-8 lg:mb-10">
                {/* Invisible sizing anchor for the longest two-line sentence to prevent layout shift */}
                <div
                  aria-hidden="true"
                  className="invisible select-none pointer-events-none col-start-1 row-start-1 font-pixel text-[1.18rem] sm:text-3xl lg:text-[2.75rem] xl:text-[3.2rem] leading-[1.3] tracking-[0.01em] break-words"
                >
                  <span className="block">Infrastructure and Software.</span>
                  <span className="block">Engineered together.</span>
                </div>

                {/* Active pixelated typewriter heading: purple line always stacked on top of white line */}
                <h1
                  aria-label={`${currentSentence.highlight} ${currentSentence.rest}`}
                  className="col-start-1 row-start-1 font-pixel text-[1.18rem] sm:text-3xl lg:text-[2.75rem] xl:text-[3.2rem] leading-[1.3] tracking-[0.01em] text-[var(--fg)] break-words"
                >
                  <span className="block text-[#9B5DE5]">
                    {typedHighlight}
                    {charCount <= currentSentence.highlight.length && (
                      <span
                        aria-hidden="true"
                        className="inline-block w-[0.55ch] h-[0.88em] bg-[#9B5DE5] align-baseline ml-1 animate-pulse"
                      />
                    )}
                  </span>
                  <span className="block text-[var(--fg)] min-h-[1.3em]">
                    {typedRest}
                    {charCount > currentSentence.highlight.length && (
                      <span
                        aria-hidden="true"
                        className="inline-block w-[0.55ch] h-[0.88em] bg-[#9B5DE5] align-baseline ml-1 animate-pulse"
                      />
                    )}
                  </span>
                </h1>
              </div>

              <p className="text-body-l lg:text-xl lg:leading-[1.7] font-desc text-[var(--fg-muted)] max-w-[56ch] mb-9 lg:mb-11">
                {t.home.hero.subtext}
              </p>

              <div className="flex flex-wrap items-center gap-3.5 lg:gap-4">
                <Link
                  to={localePath('/infrastructure/')}
                  className="vs-btn-primary lg:h-12 lg:px-7 lg:text-[15px]"
                >
                  <span>{isDe ? 'Services entdecken' : 'Explore Services'}</span>
                  <ArrowRight className="w-4 h-4 lg:w-4.5 lg:h-4.5" />
                </Link>
                <Link
                  to={localePath('/company/about/')}
                  className="vs-btn-secondary lg:h-12 lg:px-7 lg:text-[15px]"
                >
                  <span>{isDe ? 'Über VaultScope' : 'About VaultScope'}</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex items-center justify-center pointer-events-none select-none">
              <HeroStack3D />
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: WHY US & OUR PRINCIPLES ─── */}
      <section className="vs-section">
        <div className="vs-container space-y-20">
          {/* 2.1 Why us? */}
          <div>
            <div className="max-w-2xl mb-10">
              <h2 className="text-display-m text-[var(--fg)] mb-2.5">
                {isDe ? 'Warum wir?' : 'Why us?'}
              </h2>
              <p className="text-body-l font-desc text-[var(--fg-muted)]">
                {isDe
                  ? 'Offene Architektur, klare Werkzeuge und verlässliche Infrastruktur.'
                  : 'Open architecture, straightforward tooling, and dependable infrastructure.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {whyChooseItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
                      <h3 className="text-base font-semibold text-[var(--fg)] tracking-tight">{item.title}</h3>
                    </div>
                    <p className="font-desc text-sm text-[var(--fg-muted)] leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2.2 Our Principles */}
          <div>
            <div className="max-w-2xl mb-10">
              <h2 className="text-display-m text-[var(--fg)] mb-2.5">
                {isDe ? 'Unsere Prinzipien' : 'Our Principles'}
              </h2>
              <p className="text-body-l font-desc text-[var(--fg-muted)]">
                {isDe
                  ? 'Drei klare Leitlinien bestimmen, wie wir Infrastruktur aufbauen, Software entwickeln und mit unseren Kunden zusammenarbeiten.'
                  : 'Three core commitments guide how we build infrastructure, engineer software, and work with our clients.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {principles.map((item, idx) => (
                <div key={item.title} className="space-y-2.5">
                  <span className="block font-mono text-xs font-semibold text-[var(--accent-bright)]">0{idx + 1}</span>
                  <h3 className="text-base font-semibold text-[var(--fg)] tracking-tight">{item.title}</h3>
                  <p className="font-desc text-sm text-[var(--fg-muted)] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: PRODUCTS ─── */}
      <section className="vs-section" id="products">
        <div className="vs-container">
          <div className="max-w-2xl mb-10">
            <h2 className="text-display-m text-[var(--fg)] mb-2.5">
              {isDe ? 'Produkte' : 'Products'}
            </h2>
            <p className="text-body-l font-desc text-[var(--fg-muted)]">
              {t.home.infrastructure.subtext}
            </p>
          </div>

          {/* Core Product Pillars: VPS (soon), Dedicated (soon), Storage (SFTP only as of now) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
            {productPillars.map((product) => {
              const Icon = product.icon;
              return (
                <div
                  key={product.name}
                  className="flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
                        <h3 className="text-base font-semibold text-[var(--fg)] tracking-tight">
                          {product.title}
                        </h3>
                      </div>
                      {product.badge && (
                        <span className="px-2 py-0.5 rounded font-mono text-[11px] uppercase tracking-wider bg-[var(--accent-subtle)] text-[var(--accent-bright)]">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <p className="font-desc text-sm text-[var(--fg-muted)] leading-relaxed mb-5">
                      {product.desc}
                    </p>
                  </div>

                  <Link
                    to={localePath(product.href)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-bright)] hover:text-[var(--fg)] transition-colors"
                  >
                    <span>{isDe ? 'Mehr erfahren' : 'Learn More'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Live Self-Service Catalog Ledger */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--fg)]">
                  {isDe ? 'Live-Katalog' : 'Live Catalog'}
                </h3>
                <span className="text-xs text-[var(--fg-muted)]">
                  {isDe ? 'Alle Preise inkl. 19 % MwSt.' : 'All prices incl. 19% VAT'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {categories.map((cat) => {
                  const active = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      aria-pressed={active}
                      className={`px-3.5 py-1.5 rounded-[4px] text-xs font-medium transition-colors cursor-pointer ${
                        active
                          ? 'bg-[var(--accent-subtle)] text-[var(--fg)]'
                          : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {loadingCatalog ? (
              <div className="divide-y divide-[var(--line)]">
                <div className="py-3 flex items-center justify-between font-mono text-xs text-[var(--fg-muted)]">
                  <span>{isDe ? 'Tarife werden geladen...' : 'Loading plans...'}</span>
                  <span className="text-[var(--fg-faint)]">VAMOS-CATALOG</span>
                </div>
                {[0, 1, 2].map((row) => (
                  <div key={row} className="py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 items-center">
                    <div className="h-3.5 w-24 sm:w-32 rounded bg-[var(--bg-subtle)] animate-pulse" />
                    <div className="h-3 w-full max-w-[12rem] rounded bg-[var(--bg-subtle)] animate-pulse" />
                    <div className="hidden sm:block h-3 w-28 rounded bg-[var(--bg-subtle)] animate-pulse" />
                    <div className="hidden sm:block h-3.5 w-20 rounded bg-[var(--bg-subtle)] animate-pulse justify-self-end" />
                  </div>
                ))}
              </div>
            ) : catalogError ? (
              <CatalogErrorState isDe={isDe} onRetry={fetchCatalog} />
            ) : filteredProducts.length === 0 ? (
              <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-sm text-[var(--fg-muted)]">
                  {activeCategory === 'all'
                    ? isDe
                      ? 'Keine öffentlichen Selbstbedienungs-Tarife im Live-Katalog freigeschaltet.'
                      : 'No public self-service plans currently published in live catalog.'
                    : isDe
                      ? 'Keine Tarife in dieser Kategorie freigeschaltet.'
                      : 'No public self-service plans currently published in this category.'}
                </p>
                {activeCategory !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setActiveCategory('all')}
                    className="vs-btn-secondary text-xs h-8 px-3 shrink-0"
                  >
                    {isDe ? 'Alle Tarife anzeigen' : 'Show All Plans'}
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="vs-table min-w-[560px] sm:min-w-full">
                  <thead>
                    <tr>
                      <th className="pl-0">{isDe ? 'Tarif' : 'Plan'}</th>
                      <th>{isDe ? 'Kategorie' : 'Category'}</th>
                      <th>{isDe ? 'Ressourcen' : 'Resources'}</th>
                      <th>{isDe ? 'Standort & Traffic' : 'Location & Bandwidth'}</th>
                      <th>{isDe ? 'Status' : 'Status'}</th>
                      <th className="text-right">{isDe ? 'Monatlich' : 'Monthly'}</th>
                      <th className="text-right pr-0">{isDe ? 'Aktion' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((plan) => {
                      const inStock = plan.stock === null || plan.stock > 0;
                      const cpuLabel = plan.specs?.cpu ? `${plan.specs.cpu} vCPU` : null;
                      const ramLabel = plan.specs?.ram ? `${plan.specs.ram} GB RAM` : null;
                      const storageLabel = plan.specs?.storage
                        ? `${plan.specs.storage} GB NVMe`
                        : null;
                      const rawDesc = plan.specs?.description?.trim();
                      const cleanDesc =
                        rawDesc && rawDesc !== '-' && rawDesc !== '—' && rawDesc.toUpperCase() !== 'N/A'
                          ? rawDesc
                          : null;
                      const specSummary =
                        [cpuLabel, ramLabel, storageLabel].filter(Boolean).join(' · ') ||
                        cleanDesc ||
                        (isDe ? 'Standard-Konfiguration' : 'Standard configuration');

                      const rawLoc = plan.specs?.location?.trim();
                      const cleanLoc =
                        rawLoc && rawLoc !== '-' && rawLoc !== '—' && rawLoc.toUpperCase() !== 'N/A'
                          ? rawLoc
                          : isDe
                            ? 'Deutschland (EU-Zentral)'
                            : 'Germany (EU-Central)';

                      const rawBw = plan.specs?.bandwidth?.trim();
                      const cleanBw =
                        rawBw && rawBw !== '-' && rawBw !== '—' && rawBw.toUpperCase() !== 'N/A'
                          ? rawBw
                          : null;

                      const locBwText = cleanBw ? `${cleanLoc} · ${cleanBw}` : cleanLoc;

                      return (
                        <tr key={plan.id}>
                          <td className="pl-0 font-mono font-semibold text-[var(--fg)]">{plan.name}</td>
                          <td className="font-mono text-xs uppercase text-[var(--fg-muted)]">
                            {plan.category}
                          </td>
                          <td className="font-mono text-xs text-[var(--fg)]">{specSummary}</td>
                          <td className="font-mono text-xs text-[var(--fg-muted)]">{locBwText}</td>
                          <td>
                            <span
                              className={`inline-flex items-center font-mono text-xs ${
                                inStock ? 'text-[var(--fg)]' : 'text-[var(--fg-faint)]'
                              }`}
                            >
                              {inStock
                                ? isDe
                                  ? 'Verfügbar'
                                  : 'Available'
                                : isDe
                                  ? 'Ausverkauft'
                                  : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="text-right font-mono font-semibold text-[var(--fg)]">
                            €{formatPriceGross(plan.price)}
                            <span className="text-[11px] font-normal text-[var(--fg-muted)] ml-1">
                              / {isDe ? 'Monat' : 'mo'}
                            </span>
                          </td>
                          <td className="text-right pr-0">
                            {inStock ? (
                              <Link
                                to={localePath(
                                  `/dashboard/new?product=${encodeURIComponent(plan.id)}`
                                )}
                                className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[var(--accent-bright)] hover:text-[var(--fg)] transition-colors"
                              >
                                <span>{isDe ? 'Bereitstellen' : 'Deploy'}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            ) : (
                              <span className="font-mono text-xs text-[var(--fg-faint)]">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: OPEN-SOURCE SOFTWARE (Vamos and Camos only) ─── */}
      <section className="vs-section">
        <div className="vs-container">
          <div className="max-w-3xl mb-10">
            <h2 className="text-display-m text-[var(--fg)] mb-2.5">
              {isDe ? 'Open-Source-Software' : 'Open-Source Software'}
            </h2>
            <p className="text-body-l font-desc text-[var(--fg-muted)]">
              {isDe
                ? 'VaultScope entwickelt eigene Software-Systeme und kombiniert diese mit bewährten Open-Source-Technologien. Jedes von uns geschriebene System veröffentlichen wir konsequent als Open Source.'
                : 'VaultScope engineers its own software stack alongside proven open-source technologies—and we release the software we build as open-source.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {softwareList.map((sw) => {
              const Icon = sw.icon;
              return (
                <div
                  key={sw.name}
                  className="flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-3">
                      <Icon className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
                      <h3 className="text-xl font-semibold text-[var(--fg)] tracking-tight">{sw.name}</h3>
                    </div>

                    <p className="font-desc text-sm text-[var(--fg-muted)] leading-relaxed mb-5">
                      {sw.desc}
                    </p>
                  </div>

                  <Link
                    to={localePath(sw.href)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-bright)] hover:text-[var(--fg)] transition-colors"
                  >
                    <span>{isDe ? 'Mehr erfahren' : 'Learn More'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: NEWSLETTER ─── */}
      <section className="vs-section" id="waitlist">
        <div className="vs-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <h2 className="text-display-m text-[var(--fg)] mb-3">Newsletter</h2>
              <p className="text-body-m font-desc text-[var(--fg-muted)] mb-6">
                {t.home.waitlist.subtext}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link to={localePath('/company/contact/')} className="vs-btn-secondary">
                  <span>{t.common.getInTouch}</span>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-7">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
