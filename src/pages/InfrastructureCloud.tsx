import { PageHero, Button, RuledTable, CatalogErrorState } from '../components/Shared';
import { WaitlistForm } from '../components/WaitlistForm';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';
import { SeoHead } from '../components/SeoHead';
import { useCatalogProducts } from '../lib/catalog';

const stripHighlight = (str: string) => str.replace(/\*/g, '');

export const InfrastructureCloud = () => {
  const { t, locale } = useLanguage();
  const isDe = locale === 'de';
  const { products, status, error, refetch } = useCatalogProducts('cloud');

  return (
    <div className="flex flex-col w-full bg-[var(--bg)] text-[var(--fg)]">
      <SeoHead
        title={t.infrastructureCloud.title.replace(' — VaultScope', '')}
        description={t.infrastructureCloud.metaDescription}
        path="/infrastructure/cloud"
      />

      <PageHero
        breadcrumbs={[
          { label: t.nav.infrastructure, href: '/infrastructure/' },
          { label: t.infrastructureCloud.breadcrumb },
        ]}
        eyebrow={t.infrastructureCloud.eyebrow}
        title={t.infrastructureCloud.heroTitle}
        description={t.infrastructureCloud.heroDescription}
        primaryCta={t.common.joinWaitlist}
        primaryLink="#waitlist"
        secondaryCta={t.common.getInTouch}
        secondaryLink="/company/contact/"
        align="left"
      />

      {/* Live Cloud VPS Catalog Ledger */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-display-m text-[var(--fg)] mb-1.5">
                {isDe ? 'Verfügbare Cloud-VPS-Instanzen' : 'Available Cloud VPS Instances'}
              </h2>
              <p className="text-sm font-sans text-[var(--fg-muted)]">
                {isDe
                  ? 'Dedizierte KVM-Virtualisierung auf Proxmox VE und NVMe-Storage.'
                  : 'KVM virtualization on Proxmox VE backed by enterprise NVMe storage.'}
              </p>
            </div>
            <span className="font-mono text-xs text-[var(--fg-muted)]">
              {isDe ? 'Standorte: DE / AT · Preise inkl. 19% MwSt.' : 'Regions: DE / AT · Prices incl. 19% VAT'}
            </span>
          </div>

          {status === 'loading' ? (
            <div className="py-6 border-t border-b border-[var(--line)] text-sm font-mono text-[var(--fg-muted)]">
              {isDe
                ? 'Cloud-VPS-Instanzen werden aus dem VAMOS-Katalog geladen...'
                : 'Loading Cloud VPS instances from VAMOS catalog...'}
            </div>
          ) : status === 'error' ? (
            <CatalogErrorState
              resourceName={
                isDe
                  ? 'Live-Cloud-VPS-Instanzkatalog (/api/storefront/catalog)'
                  : 'Live Cloud VPS instance catalog (/api/storefront/catalog)'
              }
              error={error}
              onRetry={refetch}
              isDe={isDe}
            />
          ) : products.length === 0 ? (
            <div className="py-6 border-t border-b border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--accent-bright)] mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-bright)]" />
                  {isDe ? 'In Vorbereitung · Warteliste offen' : 'In Preparation · Waitlist Open'}
                </div>
                <h3 className="text-sm font-sans font-semibold text-[var(--fg)] mb-1">
                  {t.infrastructureCloud.pricing}
                </h3>
                <p className="text-xs font-sans text-[var(--fg-muted)]">
                  {t.infrastructureCloud.waitlist.description}
                </p>
              </div>
              <a href="#waitlist" className="shrink-0">
                <Button variant="outline" className="h-9 px-4 text-xs">
                  {t.common.joinWaitlist}
                </Button>
              </a>
            </div>
          ) : (
            <RuledTable>
              <table className="w-full min-w-[580px] sm:min-w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--line)] text-xs font-mono text-[var(--fg-muted)]">
                    <th className="py-3.5 pr-5 font-medium">{isDe ? 'Instanz' : 'Instance'}</th>
                    <th className="py-3.5 px-4 font-medium">vCPU</th>
                    <th className="py-3.5 px-4 font-medium">RAM</th>
                    <th className="py-3.5 px-4 font-medium">NVMe</th>
                    <th className="py-3.5 px-4 font-medium text-right">
                      {isDe ? 'Monatspreis (inkl. 19% MwSt.)' : 'Monthly Rate (incl. 19% VAT)'}
                    </th>
                    <th className="py-3.5 pl-5 font-medium text-right">{isDe ? 'Aktion' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {products.map((plan) => (
                    <tr
                      key={plan.id}
                      className="hover:bg-[var(--bg-elevated)]/50 transition-colors"
                    >
                      <td className="py-4 pr-5">
                        <span className="text-sm font-sans font-semibold text-[var(--fg)] block">
                          {plan.name}
                        </span>
                        <span className="font-mono text-xs text-[var(--fg-muted)]">
                          {plan.location}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono text-sm text-[var(--fg)]">{plan.cpu}</td>
                      <td className="py-4 px-4 font-mono text-sm text-[var(--fg)]">{plan.ram}</td>
                      <td className="py-4 px-4 font-mono text-sm text-[var(--fg)]">{plan.storage}</td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="font-mono text-base font-semibold text-[var(--fg)]">
                          {plan.priceGrossFormatted}
                        </div>
                        <div className="font-mono text-[11px] text-[var(--fg-muted)]">
                          {plan.priceNetFormatted} {isDe ? 'netto' : 'net'} / mo
                        </div>
                      </td>
                      <td className="py-4 pl-5 text-right whitespace-nowrap">
                        {plan.outOfStock ? (
                          <span className="font-mono text-xs text-[var(--fg-faint)]">
                            {isDe ? 'Ausverkauft' : 'Out of Stock'}
                          </span>
                        ) : (
                          <LocaleLink to={`/dashboard/new?product=${encodeURIComponent(plan.id)}`}>
                            <Button variant="primary" className="h-9 px-4 text-xs">
                              {isDe ? 'Bereitstellen' : 'Deploy Now'}
                            </Button>
                          </LocaleLink>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </RuledTable>
          )}
        </div>
      </section>

      {/* Architecture & Use Cases — Open Two-Column Layout */}
      <section className="py-12 lg:py-16">
        <div className="vs-container grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <h2 className="text-display-m text-[var(--fg)] mb-2">
              {stripHighlight(t.infrastructureCloud.architecture.title)}
            </h2>
            <p className="text-sm font-sans text-[var(--fg-muted)] leading-relaxed mb-6">
              {t.infrastructureCloud.architecture.description}
            </p>
            <div className="divide-y divide-[var(--line)]">
              {t.infrastructureCloud.architecture.items.map((item) => (
                <div key={item.title} className="py-5 grid sm:grid-cols-12 gap-4 items-baseline">
                  <h3 className="sm:col-span-4 text-sm font-sans font-semibold text-[var(--fg)]">
                    {item.title}
                  </h3>
                  <p className="sm:col-span-8 text-sm font-sans text-[var(--fg-muted)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <h2 className="text-display-m text-[var(--fg)] mb-2">
              {stripHighlight(t.infrastructureCloud.useCases.title)}
            </h2>
            <p className="text-sm font-sans text-[var(--fg-muted)] leading-relaxed mb-6">
              {isDe
                ? 'Isolierte virtuelle Maschinen für produktive Dienste, Datenbanken und Entwicklung.'
                : 'Isolated virtual machines built for production services, databases, and staging.'}
            </p>
            <div className="divide-y divide-[var(--line)]">
              {t.infrastructureCloud.useCases.items.map((uc) => (
                <div key={uc.title} className="py-5">
                  <h3 className="text-sm font-sans font-semibold text-[var(--fg)] mb-1">
                    {uc.title}
                  </h3>
                  <p className="text-xs font-sans text-[var(--fg-muted)] leading-relaxed">
                    {uc.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="py-12 lg:py-16">
        <div className="vs-container grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <h2 className="text-display-m text-[var(--fg)] mb-3">
              {stripHighlight(t.infrastructureCloud.waitlist.title)}
            </h2>
            <p className="text-sm font-sans text-[var(--fg-muted)] leading-relaxed mb-4">
              {t.infrastructureCloud.waitlist.description}
            </p>
            <p className="text-xs font-sans text-[var(--fg-muted)]">
              {t.common.questions}{' '}
              <LocaleLink
                to="/company/contact/"
                className="text-[var(--accent-bright)] hover:underline underline-offset-2"
              >
                {t.common.getInTouch}
              </LocaleLink>
              .
            </p>
          </div>
          <div className="lg:col-span-7">
            <WaitlistForm />
          </div>
        </div>
      </section>
    </div>
  );
};
export default InfrastructureCloud;
