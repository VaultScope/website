export const infrastructureOverview = {
  eyebrow: 'INFRASTRUKTUR',
  title: 'Cloud VPS. Dedizierte Server. Managed Infrastructure.',
  description: 'Drei aufeinander abgestimmte Infrastruktur-Modelle in europäischen Rechenzentren – basierend auf transparenter Technik, Open-Source-Werkzeugen und klarem Engineering.',
  cloud: {
    label: 'Stufe 01',
    title: 'Cloud VPS',
    desc: 'Flexible virtuelle Server für Anwendungen, APIs und Entwicklungsumgebungen – mit sauberer KVM-Ressourcenisolierung und schnellem NVMe-Speicher.',
    cta: 'Cloud VPS entdecken',
  },
  dedicated: {
    label: 'Stufe 02',
    title: 'Dedizierte Server',
    desc: 'Exklusive Bare-Metal-Hardware mit voller Ressourcenhoheit. Keine geteilte Hardware, keine Nachbarschaftseffekte – entwickelt für konstant höchste Performance.',
    cta: 'Dedizierte Server entdecken',
  },
  managed: {
    label: 'Managed',
    title: 'Managed Infrastructure',
    desc: 'Individuell konzipierte und durch unsere Ingenieure betriebene Infrastruktur. Von der Bereitstellung über das 24/7-Monitoring bis zur Störungsbehebung – ohne eigenen Betriebsaufwand.',
    cta: 'Mehr erfahren',
  },
  facts: {
    infrastructure: { label: 'Infrastruktur', value: 'Enterprise-Hardware', note: 'Zertifizierte Rechenzentren in der EU.' },
    locations: { label: 'Standorte', value: 'Europäische Union', note: 'Betrieb in erstklassigen europäischen Rechenzentren.' },
    legal: { label: 'Datenschutz', value: 'DSGVO-konform', note: 'Kein Datentransfer außerhalb des Europäischen Wirtschaftsraums.' },
  },
  technology: {
    eyebrow: 'Technologie-Fundament',
    title: 'Auf offener Infrastruktur aufgebaut.',
    description: 'Proxmox-basierte Virtualisierung auf Debian, transparentes System-Monitoring und automatisierte Deployment-Pipelines – versioniert auf Forgejo.',
    cta: 'Gesamten Technologie-Stack ansehen',
  },
  waitlist: {
    title: 'Als Erste informiert werden.',
    description: 'Cloud VPS und Dedizierte Server befinden sich aktuell in Vorbereitung. Hinterlassen Sie Ihre E-Mail-Adresse, um direkt zum Start benachrichtigt zu werden.',
  },
};

export const infrastructureCloud = {
  title: 'Cloud VPS — VaultScope',
  metaDescription: 'VaultScope Cloud VPS – flexible virtuelle Infrastruktur auf Basis von Proxmox und Debian in europäischen Rechenzentren mit vollem Root-Zugriff.',
  breadcrumb: 'Cloud VPS',
  eyebrow: 'CLOUD VPS',
  heroTitle: 'Flexible *virtuelle Infrastruktur*.',
  heroDescription: 'Virtuelle Rechenleistung auf moderner Proxmox- und KVM-Basis. Saubere Ressourcenisolierung, voller Root-Zugriff und transparente Technik – für Webanwendungen, APIs und Entwicklungsumgebungen.',
  useCases: {
    eyebrow: 'Einsatzbereiche',
    title: 'Für produktive Workloads konzipiert.',
    items: [
      { title: 'Anwendungen & APIs', desc: 'Produktive Webanwendungen, REST- und GraphQL-APIs, Microservices sowie Backend-Dienste.' },
      { title: 'Entwicklung & Staging', desc: 'Isolierte Entwicklungs-, Test- und Staging-Umgebungen unter realen Produktionsbedingungen.' },
      { title: 'Datenbanken', desc: 'Selbst betriebene relationale Datenbanken und Caches mit schnellem lokalem NVMe-Speicher.' },
      { title: 'Web-Plattformen', desc: 'Websites, Content-Management-Systeme und Web-Applikationen mit voller Systemkontrolle.' },
    ],
  },
  architecture: {
    eyebrow: 'Architektur',
    title: 'Moderne Virtualisierung ohne Blackboxen.',
    description: 'Aufgebaut auf Proxmox und Debian – eine offene Infrastruktur, die Sie jederzeit nachvollziehen und überprüfen können.',
    items: [
      { title: 'Proxmox-Virtualisierung', desc: 'Bewährter Open-Source-Hypervisor mit strikter Ressourcenisolierung zwischen den einzelnen Instanzen.' },
      { title: 'Debian-Fundament', desc: 'Stabiles, produktionsreifes Linux-Betriebssystem mit jahrzehntelanger Bewährung im Serverbetrieb.' },
      { title: 'Voller Root-Zugriff', desc: 'Uneingeschränkte Kontrolle über Ihre virtuelle Maschine – installieren und konfigurieren Sie Ihren Stack frei.' },
      { title: 'EU-Rechenzentren', desc: 'Betrieb in europäischen Rechenzentren mit konsequenter Umsetzung der DSGVO.' },
      { title: 'Transparentes Monitoring', desc: 'Systemgesundheit und Verfügbarkeit werden durchgehend mit Uptime Kuma und Beszel überwacht.' },
      { title: 'Kein Vendor-Lock-in', desc: 'Standardisierte Linux-VMs, die sich jederzeit mit gängigen Werkzeugen migrieren lassen.' },
    ],
  },
  pricing: 'Detaillierte Spezifikationen und Preise werden zum Start veröffentlicht.',
  waitlist: {
    title: 'Als Erste informiert werden.',
    description: 'Cloud VPS befindet sich aktuell in Vorbereitung. Hinterlassen Sie Ihre E-Mail-Adresse, um direkt zum Start benachrichtigt zu werden.',
  },
};

