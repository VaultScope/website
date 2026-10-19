import { PageHero, Button } from '../components/Shared';
import { Settings2, Server, Activity, Wrench, ArrowRight, Shield } from 'lucide-react';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';
import { SeoHead } from '../components/SeoHead';

const stripHighlight = (str: string) => str.replace(/\*/g, '');

export const InfrastructureManaged = () => {
  const { t } = useLanguage();

  const capabilities = [
    { icon: Settings2, ...t.infrastructureManaged.capabilities.items[0] },
    { icon: Server, ...t.infrastructureManaged.capabilities.items[1] },
    { icon: Activity, ...t.infrastructureManaged.capabilities.items[2] },
    { icon: Wrench, ...t.infrastructureManaged.capabilities.items[3] },
    { icon: ArrowRight, ...t.infrastructureManaged.capabilities.items[4] },
    { icon: Shield, ...t.infrastructureManaged.capabilities.items[5] },
  ];

  return (
    <div className="flex flex-col w-full bg-[var(--bg)] text-[var(--fg)]">
      <SeoHead
        title={t.infrastructureManaged.title.replace(' — VaultScope', '')}
        description={t.infrastructureManaged.metaDescription}
        path="/infrastructure/managed"
      />

      <PageHero
        breadcrumbs={[
          { label: t.nav.infrastructure, href: '/infrastructure/' },
          { label: t.infrastructureManaged.breadcrumb },
        ]}
        eyebrow={t.infrastructureManaged.eyebrow}
        title={t.infrastructureManaged.heroTitle}
        description={t.infrastructureManaged.heroDescription}
        primaryCta={t.common.getInTouch}
        primaryLink="/company/contact/"
        align="left"
      />

      {/* Capabilities — Open 3-Column Architectural Grid */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-display-m text-[var(--fg)]">
                  {stripHighlight(t.infrastructureManaged.capabilities.title)}
                </h2>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[var(--accent-bright)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-bright)]" />
                  Available on Request
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {capabilities.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
                    <h3 className="text-base font-sans font-semibold text-[var(--fg)]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm font-sans text-[var(--fg-muted)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process & Who It's For — Open Multi-Column Layout */}
      <section className="py-12 lg:py-16">
        <div className="vs-container space-y-14">
          <div>
            <div className="mb-8">
              <h2 className="text-display-m text-[var(--fg)]">
                {stripHighlight(t.infrastructureManaged.process.title)}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10">
              {t.infrastructureManaged.process.steps.map((item, i) => (
                <div key={item.step}>
                  <div className="font-mono text-xs text-[var(--accent-bright)] mb-2">
                    0{i + 1}
                  </div>
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

          <div className="pt-10 border-t border-[var(--line)] grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <h3 className="text-display-m text-[var(--fg)]">
                {stripHighlight(t.infrastructureManaged.whoItsFor.title)}
              </h3>
            </div>
            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">
              {t.infrastructureManaged.whoItsFor.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-bright)] shrink-0 mt-2" />
                  <span className="text-sm font-sans text-[var(--fg)] leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Custom Pricing Band */}
      <section className="py-12 lg:py-16">
        <div className="vs-container flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-display-m text-[var(--fg)] mb-2">
              {t.infrastructureManaged.pricing.title}
            </h2>
            <p className="text-sm font-sans text-[var(--fg-muted)] leading-relaxed">
              {t.infrastructureManaged.pricing.description}
            </p>
          </div>
          <div className="shrink-0">
            <LocaleLink to="/company/contact/">
              <Button variant="primary">{t.infrastructureManaged.pricing.cta}</Button>
            </LocaleLink>
          </div>
        </div>
      </section>
    </div>
  );
};
export default InfrastructureManaged;
