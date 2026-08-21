import { useEffect } from 'react';
import { PageHero } from '../components/Shared';

export const Terms = () => {
  useEffect(() => {
    document.title = "Terms of Service — VaultScope";
  }, []);

  return (
    <div className="flex flex-col w-full">
      <PageHero
        title="Terms of Service"
        description="Terms governing use of VaultScope's websites and, when available, its hosting services."
        align="left"
      />

      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="flex flex-col gap-16 text-foreground/70 font-light leading-relaxed">

            <div>
              <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-3">Version</div>
              <p className="text-sm text-foreground/50">Last updated: August 2026</p>
              <p className="text-sm mt-4">
                These Terms of Service govern the use of the websites{' '}
                <strong className="text-foreground/70 font-medium">vaultscope.de</strong> and{' '}
                <strong className="text-foreground/70 font-medium">pegasusbot.app</strong>,
                and any hosting or infrastructure services offered by VaultScope. By accessing these websites
                or using VaultScope services, you agree to these terms.
              </p>
              <p className="text-sm mt-4">
                VaultScope is operated by Anton Schmidt (Einzelunternehmen), Gottlob-Spieß-Straße 2,
                74343 Sachsenheim, Germany. Contact: <a href="mailto:cptcr@proton.me" className="text-foreground hover:underline">cptcr@proton.me</a>
              </p>
            </div>

            {/* 1. Scope */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">1. Scope of These Terms</h2>
              <p className="text-sm mb-4">
                These Terms apply to:
              </p>
              <ul className="flex flex-col gap-3 text-sm mb-4">
                <li className="flex items-start gap-3">
                  <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                  Use of the VaultScope websites (vaultscope.de) and the Pegasus website (pegasusbot.app) in their current informational form.
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                  Any future hosting or infrastructure services offered by VaultScope, including Cloud VPS and Dedicated Server services. Service-specific terms will be provided at the point of purchase and will supplement these Terms.
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                  Any software or tools made available by VaultScope, which may be subject to additional licence terms.
                </li>
              </ul>
              <p className="text-sm">
                These Terms do not apply to Pegasus software licensing, which is governed separately by the
                PolyForm Noncommercial 1.0.0 licence available at{' '}
                <a href="https://pegasusbot.app/license" target="_blank" rel="noreferrer" className="text-foreground hover:underline">
                  pegasusbot.app/license
                </a>.
              </p>
            </div>

            {/* 2. Website Use */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">2. Use of the Websites</h2>
              <p className="text-sm mb-4">
                You may access and use VaultScope's websites for lawful purposes only. You agree not to:
              </p>
              <ul className="flex flex-col gap-3 text-sm">
                {[
                  'Use the websites in any manner that could damage, disable, overburden, or impair them, or interfere with any other party\'s use.',
                  'Attempt to gain unauthorised access to any part of the websites or any systems or networks connected to them.',
                  'Use automated tools (scrapers, bots, crawlers) to access the websites in a manner that places an unreasonable load on VaultScope\'s infrastructure.',
                  'Use the websites to transmit or distribute malicious code, spam, or unlawful content.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Hosting Services */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">3. Hosting Services</h2>
              <p className="text-sm mb-4">
                VaultScope is preparing Cloud VPS and Dedicated Server hosting services. These services are
                not currently available for purchase. When hosting services launch:
              </p>
              <ul className="flex flex-col gap-3 text-sm">
                {[
                  'Service-specific terms, acceptable use policies, and service level descriptions will be provided at the point of order and will form part of the contract between you and VaultScope.',
                  'Payment terms, billing cycles, cancellation rights, and refund policies will be set out in those service-specific terms.',
                  'VaultScope reserves the right to refuse or terminate service to any customer at its reasonable discretion, including for violations of its acceptable use policy.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Intellectual Property */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">4. Intellectual Property</h2>
              <p className="text-sm mb-4">
                The VaultScope name, logo, visual identity, and website content are the property of
                VaultScope (Anton Schmidt) and are protected by applicable copyright and trademark law.
                Unauthorised reproduction, distribution, or use of VaultScope branding or content is prohibited.
              </p>
              <p className="text-sm">
                Software made available by VaultScope is subject to the licence terms under which it is
                distributed. The Pegasus Discord platform is distributed under the PolyForm Noncommercial 1.0.0
                licence. Use beyond the scope of the applicable licence requires prior written permission from
                VaultScope.
              </p>
            </div>

            {/* 5. Disclaimer */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">5. Disclaimer of Warranties</h2>
              <p className="text-sm mb-4">
                The VaultScope websites and their content are provided on an "as is" and "as available" basis.
                VaultScope makes no representations or warranties of any kind, express or implied, regarding
                the accuracy, completeness, or suitability of information on the websites.
              </p>
              <p className="text-sm">
                VaultScope does not warrant that the websites will be uninterrupted, error-free, or free of
                viruses or other harmful components. VaultScope is not responsible for any loss or damage
                arising from reliance on information contained on its websites.
              </p>
            </div>

            {/* 6. Limitation of Liability */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">6. Limitation of Liability</h2>
              <p className="text-sm mb-4">
                To the maximum extent permitted by applicable law, VaultScope's liability for any claims
                arising from or in connection with use of its websites or services is limited as follows:
              </p>
              <ul className="flex flex-col gap-3 text-sm mb-4">
                {[
                  'VaultScope is liable without limitation for damages caused by intent or gross negligence, and for damages arising from injury to life, body, or health.',
                  'For damages caused by simple negligence, VaultScope is only liable if an obligation essential to the contract (Kardinalpflicht) has been breached, and then only to the extent of foreseeable, contract-typical damage.',
                  'Liability for indirect damages, loss of data, loss of profit, or consequential loss is excluded to the extent permitted by law.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm">
                The above limitations do not affect any statutory liability that cannot be excluded under
                applicable German consumer protection law, including rights under the Produkthaftungsgesetz
                (Product Liability Act).
              </p>
            </div>

            {/* 7. Third-Party Links */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">7. Third-Party Links</h2>
              <p className="text-sm">
                VaultScope's websites contain links to third-party websites and services. These links are
                provided for convenience only. VaultScope has no control over the content or practices of
                linked third-party sites and accepts no responsibility for them. Access to third-party sites
                is at your own risk and subject to their own terms and privacy policies.
              </p>
            </div>

            {/* 8. Changes to Terms */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">8. Changes to These Terms</h2>
              <p className="text-sm">
                VaultScope reserves the right to modify these Terms at any time. The date at the top of this
                page indicates when they were last updated. Where changes are material, VaultScope will take
                reasonable steps to bring them to your attention. Continued use of the websites or services
                following any update constitutes acceptance of the revised Terms. If you do not agree to the
                revised Terms, you should stop using the websites or services.
              </p>
            </div>

            {/* 9. Governing Law */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">9. Governing Law and Jurisdiction</h2>
              <p className="text-sm mb-4">
                These Terms and any contractual relationship between you and VaultScope are governed by the
                laws of the Federal Republic of Germany, excluding the UN Convention on Contracts for the
                International Sale of Goods (CISG).
              </p>
              <p className="text-sm mb-4">
                If you are a consumer resident in the European Union, you also benefit from any mandatory
                consumer protection provisions of the law of the country in which you reside.
              </p>
              <p className="text-sm">
                The place of jurisdiction for disputes with merchants, legal entities under public law, or
                special funds under public law is Sachsenheim, Germany. For disputes with consumers, the
                statutory rules on jurisdiction apply.
              </p>
            </div>

            {/* 10. Dispute Resolution */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">10. Dispute Resolution</h2>
              <p className="text-sm mb-4">
                The European Commission provides a platform for online dispute resolution (ODR) for consumers
                at:{' '}
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
                VaultScope is not obligated to participate in dispute resolution proceedings before a consumer
                arbitration board and does not currently do so.
              </p>
            </div>

            {/* 11. Contact */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">11. Contact</h2>
              <p className="text-sm">
                For questions regarding these Terms, contact VaultScope at{' '}
                <a href="mailto:cptcr@proton.me" className="text-foreground hover:underline">
                  cptcr@proton.me
                </a>.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
