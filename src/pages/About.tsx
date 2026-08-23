import { useEffect } from 'react';
import { PageHero, Button, Breadcrumbs } from '../components/Shared';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';

export const About = () => {
  const { t } = useLanguage();
  useEffect(() => {
    document.title = t.about.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', t.aboutPage.metaDescription);
    }
  }, [t]);

  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-6 lg:px-12 pt-32">
        <Breadcrumbs items={[{ label: t.aboutPage.breadcrumbs.company }, { label: t.aboutPage.breadcrumbs.about }]} />
      </div>

      <PageHero
        title={t.aboutPage.heroTitle}
        description={t.aboutPage.heroDescription}
        align="left"
      />

      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="space-y-16">
            <div>
              <h2 className="text-3xl font-medium mb-6 tracking-tighter text-foreground">{t.aboutPage.whatIsTitle}</h2>
              <p className="text-lg text-foreground/70 font-light leading-relaxed">
                {t.aboutPage.whatIsDescription}
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-medium mb-6 tracking-tighter text-foreground">{t.aboutPage.whatWeBuildTitle}</h2>
              <div className="space-y-4 text-lg text-foreground/70 font-light leading-relaxed">
                <p>
                  <strong className="text-foreground font-medium">{t.about.whatWeBuild.infrastructure.title}</strong> — {t.aboutPage.whatWeBuildInfrastructure}
                </p>
                <p>
                  <strong className="text-foreground font-medium">{t.about.whatWeBuild.deploy.title}</strong> — {t.aboutPage.whatWeBuildDeploy}
                </p>
                <p>
                  <strong className="text-foreground font-medium">{t.about.whatWeBuild.software.title}</strong> — {t.aboutPage.whatWeBuildSoftware}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-medium mb-6 tracking-tighter text-foreground">{t.aboutPage.whyWeExistTitle}</h2>
              <p className="text-lg text-foreground/70 font-light leading-relaxed">
                {t.aboutPage.whyWeExistDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">{t.aboutPage.principlesEyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
              {t.aboutPage.principlesTitle}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {t.aboutPage.principles.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="border-l-2 border-foreground/20 pl-8"
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-foreground/30 mb-3">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="text-3xl font-medium text-foreground mb-4">{item.title}</h3>
                <p className="text-lg text-foreground/50 font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl text-center">
          <LocaleLink to="/company/contact/">
            <Button>{t.about.cta}</Button>
          </LocaleLink>
        </div>
      </section>
    </div>
  );
};
