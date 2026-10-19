import { useEffect } from 'react';
import { PageHero, Button } from '../components/Shared';
import { Shield, GitBranch, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const PROJECTS = [
  {
    n: '01',
    tag: 'Discord Platform',
    icon: Shield,
    title: 'Pegasus',
    description:
      'A full-featured Discord community management platform built for flexibility, transparency, and self-hosting. Eight production-ready modules including advanced moderation, economy, XP leveling, a multi-panel ticket system, giveaways, voice channel management, role management, and social feeds. Ships with a complete web dashboard and a built-in REST API.',
    techTags: ['TypeScript', 'discord.js v14', 'PolyForm Noncommercial', 'Self-hostable'],
    links: [
      { label: 'pegasusbot.app', href: 'https://pegasusbot.app', Icon: Globe },
      { label: 'GitHub', href: 'https://github.com/semi-constructor/pegasus', Icon: GitBranch },
    ],
  },
  {
    n: '02',
    tag: 'Web Dashboard',
    icon: GitBranch,
    title: 'Pegasus Dashboard',
    description:
      'The web management interface for Pegasus. A Next.js application that connects to Pegasus over its built-in REST API, providing guild management, module configuration, real-time analytics, and public leaderboards. Secured with Discord OAuth2 authentication. Source-available under the PolyForm Noncommercial license.',
    techTags: ['TypeScript', 'Next.js', 'PolyForm Noncommercial', 'Source-Available'],
    links: [
      { label: 'Open Dashboard', href: 'https://pegasusbot.app/dashboard', Icon: Globe },
      { label: 'GitHub', href: 'https://github.com/semi-constructor/pegasus-dashboard', Icon: GitBranch },
    ],
  },
  {
    n: '03',
    tag: 'API Gateway',
    icon: Shield,
    title: 'Vamos',
    description:
      'VaultScope API Management & Operations System. API Layer between CAMOS and VaultScope Website that handles communication to APIs we use.',
    techTags: ['Rust', 'AGPL 3.0', 'OpenSource'],
    links: [{ label: 'GitHub', href: 'https://github.com/VaultScope/vamos', Icon: GitBranch }],
  },
  {
    n: '04',
    tag: 'Internal Dashboard',
    icon: Shield,
    title: 'Camos',
    description:
      'Client Administration & Management Operations System. The centralized internal dashboard used by staff to manage VaultScope operations, billing, customer support, and infrastructure API integrations.',
    techTags: ['React 18', 'Vite', 'Tailwind CSS', 'OpenSource'],
    links: [{ label: 'GitHub', href: 'https://github.com/VaultScope/camos', Icon: GitBranch }],
  },
];

export const Projects = () => {
  useEffect(() => {
    document.title = 'Projects — VaultScope';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Software projects developed by VaultScope. Includes Pegasus, a Discord community management platform, and the Pegasus Dashboard.'
      );
    }
  }, []);

  return (
    <div className="flex flex-col w-full bg-[var(--bg-primary)] text-[var(--text)]">
      <PageHero
        title="Software from the VaultScope ecosystem."
        description="Projects developed and operated by VaultScope — running on VaultScope's own infrastructure."
        align="left"
      />

      <section className="py-12 lg:py-16 relative">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1400px]">
          <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
            {PROJECTS.map((project, i) => {
              const ProjectIcon = project.icon;
              return (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start"
                >
                  <div className="lg:col-span-4 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono text-[var(--accent-bright)]">
                        {project.n}
                      </span>
                      <span className="text-[11px] font-mono uppercase tracking-[0.06em] text-[var(--fg-subtle)]">
                        {project.tag}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <ProjectIcon className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
                      <h2 className="text-xl font-semibold text-[var(--text)] tracking-[-0.02em]">
                        {project.title}
                      </h2>
                    </div>
                  </div>

                  <div className="lg:col-span-8 space-y-5">
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                        {project.techTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-mono text-[var(--fg-muted)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {project.links.map((link) => (
                          <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                            <Button variant="outline" className="h-8 px-4 text-xs flex items-center gap-2">
                              <link.Icon className="w-3.5 h-3.5" />
                              {link.label}
                            </Button>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
