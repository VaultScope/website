import { useEffect } from 'react';
import { PageHero } from '../components/Shared';
import { Link } from 'react-router-dom';

export const HostingTerms = () => {
  useEffect(() => {
    document.title = "Hosting Terms — VaultScope";
  }, []);

  return (
    <div className="flex flex-col w-full">
      <PageHero
        title="Hosting Terms"
        description="General Terms and Conditions for VaultScope Cloud VPS and Dedicated Server services."
        align="left"
      />

      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="flex flex-col gap-16 text-foreground/70 font-light leading-relaxed">

            <div>
              <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-3">Version</div>
              <p className="text-sm text-foreground/50">Last updated: August 2026</p>
              <p className="text-sm mt-4">
                These General Terms and Conditions ("Hosting Terms") govern the contractual
                relationship between VaultScope (Anton Schmidt, Einzelunternehmen) and customers
                purchasing Cloud VPS or Dedicated Server services. These Hosting Terms supplement
                the general{' '}
                <Link to="/terms" className="text-foreground hover:underline">Terms of Service</Link>.
                In the event of conflict between these Hosting Terms and the general Terms of Service,
                these Hosting Terms take precedence for hosting services.
              </p>
              <p className="text-sm mt-3">
                Consumers additionally benefit from the rights set out in the{' '}
                <Link to="/cancellation" className="text-foreground hover:underline">
                  Cancellation Policy
                </Link>
                . All customers are subject to the{' '}
                <Link to="/aup" className="text-foreground hover:underline">
                  Acceptable Use Policy
                </Link>
                .
              </p>
            </div>

            {/* 1. Definitions */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">1. Definitions</h2>
              <div className="flex flex-col gap-3 text-sm">
                {[
                  { term: '"VaultScope"', def: 'Anton Schmidt, operating as VaultScope (Einzelunternehmen), Gottlob-Spieß-Straße 2, 74343 Sachsenheim, Germany.' },
                  { term: '"Customer"', def: 'The natural or legal person who concludes a contract with VaultScope for hosting services.' },
                  { term: '"Consumer"', def: 'A Customer who is a natural person acting for purposes outside their trade, business, craft, or profession (§ 13 BGB).' },
                  { term: '"Services"', def: 'Cloud VPS and Dedicated Server products provided by VaultScope.' },
                  { term: '"Infrastructure Provider"', def: 'OVH SAS, whose infrastructure VaultScope uses to deliver the Services.' },
                  { term: '"Billing Period"', def: 'The monthly period for which Services are invoiced, beginning on the activation date.' },
                ].map((item) => (
                  <div key={item.term} className="flex items-start gap-4">
                    <span className="text-foreground/70 font-medium shrink-0 w-36">{item.term}</span>
                    <span>{item.def}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Services */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">2. Services</h2>
              <p className="text-sm mb-4">
                VaultScope provides the following hosting services via the OVH reseller programme:
              </p>
              <div className="flex flex-col gap-5">
                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">Cloud VPS</h3>
                  <p className="text-sm">
                    Virtual private server instances providing isolated virtual compute resources.
                    Servers are hosted in OVH datacentres located within the European Union.
                  </p>
                </div>
                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">Dedicated Servers</h3>
                  <p className="text-sm">
                    Physical server hardware allocated exclusively to a single customer, providing
                    full resource isolation. Servers are hosted in OVH datacentres located within
                    the European Union.
                  </p>
                </div>
              </div>
              <p className="text-sm mt-5">
                Specific product configurations, resource allocations, and applicable prices are
                set out in the order documentation at the time of purchase. VaultScope reserves
                the right to modify the product catalogue and pricing at any time, subject to
                section 14.
              </p>
            </div>

            {/* 3. Contract Conclusion */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">3. Contract Conclusion</h2>
              <p className="text-sm mb-4">
                A binding contract is formed when:
              </p>
              <ul className="flex flex-col gap-3 text-sm mb-4">
                {[
                  'The Customer completes the order process on the VaultScope customer portal and submits an order.',
                  'VaultScope sends an order confirmation by email to the address provided by the Customer.',
                  'Payment is successfully processed by Stripe.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm">
                VaultScope reserves the right to refuse any order at its discretion, including
                where there are reasonable grounds to suspect fraud, misuse, or violation of the
                Acceptable Use Policy.
              </p>
            </div>

            {/* 4. Pricing and Payment */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">4. Pricing and Payment</h2>

              <div className="flex flex-col gap-5 text-sm">
                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">Prices</h3>
                  <p>
                    All prices are displayed in the currency shown at checkout. Prices are exclusive
                    of applicable taxes unless stated otherwise. Where the Customer is a Consumer
                    resident in Germany, prices include applicable VAT.
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">Billing Cycle</h3>
                  <p>
                    Services are billed monthly in advance (prepaid). The first payment is collected
                    at the time the order is placed. Subsequent payments are collected automatically
                    on the same day of each calendar month.
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">Payment Processing</h3>
                  <p>
                    Payments are processed by Stripe, Inc. By placing an order, the Customer agrees
                    to Stripe's Terms of Service. VaultScope does not store card details; all payment
                    data is handled by Stripe in accordance with PCI DSS standards.
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">Failed Payments</h3>
                  <p>
                    If a scheduled payment fails, VaultScope will notify the Customer by email.
                    VaultScope reserves the right to suspend the Service if payment remains
                    outstanding for more than 7 days after the due date. Services suspended for
                    non-payment may be terminated and data deleted if payment is not received within
                    14 days of the original due date.
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Contract Duration and Termination */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">5. Contract Duration and Termination</h2>

              <div className="flex flex-col gap-5 text-sm">
                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">Minimum Term</h3>
                  <p>
                    Services are contracted for a minimum term of one (1) calendar month, commencing
                    on the service activation date.
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">Ordinary Termination by Customer</h3>
                  <p>
                    The Customer may terminate any Service by submitting a cancellation request via
                    the customer portal or by email to{' '}
                    <a href="mailto:cptcr@proton.me" className="text-foreground hover:underline">
                      cptcr@proton.me
                    </a>. Cancellation must be submitted at least 7 days before the next Billing
                    Period start date. Cancellation takes effect at the end of the current Billing
                    Period. No refunds are issued for unused time within a Billing Period.
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">Ordinary Termination by VaultScope</h3>
                  <p>
                    VaultScope may terminate any Service with 30 days' prior written notice to the
                    Customer without cause. In such cases, VaultScope will refund the pro-rata
                    unused portion of any prepaid fees.
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">Extraordinary Termination</h3>
                  <p>
                    VaultScope may terminate any Service immediately and without prior notice for
                    material breach of these Hosting Terms or the Acceptable Use Policy, including
                    non-payment after the grace period, AUP violations, fraud, or abuse. In cases
                    of extraordinary termination by VaultScope due to Customer fault, no refund
                    of prepaid fees will be issued.
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">Consumer Withdrawal Right</h3>
                  <p>
                    Consumers have a 14-day statutory right of withdrawal from the date of contract
                    conclusion. See the{' '}
                    <Link to="/cancellation" className="text-foreground hover:underline">
                      Cancellation Policy
                    </Link>{' '}
                    for full details.
                  </p>
                </div>
              </div>
            </div>

            {/* 6. Data on Termination */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">6. Data on Termination</h2>
              <p className="text-sm mb-4">
                Upon termination or expiry of a Service:
              </p>
              <ul className="flex flex-col gap-3 text-sm">
                {[
                  'Server instances and all associated data will be permanently deleted promptly after the service end date.',
                  'The Customer is solely responsible for backing up any data stored on VaultScope infrastructure prior to the service end date. VaultScope accepts no liability for data loss following termination.',
                  'Billing records and data required by applicable law (e.g. accounting records) will be retained for the legally required period, as described in the Privacy Policy.',
                  'Stripe may retain payment records in accordance with Stripe\'s own data retention obligations.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 7. Service Availability */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">7. Service Availability</h2>
              <p className="text-sm mb-4">
                VaultScope targets service availability consistent with OVH's infrastructure
                availability commitments. As a reseller of OVH infrastructure, VaultScope's
                ability to maintain service availability is dependent on OVH's own operations.
              </p>
              <p className="text-sm mb-4">
                VaultScope does not make an independent uptime guarantee beyond what is provided
                by the OVH infrastructure. In the event of infrastructure downtime caused by OVH,
                VaultScope will investigate compensation on a case-by-case basis in proportion to
                any remedies available to VaultScope through OVH's service level agreements.
              </p>
              <p className="text-sm">
                Planned maintenance will be communicated to affected customers in advance where
                possible. Emergency maintenance may be carried out without prior notice where
                required to protect infrastructure integrity or security.
              </p>
            </div>

            {/* 8. Customer Obligations */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">8. Customer Obligations</h2>
              <ul className="flex flex-col gap-3 text-sm">
                {[
                  'The Customer must provide accurate contact and billing information at the time of registration and keep it up to date.',
                  'The Customer is responsible for securing their server, software, and services hosted on VaultScope infrastructure.',
                  'The Customer must comply with the Acceptable Use Policy at all times.',
                  'The Customer is responsible for all activity on their account and services, whether carried out by the Customer or by third parties with access.',
                  'The Customer must ensure that their use of Services complies with applicable law, including GDPR where personal data is processed.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 9. Sub-contractors */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">9. Sub-contractors and Infrastructure</h2>
              <p className="text-sm mb-4">
                VaultScope provides its hosting services using infrastructure operated by OVH SAS,
                2 rue Kellermann, 59100 Roubaix, France. OVH datacentres used for VaultScope
                services are located within the European Union.
              </p>
              <p className="text-sm">
                The Customer acknowledges that their server infrastructure is ultimately hosted
                on OVH hardware and that OVH's acceptable use policies apply in addition to
                VaultScope's. VaultScope acts as the Customer's contractual counterparty; the
                Customer does not have a direct contractual relationship with OVH.
              </p>
            </div>

            {/* 10. Liability */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">10. Liability</h2>
              <p className="text-sm mb-4">
                VaultScope's liability is limited as follows:
              </p>
              <ul className="flex flex-col gap-3 text-sm mb-4">
                {[
                  'VaultScope is liable without limitation for damages caused by intent or gross negligence, and for damages arising from injury to life, body, or health.',
                  'For damages caused by simple negligence, VaultScope is only liable where an obligation essential to the contract (Kardinalpflicht) has been breached, and then only to the extent of foreseeable, contract-typical damage. Such liability is capped at the total fees paid by the Customer for the affected Service in the 3 months preceding the event giving rise to the claim.',
                  'VaultScope is not liable for loss of data, loss of profit, loss of revenue, or indirect or consequential loss except where caused by intent or gross negligence.',
                  'VaultScope is not liable for service interruptions caused by OVH infrastructure failures, events outside VaultScope\'s reasonable control, or the Customer\'s own actions.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm">
                The above limitations do not affect mandatory statutory liability that cannot be
                excluded under applicable German consumer protection law.
              </p>
            </div>

            {/* 11. Data Processing */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">11. Data Processing</h2>
              <p className="text-sm mb-4">
                VaultScope processes personal data in connection with the provision of Services
                as described in the{' '}
                <Link to="/privacy" className="text-foreground hover:underline">Privacy Policy</Link>.
              </p>
              <p className="text-sm">
                Where the Customer processes personal data of third parties (e.g. end users of
                their applications) on VaultScope infrastructure, the Customer acts as data
                controller and VaultScope acts as data processor. In this case, a Data Processing
                Agreement (DPA) must be concluded pursuant to Art. 28 GDPR. The VaultScope DPA
                is available at{' '}
                <Link to="/dpa" className="text-foreground hover:underline">/dpa</Link>.
                By using VaultScope hosting services, the Customer agrees to the terms of the DPA.
              </p>
            </div>

            {/* 12. Changes */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">12. Changes to These Terms</h2>
              <p className="text-sm mb-4">
                VaultScope may modify these Hosting Terms. Customers will be notified of changes
                by email to the address registered on their account at least 30 days before the
                changes take effect. If a Customer does not object to the changes within 30 days
                of notification, the changes are deemed accepted. The right to object and the
                consequence that the contract continues under the current terms until its
                natural end will be clearly communicated in the notification.
              </p>
              <p className="text-sm">
                Where changes are required by law or are necessary to address security issues,
                shorter notice periods may apply.
              </p>
            </div>

            {/* 13. Governing Law */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">13. Governing Law and Jurisdiction</h2>
              <p className="text-sm mb-4">
                These Hosting Terms are governed by the laws of the Federal Republic of Germany,
                excluding the UN CISG. Consumers resident in the EU additionally retain the
                benefit of any mandatory consumer protection provisions of the law of their
                country of residence.
              </p>
              <p className="text-sm">
                The place of jurisdiction for disputes with business customers is Sachsenheim,
                Germany. For disputes with Consumers, the statutory rules on jurisdiction apply.
              </p>
            </div>

            {/* 14. Severability */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">14. Severability</h2>
              <p className="text-sm">
                If any provision of these Hosting Terms is found to be invalid or unenforceable,
                the remaining provisions continue in full force and effect. The invalid provision
                shall be replaced by a valid provision that most closely reflects the commercial
                intent of the original.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
