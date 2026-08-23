export const openSource = {
  title: 'Open Source — VaultScope',
  breadcrumb: 'Open Source',
};

export const openSourcePage = {
  metaDescription: 'The open-source and self-hosted technology stack used across the VaultScope ecosystem. Debian, Forgejo, Voltius, OpenCode, and more.',
  eyebrow: 'OPEN SOURCE & INFRASTRUCTURE',
  heroTitle: 'Built on open source.',
  heroDescription: 'VaultScope\'s hosting infrastructure is operated using a curated stack of open-source and self-hosted technologies. Here is what powers the stack.',
  infraSectionEyebrow: '01 // Infrastructure',
  infraSectionTitle: 'Technologies VaultScope uses.',
  infraSectionDescription: 'The following tools and platforms make up the operational infrastructure behind VaultScope\'s hosting environment. These are technologies VaultScope relies on — not software VaultScope develops.',
  infraStackLabel: 'Infrastructure Stack',
  devStackLabel: 'Development Stack',
  infraStack: [
    { name: 'Proxmox', category: 'Virtualization', desc: 'Open-source virtualization platform used for VaultScope\'s internal infrastructure and service management.' },
    { name: 'Debian', category: 'Operating System', desc: 'Stable, production-grade Linux distribution. The operating system foundation across VaultScope\'s server infrastructure.' },
    { name: 'Coolify', category: 'Deployment', desc: 'Self-hosted application deployment and management platform. Handles container deployments, environment configuration, and service lifecycle management.' },
    { name: 'Forgejo', category: 'Git Hosting', desc: 'Self-hosted Git platform for version control and development collaboration. VaultScope\'s development infrastructure runs on Forgejo.' },
    { name: 'Uptime Kuma', category: 'Uptime Monitoring', desc: 'Self-hosted monitoring tool for tracking service availability and uptime across VaultScope\'s infrastructure stack.' },
    { name: 'Beszel', category: 'Server Monitoring', desc: 'Lightweight infrastructure monitoring used within VaultScope\'s server environment for resource and system health tracking.' },
    { name: 'Mailcow', category: 'Email Server', desc: 'Self-hosted email server suite providing IMAP, SMTP, and webmail. Powers VaultScope\'s email infrastructure with full control over mail delivery and domain management.' },
    { name: 'Listmonk', category: 'Mailing & Newsletters', desc: 'Self-hosted newsletter and mailing list manager. Handles waitlist subscriptions, product announcements, and transactional email campaigns.' },
  ],
  devStack: [
    { name: 'Voltius', category: 'Infrastructure Tooling', desc: 'Infrastructure tooling used within the VaultScope ecosystem for internal operational workflows.' },
    { name: 'OpenCode', category: 'Development Tooling', desc: 'AI-powered development tooling used within the VaultScope development workflow for code assistance and engineering tasks.' },
  ],
  whyEyebrow: '02 // Philosophy',
  whyTitle: 'Why open source matters to us.',
  whyReasons: [
    { title: 'Transparency', desc: 'Open-source infrastructure is auditable infrastructure. Understanding what runs your systems shouldn\'t require guesswork.' },
    { title: 'Control', desc: 'Self-hosted tooling keeps operational control within the infrastructure team. No vendor lock-in, no hidden dependencies.' },
    { title: 'Community', desc: 'The tools we use are built and maintained by active open-source communities. We benefit from that work and intend to give back.' },
  ],
  softwareEyebrow: '03 // Software',
  softwareTitle: 'Software VaultScope develops.',
  softwareDescription: 'Distinct from the technologies listed above, VaultScope also develops its own software. These are projects built and maintained by the VaultScope team.',
  projects: [
    {
      tag: 'Discord Platform',
      title: 'Pegasus',
      desc: 'A full-featured Discord community management platform. Moderation, economy, XP leveling, ticket system, giveaways, and a complete web dashboard. Source-available under the PolyForm Noncommercial license.',
      tags: ['PolyForm Noncommercial', 'TypeScript', 'discord.js v14'],
    },
    {
      tag: 'Web Dashboard',
      title: 'Pegasus Dashboard',
      desc: 'The web management interface for Pegasus. Guild management, module configuration, real-time analytics, and public leaderboards. Built with Next.js. Source-available under the PolyForm Noncommercial license.',
      tags: ['PolyForm Noncommercial', 'TypeScript', 'Next.js'],
    },
  ],
  viewRepository: 'View Repository',
};
