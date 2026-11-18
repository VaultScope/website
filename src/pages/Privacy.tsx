import { useEffect } from 'react';
import { PageHero, LegalDocumentLayout } from '../components/Shared';

const GDPR_RIGHTS = [
  {
    title: 'Right of access (Art. 15 GDPR)',
    desc: 'You may request confirmation of whether we process your personal data and, if so, obtain access to that data together with information about how it is processed.',
  },
  {
    title: 'Right to rectification (Art. 16 GDPR)',
    desc: 'You may request correction of inaccurate personal data we hold about you, and completion of incomplete data.',
  },
  {
    title: 'Right to erasure (Art. 17 GDPR)',
    desc: 'You may request deletion of your personal data where the data is no longer necessary for the purpose for which it was collected, or where there is no other overriding legal basis for processing.',
  },
  {
    title: 'Right to restriction of processing (Art. 18 GDPR)',
    desc: 'You may request that we restrict the processing of your personal data in certain circumstances, for example while the accuracy of data is being contested.',
  },
  {
    title: 'Right to data portability (Art. 20 GDPR)',
    desc: 'Where processing is based on your consent or a contract, you may request a copy of personal data you have provided to us in a structured, commonly used, machine-readable format.',
  },
  {
    title: 'Right to object (Art. 21 GDPR)',
    desc: 'Where processing is based on our legitimate interests, you may object to that processing. We will cease processing unless we can demonstrate compelling legitimate grounds that override your interests, rights, and freedoms.',
  },
  {
    title: 'Right to withdraw consent (Art. 7(3) GDPR)',
    desc: 'Where processing is based on your consent, you may withdraw that consent at any time. Withdrawal does not affect the lawfulness of processing before the withdrawal.',
  },
];

const SUB_PROCESSORS = [
  {
    name: 'Hetzner Online GmbH',
    role: 'Server infrastructure & storage — hosting of Cloud VPS, Dedicated Servers, and SFTP storage nodes',
    location: 'Germany / Finland (EU)',
    transfer: 'No third-country transfer',
  },
  {
    name: 'OVH SAS',
    role: 'Server infrastructure — hosting of Cloud VPS and Dedicated Server services',
    location: 'European Union',
    transfer: 'No third-country transfer',
  },
  {
    name: 'Stripe, Inc. / Stripe Payments Europe, Ltd.',
    role: 'Payment processing — billing, checkout, and invoice settlement',
    location: 'EEA / USA',
    transfer: 'Standard Contractual Clauses / EU-US Data Privacy Framework',
  },
];

