import { useEffect } from 'react';
import { PageHero, Breadcrumbs } from '../components/Shared';
import { WaitlistForm } from '../components/WaitlistForm';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';

export const InfrastructureCloud = () => {
  const { t } = useLanguage();
  useEffect(() => {
    document.title = t.infrastructureCloud.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', t.infrastructureCloud.metaDescription);
    }
  }, [t]);

  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-6 lg:px-12 pt-32">
        <Breadcrumbs items={[{ label: t.nav.infrastructure, href: '/infrastructure/' }, { label: t.infrastructureCloud.breadcrumb }]} />
      </div>

      <PageHero
        eyebrow={t.infrastructureCloud.eyebrow}
        title={t.infrastructureCloud.heroTitle}
        description={t.infrastructureCloud.heroDescription}
        primaryCta={t.common.joinWaitlist}
        primaryLink="#waitlist"
        align="left"
      />

      {/* Use cases */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">{t.infrastructureCloud.useCases.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
              {t.infrastructureCloud.useCases.title}
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-border">
            {t.infrastructureCloud.useCases.items.map((item, i) => (
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

      {/* Technical architecture */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">{t.infrastructureCloud.architecture.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground mb-4">
              {t.infrastructureCloud.architecture.title}
            </h2>
            <p className="text-foreground/50 font-light text-lg max-w-3xl">
              {t.infrastructureCloud.architecture.description}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-0 border border-border">
            {t.infrastructureCloud.architecture.items.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`p-8 ${i % 2 === 0 ? 'border-r border-border' : ''} ${i < 4 ? 'border-b border-border' : ''}`}
              >
                <h3 className="text-base font-medium text-foreground uppercase tracking-tight mb-3">{item.title}</h3>
                <p className="text-sm text-foreground/40 font-light leading-relaxed">{item.desc}</p>
              </motion.div>
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
              {t.infrastructureCloud.pricing}
            </p>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground mb-4">
              {t.infrastructureCloud.waitlist.title}
            </h2>
            <p className="text-foreground/50 font-light mb-10 text-lg leading-relaxed">
              {t.infrastructureCloud.waitlist.description}
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
