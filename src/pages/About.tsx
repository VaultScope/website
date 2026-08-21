import { useEffect } from 'react';
import { PageHero, Button } from '../components/Shared';

export const About = () => {
  useEffect(() => {
    document.title = "About VaultScope";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'VaultScope is a hosting and infrastructure company building Cloud VPS and Dedicated Server services on a modern, self-hosted technology stack.'
      );
    }
  }, []);

  return (
    <div className="flex flex-col w-full">
      <PageHero
        title="About VaultScope"
        description="A hosting and infrastructure company. Building Cloud VPS and Dedicated Servers on a modern, self-hosted stack."
        align="left"
      />

      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="prose prose-lg dark:prose-invert prose-p:text-foreground/70 prose-p:font-light prose-headings:font-medium prose-headings:tracking-tighter max-w-none">
            <h2 className="text-3xl font-medium mb-6">What is VaultScope?</h2>
            <p className="mb-8">
              VaultScope is a hosting and infrastructure company. We are building the infrastructure and services to provide reliable Cloud VPS and Dedicated Server hosting — operated on a modern, self-hosted technology stack.
            </p>

            <h2 className="text-3xl font-medium mb-6">What we build</h2>
            <p className="mb-8">
              Our primary focus is hosting infrastructure: Cloud VPS and Dedicated Servers. VaultScope's internal operations run on open-source and self-hosted tooling including Debian, Coolify, Forgejo, Uptime Kuma, and Beszel.
            </p>
            <p className="mb-8">
              Beyond infrastructure, VaultScope develops software. <strong>Pegasus</strong> is a Discord community management platform built and operated on VaultScope's own infrastructure — source-available under the PolyForm Noncommercial license.
            </p>

            <h2 className="text-3xl font-medium mb-6">Why we exist</h2>
            <p className="mb-8">
              VaultScope exists to build and operate infrastructure that we are proud to stand behind. We believe in transparency about how our systems are built, what technology we use, and what we are working toward. Open-source tooling, self-hosted infrastructure, and a straightforward approach to hosting.
            </p>

            <div className="mt-16 flex justify-center">
              <a href="mailto:cptcr@proton.me">
                <Button>Contact Us</Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
