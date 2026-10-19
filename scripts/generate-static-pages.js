import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error(`[generate-static-pages] index.html not found at ${indexHtmlPath}. Run vite build first.`);
  process.exit(1);
}

const template = fs.readFileSync(indexHtmlPath, 'utf8');

/**
 * @typedef {Object} RouteMeta
 * @property {string} path
 * @property {string} title
 * @property {string} description
 * @property {string} [image]
 * @property {'website'|'article'} [type]
 */

/** @type {RouteMeta[]} */
const ROUTES = [
  // ─── English (Default) ──────────────────────────────────────────────────────
  {
    path: '/',
    title: 'VaultScope — Infrastructure and Software, Engineered Together',
    description: 'VaultScope builds Cloud VPS, Dedicated Servers, and software on transparent, open-source infrastructure. German engineering. EU infrastructure.',
  },
  {
    path: '/infrastructure',
    title: 'Infrastructure Overview — Cloud VPS, Dedicated & Storage',
    description: 'Enterprise Cloud VPS, bare-metal Dedicated Servers, and NVMe SFTP storage in premium European datacentres with unmetered bandwidth.',
  },
  {
    path: '/infrastructure/storage',
    title: 'SFTP & NVMe Cloud Storage',
    description: 'High-performance SFTP storage for your backup, clipping software, and automated file workflows. European data sovereignty, unmetered bandwidth, and zero egress fees.',
  },
  {
    path: '/infrastructure/cloud',
    title: 'Cloud VPS — Fast NVMe Virtual Private Servers',
    description: 'Modern Cloud VPS powered by AMD EPYC processors, enterprise NVMe storage, and 10 Gbps uplinks with automated DDoS protection.',
  },
  {
    path: '/infrastructure/dedicated',
    title: 'Dedicated Root Servers — Bare-Metal Power',
    description: '100% unshared bare-metal performance. Dedicated servers engineered for high workloads, virtualization, and maximum throughput.',
  },
  {
    path: '/infrastructure/managed',
    title: 'Managed Infrastructure — 24/7 Operations & Reliability',
    description: 'Fully managed infrastructure tailored to your business. Proactive monitoring, automated updates, backups, and guaranteed SLA.',
  },
  {
    path: '/deploy',
    title: 'ODP — Open Deployment Platform',
    description: 'One-click deployment engine for open-source applications, databases, and microservices with instant DNS and SSL provisioning.',
  },
  {
    path: '/software/camos',
    title: 'CAMOS — Cloud Administration & Management Operating System',
    description: 'The sovereign cloud control plane powering automated server provisioning, multi-tenant billing, job queues, and telemetry.',
  },
  {
    path: '/software/vamos',
    title: 'VAMOS — High-Speed Open Source Storage & Backup',
    description: 'VaultScope Advanced Modular Object & Storage system. Distributed, encrypted, and designed for mission-critical backups.',
  },
  {
    path: '/software/pegasus',
    title: 'Project Pegasus — Autonomous Cloud Ecosystem',
    description: 'Next-generation autonomous infrastructure orchestrator bridging bare-metal hardware and modern microservices.',
  },
  {
    path: '/company/about',
    title: 'About VaultScope — Independent Cloud & Software Engineering',
    description: 'Learn about VaultScope\'s mission: delivering transparent, high-performance infrastructure and open-source software engineered in Germany.',
  },
  {
    path: '/company/team',
    title: 'Team & Engineering Philosophy',
    description: 'Meet the engineers and operators behind VaultScope building next-generation sovereign infrastructure.',
  },
  {
    path: '/company/open-source',
    title: 'Open Source Commitment',
    description: 'Explore our open-source repositories, architectural standards, and public code contributions.',
  },
  {
    path: '/company/contact',
    title: 'Contact & Enterprise Support',
    description: 'Get in touch with the VaultScope engineering team for enterprise deployments, custom setups, or technical support.',
  },
  {
    path: '/company/roadmap',
    title: 'Roadmap — VaultScope Infrastructure & Software Milestones',
    description: 'Explore the VaultScope engineering roadmap from Q4 2026 through Q3 2027 across SFTP storage, Cloud VPS, Dedicated Servers, iOS app, and platform automation.',
  },
  {
    path: '/resources/blog',
    title: 'Engineering Blog & Technical Insights',
    description: 'Deep dives into cloud architecture, Rust backend development, Linux storage systems, and infrastructure automation.',
  },
  {
    path: '/resources/forum',
    title: 'Community & Developer Forum',
    description: 'Connect with developers, share feedback on new features, and discuss cloud infrastructure with the VaultScope team.',
  },
  {
    path: '/legal/privacy',
    title: 'Privacy Policy (Datenschutzerklärung)',
    description: 'VaultScope privacy policy and GDPR compliance details. Complete transparency on how your data is handled and protected in the EU.',
  },
  {
    path: '/legal/terms',
    title: 'Terms of Service (AGB)',
    description: 'General terms and conditions for VaultScope cloud infrastructure, storage, and software services.',
  },
  {
    path: '/legal/imprint',
    title: 'Imprint (Impressum)',
    description: 'Legal disclosure and corporate details for VaultScope in accordance with German telemedia law.',
  },
  {
    path: '/legal/hosting-terms',
    title: 'Special Hosting Terms',
    description: 'Specific contractual conditions for hosting, compute nodes, server provisioning, and network availability.',
  },
  {
    path: '/legal/cancellation',
    title: 'Cancellation Policy (Widerrufsbelehrung)',
    description: 'Right of withdrawal and cancellation procedures for consumers purchasing digital infrastructure services.',
  },
  {
    path: '/legal/aup',
    title: 'Acceptable Use Policy',
    description: 'Guidelines and network restrictions regarding acceptable activities on VaultScope cloud infrastructure.',
  },
  {
    path: '/legal/dpa',
    title: 'Data Processing Agreement (AVV)',
    description: 'Standard contractual clauses and data processing agreement pursuant to Article 28 of the GDPR.',
  },

  // ─── German Localized Routes (/de/...) ───────────────────────────────────────
  {
    path: '/de',
    title: 'VaultScope — Infrastruktur und Software, gemeinsam entwickelt',
    description: 'VaultScope baut Cloud VPS, Dedizierte Server und Software auf transparenter Open-Source-Infrastruktur. Deutsche Ingenieurskunst. EU-Infrastruktur.',
  },
  {
    path: '/de/infrastructure',
    title: 'Infrastruktur-Übersicht — Cloud VPS, Dedicated & Storage',
    description: 'Enterprise Cloud VPS, Bare-Metal Dedicated Server und NVMe SFTP-Speicher in europäischen Premium-Rechenzentren.',
  },
  {
    path: '/de/infrastructure/storage',
    title: 'SFTP & NVMe Cloud-Speicher',
    description: 'Hochleistungs-SFTP-Speicher für Backups, Clipping-Tools und automatisierte File-Workflows. DSGVO-konform, unlimitierte Bandbreite, keine Egress-Kosten.',
  },
  {
    path: '/de/infrastructure/cloud',
    title: 'Cloud VPS — Schnelle NVMe Virtual Private Server',
    description: 'Moderne Cloud VPS mit AMD EPYC Prozessoren, Enterprise-NVMe-Speicher und 10 Gbps Uplinks mit automatisiertem DDoS-Schutz.',
  },
  {
    path: '/de/infrastructure/dedicated',
    title: 'Dedizierte Root-Server — Pure Bare-Metal-Leistung',
    description: '100% ungeteilte Bare-Metal-Performance. Dedizierte Server für anspruchsvolle Workloads, Virtualisierung und maximalen Durchsatz.',
  },
  {
    path: '/de/infrastructure/managed',
    title: 'Managed Infrastructure — 24/7 Betrieb & Zuverlässigkeit',
    description: 'Vollständig verwaltete Infrastruktur für Ihr Unternehmen. Proaktives Monitoring, automatische Updates, Backups und garantierte SLAs.',
  },
  {
    path: '/de/deploy',
    title: 'ODP — Open Deployment Platform',
    description: 'One-Click-Deployment-Engine für Open-Source-Anwendungen, Datenbanken und Microservices mit automatischer DNS- und SSL-Bereitstellung.',
  },
  {
    path: '/de/software/camos',
    title: 'CAMOS — Cloud Administration & Management Operating System',
    description: 'Das souveräne Cloud-Control-Plane für automatisierte Server-Provisionierung, Multi-Tenant-Billing und Telemetrie.',
  },
  {
    path: '/de/software/vamos',
    title: 'VAMOS — High-Speed Open-Source Storage & Backup',
    description: 'VaultScope Advanced Modular Object & Storage System. Verteilt, verschlüsselt und optimiert für unternehmenskritische Backups.',
  },
  {
    path: '/de/software/pegasus',
    title: 'Projekt Pegasus — Autonomes Cloud-Ökosystem',
    description: 'Der autonome Infrastruktur-Orchestrator der nächsten Generation, der Bare-Metal-Hardware mit modernen Microservices verbindet.',
  },
  {
    path: '/de/company/about',
    title: 'Über VaultScope — Unabhängiges Cloud- & Software-Engineering',
    description: 'Erfahren Sie mehr über unsere Mission: Transparente Hochleistungs-Infrastruktur und Open-Source-Software aus Deutschland.',
  },
  {
    path: '/de/company/team',
    title: 'Team & Philosophie',
    description: 'Lernen Sie das Team und die Entwickler hinter VaultScope kennen, die souveräne Cloud-Infrastruktur aufbauen.',
  },
  {
    path: '/de/company/open-source',
    title: 'Open-Source-Engagement',
    description: 'Entdecken Sie unsere Open-Source-Repositories, Architektur-Standards und Beiträge zur Community.',
  },
  {
    path: '/de/company/contact',
    title: 'Kontakt & Enterprise-Support',
    description: 'Kontaktieren Sie das VaultScope-Team für Enterprise-Deployments, individuelle Setups oder technischen Support.',
  },
  {
    path: '/de/company/roadmap',
    title: 'Roadmap — VaultScope Infrastruktur- & Software-Meilensteine',
    description: 'Entdecken Sie die VaultScope Engineering-Roadmap von Q4 2026 bis Q3 2027 für SFTP-Storage, Cloud VPS, Dedicated Server, iOS-App und Plattform-Automatisierung.',
  },
  {
    path: '/de/resources/blog',
    title: 'Engineering-Blog & Technische Einblicke',
    description: 'Detaillierte Artikel über Cloud-Architektur, Rust-Entwicklung, Linux-Storage-Systeme und Infrastruktur-Automatisierung.',
  },
  {
    path: '/de/legal/privacy',
    title: 'Datenschutzerklärung',
    description: 'Informationen zur Verarbeitung personenbezogener Daten und Ihren Rechten gemäß DSGVO bei VaultScope.',
  },
  {
    path: '/de/legal/terms',
    title: 'Allgemeine Geschäftsbedingungen (AGB)',
    description: 'Allgemeine Geschäftsbedingungen für die Nutzung der Cloud- und Hosting-Dienstleistungen von VaultScope.',
  },
  {
    path: '/de/legal/imprint',
    title: 'Impressum',
    description: 'Gesetzliche Anbieterkennzeichnung der VaultScope gemäß § 5 TMG.',
  },
];

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function generateHtml(route) {
  const fullTitle = route.title.includes('VaultScope')
    ? route.title
    : `${route.title} — VaultScope`;
  const canonicalUrl = `https://vaultscope.de${route.path === '/' ? '' : route.path}`;
  const image = route.image || 'https://vaultscope.de/og-image.png';
  const type = route.type || 'website';

  let html = template;

  // Replace <title>
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(fullTitle)}</title>`);

  // Replace <meta name="description" ...>
  html = html.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/s,
    `<meta name="description" content="${escapeHtml(route.description)}" />`
  );

  // Replace og:title
  html = html.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/s,
    `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`
  );

  // Replace og:description
  html = html.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/s,
    `<meta property="og:description" content="${escapeHtml(route.description)}" />`
  );

  // Replace og:url
  html = html.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/s,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`
  );

  // Replace og:image
  html = html.replace(
    /<meta\s+property="og:image"\s+content=".*?"\s*\/?>/s,
    `<meta property="og:image" content="${escapeHtml(image)}" />`
  );

  // Replace og:type
  html = html.replace(
    /<meta\s+property="og:type"\s+content=".*?"\s*\/?>/s,
    `<meta property="og:type" content="${escapeHtml(type)}" />`
  );

  // Replace twitter:title
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/s,
    `<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />`
  );

  // Replace twitter:description
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/s,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`
  );

  // Replace twitter:image
  html = html.replace(
    /<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/s,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`
  );

  // Replace canonical link
  html = html.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/s,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`
  );

  // Ensure theme-color exists (for Discord colored embed border)
  if (!html.includes('name="theme-color"')) {
    html = html.replace(
      '</head>',
      '    <meta name="theme-color" content="#2563eb" />\n  </head>'
    );
  }

  return html;
}

console.log(`[generate-static-pages] Pre-generating ${ROUTES.length} static HTML pages for social embeds...`);

let count = 0;
for (const route of ROUTES) {
  const generatedHtml = generateHtml(route);

  if (route.path === '/') {
    fs.writeFileSync(indexHtmlPath, generatedHtml, 'utf8');
    count++;
    continue;
  }

  // Target directory inside dist, e.g. dist/infrastructure/storage
  const relPath = route.path.replace(/^\//, '');
  const targetDir = path.join(distDir, relPath);
  fs.mkdirSync(targetDir, { recursive: true });

  const targetFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetFile, generatedHtml, 'utf8');
  count++;
}

console.log(`[generate-static-pages] Successfully generated ${count} rich embed HTML files!`);
