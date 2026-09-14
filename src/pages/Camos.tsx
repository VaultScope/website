import { useEffect } from 'react';
import { PageHero } from '../components/Shared';
import { Shield, Layout, Server, Database, Users, HeadphonesIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: Layout,
    title: 'Dashboard & Telemetry',
    description: 'Visualize MRR, active servers, open tickets, and infrastructure node capacity.'
  },
  {
    icon: Users,
    title: 'Customers & Billing',
    description: 'View client profiles, manage Stripe subscriptions/invoices, handle tax rates, and generate promotional coupons.'
  },
  {
    icon: Database,
    title: 'Service & Product Management',
    description: 'Map retail plans to underlying upstream infrastructure. Support for custom configuration options.'
  },
  {
    icon: Server,
    title: 'API Connectors',
    description: 'Natively route API calls to infrastructure providers like Hetzner, OVH, Pterodactyl, and Proxmox VE.'
  },
  {
    icon: HeadphonesIcon,
    title: 'Support Desk',
    description: 'Fully-featured ticketing system mapped to Mailcow IMAP mailboxes for support, abuse, and DMCA.'
  },
  {
    icon: Shield,
    title: 'Internal Launchpad',
    description: 'Quick access portal to sovereign OSS tools restricted by staff RBAC permissions.'
  }
];

export const Camos = () => {
  useEffect(() => {
    document.title = "Camos — Client Administration & Management Operations System";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "CAMOS is the centralized internal dashboard used by staff to manage VaultScope operations.");
    }
  }, []);

  return (
    <div className="flex flex-col w-full">
      <PageHero
        eyebrow="INTERNAL DASHBOARD"
        title="Camos"
        description="Client Administration & Management Operations System. The primary control plane for billing, customer support, infrastructure API integrations, and staff RBAC."
        primaryCta="View on GitHub"
        primaryLink="https://github.com/VaultScope/camos"
        align="left"
      />

      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-16">Features</div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border border-border">
            {FEATURES.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={`p-10 flex flex-col gap-6 border-border ${i % 3 !== 2 ? 'lg:border-r' : ''} ${i < 3 ? 'lg:border-b' : ''} ${i % 2 !== 1 ? 'md:border-r' : ''} ${i < 4 ? 'md:border-b' : ''} border-b`}
                >
                  <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-foreground/60" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground tracking-tight mb-3">{item.title}</h3>
                    <p className="text-sm text-foreground/40 font-light leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-24 pt-16 border-t border-border/[0.05]">
            <h3 className="text-xl font-medium tracking-tight mb-8">Tech Stack</h3>
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-widest text-foreground/40">
              <span className="bg-foreground/5 px-3 py-1.5 border border-border">React 18</span>
              <span className="bg-foreground/5 px-3 py-1.5 border border-border">Vite</span>
              <span className="bg-foreground/5 px-3 py-1.5 border border-border">React Router v6</span>
              <span className="bg-foreground/5 px-3 py-1.5 border border-border">Tailwind CSS</span>
              <span className="bg-foreground/5 px-3 py-1.5 border border-border">Lucide React</span>
              <span className="bg-foreground/5 px-3 py-1.5 border border-border">Recharts</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
