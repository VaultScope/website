import { PageHero, Button } from '../components/Shared';
import { ArrowRight, Shield, Zap } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { LocaleLink } from '../i18n/LocaleLink';
import { useLanguage } from '../i18n';

const CRATE_ARCHITECTURE = [
  {
    module: 'Storefront & Customer API',
    prefix: '/api/storefront/*',
    desc: 'Handles public catalog queries, customer authentication, service lifecycle actions, billing invoices, and support tickets.',
    endpoints: [
      'GET /api/storefront/catalog',
      'POST /api/storefront/orders/create-payment-intent',
      'GET /api/storefront/services',
      'POST /api/storefront/tickets',
    ],
  },
  {
    module: 'CAMOS Admin & Operations API',
    prefix: '/api/admin/*',
    desc: 'Internal operator endpoints protected by role-based access control (RBAC) for catalog management, job inspection, and customer support.',
    endpoints: [
      'GET /api/admin/jobs',
      'POST /api/admin/products',
      'GET /api/admin/services',
      'POST /api/admin/tickets/:id/reply',
    ],
  },
  {
    module: 'Upstream Provider Connectors',
    prefix: 'providers::*',
    desc: 'Typed Rust clients integrating external and self-hosted infrastructure controllers with automatic retry and error normalization.',
    endpoints: [
      'Hetzner Cloud API (VPS lifecycle, metrics, VNC)',
      'ReliableSite API (Bare-metal power, PXE, IPMI KVM)',
      'SFTPGo REST API (Storage quotas & SSH key rotation)',
      'Stripe & EU VIES SOAP/REST (Payments & VAT validation)',
    ],
  },
];

const TECHNICAL_SPECS = [
  { label: 'Language & Runtime', value: 'Rust (2021 Edition) · Tokio Async Runtime' },
  { label: 'HTTP Framework', value: 'Axum · Tower Middleware' },
  { label: 'Database & Persistence', value: 'PostgreSQL · SQLx (Compile-time checked queries)' },
  { label: 'Authentication', value: 'Argon2id Password Hashing · JWT Bearer · TOTP 2FA' },
  { label: 'Request Security', value: 'Double-Submit CSRF Token · Scoped CORS · Rate Limiting' },
  { label: 'License', value: 'GNU Affero General Public License v3.0 (AGPL-3.0)' },
];

