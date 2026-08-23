import { useEffect } from 'react';
import { PageHero, Button, Breadcrumbs } from '../components/Shared';
import { motion } from 'framer-motion';
import { Settings2, Server, Activity, Wrench, ArrowRight, Shield } from 'lucide-react';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';

export const InfrastructureManaged = () => {
  const { t } = useLanguage();
  useEffect(() => {
    document.title = t.infrastructureManaged.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', t.infrastructureManaged.metaDescription);
    }
  }, [t]);

  const capabilities = [
    { icon: Settings2, ...t.infrastructureManaged.capabilities.items[0] },
    { icon: Server, ...t.infrastructureManaged.capabilities.items[1] },
    { icon: Activity, ...t.infrastructureManaged.capabilities.items[2] },
    { icon: Wrench, ...t.infrastructureManaged.capabilities.items[3] },
    { icon: ArrowRight, ...t.infrastructureManaged.capabilities.items[4] },
    { icon: Shield, ...t.infrastructureManaged.capabilities.items[5] },
  ];

  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-6 lg:px-12 pt-32">
        <Breadcrumbs items={[{ label: t.nav.infrastructure, href: '/infrastructure/' }, { label: t.infrastructureManaged.breadcrumb }]} />
      </div>

      <PageHero
        eyebrow={t.infrastructureManaged.eyebrow}
        title={t.infrastructureManaged.heroTitle}
        description={t.infrastructureManaged.heroDescription}
        primaryCta={t.common.getInTouch}
        primaryLink="/company/contact/"
        align="left"
      />

      {/* What's included */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">{t.infrastructureManaged.capabilities.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
              {t.infrastructureManaged.capabilities.title}
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-border">
            {capabilities.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className={`p-8 border-b lg:border-b-0 ${i % 3 !== 2 ? 'lg:border-r' : ''} ${i < 3 ? 'lg:border-b' : ''} border-border`}
                >
                  <div className="w-10 h-10 border border-border flex items-center justify-center mb-6">
                    <Icon className="w-4 h-4 text-foreground/50" />
                  </div>
                  <h3 className="text-base font-medium text-foreground uppercase tracking-tight mb-3">{item.title}</h3>
                  <p className="text-sm text-foreground/40 font-light leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 relative bg-foreground text-background overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <p className="text-xs font-medium text-background/30 uppercase tracking-widest mb-6">{t.infrastructureManaged.process.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-background">
              {t.infrastructureManaged.process.title}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-0 border border-background/20">
            {t.infrastructureManaged.process.steps.map((item, i) => (
              <div key={item.step} className={`p-6 ${i < 3 ? 'border-b md:border-b-0 md:border-r border-background/20' : ''}`}>
                <span className="text-xs font-mono text-background/30 mb-3 block">{item.step}</span>
                <h3 className="text-sm font-medium text-background uppercase tracking-tight mb-2">{item.title}</h3>
                <p className="text-xs text-background/40 font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">{t.infrastructureManaged.whoItsFor.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
              {t.infrastructureManaged.whoItsFor.title}
            </h2>
          </motion.div>

          <div className="border border-border p-10">
            <ul className="space-y-4">
              {t.infrastructureManaged.whoItsFor.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-foreground/60 font-light">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="border border-border p-10">
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-4">{t.infrastructureManaged.pricing.title}</p>
            <p className="text-lg text-foreground/60 font-light mb-6">
              {t.infrastructureManaged.pricing.description}
            </p>
            <LocaleLink to="/company/contact/">
              <Button>{t.infrastructureManaged.pricing.cta}</Button>
            </LocaleLink>
          </div>
        </div>
      </section>
    </div>
  );
};
