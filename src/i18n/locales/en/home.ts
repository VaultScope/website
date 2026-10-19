export const home = {
  seo: {
    title: 'VaultScope | European Cloud & Open-Source Infrastructure',
    description:
      'VaultScope builds and operates European cloud infrastructure, encrypted SFTP storage, and open-source software in Germany.',
  },
  hero: {
    tag: 'EUROPEAN INFRASTRUCTURE & SOFTWARE',
    headline: 'Infrastructure and software, engineered together in Germany.',
    subtext:
      'We operate high-performance cloud servers, encrypted SFTP storage, and our own open-source software stack on dedicated European hardware—with transparent pricing and strict GDPR compliance.',
    ctaPrimary: 'Explore Services',
    ctaSecondary: 'Create Account',
    stats: [
      { value: 'DE', label: 'Hosted in Germany' },
      { value: '100%', label: 'GDPR Compliant' },
      { value: 'NVMe', label: 'Fast Storage' },
      { value: '24/7', label: 'Monitoring' },
    ],
  },
  infrastructure: {
    tag: 'OUR SERVICES',
    headline: 'What we provide',
    subtext:
      'Dependable compute and encrypted storage engineered for developers and teams—without bloated cloud complexity.',
    pricingNotice: 'Clear, predictable monthly pricing.',
    cards: [
      {
        title: 'SFTP Storage',
        status: 'Available Now',
        desc: 'Encrypted cloud storage accessible via any standard SFTP client (FileZilla, Cyberduck, WinSCP, or CLI) with password and SSH key authentication.',
        specs: ['SFTP & SSH Keys', 'Encrypted ZFS Storage', 'Instant Access'],
        href: '/infrastructure/storage/',
        cta: 'Learn More',
      },
      {
        title: 'Cloud VPS',
        status: 'In Preparation',
        desc: 'KVM-isolated Linux virtual servers backed by local NVMe storage and consistent compute performance.',
        specs: ['KVM Isolation', 'NVMe SSDs', 'Root Access'],
        href: '/infrastructure/cloud/',
        cta: 'Learn More',
      },
      {
        title: 'Dedicated Servers',
        status: 'In Preparation',
        desc: 'Single-tenant physical servers delivering unshared hardware performance and full root control for demanding workloads.',
        specs: ['Single-Tenant Hardware', 'Full Root & IPMI', '10 Gbps Network'],
        href: '/infrastructure/dedicated/',
        cta: 'Learn More',
      },
      {
        title: 'One-Click Deploy',
        status: 'In Development',
        desc: 'Deploy pre-configured web applications, databases, and containers in seconds without manual server setup.',
        specs: ['Container Hosting', 'Automatic SSL', 'Zero Server Setup'],
        href: '/deploy/',
        cta: 'Learn More',
      },
      {
        title: 'Managed Infrastructure',
        status: 'Available Now',
        desc: 'We handle architecture, provisioning, security updates, automated backups, and 24/7 monitoring so your team can focus on shipping.',
        specs: ['24/7 Monitoring', 'Automated Backups', 'Direct Engineer Support'],
        href: '/infrastructure/managed/',
        cta: 'Learn More',
      },
    ],
  },
  software: {
    tag: 'SOFTWARE',
    headline: 'Software we build and run',
    subtext:
      'Alongside our hosting infrastructure, we engineer our own open-source software systems for provisioning, administration, and community operations.',
    cards: [
      {
        title: 'Pegasus',
        badge: 'Community Platform',
        desc: 'A comprehensive Discord platform for server moderation, support tickets, giveaways, and community management.',
        tech: ['Python', 'Next.js', 'PostgreSQL', 'Docker'],
        href: '/software/pegasus/',
        cta: 'Explore Pegasus',
      },
      {
        title: 'VAMOS',
        badge: 'Modular Rust Backend',
        desc: 'Our core Rust engine handling resource provisioning, authentication, billing lifecycles, and storefront APIs.',
        tech: ['Rust', 'Axum', 'PostgreSQL'],
        href: '/software/vamos/',
        cta: 'Explore VAMOS',
      },
      {
        title: 'CAMOS',
        badge: 'Administration Suite',
        desc: 'Our Administration Suite built to manage customers, products, staff, role-based access control (RBAC), and internal operations.',
        tech: ['React', 'TypeScript', 'Rust'],
        href: '/software/camos/',
        cta: 'Explore CAMOS',
      },
    ],
  },
  principles: {
    tag: 'WHY VAULTSCOPE',
    headline: 'Why choose VaultScope',
    subtext: 'Open architecture, straightforward tooling, and dependable infrastructure.',
    items: [
      {
        title: 'Transparency',
        desc: 'From public pricing and hardware specifications to our open-source codebase and operational status, we operate in the open—with no black boxes or hidden throttling.',
      },
      {
        title: 'Community',
        desc: 'We build VaultScope alongside the developers, system administrators, and teams who run on our platform through open repositories and direct technical dialogue.',
      },
      {
        title: 'Trust',
        desc: 'We treat our clients as engineering peers—providing full root access, verifiable infrastructure, and clear commitments rather than artificial lock-in.',
      },
    ],
  },
  waitlist: {
    tag: 'NEWSLETTER',
    headline: 'Stay in the loop',
    subtext:
      'Subscribe to our newsletter for updates on new features, server availability, and software releases.',
  },
};

