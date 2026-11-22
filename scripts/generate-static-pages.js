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
const DOMAIN = 'https://vaultscope.de';

/**
 * @typedef {Object} RouteMeta
 * @property {string} path
 * @property {string} title
 * @property {string} description
 * @property {string} [image]
 * @property {'website'|'article'} [type]
 * @property {string} [priority]
 * @property {string} [changefreq]
 * @property {string[]} [bodyParagraphs]
 */

/** @type {RouteMeta[]} */
const BASE_ROUTES = [
  // ─── English (Default) ──────────────────────────────────────────────────────
  {
    path: '/',
    title: 'VaultScope — Infrastructure and Software, Engineered Together',
    description: 'VaultScope builds Cloud VPS, Dedicated Servers, and software on transparent, open-source infrastructure. German engineering. EU infrastructure.',
    priority: '1.0',
    changefreq: 'weekly',
  },
  {
    path: '/infrastructure',
    title: 'Infrastructure Overview — Cloud VPS, Dedicated & Storage',
    description: 'Enterprise Cloud VPS, bare-metal Dedicated Servers, and NVMe SFTP storage in premium European datacentres with unmetered bandwidth.',
    priority: '0.9',
    changefreq: 'weekly',
  },
  {
    path: '/infrastructure/storage',
    title: 'SFTP & NVMe Cloud Storage',
    description: 'High-performance SFTP storage for your backup, clipping software, and automated file workflows. European data sovereignty, unmetered bandwidth, and zero egress fees.',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    path: '/infrastructure/cloud',
    title: 'Cloud VPS — Fast NVMe Virtual Private Servers',
    description: 'Modern Cloud VPS powered by AMD EPYC processors, enterprise NVMe storage, and 10 Gbps uplinks with automated DDoS protection.',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    path: '/infrastructure/dedicated',
    title: 'Dedicated Root Servers — Bare-Metal Power',
    description: '100% unshared bare-metal performance. Dedicated servers engineered for high workloads, virtualization, and maximum throughput.',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    path: '/infrastructure/managed',
    title: 'Managed Infrastructure — 24/7 Operations & Reliability',
    description: 'Fully managed infrastructure tailored to your business. Proactive monitoring, automated updates, backups, and guaranteed SLA.',
    priority: '0.7',
    changefreq: 'weekly',
  },
  {
    path: '/deploy',
    title: 'ODP — Open Deployment Platform',
    description: 'One-click deployment engine for open-source applications, databases, and microservices with instant DNS and SSL provisioning.',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    path: '/software/camos',
    title: 'CAMOS — Cloud Administration & Management Operating System',
    description: 'The sovereign cloud control plane powering automated server provisioning, multi-tenant billing, job queues, and telemetry.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    path: '/software/vamos',
    title: 'VAMOS — High-Speed Open Source Storage & Backup',
    description: 'VaultScope Advanced Modular Object & Storage system. Distributed, encrypted, and designed for mission-critical backups.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    path: '/software/pegasus',
    title: 'Project Pegasus — Autonomous Cloud Ecosystem',
    description: 'Next-generation autonomous infrastructure orchestrator bridging bare-metal hardware and modern microservices.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    path: '/company/about',
    title: 'About VaultScope — Independent Cloud & Software Engineering',
    description: "Learn about VaultScope's mission: delivering transparent, high-performance infrastructure and open-source software engineered in Germany.",
    priority: '0.6',
    changefreq: 'monthly',
  },
  {
    path: '/company/team',
    title: 'Team & Engineering Philosophy',
    description: 'Meet the engineers and operators behind VaultScope building next-generation sovereign infrastructure.',
    priority: '0.5',
    changefreq: 'monthly',
  },
  {
    path: '/company/open-source',
    title: 'Open Source Commitment',
    description: 'Explore our open-source repositories, architectural standards, and public code contributions.',
    priority: '0.6',
    changefreq: 'monthly',
  },
  {
    path: '/company/contact',
    title: 'Contact & Enterprise Support',
    description: 'Get in touch with the VaultScope engineering team for enterprise deployments, custom setups, or technical support.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    path: '/company/roadmap',
    title: 'Roadmap — VaultScope Infrastructure & Software Milestones',
    description: 'Explore the VaultScope engineering roadmap from Q4 2026 through Q3 2027 across SFTP storage, Cloud VPS, Dedicated Servers, iOS app, and platform automation.',
    priority: '0.6',
    changefreq: 'monthly',
  },
  {
    path: '/company/partners',
    title: 'Technology & Infrastructure Partners',
    description: 'Explore VaultScope infrastructure partnerships and ecosystem integrations across Europe.',
    priority: '0.5',
    changefreq: 'monthly',
  },
  {
    path: '/docs',
    title: 'Documentation — VaultScope Infrastructure & Software',
    description: 'Technical guides, architecture references, customer onboarding, and API documentation for VaultScope.',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    path: '/resources/blog',
    title: 'Engineering Blog & Technical Insights',
    description: 'Deep dives into cloud architecture, Rust backend development, Linux storage systems, and infrastructure automation.',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    path: '/resources/forum',
    title: 'Community & Developer Forum',
    description: 'Connect with developers, share feedback on new features, and discuss cloud infrastructure with the VaultScope team.',
    priority: '0.6',
    changefreq: 'weekly',
  },
  {
    path: '/guides',
    title: 'Technical Infrastructure Guides',
    description: 'Practical guides on EU Cloud VPS, GDPR-compliant hosting, encrypted SFTP backup storage, and dedicated bare-metal servers.',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    path: '/guides/eu-cloud-vps-gdpr-hosting',
    title: 'GDPR-Compliant Cloud VPS Hosting in Germany & the EU',
    description: 'How sovereign European Cloud VPS infrastructure with AMD EPYC CPUs, NVMe storage, and an Art. 28 GDPR DPA protects business workloads.',
    type: 'article',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/guides/encrypted-sftp-backup-storage-zfs',
    title: 'Encrypted SFTP Backup Storage on Redundant ZFS Nodes',
    description: 'Using chroot-isolated SFTP storage powered by SFTPGo and ZFS for automated Linux backups, BorgBackup, Restic, and media workflows.',
    type: 'article',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/guides/dedicated-bare-metal-ddos-protection',
    title: 'Dedicated Bare-Metal Root Servers: Single-Tenant Performance',
    description: 'When to choose dedicated bare-metal servers over VPS, how custom hardware configurations work, and what to expect during provisioning.',
    type: 'article',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/guides/one-click-self-hosted-apps-eu',
    title: 'One-Click Deploy (OCD): Self-Hosting Open-Source Apps in Europe',
    description: 'Deploy open-source applications and containers on sovereign EU infrastructure with automated orchestration via VaultScope OCD.',
    type: 'article',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/guides/vps-vs-dedicated-server-comparison',
    title: 'Cloud VPS vs. Dedicated Root Server: Architecture & Workload Guide',
    description: 'Technical comparison between Cloud VPS and Dedicated Bare-Metal Servers: CPU isolation, NVMe I/O, billing cycles, and provisioning times.',
    type: 'article',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/guides/sftp-storage-vs-s3-object-storage',
    title: 'SFTP Storage vs. S3 Object Storage: Egress Costs & Backup Workflows',
    description: 'Comparing chroot-isolated SFTP storage on ZFS against S3 object storage for Linux backups, video archives, and predictable European hosting.',
    type: 'article',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/guides/linux-vps-hardening-ssh-2fa-checklist',
    title: 'Hardening a Linux Cloud VPS: SSH Keys, Firewall & 2FA Checklist',
    description: 'Practical security checklist for new Linux VPS deployments: Ed25519 SSH keys, disabling password auth, firewalling, and portal 2FA.',
    type: 'article',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/guides/proxmox-kvm-virtualization-bare-metal',
    title: 'Running Proxmox VE & KVM Virtualization on Dedicated Bare Metal',
    description: 'Why dedicated bare-metal servers are ideal for Proxmox VE clusters, nested isolation, ZFS storage pools, and custom network bridges.',
    type: 'article',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/guides/borgbackup-restic-offsite-sftp-guide',
    title: 'Automated Offsite Backups with BorgBackup & Restic over SFTP',
    description: 'Step-by-step pattern for encrypted, deduplicated Linux server backups to VaultScope SFTP Storage using BorgBackup or Restic.',
    type: 'article',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/guides/german-hosting-gdpr-dpa-compliance-guide',
    title: 'GDPR Hosting in Germany: Art. 28 DPA, Data Residency & EU Invoicing',
    description: 'What German and EU businesses need for compliant cloud hosting: Art. 28 GDPR Data Processing Agreement, EU sub-processors, and DIN 5008 PDF invoices.',
    type: 'article',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/legal/privacy',
    title: 'Privacy Policy (Datenschutzerklärung)',
    description: 'VaultScope privacy policy and GDPR compliance details. Complete transparency on how your data is handled and protected in the EU.',
    priority: '0.3',
    changefreq: 'monthly',
  },
  {
    path: '/legal/terms',
    title: 'Terms of Service (AGB)',
    description: 'General terms and conditions for VaultScope cloud infrastructure, storage, and software services.',
    priority: '0.3',
    changefreq: 'monthly',
  },
  {
    path: '/legal/imprint',
    title: 'Imprint (Impressum)',
    description: 'Legal disclosure and corporate details for VaultScope pursuant to § 5 DDG and Art. 11/12 DSA.',
    priority: '0.3',
    changefreq: 'monthly',
  },
  {
    path: '/legal/hosting-terms',
    title: 'Special Hosting Terms',
    description: 'Specific contractual conditions for hosting, compute nodes, server provisioning, and network availability.',
    priority: '0.3',
    changefreq: 'monthly',
  },
  {
    path: '/legal/cancellation',
    title: 'Cancellation Policy (Widerrufsbelehrung)',
    description: 'Right of withdrawal and cancellation procedures for consumers purchasing digital infrastructure services.',
    priority: '0.3',
    changefreq: 'monthly',
  },
  {
    path: '/legal/aup',
    title: 'Acceptable Use Policy',
    description: 'Guidelines and network restrictions regarding acceptable activities on VaultScope cloud infrastructure.',
    priority: '0.3',
    changefreq: 'monthly',
  },
  {
    path: '/legal/dpa',
    title: 'Data Processing Agreement (AVV)',
    description: 'Data processing agreement pursuant to Article 28 of the GDPR.',
    priority: '0.3',
    changefreq: 'monthly',
  },

  // ─── German Localized Routes (/de/...) ───────────────────────────────────────
  {
    path: '/de',
    title: 'VaultScope — Infrastruktur und Software, gemeinsam entwickelt',
    description: 'VaultScope baut Cloud VPS, Dedizierte Server und Software auf transparenter Open-Source-Infrastruktur. Deutsche Ingenieurskunst. EU-Infrastruktur.',
    priority: '1.0',
    changefreq: 'weekly',
  },
  {
    path: '/de/infrastructure',
    title: 'Infrastruktur-Übersicht — Cloud VPS, Dedicated & Storage',
    description: 'Enterprise Cloud VPS, Bare-Metal Dedicated Server und NVMe SFTP-Speicher in europäischen Premium-Rechenzentren.',
    priority: '0.9',
    changefreq: 'weekly',
  },
  {
    path: '/de/infrastructure/storage',
    title: 'SFTP & NVMe Cloud-Speicher',
    description: 'Hochleistungs-SFTP-Speicher für Backups, Clipping-Tools und automatisierte File-Workflows. DSGVO-konform, unlimitierte Bandbreite, keine Egress-Kosten.',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    path: '/de/infrastructure/cloud',
    title: 'Cloud VPS — Schnelle NVMe Virtual Private Server',
    description: 'Moderne Cloud VPS mit AMD EPYC Prozessoren, Enterprise-NVMe-Speicher und 10 Gbps Uplinks mit automatisiertem DDoS-Schutz.',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    path: '/de/infrastructure/dedicated',
    title: 'Dedizierte Root-Server — Pure Bare-Metal-Leistung',
    description: '100% ungeteilte Bare-Metal-Performance. Dedizierte Server für anspruchsvolle Workloads, Virtualisierung und maximalen Durchsatz.',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    path: '/de/infrastructure/managed',
    title: 'Managed Infrastructure — 24/7 Betrieb & Zuverlässigkeit',
    description: 'Vollständig verwaltete Infrastruktur für Ihr Unternehmen. Proaktives Monitoring, automatische Updates, Backups und garantierte SLAs.',
    priority: '0.7',
    changefreq: 'weekly',
  },
  {
    path: '/de/deploy',
    title: 'ODP — Open Deployment Platform',
    description: 'One-Click-Deployment-Engine für Open-Source-Anwendungen, Datenbanken und Microservices mit automatischer DNS- und SSL-Bereitstellung.',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    path: '/de/software/camos',
    title: 'CAMOS — Cloud Administration & Management Operating System',
    description: 'Das souveräne Cloud-Control-Plane für automatisierte Server-Provisionierung, Multi-Tenant-Billing und Telemetrie.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    path: '/de/software/vamos',
    title: 'VAMOS — High-Speed Open-Source Storage & Backup',
    description: 'VaultScope Advanced Modular Object & Storage System. Verteilt, verschlüsselt und optimiert für unternehmenskritische Backups.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    path: '/de/software/pegasus',
    title: 'Projekt Pegasus — Autonomes Cloud-Ökosystem',
    description: 'Der autonome Infrastruktur-Orchestrator der nächsten Generation, der Bare-Metal-Hardware mit modernen Microservices verbindet.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    path: '/de/company/about',
    title: 'Über VaultScope — Unabhängiges Cloud- & Software-Engineering',
    description: 'Erfahren Sie mehr über unsere Mission: Transparente Hochleistungs-Infrastruktur und Open-Source-Software aus Deutschland.',
    priority: '0.6',
    changefreq: 'monthly',
  },
  {
    path: '/de/company/team',
    title: 'Team & Philosophie',
    description: 'Lernen Sie das Team und die Entwickler hinter VaultScope kennen, die souveräne Cloud-Infrastruktur aufbauen.',
    priority: '0.5',
    changefreq: 'monthly',
  },
  {
    path: '/de/company/open-source',
    title: 'Open-Source-Engagement',
    description: 'Entdecken Sie unsere Open-Source-Repositories, Architektur-Standards und Beiträge zur Community.',
    priority: '0.6',
    changefreq: 'monthly',
  },
  {
    path: '/de/company/contact',
    title: 'Kontakt & Enterprise-Support',
    description: 'Kontaktieren Sie das VaultScope-Team für Enterprise-Deployments, individuelle Setups oder technischen Support.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    path: '/de/company/roadmap',
    title: 'Roadmap — VaultScope Infrastruktur- & Software-Meilensteine',
    description: 'Entdecken Sie die VaultScope Engineering-Roadmap von Q4 2026 bis Q3 2027 für SFTP-Storage, Cloud VPS, Dedicated Server, iOS-App und Plattform-Automatisierung.',
    priority: '0.6',
    changefreq: 'monthly',
  },
  {
    path: '/de/company/partners',
    title: 'Technologie- & Infrastrukturpartner',
    description: 'Entdecken Sie die Infrastruktur-Partnerschaften und das Ökosystem von VaultScope in Europa.',
    priority: '0.5',
    changefreq: 'monthly',
  },
  {
    path: '/de/docs',
    title: 'Dokumentation — VaultScope Infrastruktur & Software',
    description: 'Technische Anleitungen, Architektur-Referenzen und API-Dokumentation für VaultScope.',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    path: '/de/resources/blog',
    title: 'Engineering-Blog & Technische Einblicke',
    description: 'Detaillierte Artikel über Cloud-Architektur, Rust-Entwicklung, Linux-Storage-Systeme und Infrastruktur-Automatisierung.',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    path: '/de/resources/forum',
    title: 'Community & Entwickler-Forum',
    description: 'Tauschen Sie sich mit Entwicklern und dem VaultScope-Team über Cloud-Infrastruktur, SFTP und Open Source aus.',
    priority: '0.6',
    changefreq: 'weekly',
  },
  {
    path: '/de/guides',
    title: 'Technische Infrastruktur-Guides',
    description: 'Praxisnahe Leitfäden zu EU Cloud VPS, DSGVO-konformem Hosting, verschlüsseltem SFTP-Storage und dedizierten Root-Servern.',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    path: '/de/guides/eu-cloud-vps-gdpr-hosting',
    title: 'DSGVO-konformes Cloud-VPS-Hosting in Deutschland & der EU',
    description: 'Wie souveräne europäische Cloud-VPS-Infrastruktur mit AMD EPYC, NVMe-Speicher und Art.-28-DSGVO-AVV produktive Workloads absichert.',
    type: 'article',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/de/guides/encrypted-sftp-backup-storage-zfs',
    title: 'Verschlüsselter SFTP-Backup-Speicher auf redundanten ZFS-Nodes',
    description: 'Chroot-isolierter SFTP-Storage auf Basis von SFTPGo und ZFS für automatisierte Linux-Backups mit BorgBackup, Restic oder rsync.',
    type: 'article',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/de/guides/dedicated-bare-metal-ddos-protection',
    title: 'Dedizierte Bare-Metal-Root-Server: Exklusive Hardware-Leistung',
    description: 'Wann sich dedizierte Root-Server statt eines VPS lohnen, wie Hardware-Konfigurationen ablaufen und wie die Bereitstellung funktioniert.',
    type: 'article',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/de/guides/one-click-self-hosted-apps-eu',
    title: 'One-Click Deploy (OCD): Open-Source-Apps DSGVO-konform selbst hosten',
    description: 'Open-Source-Anwendungen und Container automatisiert auf europäischer Infrastruktur bereitstellen – mit VaultScope One-Click Deploy.',
    type: 'article',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/de/guides/vps-vs-dedicated-server-comparison',
    title: 'Cloud VPS vs. Dedizierter Root-Server: Wann lohnt sich was?',
    description: 'Technischer Vergleich zwischen Cloud VPS und Dedizierten Bare-Metal-Servern: CPU-Isolation, NVMe-I/O, Laufzeiten und Bereitstellung.',
    type: 'article',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/de/guides/sftp-storage-vs-s3-object-storage',
    title: 'SFTP Storage vs. S3 Object Storage: Kosten, Egress & Praxisvergleich',
    description: 'Chroot-isolierter SFTP-Speicher auf ZFS im Vergleich zu S3 Object Storage für Linux-Backups, Medienarchive und kalkulierbare Kosten.',
    type: 'article',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/de/guides/linux-vps-hardening-ssh-2fa-checklist',
    title: 'Linux Cloud VPS absichern: SSH-Keys, Firewall & 2FA-Checkliste',
    description: 'Praxisleitfaden zur Absicherung neuer Linux-Server: Ed25519-SSH-Keys, Passwort-Login deaktivieren, Firewall und Portal-2FA.',
    type: 'article',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/de/guides/proxmox-kvm-virtualization-bare-metal',
    title: 'Proxmox VE & KVM auf Dedizierten Bare-Metal-Servern betreiben',
    description: 'Warum sich dedizierte Root-Server ideal für Proxmox VE, ZFS-Pools, KVM-VMs und eigene Netzwerk-Bridges eignen.',
    type: 'article',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/de/guides/borgbackup-restic-offsite-sftp-guide',
    title: 'Automatisierte Offsite-Backups mit BorgBackup & Restic über SFTP',
    description: 'Clientseitig verschlüsselte, deduplizierte Linux-Server-Backups auf VaultScope SFTP-Storage mit BorgBackup oder Restic.',
    type: 'article',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/de/guides/german-hosting-gdpr-dpa-compliance-guide',
    title: 'DSGVO-Hosting in Deutschland: AVV, Standortwahl & GoBD-Rechnungen',
    description: 'Was Unternehmen in Deutschland beim Cloud-Hosting beachten sollten: Art.-28-DSGVO-AVV, EU-Unterauftragsverarbeiter, VIES-Prüfung und PDF-Rechnungen.',
    type: 'article',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/de/legal/privacy',
    title: 'Datenschutzerklärung',
    description: 'Informationen zur Verarbeitung personenbezogener Daten und Ihren Rechten gemäß DSGVO, BDSG und TDDDG bei VaultScope.',
    priority: '0.3',
    changefreq: 'monthly',
  },
  {
    path: '/de/legal/terms',
    title: 'Nutzungsbedingungen (AGB)',
    description: 'Allgemeine Nutzungs- und Geschäftsbedingungen für Websites, Kundenportal und Infrastrukturdienste von VaultScope.',
    priority: '0.3',
    changefreq: 'monthly',
  },
  {
    path: '/de/legal/imprint',
    title: 'Impressum',
    description: 'Gesetzliche Anbieterkennzeichnung von VaultScope (Anton Schmidt, Einzelunternehmen) gemäß § 5 DDG.',
    priority: '0.3',
    changefreq: 'monthly',
  },
  {
    path: '/de/legal/hosting-terms',
    title: 'Besondere Hosting-Geschäftsbedingungen',
    description: 'Vertragsbedingungen für Cloud VPS, Dedizierte Server, SFTP-Speicher und One-Click Deploy bei VaultScope.',
    priority: '0.3',
    changefreq: 'monthly',
  },
  {
    path: '/de/legal/cancellation',
    title: 'Widerrufsbelehrung',
    description: 'Informationen zum gesetzlichen Widerrufsrecht für Verbraucher beim Abschluss von Hosting- und Infrastrukturverträgen.',
    priority: '0.3',
    changefreq: 'monthly',
  },
  {
    path: '/de/legal/aup',
    title: 'Nutzungsrichtlinie (Acceptable Use Policy)',
    description: 'Regeln zur zulässigen Nutzung der VaultScope-Infrastruktur sowie Notice-and-Action-Verfahren gemäß Art. 16 DSA.',
    priority: '0.3',
    changefreq: 'monthly',
  },
  {
    path: '/de/legal/dpa',
    title: 'Auftragsverarbeitungsvertrag (AVV)',
    description: 'Vertrag zur Auftragsverarbeitung personenbezogener Daten gemäß Art. 28 DSGVO.',
    priority: '0.3',
    changefreq: 'monthly',
  },
];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getLocaleUrls(routePath) {
  const enPath =
    routePath === '/de'
      ? '/'
      : routePath.startsWith('/de/')
        ? routePath.slice(3)
        : routePath;
  const dePath = enPath === '/' ? '/de' : `/de${enPath}`;
  return {
    isDe: routePath === '/de' || routePath.startsWith('/de/'),
    enUrl: `${DOMAIN}${enPath}`,
    deUrl: `${DOMAIN}${dePath}`,
    canonicalUrl: `${DOMAIN}${routePath}`,
  };
}

