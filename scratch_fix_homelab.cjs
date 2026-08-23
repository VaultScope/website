const fs = require('fs');

const replacements = [
  // home.ts (en/de)
  {
    file: 'src/i18n/locales/en/home.ts',
    from: /Proxmox, Debian, Coolify, Uptime Kuma, Beszel, Forgejo/g,
    to: 'Proxmox, Debian, Docker, Forgejo'
  },
  {
    file: 'src/i18n/locales/de/home.ts',
    from: /Proxmox, Debian, Coolify, Uptime Kuma, Beszel, Forgejo/g,
    to: 'Proxmox, Debian, Docker, Forgejo'
  },
  {
    file: 'src/i18n/locales/en/home.ts',
    from: /{ name: 'COOLIFY', category: 'Deployment', desc: 'Self-hosted application management' },/g,
    to: "{ name: 'DOCKER', category: 'Containerization', desc: 'Industry-standard container management' },"
  },
  {
    file: 'src/i18n/locales/de/home.ts',
    from: /{ name: 'COOLIFY', category: 'Deployment', desc: 'Self-Hosted Application Management' },/g,
    to: "{ name: 'DOCKER', category: 'Containerization', desc: 'Industry-standard container management' },"
  },
  // Home.tsx
  {
    file: 'src/pages/Home.tsx',
    from: /{ name: 'COOLIFY', category: 'Deployment', desc: 'Self-hosted application management' },/g,
    to: "{ name: 'DOCKER', category: 'Containerization', desc: 'Industry-standard container management' },"
  },
  // infrastructure.ts (en/de)
  {
    file: 'src/i18n/locales/en/infrastructure.ts',
    from: /Monitored with Uptime Kuma and Beszel\. Deployed with Coolify\./g,
    to: 'Enterprise-grade monitoring and automated deployment pipelines.'
  },
  {
    file: 'src/i18n/locales/de/infrastructure.ts',
    from: /Überwacht mit Uptime Kuma und Beszel\. Deployed mit Coolify\./g,
    to: 'Enterprise-grade Monitoring und automatisierte Deployment-Pipelines.'
  },
  // InfrastructureOverview.tsx
  {
    file: 'src/pages/InfrastructureOverview.tsx',
    from: /Monitored with Uptime Kuma and Beszel\. Deployed with Coolify\./g,
    to: 'Enterprise-grade monitoring and automated deployment pipelines.'
  },
  // openSource.ts (en/de)
  {
    file: 'src/i18n/locales/en/openSource.ts',
    from: /Debian, Coolify, Forgejo, Uptime Kuma, Beszel, Voltius, OpenCode/g,
    to: 'Debian, Forgejo, Voltius, OpenCode'
  },
  {
    file: 'src/i18n/locales/de/openSource.ts',
    from: /Debian, Coolify, Forgejo, Uptime Kuma, Beszel, Voltius, OpenCode/g,
    to: 'Debian, Forgejo, Voltius, OpenCode'
  },
  // OpenSource.tsx
  {
    file: 'src/pages/OpenSource.tsx',
    from: /Debian, Coolify, Forgejo, Uptime Kuma, Beszel, Voltius, OpenCode/g,
    to: 'Debian, Forgejo, Voltius, OpenCode'
  }
];

replacements.forEach(({ file, from, to }) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content.replace(from, to);
    if (content !== newContent) {
      fs.writeFileSync(file, newContent);
      console.log(`Updated ${file}`);
    }
  }
});
