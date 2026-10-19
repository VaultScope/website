import { PageHero, Button } from '../components/Shared';
import { Check, Circle, ArrowRight } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { LocaleLink } from '../i18n/LocaleLink';
import { useLanguage } from '../i18n';

interface RoadmapItem {
  label: string;
  labelDe: string;
  completed: boolean;
}

interface RoadmapQuarter {
  quarter: string;
  title: string;
  titleDe: string;
  statusLabel: string;
  statusLabelDe: string;
  active?: boolean;
  items: RoadmapItem[];
}

export const ROADMAP_QUARTERS: RoadmapQuarter[] = [
  {
    quarter: 'Q4 2026',
    title: 'Foundation & Launch',
    titleDe: 'Fundament & Launch',
    statusLabel: 'Active Phase',
    statusLabelDe: 'Aktive Phase',
    active: true,
    items: [
      {
        label: 'Launch VaultScope',
        labelDe: 'Launch von VaultScope',
        completed: true,
      },
      {
        label: 'Launch SFTP Storage',
        labelDe: 'Launch von SFTP Storage',
        completed: true,
      },
      {
        label: 'Begin internal development of the VaultScope iOS app',
        labelDe: 'Beginn der internen Entwicklung der VaultScope iOS-App',
        completed: true,
      },
      {
        label: 'Launch Cloud VPS hosting',
        labelDe: 'Launch von Cloud VPS Hosting',
        completed: false,
      },
      {
        label: 'Launch Dedicated Server hosting',
        labelDe: 'Launch von Dedicated Server Hosting',
        completed: false,
      },
      {
        label: 'Introduce customer support tickets in the dashboard',
        labelDe: 'Einführung von Support-Tickets im Kunden-Dashboard',
        completed: true,
      },
      {
        label: 'Improve the VaultScope dashboard UI/UX',
        labelDe: 'Verbesserung der UI/UX des VaultScope Dashboards',
        completed: true,
      },
      {
        label: 'Implement service status and incident notifications',
        labelDe: 'Implementierung von Servicestatus- und Vorfallsbenachrichtigungen',
        completed: true,
      },
      {
        label: 'Launch a public system status page',
        labelDe: 'Launch einer öffentlichen Systemstatus-Seite',
        completed: true,
      },
      {
        label: 'Expand documentation and setup guides',
        labelDe: 'Erweiterung der Dokumentation und Einrichtungsleitfäden',
        completed: false,
      },
      {
        label: 'Introduce usage statistics and storage quota monitoring',
        labelDe: 'Einführung von Nutzungsstatistiken und Speicherplatz-Überwachung',
        completed: false,
      },
      {
        label: 'Implement account security improvements and session management',
        labelDe: 'Verbesserungen der Kontosicherheit und Sitzungsverwaltung',
        completed: false,
      },
      {
        label: 'Establish automated infrastructure monitoring and alerting',
        labelDe: 'Aufbau von automatisiertem Infrastruktur-Monitoring und Alerting',
        completed: false,
      },
      {
        label: 'Optimize infrastructure reliability and service availability',
        labelDe: 'Optimierung der Infrastruktur-Zuverlässigkeit und Service-Verfügbarkeit',
        completed: false,
      },
    ],
  },
  {
    quarter: 'Q1 2027',
    title: 'Expansion & Ecosystem',
    titleDe: 'Expansion & Ökosystem',
    statusLabel: 'Planned',
    statusLabelDe: 'Geplant',
    items: [
      {
        label: 'Public release of the VaultScope iOS app',
        labelDe: 'Öffentlicher Release der VaultScope iOS-App',
        completed: false,
      },
      {
        label: 'Introduce push notifications for service alerts',
        labelDe: 'Einführung von Push-Benachrichtigungen für Service-Warnungen',
        completed: false,
      },
      {
        label: 'Implement self-service VPS provisioning',
        labelDe: 'Implementierung von Self-Service VPS-Provisionierung',
        completed: false,
      },
      {
        label: 'Introduce automated server deployment and management',
        labelDe: 'Einführung von automatisierter Server-Bereitstellung und -Verwaltung',
        completed: false,
      },
      {
        label: 'Expand SFTP Storage with additional management features',
        labelDe: 'Erweiterung von SFTP Storage um zusätzliche Verwaltungsfunktionen',
        completed: false,
      },
      {
        label: 'Introduce API access for customer infrastructure management',
        labelDe: 'Einführung von API-Zugriff für die Kunden-Infrastrukturverwaltung',
        completed: false,
      },
      {
        label: 'Implement resource usage and billing overviews',
        labelDe: 'Implementierung von Ressourcennutzungs- und Abrechnungsübersichten',
        completed: false,
      },
      {
        label: 'Introduce service lifecycle management in the dashboard',
        labelDe: 'Einführung von Service-Lifecycle-Management im Dashboard',
        completed: false,
      },
      {
        label: 'Expand the knowledge base and technical documentation',
        labelDe: 'Ausbau der Wissensdatenbank und technischen Dokumentation',
        completed: false,
      },
      {
        label: 'Introduce customer-facing maintenance notifications',
        labelDe: 'Einführung kundenorientierter Wartungsbenachrichtigungen',
        completed: false,
      },
    ],
  },
  {
    quarter: 'Q2 2027',
    title: 'Automation & Growth',
    titleDe: 'Automatisierung & Wachstum',
    statusLabel: 'Planned',
    statusLabelDe: 'Geplant',
    items: [
      {
        label: 'Introduce automated backups for supported services',
        labelDe: 'Einführung automatisierter Backups für unterstützte Dienste',
        completed: false,
      },
      {
        label: 'Implement snapshots and restore functionality for VPS',
        labelDe: 'Implementierung von Snapshots und Wiederherstellungsfunktionen für VPS',
        completed: false,
      },
      {
        label: 'Expand server configuration and customization options',
        labelDe: 'Erweiterung der Server-Konfigurations- und Anpassungsoptionen',
        completed: false,
      },
      {
        label: 'Introduce team accounts and role-based access control',
        labelDe: 'Einführung von Team-Accounts und rollenbasierter Zugriffskontrolle (RBAC)',
        completed: false,
      },
      {
        label: 'Implement advanced infrastructure monitoring',
        labelDe: 'Implementierung von erweitertem Infrastruktur-Monitoring',
        completed: false,
      },
      {
        label: 'Introduce configurable alerts and notification preferences',
        labelDe: 'Einführung konfigurierbarer Warnungen und Benachrichtigungseinstellungen',
        completed: false,
      },
      {
        label: 'Expand the VaultScope API and developer documentation',
        labelDe: 'Erweiterung der VaultScope API und Entwicklerdokumentation',
        completed: false,
      },
      {
        label: 'Introduce service health reports and usage analytics',
        labelDe: 'Einführung von Service-Health-Reports und Nutzungsanalysen',
        completed: false,
      },
      {
        label: 'Optimize provisioning workflows and deployment times',
        labelDe: 'Optimierung von Provisionierungs-Workflows und Bereitstellungszeiten',
        completed: false,
      },
      {
        label: 'Expand hosting infrastructure and available capacity',
        labelDe: 'Ausbau der Hosting-Infrastruktur und verfügbaren Kapazitäten',
        completed: false,
      },
    ],
  },
  {
    quarter: 'Q3 2027',
    title: 'Maturity & Scale',
    titleDe: 'Reife & Skalierung',
    statusLabel: 'Planned',
    statusLabelDe: 'Geplant',
    items: [
      {
        label: 'Introduce advanced account and organization management',
        labelDe: 'Einführung von erweitertem Konto- und Organisationsmanagement',
        completed: false,
      },
      {
        label: 'Expand infrastructure redundancy and fault tolerance',
        labelDe: 'Ausbau der Infrastruktur-Redundanz und Fehlertoleranz',
        completed: false,
      },
      {
        label: 'Implement more granular permissions and audit logs',
        labelDe: 'Implementierung feingranularer Berechtigungen und Audit-Logs',
        completed: false,
      },
      {
        label: 'Introduce additional storage and hosting products',
        labelDe: 'Einführung weiterer Storage- und Hosting-Produkte',
        completed: false,
      },
      {
        label: 'Expand automation capabilities across services',
        labelDe: 'Erweiterung der Automatisierungsfunktionen über alle Dienste hinweg',
        completed: false,
      },
      {
        label: 'Improve dashboard performance and accessibility',
        labelDe: 'Verbesserung der Dashboard-Performance und Barrierefreiheit',
        completed: false,
      },
      {
        label: 'Introduce advanced monitoring integrations',
        labelDe: 'Einführung erweiterter Monitoring-Integrationen',
        completed: false,
      },
      {
        label: 'Expand developer tooling and API capabilities',
        labelDe: 'Ausbau von Developer-Tooling und API-Fähigkeiten',
        completed: false,
      },
      {
        label: 'Review pricing models and service packages',
        labelDe: 'Überprüfung der Preismodelle und Leistungspakete',
        completed: false,
      },
      {
        label: 'Evaluate international expansion and additional infrastructure locations',
        labelDe: 'Evaluierung internationaler Expansion und weiterer Infrastruktur-Standorte',
        completed: false,
      },
    ],
  },
];

