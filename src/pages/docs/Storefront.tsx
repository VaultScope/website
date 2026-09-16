import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Download, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  Settings, 
  Copy,
  Check,
  Globe,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Info
} from 'lucide-react';

export const DocsStorefront = () => {
  const location = useLocation();
  const isGerman = location.pathname.startsWith('/de');
  const getPath = (path: string) => isGerman ? `/de${path}` : path;

  const [installTab, setInstallTab] = useState<'automated' | 'docker' | 'local'>('automated');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Customer Experience Documentation — VaultScope";
  }, []);

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const snippetAutomated = `curl -fsSL https://raw.githubusercontent.com/VaultScope/website/dev/installer.sh | sudo bash`;

  const snippetDocker = `# 1. Clone repository
git clone https://github.com/VaultScope/website.git
cd website

# 2. Build Docker container with build arguments
docker build -t vaultscope-storefront \\
  --build-arg VITE_API_URL=https://api.your-domain.com/api \\
  --build-arg VITE_AUTHENTIK_URL=https://auth.your-domain.com \\
  --build-arg VITE_OIDC_CLIENT_ID=vaultscope-storefront \\
  --build-arg VITE_OIDC_REDIRECT_URI=https://your-domain.com/auth/callback .

# 3. Launch container with Caddy
docker run -d \\
  --name vaultscope-storefront \\
  --restart unless-stopped \\
  -p 8080:3000 \\
  vaultscope-storefront`;

  const snippetLocal = `# 1. Clone repository
git clone https://github.com/VaultScope/website.git
cd website

# 2. Install dependencies
npm install

# 3. Configure local environment file
cp .env.example .env

# 4. Start local Vite development server
npm run dev`;

  const snippetEnv = `# API Backend Endpoint
VITE_API_URL=https://api.vaultscope.de/api

# Authentik OIDC Configuration
VITE_AUTHENTIK_URL=https://auth.vaultscope.de
VITE_OIDC_CLIENT_ID=vaultscope-storefront
VITE_OIDC_REDIRECT_URI=https://vaultscope.de/auth/callback

# Optional Integrations
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here
VITE_LISTMONK_URL=https://subscribe.vaultscope.de`;

  return (
    <div className="space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-foreground/50 select-none not-prose">
        <Link to={getPath('/docs')} className="hover:text-foreground transition-colors">Docs</Link>
        <ChevronRight className="w-3 h-3 text-foreground/30" />
        <Link to={getPath('/docs/projects')} className="hover:text-foreground transition-colors">Projects</Link>
        <ChevronRight className="w-3 h-3 text-foreground/30" />
        <span className="text-foreground font-medium">Storefront</span>
      </nav>

      {/* Page Title & Badges */}
      <div className="space-y-4 not-prose border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Globe className="w-3.5 h-3.5" /> Client Portal
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-foreground/5 text-foreground/60 border border-border">
            v1.0.0
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-foreground/5 text-foreground/60 border border-border">
            Port: 8080 &rarr; 3000
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Production Ready
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-foreground">
          Customer Experience (Storefront)
        </h1>
        <p className="text-lg text-foreground/60 font-light max-w-3xl leading-relaxed">
          Comprehensive lifecycle guide for the customer-facing web application. Learn how to install, build with Caddy, configure environment parameters, perform zero-downtime upgrades, and safely uninstall.
        </p>

        {/* Links bar */}
        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-foreground/60">
          <a 
            href="https://github.com/VaultScope/website" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <span>GitHub Repository</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <span>•</span>
          <span>Runtime: Node 22+ / Caddy 2</span>
          <span>•</span>
          <span>License: MIT</span>
        </div>
      </div>

      {/* Anchor Navigation Bar */}
      <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-border bg-foreground/[0.02] not-prose">
        <a href="#overview" className="px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors">
          Overview
        </a>
        <a href="#prerequisites" className="px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors">
          Prerequisites
        </a>
        <a href="#installation" className="px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors">
          Installation
        </a>
        <a href="#configuration" className="px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors">
          Configuration
        </a>
        <a href="#verification" className="px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors">
          Health Checks
        </a>
        <a href="#upgrading" className="px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors">
          Upgrading
        </a>
        <a href="#uninstallation" className="px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors">
          Uninstallation
        </a>
      </div>

      {/* Overview Section */}
      <section id="overview" className="space-y-6 pt-2">
        <h2 className="text-2xl font-medium tracking-tight text-foreground flex items-center gap-2.5">
          <Server className="w-6 h-6 text-foreground/70" /> Overview & Capabilities
        </h2>
        <p>
          The VaultScope Storefront is built using modern web technologies including React 19, Vite 8, client-side routing, and Tailwind CSS 4. It is designed to be exceptionally responsive, accessible, and fast, offering a frictionless user experience from product exploration to post-deployment management.
        </p>

        <div className="grid md:grid-cols-2 gap-4 not-prose">
          <div className="p-5 border border-border rounded-xl bg-foreground/[0.01]">
            <h3 className="text-base font-semibold text-foreground mb-1.5">Dynamic Product Catalog</h3>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Queries the VAMOS API in real-time to display the most up-to-date product configurations, stock availability, and dynamic pricing tiers across Cloud (VPS), Dedicated Servers, and On-Demand Provisioning (ODP) instances.
            </p>
          </div>
          <div className="p-5 border border-border rounded-xl bg-foreground/[0.01]">
            <h3 className="text-base font-semibold text-foreground mb-1.5">Automated Ordering Workflow</h3>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Provides an interactive step-by-step configuration wizard collecting deployment parameters (operating systems, data center regions, SSH keys) and calculating final rates before completing payment securely via Stripe Elements.
            </p>
          </div>
        </div>

        {/* Admonition Box */}
        <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 text-xs text-foreground/80 flex items-start gap-3 not-prose">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-foreground block mb-0.5">Production Web Server</span>
            In production Docker containers, compiled static files are served by <strong>Caddy 2</strong> (<code className="font-mono text-[11px]">caddy:2-alpine</code>). Caddy automatically serves compressed gzip assets, proxies newsletter requests, and rewrites non-file URLs to <code className="font-mono text-[11px]">/index.html</code> for single-page routing.
          </div>
        </div>
      </section>

      {/* Prerequisites */}
      <section id="prerequisites" className="space-y-4 pt-4 border-t border-border">
        <h2 className="text-2xl font-medium tracking-tight text-foreground flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-foreground/70" /> System Prerequisites
        </h2>
        <div className="overflow-x-auto not-prose">
          <table className="w-full text-left text-xs border-collapse border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-foreground/5 border-b border-border font-mono text-foreground">
                <th className="p-3">Component</th>
                <th className="p-3">Requirement</th>
                <th className="p-3">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-3 font-mono text-foreground">Node.js & npm</td>
                <td className="p-3 font-mono">Node 22.x+ / npm 10.x+</td>
                <td className="p-3 text-foreground/70">Required for local compilation, testing, and Vite dev server</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-foreground">Docker & Compose</td>
                <td className="p-3 font-mono">Docker 24+, Compose v2</td>
                <td className="p-3 text-foreground/70">Container runtime for production deployments</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-foreground">VAMOS API</td>
                <td className="p-3 font-mono">v0.1.0+</td>
                <td className="p-3 text-foreground/70">Backend service for catalog queries, auth sessions, and orders</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-foreground">Authentik OIDC</td>
                <td className="p-3 font-mono">Client ID: vaultscope-storefront</td>
                <td className="p-3 text-foreground/70">OAuth2/OIDC provider managing customer logins</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Installation Methods */}
      <section id="installation" className="space-y-6 pt-4 border-t border-border">
        <h2 className="text-2xl font-medium tracking-tight text-foreground flex items-center gap-2.5">
          <Download className="w-6 h-6 text-foreground/70" /> Installation Methods
        </h2>

        {/* Tab Switcher */}
        <div className="not-prose space-y-4">
          <div className="flex border-b border-border gap-2 text-xs font-medium">
            <button
              onClick={() => setInstallTab('automated')}
              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
                installTab === 'automated'
                  ? 'border-foreground text-foreground font-semibold'
                  : 'border-transparent text-foreground/50 hover:text-foreground'
              }`}
            >
              1. Automated Installer (Production)
            </button>
            <button
              onClick={() => setInstallTab('docker')}
              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
                installTab === 'docker'
                  ? 'border-foreground text-foreground font-semibold'
                  : 'border-transparent text-foreground/50 hover:text-foreground'
              }`}
            >
              2. Standalone Docker
            </button>
            <button
              onClick={() => setInstallTab('local')}
              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
                installTab === 'local'
                  ? 'border-foreground text-foreground font-semibold'
                  : 'border-transparent text-foreground/50 hover:text-foreground'
              }`}
            >
              3. Local Bare-Metal Dev
            </button>
          </div>

          {installTab === 'automated' && (
            <div className="space-y-3">
              <p className="text-xs text-foreground/70">
                Recommended for dedicated servers and VPS hosts. Downloads the verified installer script, checks system resources, generates SSL certificates, configures Nginx, and launches the entire stack:
              </p>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden text-xs font-mono shadow-sm">
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/90 text-zinc-400">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-zinc-300 text-[11px]">installer.sh</span>
                  </div>
                  <button
                    onClick={() => copyCode(snippetAutomated, 'install-auto')}
                    className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-zinc-800 text-zinc-300 transition-colors"
                  >
                    {copiedId === 'install-auto' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[11px]">{copiedId === 'install-auto' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 text-zinc-200 overflow-x-auto"><code>{snippetAutomated}</code></pre>
              </div>
            </div>
          )}

          {installTab === 'docker' && (
            <div className="space-y-3">
              <p className="text-xs text-foreground/70">
                Because Vite embeds variables into frontend bundles at compilation time, pass all configuration parameters via Docker build arguments:
              </p>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden text-xs font-mono shadow-sm">
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/90 text-zinc-400">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-zinc-300 text-[11px]">Dockerfile Build & Run</span>
                  </div>
                  <button
                    onClick={() => copyCode(snippetDocker, 'install-docker')}
                    className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-zinc-800 text-zinc-300 transition-colors"
                  >
                    {copiedId === 'install-docker' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[11px]">{copiedId === 'install-docker' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 text-zinc-200 overflow-x-auto leading-relaxed"><code>{snippetDocker}</code></pre>
              </div>
            </div>
          )}

          {installTab === 'local' && (
            <div className="space-y-3">
              <p className="text-xs text-foreground/70">
                For rapid local frontend development with Hot Module Replacement (HMR):
              </p>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden text-xs font-mono shadow-sm">
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/90 text-zinc-400">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-zinc-300 text-[11px]">bash terminal</span>
                  </div>
                  <button
                    onClick={() => copyCode(snippetLocal, 'install-local')}
                    className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-zinc-800 text-zinc-300 transition-colors"
                  >
                    {copiedId === 'install-local' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[11px]">{copiedId === 'install-local' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 text-zinc-200 overflow-x-auto leading-relaxed"><code>{snippetLocal}</code></pre>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Configuration Reference */}
      <section id="configuration" className="space-y-4 pt-4 border-t border-border">
        <h2 className="text-2xl font-medium tracking-tight text-foreground flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-foreground/70" /> Environment Variables Reference
        </h2>
        <div className="overflow-x-auto not-prose">
          <table className="w-full text-left text-xs border-collapse border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-foreground/5 border-b border-border font-mono text-foreground">
                <th className="p-3">Variable</th>
                <th className="p-3">Required</th>
                <th className="p-3">Example Value</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-3 font-mono text-foreground font-semibold">VITE_API_URL</td>
                <td className="p-3 text-emerald-500 font-semibold font-mono">Yes</td>
                <td className="p-3 font-mono text-foreground/70">https://api.vaultscope.de/api</td>
                <td className="p-3 text-foreground/70">Base HTTP endpoint to the VAMOS API backend.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-foreground font-semibold">VITE_AUTHENTIK_URL</td>
                <td className="p-3 text-emerald-500 font-semibold font-mono">Yes</td>
                <td className="p-3 font-mono text-foreground/70">https://auth.vaultscope.de</td>
                <td className="p-3 text-foreground/70">Authentik identity provider base issuer URL.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-foreground font-semibold">VITE_OIDC_CLIENT_ID</td>
                <td className="p-3 text-emerald-500 font-semibold font-mono">Yes</td>
                <td className="p-3 font-mono text-foreground/70">vaultscope-storefront</td>
                <td className="p-3 text-foreground/70">OIDC client ID configured for Storefront in Authentik.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-foreground font-semibold">VITE_OIDC_REDIRECT_URI</td>
                <td className="p-3 text-emerald-500 font-semibold font-mono">Yes</td>
                <td className="p-3 font-mono text-foreground/70">https://vaultscope.de/auth/callback</td>
                <td className="p-3 text-foreground/70">Authorized OAuth2 redirect URI matching Authentik client.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-foreground font-semibold">VITE_STRIPE_PUBLISHABLE_KEY</td>
                <td className="p-3 text-foreground/40 font-mono">Optional</td>
                <td className="p-3 font-mono text-foreground/70">pk_live_51...</td>
                <td className="p-3 text-foreground/70">Public Stripe publishable key for client-side card handling.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Copyable .env Template */}
        <div className="not-prose space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-foreground/60">
            <span>Example .env Template</span>
            <button
              onClick={() => copyCode(snippetEnv, 'env-template')}
              className="flex items-center gap-1 text-xs hover:text-foreground transition-colors"
            >
              {copiedId === 'env-template' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'env-template' ? 'Copied' : 'Copy Template'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 text-xs font-mono overflow-x-auto">
            <code>{snippetEnv}</code>
          </pre>
        </div>
      </section>

      {/* Verification & Health Checks */}
      <section id="verification" className="space-y-4 pt-4 border-t border-border">
        <h2 className="text-2xl font-medium tracking-tight text-foreground flex items-center gap-2.5">
          <CheckCircle2 className="w-6 h-6 text-foreground/70" /> Verification & Health Checks
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-xs font-mono not-prose">
          <div className="p-4 bg-zinc-950 text-zinc-200 border border-zinc-800 rounded-xl space-y-2">
            <span className="text-zinc-500 font-medium"># 1. Internal Caddy Container Check</span>
            <p className="text-zinc-300">docker exec vaultscope-storefront wget -qO- http://localhost:3000</p>
            <p className="text-emerald-400 font-medium"># Returns HTML payload with 200 OK</p>
          </div>
          <div className="p-4 bg-zinc-950 text-zinc-200 border border-zinc-800 rounded-xl space-y-2">
            <span className="text-zinc-500 font-medium"># 2. Public Nginx HTTPS Endpoint</span>
            <p className="text-zinc-300">curl -I https://your-domain.com</p>
            <p className="text-emerald-400 font-medium"># HTTP/2 200 OK (Strict-Transport-Security)</p>
          </div>
        </div>
      </section>

      {/* Upgrading Procedures */}
      <section id="upgrading" className="space-y-6 pt-4 border-t border-border">
        <h2 className="text-2xl font-medium tracking-tight text-foreground flex items-center gap-2.5">
          <RefreshCw className="w-6 h-6 text-foreground/70" /> Upgrading Procedures
        </h2>

        <div className="space-y-4 not-prose">
          <div className="p-5 rounded-xl border border-border bg-foreground/[0.01] space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">1</span>
              <h3 className="text-sm font-semibold text-foreground">Automated System Upgrade (Zero Downtime)</h3>
            </div>
            <p className="text-xs text-foreground/70">
              The automated updater snapshots code to <code className="font-mono text-foreground">/opt/vaultscope/backups/</code>, fetches latest Git commits, compiles with <code className="font-mono text-foreground">--no-cache</code>, and tests container health:
            </p>
            <pre className="p-3 bg-zinc-950 text-zinc-200 rounded-lg border border-zinc-800 font-mono text-xs overflow-x-auto">
sudo /opt/vaultscope/update.sh --branch=dev
            </pre>
          </div>

          <div className="p-5 rounded-xl border border-border bg-foreground/[0.01] space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-foreground/10 text-foreground flex items-center justify-center text-xs font-bold">2</span>
              <h3 className="text-sm font-semibold text-foreground">Manual Component-Only Upgrade</h3>
            </div>
            <pre className="p-3 bg-zinc-950 text-zinc-200 rounded-lg border border-zinc-800 font-mono text-xs overflow-x-auto leading-relaxed">{`cd /opt/vaultscope
