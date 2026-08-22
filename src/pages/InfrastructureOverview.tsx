import { useEffect } from 'react';
import { PageHero, Button } from '../components/Shared';
import { WaitlistForm } from '../components/WaitlistForm';
import { Server, Cpu, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const InfrastructureOverview = () => {
  useEffect(() => {
    document.title = 'Infrastructure — VaultScope';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'VaultScope infrastructure: Cloud VPS, Dedicated Servers, and Managed Infrastructure built on EU-based infrastructure with transparent, open-source technology.'
      );
    }
  }, []);

  return (
    <div className="flex flex-col w-full">
      <PageHero
        eyebrow="INFRASTRUCTURE"
        title="Cloud VPS. Dedicated Servers. Managed Infrastructure."
        description="Three infrastructure models built on EU-based infrastructure. Transparent technology, open-source tooling, and engineering without unnecessary complexity."
        primaryCta="Join the Waitlist"
        primaryLink="#waitlist"
        align="left"
      />

      {/* Three models */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-0 border border-border">
            {[
              {
                icon: Server,
                label: 'Tier 01',
                title: 'Cloud VPS',
                desc: 'Flexible virtual infrastructure for applications, services, and development workloads. Clean resource isolation on modern virtualization technology.',
                link: '/infrastructure/cloud/',
                cta: 'Explore Cloud VPS',
              },
              {
                icon: Cpu,
                label: 'Tier 02',
                title: 'Dedicated Servers',
                desc: 'Physical hardware with full resource ownership. No shared tenancy, no contention — built for workloads that require consistent performance.',
                link: '/infrastructure/dedicated/',
                cta: 'Explore Dedicated',
              },
              {
                icon: Settings2,
                label: 'Managed',
                title: 'Managed Infrastructure',
                desc: 'Custom architecture designed and operated by engineers. From provisioning to monitoring to incident response — infrastructure without the operational overhead.',
                link: '/infrastructure/managed/',
                cta: 'Learn More',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`p-10 md:p-12 flex flex-col ${i < 2 ? 'border-b md:border-b-0 md:border-r border-border' : ''}`}
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-12 h-12 border border-border flex items-center justify-center">
                      <Icon className="w-5 h-5 text-foreground/60" />
                    </div>
                    <span className="text-xs font-medium text-foreground/30 uppercase tracking-widest">
                      {item.label}
                    </span>
                  </div>
                  <h2 className="text-3xl font-medium text-foreground tracking-tight mb-4">{item.title}</h2>
                  <p className="text-foreground/50 font-light leading-relaxed mb-8 flex-1 text-lg">
                    {item.desc}
                  </p>
                  <Link to={item.link}>
                    <Button variant="outline" className="w-full">{item.cta}</Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Infrastructure facts */}
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

      {/* Technology */}
      <section className="py-24 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">Technology Foundation</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground mb-4">
              Built on open infrastructure.
            </h2>
            <p className="text-foreground/50 font-light text-lg max-w-3xl mb-12">
              Proxmox-based virtualization on Debian. Monitored with Uptime Kuma and Beszel. Deployed with Coolify. Version-controlled on Forgejo.
            </p>
            <Link to="/company/open-source/" className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-foreground hover:text-foreground/70 transition-colors">
              See the full technology stack
            </Link>
          </motion.div>
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
              Cloud VPS and Dedicated Server services are currently in preparation.
              Leave your email and we'll notify you the moment they launch.
            </p>
            <WaitlistForm />
            <div className="mt-8 pt-8 border-t border-border/[0.05]">
              <p className="text-sm text-foreground/30 font-light">
                Questions before launch?{' '}
                <Link to="/company/contact/" className="text-foreground/50 hover:text-foreground transition-colors underline underline-offset-2">
                  Get in touch
                </Link>
                {' '}or review the{' '}
                <Link to="/legal/hosting-terms/" className="text-foreground/50 hover:text-foreground transition-colors underline underline-offset-2">
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
