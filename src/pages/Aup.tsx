import { useEffect } from 'react';
import { PageHero, LegalDocumentLayout } from '../components/Shared';
import { SeoHead } from '../components/SeoHead';
import { useLanguage } from '../i18n';
import { LocaleLink as Link } from '../i18n/LocaleLink';

export const Aup = () => {
  const { locale } = useLanguage();
  const isDe = locale === 'de';
  const title = isDe
    ? 'Nutzungsrichtlinie (Acceptable Use Policy) — VaultScope'
    : 'Acceptable Use Policy — VaultScope';

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="flex flex-col w-full">
      <SeoHead
        title={isDe ? 'Nutzungsrichtlinie (AUP)' : 'Acceptable Use Policy'}
        description={
          isDe
            ? 'Regeln zur zulässigen Nutzung der VaultScope-Infrastruktur sowie Notice-and-Action-Verfahren gemäß Art. 16 DSA.'
            : 'Rules governing acceptable activities on VaultScope infrastructure and notice-and-action procedures under DSA Art. 16.'
        }
        path={isDe ? '/de/legal/aup' : '/legal/aup'}
      />

      <PageHero
        title={isDe ? 'Nutzungsrichtlinie (AUP)' : 'Acceptable Use Policy'}
        description={
          isDe
            ? 'Verbindliche Regeln für zulässige und verbotene Nutzungen auf der Infrastruktur von VaultScope.'
            : 'Rules governing what may and may not be done on VaultScope infrastructure.'
        }
        align="left"
      />

      <LegalDocumentLayout>
        <div className="flex flex-col gap-16 text-[var(--text-muted)] leading-relaxed">

          <div>
            <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-3">
              {isDe ? 'Stand' : 'Version'}
            </div>
            <p className="text-sm text-foreground/50">
              {isDe ? 'Zuletzt aktualisiert: November 2026' : 'Last updated: November 2026'}
            </p>
            <p className="text-sm mt-4">
              {isDe
                ? 'Diese Acceptable Use Policy („AUP“) gilt für alle Kunden, die Infrastrukturdienste von VaultScope (Cloud VPS, Dedizierte Server, SFTP Storage und One-Click Deploy) nutzen, und ist Bestandteil des Vertragsverhältnisses.'
                : 'This Acceptable Use Policy ("AUP") applies to all customers using VaultScope infrastructure services, including Cloud VPS, Dedicated Server, SFTP Storage, and One-Click Deploy (OCD) products, and forms part of the contract between you and VaultScope.'}
            </p>
            <p className="text-sm mt-3">
              {isDe
                ? 'Die Infrastruktur wird teilweise über vorgelagerte Infrastrukturpartner (insbesondere Hetzner Online GmbH, OVH SAS sowie je nach gebuchtem Dedicated-Tarif ReliableSite.net LLC) bereitgestellt. Die Nutzung muss sowohl dieser AUP als auch den jeweiligen Nutzungsbedingungen der vorgelagerten Partner entsprechen; im Konfliktfall gilt die strengere Regelung.'
                : "VaultScope's infrastructure is operated on upstream partners (including Hetzner Online GmbH, OVH SAS, and, for applicable dedicated server plans, ReliableSite.net LLC). Your use must comply with both this AUP and the applicable upstream provider acceptable use policies. In the event of conflict, the more restrictive policy applies."}
            </p>
          </div>

          {/* 1. Permitted Use */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '1. Zulässige Nutzung' : '1. Permitted Use'}
            </h2>
            <p className="text-sm mb-4">
              {isDe
                ? 'VaultScope-Dienste dürfen für alle rechtmäßigen Zwecke genutzt werden, insbesondere:'
                : 'VaultScope services may be used for lawful purposes including:'}
            </p>
            <ul className="flex flex-col gap-3 text-sm">
              {(isDe
                ? [
                    'Hosting von Websites, Webanwendungen, APIs und Online-Diensten',
                    'Betrieb von Entwicklungs-, Staging- und Produktionsumgebungen',
                    'Betrieb von Datenbanken, Backends und verschlüsselten SFTP-Storage-Workflows',
                    'Self-Hosting von Open-Source-Software und persönlichen Projekten',
                    'Betrieb geschäftlicher Anwendungen, Tools und interner Systeme',
                    'Jede sonstige rechtmäßige Nutzung im Einklang mit dieser AUP',
                  ]
                : [
                    'Hosting websites, web applications, APIs, and online services',
                    'Running development, staging, and production environments',
                    'Operating databases, application backends, and encrypted SFTP storage workflows',
                    'Self-hosting open-source software and personal projects',
                    'Operating business applications, tools, and internal services',
                    'Any other lawful activity consistent with this AUP',
                  ]
              ).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Prohibited Content */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '2. Verbotene Inhalte' : '2. Prohibited Content'}
            </h2>
            <p className="text-sm mb-4">
              {isDe
                ? 'Die folgenden Inhalte sind auf der Infrastruktur von VaultScope strengstens untersagt (nicht abschließende Aufzählung):'
                : 'The following content is strictly prohibited on VaultScope infrastructure (non-exhaustive list):'}
            </p>
            <div className="flex flex-col gap-5">
              {(isDe
                ? [
                    {
                      title: 'Darstellungen sexuellen Missbrauchs von Kindern (CSAM)',
                      body: 'Jegliche Darstellung, Verbreitung oder Ermöglichung von CSAM ist absolut verboten und führt zur sofortigen fristlosen Kündigung sowie zur Meldung an die zuständigen Strafverfolgungsbehörden.',
                    },
                    {
                      title: 'Rechtswidrige Inhalte',
                      body: 'Inhalte, die nach deutschem Recht, EU-Recht oder dem Recht des Zielstaates rechtswidrig sind, einschließlich Volksverhetzung, Gewaltverherrlichung, Terrorismusförderung oder Verletzung von Rechten Dritter.',
                    },
                    {
                      title: 'Urheberrechtsverletzende Inhalte',
                      body: 'Inhalte, die geistige Eigentumsrechte Dritter verletzen (z. B. Raubkopien, unlizenzierte Medien). VaultScope reagiert auf berechtigte Meldungen gemäß Abschnitt 5.',
                    },
                    {
                      title: 'Malware und Schadsoftware',
                      body: 'Viren, Trojaner, Ransomware, Spyware, Phishing-Seiten, Credential-Harvesting oder sonstige täuschende bzw. schädliche Inhalte.',
                    },
                    {
                      title: 'Illegales Glücksspiel',
                      body: 'Online-Glücksspielangebote ohne erforderliche behördliche Erlaubnis oder in Jurisdiktionen, in denen sie untersagt sind.',
                    },
                  ]
                : [
                    {
                      title: 'Child Sexual Abuse Material (CSAM)',
                      body: 'Any depiction, distribution, or facilitation of child sexual abuse material is absolutely prohibited and will result in immediate termination and reporting to relevant law enforcement authorities without prior notice.',
                    },
                    {
                      title: 'Illegal Content',
                      body: 'Content that is illegal under German law, EU law, or the laws of the jurisdiction where the content is accessed, including content that incites hatred, violence, or discrimination; glorifies or promotes terrorism; or violates third-party rights.',
                    },
                    {
                      title: 'Copyright-Infringing Content',
                      body: 'Content that infringes intellectual property rights of any third party, including pirated software or media. VaultScope responds to valid notices as described in section 5.',
                    },
                    {
                      title: 'Malware and Harmful Code',
                      body: 'Viruses, trojans, ransomware, spyware, phishing pages, credential harvesting sites, or any other malicious or deceptive content.',
                    },
                    {
                      title: 'Illegal Gambling',
                      body: 'Online gambling services that are not properly licensed in the relevant jurisdiction or target jurisdictions where they are prohibited.',
                    },
                  ]
              ).map((item) => (
                <div key={item.title} className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Prohibited Activities */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '3. Verbotene Aktivitäten' : '3. Prohibited Activities'}
            </h2>
            <div className="flex flex-col gap-5">
              {(isDe
                ? [
                    {
                      title: 'Netzwerkangriffe',
                      body: 'DDoS-Angriffe, unautorisierte Portscans, Einbruchsversuche, Packet Flooding oder sonstige Maßnahmen, die Systeme oder Netze von VaultScope, unseren Upstream-Partnern (z. B. Hetzner, OVH, ReliableSite) oder Dritten stören.',
                    },
                    {
                      title: 'Spam und unerwünschte E-Mails',
                      body: 'Versand unaufgeforderter Massen-E-Mails (Spam), Betrieb offener Mail-Relays oder Aktivitäten, die zu Blacklist-Einträgen von VaultScope-IP-Adressen führen. E-Mail-Marketing ist nur mit nachweislicher vorheriger Einwilligung zulässig.',
                    },
                    {
                      title: 'Botnets & Command-and-Control',
                      body: 'Betrieb von Botnet-Infrastruktur, C2-Servern oder Systemen zur Fernsteuerung kompromittierter Fremdsysteme.',
                    },
                    {
                      title: 'Ressourcenmissbrauch',
                      body: 'Übermäßige, andere Kunden beeinträchtigende Nutzung geteilter Ressourcen. Kryptowährungs-Mining ist ausschließlich auf dedizierten Bare-Metal-Servern mit exklusivem Hardware-Zugriff zulässig, sofern nicht vom jeweiligen Upstream-Provider untersagt.',
                    },
                    {
                      title: 'Betrug und Täuschung',
                      body: 'Phishing, Identitätsdiebstahl, Finanzbetrug, Fake-Shops oder sonstige betrügerische Aktivitäten.',
                    },
                    {
                      title: 'Missbräuchliche Proxies & Anonymisierung',
                      body: 'Betrieb offener Proxies oder Anonymisierungsdienste zum Zweck der Umgehung dieser AUP oder geltender Gesetze. Reguläre VPN-Dienste sind zulässig, sofern keine verbotenen Aktivitäten gefördert werden.',
                    },
                  ]
                : [
                    {
                      title: 'Network Attacks',
                      body: 'Distributed denial of service (DDoS) attacks, unauthorised port scanning, intrusion attempts, packet flooding, or any action disrupting networks or systems belonging to VaultScope, our upstream infrastructure providers (such as Hetzner, OVH, or ReliableSite), or third parties.',
                    },
                    {
                      title: 'Spam and Unsolicited Email',
                      body: 'Sending unsolicited bulk email (spam), operating open mail relays, or causing VaultScope IP addresses to be listed on spam blacklists. Email marketing is only permitted with verifiable prior consent.',
                    },
                    {
                      title: 'Botnets and Command-and-Control',
                      body: 'Operating botnet infrastructure, command-and-control servers, or systems designed to control compromised third-party machines.',
                    },
                    {
                      title: 'Resource Abuse',
                      body: 'Using resources in a manner that disproportionately impacts shared infrastructure or other customers. Cryptocurrency mining is only permitted on Dedicated Server products where the customer has exclusive hardware access and provided it complies with upstream provider rules.',
                    },
                    {
                      title: 'Fraudulent and Deceptive Activities',
                      body: 'Phishing, identity theft, financial fraud, fake stores, scam operations, or other deceptive practices.',
                    },
                    {
                      title: 'Proxy Abuse and Anonymisation for Prohibited Activity',
                      body: 'Operating open proxies or anonymisation services specifically to circumvent this AUP or applicable law. General-purpose VPN services are permitted where they do not facilitate prohibited activities.',
                    },
                  ]
              ).map((item) => (
                <div key={item.title} className="border-l border-foreground/10 pl-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Network and Resource Policy */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '4. Netzwerk- und Sicherheitsregeln' : '4. Network and Resource Policy'}
            </h2>
            <ul className="flex flex-col gap-3 text-sm">
              {(isDe
                ? [
                    'Kunden sind für die Absicherung ihrer eigenen Server, Dienste und Zugangsdaten verantwortlich. Aktiv ausgenutzte, ungepatchte Systeme können zum Schutz Dritter ohne Vorankündigung gesperrt werden.',
                    'Schwachstellenscans oder Penetrationstests gegen Systeme oder Netzwerke ohne ausdrückliche Berechtigung des Eigentümers sind untersagt.',
                    'Netzwerkverkehr, der andere Kunden oder die Infrastruktur von VaultScope bzw. vorgelagerter Provider erheblich beeinträchtigt, kann ohne Vorankündigung gedrosselt, gefiltert oder blockiert werden.',
                    'Zugewiesene IP-Adressen dürfen nur im Rahmen der VaultScope-Dienste genutzt und nicht ohne vorherige schriftliche Zustimmung an Dritte untervergeben werden.',
                  ]
                : [
                    'Customers are responsible for securing their own servers, software, and credentials. Unpatched systems actively exploited to harm third parties may be suspended without prior notice.',
                    'Customers must not probe, scan, or test the vulnerability of systems or networks they do not own or lack explicit permission to test.',
                    'Network traffic causing significant disruption to other customers or to VaultScope or upstream provider infrastructure may be rate-limited, filtered, or blocked without prior notice.',
                    'IP address allocations are provided for use with VaultScope services only and may not be sub-allocated to third parties without prior written consent.',
                  ]
              ).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 5. DSA Notice-and-Action */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe
                ? '5. Urheberrecht & Meldeverfahren (Art. 16 DSA / UrhG)'
                : '5. Copyright & Notice-and-Action (DSA Art. 16 / UrhG)'}
            </h2>
            <p className="text-sm mb-4">
              {isDe ? (
                <>
                  VaultScope bearbeitet Meldungen über mutmaßlich rechtswidrige oder urheberrechtsverletzende Inhalte gemäß Art. 16 des EU-Gesetzes über digitale Dienste (DSA) und dem deutschen Urheberrechtsgesetz (UrhG). Meldungen richten Sie bitte an{' '}
                  <a href="mailto:administration@vaultscope.de" className="text-foreground hover:underline">
                    administration@vaultscope.de
                  </a>{' '}
                  oder über{' '}
                  <Link to="/report/dmca" className="text-foreground hover:underline">
                    /report
                  </Link>
                  {' '}mit folgenden Angaben:
                </>
              ) : (
                <>
                  VaultScope processes notices of allegedly illegal or copyright-infringing content pursuant to Art. 16 of the EU Digital Services Act (DSA) and German copyright law (UrhG). Send notices to{' '}
                  <a href="mailto:administration@vaultscope.de" className="text-foreground hover:underline">
                    administration@vaultscope.de
                  </a>{' '}
                  or via{' '}
                  <Link to="/report/dmca" className="text-foreground hover:underline">
                    /report
                  </Link>
                  {' '}including:
                </>
              )}
            </p>
            <ul className="flex flex-col gap-3 text-sm mb-4">
              {(isDe
                ? [
                    'Hinreichend begründete Erläuterung, warum die betreffenden Informationen mutmaßlich rechtswidrig sind oder Rechte verletzen',
                    'Eindeutige Angabe des genauen elektronischen Speicherorts (URL, IP-Adresse, Zeitstempel)',
                    'Name und E-Mail-Adresse der meldenden Person oder Einrichtung',
                    'Erklärung über die nach bestem Wissen und Gewissen bestehende Überzeugung, dass die Angaben in der Meldung richtig und vollständig sind (Art. 16 Abs. 2 lit. d DSA)',
                  ]
                : [
                    'A sufficiently substantiated explanation of why the content is allegedly unlawful or infringes your copyright',
                    'Clear identification of the exact electronic location (URL, IP address, or timestamp)',
                    'Your contact information (name, email address)',
                    'A statement confirming your good-faith belief that the information and allegations contained in the notice are accurate and complete (Art. 16(2)(d) DSA)',
                  ]
              ).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm">
              {isDe
                ? 'VaultScope bestätigt den Eingang, prüft begründete Meldungen unverzüglich und informiert die betroffenen Parteien gemäß DSA über getroffene Maßnahmen.'
                : 'VaultScope will acknowledge receipt, investigate substantiated notices promptly, and inform affected parties of actions taken in accordance with the DSA.'}
            </p>
          </div>

          {/* 6. Reporting Abuse */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '6. Missbrauch melden' : '6. Reporting Abuse'}
            </h2>
            <p className="text-sm">
              {isDe ? (
                <>
                  Zur Meldung von Missbrauch, Spam oder Netzwerkangriffen wenden Sie sich bitte an{' '}
                  <a href="mailto:administration@vaultscope.de" className="text-foreground hover:underline">
                    administration@vaultscope.de
                  </a>{' '}
                  (oder über <Link to="/report/abuse" className="text-foreground hover:underline">/report/abuse</Link>) unter Angabe relevanter IPs, Zeitstempel und Nachweise.
                </>
              ) : (
                <>
                  To report abuse, spam, or network attacks originating from VaultScope infrastructure, contact{' '}
                  <a href="mailto:administration@vaultscope.de" className="text-foreground hover:underline">
                    administration@vaultscope.de
                  </a>{' '}
                  (or via <Link to="/report/abuse" className="text-foreground hover:underline">/report/abuse</Link>) with relevant IP addresses, timestamps, and evidence.
                </>
              )}
            </p>
          </div>

          {/* 7. Enforcement */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '7. Durchsetzung und Sanktionen' : '7. Enforcement'}
            </h2>
            <p className="text-sm mb-4">
              {isDe
                ? 'Verstöße gegen diese AUP können je nach Schwere zu folgenden Maßnahmen führen:'
                : "Violations of this AUP may result in one or more of the following actions at VaultScope's reasonable discretion:"}
            </p>
            <ul className="flex flex-col gap-3 text-sm mb-4">
              {(isDe
                ? [
                    'Formale Abmahnung mit Frist zur Behebung des Verstoßes',
                    'Vorübergehende Sperrung des betroffenen Dienstes',
                    'Fristlose Kündigung des Dienstes aus wichtigem Grund ohne Erstattung bei schuldhaftem Verstoß',
                    'Meldung an zuständige Strafverfolgungs- oder Aufsichtsbehörden',
                    'Geltendmachung zivilrechtlicher Ansprüche',
                  ]
                : [
                    'A formal warning and request to remedy the violation',
                    'Temporary suspension of the affected service',
                    'Permanent termination of service for cause without refund in cases of culpable breach',
                    'Reporting to relevant law enforcement or regulatory authorities',
                    'Legal action where applicable',
                  ]
              ).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm">
              {isDe
                ? 'Bei rechtswidrigen Inhalten, aktiven Netzwerkangriffen oder CSAM behält sich VaultScope die sofortige Sperrung ohne Vorankündigung vor. In anderen Fällen wird dem Kunden grundsätzlich vorab Gelegenheit zur Abhilfe gegeben.'
                : 'In cases involving illegal content, active network attacks, or CSAM, VaultScope reserves the right to suspend services immediately without prior notice. For other violations, VaultScope will generally notify the customer and allow a reasonable opportunity to remedy.'}
            </p>
          </div>

          {/* 8. Changes */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '8. Änderungen dieser Nutzungsrichtlinie' : '8. Changes to This Policy'}
            </h2>
            <p className="text-sm">
              {isDe
                ? 'Änderungen dieser AUP richten sich nach den Änderungsregelungen in Abschnitt 8 der AGB bzw. Abschnitt 12 der Besonderen Hosting-Geschäftsbedingungen.'
                : 'Amendments to this AUP follow the modification rules set out in section 8 of the Terms of Service and section 12 of the Hosting Terms.'}
            </p>
          </div>

        </div>
      </LegalDocumentLayout>
    </div>
  );
};
