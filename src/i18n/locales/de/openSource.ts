export const openSource = {
  title: 'Open Source — VaultScope',
  breadcrumb: 'Open Source',
};

export const openSourcePage = {
  metaDescription: 'Der Open-Source- und Self-Hosted-Technology-Stack im VaultScope-Ökosystem. Debian, Forgejo, Voltius, OpenCode und mehr.',
  eyebrow: 'OPEN SOURCE & INFRASTRUKTUR',
  heroTitle: 'Aufgebaut auf Open Source.',
  heroDescription: 'VaultScopes Hosting-Infrastruktur wird mit einem kuratierten Stack aus Open-Source- und Self-Hosted-Technologien betrieben. Das steckt hinter dem Stack.',
  infraSectionEyebrow: '01 // Infrastruktur',
  infraSectionTitle: 'Technologien, die VaultScope nutzt.',
  infraSectionDescription: 'Die folgenden Tools und Plattformen bilden die operative Infrastruktur hinter VaultScopes Hosting-Umgebung. Das sind Technologien, auf die VaultScope setzt — keine Software, die VaultScope entwickelt.',
  infraStackLabel: 'Infrastruktur-Stack',
  devStackLabel: 'Entwicklungs-Stack',
  infraStack: [
    { name: 'Proxmox', category: 'Virtualisierung', desc: 'Open-Source-Virtualisierungsplattform für VaultScopes interne Infrastruktur und Service-Management.' },
    { name: 'Debian', category: 'Betriebssystem', desc: 'Stabile, produktionsreife Linux-Distribution. Das Betriebssystem-Fundament der gesamten VaultScope-Server-Infrastruktur.' },
    { name: 'Coolify', category: 'Deployment', desc: 'Self-Hosted Application-Deployment- und Management-Plattform. Übernimmt Container-Deployments, Umgebungskonfiguration und Service-Lifecycle-Management.' },
    { name: 'Forgejo', category: 'Git-Hosting', desc: 'Self-Hosted Git-Plattform für Versionskontrolle und Entwicklungszusammenarbeit. VaultScopes Entwicklungsinfrastruktur läuft auf Forgejo.' },
    { name: 'Uptime Kuma', category: 'Uptime-Monitoring', desc: 'Self-Hosted Monitoring-Tool zur Überwachung der Service-Verfügbarkeit und Uptime über den gesamten VaultScope-Infrastruktur-Stack.' },
    { name: 'Beszel', category: 'Server-Monitoring', desc: 'Leichtgewichtiges Infrastruktur-Monitoring in VaultScopes Server-Umgebung für Ressourcen- und System-Health-Tracking.' },
    { name: 'Mailcow', category: 'E-Mail-Server', desc: 'Self-Hosted E-Mail-Server-Suite mit IMAP, SMTP und Webmail. Betreibt VaultScopes E-Mail-Infrastruktur mit voller Kontrolle über Mail-Zustellung und Domain-Management.' },
    { name: 'Listmonk', category: 'Mailing & Newsletter', desc: 'Self-Hosted Newsletter- und Mailinglisten-Manager. Verwaltet Wartelisten-Anmeldungen, Produkt-Ankündigungen und transaktionale E-Mail-Kampagnen.' },
  ],
  devStack: [
    { name: 'Voltius', category: 'Infrastruktur-Tooling', desc: 'Infrastruktur-Tooling im VaultScope-Ökosystem für interne operative Workflows.' },
    { name: 'OpenCode', category: 'Entwicklungs-Tooling', desc: 'KI-gestütztes Entwicklungs-Tooling im VaultScope-Entwicklungsworkflow für Code-Assistenz und Engineering-Aufgaben.' },
  ],
  whyEyebrow: '02 // Philosophie',
  whyTitle: 'Warum Open Source für uns zählt.',
  whyReasons: [
    { title: 'Transparenz', desc: 'Open-Source-Infrastruktur ist auditierbare Infrastruktur. Zu verstehen, was Ihre Systeme antreibt, sollte kein Rätselraten erfordern.' },
    { title: 'Kontrolle', desc: 'Self-Hosted-Tooling hält die operative Kontrolle beim Infrastruktur-Team. Kein Vendor Lock-in, keine versteckten Abhängigkeiten.' },
    { title: 'Community', desc: 'Die Tools, die wir nutzen, werden von aktiven Open-Source-Communities gebaut und gepflegt. Wir profitieren von dieser Arbeit und wollen etwas zurückgeben.' },
  ],
  softwareEyebrow: '03 // Software',
  softwareTitle: 'Software, die VaultScope entwickelt.',
  softwareDescription: 'Abgegrenzt von den oben genannten Technologien entwickelt VaultScope auch eigene Software. Das sind Projekte, die vom VaultScope-Team gebaut und gepflegt werden.',
  projects: [
    {
      tag: 'Discord-Plattform',
      title: 'Pegasus',
      desc: 'Eine umfassende Discord-Community-Management-Plattform. Moderation, Economy, XP-Leveling, Ticketsystem, Giveaways und ein vollständiges Web-Dashboard. Quelloffen unter der PolyForm Noncommercial-Lizenz.',
      tags: ['PolyForm Noncommercial', 'TypeScript', 'discord.js v14'],
    },
    {
      tag: 'Web-Dashboard',
      title: 'Pegasus Dashboard',
      desc: 'Das Web-Management-Interface für Pegasus. Guild-Management, Modul-Konfiguration, Echtzeit-Analytics und öffentliche Leaderboards. Gebaut mit Next.js. Quelloffen unter der PolyForm Noncommercial-Lizenz.',
      tags: ['PolyForm Noncommercial', 'TypeScript', 'Next.js'],
    },
  ],
  viewRepository: 'Repository ansehen',
};
