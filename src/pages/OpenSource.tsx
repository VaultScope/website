import { useEffect } from 'react';
import { PageHero, Button, Breadcrumbs } from '../components/Shared';
import { ExternalLink, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n';

// ─── Data ────────────────────────────────────────────────────────────────────

// Technologies VaultScope uses — not software VaultScope develops.

const INFRA_STACK = [
  {
    name: 'Proxmox',
    category: 'Virtualization',
    desc: 'Open-source virtualization platform used for VaultScope\'s internal infrastructure and service management.',
    url: 'https://www.proxmox.com',
  },
  {
    name: 'Debian',
    category: 'Operating System',
    desc: "Stable, production-grade Linux distribution. The operating system foundation across VaultScope's server infrastructure.",
    url: 'https://www.debian.org',
  },
  {
    name: 'Coolify',
    category: 'Deployment',
    desc: 'Self-hosted application deployment and management platform. Handles container deployments, environment configuration, and service lifecycle management.',
    url: 'https://coolify.io',
  },
  {
    name: 'Forgejo',
    category: 'Git Hosting',
    desc: "Self-hosted Git platform for version control and development collaboration. VaultScope's development infrastructure runs on Forgejo.",
    url: 'https://forgejo.org',
  },
  {
    name: 'Uptime Kuma',
    category: 'Uptime Monitoring',
    desc: "Self-hosted monitoring tool for tracking service availability and uptime across VaultScope's infrastructure stack.",
    url: 'https://uptime.kuma.pet',
  },
  {
    name: 'Beszel',
    category: 'Server Monitoring',
    desc: "Lightweight infrastructure monitoring used within VaultScope's server environment for resource and system health tracking.",
    url: 'https://beszel.dev',
  },
  {
    name: 'Mailcow',
    category: 'Email Server',
    desc: "Self-hosted email server suite providing IMAP, SMTP, and webmail. Powers VaultScope's email infrastructure with full control over mail delivery and domain management.",
    url: 'https://mailcow.email',
  },
  {
    name: 'Listmonk',
    category: 'Mailing & Newsletters',
    desc: "Self-hosted newsletter and mailing list manager. Handles waitlist subscriptions, product announcements, and transactional email campaigns.",
    url: 'https://listmonk.app',
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

// Software VaultScope develops — distinct from the technologies above.

const VS_PROJECTS = [
  {
    tag: 'Discord Platform',
    title: 'Pegasus',
    desc: 'A full-featured Discord community management platform. Moderation, economy, XP leveling, ticket system, giveaways, and a complete web dashboard. Source-available under the PolyForm Noncommercial license.',
    tags: ['PolyForm Noncommercial', 'TypeScript', 'discord.js v14'],
    repoUrl: 'https://github.com/semi-constructor/pegasus',
  },
  {
    tag: 'Web Dashboard',
    title: 'Pegasus Dashboard',
    desc: 'The web management interface for Pegasus. Guild management, module configuration, real-time analytics, and public leaderboards. Built with Next.js. Source-available under the PolyForm Noncommercial license.',
    tags: ['PolyForm Noncommercial', 'TypeScript', 'Next.js'],
    repoUrl: 'https://github.com/semi-constructor/pegasus-dashboard',
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export const OpenSource = () => {
  const { t } = useLanguage();
  useEffect(() => {
    document.title = t.openSource.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        "The open-source and self-hosted technology stack used across the VaultScope ecosystem. Debian, Coolify, Forgejo, Uptime Kuma, Beszel, Voltius, OpenCode, and more."
      );
    }
  }, [t]);

  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-6 lg:px-12 pt-32">
        <Breadcrumbs items={[{ label: t.nav.company }, { label: t.openSource.breadcrumb }]} />
      </div>

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <PageHero
        eyebrow="OPEN SOURCE & INFRASTRUCTURE"
        title={<>Built on open source.</>}
        description="VaultScope's hosting infrastructure is operated using a curated stack of open-source and self-hosted technologies. Here is what powers the stack."
        align="left"
      />

      {/* ─── TECHNOLOGIES VAULTSCOPE USES ──────────────────────────── */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">

          <div className="mb-16">
            <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-4">01 // Infrastructure</div>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground mb-4">
              Technologies VaultScope uses.
            </h2>
            <p className="text-foreground/50 font-light text-lg max-w-3xl">
              The following tools and platforms make up the operational infrastructure behind VaultScope's hosting environment.
              These are technologies VaultScope relies on — not software VaultScope develops.
            </p>
          </div>

          {/* Infrastructure Stack */}
          <div className="mb-16">
            <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-8">Infrastructure Stack</div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 border-l border-t border-border">
              {INFRA_STACK.map((item) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="border-r border-b border-border px-6 py-7 bg-background hover:bg-foreground/[0.01] transition-colors group"
                >
                  <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-3">{item.category}</div>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-medium text-foreground">{item.name}</h3>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${item.name} website`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-foreground/30 mt-0.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-foreground/50 font-light leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Development Stack */}
          <div>
            <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-8">Development Stack</div>
            <div className="grid md:grid-cols-2 border-l border-t border-border max-w-4xl">
              {DEV_STACK.map((item) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="border-r border-b border-border px-6 py-7 bg-background hover:bg-foreground/[0.01] transition-colors group"
                >
                  <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-3">{item.category}</div>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-medium text-foreground">{item.name}</h3>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${item.name} website`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-foreground/30 mt-0.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-foreground/50 font-light leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ─── WHY OPEN SOURCE ───────────────────────────────────────── */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">

          <div className="mb-12">
            <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-4">02 // Philosophy</div>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground mb-4">
              Why open source matters to us.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-0 border border-border">
            {[
              {
                title: 'Transparency',
                desc: "Open-source infrastructure is auditable infrastructure. Understanding what runs your systems shouldn't require guesswork.",
              },
              {
                title: 'Control',
                desc: "Self-hosted tooling keeps operational control within the infrastructure team. No vendor lock-in, no hidden dependencies.",
              },
              {
                title: 'Community',
                desc: 'The tools we use are built and maintained by active open-source communities. We benefit from that work and intend to give back.',
              },
            ].map((item, i) => (
              <div key={item.title} className={`p-8 ${i < 2 ? 'border-b md:border-b-0 md:border-r border-border' : ''}`}>
                <h3 className="text-base font-medium text-foreground tracking-normal uppercase mb-3">{item.title}</h3>
                <p className="text-sm text-foreground/50 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── SOFTWARE VAULTSCOPE DEVELOPS ──────────────────────────── */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">

          <div className="mb-12">
            <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-4">03 // Software</div>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground mb-4">
              Software VaultScope develops.
            </h2>
            <p className="text-foreground/50 font-light text-lg max-w-3xl">
              Distinct from the technologies listed above, VaultScope also develops its own software.
              These are projects built and maintained by the VaultScope team.
            </p>
          </div>

          <div className="grid gap-0 border border-border">
            {VS_PROJECTS.map((project, i) => (
              <div
                key={project.title}
                className={`p-8 flex flex-col md:flex-row md:items-center gap-8 bg-background hover:bg-foreground/[0.01] transition-colors ${i < VS_PROJECTS.length - 1 ? 'border-b border-border' : ''}`}
              >
                <div className="w-16 h-16 bg-background border border-border flex items-center justify-center shrink-0">
                  <GitBranch className="w-7 h-7 text-foreground/40" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-2">{project.tag}</div>
                  <h3 className="text-xl font-medium text-foreground tracking-tight mb-2">{project.title}</h3>
                  <p className="text-foreground/50 font-light mb-4">{project.desc}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-widest text-foreground/40">
                    {project.tags.map((tag) => (
                      <span key={tag} className="bg-foreground/5 px-2.5 py-1 border border-border">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0">
                  <a href={project.repoUrl} target="_blank" rel="noreferrer">
                    <Button variant="outline" className="h-10 px-6 text-xs whitespace-nowrap">View Repository</Button>
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
