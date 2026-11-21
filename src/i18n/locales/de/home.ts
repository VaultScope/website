export const home = {
  seo: {
    title: 'VaultScope | Europäische Cloud & Open-Source-Infrastruktur',
    description:
      'VaultScope entwickelt und betreibt europäische Cloud-Infrastruktur, verschlüsselten SFTP-Speicher und Open-Source-Software in Deutschland.',
  },
  hero: {
    tag: 'EUROPÄISCHE INFRASTRUKTUR & SOFTWARE',
    headline: 'Infrastruktur und Software – gemeinsam entwickelt in Deutschland.',
    subtext:
      'Wir betreiben leistungsstarke Cloud-Server, zuverlässige SFTP-Speicherlösungen und setzen auf Open-Source-Technologien sowie dedizierte Infrastruktur in europäischen Rechenzentren. Dabei stehen transparente Preise, zuverlässige Dienste und ein verantwortungsvoller Umgang mit Daten im Mittelpunkt.',
    ctaPrimary: 'Services entdecken',
    ctaSecondary: 'Konto erstellen',
    stats: [
      { value: 'DE', label: 'Gehostet in Deutschland' },
      { value: 'DE / EU', label: 'Datenhaltung (DSGVO)' },
      { value: 'NVMe', label: 'Schneller Speicher' },
      { value: '24/7', label: 'Monitoring' },
    ],
  },
  infrastructure: {
    tag: 'UNSERE SERVICES',
    headline: 'Was wir bereitstellen',
    subtext:
      'Verlässliche Server- und Speicherlösungen für Entwickler und Teams – ganz ohne unnötige Cloud-Komplexität.',
    pricingNotice: 'Klare, verlässliche Monatspreise.',
    cards: [
      {
        title: 'SFTP-Speicher',
        status: 'Jetzt verfügbar',
        desc: 'Verschlüsselter Cloud-Speicher für jeden gängigen SFTP-Client (FileZilla, Cyberduck, WinSCP oder CLI) mit Passwort- und SSH-Key-Authentifizierung.',
        specs: ['SFTP & SSH-Keys', 'Verschlüsselter ZFS-Speicher', 'Sofort einsatzbereit'],
        href: '/infrastructure/storage/',
        cta: 'Mehr erfahren',
      },
      {
        title: 'Cloud VPS',
        status: 'In Vorbereitung',
        desc: 'KVM-isolierte virtuelle Linux-Server mit schnellem lokalem NVMe-Speicher und konstant hoher Rechenleistung.',
        specs: ['KVM-Isolation', 'NVMe-SSDs', 'Voller Root-Zugriff'],
        href: '/infrastructure/cloud/',
        cta: 'Mehr erfahren',
      },
      {
        title: 'Dedizierte Server',
        status: 'Jetzt verfügbar',
        desc: 'Exklusive Bare-Metal-Server mit ungeteilter Hardware-Performance und vollem Root-Zugriff. Die Bereitstellung dauert nach erfolgreicher Zahlung regulär bis zu 7 Werktage.',
        specs: ['Dedizierte Hardware', 'Bis zu 7 Werktage', '10-Gbit/s-Anbindung'],
        href: '/infrastructure/dedicated/',
        cta: 'Server konfigurieren',
      },
      {
        title: 'One-Click Deploy',
        status: 'In Entwicklung',
        desc: 'Starten Sie vorkonfigurierte Webanwendungen, Datenbanken und Container in Sekunden – ohne eigenen Administrationsaufwand.',
        specs: ['Container-Hosting', 'Automatisches SSL', 'Kein Server-Setup nötig'],
        href: '/deploy/',
        cta: 'Mehr erfahren',
      },
      {
        title: 'Managed Infrastructure',
        status: 'Jetzt verfügbar',
        desc: 'Wir übernehmen Architektur, Einrichtung, Sicherheitsupdates, Backups und das 24/7-Monitoring, damit Sie sich voll auf Ihr Projekt konzentrieren können.',
        specs: ['24/7-Monitoring', 'Automatische Backups', 'Direkter Engineering-Support'],
        href: '/infrastructure/managed/',
        cta: 'Mehr erfahren',
      },
    ],
  },
  software: {
    tag: 'SOFTWARE',
    headline: 'Software, die wir selbst entwickeln',
    subtext:
      'Ergänzend zu unserer Hosting-Infrastruktur entwickeln wir eigene Open-Source-Systeme für Provisionierung, Administration und Community-Management.',
    cards: [
      {
        title: 'Pegasus',
        badge: 'Community-Plattform',
        desc: 'Unsere umfassende Discord-Plattform für Server-Moderation, Support-Tickets, Gewinnspiele und Community-Verwaltung.',
        tech: ['TypeScript', 'Next.js', 'PostgreSQL', 'Docker'],
        href: '/software/pegasus/',
        cta: 'Pegasus entdecken',
      },
      {
        title: 'VAMOS',
        badge: 'Modulares Rust-Backend',
        desc: 'Unser in Rust entwickeltes Kernsystem für Ressourcen-Provisionierung, Authentifizierung, Abrechnung und Storefront-APIs.',
        tech: ['Rust', 'Axum', 'PostgreSQL'],
        href: '/software/vamos/',
        cta: 'VAMOS entdecken',
      },
      {
        title: 'CAMOS',
        badge: 'Administrations-Suite',
        desc: 'Unsere Administrations-Suite zur zentralen Verwaltung von Kunden, Produkten, Mitarbeitern, rollenbasierter Zugriffskontrolle (RBAC) und Betriebsabläufen.',
        tech: ['React', 'TypeScript', 'Rust'],
        href: '/software/camos/',
        cta: 'CAMOS entdecken',
      },
    ],
  },
  principles: {
    tag: 'WARUM VAULTSCOPE',
    headline: 'Warum VaultScope?',
    subtext: 'Offene Architektur, durchdachte Werkzeuge und verlässliche Infrastruktur.',
    items: [
      {
        title: 'Transparenz',
        desc: 'Von offen einsehbaren Preisen und Hardwarespezifikationen bis hin zu unserem Quellcode und Betriebsstatus arbeiten wir ohne Blackboxen oder versteckte Drosselungen.',
      },
      {
        title: 'Community',
        desc: 'Wir entwickeln VaultScope im direkten Austausch mit Entwicklern, Systemadministratoren und Teams über offene Repositories und direkten technischen Dialog.',
      },
      {
        title: 'Vertrauen',
        desc: 'Wir begegnen unseren Kunden auf Augenhöhe – mit vollem Root-Zugriff, überprüfbarer Infrastruktur und klaren Zusagen statt künstlichem Lock-in.',
      },
    ],
  },
  waitlist: {
    tag: 'NEWSLETTER',
    headline: 'Auf dem Laufenden bleiben',
    subtext:
      'Abonnieren Sie unseren Newsletter für Neuigkeiten zu neuen Funktionen, Server-Verfügbarkeiten und Software-Releases.',
  },
};

