import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Download, 
  Settings, 
  RefreshCw, 
  ArrowRight, 
  Layers, 
  Users, 
  Activity, 
  Key 
} from 'lucide-react';
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
        badge={{ label: 'Operations Suite' }}
        description="The internal management portal empowering engineering and support teams to control infrastructure connectors, monitor job queues, and govern billing operations."
        projectKey="camos"
        tocItems={TOC}
      />

        <div className="space-y-12 text-sm leading-relaxed">
          {/* Ecosystem Role */}
          <section id="overview" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Ecosystem Role</h2>
            <p className="text-foreground/80">
              CAMOS serves as the dedicated internal control plane for VaultScope operators, staff, and system administrators. It interfaces directly with administrative endpoints in VAMOS to oversee customer accounts, cloud provider connectors, and automated billing.
            </p>
            <p className="text-foreground/80">
              Unlike the public storefront, CAMOS requires elevated Authentik credentials belonging to the administrator group and communicates over mutual TLS or isolated management networks.
            </p>
          </section>

          {/* Documentation Guides */}
          <section id="subpages" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Documentation Guides</h2>
            <div className="grid sm:grid-cols-3 gap-4 not-prose">
              <Link
                to={getPath('/docs/projects/camos/install')}
                className="p-4 rounded-lg border border-border bg-foreground/[0.01] hover:border-foreground/30 hover:bg-foreground/[0.03] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-8 h-8 rounded-md bg-foreground/5 flex items-center justify-center mb-3">
                    <Download className="w-4 h-4 text-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:underline">Installation</h3>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    Automated script, Docker with Nginx, or local development server.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-foreground/50 group-hover:text-foreground mt-4">
                  View guide <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <Link
                to={getPath('/docs/projects/camos/config')}
                className="p-4 rounded-lg border border-border bg-foreground/[0.01] hover:border-foreground/30 hover:bg-foreground/[0.03] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-8 h-8 rounded-md bg-foreground/5 flex items-center justify-center mb-3">
                    <Settings className="w-4 h-4 text-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:underline">Configuration</h3>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    Authentik OIDC client configuration and RBAC permissions.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-foreground/50 group-hover:text-foreground mt-4">
                  View guide <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <Link
                to={getPath('/docs/projects/camos/lifecycle')}
                className="p-4 rounded-lg border border-border bg-foreground/[0.01] hover:border-foreground/30 hover:bg-foreground/[0.03] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-8 h-8 rounded-md bg-foreground/5 flex items-center justify-center mb-3">
                    <RefreshCw className="w-4 h-4 text-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:underline">Lifecycle & Upgrades</h3>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    Zero-downtime bundle deployments and uninstallation steps.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-foreground/50 group-hover:text-foreground mt-4">
                  View guide <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </section>

          {/* Core Capabilities */}
          <section id="capabilities" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Core Capabilities</h2>
            <div className="grid sm:grid-cols-2 gap-4 not-prose">
              <div className="p-4 rounded-lg border border-border bg-foreground/[0.01] space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <Layers className="w-4 h-4 text-foreground/60" />
                  <span>Product & Catalog Management</span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Configure compute plans, RAM, vCPU limits, bandwidth quotas, pricing tiers, and custom order form fields with live preview.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-foreground/[0.01] space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <Activity className="w-4 h-4 text-foreground/60" />
                  <span>Job Queue Inspection & Retry</span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Real-time visibility into asynchronous provisioning tasks, error logs, and one-click manual retry for failed cloud connector operations.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-foreground/[0.01] space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <Users className="w-4 h-4 text-foreground/60" />
                  <span>Customer 360 & Service Provisioning</span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Deep customer management including invoice histories, active services, manual suspension/termination, and IP address allocation audits.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-foreground/[0.01] space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <Key className="w-4 h-4 text-foreground/60" />
                  <span>Cloud Connectors Dashboard</span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Configure upstream API tokens for Hetzner Cloud, OVH, and Proxmox VE with automatic AES-256-GCM encryption verification.
                </p>
              </div>
            </div>
          </section>

          {/* Technology Stack */}
          <section id="tech-stack" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Technology Stack</h2>
            <div className="border border-border rounded-lg overflow-hidden not-prose">
              <table className="w-full text-xs text-left">
                <thead className="bg-foreground/[0.03] border-b border-border text-foreground/60 font-mono">
                  <tr>
                    <th className="px-4 py-2.5">Component</th>
                    <th className="px-4 py-2.5">Technology</th>
                    <th className="px-4 py-2.5">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground/80">
                  <tr>
                    <td className="px-4 py-2.5 font-medium">Framework</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">React 19</td>
                    <td className="px-4 py-2.5 text-foreground/60">Modern component architecture with Vite bundler.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium">Charts & Telemetry</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">Recharts</td>
                    <td className="px-4 py-2.5 text-foreground/60">Real-time revenue, job throughput, and active instance charts.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium">Rich Editor</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">TipTap</td>
                    <td className="px-4 py-2.5 text-foreground/60">WYSIWYG editor for email templates, notifications, and runbooks.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium">Web Server</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">Nginx Alpine</td>
                    <td className="px-4 py-2.5 text-foreground/60">High-concurrency static delivery with IP allowlisting rules.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Security */}
          <section id="security" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Security & Access Control</h2>
            <p className="text-foreground/80">
              Access to CAMOS should be restricted at the network layer using IP allowlisting, VPN access, or Cloudflare Zero Trust. Authentik enforces required group membership before granting access tokens.
            </p>
            <Callout type="tip" title="Network Isolation">
              We advise running CAMOS behind an internal management domain (e.g. <code className="font-mono text-foreground">admin.internal.vaultscope.de</code>) accessible only over Tailscale or WireGuard VPN.
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