function generateHtml(route) {
  const fullTitle = route.title.includes('VaultScope')
    ? route.title
    : `${route.title} — VaultScope`;
  const { isDe, enUrl, deUrl, canonicalUrl } = getLocaleUrls(route.path);
  const image = route.image || `${DOMAIN}/og-image.png`;
  const type = route.type || 'website';

  let html = template;

  // Set <html lang="...">
  html = html.replace(/<html\s+lang="[^"]*"/i, () => `<html lang="${isDe ? 'de' : 'en'}"`);

  // Replace <title>
  html = html.replace(/<title>.*?<\/title>/s, () => `<title>${escapeHtml(fullTitle)}</title>`);

  // Replace <meta name="description" ...>
  html = html.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/s,
    () => `<meta name="description" content="${escapeHtml(route.description)}" />`
  );

  // Replace og:title / og:description / og:url / og:image / og:type
  html = html.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/s,
    () => `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/s,
    () => `<meta property="og:description" content="${escapeHtml(route.description)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/s,
    () => `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:image"\s+content=".*?"\s*\/?>/s,
    () => `<meta property="og:image" content="${escapeHtml(image)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:type"\s+content=".*?"\s*\/?>/s,
    () => `<meta property="og:type" content="${escapeHtml(type)}" />`
  );

  // Replace twitter tags
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/s,
    () => `<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/s,
    () => `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/s,
    () => `<meta name="twitter:image" content="${escapeHtml(image)}" />`
  );

  // Replace canonical link & inject hreflang alternates
  const hreflangTags = [
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    `<link rel="alternate" hreflang="en" href="${escapeHtml(enUrl)}" />`,
    `<link rel="alternate" hreflang="de" href="${escapeHtml(deUrl)}" />`,
    `<link rel="alternate" hreflang="x-default" href="${escapeHtml(enUrl)}" />`,
  ].join('\n    ');

  html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/s, () => hreflangTags);

  if (!html.includes('name="theme-color"')) {
    html = html.replace('</head>', () => '    <meta name="theme-color" content="#030304" />\n  </head>');
  }

  // Provide clean semantic fallback inside #root for crawlers that inspect raw HTML
  const extraParagraphs = Array.isArray(route.bodyParagraphs)
    ? route.bodyParagraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')
    : '';
  const navLinks = isDe
    ? `<nav aria-label="Primary"><a href="/de/">Startseite</a> · <a href="/de/infrastructure">Infrastruktur</a> · <a href="/de/infrastructure/cloud">Cloud VPS</a> · <a href="/de/infrastructure/dedicated">Dedizierte Server</a> · <a href="/de/infrastructure/storage">SFTP Storage</a> · <a href="/de/guides">Guides</a> · <a href="/de/legal/imprint">Impressum</a> · <a href="/de/legal/privacy">Datenschutz</a></nav>`
    : `<nav aria-label="Primary"><a href="/">Home</a> · <a href="/infrastructure">Infrastructure</a> · <a href="/infrastructure/cloud">Cloud VPS</a> · <a href="/infrastructure/dedicated">Dedicated Servers</a> · <a href="/infrastructure/storage">SFTP Storage</a> · <a href="/guides">Guides</a> · <a href="/legal/imprint">Imprint</a> · <a href="/legal/privacy">Privacy</a></nav>`;

  const semanticFallback = `<div id="root"><main style="display:none"><h1>${escapeHtml(fullTitle)}</h1><p>${escapeHtml(route.description)}</p>${extraParagraphs}${navLinks}</main></div>`;
  html = html.replace('<div id="root"></div>', () => semanticFallback);

  return html;
}

