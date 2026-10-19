import { PageHero, Button } from '../components/Shared';
import { ExternalLink, GitBranch } from 'lucide-react';
import { useLanguage } from '../i18n';
import { SeoHead } from '../components/SeoHead';

const INFRA_STACK = [
  {
    name: 'Authentik',
    category: 'Identity & Security',
    desc: 'Enterprise-grade identity provider used to secure both customer and staff access via Passkeys (WebAuthn), SSO, and granular authorization policies.',
    url: 'https://goauthentik.io',
  },
  {
    name: 'Beszel',
    category: 'Server Monitoring',
    desc: "Lightweight infrastructure monitoring used within VaultScope's server environment for resource and system health tracking.",
    url: 'https://beszel.dev',
  },
  {
    name: 'Coolify',
    category: 'Deployment',
    desc: 'Self-hosted application deployment and management platform. Handles container deployments, environment configuration, and service lifecycle management.',
    url: 'https://coolify.io',
  },
  {
    name: 'Debian',
    category: 'Operating System',
    desc: "Stable, production-grade Linux distribution. The operating system foundation across VaultScope's server infrastructure.",
    url: 'https://www.debian.org',
  },
  {
    name: 'Forgejo',
    category: 'Git Hosting',
    desc: "Self-hosted Git platform for version control and development collaboration. VaultScope's development infrastructure runs on Forgejo.",
    url: 'https://forgejo.org',
  },
  {
    name: 'Listmonk',
    category: 'Mailing & Newsletters',
    desc: 'Self-hosted newsletter and mailing list manager. Handles waitlist subscriptions, product announcements, and transactional email campaigns.',
    url: 'https://listmonk.app',
  },
  {
    name: 'Mailcow',
    category: 'Email Server',
    desc: "Self-hosted email server suite providing IMAP, SMTP, and webmail. Powers VaultScope's email infrastructure with full control over mail delivery and domain management.",
    url: 'https://mailcow.email',
  },
  {
    name: 'Proxmox',
    category: 'Virtualization',
    desc: "Open-source virtualization platform used for VaultScope's internal infrastructure and service management.",
    url: 'https://www.proxmox.com',
  },
  {
    name: 'Uptime Kuma',
    category: 'Uptime Monitoring',
    desc: "Self-hosted monitoring tool for tracking service availability and uptime across VaultScope's infrastructure stack.",
    url: 'https://uptime.kuma.pet',
  },
];

const DEV_STACK = [
  {
    name: 'Voltius',
    category: 'Infrastructure Tooling',
    desc: 'Infrastructure tooling used within the VaultScope ecosystem for internal operational workflows.',
    url: null,
  },
  {
    name: 'OpenCode',
    category: 'Development Tooling',
    desc: 'AI-powered development tooling used within the VaultScope development workflow for code assistance and engineering tasks.',
    url: 'https://opencode.ai',
  },
];

const VS_PROJECTS = [
  {
    role: 'Discord Platform',
    title: 'Pegasus',
    desc: 'A full-featured Discord community management platform. Moderation, economy, XP leveling, ticket system, giveaways, and a complete web dashboard. Source-available under the PolyForm Noncommercial license.',
    stack: 'PolyForm Noncommercial · TypeScript · discord.js v14',
    repoUrl: 'https://github.com/semi-constructor/pegasus',
  },
  {
    role: 'Web Dashboard',
    title: 'Pegasus Dashboard',
    desc: 'The web management interface for Pegasus. Guild management, module configuration, real-time analytics, and public leaderboards. Built with Next.js.',
    stack: 'PolyForm Noncommercial · TypeScript · Next.js',
    repoUrl: 'https://github.com/semi-constructor/pegasus-dashboard',
  },
  {
    role: 'API Gateway',
    title: 'VAMOS',
    desc: 'VaultScope API Management & Operations System. The Rust API layer that handles communication between CAMOS, the VaultScope Storefront, and upstream infrastructure providers.',
    stack: 'AGPL-3.0 · Rust · Axum · PostgreSQL',
    repoUrl: 'https://github.com/VaultScope/vamos',
  },
  {
    role: 'Control Plane',
    title: 'CAMOS',
    desc: 'Client Administration & Management Operations System. The operator control plane for billing, customer support, infrastructure API integrations, and staff RBAC.',
    stack: 'Open Source · React · TypeScript · Vite',
    repoUrl: 'https://github.com/VaultScope/camos',
  },
];

