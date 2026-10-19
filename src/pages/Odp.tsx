import React from 'react';
import { PageHero, SectionHeader, Button, CatalogErrorState } from '../components/Shared';
import { WaitlistForm } from '../components/WaitlistForm';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';
import { useCatalogProducts } from '../lib/catalog';
import { useDocumentMeta } from '../lib/useDocumentMeta';

export interface SelfHostedCatalogApp {
  id: string;
  name: string;
  category: string;
  imageTag: string;
  port: string;
  icon: React.ReactNode;
}

export const SELF_HOSTED_APP_CATALOG: SelfHostedCatalogApp[] = [
  {
    id: 'nextcloud',
    name: 'Nextcloud Hub',
    category: 'Cloud & WebDAV',
    imageTag: 'nextcloud:29-fpm',
    port: ':443',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
        <circle cx="8.5" cy="16" r="3.4" stroke="#38BDF8" strokeWidth="2.2" />
        <circle cx="16" cy="16" r="4.8" stroke="#38BDF8" strokeWidth="2.4" />
        <circle cx="23.5" cy="16" r="3.4" stroke="#38BDF8" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    id: 'vaultwarden',
    name: 'Vaultwarden',
    category: 'Password Vault',
    imageTag: 'vaultwarden:1.32',
    port: ':8000',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
        <path
          d="M16 4.5L26 8.5V16C26 22 21.6 26.6 16 28.5C10.4 26.6 6 22 6 16V8.5L16 4.5Z"
          stroke="#60A5FA"
          strokeWidth="2"
          fill="rgba(96,165,250,0.14)"
        />
        <path d="M16 5.5V27.5" stroke="#93C5FD" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    id: 'immich',
    name: 'Immich Photos',
    category: 'Photo & AI Backup',
    imageTag: 'immich:v1.118',
    port: ':2283',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
        <circle cx="16" cy="10.2" r="3.6" fill="#F43F5E" opacity="0.85" />
        <circle cx="21.8" cy="16" r="3.6" fill="#A855F7" opacity="0.85" />
        <circle cx="16" cy="21.8" r="3.6" fill="#38BDF8" opacity="0.85" />
        <circle cx="10.2" cy="16" r="3.6" fill="#10B981" opacity="0.85" />
        <circle cx="16" cy="16" r="2.4" fill="#0B0B10" />
      </svg>
    ),
  },
  {
    id: 'forgejo',
    name: 'Forgejo Git',
    category: 'Git & Actions CI',
    imageTag: 'forgejo:10-rootless',
    port: ':3000',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
        <circle cx="10.5" cy="9.5" r="2.6" stroke="#FB923C" strokeWidth="2" />
        <circle cx="10.5" cy="22.5" r="2.6" stroke="#FB923C" strokeWidth="2" />
        <circle cx="21.5" cy="16" r="2.6" stroke="#FDBA74" strokeWidth="2" />
        <path
          d="M10.5 12.1V19.9M10.5 14C10.5 16 18.9 16 18.9 16"
          stroke="#FB923C"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    category: 'Relational Database',
    imageTag: 'postgres:16-alpine',
    port: ':5432',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
        <ellipse
          cx="16"
          cy="9"
          rx="8"
          ry="3.4"
          stroke="#60A5FA"
          strokeWidth="1.9"
          fill="rgba(96,165,250,0.15)"
        />
        <path
          d="M8 9V16C8 17.9 11.6 19.4 16 19.4C20.4 19.4 24 17.9 24 16V9"
          stroke="#60A5FA"
          strokeWidth="1.9"
        />
        <path
          d="M8 16V23C8 24.9 11.6 26.4 16 26.4C20.4 26.4 24 24.9 24 23V16"
          stroke="#93C5FD"
          strokeWidth="1.9"
        />
      </svg>
    ),
  },
  {
    id: 'uptime-kuma',
    name: 'Uptime Kuma',
    category: 'Status Monitoring',
    imageTag: 'uptime-kuma:1.23',
    port: ':3001',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
        <circle
          cx="16"
          cy="16"
          r="10"
          stroke="#34D399"
          strokeWidth="1.9"
          fill="rgba(52,211,153,0.12)"
        />
        <path
          d="M9 16H12.5L14.5 12L17.5 20L19.5 16H23"
          stroke="#6EE7B7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'jellyfin',
    name: 'Jellyfin Media',
    category: 'Media Streaming',
    imageTag: 'jellyfin:10.10',
    port: ':8096',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
        <path
          d="M16 5.5C18.2 5.5 26.5 21 25.2 23.6C23.9 26.2 8.1 26.2 6.8 23.6C5.5 21 13.8 5.5 16 5.5Z"
          stroke="#A855F7"
          strokeWidth="2"
          fill="rgba(168,85,247,0.14)"
        />
        <path
          d="M16 13C16.9 13 20.2 19.2 19.7 20.2C19.2 21.2 12.8 21.2 12.3 20.2C11.8 19.2 15.1 13 16 13Z"
          fill="#38BDF8"
        />
      </svg>
    ),
  },
  {
    id: 'n8n',
    name: 'n8n Workflows',
    category: 'Workflow Automation',
    imageTag: 'n8n:1.72-alpine',
    port: ':5678',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
        <circle cx="8" cy="16" r="2.6" stroke="#FB7185" strokeWidth="2" />
        <circle cx="16" cy="10.5" r="2.6" stroke="#FB7185" strokeWidth="2" />
        <circle cx="16" cy="21.5" r="2.6" stroke="#FB7185" strokeWidth="2" />
        <circle cx="24" cy="16" r="2.6" stroke="#F43F5E" strokeWidth="2" />
        <path
          d="M10.4 14.6L13.6 11.9M10.4 17.4L13.6 20.1M18.4 11.9L21.6 14.6M18.4 20.1L21.6 17.4"
          stroke="#FB7185"
          strokeWidth="1.8"
        />
      </svg>
    ),
  },
  {
    id: 'grafana',
    name: 'Grafana OSS',
    category: 'Observability',
    imageTag: 'grafana:11.3',
    port: ':3000',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
        <path
          d="M16 6.2C21.4 6.2 25.8 10.6 25.8 16C25.8 21.4 21.4 25.8 16 25.8C10.6 25.8 6.2 21.4 6.2 16C6.2 12 8.6 8.6 12 7"
          stroke="#F59E0B"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <circle
          cx="16"
          cy="16"
          r="4"
          stroke="#FBBF24"
          strokeWidth="1.9"
          fill="rgba(245,158,11,0.16)"
        />
      </svg>
    ),
  },
  {
    id: 'papermc',
    name: 'PaperMC Server',
    category: 'Game Server JVM',
    imageTag: 'papermc:1.21.4',
    port: ':25565',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
        <polygon points="16,4.5 27.5,10.5 16,16.5 4.5,10.5" fill="#4ADE80" opacity="0.85" />
        <polygon points="4.5,10.5 16,16.5 16,27.5 4.5,21.5" fill="#A16207" opacity="0.85" />
        <polygon points="16,16.5 27.5,10.5 27.5,21.5 16,27.5" fill="#713F12" opacity="0.9" />
      </svg>
    ),
  },
  {
    id: 'wireguard',
    name: 'WireGuard VPN',
    category: 'Encrypted Tunnel',
    imageTag: 'wg-easy:14',
    port: ':51820',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
        <path
          d="M16 4.8L25.8 8.8V15.8C25.8 21.9 21.6 26.7 16 28.2C10.4 26.7 6.2 21.9 6.2 15.8V8.8L16 4.8Z"
          stroke="#F87171"
          strokeWidth="2"
          fill="rgba(248,113,113,0.14)"
        />
        <circle cx="16" cy="15.8" r="3.6" stroke="#FCA5A5" strokeWidth="1.9" />
      </svg>
    ),
  },
  {
    id: 'home-assistant',
    name: 'Home Assistant',
    category: 'Smart Home Core',
    imageTag: 'homeassistant:2025.1',
    port: ':8123',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
        <path
          d="M5.5 15.8L16 6.5L26.5 15.8V26C26.5 26.6 26.1 27 25.5 27H6.5C5.9 27 5.5 26.6 5.5 26V15.8Z"
          fill="rgba(56,189,248,0.15)"
          stroke="#38BDF8"
          strokeWidth="1.9"
        />
        <path
          d="M16 12.5V23.5M16 18L11.8 14.5M16 19.5L20.2 16"
          stroke="#E0F2FE"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'paperless',
    name: 'Paperless-ngx',
    category: 'Document Archive',
    imageTag: 'paperless-ngx:2.13',
    port: ':8000',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
        <path
          d="M9 6H19L24 11V25C24 26.1 23.1 27 22 27H9C7.9 27 7 26.1 7 25V8C7 6.9 7.9 6 9 6Z"
          stroke="#10B981"
          strokeWidth="1.9"
          fill="rgba(16,185,129,0.12)"
        />
        <path d="M11.5 17H19.5M11.5 21H16.5" stroke="#6EE7B7" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'authentik',
    name: 'Authentik SSO',
    category: 'Identity & OIDC',
    imageTag: 'authentik:2024.12',
    port: ':9000',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
        <circle
          cx="12.5"
          cy="16"
          r="4.8"
          stroke="#FB923C"
          strokeWidth="2"
          fill="rgba(251,146,60,0.14)"
        />
        <path
          d="M17.3 16H25.5M22 16V19.5M25 16V18.8"
          stroke="#FDBA74"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'traefik',
    name: 'Traefik Proxy',
    category: 'Edge Ingress TLS',
    imageTag: 'traefik:v3.2',
    port: ':443',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
        <polygon
          points="16,5.2 25.5,10.8 25.5,21.2 16,26.8 6.5,21.2 6.5,10.8"
          stroke="#2DD4BF"
          strokeWidth="1.9"
          fill="rgba(45,212,191,0.12)"
        />
        <circle cx="16" cy="16" r="3.2" fill="#5EEAD4" />
      </svg>
    ),
  },
  {
    id: 'prometheus',
    name: 'Prometheus',
    category: 'Metrics TSDB',
    imageTag: 'prometheus:v3.0',
    port: ':9090',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
        <circle
          cx="16"
          cy="16"
          r="9.5"
          stroke="#F97316"
          strokeWidth="1.9"
          fill="rgba(249,115,22,0.12)"
        />
        <path
          d="M16 9C18.2 11.6 19.5 13.8 19.5 16C19.5 18.2 17.9 20 16 20C14.1 20 12.5 18.2 12.5 16C12.5 13.8 13.8 11.6 16 9Z"
          fill="#FB923C"
        />
      </svg>
    ),
  },
  {
    id: 'ghost-cms',
    name: 'Ghost CMS',
    category: 'Headless Publishing',
    imageTag: 'ghost:5-alpine',
    port: ':2368',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
        <rect x="7" y="8" width="10.5" height="3.5" rx="1.2" fill="#E2E8F0" />
        <rect x="20.5" y="8" width="4.5" height="3.5" rx="1.2" fill="#94A3B8" />
        <rect x="7" y="14.2" width="18" height="3.5" rx="1.2" fill="#CBD5E1" />
        <rect x="7" y="20.5" width="8" height="3.5" rx="1.2" fill="#E2E8F0" />
        <rect x="17.5" y="20.5" width="7.5" height="3.5" rx="1.2" fill="#64748B" />
      </svg>
    ),
  },
  {
    id: 'minio',
    name: 'MinIO Object S3',
    category: 'S3 Object Storage',
    imageTag: 'minio:RELEASE',
    port: ':9000',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
        <polygon
          points="16,5.5 25,16 16,26.5 7,16"
          stroke="#F43F5E"
          strokeWidth="1.9"
          fill="rgba(244,63,94,0.14)"
        />
        <polygon points="16,10.8 20.5,16 16,21.2 11.5,16" fill="#FB7185" />
      </svg>
    ),
  },
];

