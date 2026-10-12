import { useEffect, useState } from 'react';
import { PageHero, Breadcrumbs } from '../components/Shared';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';

export const InfrastructureStorage = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    document.title = 'SFTP Storage — VaultScope';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', 'High-performance SFTP storage for your clipping software and file management needs.');
    }
  }, []);

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000/api') + '/storefront/catalog')
      .then(res => res.json())
      .then(data => {
        setProducts(data.filter((p: any) => p.category === 'storage' || p.category === 'sftp'));
        setLoadingProducts(false);
      })
      .catch(() => setLoadingProducts(false));
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-6 lg:px-12 pt-32">
        <Breadcrumbs items={[{ label: t.nav.infrastructure, href: '/infrastructure/' }, { label: 'SFTP Storage' }]} />
      </div>

      <PageHero
        eyebrow="HIGH-AVAILABILITY FILE TRANSFER"
        title="SFTP Storage"
        description="Scalable, secure SFTP storage for seamless file sharing and software integrations."
        primaryCta="Get Started"
        primaryLink="/dashboard/sftp"
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
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">Use Cases</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
              Designed for modern workflows
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-border">
            {[
              { title: "Clipping Software", desc: "Perfect for external clipping software integrations requiring fast, secure uploads." },
              { title: "Automated Backups", desc: "Use our SFTP service as a target for your automated server backups." },
              { title: "Secure File Sharing", desc: "Manage and share files using our built-in web file manager." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`p-8 ${i < 2 ? 'border-b lg:border-b-0 lg:border-r border-border' : ''}`}
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
              <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-4">Pricing</p>
              <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground mb-4">
                Transparent Storage Plans
              </h2>
              <p className="text-foreground/50 font-light text-lg">
                Start with a free month, upgrade automatically when you need more space.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {loadingProducts ? (
              <div className="col-span-2 text-center text-foreground/50 py-12">Loading storage plans...</div>
            ) : products.length === 0 ? (
              <div className="col-span-2 text-center text-foreground/50 py-12">No storage plans available at the moment.</div>
            ) : products.map((plan, i) => {
              const price = typeof plan.price === 'string' ? parseFloat(plan.price) : plan.price;
              const specs = plan.specs as Record<string, any>;
              const isFreeTrial = price === 0;
              
              return (
                <motion.div 
                  key={plan.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`border ${isFreeTrial ? 'border-blue-600/50' : 'border-border'} p-8 flex flex-col hover:border-foreground/30 transition-colors relative`}
                >
                  {isFreeTrial && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      1st Month FREE
                    </div>
                  )}
                  <h3 className="text-xl font-medium tracking-tight mb-2">{plan.name}</h3>
                  <div className="text-3xl font-medium mb-6">
                    €{(price * 1.19).toFixed(2)}<span className="text-sm text-foreground/40 font-light"> / {plan.billing_cycle === 'hourly' ? 'hr' : 'mo'} incl. VAT</span>
                  </div>
                  
                  <div className="text-sm text-foreground/60 mb-8 border-t border-border pt-6 flex-1 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/50">Storage Capacity</span>
                      <span className="text-foreground text-right">{specs?.storage_gb || 'Scalable'} GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/50">File Manager</span>
                      <span className="text-foreground text-right">Included</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/50">Connection</span>
                      <span className="text-foreground text-right">SFTP / HTTPS</span>
                    </div>
                  </div>
                  
                  <LocaleLink to="/dashboard/sftp" className="mt-auto">
                    <button className={`w-full border py-2.5 text-sm font-medium transition-colors ${
                      isFreeTrial ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700' : 'border-border hover:bg-foreground hover:text-background'
                    }`}>
                      {isFreeTrial ? 'Start Free Trial' : 'Subscribe Now'}
                    </button>
                  </LocaleLink>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
