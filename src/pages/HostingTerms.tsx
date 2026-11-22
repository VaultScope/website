import { useEffect } from 'react';
import { PageHero, LegalDocumentLayout } from '../components/Shared';
import { SeoHead } from '../components/SeoHead';
import { useLanguage } from '../i18n';
import { LocaleLink as Link } from '../i18n/LocaleLink';

export const HostingTerms = () => {
  const { locale } = useLanguage();
  const isDe = locale === 'de';
  const title = isDe
    ? 'Besondere Hosting-Geschäftsbedingungen — VaultScope'
    : 'Hosting Terms — VaultScope';

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="flex flex-col w-full">
      <SeoHead
        title={isDe ? 'Hosting-AGB' : 'Hosting Terms'}
        description={
          isDe
            ? 'Besondere Geschäftsbedingungen für Cloud VPS, Dedizierte Server, SFTP Storage und One-Click Deploy bei VaultScope.'
            : 'General Terms and Conditions for VaultScope Cloud VPS, Dedicated Server, SFTP Storage, and One-Click Deploy services.'
        }
        path={isDe ? '/de/legal/hosting-terms' : '/legal/hosting-terms'}
      />

      <PageHero
        title={isDe ? 'Hosting-Geschäftsbedingungen' : 'Hosting Terms'}
        description={
          isDe
            ? 'Besondere Vertragsbedingungen für Cloud VPS, Dedizierte Server, SFTP Storage und One-Click Deploy.'
            : 'General Terms and Conditions for VaultScope Cloud VPS, Dedicated Server, SFTP Storage, and One-Click Deploy services.'
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
              {isDe ? (
                <>
                  Diese Besonderen Hosting-Geschäftsbedingungen („Hosting-AGB“) regeln das Vertragsverhältnis zwischen VaultScope (Anton Schmidt, Einzelunternehmen) und Kunden über den Bezug von Infrastruktur- und Speicherprodukten. Sie ergänzen die allgemeinen{' '}
                  <Link to="/legal/terms/" className="text-foreground hover:underline">Nutzungsbedingungen</Link>. Im Konfliktfall gehen diese Hosting-AGB vor.
                </>
              ) : (
                <>
                  These General Terms and Conditions ("Hosting Terms") govern the contractual relationship between VaultScope (Anton Schmidt, Einzelunternehmen) and customers purchasing infrastructure and storage services. They supplement the general{' '}
                  <Link to="/legal/terms/" className="text-foreground hover:underline">Terms of Service</Link>. In case of conflict, these Hosting Terms take precedence for hosting services.
                </>
              )}
            </p>
            <p className="text-sm mt-3">
              {isDe ? (
                <>
                  Verbrauchern steht zusätzlich das gesetzliche Widerrufsrecht gemäß der{' '}
                  <Link to="/legal/cancellation/" className="text-foreground hover:underline">Widerrufsbelehrung</Link> zu. Für alle Kunden gilt ergänzend die{' '}
                  <Link to="/legal/aup/" className="text-foreground hover:underline">Nutzungsrichtlinie (AUP)</Link>.
                </>
              ) : (
                <>
                  Consumers additionally benefit from the statutory rights in the{' '}
                  <Link to="/legal/cancellation/" className="text-foreground hover:underline">Cancellation Policy</Link>. All customers are subject to the{' '}
                  <Link to="/legal/aup/" className="text-foreground hover:underline">Acceptable Use Policy</Link>.
                </>
              )}
            </p>
          </div>

          {/* 1. Definitions */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '1. Begriffsbestimmungen' : '1. Definitions'}
            </h2>
            <div className="flex flex-col gap-3 text-sm">
              {(isDe
                ? [
                    { term: '„VaultScope“', def: 'Anton Schmidt, handelnd als VaultScope (Einzelunternehmen), Gottlob-Spieß-Straße 2, 74343 Sachsenheim, Deutschland.' },
                    { term: '„Kunde“', def: 'Jede natürliche oder juristische Person, die mit VaultScope einen Vertrag über Hosting-Dienste abschließt.' },
                    { term: '„Verbraucher“', def: 'Jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden können (§ 13 BGB).' },
                    { term: '„Dienste“', def: 'Von VaultScope bereitgestellte Cloud-VPS-, Dedizierte-Server-, SFTP-Storage- und One-Click-Deploy-(OCD)-Produkte.' },
                    { term: '„Upstream-Provider“', def: 'Vorgelagerte Rechenzentrums- und Infrastrukturbetreiber (insbesondere Hetzner Online GmbH, OVH SAS sowie je nach gewähltem Dedicated-Tarif ReliableSite.net LLC).' },
                    { term: '„Abrechnungszeitraum“', def: 'Der bei Bestellung gewählte vertragliche Zeitraum (z. B. monatlich, vierteljährlich, halbjährlich, jährlich, zweijährlich oder dreijährlich).' },
                  ]
                : [
                    { term: '"VaultScope"', def: 'Anton Schmidt, operating as VaultScope (Einzelunternehmen), Gottlob-Spieß-Straße 2, 74343 Sachsenheim, Germany.' },
                    { term: '"Customer"', def: 'The natural or legal person concluding a contract with VaultScope for hosting services.' },
                    { term: '"Consumer"', def: 'A natural person acting for purposes outside their trade, business, craft, or profession (§ 13 BGB).' },
                    { term: '"Services"', def: 'Cloud VPS, Dedicated Server, SFTP Storage, and One-Click Deploy (OCD) products provided by VaultScope.' },
                    { term: '"Upstream Provider"', def: 'Upstream infrastructure and datacenter operators (such as Hetzner Online GmbH, OVH SAS, and, for applicable dedicated server plans, ReliableSite.net LLC).' },
                    { term: '"Billing Period"', def: 'The contractual billing cycle selected at checkout (e.g. monthly, quarterly, semi-annually, annually, biennially, or triennially).' },
                  ]
              ).map((item) => (
                <div key={item.term} className="flex items-start gap-4">
                  <span className="text-foreground/70 font-medium shrink-0 w-40">{item.term}</span>
                  <span>{item.def}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Services & Provisioning */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '2. Leistungsgegenstand & Bereitstellung' : '2. Services & Provisioning Lead Times'}
            </h2>
            <p className="text-sm mb-4">
              {isDe
                ? 'VaultScope stellt die folgenden Infrastruktur- und Speicherprodukte auf eigener oder angemieteter Partner-Hardware bereit:'
                : 'VaultScope provides the following infrastructure and storage services on sovereign and upstream partner hardware:'}
            </p>
            <div className="flex flex-col gap-5">
              <div className="border-l border-foreground/10 pl-6">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                  Cloud VPS &amp; One-Click Deploy (OCD)
                </h3>
                <p className="text-sm">
                  {isDe
                    ? 'Virtuelle Serverinstanzen und vorkonfigurierte Container-Anwendungen mit isolierten Rechenressourcen, in der Regel automatisiert innerhalb weniger Minuten nach Bestellabschluss bereitgestellt.'
                    : 'Virtual private server instances and pre-configured container applications providing isolated compute resources, typically provisioned automatically within minutes of order completion.'}
                </p>
              </div>
              <div className="border-l border-foreground/10 pl-6">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                  {isDe ? 'Dedizierte Bare-Metal-Server' : 'Dedicated Bare-Metal Servers'}
                </h3>
                <p className="text-sm">
                  {isDe
                    ? 'Exklusiv einem Kunden zugewiesene physische Server-Hardware am jeweils ausgewählten Rechenzentrumsstandort. Bei individuell konfigurierbaren dedizierten Servern beträgt die reguläre Bereitstellungszeit bis zu sieben (7) Werktage nach Zahlungseingang.'
                    : 'Physical server hardware allocated exclusively to a single customer at the selected datacenter location. For configurable dedicated servers, regular provisioning takes up to seven (7) business days after payment succeeds.'}
                </p>
              </div>
              <div className="border-l border-foreground/10 pl-6">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                  SFTP Storage
                </h3>
                <p className="text-sm">
                  {isDe
                    ? 'Chroot-isolierter SFTP-Speicher auf redundanten ZFS-Storage-Systemen (über SFTPGo) für Backups und automatisierte Datei-Workflows.'
                    : 'Chroot-isolated SFTP storage vaults operated on redundant ZFS storage nodes (powered by SFTPGo) for backups and automated file workflows.'}
                </p>
              </div>
            </div>
            <p className="text-sm mt-5">
              {isDe
                ? 'Die konkreten technischen Spezifikationen, Kontingente, Standorte und Preise ergeben sich aus der jeweiligen Produktbeschreibung und Bestellübersicht im Kundenportal.'
                : 'Specific hardware configurations, quotas, datacenter locations, and prices are set out in the product specification and order summary at checkout.'}
            </p>
          </div>

          {/* 3. Contract Conclusion */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '3. Vertragsschluss' : '3. Contract Conclusion'}
            </h2>
            <p className="text-sm mb-4">
              {isDe
                ? 'Ein verbindlicher Vertrag kommt im Kundenportal zustande, wenn:'
                : 'A binding contract is formed in the customer portal when:'}
            </p>
            <ul className="flex flex-col gap-3 text-sm mb-4">
              {(isDe
                ? [
                    'Der Kunde den Bestellvorgang einschließlich der erforderlichen Vertrags- und Widerrufserklärungen abschließt und auf die verbindliche Bestellschaltfläche („zahlungspflichtig bestellen“ bzw. „Deploy Now“ bei kostenfreien/Test-Tarifen) klickt.',
                    'Bei kostenpflichtigen Tarifen die Zahlung erfolgreich über Stripe autorisiert bzw. abgeschlossen wurde.',
                    'VaultScope die Bestellung durch Bereitstellung im Portal oder per Bestellbestätigung per E-Mail annimmt.',
                  ]
                : [
                    'The Customer completes the checkout flow including required legal and withdrawal acknowledgements and submits the binding order button.',
                    'For paid plans, payment is successfully processed via Stripe (or for free/trial plans, the order is confirmed directly).',
                    'VaultScope accepts the order via email confirmation or provisioning activation in the customer portal.',
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
                ? 'VaultScope behält sich vor, Bestellungen bei begründetem Verdacht auf Betrug, Missbrauch oder Verstoß gegen die AUP abzulehnen.'
                : 'VaultScope reserves the right to refuse any order where there are reasonable grounds to suspect fraud, misuse, or violation of the Acceptable Use Policy.'}
            </p>
          </div>

          {/* 4. Pricing, Tax Status and Payment */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '4. Preise, Steuern und Zahlung' : '4. Pricing, Taxation and Payment'}
            </h2>

            <div className="flex flex-col gap-5 text-sm">
              <div className="border-l border-foreground/10 pl-6">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                  {isDe ? 'Preise & Umsatzsteuer' : 'Prices & VAT'}
                </h3>
                <p>
                  {isDe
                    ? 'Alle Preise werden vor Bestellabschluss in Euro (€) angezeigt. Soweit VaultScope die Kleinunternehmerregelung gemäß § 19 UStG anwendet, wird keine Umsatzsteuer berechnet und ein entsprechender Hinweis („Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.“) im Checkout und auf der Rechnung ausgewiesen. Sofern Regelbesteuerung Anwendung findet, werden Nettobetrag, gesetzliche Umsatzsteuer (z. B. 19 % deutsche USt.) sowie der Gesamtbruttobetrag gemäß § 3 PAngV vor Bestellabschluss transparent ausgewiesen. Bei bestimmten Dedicated-Server-Konfigurationen können zusätzlich einmalige Einrichtungsgebühren (Setup Fees) anfallen, die gesondert ausgewiesen werden.'
                    : 'All prices are displayed in EUR (€) at checkout. Where VaultScope applies the German small business regulation pursuant to § 19 UStG (Kleinunternehmerregelung), no VAT is charged and a corresponding statutory notice is shown at checkout and on invoices. Where regular taxation applies, the net price, applicable statutory VAT (e.g. 19% German VAT), and final gross total are clearly itemized pursuant to § 3 PAngV prior to order completion. Certain dedicated server configurations may carry an additional one-time setup fee itemized separately in the order summary.'}
                </p>
              </div>

              <div className="border-l border-foreground/10 pl-6">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                  {isDe ? 'Abrechnungszyklen & Testzeiträume' : 'Billing Cycles & Trials'}
                </h3>
                <p>
                  {isDe
                    ? 'Die Abrechnung erfolgt im Voraus (Prepaid) für den bei Bestellung gewählten Abrechnungszeitraum (standardmäßig monatlich; bei konfigurierbaren dedizierten Servern wahlweise monatlich, vierteljährlich, halbjährlich, jährlich, zweijährlich oder dreijährlich). Sofern ein Tarif über einen kostenfreien Testzeitraum (Trial) verfügt, wird dies vor Buchung ausgewiesen.'
                    : 'Services are billed in advance (prepaid) for the selected Billing Period (defaulting to monthly, or quarterly, semi-annually, annually, biennially, or triennially where offered for configurable dedicated servers). Where a plan includes a free trial period, this is displayed prior to order submission.'}
                </p>
              </div>

              <div className="border-l border-foreground/10 pl-6">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                  {isDe ? 'Zahlungsabwicklung (Stripe)' : 'Payment Processing (Stripe)'}
                </h3>
                <p>
                  {isDe
                    ? 'Zahlungen erfolgen sicher über Stripe (Stripe Payments Europe, Ltd. / Stripe, Inc.), u. a. per Kredit-/Debitkarte, Apple Pay, Google Pay, PayPal, Klarna, Link oder SEPA-Lastschrift je nach Verfügbarkeit. VaultScope speichert keine vollständigen Kartennummern oder CVV-Daten.'
                    : 'Payments are processed via Stripe (Stripe Payments Europe, Ltd. / Stripe, Inc.), supporting credit/debit cards, Apple Pay, Google Pay, PayPal, Klarna, Link, and SEPA Direct Debit where available. VaultScope does not store full card numbers or CVV data.'}
                </p>
              </div>

              <div className="border-l border-foreground/10 pl-6">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                  {isDe ? 'Zahlungsverzug' : 'Failed Payments & Grace Period'}
                </h3>
                <p>
                  {isDe
                    ? 'Schlägt eine fällige Zahlung fehl, informiert VaultScope den Kunden per E-Mail. Bleibt die Zahlung länger als 7 Tage nach Fälligkeit aus, kann der Dienst vorübergehend gesperrt werden. Erfolgt innerhalb von 14 Tagen ab ursprünglicher Fälligkeit kein Ausgleich, ist VaultScope zur Kündigung und anschließenden Datenlöschung berechtigt.'
                    : 'If a scheduled payment fails, VaultScope notifies the Customer by email. VaultScope may suspend the Service if payment remains outstanding for more than 7 days after the due date, and may terminate the contract and erase stored data if payment is not received within 14 days of the original due date.'}
                </p>
              </div>
            </div>
          </div>

          {/* 5. Contract Duration and Termination */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '5. Laufzeit und Kündigung' : '5. Contract Duration and Termination'}
            </h2>

            <div className="flex flex-col gap-5 text-sm">
              <div className="border-l border-foreground/10 pl-6">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                  {isDe ? 'Mindestlaufzeit & Verlängerung' : 'Minimum Term & Renewal'}
                </h3>
                <p>
                  {isDe
                    ? 'Die Mindestlaufzeit entspricht dem gewählten Abrechnungszeitraum (in der Regel ein Kalendermonat) ab Bereitstellung. Der Vertrag verlängert sich automatisch um jeweils denselben Zeitraum, sofern er nicht vor Ablauf gekündigt wird.'
                    : 'The minimum term equals the selected Billing Period (typically one calendar month) from activation, renewing automatically for the same period unless cancelled prior to the next billing date.'}
                </p>
              </div>

              <div className="border-l border-foreground/10 pl-6">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                  {isDe ? 'Ordentliche Kündigung durch den Kunden' : 'Cancellation by Customer'}
                </h3>
                <p>
                  {isDe ? (
                    <>
                      Der Kunde kann jeden Dienst jederzeit über die Kündigungsfunktion im Kundenportal oder per E-Mail an{' '}
                      <a href="mailto:administration@vaultscope.de" className="text-foreground hover:underline">administration@vaultscope.de</a> kündigen. Im Portal stehen dabei zwei Optionen zur Verfügung: (1) <strong>Zum Laufzeitende („At Period End“)</strong> – der Dienst läuft bis zum Ende des bereits bezahlten Zeitraums weiter; oder (2) <strong>Sofortige Kündigung („Immediately“)</strong> auf ausdrücklichen Wunsch des Kunden – der Dienst wird sofort beendet und sämtliche Daten unwiderruflich gelöscht. Nach Ablauf eines gesetzlichen Widerrufsrechts erfolgt bei vorzeitiger Selbstkündigung keine anteilige Erstattung bereits bezahlter laufender Perioden.
                    </>
                  ) : (
                    <>
                      The Customer may cancel any Service at any time via the customer portal or by email to{' '}
                      <a href="mailto:administration@vaultscope.de" className="text-foreground hover:underline">administration@vaultscope.de</a>. The portal offers two modes: (1) <strong>At Period End</strong> – the Service remains active until the end of the current paid Billing Period; or (2) <strong>Immediate Cancellation</strong> at the Customer&apos;s explicit request – terminating the Service and permanently deleting all data right away. Once any statutory withdrawal period has expired, no refunds are issued for unused time within an active Billing Period.
                    </>
                  )}
                </p>
              </div>

              <div className="border-l border-foreground/10 pl-6">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                  {isDe ? 'Ordentliche & außerordentliche Kündigung durch VaultScope' : 'Termination by VaultScope'}
                </h3>
                <p>
                  {isDe
                    ? 'VaultScope kann Verträge ordentlich mit einer Frist von 30 Tagen zum Monats- bzw. Periodenende kündigen (bei vorzeitiger Beendigung mit anteiliger Erstattung im Voraus gezahlter Entgelte). Das Recht zur fristlosen Kündigung aus wichtigem Grund (insbesondere bei schwerwiegenden AUP-Verstößen, Betrug oder anhaltendem Zahlungsverzug nach Mahnung) bleibt unberührt.'
                    : "VaultScope may terminate any Service without cause upon 30 days' written notice, refunding any pro-rata unused portion of prepaid fees. VaultScope may terminate immediately for cause in cases of material breach, AUP violations, fraud, or non-payment after grace period."}
                </p>
              </div>

              <div className="border-l border-foreground/10 pl-6">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                  {isDe ? 'Verbraucher-Widerrufsrecht' : 'Consumer Withdrawal Right'}
                </h3>
                <p>
                  {isDe ? (
                    <>
                      Verbrauchern steht ein 14-tägiges gesetzliches Widerrufsrecht zu. Einzelheiten ergeben sich aus der{' '}
                      <Link to="/legal/cancellation/" className="text-foreground hover:underline">Widerrufsbelehrung</Link>.
                    </>
                  ) : (
                    <>
                      Consumers have a 14-day statutory right of withdrawal. Full details are set out in the{' '}
                      <Link to="/legal/cancellation/" className="text-foreground hover:underline">Cancellation Policy</Link>.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* 6. Data on Termination */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '6. Datenlöschung bei Vertragsende' : '6. Data on Termination'}
            </h2>
            <p className="text-sm mb-4">
              {isDe ? 'Mit Beendigung eines Dienstes:' : 'Upon termination or expiry of a Service:'}
            </p>
            <ul className="flex flex-col gap-3 text-sm">
              {(isDe
                ? [
                    'Serverinstanzen, Container, SFTP-Speicherinhalte und Zugangsdaten werden unmittelbar nach dem Beendigungszeitpunkt (bei Sofort-Kündigung sofort) unwiderruflich gelöscht.',
                    'Der Kunde ist selbst dafür verantwortlich, vor Vertragsende bzw. vor Auslösung einer Sofort-Kündigung eigene Backups zu erstellen.',
                    'Rechnungs- und Buchhaltungsunterlagen werden gemäß den gesetzlichen Aufbewahrungsfristen (8 bis 10 Jahre nach § 147 AO / § 14b UStG) archiviert.',
                  ]
                : [
                    'Server instances, containers, SFTP storage data, and credentials are permanently deleted promptly after the service end date (or immediately upon Immediate Cancellation).',
                    'The Customer is solely responsible for backing up all data prior to service termination.',
                    'Billing and accounting records are retained for statutory retention periods (8 to 10 years pursuant to § 147 AO / § 14b UStG).',
                  ]
              ).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 7. Service Availability */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '7. Verfügbarkeit & Wartung' : '7. Service Availability & Maintenance'}
            </h2>
            <p className="text-sm mb-4">
              {isDe
                ? 'VaultScope strebt eine hohe Verfügbarkeit im Rahmen der Leistungszusagen der jeweiligen vorgelagerten Rechenzentrums- und Infrastrukturpartner (insbesondere Hetzner Online GmbH, OVH SAS und ReliableSite.net LLC) an. Eine darüber hinausgehende selbständige Verfügbarkeitsgarantie (SLA) übernimmt VaultScope nur, soweit ausdrücklich schriftlich vereinbart (z. B. bei Managed Infrastructure).'
                : 'VaultScope targets high infrastructure availability consistent with the service commitments of our respective upstream datacenter partners (including Hetzner Online GmbH, OVH SAS, and ReliableSite.net LLC). VaultScope does not provide an independent uptime SLA beyond upstream commitments unless expressly agreed in writing (e.g. Managed Infrastructure).'}
            </p>
            <p className="text-sm">
              {isDe
                ? 'Geplante Wartungsarbeiten werden betroffenen Kunden nach Möglichkeit vorab angekündigt. Dringende Sicherheits- oder Notfallwartungen können ohne Vorankündigung durchgeführt werden.'
                : 'Planned maintenance is communicated in advance where practicable. Emergency security or stability maintenance may be carried out without prior notice.'}
            </p>
          </div>

          {/* 8. Customer Obligations */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '8. Pflichten des Kunden' : '8. Customer Obligations'}
            </h2>
            <ul className="flex flex-col gap-3 text-sm">
              {(isDe
                ? [
                    'Angabe wahrheitsgemäßer und aktueller Kontakt- sowie Rechnungsdaten.',
                    'Eigenverantwortliche Absicherung von Betriebssystem, Anwendungen, SSH-Schlüsseln, Passwörtern und Backups (sofern kein Managed-Vertrag besteht).',
                    'Einhaltung der Nutzungsrichtlinie (AUP) und der jeweils geltenden Upstream-Richtlinien.',
                    'Einhaltung aller gesetzlichen Vorschriften einschließlich der DSGVO bei Verarbeitung personenbezogener Daten Dritter auf VaultScope-Systemen.',
                  ]
                : [
                    'Providing accurate and up-to-date contact and billing information.',
                    'Securing their own operating system, software, SSH keys, passwords, and backups (unless covered by a Managed Infrastructure agreement).',
                    'Complying with the Acceptable Use Policy and applicable upstream provider policies at all times.',
                    'Ensuring compliance with applicable law, including GDPR where personal data of third parties is processed on VaultScope infrastructure.',
                  ]
              ).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 9. Sub-contractors */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '9. Infrastrukturpartner & Unterauftragnehmer' : '9. Infrastructure Partners & Sub-contractors'}
            </h2>
            <p className="text-sm mb-4">
              {isDe
                ? 'VaultScope erbringt Hosting- und Speicherleistungen unter Einbindung ausgewählter Infrastrukturpartner, darunter Hetzner Online GmbH (Gunzenhausen, Deutschland / Finnland), OVH SAS (Roubaix, Frankreich / EU) sowie für bestimmte dedizierte Bare-Metal-Angebote ReliableSite.net LLC (Rechenzentrumsstandort je nach Produktauswahl, z. B. Amsterdam/NL oder USA).'
                : 'VaultScope delivers hosting and storage services using infrastructure operated by upstream partners including Hetzner Online GmbH (Germany / Finland, EU), OVH SAS (France / EU), and, for applicable dedicated server plans, ReliableSite.net LLC (datacenter location as selected per product, e.g. Amsterdam/NL or USA).'}
            </p>
            <p className="text-sm">
              {isDe
                ? 'Vertragspartner des Kunden ist ausschließlich VaultScope; ein direktes Vertragsverhältnis zwischen dem Kunden und dem jeweiligen Upstream-Provider entsteht nicht.'
                : 'VaultScope acts as the sole contractual counterparty to the Customer; no direct contractual relationship is created with the upstream infrastructure provider.'}
            </p>
          </div>

          {/* 10. Liability */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '10. Haftung' : '10. Liability'}
            </h2>
            <p className="text-sm mb-4">
              {isDe
                ? 'Es gelten die Haftungsregelungen aus Abschnitt 6 der allgemeinen AGB:'
                : 'The liability provisions of section 6 of the Terms of Service apply:'}
            </p>
            <ul className="flex flex-col gap-3 text-sm mb-4">
              {(isDe
                ? [
                    'Unbeschränkte Haftung bei Vorsatz, grober Fahrlässigkeit sowie bei Schäden an Leben, Körper oder Gesundheit und nach dem Produkthaftungsgesetz.',
                    'Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) ist die Haftung auf den vertragstypischen, vorhersehbaren Schaden begrenzt.',
                    'Für Datenverluste haftet VaultScope bei leichter Fahrlässigkeit höchstens in Höhe des Aufwands, der bei ordnungsgemäßer und regelmäßiger Datensicherung durch den Kunden für die Wiederherstellung erforderlich gewesen wäre.',
                    'VaultScope haftet nicht für Störungen oder Ausfälle infolge höherer Gewalt, durch den Kunden zu vertretender Konfigurationen oder unabwendbarer Ereignisse bei vorgelagerten Netz- bzw. Rechenzentrumsbetreibern ohne eigenes Verschulden von VaultScope.',
                  ]
                : [
                    'Unlimited liability for intent, gross negligence, injury to life, body, or health, and mandatory statutory liability under the German Product Liability Act.',
                    'For simple negligence breaching a material contractual obligation (Kardinalpflicht), liability is limited to foreseeable, contract-typical damages.',
                    'For data loss caused by simple negligence, VaultScope is liable only up to the recovery effort that would have been required had the Customer maintained regular, proper backups.',
                    'VaultScope is not liable for force majeure events, customer misconfigurations, or upstream network/datacenter outages outside VaultScope’s fault.',
                  ]
              ).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 11. Data Processing */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '11. Datenschutz & Auftragsverarbeitung (AVV)' : '11. Data Protection & DPA'}
            </h2>
            <p className="text-sm mb-4">
              {isDe ? (
                <>
                  Informationen zur Verarbeitung von Kunden- und Accountdaten enthält die{' '}
                  <Link to="/legal/privacy/" className="text-foreground hover:underline">Datenschutzerklärung</Link>.
                </>
              ) : (
                <>
                  Personal data processed for account and billing administration is described in the{' '}
                  <Link to="/legal/privacy/" className="text-foreground hover:underline">Privacy Policy</Link>.
                </>
              )}
            </p>
            <p className="text-sm">
              {isDe ? (
                <>
                  Soweit der Kunde auf VaultScope-Infrastruktur personenbezogene Daten Dritter verarbeitet, schließt der Kunde mit VaultScope den{' '}
                  <Link to="/legal/dpa/" className="text-foreground hover:underline">Auftragsverarbeitungsvertrag (AVV / DPA)</Link>{' '}
                  gemäß Art. 28 DSGVO ab.
                </>
              ) : (
                <>
                  Where the Customer processes personal data of third parties on VaultScope infrastructure, VaultScope acts as processor under the{' '}
                  <Link to="/legal/dpa/" className="text-foreground hover:underline">Data Processing Agreement (DPA)</Link>{' '}
                  pursuant to Art. 28 GDPR.
                </>
              )}
            </p>
          </div>

          {/* 12. Changes */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '12. Änderungen dieser Hosting-AGB' : '12. Changes to These Terms'}
            </h2>
            <p className="text-sm">
              {isDe
                ? 'Geplante Änderungen werden dem Kunden mindestens 30 Tage vor Wirksamwerden per E-Mail mitgeteilt. Für geringfügige, nicht die Hauptleistung oder Entgelte betreffende Änderungen gilt die Zustimmung als erteilt, wenn der Kunde nicht innerhalb von 30 Tagen widerspricht und hierauf ausdrücklich hingewiesen wurde (§ 308 Nr. 5 BGB). Wesentliche Preis- oder Leistungsänderungen bei bestehenden Verbraucherverträgen bedürfen stets der ausdrücklichen Zustimmung.'
                : 'Proposed changes will be notified by email at least 30 days before their effective date. Minor, non-essential amendments not affecting core obligations or pricing take effect if the Customer does not object within 30 days, provided this consequence was highlighted in the notice (§ 308 Nr. 5 BGB). Material changes to pricing or core service obligations for Consumers always require explicit consent.'}
            </p>
          </div>

          {/* 13. Governing Law */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '13. Recht & Salvatorische Klausel' : '13. Governing Law & Severability'}
            </h2>
            <p className="text-sm">
              {isDe
                ? 'Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts (CISG); zwingende Verbraucherschutzvorschriften des EU-Wohnsitzstaates bleiben unberührt. Sollte eine Bestimmung dieser Bedingungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.'
                : 'These Hosting Terms are governed by the laws of the Federal Republic of Germany excluding the UN CISG; mandatory consumer protection laws of EU residents remain unaffected. If any provision is held invalid, the remaining provisions remain in full force.'}
            </p>
          </div>

        </div>
      </LegalDocumentLayout>
    </div>
  );
};