cd website && git pull origin dev && cd ..
docker-compose -f docker-compose.production.yml build --no-cache storefront
docker-compose -f docker-compose.production.yml up -d --no-deps storefront`}</pre>
          </div>
        </div>
      </section>

      {/* Uninstallation Procedures */}
      <section id="uninstallation" className="space-y-6 pt-4 border-t border-border">
        <h2 className="text-2xl font-medium tracking-tight text-foreground flex items-center gap-2.5">
          <Trash2 className="w-6 h-6 text-foreground/70" /> Uninstallation Procedures
        </h2>

        <div className="space-y-4 not-prose">
          <div className="p-5 rounded-xl border border-border bg-foreground/[0.01] space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Full Platform Uninstallation</h3>
            <p className="text-xs text-foreground/70">
              To remove all Docker containers, Nginx vhosts, systemd units, and configuration while safely preserving SSL certificates:
            </p>
            <pre className="p-3 bg-zinc-950 text-zinc-200 rounded-lg border border-zinc-800 font-mono text-xs overflow-x-auto">
sudo /opt/vaultscope/uninstall.sh
            </pre>
          </div>

          <div className="p-5 rounded-xl border border-border bg-foreground/[0.01] space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Manual Standalone Cleanup</h3>
            <pre className="p-3 bg-zinc-950 text-zinc-200 rounded-lg border border-zinc-800 font-mono text-xs overflow-x-auto leading-relaxed">{`# 1. Stop and remove the container
