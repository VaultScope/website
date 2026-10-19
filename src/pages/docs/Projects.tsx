import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Zap, 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  Server, 
  Globe, 
  Terminal, 
  ChevronRight 
} from 'lucide-react';

export const DocsProjects = () => {
  const location = useLocation();
  const isGerman = location.pathname.startsWith('/de');
  const getPath = (path: string) => isGerman ? `/de${path}` : path;

  useEffect(() => {
    document.title = "Core Projects — VaultScope Documentation";
  }, []);

  const projects = [
    {
      id: 'storefront',
      name: 'VaultScope Storefront',
      path: '/docs/projects/storefront',
      icon: Globe,
      role: 'Customer-Facing Web Application',
      repo: 'https://github.com/VaultScope/website',
      repoName: 'VaultScope/website',
      badge: 'Frontend',
      badgeColor: 'border-[var(--line-strong)] text-[var(--text)] bg-white/5',
      stack: ['React 19', 'Vite 8', 'Tailwind 4', 'Caddy 2'],
      ports: 'Container: 3000 | Host: 8080 / 3000',
      description: 'The primary customer portal providing real-time product discovery, interactive checkout workflows with Stripe, and client self-service infrastructure controls.',
      highlights: [
        'Dynamic Product Catalog querying VAMOS in real-time',
        'Multi-step deployment wizard for VPS, DS, and ODP',
        'Served in production by Caddy with SPA route fallbacks',
        'Authentik OIDC client: vaultscope-storefront'
      ]
    },
    {
      id: 'vamos',
      name: 'VAMOS API & Engine',
      path: '/docs/projects/vamos',
      icon: Zap,
      role: 'Core Backend & Job Orchestration',
      repo: 'https://github.com/VaultScope/vamos',
      repoName: 'VaultScope/vamos',
      badge: 'Backend Engine',
      badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/5',
      stack: ['Rust 1.75+', 'Axum 0.8', 'SQLx 0.8', 'PostgreSQL 16', 'Redis 7'],
      ports: 'Container: 3000 | Host: 3000 / 8000',
      description: 'High-performance asynchronous backend written in Rust. Governs business logic, strict role-based access control, database migrations, and background worker queues.',
      highlights: [
        'Centralized REST API Gateway with zero-trust RBAC',
        'Asynchronous JobRunner daemon for automated provisioning',
        'Hardware connectors for Hetzner, OVH, and Proxmox VE',
        'AES-256-GCM encrypted provider credentials at rest'
      ]
    },
    {
      id: 'camos',
      name: 'CAMOS Admin Panel',
      path: '/docs/projects/camos',
      icon: Shield,
      role: 'Internal Staff & Control Plane',
      repo: 'https://github.com/VaultScope/camos',
      repoName: 'VaultScope/camos',
      badge: 'Operations Portal',
      badgeColor: 'border-[var(--line-strong)] text-[var(--text-muted)] bg-white/5',
      stack: ['React 19', 'Vite 8', 'TipTap', 'Recharts', 'Nginx Alpine'],
      ports: 'Container: 80 | Host: 8081 / 3001',
      description: 'The internal administrative control plane used by support staff and system operators to oversee infrastructure, manage product plans, resolve tickets, and inspect financial ledgers.',
      highlights: [
        'Global infrastructure fleet oversight with remote power controls',
        'Rich-text ticketing system for support and abuse incidents',
        'Monthly recurring revenue (MRR) metrics and Stripe ledger sync',
        'Authentik OIDC client: vaultscope-admin'
      ]
    }
  ];

  return (
    <div className="space-y-12">
      {/* Top Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-foreground/50 select-none">
        <Link to={getPath('/docs')} className="hover:text-foreground transition-colors">Docs</Link>
        <ChevronRight className="w-3 h-3 text-foreground/30" />
        <span className="text-foreground font-medium">Projects</span>
      </nav>

      {/* Hero Header */}
      <div className="space-y-3 pb-6">
        <span className="inline-flex items-center gap-2 text-xs font-mono text-[var(--accent-bright)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-bright)]" />
          Platform Architecture
        </span>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
          VaultScope Core Projects
        </h1>
        <p className="text-base text-foreground/70 max-w-3xl leading-relaxed">
          The VaultScope ecosystem is composed of three decoupled, purpose-built systems. Each project maintains independent versioning, deployment configurations, and runtime requirements while integrating via documented REST APIs.
        </p>
      </div>

      {/* Projects List */}
      <div className="divide-y divide-border">
        {projects.map((project) => {
          const Icon = project.icon;
          return (
            <div 
              key={project.id}
              className="py-8 flex flex-col md:flex-row gap-6 md:items-start justify-between"
            >
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md border border-[var(--accent-border)] bg-[var(--accent-subtle)] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-[var(--accent-bright)]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">{project.name}</h2>
                    <p className="text-xs text-foreground/50 font-mono mt-0.5">{project.role} &middot; {project.ports}</p>
                  </div>
                </div>

                <p className="text-sm text-foreground/70 leading-relaxed">
                  {project.description}
                </p>

                {/* Highlights */}
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-foreground/70 pt-1">
                  {project.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack */}
                <p className="text-xs font-mono text-foreground/50 pt-1">
                  Stack: {project.stack.join(' · ')}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 md:w-56 pt-2 md:pt-0">
                <Link
                  to={getPath(project.path)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-bright)] transition-colors shadow-sm"
                >
                  <span>Read Lifecycle Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg border border-border hover:bg-foreground/5 transition-colors text-foreground/70 hover:text-foreground"
                >
                  <span>{project.repoName}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ecosystem Architecture Diagram */}
      <section className="space-y-4 pt-4">
        <h2 className="text-2xl font-medium tracking-tight text-foreground flex items-center gap-2.5">
          <Server className="w-6 h-6 text-foreground/70" /> System Communication & Data Flow
        </h2>
        <p className="text-sm text-foreground/70 leading-relaxed">
          The diagram below illustrates how traffic flows between customer traffic, administrative operations, the VAMOS API gateway, persistent data stores, and external cloud infrastructure providers:
        </p>

        <div className="p-6 rounded-xl border border-border bg-zinc-950 text-zinc-200 font-mono text-xs overflow-x-auto">
          <pre className="leading-relaxed">
{`+-----------------------+              +-----------------------+
|  VaultScope Storefront|              |   CAMOS Admin Portal  |
| (Customer React 19)   |              |  (Staff React 19/Vite)|
| Port 8080 (Caddy)     |              | Port 8081 (Nginx)     |
+-----------+-----------+              +-----------+-----------+
            |                                      |
            | HTTPS / REST                         | HTTPS / REST
            +-------------------+------------------+
                                |
                                v
               +----------------------------------+
               |     VAMOS Backend API (Rust)     |
               |       Axum HTTP Server :3000     |
               |   - Role-Based Access Control    |
               |   - Session & Token Management   |
               |   - AES-256-GCM Encrypted Keys   |
               +----------------+-----------------+
                                |
        +-----------------------+-----------------------+
        |                       |                       |
        v                       v                       v
+---------------+       +---------------+       +---------------+
|  PostgreSQL 16|       |    Redis 7    |       | Authentik OIDC|
| (SQLx Models) |       | (Rate Limits) |       |  (Identity)   |
+---------------+       +---------------+       +---------------+
                                |
                                v
               +----------------------------------+
               |    JobRunner Provisioning Daemon |
               |    (Async Tokio Task Workers)    |
               +----------------+-----------------+
                                |
        +-----------------------+-----------------------+
        |                       |                       |
        v                       v                       v
+---------------+       +---------------+       +---------------+
| Hetzner Cloud |       |  OVHcloud API |       |  Proxmox VE   |
| (VPS Servers) |       | (Dedicated)   |       |  (Bare Metal) |
+---------------+       +---------------+       +---------------+`}
          </pre>
        </div>
      </section>

      {/* Quick Action Commands Matrix */}
      <section className="space-y-4 pt-4">
        <h2 className="text-2xl font-medium tracking-tight text-foreground flex items-center gap-2.5">
          <Terminal className="w-6 h-6 text-foreground/70" /> Lifecycle Operations Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse border border-border">
            <thead>
              <tr className="bg-foreground/5 border-b border-border font-mono text-foreground">
                <th className="p-3">Operation</th>
                <th className="p-3">Storefront (`website`)</th>
                <th className="p-3">Backend (`vamos`)</th>
                <th className="p-3">Admin (`camos`)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono">
              <tr>
                <td className="p-3 font-semibold text-foreground">Install (Automated)</td>
                <td colSpan={3} className="p-3 text-foreground/80">
                  <code>curl -fsSL https://raw.githubusercontent.com/VaultScope/website/dev/installer.sh | sudo bash</code>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-foreground">Install (Standalone)</td>
                <td className="p-3 text-foreground/70"><code>npm install &amp;&amp; npm run dev</code></td>
                <td className="p-3 text-foreground/70"><code>sqlx migrate run &amp;&amp; cargo run</code></td>
                <td className="p-3 text-foreground/70"><code>npm install &amp;&amp; npm run dev</code></td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-foreground">Upgrade (Automated)</td>
                <td colSpan={3} className="p-3 text-foreground/80">
                  <code>sudo /opt/vaultscope/update.sh --branch=dev</code>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-foreground">Upgrade (Docker)</td>
                <td className="p-3 text-foreground/70"><code>docker-compose build storefront</code></td>
                <td className="p-3 text-foreground/70"><code>docker-compose build api</code></td>
                <td className="p-3 text-foreground/70"><code>docker-compose build admin</code></td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-foreground">Uninstall</td>
                <td colSpan={3} className="p-3 text-foreground/80">
                  <code>sudo /opt/vaultscope/uninstall.sh</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
