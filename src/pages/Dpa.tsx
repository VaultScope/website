import { useEffect } from 'react';
import { PageHero, LegalDocumentLayout } from '../components/Shared';
import { SeoHead } from '../components/SeoHead';
import { useLanguage } from '../i18n';
import { LocaleLink as Link } from '../i18n/LocaleLink';

export const Dpa = () => {
  const { locale } = useLanguage();
  const isDe = locale === 'de';
  const title = isDe
    ? 'Auftragsverarbeitungsvertrag (AVV) — VaultScope'
    : 'Data Processing Agreement — VaultScope';

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="flex flex-col w-full">
      <SeoHead
        title={isDe ? 'Auftragsverarbeitungsvertrag (AVV)' : 'Data Processing Agreement'}
        description={
          isDe
            ? 'Auftragsverarbeitungsvertrag (AVV) gemäß Art. 28 DSGVO zwischen VaultScope und Hosting-Kunden.'
            : 'Data Processing Agreement (Auftragsverarbeitungsvertrag) pursuant to Art. 28 GDPR between VaultScope and hosting customers.'
        }
        path={isDe ? '/de/legal/dpa' : '/legal/dpa'}
      />

      <PageHero
        title={isDe ? 'Auftragsverarbeitungsvertrag (AVV)' : 'Data Processing Agreement'}
        description={
          isDe
            ? 'Vereinbarung zur Auftragsverarbeitung personenbezogener Daten gemäß Art. 28 DSGVO.'
            : 'Auftragsverarbeitungsvertrag pursuant to Art. 28 GDPR between VaultScope and hosting customers.'
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
                ? 'Dieser Auftragsverarbeitungsvertrag („AVV“ / „DPA“) wird zwischen VaultScope (als Auftragsverarbeiter) und jedem Kunden (als Verantwortlichem) geschlossen, der auf der Infrastruktur von VaultScope personenbezogene Daten Dritter gemäß Art. 28 der Datenschutz-Grundverordnung (DSGVO) verarbeitet.'
                : 'This Data Processing Agreement ("DPA") is entered into between VaultScope (as Processor) and each customer using VaultScope infrastructure services who processes personal data on VaultScope infrastructure (as Controller), pursuant to Art. 28 of the GDPR (EU) 2016/679.'}
            </p>
            <p className="text-sm mt-3">
              {isDe ? (
                <>
                  Dieser AVV wird gemäß den{' '}
                  <Link to="/legal/hosting-terms/" className="text-foreground hover:underline">Hosting-AGB</Link>{' '}
                  mit Vertragsschluss wirksam Bestandteil des Hosting-Vertrags.
                </>
              ) : (
                <>
                  By using VaultScope infrastructure services, the Customer accepts this DPA as part of the contract pursuant to the{' '}
                  <Link to="/legal/hosting-terms/" className="text-foreground hover:underline">Hosting Terms</Link>. This DPA takes effect on the date the service commences.
                </>
              )}
            </p>

            <div className="border border-border p-6 mt-5 text-sm">
              <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-4">
                {isDe ? 'Vertragsparteien' : 'Parties'}
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="font-medium text-foreground mb-2">
                    {isDe ? 'Auftragsverarbeiter (Processor)' : 'Processor'}
                  </p>
                  <p>Anton Schmidt</p>
                  <p>VaultScope (Einzelunternehmen)</p>
                  <p>Gottlob-Spieß-Straße 2</p>
                  <p>74343 Sachsenheim, {isDe ? 'Deutschland' : 'Germany'}</p>
                  <p className="mt-2 text-foreground/80">
                    {isDe
                      ? 'Ansprechpartner für Datenschutz: Anton Schmidt'
                      : 'Data Protection Contact: Anton Schmidt'}
                  </p>
                  <p className="mt-1">
                    <a href="mailto:data@vaultscope.de" className="text-foreground hover:underline">data@vaultscope.de</a>
                    {' / '}
                    <a href="mailto:administration@vaultscope.de" className="text-foreground hover:underline">administration@vaultscope.de</a>
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">
                    {isDe ? 'Verantwortlicher (Controller)' : 'Controller'}
                  </p>
                  <p>
                    {isDe
                      ? 'Der im jeweiligen VaultScope-Kundenkonto identifizierte Kunde.'
                      : 'The Customer as identified in the hosting service account.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 1. Subject Matter */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '1. Gegenstand und Dauer' : '1. Subject Matter and Duration'}
            </h2>
            <p className="text-sm mb-4">
              {isDe
                ? 'Gegenstand ist die Bereitstellung von Cloud VPS, Dedizierten Servern, verschlüsseltem SFTP Storage und One-Click Deploy (OCD) Diensten. Die Laufzeit entspricht der Dauer des zugrundeliegenden Hosting-Vertrags und endet mit vollständiger Löschung der Dienste.'
                : 'VaultScope processes personal data on behalf of the Customer solely in connection with providing Cloud VPS, Dedicated Server, SFTP Storage, and One-Click Deploy (OCD) services. This DPA remains in force for the duration of the hosting contract and terminates upon completion of service deletion.'}
            </p>
            <p className="text-sm">
              {isDe
                ? 'VaultScope verarbeitet Daten im Auftrag ausschließlich auf dokumentierte Weisung des Verantwortlichen (wie in diesem AVV und den Hosting-AGB geregelt) oder aufgrund zwingender gesetzlicher Vorschriften.'
                : 'VaultScope processes personal data only on documented instructions from the Controller as set out in this DPA and the Hosting Terms, or as required by EU or Member State law.'}
            </p>
          </div>

          {/* 2. Nature and Purpose */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '2. Art und Zweck der Verarbeitung' : '2. Nature and Purpose of Processing'}
            </h2>
            <p className="text-sm mb-4">
              {isDe
                ? 'Art und Zweck ist die Bereitstellung technischer Server- und Speicherinfrastruktur. VaultScope greift auf in Kundeninstanzen oder SFTP-Vaults gespeicherte Inhalte nicht zu, außer:'
                : 'The nature and purpose is the provision of server and storage infrastructure on which the Controller stores and processes data of their choice. VaultScope does not access or inspect customer instance contents except:'}
            </p>
            <ul className="flex flex-col gap-3 text-sm">
              {(isDe
                ? [
                    'Soweit dies zur technischen Wartung, Störungsbehebung oder Abwehr von Sicherheitsvorfällen auf Infrastrukturebene erforderlich ist.',
                    'Aufgrund zwingender gesetzlicher Verpflichtung oder vollziehbarer behördlicher/gerichtlicher Anordnung.',
                    'Auf ausdrückliche Support-Anforderung des Kunden.',
                  ]
                : [
                    'Where required to perform infrastructure maintenance, resolve technical issues, or respond to security incidents affecting the infrastructure.',
                    'Where required by applicable law or a binding order from a competent authority.',
                    'Where the Customer has explicitly requested support assistance requiring access.',
                  ]
              ).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Types of Data */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '3. Art der Daten & Kategorien betroffener Personen' : '3. Types of Personal Data and Categories of Data Subjects'}
            </h2>
            <p className="text-sm mb-4">
              {isDe ? (
                <>
                  Art der personenbezogenen Daten und Kreis der Betroffenen werden allein durch den Kunden bestimmt, vorbehaltlich der Einhaltung der{' '}
                  <Link to="/legal/aup/" className="text-foreground hover:underline">AUP</Link> und geltenden Rechts.
                </>
              ) : (
                <>
                  The types of personal data and categories of data subjects are determined solely by the Controller, subject to compliance with the{' '}
                  <Link to="/legal/aup/" className="text-foreground hover:underline">Acceptable Use Policy</Link> and applicable law.
                </>
              )}
            </p>
            <p className="text-sm">
              {isDe ? (
                <>
                  Account-, Kontakt-, Rechnungs- und Supportdaten des Kunden selbst verarbeitet VaultScope als eigener Verantwortlicher gemäß der{' '}
                  <Link to="/legal/privacy/" className="text-foreground hover:underline">Datenschutzerklärung</Link>.
                </>
              ) : (
                <>
                  Customer account, billing, and support records are processed by VaultScope as an independent data controller as described in the{' '}
                  <Link to="/legal/privacy/" className="text-foreground hover:underline">Privacy Policy</Link>.
                </>
              )}
            </p>
          </div>

          {/* 4. Processor Obligations */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '4. Pflichten von VaultScope (Art. 28 Abs. 3 DSGVO)' : '4. Obligations of VaultScope (Processor)'}
            </h2>
            <div className="flex flex-col gap-5 text-sm">
              {(isDe
                ? [
                    { title: 'Vertraulichkeit', body: 'Zur Verarbeitung befugte Personen sind auf Vertraulichkeit verpflichtet. Kundendaten werden nicht an unbefugte Dritte weitergegeben.' },
                    { title: 'Weisungsgebundenheit', body: 'Verarbeitung erfolgt nur auf Weisung des Verantwortlichen; bei gesetzlicher Pflicht zur Abweichung wird der Kunde vorab informiert, sofern nicht gesetzlich untersagt.' },
                    { title: 'Technische & organisatorische Maßnahmen (TOMs)', body: 'VaultScope unterhält angemessene Sicherheitsmaßnahmen gemäß Abschnitt 8 dieses AVV (Art. 32 DSGVO).' },
                    { title: 'Unterstützung bei Betroffenenrechten', body: 'VaultScope unterstützt den Verantwortlichen im Rahmen seiner technischen Möglichkeiten bei Anfragen nach Art. 15–22 DSGVO.' },
                    { title: 'Unterstützung bei Meldepflichten', body: 'VaultScope unterstützt bei der Erfüllung der Pflichten nach Art. 32–36 DSGVO im Rahmen der verfügbaren Infrastrukturinformationen.' },
                    { title: 'Löschung nach Vertragsende', body: 'Bei Vertragsende werden gespeicherte Instanz- und SFTP-Daten gemäß Abschnitt 10 gelöscht.' },
                    { title: 'Nachweis- und Kontrollrechte', body: 'VaultScope stellt erforderliche Nachweise zur Verfügung und ermöglicht angemessene Prüfungen/Audits nach vorheriger Abstimmung.' },
                  ]
                : [
                    { title: 'Confidentiality', body: 'VaultScope ensures that persons authorised to process personal data are bound by confidentiality obligations and does not disclose customer data except as permitted or required by law.' },
                    { title: 'Processing on Instructions', body: "VaultScope processes data only on the Controller's documented instructions and notifies the Controller before any legally mandated deviation unless prohibited by law." },
                    { title: 'Security Measures', body: 'VaultScope maintains technical and organisational measures as set out in section 8 pursuant to Art. 32 GDPR.' },
                    { title: 'Assistance with Data Subject Rights', body: "VaultScope assists the Controller with Arts. 15–22 GDPR requests to the extent reasonably possible at the infrastructure layer." },
                    { title: 'Assistance with Security Obligations', body: 'VaultScope assists the Controller with compliance under Arts. 32–36 GDPR taking into account the nature of infrastructure hosting.' },
                    { title: 'Deletion', body: 'Upon termination, VaultScope promptly deletes all data on customer server and storage instances as set out in section 10.' },
                    { title: 'Audit Rights', body: 'VaultScope makes available information necessary to demonstrate Art. 28 GDPR compliance and supports reasonable audits upon prior notice.' },
                  ]
              ).map((item) => (
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
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '5. Genehmigte Unterauftragsverarbeiter' : '5. Sub-processors'}
            </h2>
            <p className="text-sm mb-5">
              {isDe
                ? 'Der Verantwortliche genehmigt die Einbindung der folgenden Infrastruktur-Unterauftragsverarbeiter (soweit für den jeweiligen Tarif genutzt). VaultScope stellt vertraglich gleichwertige Datenschutzpflichten nach Art. 28 Abs. 4 DSGVO sicher:'
                : 'The Controller authorises VaultScope to engage the following infrastructure sub-processors (as applicable to the selected service plan), each bound by equivalent data protection obligations pursuant to Art. 28(4) GDPR:'}
            </p>
            <div className="border border-border overflow-x-auto">
              <div className="min-w-[540px]">
                <div className="grid grid-cols-3 border-b border-border bg-foreground/[0.02]">
                  <div className="px-5 py-3 text-xs font-medium text-foreground/40 uppercase tracking-widest">
                    {isDe ? 'Unterauftragsverarbeiter' : 'Sub-processor'}
                  </div>
                  <div className="px-5 py-3 text-xs font-medium text-foreground/40 uppercase tracking-widest border-l border-border">
                    {isDe ? 'Leistung' : 'Role'}
                  </div>
                  <div className="px-5 py-3 text-xs font-medium text-foreground/40 uppercase tracking-widest border-l border-border">
                    {isDe ? 'Standort / Transfer' : 'Location / Transfer'}
                  </div>
                </div>
                <div className="grid grid-cols-3 border-b border-border">
                  <div className="px-5 py-4 text-sm text-foreground/70">Hetzner Online GmbH</div>
                  <div className="px-5 py-4 text-sm text-foreground/70 border-l border-border">
                    {isDe ? 'Cloud VPS, Dedicated & SFTP-Storage-Infrastruktur' : 'Cloud VPS, Dedicated & SFTP storage infrastructure'}
                  </div>
                  <div className="px-5 py-4 text-sm text-foreground/70 border-l border-border">
                    {isDe ? 'Deutschland / Finnland (EWR)' : 'Germany / Finland (EEA)'}
                  </div>
                </div>
                <div className="grid grid-cols-3 border-b border-border">
                  <div className="px-5 py-4 text-sm text-foreground/70">OVH SAS</div>
                  <div className="px-5 py-4 text-sm text-foreground/70 border-l border-border">
                    {isDe ? 'Server- & Netzwerkinfrastruktur' : 'Server & network infrastructure'}
                  </div>
                  <div className="px-5 py-4 text-sm text-foreground/70 border-l border-border">
                    {isDe ? 'Europäische Union (EWR)' : 'European Union (EEA)'}
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="px-5 py-4 text-sm text-foreground/70">ReliableSite.net LLC</div>
                  <div className="px-5 py-4 text-sm text-foreground/70 border-l border-border">
                    {isDe ? 'Bare-Metal-Infrastruktur (bei gewählten Dedicated-Tarifen)' : 'Dedicated bare-metal hardware (applicable dedicated plans)'}
                  </div>
                  <div className="px-5 py-4 text-sm text-foreground/70 border-l border-border">
                    {isDe ? 'Niederlande (EWR) oder USA je nach gewähltem Standort (SCCs)' : 'Netherlands (EEA) or USA depending on chosen location (SCCs)'}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm mt-4 text-foreground/60">
              {isDe
                ? 'Hinweis: Stripe (Stripe Payments Europe, Ltd. / Stripe, Inc.) verarbeitet Abrechnungs- und Zahlungsdaten für den Zahlungsvorgang als eigenständiger Verantwortlicher gemäß unserer Datenschutzerklärung, nicht im Auftrag zur Speicherung von Serverinhalten.'
                : 'Note: Stripe (Stripe Payments Europe, Ltd. / Stripe, Inc.) processes checkout payment and billing transactions as an independent payment controller as described in our Privacy Policy, not as a hosting sub-processor for server workloads.'}
            </p>
            <p className="text-sm mt-4">
              {isDe
                ? 'Über beabsichtigte Änderungen von Unterauftragsverarbeitern informiert VaultScope mindestens 14 Tage im Voraus durch Aktualisierung dieser Seite. Der Kunde kann innerhalb von 14 Tagen aus wichtigem datenschutzrechtlichem Grund widersprechen.'
                : 'VaultScope will notify the Controller of intended sub-processor additions or replacements by updating this page at least 14 days in advance. The Controller may object on reasonable data protection grounds; if no reasonable alternative is available, either party may terminate affected services.'}
            </p>
          </div>

          {/* 6. International Transfers */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '6. Internationale Datentransfers' : '6. International Data Transfers'}
            </h2>
            <p className="text-sm mb-4">
              {isDe
                ? 'Bei Auswahl europäischer Rechenzentrumsstandorte (Hetzner Online GmbH in Deutschland/Finnland, OVH SAS in der EU, ReliableSite Amsterdam/NL sowie eigene europäische Proxmox-/SFTP-Nodes) verbleiben alle auf Kundeninstanzen gespeicherten Daten innerhalb des Europäischen Wirtschaftsraums (EWR).'
                : 'When European datacenter locations are selected (Hetzner Online GmbH in Germany/Finland, OVH SAS in the EU, ReliableSite Amsterdam/NL, and sovereign EU Proxmox/SFTP nodes), customer instance data remains within the European Economic Area (EEA).'}
            </p>
            <p className="text-sm">
              {isDe
                ? 'Wählt der Kunde ausdrücklich einen Serverstandort in den USA (z. B. bei bestimmten Dedicated-Server-Angeboten), erfolgt die Verarbeitung am gewählten Standort auf Grundlage von EU-Standardvertragsklauseln (SCCs, Beschluss 2021/914) bzw. eines geltenden Angemessenheitsbeschlusses (EU-US Data Privacy Framework).'
                : 'If the Customer explicitly selects a US datacenter location (for applicable dedicated server configurations), processing at that chosen location relies on EU Standard Contractual Clauses (Commission Decision 2021/914) and/or the EU-US Data Privacy Framework where applicable.'}
            </p>
          </div>

          {/* 7. Controller Obligations */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '7. Pflichten des Verantwortlichen (Kunde)' : '7. Obligations of the Controller (Customer)'}
            </h2>
            <ul className="flex flex-col gap-3 text-sm">
              {(isDe
                ? [
                    'Sicherstellung einer gültigen Rechtsgrundlage (Art. 6 / Art. 9 DSGVO) für alle auf der Infrastruktur verarbeiteten Daten.',
                    'Erfüllung der Informationspflichten gegenüber Betroffenen nach Art. 13 und 14 DSGVO.',
                    'Umsetzung angemessener Zugriffskontrollen, Verschlüsselung und OS-/Anwendungshärtung innerhalb der eigenen Serverumgebung.',
                    'Unverzügliche Information an VaultScope bei erkannten Fehlern oder datenschutzrechtlichen Konflikten in Weisungen.',
                  ]
                : [
                    'Ensuring a valid legal basis under GDPR (Arts. 6 / 9) for all personal data processed on the infrastructure.',
                    'Providing required privacy notices to data subjects pursuant to Arts. 13 and 14 GDPR.',
                    'Implementing appropriate access controls, encryption, and OS/application hardening inside their own server environment.',
                    'Promptly notifying VaultScope of any instructions or issues that may conflict with applicable data protection law.',
                  ]
              ).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 8. TOMs */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '8. Technische und organisatorische Maßnahmen (Art. 32 DSGVO)' : '8. Technical and Organisational Security Measures'}
            </h2>
            <ul className="flex flex-col gap-3 text-sm">
              {(isDe
                ? [
                    'Physische Rechenzentrumssicherheit und Zutrittskontrollen werden durch die jeweiligen Upstream-Rechenzentrumsbetreiber gewährleistet (VaultScope selbst besitzt keine eigene ISO-27001-Zertifizierung).',
                    'Netzwerk- und Tenant-Isolation zwischen Kundeninstanzen sowie Chroot-Isolation für SFTP-Storage-Konten.',
                    'Verschlüsselung von Transportwegen (TLS/HTTPS, SSH/SFTP) sowie AES-256-GCM-Verschlüsselung sensibler Infrastruktur-API-Credentials.',
                    'Zugriffsbeschränkung interner Verwaltungssysteme auf autorisierte Personen sowie optionale 2FA (TOTP) für Kundenkonten und Audit-Logging.',
                    'Kontinuierliche Überwachung von Infrastruktur-Verfügbarkeit und Sicherheitsereignissen.',
                  ]
                : [
                    'Physical datacenter security and access controls are maintained by the respective upstream datacenter operators (VaultScope itself does not hold independent ISO certifications).',
                    'Network-level isolation between customer instances and chroot isolation for SFTP storage accounts.',
                    'Encryption in transit (TLS/HTTPS, SSH/SFTP) and AES-256-GCM encryption for upstream infrastructure API credentials.',
                    'Restricted administrative access, optional 2FA (TOTP) for customer accounts, and security/activity audit logging.',
                    'Continuous monitoring of infrastructure availability and security events.',
                  ]
              ).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 9. Breach Notification */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '9. Meldung von Datenschutzverletzungen' : '9. Personal Data Breach Notification'}
            </h2>
            <p className="text-sm">
              {isDe ? (
                <>
                  VaultScope benachrichtigt den Verantwortlichen unverzüglich – spätestens innerhalb von 72 Stunden nach Bekanntwerden – über Verletzungen des Schutzes personenbezogener Daten auf Infrastrukturebene, soweit VaultScope diese feststellen kann. Die Mitteilung erfolgt an die im Kundenkonto hinterlegte E-Mail-Adresse. Rückfragen richten Sie bitte an{' '}
                  <a href="mailto:data@vaultscope.de" className="text-foreground hover:underline">data@vaultscope.de</a>.
                </>
              ) : (
                <>
                  VaultScope will notify the Controller without undue delay, and within 72 hours of becoming aware, of any personal data breach affecting data processed on the Controller&apos;s behalf to the extent identifiable by VaultScope. Inquiries may be directed to{' '}
                  <a href="mailto:data@vaultscope.de" className="text-foreground hover:underline">data@vaultscope.de</a>.
                </>
              )}
            </p>
          </div>

          {/* 10. Deletion */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '10. Löschung nach Beendigung' : '10. Deletion of Data'}
            </h2>
            <p className="text-sm">
              {isDe
                ? 'Nach Beendigung des Hosting-Dienstes löscht VaultScope sämtliche Daten auf der Server- bzw. Speicherinstanz unverzüglich. Gesetzliche Aufbewahrungspflichten (z. B. Rechnungsdaten) bleiben unberührt.'
                : 'Upon termination of the hosting service, VaultScope promptly deletes all data stored on the Customer’s server or storage infrastructure, subject only to statutory retention obligations for billing records.'}
            </p>
          </div>

        </div>
      </LegalDocumentLayout>
    </div>
  );
};
