import { PageHero, SectionHeader, CTABlock, CatalogErrorState } from '../components/Shared';
import { WaitlistForm } from '../components/WaitlistForm';
import { HardDrive, Lock, Terminal, Shield, Check, ArrowRight } from 'lucide-react';
import { LocaleLink, useTranslation } from '../i18n/context';
import { useCatalogProducts } from '../lib/catalog';
import { useDocumentMeta } from '../lib/useDocumentMeta';

export function InfrastructureStorage() {
  const { locale } = useTranslation();
  const isDe = locale === 'de';
  const { products: storagePlans, loading, error, reload } = useCatalogProducts('storage');

  useDocumentMeta({
    title: isDe
      ? 'SFTP-Speicher — Verschlüsselter Offsite-Backup-Speicher | VaultScope'
      : 'SFTP Storage — Encrypted Offsite Backup Storage | VaultScope',
    description: isDe
      ? 'Chroot-isolierter, ZFS-gestützter SFTP-, SCP-, rsync-, BorgBackup- und Restic-Speicher in Europa.'
      : 'Chroot-isolated, ZFS-backed SFTP, SCP, rsync, BorgBackup, and Restic storage in Europe.',
  });

  const features = isDe
    ? [
        {
          icon: <Terminal className="w-4 h-4 text-[var(--accent-bright)]" />,
          title: 'Volle Tool-Kompatibilität',
          desc: 'Funktioniert direkt mit rsync, BorgBackup, Restic, Duplicacy, rclone, FileZilla, WinSCP und jedem OpenSSH-kompatiblen Client.',
        },
        {
          icon: <Lock className="w-4 h-4 text-[var(--accent-bright)]" />,
          title: 'Isolierte Chroot-Umgebung',
          desc: 'Jedes Konto wird auf Systemebene strikt in einem eigenen Verzeichnisbaum isoliert. Keine geteilten Dateisystempfade zwischen Mandanten.',
        },
        {
          icon: <HardDrive className="w-4 h-4 text-[var(--accent-bright)]" />,
          title: 'Redundante ZFS-Speicherpools',
          desc: 'Daten werden auf Enterprise-Festplatten im ZFS-Verbund mit kontinuierlicher Prüfsummenvalidierung gegen Bit-Rot gespeichert.',
        },
        {
          icon: <Shield className="w-4 h-4 text-[var(--accent-bright)]" />,
          title: 'SSH-Key-Authentifizierung',
          desc: 'Hinterlegen Sie Ed25519- oder RSA-Schlüssel für passwortlose, automatisierte Cron-Backups und verschlüsselte Offsite-Archive.',
        },
      ]
    : [
        {
          icon: <Terminal className="w-4 h-4 text-[var(--accent-bright)]" />,
          title: 'Broad Tool Compatibility',
          desc: 'Works out of the box with rsync, BorgBackup, Restic, Duplicacy, rclone, FileZilla, WinSCP, and any OpenSSH-compatible client.',
        },
        {
          icon: <Lock className="w-4 h-4 text-[var(--accent-bright)]" />,
          title: 'Isolated Chroot Environment',
          desc: 'Each storage account is strictly isolated to its own directory tree at the OS level. Zero shared filesystem paths across tenants.',
        },
        {
          icon: <HardDrive className="w-4 h-4 text-[var(--accent-bright)]" />,
          title: 'Redundant ZFS Storage Pools',
          desc: 'Backed by enterprise drives in redundant ZFS pools with continuous end-to-end checksum verification against silent bit-rot.',
        },
        {
          icon: <Shield className="w-4 h-4 text-[var(--accent-bright)]" />,
          title: 'SSH Key Authentication',
          desc: 'Deploy Ed25519 or RSA public keys for passwordless, automated cron backups and client-side encrypted offsite archives.',
        },
      ];

  const useCases = isDe
    ? [
        {
          title: 'Automatisierte Server-Backups',
          desc: 'Sichern Sie Proxmox-VMs, Datenbank-Dumps und Konfigurationsverzeichnisse automatisiert per Cron-Job und BorgBackup oder Restic.',
        },
        {
          title: 'Verschlüsselte Offsite-Archive',
          desc: 'Nutzen Sie clientseitige Verschlüsselung vor dem Transfer, um geschäftskritische Daten DSGVO-konform außerhalb Ihrer Primärinfrastruktur vorzuhalten.',
        },
        {
          title: 'Medien- & Artefakt-Repository',
          desc: 'Zentraler Speicherort für Build-Artefakte, Container-Tarballs, große Datensätze und statische Assets mit direktem SFTP/rsync-Zugriff.',
        },
      ]
    : [
        {
          title: 'Automated Server Backups',
          desc: 'Stream Proxmox VM snapshots, database dumps, and configuration directories on scheduled cron jobs via BorgBackup or Restic.',
        },
        {
          title: 'Encrypted Offsite Archives',
          desc: 'Combine client-side encryption with isolated European storage to maintain GDPR-compliant offsite disaster recovery copies.',
        },
        {
          title: 'Artifact & Media Repository',
          desc: 'Centralized vault for build artifacts, release archives, large datasets, and static assets accessible via standard SFTP and rsync.',
        },
      ];

  return (
    <div className="bg-[var(--bg)] text-[var(--fg)]">
      <PageHero
        title={
          isDe
            ? 'Verschlüsselter *SFTP-* & Backup-Speicher.'
            : 'Encrypted *SFTP* & Backup Storage.'
        }
        subtitle={
          isDe
            ? 'Dedizierter, chroot-isolierter Netzwerkspeicher auf ZFS-Basis. Entwickelt für automatisierte Offsite-Backups mit BorgBackup, Restic, rsync und rclone.'
            : 'Dedicated, chroot-isolated network storage backed by redundant ZFS pools. Built for automated offsite backups with BorgBackup, Restic, rsync, and rclone.'
        }
        primaryCta={{
          label: isDe ? 'Speicher-Tarife ansehen' : 'View Storage Tiers',
          href: '#plans',
        }}
        secondaryCta={{
          label: isDe ? 'Anfrage stellen' : 'Contact Engineering',
          href: '/company/contact/',
        }}
      />

      {/* Plans Section */}
      <section id="plans" className="py-12 lg:py-16">
        <div className="vs-container">
          <SectionHeader
            title={isDe ? 'SFTP-Speicherpakete' : 'SFTP Storage Plans'}
            subtitle={
              isDe
                ? 'Transparente monatliche Preise inklusive Traffic für Ihre Backups.'
                : 'Transparent monthly pricing with generous transfer allowances for automated backups.'
            }
          />

          {loading ? (
            <div className="py-6 border-t border-b border-[var(--line)]">
              <p className="text-sm text-[var(--fg-muted)] font-mono">
                {isDe ? 'Speicher-Katalog wird geladen...' : 'Loading storage catalog...'}
              </p>
            </div>
          ) : error ? (
            <CatalogErrorState
              locale={locale}
              productLabel={isDe ? 'SFTP-Speicherpakete' : 'SFTP Storage Plans'}
              error={error}
              onRetry={reload}
              fallbackHref="/company/contact/"
              fallbackLabel={isDe ? 'Anfrage stellen' : 'Contact Engineering'}
            />
          ) : storagePlans.length > 0 ? (
            <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
              {storagePlans.map((plan) => (
                <div
                  key={plan.id}
                  className="py-6 grid lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-4">
                    <h3 className="text-lg font-semibold text-[var(--fg)] tracking-[-0.02em]">
                      {plan.name}
                    </h3>
                    <p className="font-mono text-xs text-[var(--accent-bright)] mt-1">
                      {plan.storage && plan.storage !== '—' ? plan.storage : 'ZFS SFTP Vault'}
                    </p>
                    {plan.description && (
                      <p className="text-sm text-[var(--fg-muted)] leading-relaxed mt-2">
                        {plan.description}
                      </p>
                    )}
                  </div>

                  <div className="lg:col-span-5">
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {[
                        plan.storage && plan.storage !== '—' && `${isDe ? 'Kapazität' : 'Capacity'}: ${plan.storage}`,
                        plan.bandwidth && plan.bandwidth !== '—' && `${isDe ? 'Transfer' : 'Bandwidth'}: ${plan.bandwidth}`,
                        isDe ? 'SFTP / SCP / rsync über SSH' : 'SFTP / SCP / rsync over SSH',
                        isDe ? 'Chroot-Verzeichnisisolation' : 'Chroot directory isolation',
                        ...plan.features,
                      ]
                        .filter((item): item is string => Boolean(item))
                        .slice(0, 6)
                        .map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-[var(--fg-muted)]">
                            <Check className="w-3.5 h-3.5 text-[var(--accent-bright)] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="lg:col-span-3 flex sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4">
                    <div className="lg:text-right">
                      <div className="font-mono text-2xl font-semibold text-[var(--fg)] tabular-nums">
                        €{plan.grossMonthly.toFixed(2)}
                      </div>
                      <div className="font-mono text-[11px] text-[var(--fg-muted)] tabular-nums">
                        €{plan.netMonthly.toFixed(2)} {isDe ? 'netto / Mo.' : 'net / mo'}
                      </div>
                    </div>

                    <LocaleLink
                      to={`/dashboard/new?product=${encodeURIComponent(plan.id)}`}
                      className="btn-primary text-xs h-9 px-4"
                    >
                      {isDe ? 'Speicher bereitstellen' : 'Deploy Storage'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </LocaleLink>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-10 items-start pt-2">
              <div className="lg:col-span-5">
                <h3 className="text-lg font-semibold text-[var(--fg)] tracking-[-0.02em] mb-2">
                  {isDe
                    ? 'SFTP-Speicher-Cluster wird für den öffentlichen Verkauf vorbereitet'
                    : 'SFTP Storage Cluster Preparing for Public Allocation'}
                </h3>
                <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
                  {isDe
                    ? 'Tragen Sie sich in die Warteliste ein, um sofort benachrichtigt zu werden, sobald neue ZFS-SFTP-Speicher-Kontingente freigeschaltet werden.'
                    : 'Join the waitlist to be notified immediately when new ZFS SFTP storage allocations open.'}
                </p>
              </div>
              <div className="lg:col-span-7">
                <WaitlistForm productSlug="sftp-storage" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Architecture & Protocol Compatibility */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <SectionHeader
            title={
              isDe
                ? 'Entwickelt für zuverlässige Offsite-Datensicherung'
                : 'Engineered for Dependable Offsite Data Protection'
            }
            subtitle={
              isDe
                ? 'Keine proprietären Agenten erforderlich. Nutzen Sie bewährte Open-Source-Backup-Werkzeuge über Standard-SSH-Protokolle.'
                : 'No proprietary agents required. Use proven open-source backup tools over standard SSH protocols.'
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
            {features.map((f) => (
              <div key={f.title} className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="shrink-0">{f.icon}</span>
                  <h3 className="text-base font-semibold text-[var(--fg)]">{f.title}</h3>
                </div>
                <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <SectionHeader
            title={isDe ? 'Typische Einsatzszenarien' : 'Common Deployment Scenarios'}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {useCases.map((u) => (
              <div key={u.title}>
                <h3 className="text-base font-semibold text-[var(--fg)] mb-2">{u.title}</h3>
                <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABlock
        title={isDe ? 'Benötigen Sie größere Speicherkapazitäten?' : 'Need Larger Storage Allocations?'}
        subtitle={
          isDe
            ? 'Für dedizierte ZFS-Storage-Server oder individuelle Multi-Terabyte-Archive beraten wir Sie gerne direkt.'
            : 'For dedicated ZFS storage servers or custom multi-terabyte archive allocations, talk directly with our engineering team.'
        }
        primaryLabel={isDe ? 'Kontakt aufnehmen' : 'Contact Engineering'}
        primaryHref="/company/contact/"
        secondaryLabel={isDe ? 'Alle Infrastruktur-Produkte' : 'All Infrastructure Products'}
        secondaryHref="/infrastructure/"
      />
    </div>
  );
}
export default InfrastructureStorage;
