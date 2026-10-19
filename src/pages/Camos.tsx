import { useState } from 'react';
import { PageHero, Button } from '../components/Shared';
import {
  Shield,
  Layout,
  Server,
  Database,
  Users,
  HeadphonesIcon,
  Activity,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { LocaleLink } from '../i18n/LocaleLink';
import { useLanguage } from '../i18n';

const FEATURES = [
  {
    icon: Layout,
    title: 'Operational Overview & Telemetry',
    description: 'Centralized operator view for active customer services, pending provisioning tasks, support queues, and upstream provider connectivity.',
  },
  {
    icon: Users,
    title: 'Customers & GoBD Billing',
    description: 'Customer profile management, Stripe PaymentIntent integration, EU VIES VAT ID verification, and sequential invoice generation.',
  },
  {
    icon: Database,
    title: 'Catalog & Plan Management',
    description: 'Map storefront product plans to underlying infrastructure configurations with stock controls and category metadata.',
  },
  {
    icon: Server,
    title: 'Asynchronous Job Orchestration',
    description: 'Background workers execute idempotent provisioning, power management, OS reinstallation, and SFTP quota tasks.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Support Desk & Ticketing',
    description: 'Integrated ticketing workflow connecting customer dashboard inquiries with staff responses and status tracking.',
  },
  {
    icon: Shield,
    title: 'Role-Based Access & Security',
    description: 'Fine-grained staff permissions, Argon2id password verification, TOTP 2FA enforcement, and immutable audit logs.',
  },
];

type ArchitectureTab = 'overview' | 'jobs' | 'services' | 'billing';

export const Camos = () => {
  const { locale } = useLanguage();
  const isDe = locale === 'de';
  const [activeTab, setActiveTab] = useState<ArchitectureTab>('overview');

  return (
    <div className="flex flex-col w-full bg-[var(--bg-primary)] text-[var(--text)]">
      <SeoHead
        title="CAMOS — Cloud Administration & Management Operating System"
        description="The internal VaultScope operations control plane powering server provisioning, GoBD-compliant EU billing, asynchronous job queues, and customer support."
        path="/software/camos"
      />

      <PageHero
        breadcrumbs={[
          { label: 'Software', href: '/projects/' },
          { label: 'CAMOS' },
        ]}
        title="CAMOS Control Plane"
        description={
          isDe
            ? 'Client Administration & Management Operations System. Die interne Steuerungsplattform hinter VaultScope für Abrechnungsprozesse, asynchrone Job-Pipelines, Upstream-Integrationen und Support.'
            : 'Client Administration & Management Operations System. The internal platform powering VaultScope billing workflows, asynchronous job pipelines, upstream provider integrations, and staff RBAC.'
        }
        primaryCta={isDe ? 'Dokumentation lesen' : 'Read Documentation'}
        primaryLink="/docs/projects/camos"
        secondaryCta="VAMOS API Gateway"
        secondaryLink="/software/vamos"
        align="left"
      />

      {/* Section 1: Truthful CAMOS Subsystem Architecture Inspector */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-eyebrow mb-2">
                {isDe ? 'Systemarchitektur' : 'System Architecture'}
              </p>
              <h2 className="text-display-m tracking-tight text-[var(--text)]">
                {isDe ? 'CAMOS Architektur & Datenmodelle' : 'CAMOS Architecture & Data Models'}
              </h2>
            </div>
            <p className="text-sm text-[var(--text-secondary)] max-w-md">
              {isDe
                ? 'Wählen Sie ein Subsystem, um die Datenmodelle, Zustandsautomaten und Schnittstellen zwischen CAMOS und VAMOS zu prüfen.'
                : 'Select a subsystem below to inspect the domain models, state transitions, and contracts between CAMOS and the VAMOS API.'}
            </p>
          </div>

          <div>
            {/* Subsystem Tabs */}
            <div className="border-b border-[var(--line)] flex gap-6 overflow-x-auto text-xs" role="tablist">
              {[
                { id: 'overview', label: isDe ? 'Architektur & RBAC' : 'Architecture & RBAC', icon: Layout },
                { id: 'jobs', label: isDe ? 'Job-Orchestrierung' : 'Job Orchestration', icon: Activity },
                { id: 'services', label: isDe ? 'Provider-Treiber' : 'Provider Drivers', icon: Server },
                { id: 'billing', label: isDe ? 'GoBD-Abrechnung & MwSt.' : 'GoBD Billing & EU VAT', icon: DollarSign },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id as ArchitectureTab)}
                    className={`flex items-center gap-2 py-3.5 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'border-[var(--accent-bright)] text-[var(--text)]'
                        : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[var(--accent-bright)]' : ''}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="pt-8">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                  <div>
                    <p className="font-mono text-xs text-[var(--accent-bright)] mb-2">
                      Isolation & Access
                    </p>
                    <h3 className="text-sm font-semibold text-[var(--text)] mb-2">
                      Zero-Direct-DB Storefront Separation
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      The public storefront has no direct link to CAMOS. All changes made by operators in CAMOS are persisted through VAMOS in PostgreSQL and reflected via `/api/storefront/*` endpoints.
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-xs text-[var(--accent-bright)] mb-2">
                      Authentication & Cryptography
                    </p>
                    <h3 className="text-sm font-semibold text-[var(--text)] mb-2">
                      Argon2id + JWT + TOTP 2FA
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Operator and customer credentials are hashed with Argon2id. Sessions use signed JWT tokens with optional RFC 6238 TOTP multi-factor authentication and backup recovery codes.
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-xs text-[var(--accent-bright)] mb-2">
                      Auditability
                    </p>
                    <h3 className="text-sm font-semibold text-[var(--text)] mb-2">
                      Structured Activity & Event Log
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Provisioning actions, power state changes, ticket updates, and billing events are recorded in the PostgreSQL activity log with timestamps and actor identifiers.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'jobs' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--text)]">
                        Asynchronous Provisioning Pipeline
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Long-running infrastructure mutations are queued in PostgreSQL and processed asynchronously by Tokio background workers.
                      </p>
                    </div>
                    <span className="font-mono text-xs text-[var(--accent-bright)]">
                      State Machine: pending → processing → completed | failed
                    </span>
                  </div>

                  <div className="overflow-x-auto border-t border-b border-[var(--line)]">
                    <table className="w-full min-w-[540px] sm:min-w-full text-left text-xs font-mono">
                      <thead className="border-b border-[var(--line)] text-[var(--text-muted)]">
                        <tr>
                          <th className="py-3 pr-4">Job Type</th>
                          <th className="py-3 px-4">Trigger Endpoint</th>
                          <th className="py-3 px-4">Upstream Driver</th>
                          <th className="py-3 pl-4">Execution Behavior</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--line)]">
                        <tr>
                          <td className="py-3.5 pr-4 text-[var(--accent-bright)] font-medium">provision_vps</td>
                          <td className="py-3.5 px-4 text-[var(--text-secondary)]">POST /storefront/orders/confirm</td>
                          <td className="py-3.5 px-4 text-[var(--text-secondary)]">Hetzner Cloud / Proxmox</td>
                          <td className="py-3.5 pl-4 text-[var(--text-secondary)]">Allocates KVM instance, attaches IPv4/IPv6, records credentials</td>
                        </tr>
                        <tr>
                          <td className="py-3.5 pr-4 text-[var(--accent-bright)] font-medium">provision_sftp</td>
                          <td className="py-3.5 px-4 text-[var(--text-secondary)]">POST /storefront/orders/confirm</td>
                          <td className="py-3.5 px-4 text-[var(--text-secondary)]">SFTPGo REST API</td>
                          <td className="py-3.5 pl-4 text-[var(--text-secondary)]">Creates isolated storage user, enforces byte quota, sets SSH keys</td>
                        </tr>
                        <tr>
                          <td className="py-3.5 pr-4 text-[var(--accent-bright)] font-medium">reinstall_service</td>
                          <td className="py-3.5 px-4 text-[var(--text-secondary)]">POST /storefront/services/:id/reinstall</td>
                          <td className="py-3.5 px-4 text-[var(--text-secondary)]">Hetzner Cloud / ReliableSite</td>
                          <td className="py-3.5 pl-4 text-[var(--text-secondary)]">Triggers automated OS image rebuild or PXE installation</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                  <div className="space-y-2">
                    <div className="font-mono text-xs font-semibold text-[var(--accent-bright)]">
                      Cloud VPS Driver
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Supports power actions (`start`, `stop`, `reboot`, `reset`), automated OS rebuilds, live CPU/RAM/network telemetry, and WebSocket VNC console sessions.
                    </p>
                    <div className="pt-2 font-mono text-[11px] text-[var(--text-muted)]">
                      Termination Guard: Instance must be stopped before deletion.
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-mono text-xs font-semibold text-[var(--accent-bright)]">
                      Dedicated Bare-Metal Driver
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Integrates hardware power control, automated PXE operating system installation, hardware inventory inspection, and out-of-band IPMI / KVM access requests.
                    </p>
                    <div className="pt-2 font-mono text-[11px] text-[var(--text-muted)]">
                      Hardware Control: Direct BMC / IPMI session provisioning.
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-mono text-xs font-semibold text-[var(--accent-bright)]">
                      SFTP Storage Driver
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Manages SFTPGo storage accounts, storage quota enforcement, password resets, and SSH public key authorization via `/storefront/services/:id/ssh-keys`.
                    </p>
                    <div className="pt-2 font-mono text-[11px] text-[var(--text-muted)]">
                      Protocols: SFTP / SCP / SSH Key Auth.
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-[var(--text)]">
                      19% German VAT & EU VIES Verification
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      CAMOS and VAMOS calculate statutory 19% German VAT (`price * 1.19`) on retail orders and expose real-time European Commission VIES VAT number verification via `POST /api/storefront/tax/validate-vat` for B2B reverse-charge eligibility.
                    </p>
                    <div className="pt-2 font-mono text-xs flex flex-wrap justify-between gap-2 text-[var(--text-secondary)]">
                      <span>Tax Endpoint</span>
                      <span className="text-[var(--accent-bright)] break-all">POST /api/storefront/tax/validate-vat</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-[var(--text)]">
                      Stripe PaymentIntents & Printable Invoices
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Checkout flows create verified Stripe PaymentIntents (`POST /api/storefront/orders/create-payment-intent`), validate promotional coupons, and generate HTML/printable invoices accessible at `/api/storefront/invoices/:id/pdf`.
                    </p>
                    <div className="pt-2 font-mono text-xs flex flex-wrap justify-between gap-2 text-[var(--text-secondary)]">
                      <span>Invoice Export</span>
                      <span className="text-[var(--accent-bright)] break-all">GET /api/storefront/invoices/:id/pdf</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Control Plane Capabilities — Open 3-Column Grid */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="mb-10">
            <p className="text-eyebrow mb-2">
              {isDe ? 'Funktionsumfang' : 'Capabilities'}
            </p>
            <h2 className="text-display-m tracking-tight text-[var(--text)]">
              {isDe ? 'Kernmodule der Steuerungsebene' : 'Core Control Plane Modules'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {FEATURES.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
                    <h3 className="text-base font-semibold text-[var(--text)] tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-14 pt-8 border-t border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-semibold text-[var(--text)] mb-1">
                {isDe ? 'Technische Dokumentation für CAMOS & VAMOS' : 'Technical Documentation for CAMOS & VAMOS'}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {isDe
                  ? 'Erfahren Sie mehr über das Zusammenspiel von CAMOS, VAMOS und unserer Infrastruktur.'
                  : 'Read the full architectural overview covering CAMOS, VAMOS, and our provisioning workflows.'}
              </p>
            </div>
            <LocaleLink to="/docs/projects/camos" className="shrink-0">
              <Button variant="primary" className="h-10 px-5 text-xs">
                <span>{isDe ? 'Projekt-Dokumentation' : 'Project Documentation'}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </Button>
            </LocaleLink>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Camos;