export const infrastructureDedicated = {
  title: 'Dedizierte Server — VaultScope',
  metaDescription: 'VaultScope Dedizierte Server – exklusive physische Hardware mit voller Ressourcenhoheit in europäischen Rechenzentren.',
  breadcrumb: 'Dedizierte Server',
  eyebrow: 'DEDIZIERTE SERVER',
  heroTitle: 'Physische Hardware. *Volle Kontrolle*.',
  heroDescription: 'Exklusive Bare-Metal-Server mit vollständiger Ressourcenhoheit. Keine geteilte Hardware, keine Nachbarschaftseffekte – für Workloads, die konstante Höchstleistung und direkten Hardware-Zugriff verlangen.',
  differentiators: {
    eyebrow: 'Dediziert',
    title: '100 % exklusive Hardware-Ressourcen.',
    items: [
      { title: 'Ungeteilte Leistung', desc: 'Jeder CPU-Kern, jedes Gigabyte RAM und die gesamte NVMe-Bandbreite stehen ausschließlich Ihnen zur Verfügung.' },
      { title: 'Keine Nachbarschaftseffekte', desc: 'Physische Isolation garantiert konstante Performance ohne Einflüsse durch fremde Workloads.' },
      { title: 'Direkter Hardware-Zugriff', desc: 'Voller Zugriff auf den gesamten Hardware-Stack inklusive BIOS, RAID-Konfiguration und Netzwerk-Schnittstellen.' },
      { title: 'Konstante Performance', desc: 'Keinerlei Hypervisor-Overhead – reproduzierbare Spitzenleistung auch unter dauerhafter Volllast.' },
    ],
  },
  useCases: {
    eyebrow: 'Einsatzbereiche',
    title: 'Für anspruchsvolle Workloads gebaut.',
    items: [
      { title: 'Latenzkritische Systeme', desc: 'Anwendungen, die garantierte Rechenzeit und minimale Antwortzeiten erfordern.' },
      { title: 'Hohes Traffic-Aufkommen', desc: 'Plattformen und Dienste mit dauerhaft hohem Durchsatz und vielen gleichzeitigen Verbindungen.' },
      { title: 'Strenge Compliance', desc: 'Workloads mit besonderen regulatorischen Anforderungen an physische Mandanten- und Datenisolierung.' },
      { title: 'Datenintensive Prozesse', desc: 'Datenbanken, Analytics und Storage-Cluster, die von dediziertem NVMe-I/O profitieren.' },
    ],
  },
  technical: [
    { label: 'Betriebssystem', value: 'Debian', note: 'Stabile, produktionsreife Linux-Distribution.' },
    { label: 'Standort', value: 'Europäische Union', note: 'Europäische Rechenzentren, vollständig DSGVO-konform.' },
    { label: 'Infrastruktur', value: 'Enterprise-Hardware', note: 'Dedizierte Server-Hardware für den Dauerbetrieb.' },
  ],
  pricing: 'Detaillierte Spezifikationen und Preise werden zum Start veröffentlicht.',
  waitlist: {
    title: 'Als Erste informiert werden.',
    description: 'Dedizierte Server befinden sich aktuell in Vorbereitung. Hinterlassen Sie Ihre E-Mail-Adresse, um direkt zum Start benachrichtigt zu werden.',
  },
};

