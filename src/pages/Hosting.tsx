import { useEffect } from 'react';
import { PageHero } from '../components/Shared';
import { WaitlistForm } from '../components/WaitlistForm';
import { Server, Cpu } from 'lucide-react';
import { LocaleLink as Link } from '../i18n/LocaleLink';
import { motion } from 'framer-motion';

const CLOUD_VPS_FEATURES = [
  'Virtual compute on dedicated hardware',
  'Clean resource isolation per instance',
  'Suitable for applications, services, and development',
  'Modern virtualization infrastructure',
  'EU datacentres via OVH',
];

const DEDICATED_FEATURES = [
  'Dedicated physical hardware, fully isolated',
  'No shared resources or contention',
  'Full control over the infrastructure layer',
  'Suited to demanding, performance-sensitive workloads',
  'EU datacentres via OVH',
];

export const Hosting = () => {
  useEffect(() => {
    document.title = "Hosting — VaultScope";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'VaultScope Cloud VPS and Dedicated Servers — flexible virtual infrastructure and dedicated physical hosting, built on EU-based OVH infrastructure.'
      );
    }
  }, []);

  return (
    <div className="flex flex-col w-full">
      <PageHero
        eyebrow="HOSTING SERVICES"
        title="Cloud VPS & Dedicated Servers."
        description="Two infrastructure tiers built on EU-based OVH infrastructure. Currently in preparation — join the waitlist to be notified when services launch."
        align="left"
      />

      {/* Services */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-0 border border-border">

            {/* Cloud VPS */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-10 md:p-12 flex flex-col border-b md:border-b-0 md:border-r border-border bg-background"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 border border-border flex items-center justify-center">
                  <Server className="w-5 h-5 text-foreground/60" />
                </div>
                <div className="flex items-center gap-2 border border-border px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/20 block" />
                  <span className="text-xs font-medium text-foreground/40 uppercase tracking-widest">Coming Soon</span>
                </div>
              </div>

              <h2 className="text-3xl font-medium text-foreground tracking-tight mb-4">Cloud VPS</h2>
              <p className="text-foreground/50 font-light leading-relaxed mb-8 flex-1 text-lg">
                Flexible virtual infrastructure for applications, services, and development workloads.
                Built on modern virtualization technology, providing clean resource isolation and
                predictable performance without the overhead of a shared environment.
              </p>

              <div className="flex flex-col gap-3 border-t border-border pt-8 mb-8">
                {CLOUD_VPS_FEATURES.map((f) => (
                  <div key={f} className="flex items-start gap-3 text-sm text-foreground/40 font-light">
                    <span className="w-px h-4 bg-foreground/15 block shrink-0 mt-0.5" />
                    {f}
                  </div>
                ))}
              </div>

              <p className="text-xs text-foreground/25 font-light">
                Specifications and pricing will be published at launch.
              </p>
            </motion.div>

            {/* Dedicated Servers */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-10 md:p-12 flex flex-col bg-foreground/[0.015]"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 border border-border flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-foreground/60" />
                </div>
                <div className="flex items-center gap-2 border border-border px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/20 block" />
                  <span className="text-xs font-medium text-foreground/40 uppercase tracking-widest">Coming Soon</span>
                </div>
              </div>

              <h2 className="text-3xl font-medium text-foreground tracking-tight mb-4">Dedicated Servers</h2>
              <p className="text-foreground/50 font-light leading-relaxed mb-8 flex-1 text-lg">
                Dedicated physical infrastructure with full resource ownership. No shared hardware,
                no resource contention — built for workloads that require consistent performance
                and direct hardware control without compromise.
              </p>

              <div className="flex flex-col gap-3 border-t border-border pt-8 mb-8">
                {DEDICATED_FEATURES.map((f) => (
                  <div key={f} className="flex items-start gap-3 text-sm text-foreground/40 font-light">
                    <span className="w-px h-4 bg-foreground/15 block shrink-0 mt-0.5" />
                    {f}
                  </div>
                ))}
              </div>

              <p className="text-xs text-foreground/25 font-light">
                Specifications and pricing will be published at launch.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Infrastructure note */}
      <section className="py-24 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-0 border border-border">
            {[
              {
                label: 'Infrastructure',
                value: 'OVH SAS',
                note: 'EU datacentres. VaultScope is an OVH reseller.',
              },
              {
                label: 'Locations',
                value: 'European Union',
                note: 'All servers hosted in EU-based OVH datacentres.',
              },
              {
                label: 'Legal',
                value: 'GDPR compliant',
                note: 'No data transfer outside the EEA for server infrastructure.',
              },
            ].map((item, i) => (
              <div key={item.label} className={`p-8 ${i < 2 ? 'border-b md:border-b-0 md:border-r border-border' : ''}`}>
                <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-3">{item.label}</p>
                <p className="text-base font-medium text-foreground mb-2">{item.value}</p>
                <p className="text-sm text-foreground/40 font-light">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground mb-4">
              Be the first to know.
            </h2>
            <p className="text-foreground/50 font-light mb-10 text-lg leading-relaxed">
              Cloud VPS and Dedicated Server services are currently in preparation.
              Leave your email and we'll notify you the moment they launch.
            </p>
            <WaitlistForm />
            <div className="mt-8 pt-8 border-t border-border/[0.05]">
              <p className="text-sm text-foreground/30 font-light">
                Questions before launch?{' '}
                <Link to="/contact" className="text-foreground/50 hover:text-foreground transition-colors underline underline-offset-2">
                  Get in touch
                </Link>
                {' '}or review the{' '}
                <Link to="/hosting-terms" className="text-foreground/50 hover:text-foreground transition-colors underline underline-offset-2">
                  Hosting Terms
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
