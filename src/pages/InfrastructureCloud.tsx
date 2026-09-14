import { useEffect, useState } from 'react';
import { PageHero, Breadcrumbs } from '../components/Shared';
import { WaitlistForm } from '../components/WaitlistForm';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';

export const InfrastructureCloud = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    document.title = t.infrastructureCloud.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', t.infrastructureCloud.metaDescription);
    }
  }, [t]);

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000/api') + '/storefront/catalog')
      .then(res => res.json())
      .then(data => {
        setProducts(data.filter((p: any) => p.category === 'vps' || p.category === 'cloud'));
        setLoadingProducts(false);
      })
      .catch(() => setLoadingProducts(false));
  }, []);

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

      {/* Pricing Tiers */}
      <section className="py-24 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-4">{t.nav.pricing}</p>
              <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground mb-4">
                Cloud Compute Instances
              </h2>
              <p className="text-foreground/50 font-light text-lg">
                High-performance virtual machines billed by the month.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {loadingProducts ? (
              <div className="col-span-2 text-center text-foreground/50 py-12">Loading compute instances...</div>
            ) : products.length === 0 ? (
              <div className="col-span-2 text-center text-foreground/50 py-12">No compute instances available at the moment.</div>
            ) : products.map((plan, i) => {
              const price = typeof plan.price === 'string' ? parseFloat(plan.price) : plan.price;
              const specs = plan.specs as Record<string, any>;
              
              return (
                <motion.div 
                  key={plan.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="border border-border p-8 flex flex-col hover:border-foreground/30 transition-colors"
                >
                  <h3 className="text-xl font-medium tracking-tight mb-2">{plan.name}</h3>
                  <p className="text-sm text-foreground/50 mb-6 font-mono">{plan.target}</p>
                  <div className="text-3xl font-medium mb-6">
                    €{price.toFixed(2)}<span className="text-sm text-foreground/40 font-light"> / {plan.billing_cycle === 'hourly' ? 'hr' : 'mo'}</span>
                  </div>
                  
                  <div className="text-sm text-foreground/60 mb-8 border-t border-border pt-6 flex-1 space-y-3">
                    {specs && Object.entries(specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-foreground/50 capitalize">{key.replace('_', ' ')}</span>
                        <span className="text-foreground text-right">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <LocaleLink to="/dashboard/new" className="mt-auto">
                    <button className="w-full border border-border hover:bg-foreground hover:text-background transition-colors py-2.5 text-sm font-medium">
                      Deploy Now
                    </button>
                  </LocaleLink>
                </motion.div>
              );
            })}
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
