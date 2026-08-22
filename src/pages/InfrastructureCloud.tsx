import { useEffect } from 'react';
import { PageHero, Breadcrumbs } from '../components/Shared';
import { WaitlistForm } from '../components/WaitlistForm';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const InfrastructureCloud = () => {
  useEffect(() => {
    document.title = 'Cloud VPS — VaultScope';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'VaultScope Cloud VPS — flexible virtual infrastructure built on Proxmox and Debian. EU-based OVH datacentres, clean resource isolation, full root access.'
      );
    }
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-6 lg:px-12 pt-32">
        <Breadcrumbs items={[{ label: 'Infrastructure', href: '/infrastructure/' }, { label: 'Cloud VPS' }]} />
      </div>

      <PageHero
        eyebrow="CLOUD VPS"
        title="Flexible virtual infrastructure."
        description="Virtual compute on modern Proxmox-based infrastructure. Clean resource isolation, full root access, and transparent technology — built for applications, services, and development workloads."
        primaryCta="Join the Waitlist"
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
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">Use Cases</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
              Built for real workloads.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-border">
            {[
              { title: 'Applications & Services', desc: 'Production web applications, APIs, microservices, and backend services.' },
              { title: 'Development Environments', desc: 'Isolated dev and staging environments that mirror production.' },
              { title: 'Databases', desc: 'Self-managed database instances with dedicated resources and storage.' },
              { title: 'Web Hosting', desc: 'Websites, CMS platforms, and static site generators with full control.' },
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
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">Architecture</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground mb-4">
              Modern virtualization infrastructure.
            </h2>
            <p className="text-foreground/50 font-light text-lg max-w-3xl">
              Built on Proxmox and Debian — open-source infrastructure you can understand and audit.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-0 border border-border">
            {[
              { title: 'Proxmox Virtualization', desc: 'Enterprise-grade open-source hypervisor providing clean resource isolation between instances.' },
              { title: 'Debian Foundation', desc: 'Stable, production-grade Linux. Battle-tested in production for decades.' },
              { title: 'Full Root Access', desc: 'Complete control over your virtual machine. Install, configure, and manage anything.' },
              { title: 'EU Infrastructure', desc: 'All servers hosted in EU-based OVH datacentres. GDPR-compliant by design.' },
              { title: 'Monitoring', desc: 'Infrastructure health tracked with Uptime Kuma and Beszel. Transparent observability.' },
              { title: 'No Vendor Lock-in', desc: 'Standard Linux VMs. Migrate in or out with standard tools at any time.' },
            ].map((item, i) => (
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
              Cloud VPS services are currently in preparation. Leave your email and we'll notify you when they launch.
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
