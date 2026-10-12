import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Download, 
  Settings, 
  RefreshCw, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Server, 
  Zap 
} from 'lucide-react';
import { DocHeader } from './components/DocHeader';
import { DocPagination } from './components/DocPagination';
import { Callout } from './components/Callout';

const TOC = [
  { id: 'overview', label: 'Ecosystem Role' },
  { id: 'subpages', label: 'Documentation Guides' },
  { id: 'capabilities', label: 'Core Capabilities' },
  { id: 'tech-stack', label: 'Technology Stack' },
  { id: 'prerequisites', label: 'Host Requirements' },
];

export const DocsStorefront = () => {
  const location = useLocation();
  const isGerman = location.pathname.startsWith('/de');
  const getPath = (p: string) => (isGerman ? `/de${p}` : p);

  useEffect(() => {
    document.title = 'Customer Experience Documentation — VaultScope';
  }, []);

  return (
    <div className="space-y-8">
      <DocHeader
        breadcrumbs={[
          { label: 'Projects', path: '/docs/projects' },
          { label: 'Storefront' },
        ]}
        title="Customer Experience (Storefront)"
        badge={{ label: 'TypeScript SPA' }}
        description="The public storefront and authenticated customer portal for browsing hosting plans, purchasing on-demand cloud servers, and managing provisioned infrastructure."
        projectKey="storefront"
        tocItems={TOC}
      />

        <div className="space-y-12 text-sm leading-relaxed">
          {/* Ecosystem Role */}
          <section id="overview" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Ecosystem Role</h2>
            <p className="text-foreground/80">
              The VaultScope Storefront is built using modern web technologies including React 19, Vite 8, client-side routing, and Tailwind CSS 4. It communicates directly with the VAMOS backend REST API and integrates with Authentik for Single Sign-On (SSO) authentication.
            </p>
            <p className="text-foreground/80">
              In production, the application is pre-rendered as an optimized Single Page Application (SPA) and served via Caddy with automatic HTTP/3, TLS certificate management, and compression.
            </p>
          </section>

          {/* Quick Subpages Navigation */}
          <section id="subpages" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Documentation Guides</h2>
            <div className="grid sm:grid-cols-3 gap-4 not-prose">
              <Link
                to={getPath('/docs/projects/storefront/install')}
                className="p-4 rounded-lg border border-border bg-foreground/[0.01] hover:border-foreground/30 hover:bg-foreground/[0.03] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-8 h-8 rounded-md bg-foreground/5 flex items-center justify-center mb-3">
                    <Download className="w-4 h-4 text-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:underline">Installation</h3>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    Automated one-line shell install, Docker with Caddy, and local development.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-foreground/50 group-hover:text-foreground mt-4">
                  View guide <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <Link
                to={getPath('/docs/projects/storefront/config')}
                className="p-4 rounded-lg border border-border bg-foreground/[0.01] hover:border-foreground/30 hover:bg-foreground/[0.03] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-8 h-8 rounded-md bg-foreground/5 flex items-center justify-center mb-3">
                    <Settings className="w-4 h-4 text-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:underline">Configuration</h3>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    Environment variables, Vite build-time parameters, and Caddyfile routing.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-foreground/50 group-hover:text-foreground mt-4">
                  View guide <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <Link
                to={getPath('/docs/projects/storefront/lifecycle')}
                className="p-4 rounded-lg border border-border bg-foreground/[0.01] hover:border-foreground/30 hover:bg-foreground/[0.03] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-8 h-8 rounded-md bg-foreground/5 flex items-center justify-center mb-3">
                    <RefreshCw className="w-4 h-4 text-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:underline">Lifecycle & Updates</h3>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    Zero-downtime container updates, asset cache-busting, and uninstallation.
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
                  <span>Dynamic Product Catalog</span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Real-time synchronization with VAMOS product plans, supporting VPS, Dedicated Servers, and custom configurable hardware options with live EUR currency conversions.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-foreground/[0.01] space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <Zap className="w-4 h-4 text-foreground/60" />
                  <span>Automated Ordering Workflow</span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Multi-step checkout with coupon validation, tax rate determination, and immediate provisioning job creation upon payment confirmation.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-foreground/[0.01] space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <Server className="w-4 h-4 text-foreground/60" />
                  <span>Customer Infrastructure Console</span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Instance controls including restart, root password resets, VNC console access, PTR reverse DNS management, and real-time bandwidth metrics.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-foreground/[0.01] space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <ShieldCheck className="w-4 h-4 text-foreground/60" />
                  <span>Authentik OIDC Single Sign-On</span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  PKCE OAuth2 authentication with multi-factor authentication (TOTP/WebAuthn) and centralized identity federation across the VaultScope suite.
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
                    <th className="px-4 py-2.5">Specification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground/80">
                  <tr>
                    <td className="px-4 py-2.5 font-medium">UI Architecture</td>
                    <td className="px-4 py-2.5 font-mono">Modern SPA (v19)</td>
                    <td className="px-4 py-2.5 text-foreground/60">Functional components with hooks and lazy-loaded routes</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium">Build Tool</td>
                    <td className="px-4 py-2.5 font-mono">Vite 8</td>
                    <td className="px-4 py-2.5 text-foreground/60">TypeScript compilation and code-splitting</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium">Styling</td>
                    <td className="px-4 py-2.5 font-mono">Tailwind CSS v4</td>
                    <td className="px-4 py-2.5 text-foreground/60">OKLCH color space with strict dark/light neutral palette</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium">Web Server</td>
                    <td className="px-4 py-2.5 font-mono">Caddy 2.7+</td>
                    <td className="px-4 py-2.5 text-foreground/60">Automated ACME TLS, HTTP/3, and SPA index fallback</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Host Requirements */}
          <section id="prerequisites" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Host Requirements</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-foreground/70">
              <li>Operating System: Ubuntu 22.04 / 24.04 LTS, Debian 12, or AlmaLinux 9</li>
              <li>CPU & RAM: Minimum 1 vCPU, 512 MB RAM (1 GB recommended for production builds)</li>
              <li>Network: Inbound ports 80 (HTTP) and 443 (HTTPS) accessible</li>
              <li>DNS: A / AAAA record pointing to the server public IP address</li>
            </ul>

            <Callout type="tip" title="Build Environment Gotcha">
              Because Vite substitutes <code className="text-foreground font-mono">VITE_*</code> environment variables at compilation time, dynamic values must be passed as build arguments during <code className="text-foreground font-mono">docker build</code> rather than injected at runtime.
            </Callout>
          </section>

          <DocPagination
            prev={{ title: 'Documentation Overview', path: '/docs' }}
            next={{ title: 'Storefront Installation', path: '/docs/projects/storefront/install' }}
          />
        </div>
    </div>
  );
};
