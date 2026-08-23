export const infrastructureOverview = {
  eyebrow: 'INFRASTRUKTUR',
  title: 'Cloud VPS. Dedizierte Server. Managed Infrastruktur.',
  description: 'Drei Infrastrukturmodelle auf EU-basierter Infrastruktur. Transparente Technologie, Open-Source-Tools und Engineering ohne unnötige Komplexität.',
  cloud: {
    label: 'Stufe 01',
    title: 'Cloud VPS',
    desc: 'Flexible virtuelle Infrastruktur für Anwendungen, Dienste und Entwicklungs-Workloads. Saubere Ressourcenisolierung auf moderner Virtualisierungstechnologie.',
    cta: 'Cloud VPS entdecken',
  },
  dedicated: {
    label: 'Stufe 02',
    title: 'Dedizierte Server',
    desc: 'Physische Hardware mit vollständiger Ressourcenhoheit. Kein Shared Hosting, keine Ressourcenkonflikte — für Workloads, die konsistente Performance erfordern.',
    cta: 'Dediziert entdecken',
  },
  managed: {
    label: 'Managed',
    title: 'Managed Infrastruktur',
    desc: 'Individuelle Architektur, die von Ingenieuren entworfen und betrieben wird. Von der Provisionierung über das Monitoring bis zur Incident Response — Infrastruktur ohne den operativen Overhead.',
    cta: 'Mehr erfahren',
  },
  facts: {
    infrastructure: { label: 'Infrastruktur', value: 'Enterprise Hardware', note: 'Premium EU-Rechenzentren.' },
    locations: { label: 'Standorte', value: 'Europäische Union', note: 'Alle Server in erstklassigen EU-Rechenzentren (NL, DE, FR, IT, UK).' },
    legal: { label: 'Rechtliches', value: 'DSGVO-konform', note: 'Kein Datentransfer außerhalb des EWR für Server-Infrastruktur.' },
  },
  technology: {
    eyebrow: 'Technologie-Fundament',
    title: 'Auf offener Infrastruktur gebaut.',
    description: 'Proxmox-basierte Virtualisierung auf Debian. Enterprise-grade Monitoring und automatisierte Deployment-Pipelines. Versioniert auf Forgejo.',
    cta: 'Gesamten Technology-Stack ansehen',
  },
  waitlist: {
    title: 'Erfahren Sie es zuerst.',
    description: 'Cloud VPS und Dedizierte Server befinden sich derzeit in Vorbereitung. Hinterlassen Sie Ihre E-Mail und wir benachrichtigen Sie zum Launch.',
  },
};