export const Privacy = () => {
  useEffect(() => {
    document.title = "Privacy Policy — VaultScope";
  }, []);

  return (
    <div className="flex flex-col w-full">
      <PageHero
        title="Privacy Policy"
        description="How VaultScope collects, processes, and protects personal data in accordance with the GDPR."
        align="left"
      />

      <LegalDocumentLayout>
          <div className="flex flex-col gap-16 text-[var(--text-muted)] leading-relaxed">

            {/* Intro */}
            <div>
              <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-3">Version</div>
              <p className="text-sm text-foreground/50">Last updated: November 2026</p>
              <p className="text-sm mt-4">
                This Privacy Policy describes how VaultScope (Anton Schmidt, Einzelunternehmen) processes
                personal data in connection with the websites{' '}
                <strong className="text-foreground/70 font-medium">vaultscope.de</strong> and{' '}
                <strong className="text-foreground/70 font-medium">pegasusbot.app</strong>, the
                VaultScope customer portal, and VaultScope infrastructure services (SFTP Storage, Cloud VPS,
                Dedicated Servers, and One-Click Deploy). VaultScope is subject to the General Data Protection
                Regulation (GDPR), the German Federal Data Protection Act (BDSG), and the TDDDG.
              </p>
            </div>

            {/* 1. Controller & Data Protection Officer */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">1. Data Controller &amp; Data Protection Officer</h2>
              <p className="text-sm mb-5">
                1.1 The data controller for the processing described in this policy is:
              </p>
              <div className="border-l-2 border-[var(--accent)] pl-6 py-1 text-sm leading-7">
                <p className="font-medium text-foreground">Anton Schmidt</p>
                <p>VaultScope (Einzelunternehmen)</p>
                <p>Gottlob-Spieß-Straße 2</p>
                <p>74343 Sachsenheim</p>
                <p>Germany</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <p>
                    <span className="text-foreground/40 uppercase tracking-widest text-xs mr-3">Email</span>
                    <a href="mailto:administration@vaultscope.de" className="text-foreground hover:underline">administration@vaultscope.de</a>
                  </p>
                  <p className="mt-1">
                    <span className="text-foreground/40 uppercase tracking-widest text-xs mr-3">Support</span>
                    <a href="mailto:support@vaultscope.de" className="text-foreground hover:underline">support@vaultscope.de</a>
                  </p>
                </div>
              </div>

              <p className="text-sm mt-6 mb-4">
                1.2 The designated Data Protection Officer (Datenschutzbeauftragter) is:
              </p>
              <div className="border-l-2 border-[var(--accent)] pl-6 py-1 text-sm leading-7">
                <p className="font-medium text-foreground">Anton Schmidt (Datenschutzbeauftragter)</p>
                <p>Gottlob-Spieß-Straße 2</p>
                <p>74343 Sachsenheim, Germany</p>
                <p className="mt-2">
                  <span className="text-foreground/40 uppercase tracking-widest text-xs mr-3">Privacy Email</span>
                  <a href="mailto:data@vaultscope.de" className="text-foreground hover:underline">data@vaultscope.de</a>
                  {' / '}
                  <a href="mailto:administration@vaultscope.de" className="text-foreground hover:underline">administration@vaultscope.de</a>
                </p>
              </div>
            </div>

            {/* 2. Data Processed */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">2. Personal Data We Process</h2>

              <div className="flex flex-col gap-8">

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">2.1 Server and Access Logs</h3>
                  <p className="text-sm mb-2">
                    When you access our websites or customer portal, the hosting provider automatically
                    records standard access data: IP address, browser type and version, operating system,
                    referring URL, pages accessed, and access date/time.
                  </p>
                  <p className="text-sm mb-1">
                    <span className="text-foreground/50 font-medium">Legal basis:</span>{' '}
                    Legitimate interest (Art. 6(1)(f) GDPR) — operational security of the websites.
                  </p>
                  <p className="text-sm">
                    <span className="text-foreground/50 font-medium">Retention:</span>{' '}
                    Short period for security purposes; subsequently deleted or anonymised.
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">2.2 Customer Account (Portal)</h3>
                  <p className="text-sm mb-2">
                    When you register for a VaultScope hosting account, we process: name, email address,
                    billing address, username, and hashed password. Your email and name are used to
                    identify your account, send service communications (order confirmations, invoices,
                    service notifications), and for customer support.
                  </p>
                  <p className="text-sm mb-1">
                    <span className="text-foreground/50 font-medium">Legal basis:</span>{' '}
                    Performance of a contract (Art. 6(1)(b) GDPR).
                  </p>
                  <p className="text-sm">
                    <span className="text-foreground/50 font-medium">Retention:</span>{' '}
                    For the duration of the customer relationship and as required by applicable
                    statutory retention obligations (e.g. accounting vouchers and invoices for 8 to 10 years
                    pursuant to § 147 AO and § 14b UStG / BEG IV).
                    Account data not subject to statutory retention is deleted promptly following
                    account closure.
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">2.3 Payment Processing (Stripe)</h3>
                  <p className="text-sm mb-2">
                    Payment for hosting services is processed by Stripe (Stripe Payments Europe, Ltd. / Stripe, Inc.). During checkout, you provide
                    payment details directly to Stripe. VaultScope does not store your card number, CVV,
                    or full payment card details. VaultScope receives from Stripe: payment confirmation,
                    PaymentIntent ID, billing address, and payment status.
                    This data is used to manage billing, issue invoices, and reconcile payments.
                  </p>
                  <p className="text-sm mb-1">
                    <span className="text-foreground/50 font-medium">Legal basis:</span>{' '}
                    Performance of a contract (Art. 6(1)(b) GDPR); legal obligation for invoice
                    retention (Art. 6(1)(c) GDPR).
                  </p>
                  <p className="text-sm mb-2">
                    <span className="text-foreground/50 font-medium">Retention:</span>{' '}
                    Billing and invoice records retained for 8 to 10 years per § 147 AO and § 14b UStG (German tax law).
                  </p>
                  <p className="text-sm">
                    Stripe acts as an independent data controller for payment processing. Stripe's
                    Privacy Policy is available at{' '}
                    <a href="https://stripe.com/privacy" target="_blank" rel="noreferrer" className="text-foreground hover:underline">
                      stripe.com/privacy
                    </a>.
                    Payment data is transferred to Stripe in the USA under Standard Contractual Clauses
                    and/or the EU-US Data Privacy Framework.
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">2.4 Support Tickets</h3>
                  <p className="text-sm mb-2">
                    When you contact VaultScope support via email at{' '}
                    <a href="mailto:support@vaultscope.de" className="text-foreground hover:underline">
                      support@vaultscope.de
                    </a>{' '}
                    or via the ticket system in the customer portal, we process your name, email address,
                    account details, and the content of your support request. This data is used solely
                    to resolve your support enquiry and maintain a record of support interactions.
                  </p>
                  <p className="text-sm mb-1">
                    <span className="text-foreground/50 font-medium">Legal basis:</span>{' '}
                    Performance of a contract (Art. 6(1)(b) GDPR); legitimate interest in maintaining
                    service quality records (Art. 6(1)(f) GDPR).
                  </p>
                  <p className="text-sm">
                    <span className="text-foreground/50 font-medium">Retention:</span>{' '}
                    Support tickets are retained for a reasonable period after resolution, and deleted
                    when no longer necessary or upon account closure.
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">2.5 General Email Contact</h3>
                  <p className="text-sm mb-2">
                    If you contact VaultScope by email outside the support system, we process your
                    email address and the contents of your message for the purpose of responding
                    to your enquiry.
                  </p>
                  <p className="text-sm mb-1">
                    <span className="text-foreground/50 font-medium">Legal basis:</span>{' '}
                    Legitimate interest (Art. 6(1)(f) GDPR).
                  </p>
                  <p className="text-sm">
                    <span className="text-foreground/50 font-medium">Retention:</span>{' '}
                    Only as long as necessary to fulfil the purpose.
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">2.6 Address Autocomplete &amp; EU VIES VAT Verification</h3>
                  <p className="text-sm mb-2">
                    During registration, typing into the address input optionally queries OpenStreetMap Nominatim
                    (<code className="font-mono text-xs">nominatim.openstreetmap.org</code>) and Komoot Photon
                    (<code className="font-mono text-xs">photon.komoot.io</code>) with the partial address query and your
                    IP address to suggest matching street addresses. If you verify an EU VAT ID in your profile, our backend
                    queries the European Commission VIES REST API (<code className="font-mono text-xs">ec.europa.eu</code>)
                    with the entered VAT number.
                  </p>
                  <p className="text-sm">
                    <span className="text-foreground/50 font-medium">Legal basis:</span>{' '}
                    Pre-contractual measures and contract performance (Art. 6(1)(b) GDPR) as well as legitimate interest in
                    accurate billing data (Art. 6(1)(f) GDPR).
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">2.7 Newsletter &amp; Launch Waitlist</h3>
                  <p className="text-sm mb-2">
                    If you subscribe to the VaultScope waitlist or newsletter, we process your name (optional) and email address
                    for the purpose of notifying you about service availability and product updates.
                    Subscriptions are managed using Listmonk, a self-hosted mailing list platform
                    operated by VaultScope at{' '}
                    <a href="https://sub.vaultscope.de" target="_blank" rel="noreferrer" className="text-foreground hover:underline">
                      sub.vaultscope.de
                    </a>
                    . Subscription uses double opt-in: you must confirm your email address before
                    being added to the list.
                  </p>
                  <p className="text-sm mb-1">
                    <span className="text-foreground/50 font-medium">Legal basis:</span>{' '}
                    Consent (Art. 6(1)(a) GDPR). You may withdraw consent at any time by clicking
                    the unsubscribe link in any email, or by contacting us at{' '}
                    <a href="mailto:administration@vaultscope.de" className="text-foreground hover:underline">administration@vaultscope.de</a>.
                  </p>
                  <p className="text-sm">
                    <span className="text-foreground/50 font-medium">Retention:</span>{' '}
                    Deleted promptly on unsubscribe or on request.
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">2.8 Portal Authentication &amp; Browser Storage (Local / Session Storage)</h3>
                  <p className="text-sm mb-2">
                    Our websites and customer portal use technically necessary browser storage (<code className="font-mono bg-foreground/5 px-1.5 py-0.5 text-xs text-foreground/70">localStorage</code> and{' '}
                    <code className="font-mono bg-foreground/5 px-1.5 py-0.5 text-xs text-foreground/70">sessionStorage</code>) for UI preferences and authenticated portal sessions:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/70">
                    <li><code className="font-mono text-xs">vs-theme</code> (<code className="font-mono text-xs">localStorage</code>): stores your dark/light theme preference locally.</li>
                    <li><code className="font-mono text-xs">vs_token</code>, <code className="font-mono text-xs">vs_claims</code>, <code className="font-mono text-xs">vs_user_name</code>, <code className="font-mono text-xs">vs_username</code> (<code className="font-mono text-xs">localStorage</code>): store your authenticated session JWT and basic display identity when you log into the customer portal, and <code className="font-mono text-xs">vs_token</code> is sent with API requests to authenticate your session.</li>
                    <li><code className="font-mono text-xs">vs_quick_nav</code> (<code className="font-mono text-xs">localStorage</code>): stores your customized dashboard quick-navigation shortcuts.</li>
                    <li><code className="font-mono text-xs">vs_redirect</code> &amp; <code className="font-mono text-xs">chunk_reload_triggered</code> (<code className="font-mono text-xs">sessionStorage</code>): preserve post-login navigation targets and asset reload protection during your browser tab session.</li>
                  </ul>
                  <p className="text-sm mt-2">
                    <span className="text-foreground/50 font-medium">Legal basis:</span>{' '}
                    Strictly necessary for the requested service (§ 25 Abs. 2 Nr. 2 TDDDG; Art. 6(1)(b) and Art. 6(1)(f) GDPR).
                  </p>
                </div>

              </div>
            </div>

            {/* 3. Analytics */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">3. Analytics and Tracking</h2>
              <p className="text-sm">
                VaultScope does not use third-party analytics services, tracking pixels, fingerprinting,
                or advertising technology on its websites or customer portal. No personal data is shared
                with advertising networks, data brokers, or analytics providers.
              </p>
            </div>

            {/* 4. Cookies */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">4. Cookies &amp; Technically Necessary Storage</h2>
              <p className="text-sm mb-4">
                The public-facing VaultScope websites (vaultscope.de, pegasusbot.app) do not set marketing or analytics cookies.
                UI theme preferences are stored in browser local storage (see section 2.8).
              </p>
              <p className="text-sm">
                When interacting with the API or logging into the VaultScope customer portal, technically necessary CSRF protection
                tokens/cookies and browser storage entries (section 2.8) are used exclusively to secure requests and maintain
                your authenticated session. These strictly necessary mechanisms do not require prior cookie consent under § 25 Abs. 2 Nr. 2 TDDDG
                and are cleared when you sign out or when your session expires.
              </p>
            </div>

            {/* 5. Third-Party Services */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">5. Third-Party Services and Links</h2>
              <p className="text-sm mb-4">
                Our websites link to third-party services including GitHub and the VaultScope status
                page at{' '}
                <a href="https://status.vaultscope.de/status/vs" target="_blank" rel="noreferrer" className="text-foreground hover:underline">
                  status.vaultscope.de
                </a>
                . When you access these services, their own privacy policies apply. VaultScope is not
                responsible for the data practices of third-party services.
              </p>
              <p className="text-sm">
                The status page is operated by VaultScope using Uptime Kuma (self-hosted). Access log
                data may be recorded under the same terms as section 2.1.
              </p>
            </div>

            {/* 6. Sub-processors */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">6. Sub-processors</h2>
              <p className="text-sm mb-5">
                VaultScope engages the following sub-processors for the delivery of its services.
                Each is subject to a data processing agreement and applicable data protection obligations.
              </p>
              <div className="border-t border-b border-border divide-y divide-border">
                <div className="grid grid-cols-3">
                  {['Sub-processor', 'Role', 'Transfer mechanism'].map((h) => (
                    <div key={h} className="py-3 pr-4 text-xs font-medium text-foreground/40 uppercase tracking-widest">
                      {h}
                    </div>
                  ))}
                </div>
                {SUB_PROCESSORS.map((sp) => (
                  <div key={sp.name} className="grid grid-cols-3">
                    <div className="py-4 pr-4 text-sm font-medium text-foreground/70">{sp.name}</div>
                    <div className="py-4 pr-4 text-sm text-foreground/60">{sp.role}</div>
                    <div className="py-4 text-sm text-foreground/60">{sp.transfer}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm mt-4">
                VaultScope does not sell, rent, or trade personal data. Data is only shared with
                sub-processors as described above, or where required by applicable law.
              </p>
            </div>

            {/* 7. Retention */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">7. Data Retention</h2>
              <p className="text-sm mb-4">
                Personal data is retained only as long as necessary for the purpose for which it was
                collected or as required by applicable statutory obligations:
              </p>
              <ul className="flex flex-col gap-3 text-sm">
                {[
                  'Account data: retained for the duration of the customer relationship and deleted promptly after account closure, subject to statutory retention requirements.',
                  'Billing and invoice records: retained for 8 to 10 years pursuant to § 147 AO and § 14b UStG (German fiscal retention obligations under BEG IV).',
                  'Server and access logs: short period for operational security; subsequently deleted or anonymised.',
                  'Support tickets: retained for a reasonable period after resolution; deleted when no longer necessary.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 8. Your Rights */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">8. Your Rights Under the GDPR</h2>
              <p className="text-sm mb-6">
                As a data subject, you have the following rights in relation to your personal data:
              </p>
              <div className="flex flex-col gap-5">
                {GDPR_RIGHTS.map((item) => (
                  <div key={item.title} className="border-l border-foreground/10 pl-6">
                    <p className="text-sm font-medium text-foreground/80 mb-1">{item.title}</p>
                    <p className="text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm mt-6">
                To exercise any of these rights, contact our Data Protection Officer (Anton Schmidt) at{' '}
                <a href="mailto:data@vaultscope.de" className="text-foreground hover:underline">data@vaultscope.de</a>{' '}
                or{' '}
                <a href="mailto:administration@vaultscope.de" className="text-foreground hover:underline">administration@vaultscope.de</a>.
                We will respond within one month as required by Art. 12 GDPR. We may ask you to verify
                your identity before processing your request.
              </p>
            </div>

            {/* 9. Supervisory Authority */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">9. Right to Lodge a Complaint</h2>
              <p className="text-sm mb-5">
                If you believe that our processing of your personal data infringes the GDPR, you have
                the right to lodge a complaint with the competent supervisory authority:
              </p>
              <div className="border-l-2 border-[var(--accent)] pl-6 py-1 text-sm leading-7">
                <p className="font-medium text-foreground">
                  Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg
                </p>
                <p>Königstraße 10a</p>
                <p>70173 Stuttgart</p>
                <p>Germany</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <a href="https://www.baden-wuerttemberg.datenschutz.de" target="_blank" rel="noreferrer" className="text-foreground hover:underline">
                    www.baden-wuerttemberg.datenschutz.de
                  </a>
                </div>
              </div>
              <p className="text-sm mt-4">
                You may also lodge a complaint with the supervisory authority in the EU member state
                of your habitual residence or place of work.
              </p>
            </div>

            {/* 10. Changes */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">10. Changes to This Policy</h2>
              <p className="text-sm">
                This Privacy Policy may be updated from time to time. The date at the top of this page
                indicates when it was last revised. Where changes are material, we will take reasonable
                steps to bring them to your attention, including by notifying registered customers by email.
              </p>
            </div>

          </div>
      </LegalDocumentLayout>
    </div>
  );
};