docker stop vaultscope-storefront && docker rm vaultscope-storefront

# 2. Remove Nginx site configuration
sudo rm -f /etc/nginx/sites-enabled/your-domain.com
sudo rm -f /etc/nginx/sites-available/your-domain.com
sudo nginx -t && sudo systemctl reload nginx

# 3. Clean files
sudo rm -rf /opt/vaultscope/website`}</pre>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section id="troubleshooting" className="space-y-4 pt-4 border-t border-border">
        <h2 className="text-2xl font-medium tracking-tight text-foreground flex items-center gap-2.5">
          <AlertTriangle className="w-6 h-6 text-foreground/70" /> Troubleshooting & Common Pitfalls
        </h2>
        <div className="space-y-3 not-prose">
          <div className="p-4 border border-border rounded-xl bg-foreground/[0.01]">
            <h4 className="text-xs font-semibold text-foreground mb-1">CORS errors connecting to VAMOS API</h4>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Verify that your frontend origin (<code className="font-mono text-[11px]">https://your-domain.com</code>) is explicitly listed in <code className="font-mono text-[11px]">CORS_ORIGINS</code> within <code className="font-mono text-[11px]">vamos/.env</code>.
            </p>
          </div>
          <div className="p-4 border border-border rounded-xl bg-foreground/[0.01]">
            <h4 className="text-xs font-semibold text-foreground mb-1">404 Not Found on deep page refresh</h4>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Ensure Caddy contains <code className="font-mono text-[11px]">try_files &#123;path&#125; /index.html</code> (or Nginx contains <code className="font-mono text-[11px]">try_files $uri $uri/ /index.html;</code>) to allow client-side route handling.
            </p>
          </div>
          <div className="p-4 border border-border rounded-xl bg-foreground/[0.01]">
            <h4 className="text-xs font-semibold text-foreground mb-1">Authentik "Invalid redirect_uri"</h4>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Check that <code className="font-mono text-[11px]">VITE_OIDC_REDIRECT_URI</code> exactly matches the redirect URI registered in your Authentik storefront application.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
