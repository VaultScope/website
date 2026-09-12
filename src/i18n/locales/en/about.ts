export const about = {
  title: 'About — VaultScope',
  breadcrumb: 'About',
  eyebrow: 'COMPANY',
  heroTitle: 'What is VaultScope?',
  heroDescription: 'VaultScope is an infrastructure and software company. We build and operate cloud infrastructure, deployment tools, and software — engineered together as a unified platform.',
  whatWeBuild: {
    title: 'What we build',
    infrastructure: { title: 'Infrastructure', desc: 'Cloud VPS, Dedicated Servers, and Managed Infrastructure. EU-based, built on Proxmox and Debian, operated on OVH hardware.' },
    deploy: { title: 'Deploy', desc: 'A one-click deployment platform for pre-configured services. Minecraft Servers, Code Servers, Databases, and Pegasus.' },
    software: { title: 'Software', desc: 'Pegasus — a Discord bot framework for moderation, management, and community tools.' },
  },
  whyWeExist: {
    title: 'Why we exist',
    description: 'Most infrastructure providers optimize for scale. We optimize for engineering quality. Every decision at VaultScope is an engineering decision — from the infrastructure we choose, to how we communicate, to how we price.',
  },
  principles: {
    title: 'Principles',
    engineering: { title: 'Engineering', desc: 'Every decision is an engineering decision. No marketing-driven features, no growth hacks, no complexity without purpose.' },
    transparency: { title: 'Transparency', desc: 'Open-source tooling, public infrastructure choices, honest communication about what we can and cannot do.' },
    control: { title: 'Control', desc: 'You own your data, your configuration, your infrastructure. No vendor lock-in, no proprietary formats.' },
    service: { title: 'Personal Service', desc: 'Direct access to the engineers who build and operate your infrastructure. No ticket queues, no chatbots.' },
  },
  cta: 'Get in Touch',
} as const;

export const aboutPage = {
  metaDescription: 'VaultScope is an infrastructure and software company. Building Cloud VPS, Dedicated Servers, and software on transparent, open-source infrastructure.',
  heroTitle: 'About VaultScope',
  heroDescription: 'Infrastructure and software, engineered together. Building Cloud VPS, Dedicated Servers, and software on a modern, transparent technology stack.',
  whatIs: {
    title: 'What is VaultScope?',
    description: 'VaultScope is an infrastructure and software company. We build and operate Cloud VPS, Dedicated Servers, and Managed Infrastructure — alongside software products like Pegasus. Everything runs on a curated open-source stack that we control, understand, and can stand behind.',
  },
  whatWeBuild: {
    title: 'What we build',
    infrastructure: 'Cloud VPS, Dedicated Servers, and Managed Infrastructure services built on EU-based infrastructure with Proxmox, Debian, and open-source tooling.',
    deploy: 'A one-click deployment platform for pre-configured services on managed infrastructure.',
    software: 'Pegasus is a Discord community management platform built and operated on VaultScope\'s own infrastructure. Source-available under the PolyForm Noncommercial license.',
  },
  whyWeExist: {
    title: 'Why we exist',
    description: 'VaultScope exists to build and operate infrastructure that we are proud to stand behind. We believe in transparency about how our systems are built, what technology we use, and what we are working toward. Open-source tooling, self-hosted infrastructure, and a straightforward approach to engineering.',
  },
  principles: {
    eyebrow: 'Principles',
    title: 'How we approach our work.',
    items: [
      { n: '01', title: 'Engineering', desc: 'Infrastructure designed deliberately instead of assembled from layers of abstraction. Every component has purpose.' },
      { n: '02', title: 'Transparency', desc: 'Infrastructure should be understandable, observable, and controllable. We use only open technologies we can inspect.' },
      { n: '03', title: 'Control', desc: 'Your infrastructure should behave like your infrastructure. Full root access, complete control, no vendor lock-in.' },
      { n: '04', title: 'Personal Service', desc: 'Direct engineering support from the people who build and operate the infrastructure. No ticket queues, no generic responses.' },
    ],
  },
} as const;
