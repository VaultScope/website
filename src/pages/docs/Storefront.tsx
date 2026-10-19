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
        description="The public storefront and authenticated customer portal for browsing hosting plans, purchasing on-demand cloud servers, and managing provisioned infrastructure."
        projectKey="storefront"
        tocItems={TOC}
      />

        <div className="space-y-12 text-sm leading-relaxed">
          {/* Ecosystem Role */}
          <section id="overview" className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">Ecosystem Role</h2>
            <p className="text-[var(--text-secondary)]">
              The VaultScope Storefront is built using modern web technologies including React 19, Vite 8, client-side routing, and Tailwind CSS 4. It communicates directly with the VAMOS backend REST API and integrates with Authentik for Single Sign-On (SSO) authentication.
            </p>
            <p className="text-[var(--text-secondary)]">
              In production, the application is pre-rendered as an optimized Single Page Application (SPA) and served via Caddy with automatic HTTP/3, TLS certificate management, and compression.
            </p>
          </section>

          {/* Quick Subpages Navigation */}
          <section id="subpages" className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">Documentation Guides</h2>
            <div className="grid sm:grid-cols-3 border border-[var(--line)] divide-y sm:divide-y-0 sm:divide-x divide-[var(--line)] bg-[var(--bg-card)] not-prose">
              <Link
                to={getPath('/docs/projects/storefront/install')}
                className="p-5 hover:bg-[var(--bg-elevated)] transition-colors flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.06em] text-[var(--text-muted)] block mb-2">01 / Setup</span>
                  <h3 className="text-sm font-semibold text-[var(--text)] mb-1 group-hover:underline">Installation</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Automated one-line shell install, Docker with Caddy, and local development.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] group-hover:text-[var(--text)] mt-4">
                  View guide <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <Link
                to={getPath('/docs/projects/storefront/config')}
                className="p-5 hover:bg-[var(--bg-elevated)] transition-colors flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.06em] text-[var(--text-muted)] block mb-2">02 / Parameters</span>
                  <h3 className="text-sm font-semibold text-[var(--text)] mb-1 group-hover:underline">Configuration</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Environment variables, Vite build-time parameters, and Caddyfile routing.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] group-hover:text-[var(--text)] mt-4">
                  View guide <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <Link
                to={getPath('/docs/projects/storefront/lifecycle')}
                className="p-5 hover:bg-[var(--bg-elevated)] transition-colors flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.06em] text-[var(--text-muted)] block mb-2">03 / Operations</span>
                  <h3 className="text-sm font-semibold text-[var(--text)] mb-1 group-hover:underline">Lifecycle & Updates</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Zero-downtime container updates, asset cache-busting, and uninstallation.
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
                  Dynamic Product Catalog
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Real-time synchronization with VAMOS product plans, supporting VPS, Dedicated Servers, and custom configurable hardware options with live EUR currency conversions.
                </p>
              </div>

              <div className="p-5 space-y-1.5">
                <div className="text-[var(--text)] font-medium text-sm">
                  Automated Ordering Workflow
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Multi-step checkout with coupon validation, tax rate determination, and immediate provisioning job creation upon payment confirmation.
                </p>
              </div>

              <div className="p-5 space-y-1.5 sm:border-r sm:border-[var(--line)]">
                <div className="text-[var(--text)] font-medium text-sm">
                  Customer Infrastructure Console
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Instance controls including restart, root password resets, VNC console access, PTR reverse DNS management, and real-time bandwidth metrics.
                </p>
              </div>

              <div className="p-5 space-y-1.5">
                <div className="text-[var(--text)] font-medium text-sm">
                  Authentik OIDC Single Sign-On
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  PKCE OAuth2 authentication with multi-factor authentication (TOTP/WebAuthn) and centralized identity federation across the VaultScope suite.
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
                    <th className="px-4 py-2.5">Specification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)] text-[var(--text-secondary)] bg-[var(--bg-card)]">
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-[var(--text)]">UI Architecture</td>
                    <td className="px-4 py-2.5 font-mono">Modern SPA (v19)</td>
                    <td className="px-4 py-2.5">Functional components with hooks and lazy-loaded routes</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-[var(--text)]">Build Tool</td>
                    <td className="px-4 py-2.5 font-mono">Vite 8</td>
                    <td className="px-4 py-2.5">TypeScript compilation and code-splitting</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-[var(--text)]">Styling</td>
                    <td className="px-4 py-2.5 font-mono">Tailwind CSS v4</td>
                    <td className="px-4 py-2.5">OKLCH color space with strict dark/light neutral palette</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-[var(--text)]">Web Server</td>
                    <td className="px-4 py-2.5 font-mono">Caddy 2.7+</td>
                    <td className="px-4 py-2.5">Automated ACME TLS, HTTP/3, and SPA index fallback</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Host Requirements */}
          <section id="prerequisites" className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">Host Requirements</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--text-secondary)]">
              <li>Operating System: Ubuntu 22.04 / 24.04 LTS, Debian 12, or AlmaLinux 9</li>
              <li>CPU & RAM: Minimum 1 vCPU, 512 MB RAM (1 GB recommended for production builds)</li>
              <li>Network: Inbound ports 80 (HTTP) and 443 (HTTPS) accessible</li>
              <li>DNS: A / AAAA record pointing to the server public IP address</li>
            </ul>

            <Callout type="tip" title="Build Environment Gotcha">
              Because Vite substitutes <code className="text-[var(--text)] font-mono">VITE_*</code> environment variables at compilation time, dynamic values must be passed as build arguments during <code className="text-[var(--text)] font-mono">docker build</code> rather than injected at runtime.
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
