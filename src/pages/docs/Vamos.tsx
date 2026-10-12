import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Download, 
  Settings, 
  RefreshCw, 
  ArrowRight, 
  Zap, 
  Server, 
  ShieldCheck, 
  Boxes 
} from 'lucide-react';
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
        badge={{ label: 'Core Engine' }}
        description="High-performance asynchronous backend and orchestration engine powering VaultScope catalog, billing, automated provisioning, and cloud integrations."
        projectKey="vamos"
        tocItems={TOC}
      />

        <div className="space-y-12 text-sm leading-relaxed">
          {/* Ecosystem Role */}
          <section id="overview" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Ecosystem Role</h2>
            <p className="text-foreground/80">
              VAMOS is a modular backend engine written in Rust using the Axum web framework, Tokio asynchronous runtime, SQLx, and PostgreSQL. It acts as the central brain of VaultScope, serving both public storefront operations and private administrative commands.
            </p>
            <p className="text-foreground/80">
              Beyond standard REST endpoints, VAMOS hosts an asynchronous job processor (<code className="font-mono text-foreground">crates/jobs</code>) that handles long-running provisioning tasks, IP address allocations, automated invoice generation, and upstream cloud API calls.
            </p>
          </section>

          {/* Documentation Guides */}
          <section id="subpages" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Documentation Guides</h2>
            <div className="grid sm:grid-cols-3 gap-4 not-prose">
              <Link
                to={getPath('/docs/projects/vamos/install')}
                className="p-4 rounded-lg border border-border bg-foreground/[0.01] hover:border-foreground/30 hover:bg-foreground/[0.03] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-8 h-8 rounded-md bg-foreground/5 flex items-center justify-center mb-3">
                    <Download className="w-4 h-4 text-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:underline">Installation</h3>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    Automated script, Docker Compose stack, or Cargo compilation.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-foreground/50 group-hover:text-foreground mt-4">
                  View guide <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <Link
                to={getPath('/docs/projects/vamos/config')}
                className="p-4 rounded-lg border border-border bg-foreground/[0.01] hover:border-foreground/30 hover:bg-foreground/[0.03] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-8 h-8 rounded-md bg-foreground/5 flex items-center justify-center mb-3">
                    <Settings className="w-4 h-4 text-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:underline">Configuration</h3>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    Database connections, JWT and AES-256 secrets, and worker queues.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-foreground/50 group-hover:text-foreground mt-4">
                  View guide <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <Link
                to={getPath('/docs/projects/vamos/lifecycle')}
                className="p-4 rounded-lg border border-border bg-foreground/[0.01] hover:border-foreground/30 hover:bg-foreground/[0.03] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-8 h-8 rounded-md bg-foreground/5 flex items-center justify-center mb-3">
                    <RefreshCw className="w-4 h-4 text-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:underline">Lifecycle & Upgrades</h3>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    SQLx database migrations, zero-downtime binaries, and pg_dump backups.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-foreground/50 group-hover:text-foreground mt-4">
                  View guide <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </section>

          {/* Core Capabilities */}
          <section id="architecture" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Core Capabilities</h2>
            <div className="grid sm:grid-cols-2 gap-4 not-prose">
              <div className="p-4 rounded-lg border border-border bg-foreground/[0.01] space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <Server className="w-4 h-4 text-foreground/60" />
                  <span>Centralized API Gateway</span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Unified REST API serving Storefront catalog, orders, and customer dashboards, alongside CAMOS admin endpoints with strict RBAC permission enforcement.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-foreground/[0.01] space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <Zap className="w-4 h-4 text-foreground/60" />
                  <span>Asynchronous Job Runner</span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Background worker daemon polling PostgreSQL job queues for asynchronous VM lifecycle management, backup tasks, and scheduled customer billing.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-foreground/[0.01] space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <Boxes className="w-4 h-4 text-foreground/60" />
                  <span>Infrastructure Connectors</span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Pluggable driver layer (Hetzner Cloud, OVH, Proxmox VE) abstracting server lifecycle events behind a common trait interface.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-foreground/[0.01] space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <ShieldCheck className="w-4 h-4 text-foreground/60" />
                  <span>Zero-Trust Credential Security</span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  All upstream provider API tokens, SSH private keys, and billing credentials are encrypted at rest with authenticated AES-256-GCM.
                </p>
              </div>
            </div>
          </section>

          {/* Modular Crates */}
          <section id="crates" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Cargo Workspace Architecture</h2>
            <div className="border border-border rounded-lg overflow-hidden not-prose">
              <table className="w-full text-xs text-left">
                <thead className="bg-foreground/[0.03] border-b border-border text-foreground/60 font-mono">
                  <tr>
                    <th className="px-4 py-2.5">Crate</th>
                    <th className="px-4 py-2.5">Path</th>
                    <th className="px-4 py-2.5">Responsibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground/80">
                  <tr>
                    <td className="px-4 py-2.5 font-medium">vamos-api</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">crates/api</td>
                    <td className="px-4 py-2.5 text-foreground/60">Axum routing, JWT validation, rate limiting, and HTTP handlers.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium">vamos-jobs</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">crates/jobs</td>
                    <td className="px-4 py-2.5 text-foreground/60">Async worker queue processor and recurring cron scheduler.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium">vamos-connectors</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">crates/connectors</td>
                    <td className="px-4 py-2.5 text-foreground/60">Hetzner Cloud, Proxmox, and upstream infrastructure drivers.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium">vamos-db</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">crates/db</td>
                    <td className="px-4 py-2.5 text-foreground/60">SQLx models, connection pooling, and versioned database migrations.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium">vamos-common</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">crates/common</td>
                    <td className="px-4 py-2.5 text-foreground/60">AES-256-GCM cryptography, shared error types, and validation logic.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Host Requirements */}
          <section id="prerequisites" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Host Requirements</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-foreground/70">
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