export const Vamos = () => {
  const { locale } = useLanguage();
  const isDe = locale === 'de';

  return (
    <div className="flex flex-col w-full bg-[var(--bg-primary)] text-[var(--text)]">
      <SeoHead
        title="VAMOS — VaultScope API Management & Operations System"
        description="The open-source Rust API gateway and orchestration engine connecting the VaultScope Storefront, CAMOS control plane, and infrastructure providers."
        path="/software/vamos"
      />

      <PageHero
        breadcrumbs={[
          { label: 'Software', href: '/projects/' },
          { label: 'VAMOS' },
        ]}
        title="VAMOS"
        description={
          isDe
            ? 'VaultScope API Management & Operations System. Das in Rust entwickelte zentrale API-Gateway, das die Kommunikation zwischen Storefront, CAMOS und unserer Infrastruktur-Schicht steuert.'
            : 'VaultScope API Management & Operations System. The central API layer written in Rust that handles authentication, provisioning jobs, billing webhooks, and communication between CAMOS, the VaultScope Storefront, and upstream infrastructure APIs.'
        }
        primaryCta="View on GitHub"
        primaryLink="https://github.com/VaultScope/vamos"
        secondaryCta={isDe ? 'API-Referenz' : 'API Reference'}
        secondaryLink="/docs/api"
        align="left"
      />

      {/* Section 1: Architectural Overview & Technical Specification */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-6">
              <p className="text-eyebrow mb-2">
                {isDe ? 'Architektur & Laufzeit' : 'Architecture & Runtime'}
              </p>
              <h2 className="text-display-m tracking-tight text-[var(--text)] mb-3">
                {isDe
                  ? 'Speichersichere API-Orchestrierung in Rust.'
                  : 'Memory-safe API orchestration in Rust.'}
              </h2>
              <p className="text-body-l text-[var(--text-secondary)] leading-relaxed mb-6">
                {isDe
                  ? 'VAMOS bildet das Rückgrat der gesamten VaultScope-Plattform. Jede Kundenaktion im Dashboard, jede Zahlungsbestätigung und jeder Provisionierungsauftrag durchläuft VAMOS als typisierte, transaktionale Operation.'
                  : 'VAMOS serves as the single source of truth across the VaultScope ecosystem. Every customer action in the storefront dashboard, every payment confirmation, and every hardware provisioning task passes through VAMOS as a strictly typed, transactional operation.'}
              </p>

              <div className="pt-6 border-t border-[var(--line)] grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <Zap className="w-4 h-4 text-[var(--accent-bright)] mb-2" />
                  <h3 className="text-sm font-semibold text-[var(--text)] mb-1">
                    {isDe ? 'Deterministische Ausführung' : 'Deterministic Execution'}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {isDe
                      ? 'Gebaut mit Tokio, Axum und SQLx für minimale Latenz, strikte Typensicherheit und vorhersagbare Fehlerbehandlung.'
                      : 'Engineered with Tokio, Axum, and SQLx for low latency, compile-time SQL verification, and explicit error propagation.'}
                  </p>
                </div>
                <div>
                  <Shield className="w-4 h-4 text-[var(--accent-bright)] mb-2" />
                  <h3 className="text-sm font-semibold text-[var(--text)] mb-1">
                    AGPL-3.0 Open Source
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {isDe
                      ? 'Vollständig quelloffen unter der GNU Affero General Public License v3.0 veröffentlicht.'
                      : 'Published as open-source software under the GNU Affero General Public License v3.0 for full architectural transparency.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div>
                <div className="pb-3.5 border-b border-[var(--line)] flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text)]">
                    {isDe ? 'Technische Spezifikation' : 'Technical Specification'}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--accent-bright)]">
                    VaultScope-API (VAMOS)
                  </span>
                </div>
                <dl className="divide-y divide-[var(--line)] border-b border-[var(--line)] font-mono text-xs">
                  {TECHNICAL_SPECS.map((spec) => (
                    <div key={spec.label} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <dt className="text-[var(--text-muted)]">{spec.label}</dt>
                      <dd className="text-[var(--text)] font-medium sm:text-right break-words">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Subsystem & Route Architecture */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="mb-10">
            <p className="text-eyebrow mb-2">
              {isDe ? 'Systemgrenzen' : 'System Boundaries'}
            </p>
            <h2 className="text-display-m tracking-tight text-[var(--text)]">
              {isDe ? 'Drei integrierte API-Schichten.' : 'Three integrated API boundaries.'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            {CRATE_ARCHITECTURE.map((col) => (
              <div key={col.module} className="flex flex-col justify-between min-w-0">
                <div>
                  <span className="font-mono text-xs text-[var(--accent-bright)] block mb-2">
                    {col.prefix}
                  </span>
                  <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
                    {col.module}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                    {col.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--line)]">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-2">
                    {isDe ? 'Kern-Routen / Module' : 'Key Routes / Connectors'}
                  </p>
                  <ul className="space-y-1.5 font-mono text-xs text-[var(--text)]">
                    {col.endpoints.map((ep) => (
                      <li key={ep} className="break-all sm:truncate">
                        {ep}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Documentation & Source Links */}
      <section className="py-12 lg:py-14">
        <div className="vs-container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text)] mb-1">
                {isDe ? 'Erkunden Sie den VAMOS Quellcode & die API-Dokumentation' : 'Explore VAMOS source code & API documentation'}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] max-w-xl">
                {isDe
                  ? 'Lesen Sie die vollständige Endpunkt-Dokumentation oder inspizieren Sie die Rust-Implementierung direkt auf GitHub.'
                  : 'Inspect the complete storefront endpoint reference or review the Rust implementation directly on GitHub.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <LocaleLink to="/docs/api">
                <Button variant="primary" className="h-10 px-5 text-xs">
                  <span>{isDe ? 'API-Dokumentation' : 'API Reference'}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Button>
              </LocaleLink>
              <LocaleLink to="/docs/projects/vamos">
                <Button variant="outline" className="h-10 px-5 text-xs">
                  {isDe ? 'Architektur-Dokumentation' : 'Project Overview'}
                </Button>
              </LocaleLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Vamos;