export const infrastructureManaged = {
  title: 'Managed Infrastructure — VaultScope',
  metaDescription: 'VaultScope Managed Infrastructure – individuell geplante, bereitgestellte und rund um die Uhr betreute Server-Infrastruktur in Europa.',
  breadcrumb: 'Managed',
  eyebrow: 'MANAGED INFRASTRUCTURE',
  heroTitle: '*Infrastruktur*, zuverlässig betreut.',
  heroDescription: 'Individuelle Systemarchitektur, geplant, eingerichtet und im laufenden Betrieb betreut durch unsere Ingenieure. Von der Bereitstellung über das 24/7-Monitoring bis zur Störungsbehebung – ohne eigenen Administrationsaufwand.',
  capabilities: {
    eyebrow: 'Leistungsumfang',
    title: 'Ganzheitliche Betreuung im laufenden Betrieb.',
    items: [
      { title: 'Architekturplanung', desc: 'Maßgeschneiderte Infrastruktur-Konzepte, abgestimmt auf Ihre technischen Anforderungen und Ihr Wachstum.' },
      { title: 'Bereitstellung & Härtung', desc: 'Vollständige Einrichtung, Grundkonfiguration und Sicherheits-Härtung aller Server- und Netzwerkkomponenten.' },
      { title: 'Deployment-Pipelines', desc: 'Einrichtung und Pflege automatisierter CI/CD- und Container-Deployments ohne Ausfallzeiten.' },
      { title: '24/7-Monitoring', desc: 'Durchgehende Überwachung von Systemlast, Diensten und Erreichbarkeit mit Uptime Kuma und Beszel.' },
      { title: 'Störungsbehebung', desc: 'Proaktive Reaktion im Fehlerfall direkt durch unsere Ingenieure – mit kurzen Wegen statt Ticket-Warteschlangen.' },
      { title: 'Wartung & Updates', desc: 'Regelmäßige Sicherheits-Patches, Betriebssystem-Updates und Backup-Prüfungen im laufenden Betrieb.' },
    ],
  },
  process: {
    eyebrow: 'Ablauf',
    title: 'So arbeiten wir zusammen.',
    steps: [
      { step: '01', title: 'Bedarfsanalyse', desc: 'Wir analysieren Ihre bestehenden Systeme, Workloads und technischen Rahmenbedingungen.' },
      { step: '02', title: 'Architektur', desc: 'Wir entwerfen ein klares, belastbares Infrastruktur-Konzept für Ihren Anwendungsfall.' },
      { step: '03', title: 'Bereitstellung', desc: 'Wir richten die Umgebung vollständig ein, härten alle Systeme und testen das Setup.' },
      { step: '04', title: 'Laufender Betrieb', desc: 'Wir übernehmen Monitoring, Wartung, Backups und den direkten technischen Support.' },
    ],
  },
  whoItsFor: {
    eyebrow: 'Zielgruppe',
    title: 'Für Teams, die verlässliche Infrastruktur ohne eigenen Betriebsaufwand suchen.',
    items: [
      'Entwicklungsteams ohne eigene Vollzeit-Administratoren oder DevOps-Abteilung',
      'Projekte, die vom ersten Tag an eine produktionsreife und abgesicherte Umgebung benötigen',
      'Unternehmen mit klaren Anforderungen an europäische Datenhaltung und DSGVO-Konformität',
      'Wachsende Plattformen, die dem klassischen Shared Hosting entwachsen sind',
    ],
  },
  pricing: {
    title: 'Konditionen',
    description: 'Managed Infrastructure wird individuell nach Systemumfang und Betreuungsbedarf kalkuliert. Sprechen Sie uns an, um Ihr Vorhaben gemeinsam durchzugehen.',
    cta: 'Kontakt aufnehmen',
  },
};

