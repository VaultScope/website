export const infrastructureOverview = {
  eyebrow: 'INFRASTRUCTURE',
  title: 'Cloud VPS. Dedicated Servers. Managed Infrastructure.',
  description: 'Three infrastructure models built on EU-based infrastructure. Transparent technology, open-source tooling, and engineering without unnecessary complexity.',
  cloud: {
    label: 'Tier 01',
    title: 'Cloud VPS',
    desc: 'Flexible virtual infrastructure for applications, services, and development workloads. Clean resource isolation on modern virtualization technology.',
    cta: 'Explore Cloud VPS',
  },
  dedicated: {
    label: 'Tier 02',
    title: 'Dedicated Servers',
    desc: 'Physical hardware with full resource ownership. No shared tenancy, no contention — built for workloads that require consistent performance.',
    cta: 'Explore Dedicated',
  },
  managed: {
    label: 'Managed',
    title: 'Managed Infrastructure',
    desc: 'Custom architecture designed and operated by engineers. From provisioning to monitoring to incident response — infrastructure without the operational overhead.',
    cta: 'Learn More',
  },
  facts: {
    infrastructure: { label: 'Infrastructure', value: 'Enterprise Hardware', note: 'Premium EU datacentres.' },
    locations: { label: 'Locations', value: 'European Union', note: 'All servers hosted in premium EU-based datacentres across NL, DE, FR, IT, and UK.' },
    legal: { label: 'Legal', value: 'GDPR compliant', note: 'No data transfer outside the EEA for server infrastructure.' },
  },
  technology: {
    eyebrow: 'Technology Foundation',
    title: 'Built on open infrastructure.',
    description: 'Proxmox-based virtualization on Debian. Enterprise-grade monitoring and automated deployment pipelines. Version-controlled on Forgejo.',
    cta: 'See the full technology stack',
  },
  waitlist: {
    title: 'Be the first to know.',
    description: 'Cloud VPS and Dedicated Server services are currently in preparation. Leave your email and we\'ll notify you the moment they launch.',
  },
};

export const infrastructureCloud = {
  title: 'Cloud VPS — VaultScope',
  metaDescription: 'VaultScope Cloud VPS — flexible virtual infrastructure built on Proxmox and Debian. EU-based datacentres, clean resource isolation, full root access.',
  breadcrumb: 'Cloud VPS',
  eyebrow: 'CLOUD VPS',
  heroTitle: 'Flexible virtual infrastructure.',
  heroDescription: 'Virtual compute on modern Proxmox-based infrastructure. Clean resource isolation, full root access, and transparent technology — built for applications, services, and development workloads.',
  useCases: {
    eyebrow: 'Use Cases',
    title: 'Built for real workloads.',
    items: [
      { title: 'Applications & Services', desc: 'Production web applications, APIs, microservices, and backend services.' },
      { title: 'Development Environments', desc: 'Isolated dev and staging environments that mirror production.' },
      { title: 'Databases', desc: 'Self-managed database instances with dedicated resources and storage.' },
      { title: 'Web Hosting', desc: 'Websites, CMS platforms, and static site generators with full control.' },
    ],
  },
  architecture: {
    eyebrow: 'Architecture',
    title: 'Modern virtualization infrastructure.',
    description: 'Built on Proxmox and Debian — open-source infrastructure you can understand and audit.',
    items: [
      { title: 'Proxmox Virtualization', desc: 'Enterprise-grade open-source hypervisor providing clean resource isolation between instances.' },
      { title: 'Debian Foundation', desc: 'Stable, production-grade Linux. Battle-tested in production for decades.' },
      { title: 'Full Root Access', desc: 'Complete control over your virtual machine. Install, configure, and manage anything.' },
      { title: 'EU Infrastructure', desc: 'All servers hosted in premium EU-based datacentres across NL, DE, FR, IT, and UK. GDPR-compliant by design.' },
      { title: 'Monitoring', desc: 'Infrastructure health tracked with Uptime Kuma and Beszel. Transparent observability.' },
      { title: 'No Vendor Lock-in', desc: 'Standard Linux VMs. Migrate in or out with standard tools at any time.' },
    ],
  },
  pricing: 'Specifications and pricing will be published at launch.',
  waitlist: {
    title: 'Be the first to know.',
    description: 'Cloud VPS services are currently in preparation. Leave your email and we\'ll notify you when they launch.',
  },
};

