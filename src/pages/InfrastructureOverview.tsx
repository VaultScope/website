import { PageHero, Button } from '../components/Shared';
import { WaitlistForm } from '../components/WaitlistForm';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';
import { SeoHead } from '../components/SeoHead';

export const InfrastructureOverview = () => {
  const { t, locale } = useLanguage();
  const isDe = locale === 'de';

  const pillars = [
    {
      title: t.infrastructureOverview.cloud.title,
      desc: t.infrastructureOverview.cloud.desc,
      cta: t.infrastructureOverview.cloud.cta,
      href: '/infrastructure/cloud/',
      status: isDe ? 'Warteliste offen' : 'Waitlist Open',
      availableNow: false,
    },
    {
      title: t.infrastructureOverview.dedicated.title,
      desc: t.infrastructureOverview.dedicated.desc,
      cta: t.infrastructureOverview.dedicated.cta,
      href: '/infrastructure/dedicated/',
      status: isDe ? 'Warteliste offen' : 'Waitlist Open',
      availableNow: false,
    },
    {
      title: isDe ? 'SFTP- & Backup-Speicher' : 'SFTP & Backup Storage',
      desc: isDe
        ? 'Chroot-isolierter Netzwerkspeicher auf ZFS-Basis für automatisierte Offsite-Backups mit BorgBackup, Restic, rsync und rclone.'
        : 'Chroot-isolated network storage backed by redundant ZFS pools for automated offsite backups via BorgBackup, Restic, rsync, and rclone.',
      cta: isDe ? 'Speicher ansehen' : 'Explore Storage',
      href: '/infrastructure/storage/',
      status: isDe ? 'Warteliste offen' : 'Waitlist Open',
      availableNow: false,
    },
    {
      title: isDe ? 'One-Click Deploy (ODP)' : 'One-Click Deploy (ODP)',
      desc: isDe
        ? 'Vorkonfigurierte Open-Source-Anwendungen auf isolierten Proxmox-Instanzen mit automatischem Reverse-Proxy und TLS.'
        : 'Pre-configured open-source applications deployed on isolated Proxmox instances with automated reverse proxy and TLS.',
      cta: isDe ? 'ODP ansehen' : 'Explore ODP',
      href: '/infrastructure/odp/',
      status: isDe ? 'Warteliste offen' : 'Waitlist Open',
      availableNow: false,
    },
    {
      title: t.infrastructureOverview.managed.title,
      desc: t.infrastructureOverview.managed.desc,
      cta: t.infrastructureOverview.managed.cta,
      href: '/infrastructure/managed/',
      status: isDe ? 'Auf Anfrage verfügbar' : 'Available on Request',
      availableNow: true,
    },
  ];

  return (
    <div className="flex flex-col w-full bg-[var(--bg)] text-[var(--fg)]">
      <SeoHead
        title={t.infrastructureOverview.title}
        description={t.infrastructureOverview.description}
        path="/infrastructure"
      />

      <PageHero
        breadcrumbs={[{ label: t.nav.infrastructure }]}
        title={t.infrastructureOverview.title}
        description={t.infrastructureOverview.description}
        primaryCta={t.common.joinWaitlist}
        primaryLink="#waitlist"
        secondaryCta={t.common.getInTouch}
        secondaryLink="/company/contact/"
        align="left"
      />

      {/* Core Infrastructure Offerings */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-display-m text-[var(--fg)] mb-2">
                {isDe ? 'Infrastruktur-Plattformen' : 'Infrastructure Platforms'}
              </h2>
              <p className="text-sm text-[var(--fg-muted)]">
                {isDe
                  ? 'Übersicht über unsere Compute-, Speicher- und Managed-Hosting-Systeme in Deutschland und Österreich.'
                  : 'Overview of our compute, storage, and managed hosting systems operated in Germany and Austria.'}
              </p>
            </div>
          </div>

          <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
            {pillars.map((pillar) => (
              <div
                key={pillar.href}
                className="py-6 sm:py-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
              >
                <div className="lg:col-span-4">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-h3 text-[var(--fg)]">
                      <LocaleLink
                        to={pillar.href}
                        className="hover:text-[var(--accent-bright)] transition-colors"
                      >
                        {pillar.title}
                      </LocaleLink>
                    </h3>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="lg:col-span-3 flex sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 font-mono text-[11px] ${
                      pillar.availableNow ? 'text-emerald-400' : 'text-[var(--fg-muted)]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        pillar.availableNow ? 'bg-emerald-400' : 'bg-[var(--accent-bright)]'
                      }`}
                    />
                    {pillar.status}
                  </span>

                  <LocaleLink
                    to={pillar.href}
                    className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[var(--accent-bright)] hover:text-[var(--fg)] transition-colors"
                  >
                    <span>{pillar.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </LocaleLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open-Source Stack */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="max-w-2xl">
            <h2 className="text-display-m text-[var(--fg)] mb-3">
              {t.infrastructureOverview.technology.title}
            </h2>
            <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-6">
              {t.infrastructureOverview.technology.description}
            </p>
            <LocaleLink to="/company/open-source/">
              <Button variant="outline">{t.infrastructureOverview.technology.cta}</Button>
            </LocaleLink>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="py-12 lg:py-16">
        <div className="vs-container grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <h2 className="text-display-m text-[var(--fg)] mb-3">
              {t.infrastructureOverview.waitlist.title}
            </h2>
            <p className="text-sm font-sans text-[var(--fg-muted)] leading-relaxed mb-6">
              {t.infrastructureOverview.waitlist.description}
            </p>
            <LocaleLink to="/company/contact/">
              <Button variant="outline">{t.common.getInTouch}</Button>
            </LocaleLink>
          </div>
          <div className="lg:col-span-7">
            <WaitlistForm />
          </div>
        </div>
      </section>
    </div>
  );
};
export default InfrastructureOverview;
