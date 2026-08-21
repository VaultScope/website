import { useEffect } from 'react';
import { PageHero } from '../components/Shared';

export const Aup = () => {
  useEffect(() => {
    document.title = "Acceptable Use Policy — VaultScope";
  }, []);

  return (
    <div className="flex flex-col w-full">
      <PageHero
        title="Acceptable Use Policy"
        description="Rules governing what may and may not be done on VaultScope infrastructure."
        align="left"
      />

      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="flex flex-col gap-16 text-foreground/70 font-light leading-relaxed">

            <div>
              <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-3">Version</div>
              <p className="text-sm text-foreground/50">Last updated: August 2026</p>
              <p className="text-sm mt-4">
                This Acceptable Use Policy ("AUP") applies to all customers using VaultScope hosting
                services, including Cloud VPS and Dedicated Server products. It forms part of the
                contract between you and VaultScope. By using VaultScope services, you agree to this AUP.
              </p>
              <p className="text-sm mt-3">
                VaultScope's infrastructure is provided via OVH SAS. Your use must comply with both
                this AUP and OVH's own acceptable use policies, which are incorporated by reference.
                In the event of conflict, the more restrictive policy applies.
              </p>
            </div>

            {/* 1. Permitted Use */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">1. Permitted Use</h2>
              <p className="text-sm mb-4">VaultScope services may be used for lawful purposes including:</p>
              <ul className="flex flex-col gap-3 text-sm">
                {[
                  'Hosting websites, web applications, APIs, and online services',
                  'Running development, staging, and production environments',
                  'Operating databases, application backends, and storage systems',
                  'Self-hosting open-source software and personal projects',
                  'Operating business applications, tools, and internal services',
                  'Any other lawful activity consistent with this AUP',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Prohibited Content */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">2. Prohibited Content</h2>
              <p className="text-sm mb-4">
                The following content is strictly prohibited on VaultScope infrastructure. This list
                is not exhaustive.
              </p>
              <div className="flex flex-col gap-5">

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                    Child Sexual Abuse Material (CSAM)
                  </h3>
                  <p className="text-sm">
                    Any depiction, distribution, or facilitation of child sexual abuse material
                    is absolutely prohibited and will result in immediate termination and reporting
                    to relevant law enforcement authorities without prior notice.
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                    Illegal Content
                  </h3>
                  <p className="text-sm">
                    Content that is illegal under German law, EU law, or the laws of the jurisdiction
                    where the content is accessed, including content that incites hatred, violence, or
                    discrimination; glorifies or promotes terrorism; or violates rights of third parties.
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                    Copyright-Infringing Content
                  </h3>
                  <p className="text-sm">
                    Content that infringes the intellectual property rights of any third party,
                    including pirated software, media, or other protected works. VaultScope will
                    respond to valid takedown notices as described in section 5.
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                    Malware and Harmful Code
                  </h3>
                  <p className="text-sm">
                    Viruses, trojans, ransomware, spyware, adware, phishing pages, credential
                    harvesting sites, or any other malicious or deceptive content.
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                    Illegal Gambling
                  </h3>
                  <p className="text-sm">
                    Online gambling services that are not properly licensed in the relevant
                    jurisdiction, or that target jurisdictions where they are prohibited.
                  </p>
                </div>

              </div>
            </div>

            {/* 3. Prohibited Activities */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">3. Prohibited Activities</h2>

              <div className="flex flex-col gap-5">

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                    Network Attacks
                  </h3>
                  <p className="text-sm">
                    Distributed denial of service (DDoS) attacks, port scanning without authorisation,
                    intrusion attempts, packet flooding, or any other action that degrades or disrupts
                    the operation of networks, systems, or services belonging to VaultScope, OVH, or
                    any third party.
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                    Spam and Unsolicited Email
                  </h3>
                  <p className="text-sm">
                    Sending unsolicited bulk email (spam), operating open mail relays, or any
                    activity that causes VaultScope IP addresses to be listed on spam blacklists.
                    Email marketing is only permitted where recipients have given verifiable prior
                    consent.
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                    Botnets and Command-and-Control
                  </h3>
                  <p className="text-sm">
                    Operating botnet infrastructure, command-and-control servers, or any system
                    designed to remotely control compromised third-party machines.
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                    Resource Abuse
                  </h3>
                  <p className="text-sm">
                    Using resources in a manner that disproportionately impacts shared infrastructure
                    or other customers, including sustained high CPU, memory, or network utilisation
                    beyond what is reasonable for the service tier purchased. Cryptocurrency mining
                    is only permitted on Dedicated Server products where the customer has exclusive
                    access to all resources.
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                    Fraudulent and Deceptive Activities
                  </h3>
                  <p className="text-sm">
                    Phishing, identity theft, financial fraud, fake stores, scam operations, or
                    any other deceptive practice targeting third parties.
                  </p>
                </div>

                <div className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                    Proxy Abuse and Anonymisation for Prohibited Activity
                  </h3>
                  <p className="text-sm">
                    Operating open proxies or anonymisation services specifically for the purpose
                    of circumventing this AUP or applicable law. General-purpose VPN or proxy
                    services are permitted where they do not facilitate prohibited activities.
                  </p>
                </div>

              </div>
            </div>

            {/* 4. Network and Resource Policy */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">4. Network and Resource Policy</h2>
              <ul className="flex flex-col gap-3 text-sm">
                {[
                  'Customers are responsible for securing their own servers and services. Unpatched systems that are actively exploited to harm third parties may be suspended without prior notice.',
                  'Customers must not use VaultScope services to probe, scan, or test the vulnerability of systems or networks they do not own or do not have explicit permission to test.',
                  'Network traffic that causes significant disruption to other customers or to OVH infrastructure may be rate-limited, filtered, or blocked without prior notice.',
                  'IP address allocations are provided for use with VaultScope services only and may not be sub-allocated to third parties without prior written consent from VaultScope.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 5. Copyright and DMCA */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">5. Copyright and Takedown Notices</h2>
              <p className="text-sm mb-4">
                VaultScope respects intellectual property rights. If you believe content hosted on
                VaultScope infrastructure infringes your copyright, send a notice to{' '}
                <a href="mailto:cptcr@proton.me" className="text-foreground hover:underline">
                  cptcr@proton.me
                </a>{' '}
                including:
              </p>
              <ul className="flex flex-col gap-3 text-sm mb-4">
                {[
                  'Identification of the copyrighted work claimed to be infringed',
                  'Identification of the infringing material and its location (URL or IP address)',
                  'Your contact information (name, address, email)',
                  'A statement that you have a good-faith belief that the use is not authorised by the copyright owner, its agent, or the law',
                  'A statement that the information in the notice is accurate and, under penalty of perjury, that you are authorised to act on behalf of the copyright owner',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm">
                VaultScope will investigate valid notices and take appropriate action, which may include
                removal of content or suspension of the responsible customer's service.
              </p>
            </div>

            {/* 6. Reporting Abuse */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">6. Reporting Abuse</h2>
              <p className="text-sm">
                To report abuse, spam, network attacks, or other AUP violations originating from
                VaultScope infrastructure, contact{' '}
                <a href="mailto:cptcr@proton.me" className="text-foreground hover:underline">
                  cptcr@proton.me
                </a>{' '}
                with as much detail as possible including relevant IP addresses, timestamps, and
                evidence of the violation. VaultScope will investigate all credible reports and
                respond within a reasonable time.
              </p>
            </div>

            {/* 7. Enforcement */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">7. Enforcement</h2>
              <p className="text-sm mb-4">
                Violations of this AUP may result in one or more of the following actions at
                VaultScope's discretion:
              </p>
              <ul className="flex flex-col gap-3 text-sm mb-4">
                {[
                  'A formal warning and request to remedy the violation',
                  'Temporary suspension of the affected service',
                  'Permanent termination of service without refund',
                  'Reporting to relevant law enforcement authorities',
                  'Legal action where applicable',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm">
                In cases involving illegal content, active network attacks, or CSAM, VaultScope
                reserves the right to suspend services immediately and without prior notice.
                For other violations, VaultScope will generally attempt to notify the customer
                and allow a reasonable opportunity to remedy the situation before taking action.
              </p>
            </div>

            {/* 8. Changes */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">8. Changes to This Policy</h2>
              <p className="text-sm">
                VaultScope may update this AUP at any time. Customers will be notified of material
                changes. Continued use of VaultScope services following notification of changes
                constitutes acceptance of the updated AUP.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
