import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { DocHeader } from './components/DocHeader';
import { DocPagination } from './components/DocPagination';
import { Callout } from './components/Callout';

const TOC = [
  { id: 'overview', label: 'Ecosystem Role' },
  { id: 'subpages', label: 'Documentation Guides' },
  { id: 'architecture', label: 'Core Capabilities' },
  { id: 'crates', label: 'Modular Crates' },
  { id: 'prerequisites', label: 'Host Requirements' },
];

export const DocsVamos = () => {
  const location = useLocation();
  const isGerman = location.pathname.startsWith('/de');
  const getPath = (p: string) => (isGerman ? `/de${p}` : p);

  useEffect(() => {
    document.title = 'VAMOS Documentation — VaultScope';
  }, []);

  return (
    <div className="space-y-8">
      <DocHeader
        breadcrumbs={[
          { label: 'Projects', path: '/docs/projects' },
          { label: 'VAMOS' },
        ]}
        title="VAMOS (API & Backend)"
        description="High-performance asynchronous backend and orchestration engine powering VaultScope catalog, billing, automated provisioning, and cloud integrations."
        projectKey="vamos"
        tocItems={TOC}
      />

        <div className="space-y-12 text-sm leading-relaxed">
          {/* Ecosystem Role */}
          <section id="overview" className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">Ecosystem Role</h2>
            <p className="text-[var(--text-secondary)]">
              VAMOS is a modular backend engine written in Rust using the Axum web framework, Tokio asynchronous runtime, SQLx, and PostgreSQL. It acts as the central brain of VaultScope, serving both public storefront operations and private administrative commands.
            </p>
            <p className="text-[var(--text-secondary)]">
              Beyond standard REST endpoints, VAMOS hosts an asynchronous job processor (<code className="font-mono text-[var(--text)]">crates/jobs</code>) that handles long-running provisioning tasks, IP address allocations, automated invoice generation, and upstream cloud API calls.
            </p>
          </section>

          {/* Documentation Guides */}
          <section id="subpages" className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">Documentation Guides</h2>
            <div className="grid sm:grid-cols-3 border border-[var(--line)] divide-y sm:divide-y-0 sm:divide-x divide-[var(--line)] bg-[var(--bg-card)] not-prose">
              <Link
                to={getPath('/docs/projects/vamos/install')}
                className="p-5 hover:bg-[var(--bg-elevated)] transition-colors flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.06em] text-[var(--text-muted)] block mb-2">01 / Setup</span>
                  <h3 className="text-sm font-semibold text-[var(--text)] mb-1 group-hover:underline">Installation</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Automated script, Docker Compose stack, or Cargo compilation.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] group-hover:text-[var(--text)] mt-4">
                  View guide <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <Link
                to={getPath('/docs/projects/vamos/config')}
                className="p-5 hover:bg-[var(--bg-elevated)] transition-colors flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.06em] text-[var(--text-muted)] block mb-2">02 / Parameters</span>
                  <h3 className="text-sm font-semibold text-[var(--text)] mb-1 group-hover:underline">Configuration</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Database connections, JWT and AES-256 secrets, and worker queues.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] group-hover:text-[var(--text)] mt-4">
                  View guide <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <Link
                to={getPath('/docs/projects/vamos/lifecycle')}
                className="p-5 hover:bg-[var(--bg-elevated)] transition-colors flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.06em] text-[var(--text-muted)] block mb-2">03 / Operations</span>
                  <h3 className="text-sm font-semibold text-[var(--text)] mb-1 group-hover:underline">Lifecycle & Upgrades</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    SQLx database migrations, zero-downtime binaries, and pg_dump backups.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] group-hover:text-[var(--text)] mt-4">
                  View guide <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </section>

          {/* Core Capabilities */}
          <section id="architecture" className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">Core Capabilities</h2>
            <div className="grid sm:grid-cols-2 border border-[var(--line)] divide-y divide-[var(--line)] bg-[var(--bg-card)] not-prose">
              <div className="p-5 space-y-1.5 sm:border-r sm:border-[var(--line)]">
                <div className="text-[var(--text)] font-medium text-sm">
                  Centralized API Gateway
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Unified REST API serving Storefront catalog, orders, and customer dashboards, alongside CAMOS admin endpoints with strict RBAC permission enforcement.
                </p>
              </div>

              <div className="p-5 space-y-1.5">
                <div className="text-[var(--text)] font-medium text-sm">
                  Asynchronous Job Runner
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Background worker daemon polling PostgreSQL job queues for asynchronous VM lifecycle management, backup tasks, and scheduled customer billing.
                </p>
              </div>

              <div className="p-5 space-y-1.5 sm:border-r sm:border-[var(--line)]">
                <div className="text-[var(--text)] font-medium text-sm">
                  Infrastructure Connectors
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Pluggable driver layer (Hetzner Cloud, OVH, Proxmox VE) abstracting server lifecycle events behind a common trait interface.
                </p>
              </div>

              <div className="p-5 space-y-1.5">
                <div className="text-[var(--text)] font-medium text-sm">
                  Zero-Trust Credential Security
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  All upstream provider API tokens, SSH private keys, and billing credentials are encrypted at rest with authenticated AES-256-GCM.
                </p>
              </div>
            </div>
          </section>

          {/* Modular Crates */}
          <section id="crates" className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">Cargo Workspace Architecture</h2>
            <div className="border border-[var(--line)] overflow-x-auto not-prose">
              <table className="w-full text-xs text-left">
                <thead className="bg-[var(--bg-elevated)] border-b border-[var(--line)] text-[var(--text-muted)] font-mono uppercase tracking-[0.06em]">
                  <tr>
                    <th className="px-4 py-2.5">Crate</th>
                    <th className="px-4 py-2.5">Path</th>
                    <th className="px-4 py-2.5">Responsibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)] text-[var(--text-secondary)] bg-[var(--bg-card)]">
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-[var(--text)]">vamos-api</td>
                    <td className="px-4 py-2.5 font-mono">crates/api</td>
                    <td className="px-4 py-2.5">Axum routing, JWT validation, rate limiting, and HTTP handlers.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-[var(--text)]">vamos-jobs</td>
                    <td className="px-4 py-2.5 font-mono">crates/jobs</td>
                    <td className="px-4 py-2.5">Async worker queue processor and recurring cron scheduler.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-[var(--text)]">vamos-connectors</td>
                    <td className="px-4 py-2.5 font-mono">crates/connectors</td>
                    <td className="px-4 py-2.5">Hetzner Cloud, Proxmox, and upstream infrastructure drivers.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-[var(--text)]">vamos-db</td>
                    <td className="px-4 py-2.5 font-mono">crates/db</td>
                    <td className="px-4 py-2.5">SQLx models, connection pooling, and versioned database migrations.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-[var(--text)]">vamos-common</td>
                    <td className="px-4 py-2.5 font-mono">crates/common</td>
                    <td className="px-4 py-2.5">AES-256-GCM cryptography, shared error types, and validation logic.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Host Requirements */}
          <section id="prerequisites" className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">Host Requirements</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--text-secondary)]">
              <li>Database: PostgreSQL 15 or 16 with UTF-8 encoding</li>
              <li>Cache: Redis 7.0+ (optional but recommended for rate limits and caching)</li>
              <li>Compute: 1 vCPU, 1 GB RAM minimum (2 vCPU, 2 GB RAM recommended in production)</li>
              <li>Linux: Ubuntu 22.04+, Debian 12+, or Rocky Linux 9+</li>
            </ul>

            <Callout type="info" title="Zero External Runtimes">
              Compiled VAMOS binaries have zero runtime dependencies beyond OpenSSL and standard glibc, yielding ultra-compact container footprints and sub-50ms cold boot times.
            </Callout>
          </section>

          <DocPagination
            prev={{ title: 'Storefront Maintenance', path: '/docs/projects/storefront/lifecycle' }}
            next={{ title: 'VAMOS Installation', path: '/docs/projects/vamos/install' }}
          />
        </div>
    </div>
  );
};
