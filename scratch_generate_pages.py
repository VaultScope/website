import os

base_dir = r"D:\Projects\Pegasus\VaultScope\src"

files = {
    "pages/Pegasus.tsx": """import { useEffect } from 'react';
import { PageHero, Button } from '../components/Shared';
import { Shield, Zap, Server, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Pegasus = () => {
  useEffect(() => {
    document.title = "Pegasus — Discord Platform by VaultScope";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Pegasus gives communities the tools they need to automate, manage and grow their Discord servers while keeping control over their software.");
    }
  }, []);

  return (
    <div className="flex flex-col w-full">
      <PageHero 
        eyebrow="A VAULTSCOPE PRODUCT"
        title="Powerful Discord automation. Without giving up control."
        description="Pegasus gives communities the tools they need to automate, manage and grow their Discord servers while keeping control over their software."
        primaryCta="Get started"
        primaryLink="/pricing"
        secondaryCta="Visit pegasusbot.app"
        secondaryLink="https://pegasusbot.app"
      />

      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-24 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-foreground mb-6">Everything your community needs.</h2>
            <p className="text-xl text-foreground/50 font-light">Pegasus provides a comprehensive suite of tools designed for granular control, directly from your dashboard.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16">
            <div className="flex flex-col gap-6">
              <div className="w-14 h-14 bg-foreground/5 border border-border flex items-center justify-center">
                <Shield className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-2xl font-medium text-foreground tracking-tight">Community Management</h3>
              <p className="text-foreground/50 font-light leading-relaxed">
                Tools for moderation, protection and day-to-day server management, including AutoMod, Quarantine, and Tickets.
              </p>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="w-14 h-14 bg-foreground/5 border border-border flex items-center justify-center">
                <Zap className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-2xl font-medium text-foreground tracking-tight">Automation</h3>
              <p className="text-foreground/50 font-light leading-relaxed">
                Automate repetitive workflows and community processes with features like Join to Create.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="w-14 h-14 bg-foreground/5 border border-border flex items-center justify-center">
                <Zap className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-2xl font-medium text-foreground tracking-tight">Engagement</h3>
              <p className="text-foreground/50 font-light leading-relaxed">
                Features for XP, economy, giveaways and community interaction.
              </p>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="w-14 h-14 bg-foreground/5 border border-border flex items-center justify-center">
                <Settings className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-2xl font-medium text-foreground tracking-tight">Dashboard & API</h3>
              <p className="text-foreground/50 font-light leading-relaxed">
                Manage Pegasus through its dashboard and integrate it into existing workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 relative bg-background border-t border-border/[0.05] flex flex-col items-center px-6">
        <h2 className="text-4xl md:text-6xl font-medium tracking-tighter text-foreground mb-6 text-center">Run Pegasus your way.</h2>
        <p className="text-xl md:text-2xl text-foreground/50 font-light leading-relaxed max-w-3xl mb-16 text-center">
          Choose the way that works best for you — run Pegasus yourself or let VaultScope handle the operational side.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
          <div className="border border-border p-8 flex flex-col bg-background">
            <h3 className="text-2xl font-medium text-foreground tracking-tight mb-4">Self-Hosted</h3>
            <p className="text-foreground/50 font-light leading-relaxed mb-8 flex-1">
              Run Pegasus on your own infrastructure. You control the software, the hardware, and the data. Includes open-source components where applicable and community documentation support.
            </p>
            <a href="https://github.com/semi-constructor/pegasus" target="_blank" rel="noreferrer" className="mt-auto">
              <Button variant="outline" className="w-full">Get Pegasus</Button>
            </a>
          </div>

          <div className="border border-foreground p-8 flex flex-col bg-foreground/[0.02]">
            <div className="text-xs font-medium text-foreground uppercase tracking-widest mb-4">Recommended</div>
            <h3 className="text-2xl font-medium text-foreground tracking-tight mb-4">Pegasus Cloud</h3>
            <p className="text-foreground/50 font-light leading-relaxed mb-8 flex-1">
              A managed Pegasus instance operated by VaultScope, without the operational overhead of running it yourself. Includes updates, backups, monitoring, managed infrastructure, and support.
            </p>
            <div className="text-foreground/50 text-sm mb-4">Coming soon</div>
            <Link to="/pricing" className="mt-auto">
              <Button className="w-full">View Pricing</Button>
            </Link>
          </div>

          <div className="border border-border p-8 flex flex-col bg-background md:col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-medium text-foreground tracking-tight mb-4">Enterprise / Custom</h3>
            <p className="text-foreground/50 font-light leading-relaxed mb-8 flex-1">
              Custom deployments and support for organizations with additional requirements. Dedicated deployments, custom configuration, integration work, and priority support.
            </p>
            <Link to="/about" className="mt-auto">
              <Button variant="outline" className="w-full">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-32 relative bg-background border-t border-border/[0.05] flex flex-col items-center text-center px-6">
        <h2 className="text-2xl font-medium tracking-tighter text-foreground mb-4">Pegasus is a product developed and operated by VaultScope.</h2>
        <div className="flex flex-col sm:flex-row gap-6 justify-center w-full mt-6">
          <a href="https://pegasusbot.app" target="_blank" rel="noreferrer">
            <Button>Visit pegasusbot.app</Button>
          </a>
        </div>
      </section>
    </div>
  );
};
""",
    "pages/Pricing.tsx": """import { useEffect } from 'react';
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
                <li className="flex items-center gap-2">✓ Open-source components</li>
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
""",
    "pages/Principles.tsx": """import { useEffect } from 'react';
import { PageHero, FeatureSection } from '../components/Shared';
import { Eye, Lock, GitBranch, Box } from 'lucide-react';

export const Principles = () => {
  useEffect(() => {
    document.title = "Our Principles — VaultScope";
  }, []);

  return (
    <div className="flex flex-col w-full">
      <PageHero 
        title="The principles behind VaultScope."
        description="Software should respect the people who use it. We build products based on privacy, transparency, and user control."
      />

      <FeatureSection 
        index={0}
        title="Privacy"
        description="Privacy should influence how software is designed — not just how it is documented. Software should respect user privacy and avoid unnecessary data collection. We try to collect less, expose less, and respect more."
        icon={Lock}
      />
      
      <FeatureSection 
        index={1}
        reverse={true}
        title="Transparency"
        description="Users should be able to understand what the software does, how it works, and how their data is handled. We believe in building software that isn't a black box."
        icon={Eye}
      />
      
      <FeatureSection 
        index={2}
        title="Open Source"
        description="We believe in opening our software where it creates meaningful value for users and the community. VaultScope believes in open-source software where technically, economically and strategically possible."
        icon={GitBranch}
      />

      <FeatureSection 
        index={3}
        reverse={true}
        title="Control"
        description="Users should have meaningful control over the software they use and, where applicable, how and where it is operated. Software should work for you, not restrict you."
        icon={Box}
      />
    </div>
  );
};
""",
    "pages/About.tsx": """import { useEffect } from 'react';
import { PageHero, Button } from '../components/Shared';

export const About = () => {
  useEffect(() => {
    document.title = "About VaultScope";
  }, []);

  return (
    <div className="flex flex-col w-full">
      <PageHero 
        title="About VaultScope"
        description="We are a software company building tools focused on privacy, transparency and control."
      />

      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="prose prose-lg dark:prose-invert prose-p:text-foreground/70 prose-p:font-light prose-headings:font-medium prose-headings:tracking-tight max-w-none">
            <h2 className="text-3xl font-medium mb-6">What is VaultScope?</h2>
            <p className="mb-8">
              VaultScope is a software company that believes in building products with clear, ethical boundaries. 
              We don't try to be everything for everyone. We build focused software that gives users the ability to understand how their data is used and how their systems operate.
            </p>
            
            <h2 className="text-3xl font-medium mb-6">What we build</h2>
            <p className="mb-8">
              Our current primary product is <strong>Pegasus</strong>, a powerful Discord platform built for communities that want automation, flexibility and control. 
              We provide Pegasus as self-hostable software and are working on managed offerings for communities that want the power of Pegasus without the operational overhead.
            </p>

            <h2 className="text-3xl font-medium mb-6">Why we exist</h2>
            <p className="mb-8">
              Too much software today operates as a black box, collecting data silently and removing control from the people who actually use it. 
              VaultScope exists to provide an alternative. We want to build software you can trust, based on our core principles of transparency, privacy, open source, and control.
            </p>
            
            <div className="mt-16 flex justify-center">
              <a href="mailto:contact@vaultscope.com">
                <Button>Contact Us</Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
""",
    "pages/OpenSource.tsx": """import { useEffect } from 'react';
import { PageHero, Button } from '../components/Shared';
import { GitBranch } from 'lucide-react';

export const OpenSource = () => {
  useEffect(() => {
    document.title = "Open Source — VaultScope";
  }, []);

  return (
    <div className="flex flex-col w-full">
      <PageHero 
        title="Open where it matters."
        description="We believe users should be able to inspect and understand the software they rely on whenever openness makes sense for the project."
      />

      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="mb-16">
            <h2 className="text-3xl font-medium mb-4">Our Philosophy</h2>
            <p className="text-foreground/70 font-light text-lg">
              VaultScope aims to open-source software where technically, economically, and strategically possible. We do not claim that every product will be entirely open source, but we believe in open boundaries and transparency where it brings real value to our users.
            </p>
          </div>

          <div className="grid gap-8">
            <div className="border border-border p-8 flex flex-col md:flex-row md:items-center gap-8 bg-foreground/[0.01]">
              <div className="w-16 h-16 bg-background border border-border flex items-center justify-center shrink-0">
                <GitBranch className="w-8 h-8 text-foreground/50" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-medium text-foreground tracking-tight mb-2">Pegasus</h3>
                <p className="text-foreground/50 font-light mb-4">
                  The core logic and functionality of the Pegasus Discord Platform.
                </p>
                <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-widest text-foreground/40">
                  <span className="bg-foreground/5 px-2 py-1 border border-border">MIT License</span>
                  <span>TypeScript</span>
                </div>
              </div>
              <div>
                <a href="https://github.com/semi-constructor/pegasus" target="_blank" rel="noreferrer">
                  <Button variant="outline">View Repository</Button>
                </a>
              </div>
            </div>
            
            <div className="border border-border p-8 flex flex-col md:flex-row md:items-center gap-8 bg-foreground/[0.01]">
              <div className="w-16 h-16 bg-background border border-border flex items-center justify-center shrink-0">
                <GitBranch className="w-8 h-8 text-foreground/50" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-medium text-foreground tracking-tight mb-2">Pegasus Dashboard</h3>
                <p className="text-foreground/50 font-light mb-4">
                  The web dashboard and API interface for Pegasus.
                </p>
                <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-widest text-foreground/40">
                  <span className="bg-foreground/5 px-2 py-1 border border-border">MIT License</span>
                  <span>Next.js</span>
                </div>
              </div>
              <div>
                <a href="https://github.com/semi-constructor/pegasus-dashboard" target="_blank" rel="noreferrer">
                  <Button variant="outline">View Repository</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
"""
}

for rel_path, content in files.items():
    full_path = os.path.join(base_dir, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Created pages successfully")
