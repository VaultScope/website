import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { DocHeader } from './components/DocHeader';
import { DocPagination } from './components/DocPagination';
import { Callout } from './components/Callout';

const TOC = [
  { id: 'overview', label: 'Ecosystem Role' },
  { id: 'subpages', label: 'Documentation Guides' },
  { id: 'capabilities', label: 'Core Capabilities' },
  { id: 'tech-stack', label: 'Technology Stack' },
  { id: 'security', label: 'Security & Access Control' },
];

export const DocsCamos = () => {
  const location = useLocation();
  const isGerman = location.pathname.startsWith('/de');
  const getPath = (p: string) => (isGerman ? `/de${p}` : p);

  useEffect(() => {
    document.title = 'CAMOS Documentation — VaultScope';
  }, []);

  return (
    <div className="space-y-8">
      <DocHeader
        breadcrumbs={[
          { label: 'Projects', path: '/docs/projects' },
          { label: 'CAMOS' },
        ]}
        title="CAMOS (Admin Panel)"
        description="The internal management portal empowering engineering and support teams to control infrastructure connectors, monitor job queues, and govern billing operations."
        projectKey="camos"
        tocItems={TOC}
      />

        <div className="space-y-12 text-sm leading-relaxed">
          {/* Ecosystem Role */}
          <section id="overview" className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">Ecosystem Role</h2>
            <p className="text-[var(--text-secondary)]">
              CAMOS serves as the dedicated internal control plane for VaultScope operators, staff, and system administrators. It interfaces directly with administrative endpoints in VAMOS to oversee customer accounts, cloud provider connectors, and automated billing.
            </p>
            <p className="text-[var(--text-secondary)]">
              Unlike the public storefront, CAMOS requires elevated Authentik credentials belonging to the administrator group and communicates over mutual TLS or isolated management networks.
            </p>
          </section>

          {/* Documentation Guides */}
          <section id="subpages" className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">Documentation Guides</h2>
            <div className="grid sm:grid-cols-3 border border-[var(--line)] divide-y sm:divide-y-0 sm:divide-x divide-[var(--line)] bg-[var(--bg-card)] not-prose">
              <Link
                to={getPath('/docs/projects/camos/install')}
                className="p-5 hover:bg-[var(--bg-elevated)] transition-colors flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.06em] text-[var(--text-muted)] block mb-2">01 / Setup</span>
                  <h3 className="text-sm font-semibold text-[var(--text)] mb-1 group-hover:underline">Installation</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Automated script, Docker with Nginx, or local development server.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] group-hover:text-[var(--text)] mt-4">
                  View guide <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <Link
                to={getPath('/docs/projects/camos/config')}
                className="p-5 hover:bg-[var(--bg-elevated)] transition-colors flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.06em] text-[var(--text-muted)] block mb-2">02 / Parameters</span>
                  <h3 className="text-sm font-semibold text-[var(--text)] mb-1 group-hover:underline">Configuration</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Authentik OIDC client configuration and RBAC permissions.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] group-hover:text-[var(--text)] mt-4">
                  View guide <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <Link
                to={getPath('/docs/projects/camos/lifecycle')}
                className="p-5 hover:bg-[var(--bg-elevated)] transition-colors flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.06em] text-[var(--text-muted)] block mb-2">03 / Operations</span>
                  <h3 className="text-sm font-semibold text-[var(--text)] mb-1 group-hover:underline">Lifecycle & Upgrades</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Zero-downtime bundle deployments and uninstallation steps.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] group-hover:text-[var(--text)] mt-4">
                  View guide <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </section>

          {/* Core Capabilities */}
          <section id="capabilities" className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">Core Capabilities</h2>
            <div className="grid sm:grid-cols-2 border border-[var(--line)] divide-y divide-[var(--line)] bg-[var(--bg-card)] not-prose">
              <div className="p-5 space-y-1.5 sm:border-r sm:border-[var(--line)]">
                <div className="text-[var(--text)] font-medium text-sm">
                  Product & Catalog Management
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Configure compute plans, RAM, vCPU limits, bandwidth quotas, pricing tiers, and custom order form fields with live preview.
                </p>
              </div>

              <div className="p-5 space-y-1.5">
                <div className="text-[var(--text)] font-medium text-sm">
                  Job Queue Inspection & Retry
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Real-time visibility into asynchronous provisioning tasks, error logs, and one-click manual retry for failed cloud connector operations.
                </p>
              </div>

              <div className="p-5 space-y-1.5 sm:border-r sm:border-[var(--line)]">
                <div className="text-[var(--text)] font-medium text-sm">
                  Customer 360 & Service Provisioning
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Deep customer management including invoice histories, active services, manual suspension/termination, and IP address allocation audits.
                </p>
              </div>

              <div className="p-5 space-y-1.5">
                <div className="text-[var(--text)] font-medium text-sm">
                  Cloud Connectors Dashboard
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Configure upstream API tokens for Hetzner Cloud, OVH, and Proxmox VE with automatic AES-256-GCM encryption verification.
                </p>
              </div>
            </div>
          </section>

          {/* Technology Stack */}
          <section id="tech-stack" className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">Technology Stack</h2>
            <div className="border border-[var(--line)] overflow-x-auto not-prose">
              <table className="w-full text-xs text-left">
                <thead className="bg-[var(--bg-elevated)] border-b border-[var(--line)] text-[var(--text-muted)] font-mono uppercase tracking-[0.06em]">
                  <tr>
                    <th className="px-4 py-2.5">Component</th>
                    <th className="px-4 py-2.5">Technology</th>
                    <th className="px-4 py-2.5">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)] text-[var(--text-secondary)] bg-[var(--bg-card)]">
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-[var(--text)]">Framework</td>
                    <td className="px-4 py-2.5 font-mono">React 19</td>
                    <td className="px-4 py-2.5">Modern component architecture with Vite bundler.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-[var(--text)]">Charts & Telemetry</td>
                    <td className="px-4 py-2.5 font-mono">Recharts</td>
                    <td className="px-4 py-2.5">Real-time revenue, job throughput, and active instance charts.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-[var(--text)]">Rich Editor</td>
                    <td className="px-4 py-2.5 font-mono">TipTap</td>
                    <td className="px-4 py-2.5">WYSIWYG editor for email templates, notifications, and runbooks.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-[var(--text)]">Web Server</td>
                    <td className="px-4 py-2.5 font-mono">Nginx Alpine</td>
                    <td className="px-4 py-2.5">High-concurrency static delivery with IP allowlisting rules.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Security */}
          <section id="security" className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">Security & Access Control</h2>
            <p className="text-[var(--text-secondary)]">
              Access to CAMOS should be restricted at the network layer using IP allowlisting, VPN access, or Cloudflare Zero Trust. Authentik enforces required group membership before granting access tokens.
            </p>
            <Callout type="tip" title="Network Isolation">
              We advise running CAMOS behind an internal management domain (e.g. <code className="font-mono text-[var(--text)]">admin.internal.vaultscope.de</code>) accessible only over Tailscale or WireGuard VPN.
            </Callout>
          </section>

          <DocPagination
            prev={{ title: 'VAMOS Maintenance', path: '/docs/projects/vamos/lifecycle' }}
            next={{ title: 'CAMOS Installation', path: '/docs/projects/camos/install' }}
          />
        </div>
    </div>
  );
};
