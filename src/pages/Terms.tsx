import { useEffect } from 'react';
import { PageHero, LegalDocumentLayout } from '../components/Shared';
import { SeoHead } from '../components/SeoHead';
import { useLanguage } from '../i18n';
import { LocaleLink as Link } from '../i18n/LocaleLink';

export const Terms = () => {
  const { locale } = useLanguage();
  const isDe = locale === 'de';
  const title = isDe ? 'Nutzungsbedingungen (AGB) — VaultScope' : 'Terms of Service — VaultScope';

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="flex flex-col w-full">
      <SeoHead
        title={isDe ? 'Nutzungsbedingungen (AGB)' : 'Terms of Service'}
        description={
          isDe
            ? 'Allgemeine Nutzungs- und Geschäftsbedingungen für die Websites, das Kundenportal und die Dienste von VaultScope.'
            : 'General Terms of Service governing the use of VaultScope websites, customer portal, and infrastructure services.'
        }
        path={isDe ? '/de/legal/terms' : '/legal/terms'}
      />

      <PageHero
        title={isDe ? 'Nutzungsbedingungen (AGB)' : 'Terms of Service'}
        description={
          isDe
            ? 'Allgemeine Bedingungen für die Nutzung der VaultScope-Websites, des Kundenportals und der angebotenen Infrastrukturdienste.'
            : "General terms governing use of VaultScope's websites, customer portal, and infrastructure services."
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
                  Diese Allgemeinen Nutzungs- und Geschäftsbedingungen („AGB“) regeln die Nutzung der Websites{' '}
                  <strong className="text-foreground/70 font-medium">vaultscope.de</strong> und{' '}
                  <strong className="text-foreground/70 font-medium">pegasusbot.app</strong>, des VaultScope-Kundenportals sowie aller von VaultScope angebotenen Hosting- und Infrastrukturdienste.
                </>
              ) : (
                <>
                  These Terms of Service govern the use of the websites{' '}
                  <strong className="text-foreground/70 font-medium">vaultscope.de</strong> and{' '}
                  <strong className="text-foreground/70 font-medium">pegasusbot.app</strong>, the VaultScope customer portal, and all hosting or infrastructure services offered by VaultScope.
                </>
              )}
            </p>
            <p className="text-sm mt-4">
              {isDe ? 'Anbieter: ' : 'Provider: '}
              Anton Schmidt (VaultScope, Einzelunternehmen), Gottlob-Spieß-Straße 2, 74343 Sachsenheim, {isDe ? 'Deutschland' : 'Germany'}.{' '}
              {isDe ? 'Kontakt: ' : 'Contact: '}
              <a href="mailto:administration@vaultscope.de" className="text-foreground hover:underline">
                administration@vaultscope.de
              </a>
            </p>
          </div>

          {/* 1. Scope */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '1. Geltungsbereich' : '1. Scope of These Terms'}
            </h2>
            <p className="text-sm mb-4">
              {isDe ? 'Diese AGB gelten für:' : 'These Terms apply to:'}
            </p>
            <ul className="flex flex-col gap-3 text-sm mb-4">
              {(isDe
                ? [
                    'Die Nutzung der Websites vaultscope.de und pegasusbot.app einschließlich der Dokumentation, des Blogs und des Community-Forums.',
                    'Die Registrierung und Nutzung eines VaultScope-Kundenkontos im Kundenportal.',
                    'Alle von VaultScope erbrachten Hosting- und Infrastrukturdienste (Cloud VPS, Dedizierte Server, SFTP Storage und One-Click Deploy), ergänzend geregelt durch die Besonderen Hosting-Geschäftsbedingungen.',
                    'Von VaultScope bereitgestellte Software und Werkzeuge, soweit hierfür keine gesonderten Open-Source- oder Produktlizenzen gelten.',
                  ]
                : [
                    'Use of the VaultScope websites (vaultscope.de) and the Pegasus website (pegasusbot.app), including documentation, blog, and community forum.',
                    'Registration and use of a VaultScope customer account in the customer portal.',
                    'All hosting and infrastructure services provided by VaultScope (Cloud VPS, Dedicated Servers, SFTP Storage, and One-Click Deploy), supplemented by the Special Hosting Terms.',
                    'Software and tools made available by VaultScope, unless governed separately by dedicated open-source or product licences.',
                  ]
              ).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm">
              {isDe ? (
                <>
                  Für die Lizenzierung der Pegasus-Software gelten vorrangig die Bedingungen der PolyForm Noncommercial 1.0.0 Lizenz unter{' '}
                  <a href="https://pegasusbot.app/license" target="_blank" rel="noreferrer" className="text-foreground hover:underline">
                    pegasusbot.app/license
                  </a>
                  .
                </>
              ) : (
                <>
                  Pegasus software licensing is governed separately by the PolyForm Noncommercial 1.0.0 licence available at{' '}
                  <a href="https://pegasusbot.app/license" target="_blank" rel="noreferrer" className="text-foreground hover:underline">
                    pegasusbot.app/license
                  </a>
                  .
                </>
              )}
            </p>
          </div>

          {/* 2. Use of Websites & Portal */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '2. Nutzung der Websites und des Kundenportals' : '2. Use of the Websites and Portal'}
            </h2>
            <p className="text-sm mb-4">
              {isDe
                ? 'Die Nutzung der Websites und des Kundenportals ist ausschließlich zu rechtmäßigen Zwecken gestattet. Insbesondere ist es untersagt:'
                : "You may access and use VaultScope's websites and portal for lawful purposes only. In particular, you agree not to:"}
            </p>
            <ul className="flex flex-col gap-3 text-sm">
              {(isDe
                ? [
                    'Die Websites oder das Portal in einer Weise zu nutzen, die deren Betrieb, Sicherheit oder Verfügbarkeit beeinträchtigt oder überlastet.',
                    'Unbefugten Zugriff auf Systeme, Konten, APIs oder Netzwerke von VaultScope zu erlangen oder zu testen.',
                    'Automatisierte Tools (Scraper, Bots) einzusetzen, die eine unangemessene Last auf der Infrastruktur erzeugen.',
                    'Über die Websites, das Forum oder Support-Kanäle Schadcode, Spam oder rechtswidrige Inhalte zu übermitteln.',
                  ]
                : [
                    'Use the websites or portal in any manner that could damage, disable, overburden, or impair their availability or security.',
                    'Attempt to gain unauthorised access to any systems, accounts, APIs, or networks connected to VaultScope.',
                    'Use automated tools (scrapers, bots) in a manner that places an unreasonable load on VaultScope infrastructure.',
                    'Use the websites, forum, or support channels to transmit malicious code, spam, or unlawful content.',
                  ]
              ).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Hosting & Infrastructure Services */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '3. Hosting- und Infrastrukturdienste' : '3. Hosting & Infrastructure Services'}
            </h2>
            <p className="text-sm mb-4">
              {isDe
                ? 'VaultScope bietet SFTP Storage, Cloud VPS, Dedizierte Server und One-Click Deploy (OCD) je nach Verfügbarkeit an. Für kostenpflichtige wie kostenfreie/Test-Bestellungen gelten ergänzend:'
                : 'VaultScope offers SFTP Storage, Cloud VPS, Dedicated Server, and One-Click Deploy (OCD) services subject to availability. All paid and trial orders are additionally governed by:'}
            </p>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                <span>
                  {isDe ? 'Die ' : 'The '}
                  <Link to="/legal/hosting-terms/" className="text-foreground hover:underline">
                    {isDe ? 'Besonderen Hosting-Geschäftsbedingungen' : 'Hosting Terms'}
                  </Link>
                  {isDe
                    ? ' einschließlich Leistungsbeschreibungen, Abrechnungszyklen, Bereitstellungsfristen und Kündigungsregeln.'
                    : ' covering product specifications, billing cycles, provisioning lead times, and termination rules.'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                <span>
                  {isDe ? 'Die ' : 'The '}
                  <Link to="/legal/cancellation/" className="text-foreground hover:underline">
                    {isDe ? 'Widerrufsbelehrung' : 'Cancellation Policy'}
                  </Link>
                  {isDe
                    ? ' für Verbraucher (§ 13 BGB) sowie die '
                    : ' for consumers (§ 13 BGB) and the '}
                  <Link to="/legal/aup/" className="text-foreground hover:underline">
                    {isDe ? 'Nutzungsrichtlinie (AUP)' : 'Acceptable Use Policy'}
                  </Link>
                  .
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                <span>
                  {isDe
                    ? 'VaultScope behält sich vor, Bestellungen abzulehnen oder Dienste aus wichtigem Grund (z. B. AUP-Verstöße, Betrugsverdacht oder Zahlungsverzug nach Mahnung) zu sperren oder außerordentlich zu kündigen.'
                    : 'VaultScope reserves the right to refuse orders or suspend/terminate services for valid cause, including AUP violations, suspected fraud, or non-payment after notice.'}
                </span>
              </li>
            </ul>
          </div>

          {/* 4. Intellectual Property */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '4. Geistiges Eigentum' : '4. Intellectual Property'}
            </h2>
            <p className="text-sm mb-4">
              {isDe
                ? 'Name, Logo, visuelles Design und die Inhalte von VaultScope unterliegen dem Urheber- und Kennzeichenrecht von Anton Schmidt (VaultScope). Eine unbefugte Vervielfältigung oder kommerzielle Nutzung ohne vorherige Zustimmung oder ausdrückliche Open-Source-Lizenz ist untersagt.'
                : 'The VaultScope name, logo, visual identity, and website content are protected by copyright and trademark law held by VaultScope (Anton Schmidt). Unauthorised reproduction or commercial use without prior consent or an applicable open-source licence is prohibited.'}
            </p>
            <p className="text-sm">
              {isDe
                ? 'Open-Source-Komponenten von VaultScope (wie VAMOS und CAMOS) stehen unter der jeweils im Repository angegebenen Lizenz.'
                : 'Open-source software published by VaultScope (such as VAMOS and CAMOS) is licensed under the terms specified in the respective repository.'}
            </p>
          </div>

          {/* 5. Disclaimer */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '5. Gewährleistung für kostenfreie Website-Inhalte' : '5. Website Information & Availability'}
            </h2>
            <p className="text-sm">
              {isDe
                ? 'Allgemeine Informationsseiten werden ohne Gewähr für ununterbrochene Verfügbarkeit oder Vollständigkeit bereitgestellt. Gesetzliche Mängel- und Gewährleistungsrechte für entgeltliche Hosting-Verträge bleiben hiervon unberührt und richten sich nach den Besonderen Hosting-Geschäftsbedingungen sowie den gesetzlichen Vorschriften.'
                : 'Informational website pages are provided as available without warranty of uninterrupted access. Statutory warranty rights for paid hosting contracts remain unaffected and are governed by the Hosting Terms and applicable statutory law.'}
            </p>
          </div>

          {/* 6. Limitation of Liability */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '6. Haftungsbeschränkung' : '6. Limitation of Liability'}
            </h2>
            <p className="text-sm mb-4">
              {isDe
                ? 'VaultScope haftet nach den gesetzlichen Bestimmungen:'
                : 'VaultScope is liable in accordance with German statutory law as follows:'}
            </p>
            <ul className="flex flex-col gap-3 text-sm mb-4">
              {(isDe
                ? [
                    'Unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei Verletzung von Leben, Körper oder Gesundheit.',
                    'Bei einfacher Fahrlässigkeit nur bei Verletzung einer wesentlichen Vertragspflicht (Kardinalpflicht), deren Erfüllung die ordnungsgemäße Durchführung des Vertrags überhaupt erst ermöglicht, beschränkt auf den vertragstypischen, vorhersehbaren Schaden.',
                    'Im Übrigen ist die Haftung für mittelbare Schäden, entgangenen Gewinn oder Folgeschäden im gesetzlich zulässigen Umfang ausgeschlossen.',
                  ]
                : [
                    'Without limitation for damages caused by intent or gross negligence, and for injury to life, body, or health.',
                    'For simple negligence only where an essential contractual obligation (Kardinalpflicht) is breached, limited to foreseeable, contract-typical damage.',
                    'Otherwise, liability for indirect damages, loss of profit, or consequential loss is excluded to the extent permitted by law.',
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
                ? 'Die zwingende Haftung nach dem Produkthaftungsgesetz sowie wegen arglistigen Verschweigens oder Übernahme einer Garantie bleibt unberührt.'
                : 'Mandatory statutory liability under the German Product Liability Act (Produkthaftungsgesetz) and for fraudulent concealment or express guarantees remains unaffected.'}
            </p>
          </div>

          {/* 7. Third-Party Links */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '7. Links zu Drittanbietern' : '7. Third-Party Links'}
            </h2>
            <p className="text-sm">
              {isDe
                ? 'Unsere Websites enthalten Verlinkungen zu externen Websites Dritter (z. B. GitHub, Stripe). Für deren Inhalte und Datenschutzpraktiken sind ausschließlich die jeweiligen Betreiber verantwortlich.'
                : "VaultScope's websites contain links to third-party websites and services (such as GitHub or Stripe). Their respective operators are solely responsible for their content, terms, and privacy practices."}
            </p>
          </div>

          {/* 8. Changes to Terms (BGB § 308 Nr. 5 compliant) */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '8. Änderungen dieser AGB' : '8. Changes to These Terms'}
            </h2>
            <p className="text-sm mb-3">
              {isDe
                ? 'VaultScope kann diese AGB ändern, soweit dies aufgrund gesetzlicher Änderungen, neuer technischer Anforderungen oder berechtigter betrieblicher Gründe erforderlich ist und der Kunde hierdurch nicht entgegen Treu und Glauben unangemessen benachteiligt wird. Registrierte Kunden werden mindestens 30 Tage vor dem geplanten Inkrafttreten per E-Mail informiert.'
                : 'VaultScope may amend these Terms where necessary due to statutory changes, technical developments, or legitimate operational reasons, provided the Customer is not unreasonably disadvantaged. Registered customers will be notified by email at least 30 days before the proposed effective date.'}
            </p>
            <p className="text-sm">
              {isDe
                ? 'Bei unwesentlichen Änderungen, die keine Hauptleistungspflichten oder Entgelte betreffen, gelten die Änderungen als genehmigt, wenn der Kunde nicht innerhalb von 30 Tagen nach Zugang der Mitteilung widerspricht und auf diese Rechtsfolge in der Mitteilung ausdrücklich hingewiesen wurde (§ 308 Nr. 5 BGB). Wesentliche Änderungen zu Hauptleistungspflichten oder Preisen bei laufenden Verträgen mit Verbrauchern erfolgen ausschließlich mit ausdrücklicher Zustimmung.'
                : 'For minor, non-essential amendments not affecting core performance obligations or pricing, changes take effect if the Customer does not object within 30 days of receiving notice, provided this consequence was expressly highlighted in the notice (§ 308 Nr. 5 BGB). Material changes to core obligations or pricing for existing consumer contracts always require explicit consent.'}
            </p>
          </div>

          {/* 9. Governing Law */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '9. Anwendbares Recht und Gerichtsstand' : '9. Governing Law and Jurisdiction'}
            </h2>
            <p className="text-sm mb-4">
              {isDe
                ? 'Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG). Für Verbraucher mit gewöhnlichem Aufenthalt in der EU bleiben zwingende Verbraucherschutzvorschriften ihres Wohnsitzstaates unberührt.'
                : 'These Terms are governed by the laws of the Federal Republic of Germany, excluding the UN Convention on Contracts for the International Sale of Goods (CISG). Consumers resident in the EU retain the benefit of mandatory consumer protection provisions of their country of residence.'}
            </p>
            <p className="text-sm">
              {isDe
                ? 'Ist der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist Gerichtsstand Sachsenheim (bzw. das örtlich zuständige Gericht). Für Verbraucher gelten die gesetzlichen Gerichtsstände.'
                : 'For disputes with merchants, legal entities under public law, or special funds under public law, the place of jurisdiction is Sachsenheim, Germany. For consumers, statutory jurisdiction rules apply.'}
            </p>
          </div>

          {/* 10. Dispute Resolution */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '10. Streitbeilegung (§ 36 VSBG)' : '10. Dispute Resolution (§ 36 VSBG)'}
            </h2>
            <p className="text-sm">
              {isDe
                ? 'VaultScope ist weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.'
                : 'VaultScope is neither obligated nor willing to participate in dispute resolution proceedings before a consumer arbitration board pursuant to § 36 VSBG.'}
            </p>
          </div>

          {/* 11. Contact */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? '11. Kontakt' : '11. Contact'}
            </h2>
            <p className="text-sm">
              {isDe ? 'Fragen zu diesen AGB richten Sie bitte an ' : 'For questions regarding these Terms, contact VaultScope at '}
              <a href="mailto:administration@vaultscope.de" className="text-foreground hover:underline">
                administration@vaultscope.de
              </a>
              .
            </p>
          </div>

        </div>
      </LegalDocumentLayout>
    </div>
  );
};