const CATALOG_COLUMNS: SelfHostedCatalogApp[][] = [
  SELF_HOSTED_APP_CATALOG.slice(0, 6),
  SELF_HOSTED_APP_CATALOG.slice(6, 12),
  SELF_HOSTED_APP_CATALOG.slice(12, 18),
];

function CatalogTile({ app }: { app: SelfHostedCatalogApp }) {
  return (
    <div className="w-full rounded-[10px] border border-white/[0.08] bg-[#09090E]/95 px-4 py-3.5 flex flex-col gap-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-[8px] bg-[#11111A] border border-white/[0.08] flex items-center justify-center shrink-0">
            {app.icon}
          </div>
          <div className="min-w-0">
            <div className="font-sans text-[13px] font-semibold text-white/95 tracking-[-0.01em] whitespace-nowrap">
              {app.name}
            </div>
            <div className="font-sans text-[11px] text-white/50 whitespace-nowrap">
              {app.category}
            </div>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-400/80 shrink-0" />
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.06] font-mono text-[10.5px]">
        <span className="text-white/55 whitespace-nowrap">{app.imageTag}</span>
        <span className="text-[#A68CE2] whitespace-nowrap">{app.port}</span>
      </div>
    </div>
  );
}

function SelfHostedAppsBackground() {
  return (
    <div
      aria-hidden="true"
      data-testid="self-hosted-apps-catalog-bg"
      className="pointer-events-none select-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Subtle Ambient Purple Glow behind the Right-Side App Catalog */}
      <div
        className="absolute top-[10%] right-[8%] w-[520px] h-[360px] rounded-full opacity-25 blur-[110px]"
        style={{ background: 'radial-gradient(circle, #56369C 0%, transparent 70%)' }}
      />

      {/* Architectural 3-Column Scrolling Catalog Matrix on Right Half of Hero */}
      <div
        className="absolute -top-16 left-[42%] sm:left-[40%] lg:left-[44%] xl:left-[46%] right-[-6%] sm:right-[-4%] lg:right-[2%] h-[560px] opacity-[0.48] sm:opacity-[0.68] lg:opacity-[0.82] -rotate-[5deg] origin-center"
        style={{
          WebkitMaskImage:
            'radial-gradient(ellipse 86% 78% at 62% 48%, #000 30%, rgba(0,0,0,0.65) 64%, transparent 94%)',
          maskImage:
            'radial-gradient(ellipse 86% 78% at 62% 48%, #000 30%, rgba(0,0,0,0.65) 64%, transparent 94%)',
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[820px] ml-auto">
          {CATALOG_COLUMNS.map((col, colIdx) => {
            const animClass =
              colIdx === 0
                ? 'animate-catalog-up'
                : colIdx === 1
                  ? 'animate-catalog-down'
                  : 'animate-catalog-up-slow';
            const visibilityClass =
              colIdx === 2
                ? 'hidden lg:flex'
                : colIdx === 1
                  ? 'hidden sm:flex'
                  : 'flex';

            return (
              <div
                key={`catalog-col-${colIdx}`}
                className={`${visibilityClass} flex-col gap-4 ${animClass}`}
              >
                {col.map((app) => (
                  <CatalogTile key={app.id} app={app} />
                ))}
                {col.map((app) => (
                  <CatalogTile key={`${app.id}-dup`} app={app} />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Directional Vignette Mask Preserving 100% Contrast on Left Hero Copy & Clean Bottom Transition */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, var(--bg) 0%, var(--bg) 36%, rgba(3,3,4,0.88) 48%, rgba(3,3,4,0.18) 68%, rgba(3,3,4,0.12) 88%, var(--bg) 100%), linear-gradient(180deg, var(--bg) 0%, transparent 16%, transparent 74%, var(--bg) 100%)',
        }}
      />
    </div>
  );
}

export function Odp() {
  const { t, locale } = useLanguage();
  const isDe = locale === 'de';
  const { products: odpPlans, loading, error, reload } = useCatalogProducts('odp');

  useDocumentMeta({
    title: t.deploy.title,
    description: t.deploy.metaDescription,
  });

  return (
    <div className="bg-[var(--bg)] text-[var(--fg)] relative overflow-hidden isolate">
      {/* Hero Stage with Self-Hostable Apps Catalog Background */}
      <div className="relative overflow-hidden pb-6 lg:pb-10">
        <SelfHostedAppsBackground />

        <div className="relative z-10">
          <PageHero
            breadcrumbs={[
              { label: t.nav.infrastructure, href: '/infrastructure/' },
              { label: t.deploy.eyebrow },
            ]}
            title={t.deploy.heroTitle}
            description={t.deploy.heroDescription}
            primaryCta={t.common.joinWaitlist}
            primaryLink="#waitlist"
            secondaryCta={t.common.getInTouch}
            secondaryLink="/company/contact/"
            align="left"
          />
        </div>
      </div>

      <div className="relative z-10">
        {/* How It Works */}
        <section className="py-12 lg:py-16">
          <div className="vs-container">
            <SectionHeader title={t.deploy.howItWorks.eyebrow} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {t.deploy.howItWorks.steps.map((s, i) => (
                <div key={s.title}>
                  <div className="font-mono text-xs text-[var(--accent-bright)] mb-2">
                    0{i + 1}
                  </div>
                  <h3 className="text-base font-semibold text-[var(--fg)] mb-2">{s.title}</h3>
                  <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What You'll Be Able to Deploy */}
        <section className="py-12 lg:py-16">
          <div className="vs-container">
            <SectionHeader title={t.deploy.pillars.title} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
              {t.deploy.pillars.items.map((item) => (
                <div key={item.title}>
                  <h3 className="text-base font-semibold text-[var(--fg)] mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live ODP Plans & Application Catalogue */}
        <section id="plans" className="py-12 lg:py-16">
          <div className="vs-container">
            <SectionHeader
              title={t.deploy.catalogue.title}
              subtitle={t.deploy.catalogue.description}
            />

            {loading ? (
              <div className="py-6 text-xs font-mono text-[var(--fg-muted)]">
                {isDe ? 'Katalog wird geladen...' : 'Loading deployment catalog...'}
              </div>
            ) : error ? (
              <CatalogErrorState
                locale={locale}
                productLabel={isDe ? 'One-Click Deploy (ODP)' : 'One-Click Deploy (ODP)'}
                error={error}
                onRetry={reload}
                fallbackHref="#waitlist"
                fallbackLabel={t.common.joinWaitlist}
              />
            ) : odpPlans.length > 0 ? (
              <div className="divide-y divide-[var(--line)]">
                {odpPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="py-6 grid lg:grid-cols-12 gap-6 lg:gap-8 items-center"
                  >
                    <div className="lg:col-span-5">
                      <h3 className="text-lg font-semibold text-[var(--fg)] tracking-[-0.02em]">
                        {plan.name}
                      </h3>
                      {plan.description && (
                        <p className="text-sm text-[var(--fg-muted)] leading-relaxed mt-1">
                          {plan.description}
                        </p>
                      )}
                    </div>

                    <div className="lg:col-span-4 font-mono text-xs text-[var(--fg-muted)]">
                      {[plan.cpu, plan.ram, plan.storage]
                        .filter((x) => x && x !== '—')
                        .join(' · ')}
                    </div>

                    <div className="lg:col-span-3 flex flex-wrap sm:flex-row lg:flex-col items-center lg:items-end justify-between gap-4">
                      <div className="lg:text-right">
                        <div className="font-mono text-xl font-semibold text-[var(--fg)] tabular-nums">
                          €{plan.grossMonthly.toFixed(2)}
                        </div>
                        <div className="font-mono text-[11px] text-[var(--fg-muted)] tabular-nums">
                          €{plan.netMonthly.toFixed(2)} {isDe ? 'netto / Mo.' : 'net / mo'}
                        </div>
                      </div>

                      <LocaleLink
                        to={`/dashboard/new?product=${encodeURIComponent(plan.id)}`}
                        className="btn-primary text-xs h-9 px-4"
                      >
                        {isDe ? 'Bereitstellen' : 'Deploy'}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </LocaleLink>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-sans font-semibold text-[var(--fg)] mb-1">
                    {isDe
                      ? 'ODP-Anwendungsvorlagen befinden sich in der Vorbereitungsphase'
                      : 'ODP application templates are currently in pre-release preparation'}
                  </h3>
                  <p className="text-xs font-sans text-[var(--fg-muted)]">
                    {isDe
                      ? 'Tragen Sie sich unten in die Warteliste ein, um beim Start der One-Click-Bereitstellung benachrichtigt zu werden.'
                      : 'Join the waitlist below to be notified as soon as instant template deployments open.'}
                  </p>
                </div>
                <a href="#waitlist" className="shrink-0">
                  <Button variant="outline" className="h-9 px-4 text-xs">
                    {t.common.joinWaitlist}
                  </Button>
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Waitlist */}
        <section id="waitlist" className="py-12 lg:py-16">
          <div className="vs-container grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <h2 className="text-display-m text-[var(--fg)] mb-3">
                {t.deploy.waitlist.title}
              </h2>
              <p className="text-sm font-sans text-[var(--fg-muted)] leading-relaxed mb-6">
                {t.deploy.waitlist.description}
              </p>
              <LocaleLink to="/company/contact/">
                <Button variant="outline">{t.common.getInTouch}</Button>
              </LocaleLink>
            </div>
            <div className="lg:col-span-7">
              <WaitlistForm productSlug="one-click-deploy" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
export default Odp;
