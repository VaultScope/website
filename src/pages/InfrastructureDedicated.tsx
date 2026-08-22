import { useEffect } from 'react';
import { PageHero, Breadcrumbs } from '../components/Shared';
import { WaitlistForm } from '../components/WaitlistForm';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const InfrastructureDedicated = () => {
  useEffect(() => {
    document.title = 'Dedicated Servers — VaultScope';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'VaultScope Dedicated Servers — physical hardware with full resource ownership. No shared tenancy. EU-based OVH datacentres.'
      );
    }
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-6 lg:px-12 pt-32">
        <Breadcrumbs items={[{ label: 'Infrastructure', href: '/infrastructure/' }, { label: 'Dedicated Servers' }]} />
      </div>

      <PageHero
        eyebrow="DEDICATED SERVERS"
        title="Physical hardware. Full control."
        description="Dedicated physical infrastructure with full resource ownership. No shared hardware, no resource contention — built for workloads that require consistent performance and direct hardware control."
        primaryCta="Join the Waitlist"
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
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">Dedicated</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
              100% exclusive resources.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-0 border border-border">
            {[
              { title: 'No Shared Resources', desc: 'Every CPU core, every byte of RAM, every disk operation belongs exclusively to you.' },
              { title: 'Full Hardware Ownership', desc: 'Physical hardware allocated entirely to your workloads. No noisy neighbors.' },
              { title: 'Direct Hardware Control', desc: 'Access to the full hardware stack. Configure BIOS, RAID, networking at the physical level.' },
              { title: 'Consistent Performance', desc: 'No virtualization overhead. Predictable, repeatable performance under any load.' },
            ].map((item, i) => (
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
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">Use Cases</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
              Built for demanding workloads.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-border">
            {[
              { title: 'Performance-Critical', desc: 'Applications that require guaranteed resources and minimal latency.' },
              { title: 'Large-Scale', desc: 'Services handling high traffic volumes that need predictable throughput.' },
              { title: 'Compliance', desc: 'Workloads with regulatory requirements around data isolation.' },
              { title: 'High Throughput', desc: 'Data-intensive operations that benefit from dedicated I/O and bandwidth.' },
            ].map((item, i) => (
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
            {[
              { label: 'Operating System', value: 'Debian', note: 'Stable, production-grade Linux distribution.' },
              { label: 'Location', value: 'European Union', note: 'EU-based OVH datacentres. GDPR compliant.' },
              { label: 'Infrastructure', value: 'OVH SAS', note: 'Physical hardware from OVH.' },
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

      {/* Pricing state */}
      <section className="py-24 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="border border-border p-10">
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-4">Pricing</p>
            <p className="text-lg text-foreground/60 font-light">
              Specifications and pricing will be published at launch.
            </p>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground mb-4">
              Be the first to know.
            </h2>
            <p className="text-foreground/50 font-light mb-10 text-lg leading-relaxed">
              Dedicated Server services are currently in preparation. Leave your email and we'll notify you when they launch.
            </p>
            <WaitlistForm />
            <div className="mt-8 pt-8 border-t border-border/[0.05]">
              <p className="text-sm text-foreground/30 font-light">
                Questions?{' '}
                <Link to="/company/contact/" className="text-foreground/50 hover:text-foreground transition-colors underline underline-offset-2">
                  Get in touch
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
