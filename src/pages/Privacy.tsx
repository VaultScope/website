import { useEffect } from 'react';
import { PageHero, LegalDocumentLayout } from '../components/Shared';
import { SeoHead } from '../components/SeoHead';
import { useLanguage } from '../i18n';

export const Privacy = () => {
  const { locale } = useLanguage();
  const isDe = locale === 'de';
  const title = isDe
    ? 'Datenschutzerklärung — VaultScope'
    : 'Privacy Policy — VaultScope';

  useEffect(() => {
    document.title = title;
  }, [title]);

  const gdprRights = isDe
    ? [
        {
          title: 'Auskunftsrecht (Art. 15 DSGVO)',
          desc: 'Sie können Auskunft darüber verlangen, ob und welche personenbezogenen Daten wir über Sie verarbeiten.',
        },
        {
          title: 'Recht auf Berichtigung (Art. 16 DSGVO)',
          desc: 'Sie können die Berichtigung unrichtiger oder die Vervollständigung unvollständiger personenbezogener Daten verlangen.',
        },
        {
          title: 'Recht auf Löschung (Art. 17 DSGVO)',
          desc: 'Sie können die Löschung Ihrer personenbezogenen Daten verlangen, sofern keine gesetzlichen Aufbewahrungspflichten (z. B. Rechnungsunterlagen) entgegenstehen.',
        },
        {
          title: 'Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)',
          desc: 'Sie können unter den gesetzlichen Voraussetzungen die Einschränkung der Verarbeitung Ihrer Daten verlangen.',
        },
        {
          title: 'Recht auf Datenübertragbarkeit (Art. 20 DSGVO)',
          desc: 'Sie haben das Recht, Daten, die wir automatisiert auf Grundlage Ihrer Einwilligung oder eines Vertrags verarbeiten, in einem maschinenlesbaren Format zu erhalten.',
        },
        {
          title: 'Widerspruchsrecht (Art. 21 DSGVO)',
          desc: 'Soweit die Verarbeitung auf Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) beruht, können Sie jederzeit Widerspruch einlegen.',
        },
        {
          title: 'Widerruf erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO)',
          desc: 'Eine erteilte Einwilligung (z. B. für Newsletter) können Sie jederzeit mit Wirkung für die Zukunft widerrufen.',
        },
      ]
    : [
        {
          title: 'Right of access (Art. 15 GDPR)',
          desc: 'You may request confirmation of whether we process your personal data and obtain access to that data and processing details.',
        },
        {
          title: 'Right to rectification (Art. 16 GDPR)',
          desc: 'You may request correction of inaccurate personal data and completion of incomplete data.',
        },
        {
          title: 'Right to erasure (Art. 17 GDPR)',
          desc: 'You may request deletion of your personal data where no overriding legal retention obligation (e.g. tax invoices) applies.',
        },
        {
          title: 'Right to restriction of processing (Art. 18 GDPR)',
          desc: 'You may request restriction of processing in certain circumstances, such as while accuracy is being verified.',
        },
        {
          title: 'Right to data portability (Art. 20 GDPR)',
          desc: 'Where processing is based on consent or contract, you may request your data in a structured, machine-readable format.',
        },
        {
          title: 'Right to object (Art. 21 GDPR)',
          desc: 'Where processing is based on legitimate interests (Art. 6(1)(f) GDPR), you may object at any time.',
        },
        {
          title: 'Right to withdraw consent (Art. 7(3) GDPR)',
          desc: 'Where processing is based on consent (e.g. newsletter), you may withdraw consent at any time without affecting prior lawful processing.',
        },
      ];

  const recipients = isDe
    ? [
        {
          name: 'Hetzner Online GmbH',
          role: 'Server- & Speicherinfrastruktur (Cloud VPS, Dedicated, SFTP Storage)',
          transfer: 'Deutschland / Finnland (EWR) — kein Drittlandtransfer',
        },
        {
          name: 'OVH SAS',
          role: 'Server- & Netzwerkinfrastruktur',
          transfer: 'Europäische Union (EWR) — kein Drittlandtransfer',
        },
        {
          name: 'ReliableSite.net LLC',
          role: 'Bare-Metal-Infrastruktur (bei gewählten Dedicated-Server-Tarifen)',
          transfer: 'Niederlande (EWR) oder USA je nach gewähltem Serverstandort (SCCs / EU-US DPF)',
        },
        {
          name: 'Stripe Payments Europe, Ltd. / Stripe, Inc.',
          role: 'Zahlungsabwicklung (eigenständiger Verantwortlicher für Checkout & Zahlungsmittel)',
          transfer: 'EWR / USA (EU-US Data Privacy Framework & Standardvertragsklauseln)',
        },
        {
          name: 'Google Ireland Limited / Google LLC',
          role: 'Google Tag Manager & Google Analytics (nur nach ausdrücklicher Einwilligung)',
          transfer: 'EWR / USA (EU-US Data Privacy Framework & Standardvertragsklauseln)',
        },
        {
          name: 'OpenStreetMap Foundation & Komoot GmbH',
          role: 'Optionale Adress-Autovervollständigung bei Registrierung (Nominatim / Photon)',
          transfer: 'EWR / UK (nur bei Eingabe in das Adressfeld)',
        },
        {
          name: 'Europäische Kommission (VIES)',
          role: 'Prüfung eingegebener EU-USt-IdNrn. im Profil (ec.europa.eu)',
          transfer: 'EU — kein Drittlandtransfer',
        },
      ]
    : [
        {
          name: 'Hetzner Online GmbH',
          role: 'Server & storage infrastructure (Cloud VPS, Dedicated, SFTP Storage)',
          transfer: 'Germany / Finland (EEA) — no third-country transfer',
        },
        {
          name: 'OVH SAS',
          role: 'Server & network infrastructure',
          transfer: 'European Union (EEA) — no third-country transfer',
        },
        {
          name: 'ReliableSite.net LLC',
          role: 'Dedicated bare-metal hardware (for applicable dedicated server plans)',
          transfer: 'Netherlands (EEA) or USA depending on chosen server location (SCCs / EU-US DPF)',
        },
        {
          name: 'Stripe Payments Europe, Ltd. / Stripe, Inc.',
          role: 'Payment processing (independent controller for checkout and payment instruments)',
          transfer: 'EEA / USA (EU-US Data Privacy Framework & Standard Contractual Clauses)',
        },
        {
          name: 'Google Ireland Limited / Google LLC',
          role: 'Google Tag Manager & Google Analytics (only after explicit opt-in consent)',
          transfer: 'EEA / USA (EU-US Data Privacy Framework & Standard Contractual Clauses)',
        },
        {
          name: 'OpenStreetMap Foundation & Komoot GmbH',
          role: 'Optional address autocomplete during registration (Nominatim / Photon)',
          transfer: 'EEA / UK (triggered only when typing in the street address field)',
        },
        {
          name: 'European Commission (VIES)',
          role: 'EU VAT ID validation in account profile (ec.europa.eu)',
          transfer: 'EU — no third-country transfer',
        },
      ];

  return (
    <div className="flex flex-col w-full">
      <SeoHead
        title={isDe ? 'Datenschutzerklärung' : 'Privacy Policy'}
        description={
          isDe
            ? 'Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO, BDSG und TDDDG bei VaultScope.'
            : 'How VaultScope collects, processes, and protects personal data in accordance with GDPR, BDSG, and TDDDG.'
        }
        path={isDe ? '/de/legal/privacy' : '/legal/privacy'}
      />

      <PageHero
        title={isDe ? 'Datenschutzerklärung' : 'Privacy Policy'}
        description={
          isDe
            ? 'Transparente Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO, BDSG und TDDDG.'
            : 'How VaultScope collects, processes, and protects personal data in accordance with GDPR, BDSG, and TDDDG.'
        }
        align="left"
      />

      <LegalDocumentLayout>
        <div className="flex flex-col gap-16 text-[var(--text-muted)] leading-relaxed">

          {/* Intro */}
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
                  Diese Datenschutzerklärung erläutert, wie VaultScope (Anton Schmidt, Einzelunternehmen) personenbezogene Daten im Zusammenhang mit den Websites{' '}
                  <strong className="text-foreground/70 font-medium">vaultscope.de</strong> und{' '}
                  <strong className="text-foreground/70 font-medium">pegasusbot.app</strong>, dem VaultScope-Kundenportal sowie unseren Infrastrukturdiensten (SFTP Storage, Cloud VPS, Dedizierte Server, One-Click Deploy) gemäß DSGVO, BDSG und TDDDG verarbeitet.
                </>
              ) : (
                <>
                  This Privacy Policy describes how VaultScope (Anton Schmidt, Einzelunternehmen) processes personal data in connection with{' '}
                  <strong className="text-foreground/70 font-medium">vaultscope.de</strong>,{' '}
                  <strong className="text-foreground/70 font-medium">pegasusbot.app</strong>, the VaultScope customer portal, and infrastructure services pursuant to the GDPR, BDSG, and TDDDG.
                </>
              )}
            </p>
          </div>

          {/* 1. Controller */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '1. Verantwortlicher & Datenschutz-Kontakt' : '1. Data Controller & Privacy Contact'}
            </h2>
            <p className="text-sm mb-5">
              {isDe
                ? 'Verantwortlicher im Sinne von Art. 4 Nr. 7 DSGVO (ein gesetzlicher Datenschutzbeauftragter ist nach § 38 BDSG / Art. 37 DSGVO aufgrund der Betriebsgröße nicht erforderlich):'
                : 'Data controller pursuant to Art. 4(7) GDPR (a formal Data Protection Officer under § 38 BDSG / Art. 37 GDPR is not legally required given company size):'}
            </p>
            <div className="border-l-2 border-[var(--accent)] pl-6 py-1 text-sm leading-7">
              <p className="font-medium text-foreground">Anton Schmidt</p>
              <p>VaultScope (Einzelunternehmen)</p>
              <p>Gottlob-Spieß-Straße 2</p>
              <p>74343 Sachsenheim</p>
              <p>{isDe ? 'Deutschland' : 'Germany'}</p>
              <div className="mt-4 pt-4 border-t border-border">
                <p>
                  <span className="text-foreground/40 uppercase tracking-widest text-xs mr-3">
                    {isDe ? 'Datenschutz' : 'Privacy'}
                  </span>
                  <a href="mailto:data@vaultscope.de" className="text-foreground hover:underline">data@vaultscope.de</a>
                </p>
                <p className="mt-1">
                  <span className="text-foreground/40 uppercase tracking-widest text-xs mr-3">
                    {isDe ? 'Allgemein' : 'Legal'}
                  </span>
                  <a href="mailto:administration@vaultscope.de" className="text-foreground hover:underline">administration@vaultscope.de</a>
                </p>
                <p className="mt-1">
                  <span className="text-foreground/40 uppercase tracking-widest text-xs mr-3">Support</span>
                  <a href="mailto:support@vaultscope.de" className="text-foreground hover:underline">support@vaultscope.de</a>
                </p>
              </div>
            </div>
          </div>

          {/* 2. Data Processed */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '2. Welche personenbezogenen Daten wir verarbeiten' : '2. Personal Data We Process'}
            </h2>

            <div className="flex flex-col gap-8">

              <div className="border-l border-foreground/10 pl-6">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                  {isDe ? '2.1 Server- und Zugriffslogs' : '2.1 Server and Access Logs'}
                </h3>
                <p className="text-sm mb-2">
                  {isDe
                    ? 'Beim Aufruf unserer Websites und API-Endpunkte werden technisch erforderliche Zugriffsdaten protokolliert: IP-Adresse, Zeitpunkt, aufgerufene URL, HTTP-Statuscode, Referrer sowie Browser-/Betriebssystem-Kennung.'
                    : 'When accessing our websites or APIs, standard access logs are recorded: IP address, timestamp, requested URL, HTTP status code, referrer, and browser/OS user-agent.'}
                </p>
                <p className="text-sm">
                  <span className="text-foreground/50 font-medium">{isDe ? 'Rechtsgrundlage & Speicherdauer: ' : 'Legal basis & retention: '}</span>
                  {isDe
                    ? 'Berechtigtes Interesse an Betriebssicherheit und Missbrauchsabwehr (Art. 6 Abs. 1 lit. f DSGVO); kurzfristige Speicherung und anschließende Löschung bzw. Anonymisierung.'
                    : 'Legitimate interest in operational security and abuse prevention (Art. 6(1)(f) GDPR); retained briefly for security and then deleted or anonymised.'}
                </p>
              </div>

              <div className="border-l border-foreground/10 pl-6">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                  {isDe ? '2.2 Kundenkonto, Profil, 2FA, SSH-Keys & Aktivitätslogs' : '2.2 Customer Account, Profile, 2FA, SSH Keys & Activity Logs'}
                </h3>
                <p className="text-sm mb-2">
                  {isDe
                    ? 'Bei Registrierung und Nutzung des Kundenportals verarbeiten wir: Benutzername, vollständigen Namen, E-Mail-Adresse (sowie optional zusätzliche verifizierte Rechnungs-E-Mail-Adressen), Passwort-Hash, Rechnungsanschrift (Straße, PLZ, Ort, Land) sowie optional Telefonnummer, Firmenname und EU-USt-IdNr. Zusätzlich speichern wir im Rahmen der Dienstkonfiguration und Kontosicherheit hinterlegte SSH-Public-Keys, Bestell-/Konfigurationsangaben, 2FA/TOTP-Geheimnisse und Wiederherstellungscodes sowie sicherheits- und kontobezogene Aktivitätsprotokolle (Auth-, Sicherheits-, Abrechnungs-, Ticket- und Service-Ereignisse).'
                    : 'During registration and portal use we process: username, full name, primary email (plus optional verified billing recipient emails), password hash, billing address (street, postal code, city, country), and optional phone number, company name, and EU VAT ID. We also process submitted SSH public keys, order configuration inputs, 2FA/TOTP secrets and recovery codes, and security/account activity audit logs (auth, security, service, billing, and support events).'}
                </p>
                <p className="text-sm">
                  <span className="text-foreground/50 font-medium">{isDe ? 'Rechtsgrundlage & Speicherdauer: ' : 'Legal basis & retention: '}</span>
                  {isDe
                    ? 'Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO) und berechtigtes Interesse an Kontosicherheit (Art. 6 Abs. 1 lit. f DSGVO). Löschung bei Kontolöschung („Delete Account“), soweit keine gesetzlichen Aufbewahrungspflichten (z. B. 8–10 Jahre nach § 147 AO / § 14b UStG für Rechnungsbelege) entgegenstehen.'
                    : 'Contract performance (Art. 6(1)(b) GDPR) and legitimate interest in account security (Art. 6(1)(f) GDPR). Deleted upon account closure unless statutory retention (8–10 years under § 147 AO / § 14b UStG for invoices) applies.'}
                </p>
              </div>

              <div className="border-l border-foreground/10 pl-6">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                  {isDe ? '2.3 Zahlungsabwicklung über Stripe' : '2.3 Payment Processing (Stripe)'}
                </h3>
                <p className="text-sm mb-2">
                  {isDe
                    ? 'Zahlungen (Kredit-/Debitkarten, Apple Pay, Google Pay, PayPal, Klarna, Link, SEPA-Lastschrift) werden direkt über Stripe (Stripe Payments Europe, Ltd. / Stripe, Inc.) abgewickelt. VaultScope speichert keine Kartennummern oder CVV-Codes, sondern erhält lediglich Zahlungsstatus, PaymentIntent-ID sowie Rechnungsdaten zur Verbuchung.'
                    : 'Payments (cards, Apple Pay, Google Pay, PayPal, Klarna, Link, SEPA Direct Debit) are processed via Stripe (Stripe Payments Europe, Ltd. / Stripe, Inc.). VaultScope does not store card numbers or CVV data and receives only payment confirmation, PaymentIntent ID, billing address, and payment status.'}
                </p>
                <p className="text-sm">
                  <span className="text-foreground/50 font-medium">{isDe ? 'Rechtsgrundlage & Hinweis: ' : 'Legal basis & notice: '}</span>
                  {isDe ? (
                    <>
                      Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) und lit. c (steuerliche Aufbewahrung). Stripe handelt bei der Zahlungsabwicklung als eigenständiger Verantwortlicher (Datenschutzhinweise:{' '}
                      <a href="https://stripe.com/privacy" target="_blank" rel="noreferrer" className="text-foreground hover:underline">stripe.com/privacy</a>
                      ; Drittlandtransfer auf Basis des EU-US Data Privacy Framework und Standardvertragsklauseln).
                    </>
                  ) : (
                    <>
                      Art. 6(1)(b) GDPR (contract) and Art. 6(1)(c) (tax retention). Stripe acts as an independent controller for payment processing (
                      <a href="https://stripe.com/privacy" target="_blank" rel="noreferrer" className="text-foreground hover:underline">stripe.com/privacy</a>
                      ; US transfers governed by EU-US DPF and Standard Contractual Clauses).
                    </>
                  )}
                </p>
              </div>

              <div className="border-l border-foreground/10 pl-6">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                  {isDe ? '2.4 Support-Tickets, E-Mail-Kontakt & Meldeportal' : '2.4 Support Tickets, Email Contact & Abuse Reports'}
                </h3>
                <p className="text-sm mb-2">
                  {isDe
                    ? 'Bei Kontaktaufnahme über das Ticket-System, per E-Mail (support@, administration@, data@, info@, billing@) oder über das Meldeportal (/report) verarbeiten wir Ihre Kontaktangaben und den Nachrichteninhalt zur Bearbeitung Ihres Anliegens bzw. zur Erfüllung gesetzlicher Prüfpflichten (z. B. Art. 16 DSA).'
                    : 'When contacting support via tickets, email (support@, administration@, data@, info@, billing@), or the report portal (/report), we process your contact details and message content to handle your inquiry or fulfil statutory DSA notice obligations.'}
                </p>
                <p className="text-sm">
                  <span className="text-foreground/50 font-medium">{isDe ? 'Rechtsgrundlage: ' : 'Legal basis: '}</span>
                  {isDe
                    ? 'Art. 6 Abs. 1 lit. b, lit. c (DSA) bzw. lit. f DSGVO.'
                    : 'Art. 6(1)(b), Art. 6(1)(c) (DSA), and Art. 6(1)(f) GDPR.'}
                </p>
              </div>

              <div className="border-l border-foreground/10 pl-6">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                  {isDe ? '2.5 Adress-Autovervollständigung & EU-VIES-Prüfung' : '2.5 Address Autocomplete & EU VIES VAT Verification'}
                </h3>
                <p className="text-sm mb-2">
                  {isDe
                    ? 'Bei der Eingabe der Straße im Registrierungsformular fragt Ihr Browser optional OpenStreetMap Nominatim (nominatim.openstreetmap.org) und Komoot Photon (photon.komoot.io) mit der Teiladresse und Ihrer IP-Adresse ab. Bei manueller Prüfung einer EU-USt-IdNr. im Profil fragt unser Backend die VIES-API der Europäischen Kommission (ec.europa.eu) ab.'
                    : 'During registration, typing a street address optionally queries OpenStreetMap Nominatim (nominatim.openstreetmap.org) and Komoot Photon (photon.komoot.io) directly from your browser with the partial query and IP address. When verifying an EU VAT ID in your profile, our backend queries the European Commission VIES API (ec.europa.eu).'}
                </p>
                <p className="text-sm">
                  <span className="text-foreground/50 font-medium">{isDe ? 'Rechtsgrundlage: ' : 'Legal basis: '}</span>
                  {isDe
                    ? 'Art. 6 Abs. 1 lit. b und lit. f DSGVO (komfortable und fehlerfreie Rechnungsdatenerfassung).'
                    : 'Art. 6(1)(b) and Art. 6(1)(f) GDPR (accurate billing data entry).'}
                </p>
              </div>

              <div className="border-l border-foreground/10 pl-6">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                  {isDe ? '2.6 Newsletter & Launch-Warteliste (Listmonk)' : '2.6 Newsletter & Launch Waitlist (Listmonk)'}
                </h3>
                <p className="text-sm mb-2">
                  {isDe
                    ? 'Für den Newsletter / die Warteliste erheben wir verpflichtend Ihren Namen und Ihre E-Mail-Adresse über unsere selbst gehostete Listmonk-Instanz (sub.vaultscope.de) im Double-Opt-In-Verfahren.'
                    : 'When subscribing to the VaultScope waitlist or newsletter, we require and process your name and email address using our self-hosted Listmonk instance (sub.vaultscope.de) with double opt-in confirmation.'}
                </p>
                <p className="text-sm">
                  <span className="text-foreground/50 font-medium">{isDe ? 'Rechtsgrundlage & Widerruf: ' : 'Legal basis & withdrawal: '}</span>
                  {isDe
                    ? 'Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Widerruf jederzeit über den Abmeldelink in jeder E-Mail oder per Mail an administration@vaultscope.de.'
                    : 'Consent (Art. 6(1)(a) GDPR). Unsubscribe anytime via the link in any email or by writing to administration@vaultscope.de.'}
                </p>
              </div>

              <div className="border-l border-foreground/10 pl-6">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                  {isDe ? '2.7 Authentifizierung & Browser-Speicher (Local / Session Storage)' : '2.7 Portal Authentication & Browser Storage'}
                </h3>
                <p className="text-sm mb-2">
                  {isDe
                    ? 'Wir nutzen technisch erforderlichen Browser-Speicher (localStorage und sessionStorage) für Darstellung, Authentifizierung und lokale Forum-Entwürfe:'
                    : 'We use technically necessary browser storage (localStorage and sessionStorage) for UI preferences, authenticated sessions, and local forum thread storage:'}
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/70">
                  <li><code className="font-mono text-xs">vs-theme</code> (localStorage): {isDe ? 'Dark-/Light-Mode-Einstellung.' : 'dark/light theme preference.'}</li>
                  <li><code className="font-mono text-xs">vs_token</code>, <code className="font-mono text-xs">vs_claims</code>, <code className="font-mono text-xs">vs_user_name</code>, <code className="font-mono text-xs">vs_username</code> (localStorage): {isDe ? 'Authentifizierte Portal-Sitzung (JWT) und Anzeigename.' : 'authenticated portal JWT session and display identity.'}</li>
                  <li><code className="font-mono text-xs">vs_quick_nav</code> (localStorage): {isDe ? 'Individuelle Dashboard-Schnellnavigation.' : 'customized dashboard quick-navigation shortcuts.'}</li>
                  <li><code className="font-mono text-xs">vs_consent</code> (localStorage): {isDe ? 'Speicherung Ihrer Datenschutz- und Analyse-Einwilligung.' : 'stores your privacy & analytics consent choice.'}</li>
                  <li><code className="font-mono text-xs">vs_thread_*</code> / <code className="font-mono text-xs">vs_forum_threads_*</code> (localStorage): {isDe ? 'Lokal im Browser gespeicherte Forum-Diskussionen/Antworten.' : 'locally persisted forum threads and replies in your browser.'}</li>
                  <li><code className="font-mono text-xs">vs_redirect</code> &amp; <code className="font-mono text-xs">chunk_reload_triggered</code> (sessionStorage): {isDe ? 'Weiterleitungsziel nach Login und Asset-Reload-Schutz.' : 'post-login redirect target and asset reload guard.'}</li>
                </ul>
                <p className="text-sm mt-2">
                  <span className="text-foreground/50 font-medium">{isDe ? 'Rechtsgrundlage: ' : 'Legal basis: '}</span>
                  § 25 Abs. 2 Nr. 2 TDDDG; Art. 6 Abs. 1 lit. b, lit. c (Einwilligungsnachweis) &amp; lit. f DSGVO.
                </p>
              </div>

              <div className="border-l border-foreground/10 pl-6">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-tight mb-2">
                  {isDe ? '2.8 Lokal gehostete Webfonts' : '2.8 Self-Hosted Web Fonts'}
                </h3>
                <p className="text-sm">
                  {isDe
                    ? 'Alle verwendeten Schriftarten (Inter, JetBrains Mono, Space Grotesk, Pixelify Sans, Silkscreen) werden lokal über unsere eigenen Server ausgeliefert. Beim Laden der Schriftarten findet keine Verbindung zu Servern von Google Fonts oder Drittanbietern statt.'
                    : 'All web fonts (Inter, JetBrains Mono, Space Grotesk, Pixelify Sans, Silkscreen) are self-hosted directly from VaultScope servers. No connections to external Google Fonts servers are made.'}
                </p>
              </div>

            </div>
          </div>

          {/* 3. Analytics */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '3. Reichweitenmessung (Google Tag Manager & Google Analytics)' : '3. Analytics (Google Tag Manager & Google Analytics)'}
            </h2>
            <p className="text-sm mb-3">
              {isDe
                ? 'Sofern Sie über unser Consent-Banner ausdrücklich einwilligen, nutzen wir Google Tag Manager (Container-IDs: GTM-K99ZS3QV, GTM-WFZPL3MZ) und Google Analytics (Google Ireland Limited / Google LLC) mit Google Consent Mode v2 zur statistischen Auswertung der Website-Nutzung (Seitenaufrufe, Interaktionen, technische Endgerätedaten).'
                : 'Only if you explicitly opt in via our consent banner, we load Google Tag Manager (container IDs: GTM-K99ZS3QV, GTM-WFZPL3MZ) and Google Analytics (Google Ireland Limited / Google LLC) using Google Consent Mode v2 to measure website usage and page views.'}
            </p>
            <p className="text-sm mb-3">
              {isDe
                ? 'Vor Ihrer aktiven Einwilligung bleibt analytics_storage standardmäßig deaktiviert (denied) und es werden keine GTM-/Analytics-Skripte von Google-Servern nachgeladen. Werbespeicher (ad_storage, ad_user_data, ad_personalization) bleibt deaktiviert.'
                : 'Before you give consent, analytics_storage defaults to denied and no GTM/Analytics scripts are loaded from Google servers. Advertising storage flags (ad_storage, ad_user_data, ad_personalization) remain denied.'}
            </p>
            <p className="text-sm">
              <span className="text-foreground/50 font-medium">{isDe ? 'Rechtsgrundlage, Transfer & Widerruf: ' : 'Legal basis, transfer & withdrawal: '}</span>
              {isDe
                ? 'Einwilligung gemäß § 25 Abs. 1 TDDDG und Art. 6 Abs. 1 lit. a DSGVO. Übermittlungen in die USA stützen sich auf das EU-US Data Privacy Framework und Standardvertragsklauseln. Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft über „Cookie-Einstellungen“ im Footer widerrufen.'
                : 'Consent pursuant to § 25(1) TDDDG and Art. 6(1)(a) GDPR. US transfers rely on the EU-US Data Privacy Framework and Standard Contractual Clauses. You may withdraw consent anytime via "Cookie Settings" in the footer.'}
            </p>
          </div>

          {/* 4. Cookies */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '4. Cookies & Einwilligungsverwaltung' : '4. Cookies & Consent Management'}
            </h2>
            <p className="text-sm">
              {isDe
                ? 'Technisch notwendige CSRF-Schutz-Cookies und die unter Abschnitt 2.7 genannten Storage-Einträge erfolgen auf Grundlage von § 25 Abs. 2 Nr. 2 TDDDG ohne Einwilligung. Optionale Analyse-Cookies von Google Analytics werden ausschließlich nach Ihrer ausdrücklichen Einwilligung gemäß § 25 Abs. 1 TDDDG gesetzt und können jederzeit über „Cookie-Einstellungen“ im Footer deaktiviert werden.'
                : 'Strictly necessary CSRF security cookies and browser storage entries listed in section 2.7 operate under § 25(2) Nr. 2 TDDDG without consent. Optional Google Analytics cookies are set solely after your explicit opt-in under § 25(1) TDDDG and can be revoked anytime via "Cookie Settings" in the footer.'}
            </p>
          </div>

          {/* 5. Third-party links */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '5. Externe Links & Status-Portal' : '5. Third-Party Links & Status Portal'}
            </h2>
            <p className="text-sm">
              {isDe ? (
                <>
                  Unsere Website verlinkt auf externe Plattformen (u. a. GitHub, Discord) sowie auf das von VaultScope selbst gehostete Status-Portal unter{' '}
                  <a href="https://status.vaultscope.de/status/vs" target="_blank" rel="noreferrer" className="text-foreground hover:underline">status.vaultscope.de</a>{' '}
                  (Uptime Kuma; Zugriffslogs gemäß Abschnitt 2.1). Beim Aufruf externer Websites gelten deren eigene Datenschutzbestimmungen.
                </>
              ) : (
                <>
                  Our websites link to external services (e.g. GitHub, Discord) and our self-hosted status portal at{' '}
                  <a href="https://status.vaultscope.de/status/vs" target="_blank" rel="noreferrer" className="text-foreground hover:underline">status.vaultscope.de</a>{' '}
                  (Uptime Kuma; server logs per section 2.1). External websites are governed by their respective privacy policies.
                </>
              )}
            </p>
          </div>

          {/* 6. Recipients & Sub-processors */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '6. Empfänger, Infrastrukturpartner & Drittlandtransfers' : '6. Recipients, Infrastructure Partners & Transfers'}
            </h2>
            <p className="text-sm mb-5">
              {isDe
                ? 'VaultScope verkauft oder vermietet keine personenbezogenen Daten. Eine Übermittlung erfolgt ausschließlich an die nachfolgend genannten Dienstleister und Partner bzw. bei gesetzlicher Verpflichtung:'
                : 'VaultScope never sells or trades personal data. Data is shared only with the service providers and infrastructure partners listed below or where required by law:'}
            </p>
            <div className="border-t border-b border-border divide-y divide-border overflow-x-auto">
              <div className="min-w-[540px]">
                <div className="grid grid-cols-3">
                  {(isDe
                    ? ['Empfänger / Partner', 'Zweck', 'Standort / Transfergarantie']
                    : ['Recipient / Partner', 'Purpose', 'Location / Transfer Mechanism']
                  ).map((h) => (
                    <div key={h} className="py-3 pr-4 text-xs font-medium text-foreground/40 uppercase tracking-widest">
                      {h}
                    </div>
                  ))}
                </div>
                {recipients.map((sp) => (
                  <div key={sp.name} className="grid grid-cols-3 border-t border-border">
                    <div className="py-4 pr-4 text-sm font-medium text-foreground/70">{sp.name}</div>
                    <div className="py-4 pr-4 text-sm text-foreground/60">{sp.role}</div>
                    <div className="py-4 text-sm text-foreground/60">{sp.transfer}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 7. Retention */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '7. Speicherdauer' : '7. Data Retention'}
            </h2>
            <ul className="flex flex-col gap-3 text-sm">
              {(isDe
                ? [
                    'Accountdaten: Speicherung für die Dauer der Geschäftsbeziehung; Löschung nach Kontoschließung vorbehaltlich gesetzlicher Pflichten.',
                    'Rechnungs- und Buchhaltungsdaten: Aufbewahrung für 8 bis 10 Jahre gemäß § 147 AO und § 14b UStG.',
                    'Server- und Zugriffslogs: Kurzfristige Speicherung zur IT-Sicherheit, anschließend Löschung oder Anonymisierung.',
                    'Support-Tickets: Aufbewahrung bis zur abschließenden Bearbeitung und Löschung bei Wegfall des Zwecks bzw. Kontoschließung.',
                  ]
                : [
                    'Account data: retained for the customer relationship and deleted after account closure unless statutory retention applies.',
                    'Billing and invoice records: retained for 8 to 10 years pursuant to § 147 AO and § 14b UStG.',
                    'Server and access logs: retained briefly for security, then deleted or anonymised.',
                    'Support tickets: retained as necessary for support resolution and deleted when no longer required or upon account closure.',
                  ]
              ).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 8. GDPR Rights */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '8. Ihre Rechte nach der DSGVO' : '8. Your Rights Under the GDPR'}
            </h2>
            <p className="text-sm mb-6">
              {isDe
                ? 'Ihnen stehen gegenüber uns folgende Betroffenenrechte zu:'
                : 'As a data subject, you have the following rights under the GDPR:'}
            </p>
            <div className="flex flex-col gap-5">
              {gdprRights.map((item) => (
                <div key={item.title} className="border-l border-foreground/10 pl-6">
                  <p className="text-sm font-medium text-foreground/80 mb-1">{item.title}</p>
                  <p className="text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-sm mt-6">
              {isDe ? (
                <>
                  Zur Ausübung Ihrer Rechte wenden Sie sich bitte an{' '}
                  <a href="mailto:data@vaultscope.de" className="text-foreground hover:underline">data@vaultscope.de</a> oder{' '}
                  <a href="mailto:administration@vaultscope.de" className="text-foreground hover:underline">administration@vaultscope.de</a>. Wir antworten grundsätzlich innerhalb eines Monats gemäß Art. 12 Abs. 3 DSGVO.
                </>
              ) : (
                <>
                  To exercise any of these rights, contact{' '}
                  <a href="mailto:data@vaultscope.de" className="text-foreground hover:underline">data@vaultscope.de</a> or{' '}
                  <a href="mailto:administration@vaultscope.de" className="text-foreground hover:underline">administration@vaultscope.de</a>. We will respond within one month pursuant to Art. 12 GDPR.
                </>
              )}
            </p>
          </div>

          {/* 9. Supervisory Authority */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '9. Beschwerderecht bei einer Aufsichtsbehörde' : '9. Right to Lodge a Complaint'}
            </h2>
            <p className="text-sm mb-5">
              {isDe
                ? 'Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO). Zuständige Aufsichtsbehörde an unserem Sitz ist:'
                : 'You have the right to lodge a complaint with a supervisory authority (Art. 77 GDPR). Our lead supervisory authority is:'}
            </p>
            <div className="border-l-2 border-[var(--accent)] pl-6 py-1 text-sm leading-7">
              <p className="font-medium text-foreground">
                Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg
              </p>
              <p>Königstraße 10a</p>
              <p>70173 Stuttgart</p>
              <p>{isDe ? 'Deutschland' : 'Germany'}</p>
              <div className="mt-4 pt-4 border-t border-border">
                <a href="https://www.baden-wuerttemberg.datenschutz.de" target="_blank" rel="noreferrer" className="text-foreground hover:underline">
                  www.baden-wuerttemberg.datenschutz.de
                </a>
              </div>
            </div>
          </div>

          {/* 10. Changes */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '10. Aktualisierung dieser Datenschutzerklärung' : '10. Changes to This Policy'}
            </h2>
            <p className="text-sm">
              {isDe
                ? 'Wir passen diese Datenschutzerklärung an, sobald Änderungen unserer Datenverarbeitungen oder gesetzlicher Vorgaben dies erfordern. Den aktuellen Stand entnehmen Sie bitte dem Datum oben.'
                : 'We update this Privacy Policy whenever our data processing practices or legal requirements change. The revision date at the top indicates the latest version.'}
            </p>
          </div>

        </div>
      </LegalDocumentLayout>
    </div>
  );
};
