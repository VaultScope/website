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
  Zap,
  Database,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export const DocsVamos = () => {
  const location = useLocation();
  const isGerman = location.pathname.startsWith('/de');
  const getPath = (path: string) => isGerman ? `/de${path}` : path;

  const [installTab, setInstallTab] = useState<'automated' | 'docker' | 'local'>('automated');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "VAMOS Documentation — VaultScope";
  }, []);

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const snippetAutomated = `curl -fsSL https://raw.githubusercontent.com/VaultScope/website/dev/installer.sh | sudo bash`;

  const snippetDocker = `# 1. Clone repository
git clone https://github.com/VaultScope/vamos.git
cd vamos

# 2. Configure environment file
cp .env.example .env

# Generate required secrets:
JWT_SECRET=$(openssl rand -base64 64)
ENCRYPTION_KEY=$(openssl rand -base64 32)

# 3. Build and launch PostgreSQL, Redis, and VAMOS API
docker-compose up -d --build

# 4. Verify API health
curl -f http://localhost:3000/api/health`;

  const snippetLocal = `# 1. Clone repository
git clone https://github.com/VaultScope/vamos.git
cd vamos

# 2. Setup configuration
cp .env.example .env

# 3. Setup PostgreSQL database and run migrations
createdb -U postgres vaultscope
cd crates/db
sqlx database create
sqlx migrate run
cd ../..

# 4. Run development server with tracing
RUST_LOG=info cargo run`;

  const snippetEnv = `# Database Configuration
DATABASE_URL=postgres://vaultscope:secret@localhost:5432/vaultscope
DB_MAX_CONNECTIONS=20

# Server Listening
HOST=0.0.0.0
PORT=3000

# Cryptographic Keys (Auto-Generated)
JWT_SECRET=your-64-byte-base64-secret-here
JWT_EXPIRATION_SECS=3600
ENCRYPTION_KEY=your-32-byte-base64-key-here

# Authentik OIDC
AUTHENTIK_ISSUER=https://auth.vaultscope.de
AUTHENTIK_CLIENT_ID_ADMIN=vaultscope-admin
AUTHENTIK_CLIENT_SECRET_ADMIN=secret-from-authentik
AUTHENTIK_CLIENT_ID_STOREFRONT=vaultscope-storefront
AUTHENTIK_CLIENT_SECRET_STOREFRONT=secret-from-authentik

# CORS Allowed Origins
CORS_ORIGINS=https://vaultscope.de,https://admin.vaultscope.de

# Redis Cache & Rate Limiting
REDIS_URL=redis://localhost:6379
JOB_POLL_INTERVAL_SECS=5
RATE_LIMIT_ANONYMOUS=60
RATE_LIMIT_AUTHENTICATED=300`;

  return (
    <div className="space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-foreground/50 select-none not-prose">
        <Link to={getPath('/docs')} className="hover:text-foreground transition-colors">Docs</Link>
        <ChevronRight className="w-3 h-3 text-foreground/30" />
        <Link to={getPath('/docs/projects')} className="hover:text-foreground transition-colors">Projects</Link>
        <ChevronRight className="w-3 h-3 text-foreground/30" />
        <span className="text-foreground font-medium">VAMOS</span>
      </nav>

      {/* Page Title & Badges */}
      <div className="space-y-4 not-prose border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Zap className="w-3.5 h-3.5" /> API & Operations
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-foreground/5 text-foreground/60 border border-border">
            v0.1.0
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-foreground/5 text-foreground/60 border border-border">
            Port: 3000
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> AGPL-3.0
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-foreground">
          VAMOS (API & Backend)
        </h1>
        <p className="text-lg text-foreground/60 font-light max-w-3xl leading-relaxed">
          Operational documentation for the VaultScope API Management & Operations System (VAMOS). Covers asynchronous task queues, PostgreSQL schema migrations, hardware connectors, zero-downtime upgrades, and standalone teardown.
        </p>

        {/* Links bar */}
        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-foreground/60">
          <a 
            href="https://github.com/VaultScope/vamos" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <span>GitHub Repository</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <span>•</span>
          <span>Runtime: Cargo / Tokio / Axum 0.8</span>
          <span>•</span>
          <span>Database: PostgreSQL 16 &amp; Redis 7</span>
        </div>
      </div>

      {/* Anchor Navigation Bar */}
      <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-border bg-foreground/[0.02] not-prose">
        <a href="#architecture" className="px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors">
          Architecture
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

      {/* Architecture Section */}
      <section id="architecture" className="space-y-6 pt-2">
        <h2 className="text-2xl font-medium tracking-tight text-foreground flex items-center gap-2.5">
          <Server className="w-6 h-6 text-foreground/70" /> Architecture Overview
        </h2>
        <p>
          VAMOS is engineered in Rust to maximize performance, guarantee memory safety without garbage collection pauses, and effortlessly handle concurrent provisioning workloads. It utilizes the Axum web framework on top of the Tokio asynchronous runtime, and SQLx for compile-time verified database operations against PostgreSQL.
        </p>

        {/* Centralized API Gateway */}
        <div className="p-5 border border-border rounded-xl bg-foreground/[0.01] space-y-3 not-prose">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-foreground/70" />
            <h3 className="text-base font-semibold text-foreground">Centralized API Gateway</h3>
          </div>
          <p className="text-xs text-foreground/70 leading-relaxed">
            VAMOS acts as the sole communication layer for the entire ecosystem. It exposes three distinct RESTful endpoint groups:
          </p>
          <ul className="text-xs text-foreground/70 space-y-1.5 list-disc pl-5 font-mono">
            <li><strong className="text-foreground">/api/public/*</strong> — Unauthenticated endpoints for product catalog queries, stock availability, and incoming payment webhooks.</li>
            <li><strong className="text-foreground">/api/customer/*</strong> — Authenticated customer endpoints for instance controls, order history, and support tickets.</li>
            <li><strong className="text-foreground">/api/admin/*</strong> — Staff-only administrative endpoints guarded by strict RBAC middleware.</li>
          </ul>
        </div>

        {/* Provisioning Engine & Crate Breakdown */}
        <div className="grid md:grid-cols-2 gap-4 not-prose">
          <div className="p-5 border border-border rounded-xl bg-foreground/[0.01]">
            <h3 className="text-base font-semibold text-foreground mb-1.5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Provisioning Engine (JobRunner)
            </h3>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Asynchronous worker daemon polling pending provisioning tasks from PostgreSQL. Decrypts provider credentials in memory using AES-256-GCM to orchestrate Hetzner Cloud, OVH, and Proxmox VE servers.
            </p>
          </div>
          <div className="p-5 border border-border rounded-xl bg-foreground/[0.01]">
            <h3 className="text-base font-semibold text-foreground mb-1.5 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-500" /> PostgreSQL &amp; Redis Cache
            </h3>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Compile-time checked models with SQLx. Redis serves as an ephemeral token cache, OIDC state validator, and distributed token-bucket rate limiter.
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
                <td className="p-3 font-mono text-foreground">Compiler Toolchain</td>
                <td className="p-3 font-mono">1.75+ (via rustup)</td>
                <td className="p-3 text-foreground/70">Compilation of the workspace crates (if bare-metal)</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-foreground">PostgreSQL</td>
                <td className="p-3 font-mono">14+ (16 recommended)</td>
                <td className="p-3 text-foreground/70">Relational data store and transactional ledger</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-foreground">Redis</td>
                <td className="p-3 font-mono">6+ (7 recommended)</td>
                <td className="p-3 text-foreground/70">Token-bucket rate limiter and OIDC state cache</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-foreground">OpenSSL</td>
                <td className="p-3 font-mono">libssl-dev / OpenSSL 3</td>
                <td className="p-3 text-foreground/70">TLS transport and cryptographic token validation</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-foreground">SQLx CLI (optional)</td>
                <td className="p-3 font-mono">0.8+</td>
                <td className="p-3 text-foreground/70">Managing offline query cache and schema migrations</td>
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
              2. Standalone Docker Compose
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
                The full-stack installer automatically provisions PostgreSQL and Redis, generates high-entropy secrets, executes SQLx schema migrations, and registers systemd monitoring:
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
                    onClick={() => copyCode(snippetAutomated, 'install-auto-vamos')}
                    className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-zinc-800 text-zinc-300 transition-colors"
                  >
                    {copiedId === 'install-auto-vamos' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[11px]">{copiedId === 'install-auto-vamos' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 text-zinc-200 overflow-x-auto"><code>{snippetAutomated}</code></pre>
              </div>
            </div>
          )}

          {installTab === 'docker' && (
            <div className="space-y-3">
              <p className="text-xs text-foreground/70">
                Spins up PostgreSQL 16, Redis 7, and builds the multi-stage Docker container (<code className="font-mono text-[11px]">rust:1-slim</code> builder + <code className="font-mono text-[11px]">debian:bookworm-slim</code> runtime):
              </p>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden text-xs font-mono shadow-sm">
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/90 text-zinc-400">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-zinc-300 text-[11px]">docker-compose.yml</span>
                  </div>
                  <button
                    onClick={() => copyCode(snippetDocker, 'install-docker-vamos')}
                    className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-zinc-800 text-zinc-300 transition-colors"
                  >
                    {copiedId === 'install-docker-vamos' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[11px]">{copiedId === 'install-docker-vamos' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 text-zinc-200 overflow-x-auto leading-relaxed"><code>{snippetDocker}</code></pre>
              </div>
            </div>
          )}

          {installTab === 'local' && (
            <div className="space-y-3">
              <p className="text-xs text-foreground/70">
                For backend development, route testing, and connector debugging:
              </p>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden text-xs font-mono shadow-sm">
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/90 text-zinc-400">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-zinc-300 text-[11px]">cargo runtime</span>
                  </div>
                  <button
                    onClick={() => copyCode(snippetLocal, 'install-local-vamos')}
                    className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-zinc-800 text-zinc-300 transition-colors"
                  >
                    {copiedId === 'install-local-vamos' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[11px]">{copiedId === 'install-local-vamos' ? 'Copied' : 'Copy'}</span>
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
          <Settings className="w-6 h-6 text-foreground/70" /> Configuration Reference (`.env`)
        </h2>
        <div className="overflow-x-auto not-prose">
          <table className="w-full text-left text-xs border-collapse border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-foreground/5 border-b border-border font-mono text-foreground">
                <th className="p-3">Variable</th>
                <th className="p-3">Required</th>
                <th className="p-3">Default / Example</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-3 font-mono text-foreground font-semibold">DATABASE_URL</td>
                <td className="p-3 text-emerald-500 font-semibold font-mono">Yes</td>
                <td className="p-3 font-mono text-foreground/70">postgres://user:pass@host:5432/db</td>
                <td className="p-3 text-foreground/70">PostgreSQL connection pool string.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-foreground font-semibold">JWT_SECRET</td>
                <td className="p-3 text-emerald-500 font-semibold font-mono">Yes</td>
                <td className="p-3 font-mono text-foreground/70">(64-byte base64 string)</td>
                <td className="p-3 text-foreground/70">Cryptographic secret for signing and verifying tokens.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-foreground font-semibold">ENCRYPTION_KEY</td>
                <td className="p-3 text-emerald-500 font-semibold font-mono">Yes</td>
                <td className="p-3 font-mono text-foreground/70">(32-byte base64 string)</td>
                <td className="p-3 text-foreground/70">AES-256-GCM symmetric key for provider credentials.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-foreground font-semibold">REDIS_URL</td>
                <td className="p-3 text-emerald-500 font-semibold font-mono">Yes</td>
                <td className="p-3 font-mono text-foreground/70">redis://localhost:6379</td>
                <td className="p-3 text-foreground/70">Redis server URL for session cache and rate-limiting.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-foreground font-semibold">AUTHENTIK_ISSUER</td>
                <td className="p-3 text-emerald-500 font-semibold font-mono">Yes</td>
                <td className="p-3 font-mono text-foreground/70">https://auth.vaultscope.de</td>
                <td className="p-3 text-foreground/70">Authentik OIDC discovery base URL.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-foreground font-semibold">CORS_ORIGINS</td>
                <td className="p-3 text-emerald-500 font-semibold font-mono">Yes</td>
                <td className="p-3 font-mono text-foreground/70">https://vaultscope.de,https://admin.vaultscope.de</td>
                <td className="p-3 text-foreground/70">Comma-separated allowed client origins.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Copyable .env Template */}
        <div className="not-prose space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-foreground/60">
            <span>Production .env Template</span>
            <button
              onClick={() => copyCode(snippetEnv, 'env-vamos-template')}
              className="flex items-center gap-1 text-xs hover:text-foreground transition-colors"
            >
              {copiedId === 'env-vamos-template' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'env-vamos-template' ? 'Copied' : 'Copy Template'}</span>
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
            <span className="text-zinc-500 font-medium"># 1. API Healthcheck Request</span>
            <p className="text-zinc-300">curl -s http://localhost:3000/api/health</p>
            <p className="text-emerald-400 font-medium font-semibold">{`{"status":"ok"}`}</p>
          </div>
          <div className="p-4 bg-zinc-950 text-zinc-200 border border-zinc-800 rounded-xl space-y-2">
            <span className="text-zinc-500 font-medium"># 2. Database Connectivity Check</span>
            <p className="text-zinc-300">docker exec vaultscope-postgres pg_isready -U vaultscope</p>
            <p className="text-emerald-400 font-medium"># accepting connections</p>
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
              <h3 className="text-sm font-semibold text-foreground">Automated Production Update with Database Migrations</h3>
            </div>
            <p className="text-xs text-foreground/70">
              The updater script stops the running API service, creates a full database and code snapshot, pulls updated backend source, applies pending SQLx database migrations, rebuilds the Docker container, and runs a healthcheck verification before completing:
            </p>
            <pre className="p-3 bg-zinc-950 text-zinc-200 rounded-lg border border-zinc-800 font-mono text-xs overflow-x-auto">
sudo /opt/vaultscope/update.sh --branch=dev
            </pre>
          </div>

          <div className="p-5 rounded-xl border border-border bg-foreground/[0.01] space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-foreground/10 text-foreground flex items-center justify-center text-xs font-bold">2</span>
              <h3 className="text-sm font-semibold text-foreground">Manual Upgrade Steps</h3>
            </div>
            <pre className="p-3 bg-zinc-950 text-zinc-200 rounded-lg border border-zinc-800 font-mono text-xs overflow-x-auto leading-relaxed">{`cd /opt/vaultscope
cd vamos && git pull origin dev && cd ..
docker-compose -f docker-compose.production.yml up -d postgres redis
docker-compose -f docker-compose.production.yml build --no-cache api
docker-compose -f docker-compose.production.yml up -d --no-deps api`}</pre>
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
              Removes all Docker containers, database volumes, and service configurations while preserving SSL certs:
            </p>
            <pre className="p-3 bg-zinc-950 text-zinc-200 rounded-lg border border-zinc-800 font-mono text-xs overflow-x-auto">
sudo /opt/vaultscope/uninstall.sh
            </pre>
          </div>

          <div className="p-5 rounded-xl border border-border bg-foreground/[0.01] space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Manual Standalone Cleanup</h3>
            <pre className="p-3 bg-zinc-950 text-zinc-200 rounded-lg border border-zinc-800 font-mono text-xs overflow-x-auto leading-relaxed">{`# 1. Stop and remove Docker containers and volumes
docker stop vaultscope-api vaultscope-postgres vaultscope-redis
docker rm -v vaultscope-api vaultscope-postgres vaultscope-redis

# 2. Remove Nginx reverse proxy
sudo rm -f /etc/nginx/sites-enabled/api.your-domain.com
sudo rm -f /etc/nginx/sites-available/api.your-domain.com
sudo systemctl reload nginx

# 3. Clean files
sudo rm -rf /opt/vaultscope/vamos`}</pre>
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
            <h4 className="text-xs font-semibold text-foreground mb-1">Database connection failed / pool timeout</h4>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Verify that PostgreSQL container is running and healthy (<code className="font-mono text-[11px]">docker ps</code>). Confirm credentials match <code className="font-mono text-[11px]">DATABASE_URL</code> in <code className="font-mono text-[11px]">vamos/.env</code>.
            </p>
          </div>
          <div className="p-4 border border-border rounded-xl bg-foreground/[0.01]">
            <h4 className="text-xs font-semibold text-foreground mb-1">SQLx offline query compilation failure</h4>
            <p className="text-xs text-foreground/70 leading-relaxed">
              If modifying database queries, ensure you run <code className="font-mono text-[11px]">cargo sqlx prepare --workspace</code> while connected to a live database, or set <code className="font-mono text-[11px]">SQLX_OFFLINE=true</code> with an up-to-date <code className="font-mono text-[11px]">.sqlx</code> directory.
            </p>
          </div>
          <div className="p-4 border border-border rounded-xl bg-foreground/[0.01]">
            <h4 className="text-xs font-semibold text-foreground mb-1">Invalid encryption key length</h4>
            <p className="text-xs text-foreground/70 leading-relaxed">
              <code className="font-mono text-[11px]">ENCRYPTION_KEY</code> must decode to exactly 32 bytes for AES-256-GCM. Generate using <code className="font-mono text-[11px]">openssl rand -base64 32</code>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
