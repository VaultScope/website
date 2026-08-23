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
      meta.setAttribute(
        'content',
        'VaultScope is an infrastructure and software company. Building Cloud VPS, Dedicated Servers, and software on transparent, open-source infrastructure.'
      );
    }
  }, [t]);

  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-6 lg:px-12 pt-32">
        <Breadcrumbs items={[{ label: 'Company' }, { label: 'About' }]} />
      </div>

      <PageHero
        title="About VaultScope"
        description="Infrastructure and software, engineered together. Building Cloud VPS, Dedicated Servers, and software on a modern, transparent technology stack."
        align="left"
      />

      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="space-y-16">
            <div>
              <h2 className="text-3xl font-medium mb-6 tracking-tighter text-foreground">What is VaultScope?</h2>
              <p className="text-lg text-foreground/70 font-light leading-relaxed">
                VaultScope is an infrastructure and software company. We build and operate Cloud VPS, Dedicated Servers, and Managed Infrastructure — alongside software products like Pegasus. Everything runs on a curated open-source stack that we control, understand, and can stand behind.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-medium mb-6 tracking-tighter text-foreground">What we build</h2>
              <div className="space-y-4 text-lg text-foreground/70 font-light leading-relaxed">
                <p>
                  <strong className="text-foreground font-medium">Infrastructure</strong> — Cloud VPS, Dedicated Servers, and Managed Infrastructure services built on EU-based infrastructure with Proxmox, Debian, and open-source tooling.
                </p>
                <p>
                  <strong className="text-foreground font-medium">Deploy</strong> — A one-click deployment platform for pre-configured services on managed infrastructure.
                </p>
                <p>
                  <strong className="text-foreground font-medium">Software</strong> — Pegasus is a Discord community management platform built and operated on VaultScope's own infrastructure. Source-available under the PolyForm Noncommercial license.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-medium mb-6 tracking-tighter text-foreground">Why we exist</h2>
              <p className="text-lg text-foreground/70 font-light leading-relaxed">
                VaultScope exists to build and operate infrastructure that we are proud to stand behind. We believe in transparency about how our systems are built, what technology we use, and what we are working toward. Open-source tooling, self-hosted infrastructure, and a straightforward approach to engineering.
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
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">Principles</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
              How we approach our work.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                n: '01',
                title: 'Engineering',
                desc: 'Infrastructure designed deliberately instead of assembled from layers of abstraction. Every component has purpose.',
              },
              {
                n: '02',
                title: 'Transparency',
                desc: 'Infrastructure should be understandable, observable, and controllable. We use only open technologies we can inspect.',
              },
              {
                n: '03',
                title: 'Control',
                desc: 'Your infrastructure should behave like your infrastructure. Full root access, complete control, no vendor lock-in.',
              },
              {
                n: '04',
                title: 'Personal Service',
                desc: 'Direct engineering support from the people who build and operate the infrastructure. No ticket queues, no generic responses.',
              },
            ].map((item) => (
              <motion.div
                key={item.n}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="border-l-2 border-foreground/20 pl-8"
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-foreground/30 mb-3">{item.n}</p>
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