export const OpenSource = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col w-full bg-[var(--bg-primary)] text-[var(--text)]">
      <SeoHead
        title="Open Source Commitment"
        description="Explore our open-source repositories, architectural standards, and public code contributions."
        path="/company/open-source"
      />

      <PageHero
        breadcrumbs={[{ label: t.nav.company, href: '/company/about/' }, { label: t.openSource.breadcrumb }]}
        title="Built on open source."
        description="VaultScope's hosting infrastructure is operated using a curated stack of open-source and self-hosted technologies, alongside our own in-house open-source software."
        align="left"
      />

      {/* Technologies VaultScope Uses */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="mb-8 max-w-2xl">
            <p className="text-eyebrow mb-2">Operational Foundation</p>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] text-[var(--text)] mb-2.5">
              Technologies VaultScope uses.
            </h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              The following tools and platforms make up the operational foundation behind VaultScope's hosting environment.
            </p>
          </div>

          <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)] mb-12">
            {INFRA_STACK.map((item) => (
              <div
                key={item.name}
                className="py-4 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center"
              >
                <div className="md:col-span-3 flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-[var(--text)]">{item.name}</h3>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${item.name} website`}
                      className="text-[var(--text-faint)] hover:text-[var(--accent-bright)] transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <div className="md:col-span-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--accent-bright)]">
                    {item.category}
                  </span>
                </div>
                <p className="md:col-span-7 text-xs text-[var(--text-muted)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <h3 className="text-base font-semibold text-[var(--text)] mb-3">Development Tooling</h3>
          <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
            {DEV_STACK.map((item) => (
              <div
                key={item.name}
                className="py-4 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center"
              >
                <div className="md:col-span-3 flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-[var(--text)]">{item.name}</h4>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${item.name} website`}
                      className="text-[var(--text-faint)] hover:text-[var(--accent-bright)] transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <div className="md:col-span-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--accent-bright)]">
                    {item.category}
                  </span>
                </div>
                <p className="md:col-span-7 text-xs text-[var(--text-muted)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Open Source */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="mb-10 max-w-2xl">
            <p className="text-eyebrow mb-2">Philosophy</p>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] text-[var(--text)]">
              Why open source matters to us.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10 lg:gap-12">
            {[
              {
                title: 'Transparency',
                desc: "Open-source infrastructure is auditable infrastructure. Understanding what runs your systems shouldn't require guesswork.",
              },
              {
                title: 'Control',
                desc: 'Self-hosted tooling keeps operational control within the infrastructure team. No vendor lock-in, no hidden dependencies.',
              },
              {
                title: 'Community',
                desc: 'The tools we use are built and maintained by active open-source communities. We benefit from that work and contribute our own software.',
              },
            ].map((item, idx) => (
              <div key={item.title}>
                <span className="block font-mono text-xs font-semibold text-[var(--accent-bright)] mb-2">
                  0{idx + 1}
                </span>
                <h3 className="text-base font-semibold text-[var(--text)] mb-2">{item.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Software VaultScope Develops */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="mb-8 max-w-2xl">
            <p className="text-eyebrow mb-2">First-Party Repositories</p>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] text-[var(--text)] mb-2.5">
              Software VaultScope develops.
            </h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Distinct from the third-party stack above, these projects are engineered and maintained directly by the VaultScope team.
            </p>
          </div>

          <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
            {VS_PROJECTS.map((project) => (
              <div
                key={project.title}
                className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    <GitBranch className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
                    <h3 className="text-base font-semibold text-[var(--text)] tracking-tight">
                      {project.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded font-mono text-[11px] uppercase tracking-wider bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                      {project.role}
                    </span>
                    <span className="font-mono text-[11px] text-[var(--accent-bright)]">
                      {project.stack}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{project.desc}</p>
                </div>
                <div className="shrink-0">
                  <a href={project.repoUrl} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm">
                      View Repository
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
