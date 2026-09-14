import { useEffect } from 'react';
import { PageHero } from '../components/Shared';
import { Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const Vamos = () => {
  useEffect(() => {
    document.title = "Vamos — VaultScope API Management & Operations System";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Vamos is the VaultScope API Management & Operations System. It acts as an API Layer between CAMOS and the VaultScope Website.");
    }
  }, []);

  return (
    <div className="flex flex-col w-full">
      <PageHero
        eyebrow="API GATEWAY"
        title="Vamos"
        description="VaultScope API Management & Operations System. The robust API Layer written in Rust that handles communication between CAMOS, the VaultScope Website, and external APIs."
        primaryCta="View on GitHub"
        primaryLink="https://github.com/VaultScope/vamos"
        align="left"
      />

      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-16">Overview</div>
          
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
            <div>
              <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground mb-6">High-performance API Gateway</h2>
              <p className="text-foreground/50 font-light text-lg leading-relaxed mb-6">
                Vamos is the centralized API gateway used at VaultScope. It seamlessly handles all communication between our internal systems and external APIs.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-widest text-foreground/40 mt-8">
                <span className="bg-foreground/5 px-2.5 py-1 border border-border">Rust</span>
                <span className="bg-foreground/5 px-2.5 py-1 border border-border">AGPL 3.0</span>
                <span className="bg-foreground/5 px-2.5 py-1 border border-border">OpenSource</span>
              </div>
            </div>

            <div className="grid gap-8 border-l border-border pl-8 md:pl-12">
              <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <Zap className="w-5 h-5 text-foreground/40 mb-3" />
                <h3 className="text-lg font-medium text-foreground mb-2">Written in Rust</h3>
                <p className="text-foreground/50 font-light">Engineered for maximum performance, memory safety, and concurrency.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <Shield className="w-5 h-5 text-foreground/40 mb-3" />
                <h3 className="text-lg font-medium text-foreground mb-2">AGPL 3.0 Licensed</h3>
                <p className="text-foreground/50 font-light">Fully open-source and free to use, modify, and distribute under the terms of the AGPL v3 license.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