export const infrastructureCloud = {
  title: 'Cloud VPS — VaultScope',
  metaDescription: 'VaultScope Cloud VPS — flexible virtuelle Infrastruktur auf Proxmox und Debian. EU-basierte Rechenzentren, saubere Ressourcenisolierung, voller Root-Zugriff.',
  breadcrumb: 'Cloud VPS',
  eyebrow: 'CLOUD VPS',
  heroTitle: 'Flexible virtuelle Infrastruktur.',
  heroDescription: 'Virtuelle Rechenleistung auf moderner Proxmox-basierter Infrastruktur. Saubere Ressourcenisolierung, voller Root-Zugriff und transparente Technologie — für Anwendungen, Dienste und Entwicklungs-Workloads.',
  useCases: {
    eyebrow: 'Anwendungsfälle',
    title: 'Für echte Workloads gebaut.',
    items: [
      { title: 'Anwendungen & Dienste', desc: 'Produktions-Webanwendungen, APIs, Microservices und Backend-Dienste.' },
      { title: 'Entwicklungsumgebungen', desc: 'Isolierte Entwicklungs- und Staging-Umgebungen, die die Produktion spiegeln.' },
      { title: 'Datenbanken', desc: 'Selbstverwaltete Datenbank-Instanzen mit dedizierten Ressourcen und Storage.' },
      { title: 'Web-Hosting', desc: 'Websites, CMS-Plattformen und Static-Site-Generatoren mit voller Kontrolle.' },
    ],
  },
  architecture: {
    eyebrow: 'Architektur',
    title: 'Moderne Virtualisierungsinfrastruktur.',
    description: 'Aufgebaut auf Proxmox und Debian — Open-Source-Infrastruktur, die Sie verstehen und prüfen können.',
    items: [
      { title: 'Proxmox-Virtualisierung', desc: 'Enterprise-Grade Open-Source-Hypervisor mit sauberer Ressourcenisolierung zwischen Instanzen.' },
      { title: 'Debian-Fundament', desc: 'Stabiles, produktionsreifes Linux. Seit Jahrzehnten im Produktionseinsatz bewährt.' },
      { title: 'Voller Root-Zugriff', desc: 'Vollständige Kontrolle über Ihre virtuelle Maschine. Installieren, konfigurieren und verwalten Sie alles.' },
      { title: 'EU-Infrastruktur', desc: 'Alle Server in erstklassigen EU-Rechenzentren (NL, DE, FR, IT, UK). DSGVO-konform by Design.' },
      { title: 'Monitoring', desc: 'Infrastruktur-Health mit Uptime Kuma und Beszel überwacht. Transparente Observability.' },
      { title: 'Kein Vendor Lock-in', desc: 'Standard-Linux-VMs. Jederzeit mit Standard-Tools migrieren.' },
    ],
  },
  pricing: 'Spezifikationen und Preise werden zum Launch veröffentlicht.',
  waitlist: {
    title: 'Erfahren Sie es zuerst.',
    description: 'Cloud VPS befindet sich derzeit in Vorbereitung. Hinterlassen Sie Ihre E-Mail und wir benachrichtigen Sie zum Launch.',
  },
};

export const infrastructureDedicated = {
  title: 'Dedizierte Server — VaultScope',
  metaDescription: 'VaultScope Dedizierte Server — physische Hardware mit vollständiger Ressourcenhoheit. Kein Shared Hosting. EU-basierte Rechenzentren.',
  breadcrumb: 'Dedizierte Server',
  eyebrow: 'DEDIZIERTE SERVER',
  heroTitle: 'Physische Hardware. Volle Kontrolle.',
  heroDescription: 'Dedizierte physische Infrastruktur mit vollständiger Ressourcenhoheit. Keine geteilte Hardware, keine Ressourcenkonflikte — für Workloads, die konsistente Performance und direkten Hardware-Zugriff erfordern.',
  differentiators: {
    eyebrow: 'Dediziert',
    title: '100% exklusive Ressourcen.',
    items: [
      { title: 'Keine geteilten Ressourcen', desc: 'Jeder CPU-Kern, jedes Byte RAM, jede Disk-Operation gehört ausschließlich Ihnen.' },
      { title: 'Vollständige Hardware-Hoheit', desc: 'Physische Hardware, vollständig Ihren Workloads zugewiesen. Keine Noisy Neighbors.' },
      { title: 'Direkter Hardware-Zugriff', desc: 'Zugang zum gesamten Hardware-Stack. BIOS, RAID, Netzwerk auf physischer Ebene konfigurieren.' },
      { title: 'Konsistente Performance', desc: 'Kein Virtualisierungs-Overhead. Vorhersagbare, reproduzierbare Performance unter jeder Last.' },
    ],
  },
  useCases: {
    eyebrow: 'Anwendungsfälle',
    title: 'Für anspruchsvolle Workloads gebaut.',
    items: [
      { title: 'Performance-Kritisch', desc: 'Anwendungen, die garantierte Ressourcen und minimale Latenz erfordern.' },
      { title: 'Großmaßstab', desc: 'Dienste mit hohem Traffic-Volumen, die vorhersagbaren Durchsatz benötigen.' },
      { title: 'Compliance', desc: 'Workloads mit regulatorischen Anforderungen an Datenisolierung.' },
      { title: 'Hoher Durchsatz', desc: 'Datenintensive Operationen, die von dediziertem I/O und Bandbreite profitieren.' },
    ],
  },
  technical: [
    { label: 'Betriebssystem', value: 'Debian', note: 'Stabile, produktionsreife Linux-Distribution.' },
    { label: 'Standort', value: 'Europäische Union', note: 'EU-basierte Rechenzentren. DSGVO-konform.' },
    { label: 'Infrastruktur', value: 'Enterprise Hardware', note: 'Premium physische Hardware.' },
  ],
  pricing: 'Spezifikationen und Preise werden zum Launch veröffentlicht.',
  waitlist: {
    title: 'Erfahren Sie es zuerst.',
    description: 'Dedizierte Server befinden sich derzeit in Vorbereitung. Hinterlassen Sie Ihre E-Mail und wir benachrichtigen Sie zum Launch.',
  },
};

