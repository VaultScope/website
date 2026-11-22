export interface SeoGuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface SeoGuideContent {
  title: string;
  description: string;
  excerpt: string;
  category: string;
  readingTimeMin: number;
  sections: SeoGuideSection[];
  ctaLabel: string;
  ctaHref: string;
}

export interface SeoGuide {
  slug: string;
  publishedAt: string;
  tags: string[];
  en: SeoGuideContent;
  de: SeoGuideContent;
}

export const SEO_GUIDES: SeoGuide[] = [
  {
    slug: 'eu-cloud-vps-gdpr-hosting',
    publishedAt: '2026-11-20',
    tags: ['cloud-vps', 'gdpr', 'eu-hosting', 'nvme'],
    en: {
      title: 'GDPR-Compliant Cloud VPS Hosting in Germany & the EU',
      description:
        'How sovereign European Cloud VPS infrastructure with AMD EPYC CPUs, NVMe storage, and an Art. 28 GDPR DPA protects business workloads.',
      excerpt:
        'Why European data residency, transparent sub-processors, and predictable monthly pricing matter when choosing Cloud VPS hosting in Germany.',
      category: 'Cloud Architecture',
      readingTimeMin: 4,
      ctaLabel: 'Explore Cloud VPS Plans',
      ctaHref: '/infrastructure/cloud',
      sections: [
        {
          heading: 'Why EU Data Residency Matters for Modern Workloads',
          paragraphs: [
            'Running web applications, customer databases, and APIs under European jurisdiction eliminates unnecessary third-country data transfers outside the EEA. When your compute instances operate in German or Finnish EU datacenters, your compliance posture under the GDPR remains straightforward and auditable.',
            'VaultScope provisions Cloud VPS instances on European infrastructure partners including Hetzner Online GmbH and OVH SAS, backed by an integrated Art. 28 GDPR Data Processing Agreement (DPA).',
          ],
          bullets: [
            'EU/EEA datacenter locations with strict network isolation',
            'Predictable monthly billing with transparent checkout pricing',
            'Automated provisioning and VNC console access from the customer portal',
          ],
        },
        {
          heading: 'Hardware & Network Architecture',
          paragraphs: [
            'Performance bottlenecks on virtualized servers usually come from noisy-neighbor disk I/O and throttled uplinks. VaultScope Cloud VPS tiers pair modern AMD EPYC compute with enterprise NVMe storage and automated DDoS mitigation.',
          ],
          bullets: [
            'Enterprise NVMe storage for low-latency databases and containers',
            'Automated DDoS protection and isolated virtual networking',
            'Full root SSH access with saved SSH public key deployment',
          ],
        },
        {
          heading: 'Built-In Control Plane & Security Controls',
          paragraphs: [
            'Every Cloud VPS can be managed directly through the VaultScope customer dashboard, including 2FA/TOTP account protection, activity audit logging, and flexible cancellation controls without lock-in contracts.',
          ],
        },
      ],
    },
    de: {
      title: 'DSGVO-konformes Cloud-VPS-Hosting in Deutschland & der EU',
      description:
        'Wie souveräne europäische Cloud-VPS-Infrastruktur mit AMD EPYC, NVMe-Speicher und Art.-28-DSGVO-AVV produktive Workloads absichert.',
      excerpt:
        'Warum europäische Datenhaltung, transparente Unterauftragsverarbeiter und planbare monatliche Konditionen beim Cloud-VPS-Hosting entscheidend sind.',
      category: 'Cloud-Architektur',
      readingTimeMin: 4,
      ctaLabel: 'Cloud-VPS-Tarife ansehen',
      ctaHref: '/infrastructure/cloud',
      sections: [
        {
          heading: 'Warum EU-Datenhaltung für Unternehmen entscheidend ist',
          paragraphs: [
            'Wer Webanwendungen, Kundendatenbanken oder APIs innerhalb der Europäischen Union betreibt, vermeidet unnötige Drittlandtransfers. Durch Serverstandorte in Deutschland und Finnland (EWR) bleibt die Verarbeitung nach der DSGVO klar nachvollziehbar.',
            'VaultScope stellt Cloud-VPS-Instanzen über europäische Infrastrukturpartner wie Hetzner Online GmbH und OVH SAS bereit – inklusive direkt integriertem Auftragsverarbeitungsvertrag (AVV) nach Art. 28 DSGVO.',
          ],
          bullets: [
            'EU-/EWR-Rechenzentren mit strikter Netzwerk-Isolation',
            'Planbare monatliche Abrechnung ohne versteckte Egress-Gebühren',
            'Automatisierte Bereitstellung inklusive VNC-Konsole im Kundenportal',
          ],
        },
        {
          heading: 'Hardware- und Netzwerk-Architektur',
          paragraphs: [
            'Typische Engpässe bei virtuellen Servern entstehen durch langsamen Speicher-I/O oder geteilte Bandbreiten. Die Cloud-VPS-Systeme von VaultScope kombinieren AMD-EPYC-Prozessoren mit Enterprise-NVMe-SSDs und automatisiertem DDoS-Schutz.',
          ],
          bullets: [
            'Enterprise-NVMe-Storage für reaktionsschnelle Datenbanken und Container',
            'Automatisierte DDoS-Abwehr und dedizierte IPv4/IPv6-Anbindung',
            'Voller Root-Zugriff per SSH-Public-Key direkt ab Bestellung',
          ],
        },
        {
          heading: 'Kontrolle im Kundenportal ohne Vertragsbindung',
          paragraphs: [
            'Alle Instanzen lassen sich zentral im Kundenportal verwalten – inklusive TOTP-Zwei-Faktor-Authentifizierung, Activity-Audit-Logs und flexibler Kündigung zum Laufzeitende oder per Sofort-Kündigung.',
          ],
        },
      ],
    },
  },
  {
    slug: 'encrypted-sftp-backup-storage-zfs',
    publishedAt: '2026-11-20',
    tags: ['sftp', 'zfs', 'backup', 'storage'],
    en: {
      title: 'Encrypted SFTP Backup Storage on Redundant ZFS Nodes',
      description:
        'Using chroot-isolated SFTP storage powered by SFTPGo and ZFS for automated Linux backups, BorgBackup, Restic, and media workflows.',
      excerpt:
        'A technical overview of chroot-isolated SFTP vaults, POSIX quotas, and zero-egress backup workflows in European datacenters.',
      category: 'Storage Systems',
      readingTimeMin: 4,
      ctaLabel: 'Explore SFTP Storage',
      ctaHref: '/infrastructure/storage',
      sections: [
        {
          heading: 'Chroot-Isolated SFTP Vaults for Automated Backups',
          paragraphs: [
            'Object storage APIs often introduce complex egress fees and proprietary SDK dependencies. For Linux servers, BorgBackup, Restic, and automated clipping or CI artifact pipelines, standard SFTP remains the most reliable, firewall-friendly protocol.',
            'VaultScope operates chroot-isolated SFTP vaults powered by SFTPGo on redundant ZFS storage pools in European datacenters.',
          ],
          bullets: [
            'Native compatibility with BorgBackup, Restic, rsync, and rclone',
            'Strict user chroot isolation and SSH key authentication',
            'Predictable storage quotas with transparent monthly pricing',
          ],
        },
        {
          heading: 'Integrating SFTP Storage into Server Workflows',
          paragraphs: [
            'You can configure SSH keys and manage storage credentials directly inside the VaultScope dashboard under SFTP Storage, then point automated cron or systemd backup timers straight at your vault endpoint over TLS/SSH.',
          ],
        },
      ],
    },
    de: {
      title: 'Verschlüsselter SFTP-Backup-Speicher auf redundanten ZFS-Nodes',
      description:
        'Chroot-isolierter SFTP-Storage auf Basis von SFTPGo und ZFS für automatisierte Linux-Backups mit BorgBackup, Restic oder rsync.',
      excerpt:
        'Wie chroot-isolierte SFTP-Vaults, POSIX-Quotas und planbare Tarife ohne Egress-Überraschungen zuverlässige Offsite-Backups ermöglichen.',
      category: 'Storage-Systeme',
      readingTimeMin: 4,
      ctaLabel: 'SFTP-Speicher entdecken',
      ctaHref: '/infrastructure/storage',
      sections: [
        {
          heading: 'Chroot-isolierte SFTP-Vaults für Offsite-Backups',
          paragraphs: [
            'Viele S3-kompatible Speicheranbieter berechnen undurchsichtige API- und Egress-Gebühren. Für Linux-Server, BorgBackup, Restic und automatisierte Datei-Workflows ist standardisiertes SFTP über SSH weiterhin der robusteste Weg.',
            'VaultScope betreibt chroot-isolierte SFTP-Storage-Vaults über SFTPGo auf redundanten ZFS-Pools in europäischen Rechenzentren.',
          ],
          bullets: [
            'Direkt nutzbar mit BorgBackup, Restic, rsync, rclone und Standard-Clients',
            'Strikte Chroot-Isolation pro Konto und Authentifizierung per SSH-Key',
            'Klare Speicher-Quotas ohne versteckte Traffic- oder Egress-Kosten',
          ],
        },
        {
          heading: 'Schnelle Einrichtung über das Kundenportal',
          paragraphs: [
            'Zugangsdaten und SSH-Schlüssel lassen sich direkt im Bereich SFTP-Storage im Kundenportal konfigurieren und nahtlos in bestehende Backup-Skripte oder systemd-Timer einbinden.',
          ],
        },
      ],
    },
  },
  {
    slug: 'dedicated-bare-metal-ddos-protection',
    publishedAt: '2026-11-20',
    tags: ['dedicated-server', 'bare-metal', 'ddos', 'infrastructure'],
    en: {
      title: 'Dedicated Bare-Metal Root Servers: Single-Tenant Performance',
      description:
        'When to choose dedicated bare-metal servers over VPS, how custom hardware configurations work, and what to expect during provisioning.',
      excerpt:
        'Unshared CPU cores, physical NVMe arrays, custom billing cycles, and transparent lead times for single-tenant bare-metal servers.',
      category: 'Bare Metal',
      readingTimeMin: 4,
      ctaLabel: 'Configure Dedicated Servers',
      ctaHref: '/infrastructure/dedicated',
      sections: [
        {
          heading: 'When Single-Tenant Hardware Makes the Difference',
          paragraphs: [
            'Virtualization is ideal for agile services, but heavy database clusters, hypervisor hosts (Proxmox VE / KVM), game backends, and sustained high-I/O workloads benefit from unshared bare-metal hardware.',
            'VaultScope dedicated servers provide exclusive physical CPU, RAM, and NVMe/HDD arrays with configurable hardware options and flexible billing cycles (monthly up to triennial).',
          ],
          bullets: [
            '100% dedicated physical resources with zero hypervisor contention',
            'Configurable hardware add-ons and custom partitioning notes during checkout',
            'Transparent provisioning lead time of up to 7 business days for custom builds',
          ],
        },
        {
          heading: 'Live Order Tracking & Portal Management',
          paragraphs: [
            'Every dedicated server order can be tracked step by step in the Orders overview of the VaultScope dashboard until handover of your credentials and IPMI/server details.',
          ],
        },
      ],
    },
    de: {
      title: 'Dedizierte Bare-Metal-Root-Server: Exklusive Hardware-Leistung',
      description:
        'Wann sich dedizierte Root-Server statt eines VPS lohnen, wie Hardware-Konfigurationen ablaufen und wie die Bereitstellung funktioniert.',
      excerpt:
        'Ungeteilte CPU-Kerne, physische NVMe-Arrays, flexible Laufzeiten und transparente Bereitstellungszeiten für Bare-Metal-Workloads.',
      category: 'Bare Metal',
      readingTimeMin: 4,
      ctaLabel: 'Dedizierte Server ansehen',
      ctaHref: '/infrastructure/dedicated',
      sections: [
        {
          heading: 'Wann dedizierte Hardware die bessere Wahl ist',
          paragraphs: [
            'Für Datenbank-Cluster, eigene Virtualisierungs-Hosts (Proxmox VE / KVM), rechenintensive Backends oder konstante I/O-Last bietet physische Single-Tenant-Hardware maximale Planbarkeit ohne geteilte Ressourcen.',
            'Konfigurierbare Dedicated Server bei VaultScope bieten frei wählbare Hardware-Upgrades, verschiedene Abrechnungszyklen (monatlich bis dreijährlich) und direkte Konfigurationshinweise im Checkout.',
          ],
          bullets: [
            '100 % exklusive Hardware-Ressourcen ohne Hypervisor-Overhead',
            'Individuelle Hardware-Optionen und Partitionierungshinweise bei Bestellung',
            'Klare Bereitstellungszeit von regulär bis zu 7 Werktagen nach Zahlungseingang',
          ],
        },
        {
          heading: 'Status-Tracking im Kundenportal',
          paragraphs: [
            'Im Bereich „Orders“ des Kundenportals lässt sich jeder Bereitstellungsschritt bis zur Übergabe der Zugangsdaten transparent verfolgen.',
          ],
        },
      ],
    },
  },
  {
    slug: 'one-click-self-hosted-apps-eu',
    publishedAt: '2026-11-20',
    tags: ['ocd', 'open-source', 'self-hosting', 'automation'],
    en: {
      title: 'One-Click Deploy (OCD): Self-Hosting Open-Source Apps in Europe',
      description:
        'Deploy open-source applications and containers on sovereign EU infrastructure with automated orchestration via VaultScope OCD.',
      excerpt:
        'How One-Click Deploy removes manual reverse-proxy and container setup while keeping full data control under European law.',
      category: 'Automation & OCD',
      readingTimeMin: 3,
      ctaLabel: 'Explore One-Click Deploy',
      ctaHref: '/deploy',
      sections: [
        {
          heading: 'Self-Hosting Without Manual Boilerplate',
          paragraphs: [
            'Teams increasingly prefer open-source alternatives over US-hosted SaaS tools to keep data sovereignty intact—yet configuring containers, TLS certificates, and lifecycle updates manually takes valuable engineering time.',
            'VaultScope One-Click Deploy (OCD) automates container deployment and management directly from the customer dashboard.',
          ],
          bullets: [
            'Pre-configured open-source application templates',
            'Managed lifecycle controls and status inspection in the portal',
            'Hosted on European infrastructure with GDPR DPA coverage',
          ],
        },
      ],
    },
    de: {
      title: 'One-Click Deploy (OCD): Open-Source-Apps DSGVO-konform selbst hosten',
      description:
        'Open-Source-Anwendungen und Container automatisiert auf europäischer Infrastruktur bereitstellen – mit VaultScope One-Click Deploy.',
      excerpt:
        'Wie One-Click Deploy wiederkehrende Server-Konfiguration abnimmt und volle Datenkontrolle in der EU bewahrt.',
      category: 'Automatisierung & OCD',
      readingTimeMin: 3,
      ctaLabel: 'One-Click Deploy ansehen',
      ctaHref: '/deploy',
      sections: [
        {
          heading: 'Self-Hosting ohne manuellen Setup-Aufwand',
          paragraphs: [
            'Immer mehr Teams ersetzen proprietäre SaaS-Werkzeuge durch Open-Source-Alternativen unter eigener Datenhoheit. Die manuelle Einrichtung von Containern, Reverse-Proxies und Zertifikaten kostet jedoch Zeit.',
            'Mit VaultScope One-Click Deploy (OCD) lassen sich vorkonfigurierte Anwendungen direkt über das Kundenportal starten und verwalten.',
          ],
          bullets: [
            'Vorkonfigurierte Open-Source-App-Templates',
            'Zentrale Verwaltung im Kunden-Dashboard',
            'Betrieb auf EU-Infrastruktur inklusive AVV nach Art. 28 DSGVO',
          ],
        },
      ],
    },
  },
  {
    slug: 'vps-vs-dedicated-server-comparison',
    publishedAt: '2026-11-22',
    tags: ['cloud-vps', 'dedicated-server', 'comparison', 'infrastructure'],
    en: {
      title: 'Cloud VPS vs. Dedicated Root Server: Architecture & Workload Guide',
      description:
        'Technical comparison between Cloud VPS and Dedicated Bare-Metal Servers: CPU isolation, NVMe I/O, billing cycles, and provisioning times.',
      excerpt:
        'How to choose between agile Cloud VPS instances and single-tenant bare-metal servers based on workload requirements.',
      category: 'Architecture Comparison',
      readingTimeMin: 4,
      ctaLabel: 'Compare Infrastructure',
      ctaHref: '/infrastructure',
      sections: [
        {
          heading: 'When Cloud VPS Is the Right Fit',
          paragraphs: [
            'Cloud VPS instances are provisioned within minutes and are ideal for web backends, APIs, staging environments, and containerized workloads where fast deployment and lean monthly pricing matter.',
          ],
          bullets: [
            'Fast automated provisioning via VAMOS orchestration',
            'AMD EPYC compute with enterprise NVMe storage',
            'Low entry pricing with monthly billing and instant dashboard controls',
          ],
        },
        {
          heading: 'When Dedicated Bare-Metal Servers Win',
          paragraphs: [
            'If you run your own hypervisor (such as Proxmox VE), heavy relational databases, or sustained high-I/O workloads, unshared physical CPU cores and dedicated NVMe/HDD arrays eliminate virtualization overhead.',
            'Configurable dedicated servers at VaultScope support custom hardware add-ons, multi-month billing cycles (monthly through triennially), and transparent provisioning within up to 7 business days.',
          ],
        },
      ],
    },
    de: {
      title: 'Cloud VPS vs. Dedizierter Root-Server: Wann lohnt sich was?',
      description:
        'Technischer Vergleich zwischen Cloud VPS und Dedizierten Bare-Metal-Servern: CPU-Isolation, NVMe-I/O, Laufzeiten und Bereitstellung.',
      excerpt:
        'Entscheidungshilfe zwischen schnell verfügbaren Cloud-VPS-Instanzen und exklusiver Bare-Metal-Hardware für produktive Workloads.',
      category: 'Architektur-Vergleich',
      readingTimeMin: 4,
      ctaLabel: 'Infrastruktur vergleichen',
      ctaHref: '/infrastructure',
      sections: [
        {
          heading: 'Wann ein Cloud VPS die bessere Wahl ist',
          paragraphs: [
            'Cloud-VPS-Instanzen sind innerhalb weniger Minuten einsatzbereit und eignen sich ideal für Webanwendungen, REST-APIs, Staging-Umgebungen und Container-Workloads mit schlanker monatlicher Abrechnung.',
          ],
          bullets: [
            'Schnelle automatisierte Provisionierung über VAMOS',
            'AMD-EPYC-Leistung und Enterprise-NVMe-Speicher',
            'Günstiger Einstieg mit monatlicher Laufzeit und VNC-Konsole im Portal',
          ],
        },
        {
          heading: 'Wann sich ein Dedizierter Bare-Metal-Server lohnt',
          paragraphs: [
            'Für eigene Hypervisoren (z. B. Proxmox VE), große Datenbank-Cluster oder dauerhaft hohe I/O-Last bietet physische Hardware ohne Hypervisor-Layer maximale Planbarkeit.',
            'Konfigurierbare Dedicated Server bei VaultScope bieten individuelle Hardware-Upgrades, wählbare Laufzeiten (monatlich bis dreijährlich) und eine reguläre Bereitstellungszeit von bis zu 7 Werktagen.',
          ],
        },
      ],
    },
  },
  {
    slug: 'sftp-storage-vs-s3-object-storage',
    publishedAt: '2026-11-22',
    tags: ['sftp', 's3', 'storage', 'egress', 'backup'],
    en: {
      title: 'SFTP Storage vs. S3 Object Storage: Egress Costs & Backup Workflows',
      description:
        'Comparing chroot-isolated SFTP storage on ZFS against S3 object storage for Linux backups, video archives, and predictable European hosting.',
      excerpt:
        'Why standard SFTP over SSH with zero egress fees is often simpler and more predictable than metered S3 APIs for server backups.',
      category: 'Storage Architecture',
      readingTimeMin: 4,
      ctaLabel: 'View SFTP Storage Plans',
      ctaHref: '/infrastructure/storage',
      sections: [
        {
          heading: 'Predictable Pricing Without Per-Request or Egress Surprises',
          paragraphs: [
            'Many S3-compatible providers bill separately for storage capacity, PUT/GET/LIST API requests, and outbound data transfer (egress). During disaster recovery restores, egress charges can spike unexpectedly.',
            'VaultScope SFTP Storage provides straightforward quota-based plans backed by SFTPGo and ZFS in European datacenters—no per-request billing and no surprise restore fees.',
          ],
        },
        {
          heading: 'Drop-In Compatibility Across Linux & Desktop Tools',
          paragraphs: [
            'Because SFTP uses standard SSH authentication and POSIX paths inside an isolated chroot, it works natively with BorgBackup, Restic, rsync, rclone, FileZilla, and automated server cron jobs.',
          ],
        },
      ],
    },
    de: {
      title: 'SFTP Storage vs. S3 Object Storage: Kosten, Egress & Praxisvergleich',
      description:
        'Chroot-isolierter SFTP-Speicher auf ZFS im Vergleich zu S3 Object Storage für Linux-Backups, Medienarchive und kalkulierbare Kosten.',
      excerpt:
        'Warum standardisiertes SFTP ohne Egress- und API-Request-Gebühren im Server-Backup oft zuverlässiger und günstiger ist als S3.',
      category: 'Storage-Architektur',
      readingTimeMin: 4,
      ctaLabel: 'SFTP-Storage-Tarife ansehen',
      ctaHref: '/infrastructure/storage',
      sections: [
        {
          heading: 'Kalkulierbare Kosten ohne Egress- oder Request-Gebühren',
          paragraphs: [
            'Bei vielen S3-Anbietern fallen neben der Speichermenge zusätzliche Kosten für API-Requests (PUT/GET/LIST) und ausgehenden Traffic (Egress) an – gerade beim Restore eines großen Backups steigen die Kosten unerwartet.',
            'VaultScope SFTP Storage setzt auf klare Speicher-Quotas auf Basis von SFTPGo und ZFS in europäischen Rechenzentren ohne versteckte Abruf- oder Egress-Gebühren.',
          ],
        },
        {
          heading: 'Direkte Kompatibilität im Linux-Alltag',
          paragraphs: [
            'Durch Standard-SSH-Authentifizierung und isoliertes Chroot-Dateisystem arbeitet der SFTP-Speicher direkt mit BorgBackup, Restic, rsync, rclone und gängigen Backup-Skripten zusammen.',
          ],
        },
      ],
    },
  },
  {
    slug: 'linux-vps-hardening-ssh-2fa-checklist',
    publishedAt: '2026-11-22',
    tags: ['security', 'linux', 'ssh', '2fa', 'vps'],
    en: {
      title: 'Hardening a Linux Cloud VPS: SSH Keys, Firewall & 2FA Checklist',
      description:
        'Practical security checklist for new Linux VPS deployments: Ed25519 SSH keys, disabling password auth, firewalling, and portal 2FA.',
      excerpt:
        'Essential first-hour hardening steps after deploying a Cloud VPS or Dedicated Server on VaultScope.',
      category: 'Security Operations',
      readingTimeMin: 4,
      ctaLabel: 'Deploy a Cloud VPS',
      ctaHref: '/infrastructure/cloud',
      sections: [
        {
          heading: '1. Enforce SSH Key Authentication (Ed25519)',
          paragraphs: [
            'Before exposing SSH on port 22 to the public internet, add your Ed25519 public key in the VaultScope dashboard and disable password-based SSH logins in /etc/ssh/sshd_config.',
          ],
          bullets: [
            'Set PasswordAuthentication no and KbdInteractiveAuthentication no',
            'Use ed25519 keys instead of legacy RSA-1024/2048 keys',
            'Restrict root login or use a dedicated sudo user',
          ],
        },
        {
          heading: '2. Enable Host Firewall & Portal Two-Factor Auth',
          paragraphs: [
            'Configure ufw or nftables to allow only required ports (such as 22/tcp, 80/tcp, 443/tcp), enable unattended security updates, and activate TOTP Two-Factor Authentication under Dashboard → Profile → Security in VaultScope.',
          ],
        },
      ],
    },
    de: {
      title: 'Linux Cloud VPS absichern: SSH-Keys, Firewall & 2FA-Checkliste',
      description:
        'Praxisleitfaden zur Absicherung neuer Linux-Server: Ed25519-SSH-Keys, Passwort-Login deaktivieren, Firewall und Portal-2FA.',
      excerpt:
        'Die wichtigsten Härtungsschritte direkt nach der Bereitstellung eines Cloud VPS oder Root-Servers.',
      category: 'Security & Betrieb',
      readingTimeMin: 4,
      ctaLabel: 'Cloud VPS bereitstellen',
      ctaHref: '/infrastructure/cloud',
      sections: [
        {
          heading: '1. SSH-Zugang auf Ed25519-Keys umstellen',
          paragraphs: [
            'Hinterlege deinen öffentlichen Ed25519-SSH-Key direkt bei der Bestellung im VaultScope-Portal und deaktiviere die Passwort-Anmeldung in /etc/ssh/sshd_config, um Brute-Force-Angriffe auszuschließen.',
          ],
          bullets: [
            'PasswordAuthentication no und KbdInteractiveAuthentication no setzen',
            'Moderne Ed25519-Schlüssel statt veralteter RSA-Keys verwenden',
            'Unbeaufsichtigte Sicherheitsupdates (unattended-upgrades) aktivieren',
          ],
        },
        {
          heading: '2. Host-Firewall & Portal-2FA aktivieren',
          paragraphs: [
            'Öffne über ufw oder nftables ausschließlich benötigte Ports (z. B. 22, 80, 443) und aktiviere für dein VaultScope-Konto unter Dashboard → Profile → Security die TOTP-Zwei-Faktor-Authentifizierung.',
          ],
        },
      ],
    },
  },
  {
    slug: 'proxmox-kvm-virtualization-bare-metal',
    publishedAt: '2026-11-22',
    tags: ['proxmox', 'kvm', 'bare-metal', 'virtualization'],
    en: {
      title: 'Running Proxmox VE & KVM Virtualization on Dedicated Bare Metal',
      description:
        'Why dedicated bare-metal servers are ideal for Proxmox VE clusters, nested isolation, ZFS storage pools, and custom network bridges.',
      excerpt:
        'Architectural guidelines for running Proxmox VE hypervisors and isolated VMs on dedicated VaultScope hardware.',
      category: 'Virtualization',
      readingTimeMin: 4,
      ctaLabel: 'Explore Dedicated Servers',
      ctaHref: '/infrastructure/dedicated',
      sections: [
        {
          heading: 'Full Hypervisor Control Without Nested Virtualization Penalties',
          paragraphs: [
            'Running KVM or LXC containers inside a nested VPS introduces extra latency and restricts hardware pass-through. A dedicated bare-metal server gives you direct hardware access for Proxmox VE, ZFS mirrors, and custom bridged/routed subnets.',
          ],
          bullets: [
            'Direct hardware access for KVM guests and LXC containers',
            'Custom partitioning and RAID/ZFS layouts definable via order notes',
            'Multi-month billing options from monthly up to 36-month terms',
          ],
        },
      ],
    },
    de: {
      title: 'Proxmox VE & KVM auf Dedizierten Bare-Metal-Servern betreiben',
      description:
        'Warum sich dedizierte Root-Server ideal für Proxmox VE, ZFS-Pools, KVM-VMs und eigene Netzwerk-Bridges eignen.',
      excerpt:
        'Architektur-Hinweise für den Betrieb eigener Hypervisoren und isolierter KVM-/LXC-Umgebungen auf dedizierter Hardware.',
      category: 'Virtualisierung',
      readingTimeMin: 4,
      ctaLabel: 'Dedizierte Server entdecken',
      ctaHref: '/infrastructure/dedicated',
      sections: [
        {
          heading: 'Volle Hypervisor-Kontrolle ohne Nested-Overhead',
          paragraphs: [
            'Verschachtelte Virtualisierung in einem VPS kostet spürbar Performance. Auf einem dedizierten Bare-Metal-Server stehen physische CPU-Virtualisierungsfunktionen (AMD-V / Intel VT-x), NVMe-Lanes und eigene ZFS-Pools ungeteilt für Proxmox VE zur Verfügung.',
          ],
          bullets: [
            'Direkte Hardware-Nutzung für KVM-VMs und LXC-Container',
            'Individuelle Partitionierungs- und Setup-Hinweise direkt bei Bestellung',
            'Flexible Abrechnungszyklen von monatlich bis dreijährlich',
          ],
        },
      ],
    },
  },
  {
    slug: 'borgbackup-restic-offsite-sftp-guide',
    publishedAt: '2026-11-22',
    tags: ['borgbackup', 'restic', 'sftp', 'linux', 'backup'],
    en: {
      title: 'Automated Offsite Backups with BorgBackup & Restic over SFTP',
      description:
        'Step-by-step pattern for encrypted, deduplicated Linux server backups to VaultScope SFTP Storage using BorgBackup or Restic.',
      excerpt:
        'Keep client-side encrypted, deduplicated offsite backups on European ZFS SFTP vaults with automated retention policies.',
      category: 'Backup Engineering',
      readingTimeMin: 4,
      ctaLabel: 'Get SFTP Storage',
      ctaHref: '/infrastructure/storage',
      sections: [
        {
          heading: 'Client-Side Encryption Meets Chroot SFTP Vaults',
          paragraphs: [
            'Best-practice server backups follow the 3-2-1 rule and encrypt data before it ever leaves the source server. Both BorgBackup and Restic support native SFTP repositories out of the box—requiring zero extra agent software on the storage side.',
          ],
          bullets: [
            'Zero-knowledge client-side encryption (AES-256 / ChaCha20-Poly1305)',
            'Block-level deduplication keeps storage usage and bandwidth low',
            'Automated daily/weekly pruning via systemd timers or cron',
          ],
        },
      ],
    },
    de: {
      title: 'Automatisierte Offsite-Backups mit BorgBackup & Restic über SFTP',
      description:
        'Clientseitig verschlüsselte, deduplizierte Linux-Server-Backups auf VaultScope SFTP-Storage mit BorgBackup oder Restic.',
      excerpt:
        'So sicherst du Linux-Server mit clientseitiger Verschlüsselung und automatischer Retention auf europäischen ZFS-SFTP-Vaults.',
      category: 'Backup-Engineering',
      readingTimeMin: 4,
      ctaLabel: 'SFTP-Speicher buchen',
      ctaHref: '/infrastructure/storage',
      sections: [
        {
          heading: 'Clientseitige Verschlüsselung auf isolierten SFTP-Vaults',
          paragraphs: [
            'Moderne Offsite-Backups verschlüsseln Daten bereits vor dem Verlassen des Produktivservers. Sowohl BorgBackup als auch Restic sprechen nativ SFTP über SSH – ganz ohne proprietäre Storage-Agenten.',
          ],
          bullets: [
            'Zero-Knowledge-Verschlüsselung direkt auf dem Quell-Server',
            'Deduplizierung spart Speicherplatz und Transferzeit',
            'Automatisierte tägliche Sicherung & Pruning per systemd-Timer',
          ],
        },
      ],
    },
  },
  {
    slug: 'german-hosting-gdpr-dpa-compliance-guide',
    publishedAt: '2026-11-22',
    tags: ['gdpr', 'dsgvo', 'avv', 'germany', 'compliance'],
    en: {
      title: 'GDPR Hosting in Germany: Art. 28 DPA, Data Residency & EU Invoicing',
      description:
        'What German and EU businesses need for compliant cloud hosting: Art. 28 GDPR Data Processing Agreement, EU sub-processors, and DIN 5008 PDF invoices.',
      excerpt:
        'How VaultScope combines EU infrastructure, transparent Art. 28 DPA documentation, EU VIES validation, and automated accounting PDF delivery.',
      category: 'Compliance & Billing',
      readingTimeMin: 4,
      ctaLabel: 'Read the VaultScope DPA',
      ctaHref: '/legal/dpa',
      sections: [
        {
          heading: 'Transparent Data Processing Pursuant to Art. 28 GDPR',
          paragraphs: [
            'Whenever you host customer databases, user accounts, or application logs on rented infrastructure, GDPR requires a Data Processing Agreement (AVV / DPA) with your hosting provider.',
            'VaultScope publishes its full Art. 28 DPA, sub-processor disclosure, and technical & organisational measures (TOMs) openly, with European datacenter options in Germany, Finland, France, and the Netherlands.',
          ],
        },
        {
          heading: 'Built for European Accounting Workflows',
          paragraphs: [
            'From EU VIES VAT ID validation in your account profile to DIN 5008 vector PDF invoices and automated CC delivery to your tax advisor or accounting inbox, VaultScope reduces administrative overhead for European teams.',
          ],
        },
      ],
    },
    de: {
      title: 'DSGVO-Hosting in Deutschland: AVV, Standortwahl & GoBD-Rechnungen',
      description:
        'Was Unternehmen in Deutschland beim Cloud-Hosting beachten sollten: Art.-28-DSGVO-AVV, EU-Unterauftragsverarbeiter, VIES-Prüfung und PDF-Rechnungen.',
      excerpt:
        'Wie VaultScope europäische Infrastruktur, transparenten AVV nach Art. 28 DSGVO, EU-VIES-Prüfung und automatischen Rechnungsversand verbindet.',
      category: 'Compliance & Abrechnung',
      readingTimeMin: 4,
      ctaLabel: 'AVV / DPA ansehen',
      ctaHref: '/legal/dpa',
      sections: [
        {
          heading: 'Transparenter Auftragsverarbeitungsvertrag nach Art. 28 DSGVO',
          paragraphs: [
            'Sobald auf gemieteter Server- oder Storage-Infrastruktur personenbezogene Daten Dritter gespeichert werden, ist ein Auftragsverarbeitungsvertrag (AVV) gesetzlich vorgeschrieben.',
            'VaultScope stellt den vollständigen AVV samt dokumentierter Unterauftragsverarbeiter und TOMs transparent bereit – mit europäischen Rechenzentrumsstandorten in Deutschland, Finnland, Frankreich und den Niederlanden.',
          ],
        },
        {
          heading: 'Saubere Abrechnung für deutsche & europäische Teams',
          paragraphs: [
            'Mit integrierter EU-USt-IdNr.-Prüfung (VIES), strukturierten PDF-Rechnungen nach DIN 5008 und automatischem CC-Versand an das eigene Buchhaltungs- oder Steuerberater-Postfach fügt sich VaultScope nahtlos in betriebliche Abläufe ein.',
          ],
        },
      ],
    },
  },
];

export function findStaticGuide(slug: string): SeoGuide | undefined {
  return SEO_GUIDES.find((g) => g.slug === slug);
}
