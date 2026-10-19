import { PageHero, Button, RuledTable } from '../components/Shared';
import { WaitlistForm } from '../components/WaitlistForm';
import { ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';
import { SeoHead } from '../components/SeoHead';

export const Hosting = () => {
  const { t, locale } = useLanguage();
  const isDe = locale === 'de';

  const comparisonRows = isDe
    ? [
        {
          product: 'Cloud VPS',
          href: '/infrastructure/cloud/',
          isolation: 'KVM-Hypervisor (Proxmox VE)',
          storage: 'Enterprise-NVMe-Pool',
          network: 'DE / AT · IPv4 + /64 IPv6',
          status: 'In Vorbereitung (Warteliste)',
          availableNow: false,
        },
        {
          product: 'Dedizierte Server',
          href: '/infrastructure/dedicated/',
          isolation: 'Single-Tenant Physische Hardware',
          storage: 'Dedizierte NVMe / ZFS RAID',
          network: 'DE / AT · Ungeteilter Port + IPMI',
          status: 'In Vorbereitung (Warteliste)',
          availableNow: false,
        },
        {
          product: 'SFTP-Backup-Speicher',
          href: '/infrastructure/storage/',
          isolation: 'Chroot-Verzeichnis + ZFS-Dataset',
          storage: 'Redundante ZFS-Prüfsummen-Pools',
          network: 'DE / AT · SSH / SFTP / rsync',
          status: 'In Vorbereitung (Warteliste)',
          availableNow: false,
        },
        {
          product: 'Managed Infrastructure',
          href: '/infrastructure/managed/',
          isolation: 'Dedizierte & geclusterte Systeme',
          storage: 'Verwaltete ZFS/NVMe + Offsite-Backups',
          network: 'DE / AT · 24/7 Überwachung & Betrieb',
          status: 'Auf Anfrage verfügbar',
          availableNow: true,
        },
      ]
    : [
        {
          product: 'Cloud VPS',
          href: '/infrastructure/cloud/',
          isolation: 'KVM Hypervisor (Proxmox VE)',
          storage: 'Enterprise NVMe Pool',
          network: 'DE / AT · IPv4 + /64 IPv6',
          status: 'In Preparation (Waitlist)',
          availableNow: false,
        },
        {
          product: 'Dedicated Servers',
          href: '/infrastructure/dedicated/',
          isolation: 'Single-Tenant Physical Hardware',
          storage: 'Dedicated NVMe / ZFS RAID',
          network: 'DE / AT · Unshared Port + IPMI',
          status: 'In Preparation (Waitlist)',
          availableNow: false,
        },
        {
          product: 'SFTP Backup Storage',
          href: '/infrastructure/storage/',
          isolation: 'Chroot Directory + ZFS Dataset',
          storage: 'Redundant ZFS Checksum Pools',
          network: 'DE / AT · SSH / SFTP / rsync',
          status: 'In Preparation (Waitlist)',
          availableNow: false,
        },
        {
          product: 'Managed Infrastructure',
          href: '/infrastructure/managed/',
          isolation: 'Dedicated & Clustered Systems',
          storage: 'Managed ZFS/NVMe + Offsite Backups',
          network: 'DE / AT · 24/7 Monitoring & Operations',
          status: 'Available on Request',
          availableNow: true,
        },
      ];

  return (
    <div className="flex flex-col w-full bg-[var(--bg)] text-[var(--fg)]">
      <SeoHead
        title={t.hosting.meta.title.replace(' — VaultScope', '')}
        description={t.hosting.meta.description}
        path="/hosting"
      />

      <PageHero
        breadcrumbs={[{ label: t.nav.infrastructure, href: '/infrastructure/' }, { label: 'Hosting' }]}
        title={t.hosting.heroTitle}
        description={t.hosting.heroDescription}
        primaryCta={t.common.joinWaitlist}
        primaryLink="#waitlist"
        secondaryCta={t.common.getInTouch}
        secondaryLink="/company/contact/"
        align="left"
      />

      {/* Two Core Hosting Offerings — Open Architectural Split */}
      <section className="py-12 lg:py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Cloud VPS */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--accent-bright)]">
                    KVM / Proxmox VE
                  </span>
                  <span className="font-mono text-[11px] text-[var(--fg-muted)]">
                    {isDe ? 'Warteliste offen' : 'Waitlist Open'}
                  </span>
                </div>
                <h2 className="text-h3 text-[var(--fg)] mb-2.5">
                  {t.hosting.cloudVps.title}
                </h2>
                <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-6">
                  {t.hosting.cloudVps.description}
                </p>
                <ul className="space-y-2.5 mb-8 border-t border-[var(--line)] pt-5">
                  {t.hosting.cloudVps.features.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--fg)]">
                      <Check className="w-4 h-4 text-[var(--accent-bright)] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[var(--line)] flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--fg-muted)]">DE / AT</span>
                <LocaleLink
                  to="/infrastructure/cloud/"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-bright)] hover:text-[var(--fg)] transition-colors"
                >
                  <span>{t.common.learnMore}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </LocaleLink>
              </div>
            </div>

            {/* Dedicated Servers */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--accent-bright)]">
                    Single-Tenant Bare Metal
                  </span>
                  <span className="font-mono text-[11px] text-[var(--fg-muted)]">
                    {isDe ? 'Warteliste offen' : 'Waitlist Open'}
                  </span>
                </div>
                <h2 className="text-h3 text-[var(--fg)] mb-2.5">
                  {t.hosting.dedicated.title}
                </h2>
                <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-6">
                  {t.hosting.dedicated.description}
                </p>
                <ul className="space-y-2.5 mb-8 border-t border-[var(--line)] pt-5">
                  {t.hosting.dedicated.features.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--fg)]">
                      <Check className="w-4 h-4 text-[var(--accent-bright)] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[var(--line)] flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--fg-muted)]">DE / AT</span>
                <LocaleLink
                  to="/infrastructure/dedicated/"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-bright)] hover:text-[var(--fg)] transition-colors"
                >
                  <span>{t.common.learnMore}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </LocaleLink>
              </div>
            </div>
          </div>

          <p className="mt-8 text-xs text-[var(--fg-muted)]">
            {t.hosting.pricingNote}
          </p>
        </div>
      </section>

      {/* Infrastructure Comparison Matrix & Availability */}
      <section className="py-12 lg:py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="mb-8">
            <h2 className="text-display-m text-[var(--fg)] mb-2">
              {isDe ? 'Architektur- & Verfügbarkeitsübersicht' : 'Architecture & Availability Matrix'}
            </h2>
            <p className="text-sm text-[var(--fg-muted)]">
              {isDe
                ? 'Direkter Vergleich unserer Infrastruktur-Plattformen, Isolationsmodelle und des aktuellen Bereitstellungsstatus.'
                : 'Direct comparison of our infrastructure platforms, isolation models, and current deployment availability.'}
            </p>
          </div>

          <RuledTable>
            <table className="w-full text-left border-collapse border-t border-b border-[var(--line)]">
              <thead>
                <tr className="border-b border-[var(--line)] text-xs font-mono text-[var(--fg-muted)]">
                  <th className="py-3.5 pr-5 font-medium">{isDe ? 'Plattform' : 'Platform'}</th>
                  <th className="py-3.5 px-4 font-medium">{isDe ? 'Isolationsmodell' : 'Isolation Model'}</th>
                  <th className="py-3.5 px-4 font-medium">{isDe ? 'Speicher' : 'Storage'}</th>
                  <th className="py-3.5 px-4 font-medium">{isDe ? 'Netzwerk & Standort' : 'Network & Region'}</th>
                  <th className="py-3.5 px-4 font-medium">{isDe ? 'Status' : 'Availability'}</th>
                  <th className="py-3.5 pl-5 font-medium text-right">{isDe ? 'Details' : 'Details'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {comparisonRows.map((row) => (
                  <tr key={row.href} className="hover:bg-[var(--bg-elevated)]/50 transition-colors">
                    <td className="py-4 pr-5 font-semibold text-sm text-[var(--fg)]">
                      <LocaleLink to={row.href} className="hover:text-[var(--accent-bright)] transition-colors">
                        {row.product}
                      </LocaleLink>
                    </td>
                    <td className="py-4 px-4 text-xs text-[var(--fg-muted)] font-mono">{row.isolation}</td>
                    <td className="py-4 px-4 text-xs text-[var(--fg-muted)]">{row.storage}</td>
                    <td className="py-4 px-4 text-xs text-[var(--fg-muted)] font-mono">{row.network}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 font-mono text-[11px] ${
                          row.availableNow ? 'text-emerald-400' : 'text-[var(--fg-muted)]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            row.availableNow ? 'bg-emerald-400' : 'bg-[var(--accent-bright)]'
                          }`}
                        />
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 pl-5 text-right">
                      <LocaleLink
                        to={row.href}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent-bright)] hover:text-[var(--fg)] transition-colors"
                      >
                        <span>{t.common.learnMore}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </LocaleLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </RuledTable>

          {/* Key Facts Row */}
          <div className="mt-10 pt-8 border-t border-[var(--line)] grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {t.hosting.facts.map((fact) => (
              <div key={fact.label}>
                <p className="text-xs font-mono text-[var(--accent-bright)] mb-1.5">
                  {fact.label}
                </p>
                <p className="text-base font-semibold text-[var(--fg)] mb-1">
                  {fact.value}
                </p>
                <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                  {fact.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Launch Waitlist */}
      <section id="waitlist" className="py-12 lg:py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-5">
              <h2 className="text-display-m text-[var(--fg)] mb-3">
                {t.hosting.waitlist.title}
              </h2>
              <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-6">
                {t.hosting.waitlist.description}
              </p>
              <LocaleLink to="/company/contact/">
                <Button variant="outline">{t.common.getInTouch}</Button>
              </LocaleLink>
            </div>
            <div className="lg:col-span-7">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Hosting;
