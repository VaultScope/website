import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Layers, 
  Zap, 
  Shield, 
  ArrowRight, 
  Network, 
  KeyRound, 
  Code2, 
  Terminal, 
  CheckCircle2,
  Lock,
  Server,
  HardDrive,
  CreditCard,
  HelpCircle,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { DocPagination } from './components/DocPagination';

export const DocsOverview = () => {
  const location = useLocation();
  const isGerman = location.pathname.startsWith('/de');
  const getPath = (path: string) => isGerman ? `/de${path}` : path;

  useEffect(() => {
    document.title = 'Documentation Overview — VaultScope';
  }, []);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-border pb-8">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-mono uppercase tracking-widest text-foreground/50">Documentation Hub</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
          VaultScope Ecosystem Documentation
        </h1>
        <p className="text-base text-foreground/70 font-light max-w-3xl leading-relaxed">
          Comprehensive documentation covering the VaultScope ecosystem, including customer guides for Cloud VPS, SFTP, and Bare-Metal, the VAMOS API backend, and the CAMOS administrative panel.
        </p>
      </div>

      {/* Customer Guides Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase font-mono tracking-wider text-foreground/50 font-semibold flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Customer Knowledge Base & How-To Guides</span>
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border text-foreground/50">
            For All Customers
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 not-prose">
          <Link
            to={getPath('/docs/customer/getting-started')}
            className="p-5 rounded-lg border border-border bg-foreground/[0.01] hover:border-foreground/30 hover:bg-foreground/[0.03] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded bg-foreground/5 flex items-center justify-center mb-3 text-blue-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:underline">
                Getting Started & Security
              </h3>
              <p className="text-xs text-foreground/60 leading-relaxed mb-4">
                Account creation, email verification, 2FA/TOTP authenticator setup, and German data sovereignty.
              </p>
            </div>
            <div className="flex items-center text-xs text-foreground/50 group-hover:text-foreground font-mono transition-colors">
              <span>Read guide</span>
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to={getPath('/docs/customer/vps')}
            className="p-5 rounded-lg border border-border bg-foreground/[0.01] hover:border-foreground/30 hover:bg-foreground/[0.03] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded bg-foreground/5 flex items-center justify-center mb-3 text-emerald-400 group-hover:scale-110 transition-transform">
                <Server className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:underline">
                Cloud VPS Management
              </h3>
              <p className="text-xs text-foreground/60 leading-relaxed mb-4">
                Ed25519 SSH keys, power controls, in-browser noVNC console with clipboard pasting, and OS reinstallation.
              </p>
            </div>
            <div className="flex items-center text-xs text-foreground/50 group-hover:text-foreground font-mono transition-colors">
              <span>Read guide</span>
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to={getPath('/docs/customer/sftp')}
            className="p-5 rounded-lg border border-border bg-foreground/[0.01] hover:border-foreground/30 hover:bg-foreground/[0.03] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded bg-foreground/5 flex items-center justify-center mb-3 text-purple-400 group-hover:scale-110 transition-transform">
                <HardDrive className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:underline">
                Sovereign SFTP Storage
              </h3>
              <p className="text-xs text-foreground/60 leading-relaxed mb-4">
                Connect via FileZilla, Cyberduck, WinSCP, and configure automated cron backups with rclone.
              </p>
            </div>
            <div className="flex items-center text-xs text-foreground/50 group-hover:text-foreground font-mono transition-colors">
              <span>Read guide</span>
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to={getPath('/docs/customer/dedicated')}
            className="p-5 rounded-lg border border-border bg-foreground/[0.01] hover:border-foreground/30 hover:bg-foreground/[0.03] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded bg-foreground/5 flex items-center justify-center mb-3 text-amber-400 group-hover:scale-110 transition-transform">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:underline">
                Dedicated Bare-Metal Servers
              </h3>
              <p className="text-xs text-foreground/60 leading-relaxed mb-4">
                Out-of-band IPMI/KVM HTML5 consoles, virtual ISO mounting, automated PXE unattended reinstallation.
              </p>
            </div>
            <div className="flex items-center text-xs text-foreground/50 group-hover:text-foreground font-mono transition-colors">
              <span>Read guide</span>
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to={getPath('/docs/customer/billing')}
            className="p-5 rounded-lg border border-border bg-foreground/[0.01] hover:border-foreground/30 hover:bg-foreground/[0.03] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded bg-foreground/5 flex items-center justify-center mb-3 text-emerald-400 group-hover:scale-110 transition-transform">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:underline">
                Billing, VAT & GoBD Invoices
              </h3>
              <p className="text-xs text-foreground/60 leading-relaxed mb-4">
                GoBD compliance, DIN 5008 standards, 19% VAT & EU B2B reverse charge, vector PDF invoice downloads.
              </p>
            </div>
            <div className="flex items-center text-xs text-foreground/50 group-hover:text-foreground font-mono transition-colors">
              <span>Read guide</span>
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to={getPath('/docs/customer/support')}
            className="p-5 rounded-lg border border-border bg-foreground/[0.01] hover:border-foreground/30 hover:bg-foreground/[0.03] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded bg-foreground/5 flex items-center justify-center mb-3 text-blue-400 group-hover:scale-110 transition-transform">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:underline">
                Support Desk & SLAs
              </h3>
              <p className="text-xs text-foreground/60 leading-relaxed mb-4">
                Priority severity SLAs, real-time ticket streaming, attaching diagnostic images up to 10MB, email alerts.
              </p>
            </div>
            <div className="flex items-center text-xs text-foreground/50 group-hover:text-foreground font-mono transition-colors">
              <span>Read guide</span>
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Featured Architecture & Guides */}
      <div className="space-y-4">
        <h2 className="text-xs uppercase font-mono tracking-wider text-foreground/50 font-semibold">
          Platform Architecture & Operations
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 not-prose">
          <Link
            to={getPath('/docs/architecture')}
            className="p-4 rounded-lg border border-border bg-foreground/[0.01] hover:border-foreground/30 hover:bg-foreground/[0.03] transition-all group"
          >
            <Network className="w-4 h-4 text-foreground/60 mb-3 group-hover:text-foreground transition-colors" />
            <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:underline">System Architecture</h3>
            <p className="text-xs text-foreground/60 leading-relaxed">
              Multi-tier data flows, PostgreSQL queues, and Hetzner connectors.
            </p>
          </Link>

          <Link
            to={getPath('/docs/authentik')}
            className="p-4 rounded-lg border border-border bg-foreground/[0.01] hover:border-foreground/30 hover:bg-foreground/[0.03] transition-all group"
          >
            <KeyRound className="w-4 h-4 text-foreground/60 mb-3 group-hover:text-foreground transition-colors" />
            <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:underline">Authentik OIDC SSO</h3>
            <p className="text-xs text-foreground/60 leading-relaxed">
              PKCE authorization flows, group scopes, and staff RBAC roles.
            </p>
          </Link>

          <Link
            to={getPath('/docs/api')}
            className="p-4 rounded-lg border border-border bg-foreground/[0.01] hover:border-foreground/30 hover:bg-foreground/[0.03] transition-all group"
          >
            <Code2 className="w-4 h-4 text-foreground/60 mb-3 group-hover:text-foreground transition-colors" />
            <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:underline">REST API Reference</h3>
            <p className="text-xs text-foreground/60 leading-relaxed">
              Endpoints, headers, error representations, and rate limits.
            </p>
          </Link>

          <Link
            to={getPath('/docs/runbooks')}
            className="p-4 rounded-lg border border-border bg-foreground/[0.01] hover:border-foreground/30 hover:bg-foreground/[0.03] transition-all group"
          >
            <Terminal className="w-4 h-4 text-foreground/60 mb-3 group-hover:text-foreground transition-colors" />
            <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:underline">Production Runbooks</h3>
            <p className="text-xs text-foreground/60 leading-relaxed">
              Database backups, job triage, SSL ACME, and incident checklists.
            </p>
          </Link>
        </div>
      </div>

      {/* Security Section */}
      <div className="p-5 rounded-lg border border-border bg-foreground/[0.01] flex flex-col sm:flex-row items-start gap-4 not-prose">
        <div className="w-9 h-9 rounded-md bg-foreground/5 flex items-center justify-center shrink-0">
          <Lock className="w-4 h-4 text-foreground" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Security First Approach</h3>
          <p className="text-xs text-foreground/70 leading-relaxed max-w-3xl">
            Zero-trust architecture enforces AES-256-GCM encryption for cloud provider API tokens, strict PKCE OIDC authorization flows, and isolated database boundaries between public portals and background runners.
          </p>
        </div>
      </div>

      {/* Core Component Lifecycle Cards */}
      <div className="space-y-4">
        <h2 className="text-xs uppercase font-mono tracking-wider text-foreground/50 font-semibold">
          Core Projects & Services
        </h2>
        <div className="grid md:grid-cols-3 gap-6 not-prose">
          {/* Storefront Card */}
          <div className="p-5 rounded-lg border border-border bg-foreground/[0.01] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-md bg-foreground/5 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-foreground" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border text-foreground/50">
                  React 19 / Caddy
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">VaultScope Storefront</h3>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  High-converting public storefront and authenticated customer console for ordering and managing infrastructure.
                </p>
              </div>
              <div className="space-y-2 text-xs text-foreground/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Automated shell & Docker deployment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Dynamic catalog & Stripe Elements checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Native German / English i18n routing</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex flex-col gap-2">
              <Link
                to={getPath('/docs/projects/storefront')}
                className="inline-flex items-center justify-between px-3 py-2 text-xs font-medium border border-border rounded-md hover:bg-foreground/5 transition-colors text-foreground"
              >
                <span>View Storefront Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <div className="flex items-center justify-between text-[11px] font-mono text-foreground/50 px-1">
                <Link to={getPath('/docs/projects/storefront/install')} className="hover:text-foreground">Install</Link>
                <span>&bull;</span>
                <Link to={getPath('/docs/projects/storefront/config')} className="hover:text-foreground">Config</Link>
                <span>&bull;</span>
                <Link to={getPath('/docs/projects/storefront/lifecycle')} className="hover:text-foreground">Updates</Link>
              </div>
            </div>
          </div>

          {/* VAMOS Card */}
          <div className="p-5 rounded-lg border border-border bg-foreground/[0.01] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-md bg-foreground/5 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-foreground" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border text-foreground/50">
                  Rust / Axum
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">VAMOS Backend API</h3>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Asynchronous orchestration engine, REST API gateway, and Tokio background worker for server automation.
                </p>
              </div>
              <div className="space-y-2 text-xs text-foreground/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Tokio background job worker</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>SQLx transactional schema migrations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>AES-256-GCM encrypted provider tokens</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex flex-col gap-2">
              <Link
                to={getPath('/docs/projects/vamos')}
                className="inline-flex items-center justify-between px-3 py-2 text-xs font-medium border border-border rounded-md hover:bg-foreground/5 transition-colors text-foreground"
              >
                <span>View VAMOS Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <div className="flex items-center justify-between text-[11px] font-mono text-foreground/50 px-1">
                <Link to={getPath('/docs/projects/vamos/install')} className="hover:text-foreground">Install</Link>
                <span>&bull;</span>
                <Link to={getPath('/docs/projects/vamos/config')} className="hover:text-foreground">Config</Link>
                <span>&bull;</span>
                <Link to={getPath('/docs/projects/vamos/lifecycle')} className="hover:text-foreground">Updates</Link>
              </div>
            </div>
          </div>

          {/* CAMOS Card */}
          <div className="p-5 rounded-lg border border-border bg-foreground/[0.01] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-md bg-foreground/5 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-foreground" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border text-foreground/50">
                  React 19 / Nginx
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">CAMOS Admin Panel</h3>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Internal control plane for engineering, finance, and support teams to govern infrastructure and billing.
                </p>
              </div>
              <div className="space-y-2 text-xs text-foreground/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Real-time job queue retry & inspection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Cloud provider connector management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Staff RBAC with Authentik groups</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex flex-col gap-2">
              <Link
                to={getPath('/docs/projects/camos')}
                className="inline-flex items-center justify-between px-3 py-2 text-xs font-medium border border-border rounded-md hover:bg-foreground/5 transition-colors text-foreground"
              >
                <span>View CAMOS Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <div className="flex items-center justify-between text-[11px] font-mono text-foreground/50 px-1">
                <Link to={getPath('/docs/projects/camos/install')} className="hover:text-foreground">Install</Link>
                <span>&bull;</span>
                <Link to={getPath('/docs/projects/camos/config')} className="hover:text-foreground">Config</Link>
                <span>&bull;</span>
                <Link to={getPath('/docs/projects/camos/lifecycle')} className="hover:text-foreground">Updates</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DocPagination
        next={{ title: 'System Architecture', path: '/docs/architecture' }}
      />
    </div>
  );
};