export const Roadmap = () => {
  const { locale, t } = useLanguage();
  const isDe = locale === 'de';

  const totalItems = ROADMAP_QUARTERS.reduce((sum, q) => sum + q.items.length, 0);
  const completedItems = ROADMAP_QUARTERS.reduce(
    (sum, q) => sum + q.items.filter((i) => i.completed).length,
    0
  );

  return (
    <div className="flex flex-col w-full bg-[var(--bg)] text-[var(--fg)]">
      <SeoHead
        title={
          isDe
            ? 'Roadmap — Produkt- & Infrastruktur-Meilensteine | VaultScope'
            : 'Roadmap — Product & Infrastructure Milestones | VaultScope'
        }
        description={
          isDe
            ? 'Öffentliche Entwicklungs-Roadmap von VaultScope von Q4 2026 bis Q3 2027: Cloud VPS, Dedicated Server, SFTP Storage, iOS-App und API-Automatisierung.'
            : 'Public engineering and infrastructure roadmap for VaultScope from Q4 2026 through Q3 2027 across Cloud VPS, Dedicated Servers, SFTP Storage, iOS app, and API automation.'
        }
        path="/company/roadmap"
      />

      <PageHero
        breadcrumbs={[
          { label: t.nav.company || (isDe ? 'Unternehmen' : 'Company'), href: '/company/about/' },
          { label: 'Roadmap' },
        ]}
        title="Roadmap"
        description={
          isDe
            ? 'Unser öffentlicher Entwicklungs- und Infrastrukturplan von Q4 2026 bis Q3 2027. Verfolgen Sie abgeschlossene Meilensteine, aktive Releases und geplante Plattform-Erweiterungen.'
            : 'Our public engineering and infrastructure delivery plan from Q4 2026 through Q3 2027. Track completed milestones, active deliverables, and upcoming platform capabilities.'
        }
        primaryCta={isDe ? 'Systemstatus prüfen' : 'System Status'}
        primaryLink="https://status.vaultscope.de/status/vs"
        secondaryCta={t.common.getInTouch}
        secondaryLink="/company/contact/"
        align="left"
      />

      {/* Overall Progress Strip */}
      <section className="py-8">
        <div className="vs-container">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-8 py-6 border-t border-b border-[var(--line)]">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fg-faint)] mb-1">
                {isDe ? 'Aktuelle Phase' : 'Current Phase'}
              </div>
              <div className="font-mono text-base sm:text-lg font-semibold text-[var(--accent-bright)]">
                Q4 2026
              </div>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fg-faint)] mb-1">
                {isDe ? 'Abgeschlossen (Q4)' : 'Completed (Q4)'}
              </div>
              <div className="font-mono text-base sm:text-lg font-semibold text-[var(--fg)] tabular-nums">
                {completedItems} / {ROADMAP_QUARTERS[0].items.length}
              </div>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fg-faint)] mb-1">
                {isDe ? 'Meilensteine Gesamt' : 'Total Milestones'}
              </div>
              <div className="font-mono text-base sm:text-lg font-semibold text-[var(--fg)] tabular-nums">
                {totalItems}
              </div>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fg-faint)] mb-1">
                {isDe ? 'Zeithorizont' : 'Planning Horizon'}
              </div>
              <div className="font-mono text-sm sm:text-lg font-semibold text-[var(--fg)]">
                Q4 2026 — Q3 2027
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quarterly Roadmap Milestones */}
      <section className="py-10 lg:py-14">
        <div className="vs-container space-y-16 lg:space-y-20">
          {ROADMAP_QUARTERS.map((phase) => {
            const doneCount = phase.items.filter((i) => i.completed).length;
            const totalCount = phase.items.length;
            const progressPct = Math.round((doneCount / totalCount) * 100);

            return (
              <div
                key={phase.quarter}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
              >
                {/* Quarter Header Column */}
                <div className="lg:col-span-4 lg:sticky lg:top-24">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-semibold text-[var(--accent-bright)]">
                      {phase.quarter}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono ${
                        phase.active
                          ? 'bg-[var(--accent-subtle)] text-[var(--accent-bright)]'
                          : 'bg-[var(--bg-elevated)] text-[var(--fg-muted)]'
                      }`}
                    >
                      {phase.active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-bright)]" />
                      )}
                      {isDe ? phase.statusLabelDe : phase.statusLabel}
                    </span>
                  </div>

                  <h2 className="text-display-m text-[var(--fg)] tracking-tight mb-3">
                    {phase.quarter} — {isDe ? phase.titleDe : phase.title}
                  </h2>

                  <div className="space-y-2 max-w-xs">
                    <div className="flex items-center justify-between font-mono text-xs text-[var(--fg-muted)]">
                      <span>
                        {doneCount} / {totalCount}{' '}
                        {isDe ? 'abgeschlossen' : 'completed'}
                      </span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="h-1 w-full bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--accent-bright)] transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Quarter Checklist Items Column */}
                <div className="lg:col-span-8">
                  <ul className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
                    {phase.items.map((item) => (
                      <li
                        key={item.label}
                        data-testid={item.completed ? 'roadmap-item-completed' : 'roadmap-item-planned'}
                        className="py-3.5 flex items-start justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          {item.completed ? (
                            <span
                              aria-label="Completed"
                              className="mt-0.5 w-5 h-5 rounded bg-[var(--ok)]/15 text-[var(--ok)] flex items-center justify-center shrink-0"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </span>
                          ) : (
                            <span
                              aria-label="Planned"
                              className="mt-0.5 w-5 h-5 rounded bg-[var(--bg-elevated)] text-[var(--fg-faint)] flex items-center justify-center shrink-0"
                            >
                              <Circle className="w-3 h-3" />
                            </span>
                          )}
                          <span
                            className={`text-sm leading-relaxed ${
                              item.completed
                                ? 'text-[var(--fg)] font-medium'
                                : 'text-[var(--fg-muted)]'
                            }`}
                          >
                            {isDe ? item.labelDe : item.label}
                          </span>
                        </div>

                        <span
                          className={`font-mono text-[11px] shrink-0 pt-0.5 ${
                            item.completed
                              ? 'text-[var(--ok)]'
                              : 'text-[var(--fg-faint)]'
                          }`}
                        >
                          {item.completed
                            ? isDe
                              ? 'Erledigt'
                              : 'Done'
                            : isDe
                              ? 'Geplant'
                              : 'Planned'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 lg:py-16">
        <div className="vs-container flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-lg font-semibold text-[var(--fg)] mb-1">
              {isDe
                ? 'Haben Sie Funktionswünsche oder Fragen zu kommenden Produkten?'
                : 'Have feature requests or questions about upcoming infrastructure?'}
            </h2>
            <p className="text-sm text-[var(--fg-muted)]">
              {isDe
                ? 'Teilen Sie Ihr Feedback im Community-Forum oder kontaktieren Sie unser Engineering-Team direkt.'
                : 'Share feedback in our community forum or reach out directly to our engineering team.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <LocaleLink to="/resources/forum/">
              <Button variant="outline">
                {isDe ? 'Zum Forum' : 'Community Forum'}
              </Button>
            </LocaleLink>
            <LocaleLink to="/company/contact/">
              <Button variant="primary">
                <span>{t.common.getInTouch}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </LocaleLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Roadmap;