export const infrastructureManaged = {
  title: 'Managed Infrastruktur — VaultScope',
  metaDescription: 'VaultScope Managed Infrastruktur — individuelle Architektur, entworfen, deployed und betrieben von Ingenieuren. EU-basiert, auf Open-Source-Technologie gebaut.',
  breadcrumb: 'Managed',
  eyebrow: 'MANAGED INFRASTRUKTUR',
  heroTitle: 'Infrastruktur, betrieben.',
  heroDescription: 'Individuelle Architektur, die von Ingenieuren entworfen, deployed und betrieben wird. Von der Provisionierung über das Monitoring bis zur Incident Response — Infrastruktur ohne den operativen Overhead.',
  capabilities: {
    eyebrow: 'Was enthalten ist',
    title: 'Vollständiges Lifecycle-Management.',
    items: [
      { title: 'Architektur-Design', desc: 'Individuelle Infrastruktur-Architektur, entworfen für Ihre spezifischen Anforderungen und Workloads.' },
      { title: 'Provisionierung', desc: 'Server provisioniert, konfiguriert und gehärtet gemäß der entworfenen Architektur.' },
      { title: 'Deployment', desc: 'Application-Deployment-Pipelines eingerichtet und verwaltet. Zero-Downtime-Deployments.' },
      { title: 'Monitoring', desc: 'Infrastruktur-Health 24/7 überwacht. Uptime Kuma und Beszel für transparente Observability.' },
      { title: 'Incident Response', desc: 'Probleme von Ingenieuren erkannt und behoben. Direkte Kommunikation, keine Ticket-Warteschlangen.' },
      { title: 'Wartung', desc: 'Sicherheits-Patches, OS-Updates und Infrastruktur-Wartung proaktiv durchgeführt.' },
    ],
  },
  process: {
    eyebrow: 'Prozess',
    title: 'So funktioniert es.',
    steps: [
      { step: '01', title: 'Discovery', desc: 'Wir verstehen Ihre Anforderungen, Workloads und Rahmenbedingungen.' },
      { step: '02', title: 'Architektur', desc: 'Individuelle Infrastruktur, entworfen für Ihre spezifischen Bedürfnisse.' },
      { step: '03', title: 'Deployment', desc: 'Infrastruktur provisioniert, konfiguriert und validiert.' },
      { step: '04', title: 'Operations', desc: 'Laufendes Monitoring, Wartung und Incident Response.' },
    ],
  },
  whoItsFor: {
    eyebrow: 'Für wen',
    title: 'Für Teams, die Infrastruktur ohne den Overhead brauchen.',
    items: [
      'Teams ohne dedizierte Infrastruktur-Ingenieure',
      'Projekte, die von Tag eins produktionsreife Infrastruktur benötigen',
      'Organisationen mit Compliance-Anforderungen an EU-Datenresidenz',
      'Workloads, die Shared Hosting entwachsen sind, aber kein vollständiges Plattform-Team brauchen',
    ],
  },
  pricing: {
    title: 'Preise',
    description: 'Managed Infrastruktur wird pro Projekt basierend auf Umfang und Anforderungen bepreist. Kontaktieren Sie uns, um Ihre Bedürfnisse zu besprechen.',
    cta: 'Kontakt aufnehmen',
  },
};
