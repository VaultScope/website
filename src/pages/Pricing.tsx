import { useEffect } from 'react';
import { PageHero, Button } from '../components/Shared';
import { Link } from 'react-router-dom';

export const Pricing = () => {
  useEffect(() => {
    document.title = "Pegasus Pricing — VaultScope";
  }, []);

  return (
    <div className="flex flex-col w-full">
      <PageHero 
        title="Pricing that makes sense."
        description="Choose the right setup for your community."
        primaryCta="Get started"
        primaryLink="/pricing#options"
      />

      <section id="options" className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
            <div className="border border-border p-8 flex flex-col bg-background">
              <h3 className="text-2xl font-medium text-foreground tracking-tight mb-4">Self-Hosted</h3>
              <p className="text-foreground/50 font-light leading-relaxed mb-4 flex-1">
                For communities with the technical capability to host and manage their own infrastructure.
              </p>
              <div className="text-4xl font-medium text-foreground mb-8">Free<span className="text-lg text-foreground/50 font-light"> / forever</span></div>
              <ul className="space-y-4 mb-8 flex-1 text-foreground/70 font-light">
                <li className="flex items-center gap-2">✓ Full software access</li>
                <li className="flex items-center gap-2">✓ Self-hosting freedom</li>
                <li className="flex items-center gap-2">✓ PolyForm Noncommercial license</li>
                <li className="flex items-center gap-2">✓ Community documentation</li>
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
                <li className="flex items-center gap-2">✓ Managed infrastructure</li>
                <li className="flex items-center gap-2">✓ Automatic updates</li>
                <li className="flex items-center gap-2">✓ Regular backups</li>
                <li className="flex items-center gap-2">✓ Monitoring & support</li>
              </ul>
              <Link to="/about" className="mt-auto">
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
                <li className="flex items-center gap-2">✓ Dedicated deployments</li>
                <li className="flex items-center gap-2">✓ Custom configuration</li>
                <li className="flex items-center gap-2">✓ Integration work</li>
                <li className="flex items-center gap-2">✓ Priority support</li>
              </ul>
              <Link to="/about" className="mt-auto">
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
