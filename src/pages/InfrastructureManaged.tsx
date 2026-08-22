import { useEffect } from 'react';
import { PageHero, Button, Breadcrumbs } from '../components/Shared';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings2, Server, Activity, Wrench, ArrowRight, Shield } from 'lucide-react';

export const InfrastructureManaged = () => {
  useEffect(() => {
    document.title = 'Managed Infrastructure — VaultScope';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'VaultScope Managed Infrastructure — custom architecture designed and operated by engineers. From provisioning to monitoring to incident response.'
      );
    }
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-6 lg:px-12 pt-32">
        <Breadcrumbs items={[{ label: 'Infrastructure', href: '/infrastructure/' }, { label: 'Managed' }]} />
      </div>

      <PageHero
        eyebrow="MANAGED INFRASTRUCTURE"
        title="Your infrastructure. Our engineers."
        description="Infrastructure designed for your business. Custom architecture, provisioned, monitored, and maintained by engineers — without the operational overhead of an in-house team."
        primaryCta="Talk to an Engineer"
        primaryLink="/company/contact/"
        align="left"
      />

      {/* What's included */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">What's Included</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
              End-to-end infrastructure management.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-border">
            {[
              { icon: Settings2, title: 'Architecture', desc: 'Custom infrastructure design based on your requirements, workloads, and growth trajectory.' },
              { icon: Server, title: 'Deployment', desc: 'Provisioning, configuration, and deployment of your complete infrastructure stack.' },
              { icon: Activity, title: 'Monitoring', desc: 'Continuous infrastructure health monitoring with alerting and observability.' },
              { icon: Wrench, title: 'Maintenance', desc: 'Regular updates, security patches, performance optimization, and capacity planning.' },
              { icon: ArrowRight, title: 'Migration', desc: 'Move existing infrastructure with minimal downtime. Assessment, planning, and execution.' },
              { icon: Shield, title: 'Incident Response', desc: 'Fast resolution when issues arise. Root cause analysis and preventive measures.' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className={`p-8 border-b lg:border-b-0 ${i % 3 !== 2 ? 'lg:border-r' : ''} ${i < 3 ? 'lg:border-b' : ''} border-border`}
                >
                  <div className="w-10 h-10 border border-border flex items-center justify-center mb-6">
                    <Icon className="w-4 h-4 text-foreground/50" />
                  </div>
                  <h3 className="text-base font-medium text-foreground uppercase tracking-tight mb-3">{item.title}</h3>
                  <p className="text-sm text-foreground/40 font-light leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 relative bg-foreground text-background overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <p className="text-xs font-medium text-background/30 uppercase tracking-widest mb-6">Process</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-background">
              From consultation to operation.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-0 border border-background/20">
            {[
              { step: '01', title: 'Consultation', desc: 'Understand requirements' },
              { step: '02', title: 'Architecture', desc: 'Design the solution' },
              { step: '03', title: 'Deployment', desc: 'Build and configure' },
              { step: '04', title: 'Monitoring', desc: 'Observe and optimize' },
              { step: '05', title: 'Maintenance', desc: 'Ongoing operations' },
            ].map((item, i) => (
              <div key={item.step} className={`p-6 ${i < 4 ? 'border-b md:border-b-0 md:border-r border-background/20' : ''}`}>
                <span className="text-xs font-mono text-background/30 mb-3 block">{item.step}</span>
                <h3 className="text-sm font-medium text-background uppercase tracking-tight mb-2">{item.title}</h3>
                <p className="text-xs text-background/40 font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">Who It's For</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
              Focus on your product. We handle the infrastructure.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-0 border border-border">
            {[
              { title: 'Growing businesses', desc: 'Need infrastructure without building an ops team. Scale without the hiring overhead.' },
              { title: 'Custom requirements', desc: 'Specific architecture, compliance, or performance needs that off-the-shelf hosting cannot meet.' },
              { title: 'Product-focused teams', desc: 'Engineering teams that want to ship product features, not manage servers.' },
            ].map((item, i) => (
              <div key={item.title} className={`p-8 ${i < 2 ? 'border-b md:border-b-0 md:border-r border-border' : ''}`}>
                <h3 className="text-base font-medium text-foreground uppercase tracking-tight mb-3">{item.title}</h3>
                <p className="text-sm text-foreground/40 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="border border-border p-10">
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-4">Pricing</p>
            <p className="text-lg text-foreground/60 font-light mb-6">
              Custom pricing based on your infrastructure requirements.
            </p>
            <Link to="/company/contact/">
              <Button>Talk to an Engineer</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
