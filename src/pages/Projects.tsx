import { useEffect } from 'react';
import { PageHero, Button } from '../components/Shared';
import { Shield, GitBranch, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

// ─── Data ────────────────────────────────────────────────────────────────────

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
      { label: 'pegasusbot.app',  href: 'https://pegasusbot.app',                                   Icon: Globe      },
      { label: 'GitHub',          href: 'https://github.com/semi-constructor/pegasus',               Icon: GitBranch  },
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
      { label: 'Open Dashboard',  href: 'https://pegasusbot.app/dashboard',                         Icon: Globe      },
      { label: 'GitHub',          href: 'https://github.com/semi-constructor/pegasus-dashboard',     Icon: GitBranch  },
    ],
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export const Projects = () => {
  useEffect(() => {
    document.title = "Projects — VaultScope";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Software projects developed by VaultScope. Includes Pegasus, a Discord community management platform, and the Pegasus Dashboard.'
      );
    }
  }, []);

  return (
    <div className="flex flex-col w-full">

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <PageHero
        eyebrow="VAULTSCOPE PROJECTS"
        title="Software from the VaultScope ecosystem."
        description="Projects developed and operated by VaultScope — running on VaultScope's own infrastructure."
        align="left"
      />

      {/* ─── PROJECTS LIST ─────────────────────────────────────────── */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">

          <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-16">Projects</div>

          <div className="grid gap-0 border border-border max-w-5xl">
            {PROJECTS.map((project, i) => {
              const ProjectIcon = project.icon;
              return (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`p-8 md:p-10 flex flex-col md:flex-row gap-8 bg-background hover:bg-foreground/[0.01] transition-colors ${i < PROJECTS.length - 1 ? 'border-b border-border' : ''}`}
                >
                  {/* Icon */}
                  <div className="w-14 h-14 bg-background border border-border flex items-center justify-center shrink-0">
                    <ProjectIcon className="w-5 h-5 text-foreground/40" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-3">
                      {project.n} // {project.tag}
                    </div>
                    <h2 className="text-2xl font-medium text-foreground tracking-tight mb-4">{project.title}</h2>
                    <p className="text-foreground/50 font-light leading-relaxed mb-6">{project.description}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-widest text-foreground/40 mb-6">
                      {project.techTags.map((tag) => (
                        <span key={tag} className="bg-foreground/5 px-2.5 py-1 border border-border">{tag}</span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {project.links.map((link) => (
                        <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                          <Button variant="outline" className="h-10 px-6 text-xs flex items-center gap-2">
                            <link.Icon className="w-3.5 h-3.5" />
                            {link.label}
                          </Button>
                        </a>
                      ))}
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
