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
  Shield,
  Users,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const DocsCamos = () => {
  const location = useLocation();
  const isGerman = location.pathname.startsWith('/de');
  const getPath = (path: string) => isGerman ? `/de${path}` : path;

  const [installTab, setInstallTab] = useState<'automated' | 'docker' | 'local'>('automated');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "CAMOS Documentation — VaultScope";
  }, []);

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const snippetAutomated = `curl -fsSL https://raw.githubusercontent.com/VaultScope/website/dev/installer.sh | sudo bash`;

  const snippetDocker = `# 1. Clone repository
git clone https://github.com/VaultScope/camos.git
cd camos

# 2. Build container with production build arguments
docker build -t vaultscope-admin \\
  --build-arg VITE_API_URL=https://api.your-domain.com/api \\
  --build-arg VITE_AUTHENTIK_URL=https://auth.your-domain.com \\
  --build-arg VITE_OIDC_CLIENT_ID=vaultscope-admin \\
  --build-arg VITE_OIDC_REDIRECT_URI=https://admin.your-domain.com/auth/callback .

# 3. Run container
docker run -d \\
  --name vaultscope-admin \\
  --restart unless-stopped \\
  -p 8081:80 \\
  vaultscope-admin`;

  const snippetLocal = `# 1. Clone repository
git clone https://github.com/VaultScope/camos.git
cd camos

# 2. Install dependencies
npm install

# 3. Setup configuration
cp .env.example .env

# 4. Start local Vite development server
npm run dev`;

  const snippetAdminSql = `-- Connect to PostgreSQL container:
-- docker exec -it vaultscope-postgres psql -U vaultscope -d vaultscope

INSERT INTO staff (user_id, role, permissions, is_active)
VALUES (
  (SELECT id FROM users WHERE email = 'admin@your-domain.com'),
  'superadmin',
  '{"can_manage_products": true, "can_manage_billing": true, "can_manage_infrastructure": true, "can_view_logs": true}'::jsonb,
  true
)
ON CONFLICT (user_id) DO UPDATE 
SET role = 'superadmin', is_active = true;`;

  const snippetEnv = `# API Backend Endpoint
VITE_API_URL=https://api.vaultscope.de/api

# Authentik OIDC Admin Client
VITE_AUTHENTIK_URL=https://auth.vaultscope.de
VITE_OIDC_CLIENT_ID=vaultscope-admin
VITE_OIDC_REDIRECT_URI=https://admin.vaultscope.de/auth/callback`;

  return (
    <div className="space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-foreground/50 select-none not-prose">
        <Link to={getPath('/docs')} className="hover:text-foreground transition-colors">Docs</Link>
        <ChevronRight className="w-3 h-3 text-foreground/30" />
        <Link to={getPath('/docs/projects')} className="hover:text-foreground transition-colors">Projects</Link>
        <ChevronRight className="w-3 h-3 text-foreground/30" />
        <span className="text-foreground font-medium">CAMOS</span>
      </nav>

      {/* Page Title & Badges */}
      <div className="space-y-4 not-prose border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Shield className="w-3.5 h-3.5" /> Operations Portal
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-foreground/5 text-foreground/60 border border-border">
            v1.0.0
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-foreground/5 text-foreground/60 border border-border">
            Port: 8081 &rarr; 80
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Staff Only
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-foreground">
          CAMOS (Admin Panel)
        </h1>
        <p className="text-lg text-foreground/60 font-light max-w-3xl leading-relaxed">
          Comprehensive lifecycle documentation for the Client Administration & Management Operations System (CAMOS). Covers management plane architecture, staff RBAC configuration, containerized deployment, upgrades, and teardown.
        </p>

        {/* Links bar */}
        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-foreground/60">
          <a 
            href="https://github.com/VaultScope/camos" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <span>GitHub Repository</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <span>•</span>
          <span>Runtime: Node 22+ / Nginx Alpine</span>
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
        <a href="#admin-setup" className="px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors">
          Admin Setup
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
          <Server className="w-6 h-6 text-foreground/70" /> Overview & Architecture
        </h2>
        <p>
          CAMOS serves as the internal control plane for the entire VaultScope platform. Built with React 19, Vite 8, and Tailwind CSS 4, it empowers administrative staff and customer support engineers to manage users, products, infrastructure instances, and billing operations without requiring direct access to the database or production clusters.
        </p>

        <div className="grid md:grid-cols-2 gap-4 not-prose">
          <div className="p-5 border border-border rounded-xl bg-foreground/[0.01]">
            <h3 className="text-base font-semibold text-foreground mb-1.5">Product & Catalog Management</h3>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Administrators can create, edit, deprecate, or re-tier products (VPS, Dedicated Servers, ODP configurations). Products are mapped directly to upstream cloud provider definitions (e.g. Hetzner Cloud server types, OVH hardware IDs).
            </p>
          </div>
          <div className="p-5 border border-border rounded-xl bg-foreground/[0.01]">
            <h3 className="text-base font-semibold text-foreground mb-1.5">Service & Infrastructure Oversight</h3>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Provides a global dashboard of deployed infrastructure across all customer accounts. Staff can view instance telemetry, execute administrative overrides (power off, hard reboot, rebuild, manual suspension), and inspect background JobRunner queue status.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 not-prose">
          <div className="p-5 border border-border rounded-xl bg-foreground/[0.01]">
            <h3 className="text-base font-semibold text-foreground mb-1.5 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" /> Support Desk & Communication
            </h3>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Integrated ticketing portal with rich-text markdown support (via TipTap editor) for responding to customer inquiries, tracking abuse complaints, and adding confidential internal staff notes.
            </p>
          </div>
          <div className="p-5 border border-border rounded-xl bg-foreground/[0.01]">
            <h3 className="text-base font-semibold text-foreground mb-1.5 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" /> Financials & RBAC Enforcement
            </h3>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Real-time MRR and invoice analytics powered by Recharts. Staff access is governed by VAMOS role-based access control, ensuring support staff cannot modify billing or provider credentials without explicit permissions.
            </p>
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
                <td className="p-3 text-foreground/70">Local compilation and development server runtime</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-foreground">Docker & Compose</td>
                <td className="p-3 font-mono">Docker 24+, Compose v2</td>
                <td className="p-3 text-foreground/70">Production containerized deployment</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-foreground">VAMOS API</td>
                <td className="p-3 font-mono">v0.1.0+</td>
                <td className="p-3 text-foreground/70">Backend API for RBAC validation and admin queries</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-foreground">Authentik OIDC</td>
                <td className="p-3 font-mono">Client ID: vaultscope-admin</td>
                <td className="p-3 text-foreground/70">Dedicated administrative staff OAuth2/OIDC client</td>
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
                When executing the production installer on your host, CAMOS is configured automatically with custom SSL certificates, Nginx reverse proxy on <code className="font-mono text-[11px] text-foreground">admin.your-domain.com</code>, and production environment bindings:
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
                    onClick={() => copyCode(snippetAutomated, 'install-auto-camos')}
                    className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-zinc-800 text-zinc-300 transition-colors"
                  >
                    {copiedId === 'install-auto-camos' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[11px]">{copiedId === 'install-auto-camos' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 text-zinc-200 overflow-x-auto"><code>{snippetAutomated}</code></pre>
              </div>
            </div>
          )}

          {installTab === 'docker' && (
            <div className="space-y-3">
              <p className="text-xs text-foreground/70">
                CAMOS uses a multi-stage Docker build (<code className="font-mono text-[11px]">node:22-alpine</code> to compile assets, <code className="font-mono text-[11px]">nginx:alpine</code> to serve them). Build arguments must be provided:
              </p>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden text-xs font-mono shadow-sm">
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/90 text-zinc-400">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-zinc-300 text-[11px]">Dockerfile Build &amp; Run</span>
                  </div>
                  <button
                    onClick={() => copyCode(snippetDocker, 'install-docker-camos')}
                    className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-zinc-800 text-zinc-300 transition-colors"
                  >
                    {copiedId === 'install-docker-camos' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[11px]">{copiedId === 'install-docker-camos' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 text-zinc-200 overflow-x-auto leading-relaxed"><code>{snippetDocker}</code></pre>
              </div>
            </div>
          )}

          {installTab === 'local' && (
            <div className="space-y-3">
              <p className="text-xs text-foreground/70">
                For local engineering and dashboard feature development:
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
                    onClick={() => copyCode(snippetLocal, 'install-local-camos')}
                    className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-zinc-800 text-zinc-300 transition-colors"
                  >
                    {copiedId === 'install-local-camos' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[11px]">{copiedId === 'install-local-camos' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 text-zinc-200 overflow-x-auto leading-relaxed"><code>{snippetLocal}</code></pre>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Initial Administrator Setup */}
      <section id="admin-setup" className="space-y-4 pt-4 border-t border-border">
        <h2 className="text-2xl font-medium tracking-tight text-foreground flex items-center gap-2.5">
          <UserCheck className="w-6 h-6 text-foreground/70" /> Initial Administrator Setup
        </h2>
        <p className="text-sm text-foreground/70">
          After logging in via Authentik for the first time, promote your user account to have the <code className="font-mono text-xs">superadmin</code> role inside the PostgreSQL database:
        </p>
        <div className="not-prose space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-foreground/60">
            <span>SQL Permission Grant</span>
            <button
              onClick={() => copyCode(snippetAdminSql, 'admin-sql')}
              className="flex items-center gap-1 text-xs hover:text-foreground transition-colors"
            >
              {copiedId === 'admin-sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'admin-sql' ? 'Copied' : 'Copy SQL'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 text-xs font-mono overflow-x-auto leading-relaxed">
            <code>{snippetAdminSql}</code>
          </pre>
        </div>
      </section>

      {/* Configuration Reference */}
      <section id="configuration" className="space-y-4 pt-4 border-t border-border">
        <h2 className="text-2xl font-medium tracking-tight text-foreground flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-foreground/70" /> Configuration Reference (`.env`)
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
                <td className="p-3 font-mono text-foreground/70">vaultscope-admin</td>
                <td className="p-3 text-foreground/70">OIDC client ID configured for administrative staff in Authentik.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-foreground font-semibold">VITE_OIDC_REDIRECT_URI</td>
                <td className="p-3 text-emerald-500 font-semibold font-mono">Yes</td>
                <td className="p-3 font-mono text-foreground/70">https://admin.vaultscope.de/auth/callback</td>
                <td className="p-3 text-foreground/70">Authorized OAuth2 redirect URI matching Authentik admin client.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Copyable .env Template */}
        <div className="not-prose space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-foreground/60">
            <span>Example .env Template</span>
            <button
              onClick={() => copyCode(snippetEnv, 'env-camos-template')}
              className="flex items-center gap-1 text-xs hover:text-foreground transition-colors"
            >
              {copiedId === 'env-camos-template' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'env-camos-template' ? 'Copied' : 'Copy Template'}</span>
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
            <span className="text-zinc-500 font-medium"># 1. Nginx Container Status Check</span>
            <p className="text-zinc-300">docker exec vaultscope-admin wget -qO- http://127.0.0.1:80</p>
            <p className="text-emerald-400 font-medium"># Returns index.html content</p>
          </div>
          <div className="p-4 bg-zinc-950 text-zinc-200 border border-zinc-800 rounded-xl space-y-2">
            <span className="text-zinc-500 font-medium"># 2. HTTP Response Code Check</span>
            <p className="text-zinc-300">curl -I https://admin.your-domain.com</p>
            <p className="text-emerald-400 font-medium"># HTTP/2 200 OK</p>
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
              <h3 className="text-sm font-semibold text-foreground">Automated Production Update</h3>
            </div>
            <p className="text-xs text-foreground/70">
              The automated updater snapshots the current deployment, pulls the latest changes from the release branch, rebuilds Docker containers without cache, and verifies container uptime:
            </p>
            <pre className="p-3 bg-zinc-950 text-zinc-200 rounded-lg border border-zinc-800 font-mono text-xs overflow-x-auto">
sudo /opt/vaultscope/update.sh --branch=dev
            </pre>
          </div>

          <div className="p-5 rounded-xl border border-border bg-foreground/[0.01] space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-foreground/10 text-foreground flex items-center justify-center text-xs font-bold">2</span>
              <h3 className="text-sm font-semibold text-foreground">Manual Container Upgrade</h3>
            </div>
            <pre className="p-3 bg-zinc-950 text-zinc-200 rounded-lg border border-zinc-800 font-mono text-xs overflow-x-auto leading-relaxed">{`cd /opt/vaultscope
cd camos && git pull origin dev && cd ..
docker-compose -f docker-compose.production.yml build --no-cache admin
docker-compose -f docker-compose.production.yml up -d --no-deps admin`}</pre>
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
            <h3 className="text-sm font-semibold text-foreground">Complete System Teardown</h3>
            <p className="text-xs text-foreground/70">
              Removes all containers, services, and Nginx configurations across the platform:
            </p>
            <pre className="p-3 bg-zinc-950 text-zinc-200 rounded-lg border border-zinc-800 font-mono text-xs overflow-x-auto">
sudo /opt/vaultscope/uninstall.sh
            </pre>
          </div>

          <div className="p-5 rounded-xl border border-border bg-foreground/[0.01] space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Manual Standalone Cleanup</h3>
            <pre className="p-3 bg-zinc-950 text-zinc-200 rounded-lg border border-zinc-800 font-mono text-xs overflow-x-auto leading-relaxed">{`# 1. Stop and remove container
docker stop vaultscope-admin && docker rm vaultscope-admin

# 2. Remove Nginx site configuration
sudo rm -f /etc/nginx/sites-enabled/admin.your-domain.com
sudo rm -f /etc/nginx/sites-available/admin.your-domain.com
sudo systemctl reload nginx

# 3. Clean files
sudo rm -rf /opt/vaultscope/camos`}</pre>
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
            <h4 className="text-xs font-semibold text-foreground mb-1">"Unauthorized" error after successful Authentik login</h4>
            <p className="text-xs text-foreground/70 leading-relaxed">
              The user has authenticated with Authentik, but the VAMOS API cannot find an active entry for that user in the <code className="font-mono text-[11px]">staff</code> database table. Run the SQL snippet above to grant the staff role.
            </p>
          </div>
          <div className="p-4 border border-border rounded-xl bg-foreground/[0.01]">
            <h4 className="text-xs font-semibold text-foreground mb-1">CORS errors connecting to VAMOS API</h4>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Ensure that <code className="font-mono text-[11px]">https://admin.your-domain.com</code> (or <code className="font-mono text-[11px]">http://localhost:5173</code> in dev) is listed in <code className="font-mono text-[11px]">CORS_ORIGINS</code> within <code className="font-mono text-[11px]">vamos/.env</code>.
            </p>
          </div>
          <div className="p-4 border border-border rounded-xl bg-foreground/[0.01]">
            <h4 className="text-xs font-semibold text-foreground mb-1">404 Not Found on browser reload</h4>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Confirm that your Nginx site configuration or container config contains <code className="font-mono text-[11px]">try_files $uri $uri/ /index.html;</code> to support client-side routing.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