export const infrastructureDedicated = {
  title: 'Dedicated Servers — VaultScope',
  metaDescription: 'VaultScope Dedicated Servers — physical hardware with full resource ownership. No shared tenancy. EU-based datacentres.',
  breadcrumb: 'Dedicated Servers',
  eyebrow: 'DEDICATED SERVERS',
  heroTitle: 'Physical hardware. Full control.',
  heroDescription: 'Dedicated physical infrastructure with full resource ownership. No shared hardware, no resource contention — built for workloads that require consistent performance and direct hardware control.',
  differentiators: {
    eyebrow: 'Dedicated',
    title: '100% exclusive resources.',
    items: [
      { title: 'No Shared Resources', desc: 'Every CPU core, every byte of RAM, every disk operation belongs exclusively to you.' },
      { title: 'Full Hardware Ownership', desc: 'Physical hardware allocated entirely to your workloads. No noisy neighbors.' },
      { title: 'Direct Hardware Control', desc: 'Access to the full hardware stack. Configure BIOS, RAID, networking at the physical level.' },
      { title: 'Consistent Performance', desc: 'No virtualization overhead. Predictable, repeatable performance under any load.' },
    ],
  },
  useCases: {
    eyebrow: 'Use Cases',
    title: 'Built for demanding workloads.',
    items: [
      { title: 'Performance-Critical', desc: 'Applications that require guaranteed resources and minimal latency.' },
      { title: 'Large-Scale', desc: 'Services handling high traffic volumes that need predictable throughput.' },
      { title: 'Compliance', desc: 'Workloads with regulatory requirements around data isolation.' },
      { title: 'High Throughput', desc: 'Data-intensive operations that benefit from dedicated I/O and bandwidth.' },
    ],
  },
  technical: [
    { label: 'Operating System', value: 'Debian', note: 'Stable, production-grade Linux distribution.' },
    { label: 'Location', value: 'European Union', note: 'EU-based datacentres. GDPR compliant.' },
    { label: 'Infrastructure', value: 'Enterprise Hardware', note: 'Premium physical hardware.' },
  ],
  pricing: 'Specifications and pricing will be published at launch.',
  waitlist: {
    title: 'Be the first to know.',
    description: 'Dedicated Server services are currently in preparation. Leave your email and we\'ll notify you when they launch.',
  },
};

export const infrastructureManaged = {
  title: 'Managed Infrastructure — VaultScope',
  metaDescription: 'VaultScope Managed Infrastructure — custom architecture designed, deployed, and operated by engineers. EU-based, built on open-source technology.',
  breadcrumb: 'Managed',
  eyebrow: 'MANAGED INFRASTRUCTURE',
  heroTitle: 'Infrastructure, operated.',
  heroDescription: 'Custom architecture designed, deployed, and operated by engineers. From provisioning to monitoring to incident response — infrastructure without the operational overhead.',
  capabilities: {
    eyebrow: 'What’s included',
    title: 'Full lifecycle management.',
    items: [
      { title: 'Architecture Design', desc: 'Custom infrastructure architecture designed for your specific requirements and workloads.' },
      { title: 'Provisioning', desc: 'Servers provisioned, configured, and hardened according to the designed architecture.' },
      { title: 'Deployment', desc: 'Application deployment pipelines set up and managed. Zero-downtime deployments.' },
      { title: 'Monitoring', desc: 'Infrastructure health monitored 24/7. Uptime Kuma and Beszel for transparent observability.' },
      { title: 'Incident Response', desc: 'Issues detected and resolved by engineers. Direct communication, no ticket queues.' },
      { title: 'Maintenance', desc: 'Security patches, OS updates, and infrastructure maintenance handled proactively.' },
    ],
  },
  process: {
    eyebrow: 'Process',
    title: 'How it works.',
    steps: [
      { step: '01', title: 'Discovery', desc: 'We understand your requirements, workloads, and constraints.' },
      { step: '02', title: 'Architecture', desc: 'Custom infrastructure designed for your specific needs.' },
      { step: '03', title: 'Deployment', desc: 'Infrastructure provisioned, configured, and validated.' },
      { step: '04', title: 'Operations', desc: 'Ongoing monitoring, maintenance, and incident response.' },
    ],
  },
  whoItsFor: {
    eyebrow: 'Who it’s for',
    title: 'Built for teams that need infrastructure without the overhead.',
    items: [
      'Teams without dedicated infrastructure engineers',
      'Projects that need production-grade infrastructure from day one',
      'Organizations with compliance requirements around EU data residency',
      'Workloads that have outgrown shared hosting but don’t need a full platform team',
    ],
  },
  pricing: {
    title: 'Pricing',
    description: 'Managed Infrastructure is priced per project based on scope and requirements. Get in touch to discuss your needs.',
    cta: 'Get in Touch',
  },
};
