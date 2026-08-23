import { useEffect } from 'react';
import { PageHero, Breadcrumbs } from '../components/Shared';
import { WaitlistForm } from '../components/WaitlistForm';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';

export const InfrastructureDedicated = () => {
  const { t } = useLanguage();
  useEffect(() => {
    document.title = t.infrastructureDedicated.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', t.infrastructureDedicated.metaDescription);
    }
  }, [t]);

  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-6 lg:px-12 pt-32">
        <Breadcrumbs items={[{ label: t.nav.infrastructure, href: '/infrastructure/' }, { label: t.infrastructureDedicated.breadcrumb }]} />
      </div>

      <PageHero
        eyebrow={t.infrastructureDedicated.eyebrow}
        title={t.infrastructureDedicated.heroTitle}
        description={t.infrastructureDedicated.heroDescription}
        primaryCta={t.common.joinWaitlist}
        primaryLink="#waitlist"
        align="left"
      />

      {/* Key differentiators */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">{t.infrastructureDedicated.differentiators.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
              {t.infrastructureDedicated.differentiators.title}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-0 border border-border">
            {t.infrastructureDedicated.differentiators.items.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`p-8 ${i % 2 === 0 ? 'border-r border-border' : ''} ${i < 2 ? 'border-b border-border' : ''}`}
              >
                <h3 className="text-base font-medium text-foreground uppercase tracking-tight mb-3">{item.title}</h3>
                <p className="text-sm text-foreground/40 font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">{t.infrastructureDedicated.useCases.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
              {t.infrastructureDedicated.useCases.title}
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-border">
            {t.infrastructureDedicated.useCases.items.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`p-8 ${i < 3 ? 'border-b lg:border-b-0 lg:border-r border-border' : ''}`}
              >
                <h3 className="text-base font-medium text-foreground uppercase tracking-tight mb-3">{item.title}</h3>
                <p className="text-sm text-foreground/40 font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical */}
      <section className="py-24 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-0 border border-border">
            {t.infrastructureDedicated.technical.map((item, i) => (
              <div key={item.label} className={`p-8 ${i < 2 ? 'border-b md:border-b-0 md:border-r border-border' : ''}`}>
                <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-3">{item.label}</p>
                <p className="text-base font-medium text-foreground mb-2">{item.value}</p>
                <p className="text-sm text-foreground/40 font-light">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing state */}
      <section className="py-24 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="border border-border p-10">
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-4">{t.nav.pricing}</p>
            <p className="text-lg text-foreground/60 font-light">
              {t.infrastructureDedicated.pricing}
            </p>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground mb-4">
              {t.infrastructureDedicated.waitlist.title}
            </h2>
            <p className="text-foreground/50 font-light mb-10 text-lg leading-relaxed">
              {t.infrastructureDedicated.waitlist.description}
            </p>
            <WaitlistForm />
            <div className="mt-8 pt-8 border-t border-border/[0.05]">
              <p className="text-sm text-foreground/30 font-light">
                {t.common.questions}{' '}
                <LocaleLink to="/company/contact/" className="text-foreground/50 hover:text-foreground transition-colors underline underline-offset-2">
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
