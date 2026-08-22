import { useEffect } from 'react';
import { PageHero, Button } from '../components/Shared';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Pricing = () => {
  useEffect(() => {
    document.title = 'Pricing — VaultScope';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'VaultScope pricing — transparent pricing across Cloud VPS, Dedicated Servers, Deploy, Managed Infrastructure, and Pegasus.'
      );
    }
  }, []);

  return (
    <div className="flex flex-col w-full">
      <PageHero
        title="Pricing"
        description="Transparent pricing across all VaultScope services."
        align="left"
      />

      {/* Infrastructure pricing */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">Infrastructure</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
              Cloud VPS & Dedicated Servers
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border border-border">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 border-b md:border-b-0 md:border-r border-border"
            >
              <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-4">Cloud VPS</p>
              <p className="text-lg text-foreground/60 font-light mb-6">
                Flexible virtual infrastructure with clean resource isolation.
              </p>
              <p className="text-sm text-foreground/40 font-light mb-8">
                Pricing will be published at launch.
              </p>
              <Link to="/infrastructure/cloud/">
                <Button variant="outline" className="text-xs h-10 px-6">Learn More</Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-8 border-b lg:border-b-0 lg:border-r border-border"
            >
              <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-4">Dedicated Servers</p>
              <p className="text-lg text-foreground/60 font-light mb-6">
                Physical hardware with full resource ownership.
              </p>
              <p className="text-sm text-foreground/40 font-light mb-8">
                Pricing will be published at launch.
              </p>
              <Link to="/infrastructure/dedicated/">
                <Button variant="outline" className="text-xs h-10 px-6">Learn More</Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-8"
            >
              <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-4">Managed Infrastructure</p>
              <p className="text-lg text-foreground/60 font-light mb-6">
                Custom architecture operated by engineers.
              </p>
              <p className="text-sm text-foreground/40 font-light mb-8">
                Custom pricing based on requirements.
              </p>
              <Link to="/company/contact/">
                <Button variant="outline" className="text-xs h-10 px-6">Talk to an Engineer</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Deploy pricing */}
      <section className="py-24 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">Deploy Platform</p>
            <div className="border border-border p-8 flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-medium text-foreground tracking-tight mb-3">One-Click Deploy</h3>
                <p className="text-foreground/50 font-light leading-relaxed">
                  Pre-configured services deployed on managed infrastructure.
                </p>
                <p className="text-sm text-foreground/40 font-light mt-3">
                  Pricing will be published at launch.
                </p>
              </div>
              <Link to="/deploy/">
                <Button variant="outline" className="text-xs h-10 px-6">Learn More</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pegasus pricing */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">Software</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
              Pegasus
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
            <div className="border border-border p-8 flex flex-col bg-background">
              <h3 className="text-2xl font-medium text-foreground tracking-tight mb-4">Self-Hosted</h3>
              <p className="text-foreground/50 font-light leading-relaxed mb-4 flex-1">
                For communities with the technical capability to host and manage their own infrastructure.
              </p>
              <div className="text-4xl font-medium text-foreground mb-8">Free<span className="text-lg text-foreground/50 font-light"> / forever</span></div>
              <ul className="space-y-4 mb-8 flex-1 text-foreground/70 font-light">
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> Full software access</li>
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> Self-hosting freedom</li>
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> PolyForm Noncommercial license</li>
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> Community documentation</li>
              </ul>
              <a href="https://github.com/semi-constructor/pegasus" target="_blank" rel="noreferrer" className="mt-auto">
                <Button variant="outline" className="w-full">Get Pegasus</Button>
              </a>
            </div>

            <div className="border border-foreground p-8 flex flex-col bg-foreground/[0.02]">
              <div className="text-xs font-medium text-foreground uppercase tracking-widest mb-4">Pegasus Cloud</div>
              <h3 className="text-2xl font-medium text-foreground tracking-tight mb-4">Managed Instance</h3>
              <p className="text-foreground/50 font-light leading-relaxed mb-4 flex-1">
                For communities that want a reliable, maintained instance without the operational overhead.
              </p>
              <div className="text-4xl font-medium text-foreground mb-8">Coming soon</div>
              <ul className="space-y-4 mb-8 flex-1 text-foreground/70 font-light">
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> Managed infrastructure</li>
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> Automatic updates</li>
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> Regular backups</li>
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> Monitoring & support</li>
              </ul>
              <Link to="/company/contact/" className="mt-auto">
                <Button className="w-full">Contact Us</Button>
              </Link>
            </div>

            <div className="border border-border p-8 flex flex-col bg-background md:col-span-2 lg:col-span-1">
              <h3 className="text-2xl font-medium text-foreground tracking-tight mb-4">Enterprise</h3>
              <p className="text-foreground/50 font-light leading-relaxed mb-4 flex-1">
                For organizations that require custom deployments, SLA, or specialized integrations.
              </p>
              <div className="text-4xl font-medium text-foreground mb-8">Custom</div>
              <ul className="space-y-4 mb-8 flex-1 text-foreground/70 font-light">
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> Dedicated deployments</li>
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> Custom configuration</li>
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> Integration work</li>
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> Priority support</li>
              </ul>
              <Link to="/company/contact/" className="mt-auto">
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise */}
      <section className="py-24 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="border border-border p-10 text-center">
            <h2 className="text-2xl font-medium text-foreground mb-4">Need something custom?</h2>
            <p className="text-foreground/50 font-light mb-8 max-w-xl mx-auto">
              For organizations with unique infrastructure requirements, compliance needs, or scale that requires a tailored solution.
            </p>
            <Link to="/company/contact/">
              <Button>Contact VaultScope</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
