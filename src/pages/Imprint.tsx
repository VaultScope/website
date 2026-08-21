import { useEffect } from 'react';
import { PageHero } from '../components/Shared';

export const Imprint = () => {
  useEffect(() => {
    document.title = "Imprint — VaultScope";
  }, []);

  return (
    <div className="flex flex-col w-full">
      <PageHero
        title="Imprint"
        description="Legal notice pursuant to § 5 DDG (Digital Services Act implementation, Germany)."
        align="left"
      />

      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="flex flex-col gap-16 text-foreground/70 font-light leading-relaxed">

            {/* Service Provider */}
            <div>
              <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">Service Provider</div>
              <div className="border border-border p-8 text-sm leading-7">
                <p className="font-medium text-foreground text-base">Anton Schmidt</p>
                <p>VaultScope (Einzelunternehmen)</p>
                <p>Gottlob-Spieß-Straße 2</p>
                <p>74343 Sachsenheim</p>
                <p>Germany</p>
                <div className="mt-5 pt-5 border-t border-border flex flex-col gap-1.5">
                  <p>
                    <span className="text-foreground/40 uppercase tracking-widest text-xs mr-3">Email</span>
                    <a href="mailto:cptcr@proton.me" className="text-foreground hover:underline">
                      cptcr@proton.me
                    </a>
                  </p>
                </div>
              </div>
              <p className="text-sm mt-6 text-foreground/50">
                This imprint applies to the websites <strong className="text-foreground/70 font-medium">vaultscope.de</strong> and{' '}
                <strong className="text-foreground/70 font-medium">pegasusbot.app</strong>.
              </p>
            </div>

            {/* Legal Form */}
            <div>
              <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">Legal Form</div>
              <p className="text-sm">
                VaultScope is operated as a sole proprietorship (Einzelunternehmen) under German law.
                VaultScope is not registered in the Handelsregister (commercial register) and does not hold
                a Umsatzsteuer-Identifikationsnummer (VAT identification number).
              </p>
            </div>

            {/* Responsible for Content */}
            <div>
              <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">
                Responsible for Content
              </div>
              <p className="text-sm mb-4">
                Person responsible for editorial content pursuant to § 18 Abs. 2 MStV:
              </p>
              <div className="border border-border p-8 text-sm leading-7">
                <p className="font-medium text-foreground">Anton Schmidt</p>
                <p>Gottlob-Spieß-Straße 2</p>
                <p>74343 Sachsenheim</p>
                <p>Germany</p>
              </div>
            </div>

            {/* Dispute Resolution */}
            <div>
              <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">
                Dispute Resolution
              </div>
              <p className="text-sm mb-4">
                The European Commission provides an online dispute resolution (ODR) platform for consumers:{' '}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground hover:underline"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p className="text-sm">
                VaultScope is neither obligated nor willing to participate in dispute resolution proceedings
                before a consumer arbitration board.
              </p>
            </div>

            {/* Liability */}
            <div>
              <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">
                Liability for Content
              </div>
              <p className="text-sm mb-4">
                The content of these websites has been compiled with reasonable care. However, VaultScope
                cannot guarantee the accuracy, completeness, or timeliness of the information provided.
                Liability for the content of these websites is excluded to the extent permitted by applicable law.
              </p>
              <p className="text-sm">
                As a service provider, VaultScope is responsible for its own content on these websites in
                accordance with general law. VaultScope is not obligated to monitor transmitted or stored
                third-party information or to investigate circumstances indicating unlawful activity.
                Obligations to remove or block the use of information pursuant to general law remain unaffected.
                Liability in this regard is only possible from the time of knowledge of a concrete legal violation.
                Upon becoming aware of relevant legal violations, VaultScope will remove such content immediately.
              </p>
            </div>

            {/* Liability for Links */}
            <div>
              <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">
                Liability for Links
              </div>
              <p className="text-sm">
                These websites contain links to external third-party websites. VaultScope has no influence
                over the content of linked external pages and accepts no responsibility for them. The respective
                provider or operator of the linked pages is always responsible for their content. Linked pages
                were checked for possible legal violations at the time of linking. Illegal content was not
                apparent at the time of linking. Permanent monitoring of linked pages is unreasonable without
                specific indications of a legal violation. Upon becoming aware of legal violations, VaultScope
                will remove such links immediately.
              </p>
            </div>

            {/* Copyright */}
            <div>
              <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">
                Copyright
              </div>
              <p className="text-sm">
                Content and works on these websites created by VaultScope are subject to German copyright law.
                Duplication, processing, distribution, or any form of commercialisation of such material beyond
                the scope of copyright law requires the prior written consent of its respective author or creator.
                Downloads and copies of these websites are only permitted for private, non-commercial use.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
