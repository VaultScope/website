import { PageHero, Button, RuledTable, CatalogErrorState } from '../components/Shared';
import { WaitlistForm } from '../components/WaitlistForm';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';
import { SeoHead } from '../components/SeoHead';
import { useCatalogProducts } from '../lib/catalog';

const stripHighlight = (str: string) => str.replace(/\*/g, '');

export const InfrastructureDedicated = () => {
  const { t, locale } = useLanguage();
  const { products, status, error, refetch } = useCatalogProducts('dedicated');

  return (
    <div className="flex flex-col w-full bg-[var(--bg)] text-[var(--fg)]">
      <SeoHead
        title={t.infrastructureDedicated.title.replace(' — VaultScope', '')}
        description={t.infrastructureDedicated.metaDescription}
        path="/infrastructure/dedicated"
      />

      <PageHero
        breadcrumbs={[
          { label: t.nav.infrastructure, href: '/infrastructure/' },
          { label: t.infrastructureDedicated.breadcrumb },
        ]}
        eyebrow={t.infrastructureDedicated.eyebrow}
        title={t.infrastructureDedicated.heroTitle}
        description={t.infrastructureDedicated.heroDescription}
        primaryCta={t.common.joinWaitlist}
        primaryLink="#waitlist"
        align="left"
      />

      {/* Pricing Tiers — Open BareMetal Ledger */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-display-m text-[var(--fg)]">
                  {locale === 'de' ? 'Dedizierte Bare-Metal-Server' : 'Dedicated Bare-Metal Servers'}
                </h2>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[var(--fg-muted)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-bright)]" />
                  {locale === 'de' ? 'Live-Bestand & Warteliste' : 'Live Inventory & Waitlist'}
                </span>
              </div>
              <p className="text-sm font-sans text-[var(--fg-muted)]">
                {locale === 'de'
                  ? 'Physische Single-Tenant-Hardware ohne geteilte Ressourcen.'
                  : 'Single-tenant physical hardware with unshared compute and storage.'}
              </p>
            </div>
          </div>

          {status === 'loading' ? (
            <div className="py-6 border-t border-b border-[var(--line)] text-sm font-mono text-[var(--fg-muted)]">
              {locale === 'de'
                ? 'Dedizierte Server werden aus dem VAMOS-Katalog geladen...'
                : 'Loading dedicated servers from VAMOS catalog...'}
            </div>
          ) : status === 'error' ? (
            <CatalogErrorState
              locale={locale}
              productLabel={locale === 'de' ? 'Dedizierte Bare-Metal-Server' : 'Dedicated Bare-Metal Servers'}
              error={error}
              onRetry={refetch}
              fallbackHref="#waitlist"
              fallbackLabel={t.common.joinWaitlist}
            />
          ) : products.length === 0 ? (
            <div className="py-6 border-t border-b border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-sans font-semibold text-[var(--fg)] mb-1">
                  {locale === 'de'
                    ? 'Dedizierte Server befinden sich in Vorbereitung'
                    : 'Dedicated Server configurations are currently in preparation'}
                </h3>
                <p className="text-xs font-sans text-[var(--fg-muted)]">
                  {locale === 'de'
                    ? 'Tragen Sie sich in die Warteliste ein, um beim Start benachrichtigt zu werden.'
                    : 'Join the waitlist below to be notified when bare-metal chassis tiers become available.'}
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
              <table className="w-full min-w-[580px] sm:min-w-full text-left border-collapse border-t border-b border-[var(--line)]">
                <thead>
                  <tr className="border-b border-[var(--line)] text-xs font-mono text-[var(--fg-muted)]">
                    <th className="py-3.5 pr-5 font-medium">{locale === 'de' ? 'Serverprofil' : 'Chassis Profile'}</th>
                    <th className="py-3.5 px-4 font-medium">{locale === 'de' ? 'Hardware-Spezifikationen' : 'Hardware Specifications'}</th>
                    <th className="py-3.5 px-4 font-medium text-right">{locale === 'de' ? 'Monatspreis (inkl. 19% MwSt.)' : 'Monthly Rate (incl. 19% VAT)'}</th>
                    <th className="py-3.5 pl-5 font-medium text-right">{locale === 'de' ? 'Aktion' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {products.map((plan) => (
                    <tr
                      key={plan.id}
                      className="hover:bg-[var(--bg-elevated)]/50 transition-colors"
                    >
                      <td className="py-5 pr-5 align-top">
                        <h3 className="text-base font-sans font-semibold text-[var(--fg)] mb-1">
                          {plan.name}
                        </h3>
                        {plan.target && (
                          <p className="text-xs font-mono text-[var(--fg-muted)]">
                            {plan.target}
                          </p>
                        )}
                      </td>
                      <td className="py-5 px-4 align-middle">
                        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                          {Object.entries(plan.specs)
                            .filter(
                              ([key, value]) =>
                                key !== 'raw' &&
                                typeof value === 'string' &&
                                value !== '—' &&
                                value.trim() !== ''
                            )
                            .map(([key, value]) => (
                              <div
                                key={key}
                                className="flex items-center justify-between gap-3 text-xs border-b border-[var(--line)] pb-1"
                              >
                                <span className="font-sans text-[var(--fg-muted)] capitalize">
                                  {key.replace(/_/g, ' ')}
                                </span>
                                <span className="font-mono text-[var(--fg)]">
                                  {String(value)}
                                </span>
                              </div>
                            ))}
                        </div>
                      </td>
                      <td className="py-5 px-4 align-middle text-right whitespace-nowrap">
                        <div className="font-mono text-lg font-medium text-[var(--fg)]">
                          {plan.priceGrossFormatted}
                        </div>
                        <div className="font-mono text-[11px] text-[var(--fg-muted)]">
                          {plan.priceNetFormatted} {locale === 'de' ? 'netto' : 'net'} / mo
                        </div>
                      </td>
                      <td className="py-5 pl-5 align-middle text-right whitespace-nowrap">
                        {plan.outOfStock ? (
                          <span className="font-mono text-xs text-[var(--fg-faint)]">
                            {locale === 'de' ? 'Ausverkauft' : 'Out of Stock'}
                          </span>
                        ) : (
                          <LocaleLink to={`/dashboard/new?product=${encodeURIComponent(plan.id)}`}>
                            <Button variant="primary" className="h-9 px-4 text-xs">
                              {locale === 'de' ? 'Bereitstellen' : 'Deploy Now'}
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

      {/* Key Differentiators & Use Cases — Open Architectural Layout */}
      <section className="py-12 lg:py-16">
        <div className="vs-container space-y-14">
          <div>
            <div className="mb-6">
              <h2 className="text-display-m text-[var(--fg)]">
                {stripHighlight(t.infrastructureDedicated.differentiators.title)}
              </h2>
            </div>

            <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
              {t.infrastructureDedicated.differentiators.items.map((item) => (
                <div
                  key={item.title}
                  className="py-6 grid md:grid-cols-12 gap-4 items-baseline"
                >
                  <div className="md:col-span-4">
                    <h3 className="text-base font-sans font-semibold text-[var(--fg)]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="md:col-span-8 text-sm font-sans text-[var(--fg-muted)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-8">
              <h2 className="text-display-m text-[var(--fg)]">
                {stripHighlight(t.infrastructureDedicated.useCases.title)}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {t.infrastructureDedicated.useCases.items.map((item) => (
                <div key={item.title}>
                  <h3 className="text-base font-sans font-semibold text-[var(--fg)] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm font-sans text-[var(--fg-muted)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="py-12 lg:py-16">
        <div className="vs-container grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <h2 className="text-display-m text-[var(--fg)] mb-3">
              {stripHighlight(t.infrastructureDedicated.waitlist.title)}
            </h2>
            <p className="text-sm font-sans text-[var(--fg-muted)] leading-relaxed">
              {t.infrastructureDedicated.waitlist.description}
            </p>
          </div>
          <div className="lg:col-span-7">
            <WaitlistForm />
            <div className="mt-5 pt-4">
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
          </div>
        </div>
      </section>
    </div>
  );
};
