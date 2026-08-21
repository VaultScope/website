import { useEffect } from 'react';
import { PageHero } from '../components/Shared';
import { Link } from 'react-router-dom';

export const Dpa = () => {
  useEffect(() => {
    document.title = "Data Processing Agreement — VaultScope";
  }, []);

  return (
    <div className="flex flex-col w-full">
      <PageHero
        title="Data Processing Agreement"
        description="Auftragsverarbeitungsvertrag pursuant to Art. 28 GDPR between VaultScope and hosting customers."
        align="left"
      />

      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="flex flex-col gap-16 text-foreground/70 font-light leading-relaxed">

            <div>
              <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-3">Version</div>
              <p className="text-sm text-foreground/50">Last updated: August 2026</p>
              <p className="text-sm mt-4">
                This Data Processing Agreement ("DPA") is entered into between VaultScope
                (as Processor) and each customer using VaultScope hosting services who processes
                personal data on VaultScope infrastructure (as Controller), pursuant to
                Art. 28 of the General Data Protection Regulation (GDPR) (EU) 2016/679.
              </p>
              <p className="text-sm mt-3">
                By using VaultScope hosting services, the Customer accepts this DPA as part
                of the contract as described in the{' '}
                <Link to="/hosting-terms" className="text-foreground hover:underline">
                  Hosting Terms
                </Link>
                . This DPA takes effect on the date the hosting service commences.
              </p>
              <div className="border border-border p-6 mt-5 text-sm">
                <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-4">
                  Parties
                </p>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="font-medium text-foreground mb-2">Processor</p>
                    <p>Anton Schmidt</p>
                    <p>VaultScope (Einzelunternehmen)</p>
                    <p>Gottlob-Spieß-Straße 2</p>
                    <p>74343 Sachsenheim, Germany</p>
                    <p className="mt-2">
                      <a href="mailto:cptcr@proton.me" className="text-foreground hover:underline">
                        cptcr@proton.me
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-2">Controller</p>
                    <p>The Customer as identified in the hosting service account.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 1. Subject Matter */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
                1. Subject Matter and Duration
              </h2>
              <p className="text-sm mb-4">
                VaultScope processes personal data on behalf of the Customer solely in connection
                with the provision of Cloud VPS and Dedicated Server hosting services. The DPA
                remains in force for the duration of the hosting service contract and terminates
                automatically when all services under the contract have ended.
              </p>
              <p className="text-sm">
                VaultScope processes personal data only on documented instructions from the
                Controller (the Customer), as set out in this DPA and the Hosting Terms, or as
                required by applicable EU or Member State law.
              </p>
            </div>

            {/* 2. Nature and Purpose */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
                2. Nature and Purpose of Processing
              </h2>
              <p className="text-sm mb-4">
                The nature and purpose of the processing is the provision of server infrastructure
                (virtual and physical) on which the Controller may store, transmit, and process
                data of their choice. VaultScope does not access, inspect, or process the content
                of data stored on customer servers except:
              </p>
              <ul className="flex flex-col gap-3 text-sm">
                {[
                  'Where required to perform infrastructure maintenance, resolve technical issues, or respond to security incidents affecting the infrastructure.',
                  'Where required by applicable law or a binding order from a competent authority.',
                  'Where the Customer has explicitly requested assistance that requires access.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Data and Data Subjects */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
                3. Types of Personal Data and Categories of Data Subjects
              </h2>
              <p className="text-sm mb-4">
                The types of personal data and categories of data subjects are determined entirely
                by the Controller. VaultScope does not specify or restrict the types of personal
                data the Controller may process on the infrastructure, subject to compliance with
                the{' '}
                <Link to="/aup" className="text-foreground hover:underline">
                  Acceptable Use Policy
                </Link>{' '}
                and applicable law.
              </p>
              <p className="text-sm">
                VaultScope processes the following personal data for account management purposes
                as a data controller (not processor): Customer name, email address, billing
                address, and payment records. This processing is described in the{' '}
                <Link to="/privacy" className="text-foreground hover:underline">Privacy Policy</Link>.
              </p>
            </div>

            {/* 4. Processor Obligations */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
                4. Obligations of VaultScope (Processor)
              </h2>
              <div className="flex flex-col gap-5 text-sm">
                {[
                  { title: 'Confidentiality', body: 'VaultScope ensures that persons authorised to process personal data on its behalf are bound by appropriate confidentiality obligations. VaultScope does not disclose customer data to third parties except as required by law or as described in this DPA.' },
                  { title: 'Processing on Instructions', body: "VaultScope processes personal data only on the Controller's documented instructions. Where VaultScope is required by applicable law to process data beyond these instructions, VaultScope will inform the Controller before processing, unless prohibited by law." },
                  { title: 'Security Measures', body: 'VaultScope implements and maintains technical and organisational security measures as described in section 8 of this DPA, appropriate to the risks associated with hosting infrastructure.' },
                  { title: 'Assistance with Data Subject Rights', body: "VaultScope will, taking into account the nature of the processing, assist the Controller in fulfilling its obligations to respond to requests from data subjects exercising their rights under GDPR (Arts. 15–22), to the extent this is within VaultScope's ability as infrastructure provider." },
                  { title: 'Assistance with Security Obligations', body: "VaultScope will assist the Controller in ensuring compliance with Arts. 32–36 GDPR (security, breach notification, impact assessments) taking into account the nature of the processing and information available to VaultScope." },
                  { title: 'Deletion', body: 'Upon termination of the hosting service, VaultScope will delete all data stored on the Customer\'s server infrastructure promptly, as described in section 9 of this DPA and in the Hosting Terms.' },
                  { title: 'Audit Rights', body: 'VaultScope will make available all information necessary to demonstrate compliance with Art. 28 GDPR and will allow for and contribute to audits conducted by the Controller or a third-party auditor mandated by the Controller, subject to reasonable prior notice and agreed scope.' },
                ].map((item) => (
                  <div key={item.title} className="border-l border-foreground/10 pl-6">
                    <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                      {item.title}
                    </h3>
                    <p>{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Sub-processors */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">5. Sub-processors</h2>
              <p className="text-sm mb-5">
                The Controller authorises VaultScope to engage the following sub-processors.
                VaultScope ensures that each sub-processor is bound by data protection obligations
                equivalent to those in this DPA.
              </p>
              <div className="border border-border overflow-hidden">
                <div className="grid grid-cols-3 border-b border-border bg-foreground/[0.02]">
                  <div className="px-5 py-3 text-xs font-medium text-foreground/40 uppercase tracking-widest">Sub-processor</div>
                  <div className="px-5 py-3 text-xs font-medium text-foreground/40 uppercase tracking-widest border-l border-border">Role</div>
                  <div className="px-5 py-3 text-xs font-medium text-foreground/40 uppercase tracking-widest border-l border-border">Location</div>
                </div>
                <div className="grid grid-cols-3 border-b border-border">
                  <div className="px-5 py-4 text-sm text-foreground/70">OVH SAS</div>
                  <div className="px-5 py-4 text-sm text-foreground/70 border-l border-border">Server infrastructure and hosting</div>
                  <div className="px-5 py-4 text-sm text-foreground/70 border-l border-border">European Union</div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="px-5 py-4 text-sm text-foreground/70">Stripe, Inc.</div>
                  <div className="px-5 py-4 text-sm text-foreground/70 border-l border-border">Payment processing (billing data only)</div>
                  <div className="px-5 py-4 text-sm text-foreground/70 border-l border-border">USA (SCCs / EU-US DPF)</div>
                </div>
              </div>
              <p className="text-sm mt-5">
                VaultScope will notify the Controller of any intended changes to sub-processors
                (addition or replacement) by updating this page with at least 14 days' notice.
                The Controller has the right to object to such changes. If the Controller objects
                and no reasonable alternative can be found, either party may terminate the
                affected services with 30 days' notice.
              </p>
            </div>

            {/* 6. International Transfers */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
                6. International Data Transfers
              </h2>
              <p className="text-sm mb-4">
                Server infrastructure (OVH) is located within the European Union. No transfer of
                data stored on customer servers to countries outside the EEA occurs through OVH.
              </p>
              <p className="text-sm">
                Stripe is located in the United States. Payment processing data (billing records)
                is transferred to Stripe under Standard Contractual Clauses (SCCs) adopted pursuant
                to Commission Decision 2021/914 and/or the EU-US Data Privacy Framework (DPF),
                as applicable. VaultScope maintains and can provide documentation of the applicable
                transfer mechanism upon request.
              </p>
            </div>

            {/* 7. Controller Obligations */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
                7. Obligations of the Controller (Customer)
              </h2>
              <ul className="flex flex-col gap-3 text-sm">
                {[
                  'The Controller is responsible for ensuring that all personal data processing carried out on VaultScope infrastructure has a lawful basis under GDPR.',
                  'The Controller must ensure that data subjects have been informed about the processing in accordance with Arts. 13 and 14 GDPR where applicable.',
                  'The Controller is responsible for implementing appropriate access controls and security measures within their own server environment.',
                  'The Controller must promptly inform VaultScope of any instructions that may conflict with applicable data protection law.',
                  'The Controller must ensure that any special categories of personal data (Art. 9 GDPR) processed on VaultScope infrastructure are handled in compliance with applicable requirements.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 8. Security Measures */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
                8. Technical and Organisational Security Measures
              </h2>
              <p className="text-sm mb-4">
                VaultScope implements the following measures at the infrastructure level:
              </p>
              <ul className="flex flex-col gap-3 text-sm">
                {[
                  'Physical security of server infrastructure is maintained by OVH in accordance with OVH\'s security certifications.',
                  'Network-level isolation between customer instances.',
                  'Access to customer server environments is restricted; VaultScope staff do not access customer data except in the circumstances described in section 2.',
                  'Internal access to management systems is limited to authorised personnel.',
                  'Monitoring of infrastructure availability and security events.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm mt-4">
                The Controller is responsible for implementing appropriate security measures
                within their own server environment, including OS hardening, application
                security, encryption of sensitive data at rest, and access control.
              </p>
            </div>

            {/* 9. Breach Notification */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
                9. Personal Data Breach Notification
              </h2>
              <p className="text-sm">
                VaultScope will notify the Controller without undue delay, and in any event within
                72 hours of becoming aware, of any personal data breach affecting data processed
                on the Controller's behalf, to the extent that VaultScope is able to identify such
                a breach. Notification will be sent to the email address registered on the
                Customer's account and will include, to the extent known, the nature of the breach,
                categories and approximate number of individuals concerned, likely consequences,
                and measures taken or proposed.
              </p>
            </div>

            {/* 10. Deletion */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
                10. Deletion of Data
              </h2>
              <p className="text-sm">
                Upon termination of the hosting service, VaultScope will delete all data on the
                Customer's server infrastructure promptly. The Controller is responsible for
                exporting any data required before the service end date. VaultScope is not
                obligated to retain data after service termination except where required by
                applicable law (e.g. accounting records).
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
