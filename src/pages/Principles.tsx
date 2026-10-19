import { useEffect } from 'react';
import { PageHero } from '../components/Shared';
import { LocaleLink } from '../i18n/LocaleLink';
import { useTranslation } from '../i18n';

export const Principles = () => {
  const { locale } = useTranslation();
  const isDe = locale === 'de';

  useEffect(() => {
    document.title = isDe
      ? 'Unsere Prinzipien — VaultScope'
      : 'Our Principles — VaultScope';
  }, [isDe]);

  const principles = [
    {
      index: '01',
      title: isDe ? 'Transparenz' : 'Transparency',
      subtitle: isDe
        ? 'Keine Blackboxen, keine versteckten Klauseln'
        : 'No black boxes, no hidden clauses',
      description: isDe
        ? 'Transparenz bildet das Fundament von VaultScope. Unsere Kunden sollen jederzeit nachvollziehen können, wie unsere Software arbeitet, welche Hardware hinter ihren Instanzen steht und wie Preise zustande kommen. Wir veröffentlichen klare Spezifikationen, verzichten auf versteckte Drosselungen und kommunizieren Wartungen oder Störungen offen und nachvollziehbar.'
        : 'Transparency is the foundation of VaultScope. Clients should always be able to inspect how our software operates, what hardware backs their workloads, and how pricing is calculated. We publish clear specifications, avoid silent throttling, and communicate maintenance or incidents openly.',
    },
    {
      index: '02',
      title: 'Community',
      subtitle: isDe
        ? 'Gemeinsam mit den Menschen entwickelt, die unsere Plattform nutzen'
        : 'Built alongside the engineers who run on our platform',
      description: isDe
        ? 'Gute Infrastruktur entsteht nicht im Elfenbeinturm. Wir entwickeln VaultScope im engen Austausch mit Entwicklern, Systemadministratoren und Teams aus der Community. Öffentliche Repositories, nachvollziehbare Roadmaps und direkter technischer Dialog sorgen dafür, dass reales Feedback unmittelbar in unsere Plattform einfließt.'
        : 'Great infrastructure is not built in isolation. We develop VaultScope in close collaboration with the developers, system administrators, and teams in our community. Public repositories, transparent roadmaps, and direct technical dialogue ensure real-world feedback shapes our platform.',
    },
    {
      index: '03',
      title: isDe ? 'Vertrauen' : 'Trust',
      subtitle: isDe
        ? 'Partnerschaft auf Augenhöhe statt künstlichem Lock-in'
        : 'Mutual respect over artificial lock-in',
      description: isDe
        ? 'Vertrauen beruht auf Gegenseitigkeit und Verlässlichkeit. Wir begegnen unseren Kunden auf technischer Augenhöhe: Sie erhalten vollen Root-Zugriff, offene Schnittstellen und volle Datenhoheit – ohne restriktive Knebelverträge oder proprietäre Abhängigkeiten, die einen Wechsel künstlich erschweren.'
        : 'Trust is mutual and earned through reliability. We treat our clients as engineering peers: you get full root access, open APIs, and complete ownership of your data—without restrictive contracts or proprietary dependencies designed to make leaving difficult.',
    },
    {
      index: '04',
      title: 'Open Source',
      subtitle: isDe
        ? 'Überprüfbarer Code als Standard'
        : 'Verifiable code by default',
      description: isDe
        ? 'VaultScope kombiniert bewährte Open-Source-Technologien mit selbst entwickelten Systemen wie VAMOS und CAMOS – und stellt diese Eigenentwicklungen ebenfalls als Open Source bereit. Offener Quellcode schafft überprüfbare Sicherheit, verhindert Vendor-Lock-in und stärkt das gesamte Ökosystem.'
        : 'VaultScope pairs proven open-source foundations with our own systems like VAMOS and CAMOS—and releases what we build as open-source software. Auditable code creates verifiable security, prevents vendor lock-in, and strengthens the broader ecosystem.',
    },
    {
      index: '05',
      title: isDe ? 'Datenschutz & Souveränität' : 'Privacy & Data Sovereignty',
      subtitle: isDe
        ? 'Datensparsamkeit und europäische Rechtsklarheit'
        : 'Data minimization and strict European jurisdiction',
      description: isDe
        ? 'Datenschutz ist für uns eine Architekturentscheidung, kein bloßer Compliance-Haken. Wir erheben nur die Daten, die für den technischen Betrieb und die Abrechnung zwingend erforderlich sind, und betreiben unsere Infrastruktur in Deutschland unter strengen europäischen Datenschutzstandards (DSGVO).'
        : 'Privacy is an architectural decision, not a compliance checkbox. We collect only the minimum data required to operate and bill your services, and we run our infrastructure in Germany under strict European data protection regulations (GDPR).',
    },
    {
      index: '06',
      title: isDe ? 'Volle Kontrolle' : 'User Control',
      subtitle: isDe
        ? 'Software, die Ihnen dient – nicht umgekehrt'
        : 'Software that works for you, not against you',
      description: isDe
        ? 'Sie entscheiden selbst, wie und wo Ihre Workloads laufen. Ob über unsere gehostete Infrastruktur oder im Self-Hosting mit unserem offenen Software-Stack: Unsere Werkzeuge geben Ihnen die volle Kontrolle über Konfiguration, Automatisierung und Betrieb.'
        : 'You decide how and where your workloads run. Whether deployed on our hosted infrastructure or self-hosted using our open software stack, our tooling gives you uncompromising control over configuration, automation, and operations.',
    },
  ];

  return (
    <div className="flex flex-col w-full bg-[var(--bg)] text-[var(--fg)]">
      <PageHero
        breadcrumbs={[
          { label: isDe ? 'Unternehmen' : 'Company', href: '/company/about/' },
          { label: isDe ? 'Prinzipien' : 'Principles' },
        ]}
        title={
          isDe
            ? 'Die Prinzipien hinter VaultScope.'
            : 'The principles behind VaultScope.'
        }
        description={
          isDe
            ? 'Infrastruktur und Software sollten den Menschen dienen, die mit ihnen arbeiten. Unsere Entscheidungen folgen klaren Grundsätzen für Transparenz, Community, Vertrauen und technische Souveränität.'
            : 'Infrastructure and software should respect the people who rely on them. Every architectural and operational decision we make is guided by transparency, community collaboration, mutual trust, and user control.'
        }
      />

      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
            {principles.map((item) => (
              <div
                key={item.index}
                className="flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs font-semibold text-[var(--accent-bright)]">
                      {item.index}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-[0.06em] text-[var(--fg-subtle)]">
                      {item.subtitle}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight text-[var(--fg)] pt-1">
                    {item.title}
                  </h2>
                  <p className="text-sm text-[var(--fg-muted)] leading-relaxed pt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-base font-semibold text-[var(--fg)] mb-1">
                {isDe ? 'Architektur & Quellcode prüfen' : 'Inspect our architecture & source code'}
              </h2>
              <p className="text-sm text-[var(--fg-muted)]">
                {isDe
                  ? 'Entdecken Sie unser Open-Source-Ökosystem und unsere Infrastruktur in Deutschland.'
                  : 'Explore our open-source software ecosystem and German infrastructure.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <LocaleLink to="/company/about/" className="vs-btn-secondary">
                {isDe ? 'Über VaultScope' : 'About VaultScope'}
              </LocaleLink>
              <LocaleLink to="/company/open-source/" className="vs-btn-primary">
                {isDe ? 'Open-Source-Philosophie' : 'Open-Source Philosophy'}
              </LocaleLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