function generateSitemapXml(routes) {
  const urls = routes
    .map((r) => {
      const { enUrl, deUrl, canonicalUrl } = getLocaleUrls(r.path);
      return [
        '  <url>',
        `    <loc>${escapeHtml(canonicalUrl)}</loc>`,
        `    <xhtml:link rel="alternate" hreflang="en" href="${escapeHtml(enUrl)}" />`,
        `    <xhtml:link rel="alternate" hreflang="de" href="${escapeHtml(deUrl)}" />`,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeHtml(enUrl)}" />`,
        `    <priority>${r.priority || '0.5'}</priority>`,
        `    <changefreq>${r.changefreq || 'monthly'}</changefreq>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls,
    '</urlset>',
    '',
  ].join('\n');
}

async function fetchDynamicBlogRoutes() {
  const apiBase = process.env.VITE_API_URL || 'https://api.vaultscope.de/api';
  if (process.env.SKIP_SITEMAP_FETCH === '1') return [];

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1800);
    const res = await fetch(`${apiBase.replace(/\/$/, '')}/storefront/blog`, {
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return [];
    const posts = await res.json();
    if (!Array.isArray(posts)) return [];

    const dynamicRoutes = [];
    for (const post of posts) {
      if (typeof post?.slug !== 'string' || !/^[a-z0-9](?:[a-z0-9-]{0,126}[a-z0-9])?$/i.test(post.slug)) {
        continue;
      }
      const isGuide =
        post.visibility === 'unlisted' ||
        post.visibility === 'guide' ||
        post.is_unlisted === true ||
        post.seo_only === true;
      const basePath = isGuide
        ? `/guides/${encodeURIComponent(post.slug)}`
        : `/resources/blog/${encodeURIComponent(post.slug)}`;
      const desc =
        post.excerpt ||
        (typeof post.content === 'string'
          ? post.content.replace(/<[^>]+>/g, '').slice(0, 160)
          : 'VaultScope technical article');
      const bodyParagraphs =
        typeof post.content === 'string'
          ? [post.content.replace(/<[^>]+>/g, ' ').slice(0, 1200)]
          : [];

      dynamicRoutes.push({
        path: basePath,
        title: post.title || post.slug,
        description: desc,
        type: 'article',
        priority: '0.8',
        changefreq: 'monthly',
        bodyParagraphs,
      });
      dynamicRoutes.push({
        path: `/de${basePath}`,
        title: post.title || post.slug,
        description: desc,
        type: 'article',
        priority: '0.8',
        changefreq: 'monthly',
        bodyParagraphs,
      });
    }
    return dynamicRoutes;
  } catch {
    return [];
  }
}

async function main() {
  const dynamicRoutes = await fetchDynamicBlogRoutes();
  const seen = new Set();
  const ALL_ROUTES = [...BASE_ROUTES, ...dynamicRoutes].filter((r) => {
    if (seen.has(r.path)) return false;
    seen.add(r.path);
    return true;
  });

  console.log(`[generate-static-pages] Pre-generating ${ALL_ROUTES.length} static HTML pages for SEO & social embeds...`);

  let count = 0;
  for (const route of ALL_ROUTES) {
    const generatedHtml = generateHtml(route);

    if (route.path === '/') {
      fs.writeFileSync(indexHtmlPath, generatedHtml, 'utf8');
      count++;
      continue;
    }

    const relPath = route.path.replace(/^\//, '');
    const resolvedDistRoot = path.resolve(distDir);
    const targetDir = path.resolve(distDir, relPath);
    if (!targetDir.startsWith(resolvedDistRoot + path.sep)) {
      throw new Error(`Refusing to write route outside distDir: ${route.path}`);
    }
    fs.mkdirSync(targetDir, { recursive: true });

    const targetFile = path.join(targetDir, 'index.html');
    fs.writeFileSync(targetFile, generatedHtml, 'utf8');
    count++;
  }

  const sitemapXml = generateSitemapXml(ALL_ROUTES);
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');

  console.log(`[generate-static-pages] Successfully generated ${count} HTML pages and dist/sitemap.xml!`);
}

main();
