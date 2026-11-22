import { useEffect } from 'react';
import { PageHero, LegalDocumentLayout } from '../components/Shared';
import { SeoHead } from '../components/SeoHead';
import { useLanguage } from '../i18n';
import { LocaleLink as Link } from '../i18n/LocaleLink';

export const Imprint = () => {
  const { locale } = useLanguage();
  const isDe = locale === 'de';
  const title = isDe ? 'Impressum — VaultScope' : 'Imprint — VaultScope';

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="flex flex-col w-full">
      <SeoHead
        title={isDe ? 'Impressum' : 'Imprint'}
        description={
          isDe
            ? 'Gesetzliche Anbieterkennzeichnung und DSA-Kontaktstelle von VaultScope (Anton Schmidt, Einzelunternehmen) gemäß § 5 DDG.'
            : 'Legal notice pursuant to § 5 DDG and EU Digital Services Act (DSA) contact details for VaultScope.'
        }
        path={isDe ? '/de/legal/imprint' : '/legal/imprint'}
      />

      <PageHero
        title={isDe ? 'Impressum' : 'Imprint'}
        description={
          isDe
            ? 'Gesetzliche Anbieterkennzeichnung gemäß § 5 DDG und Kontaktstelle gemäß Art. 11 & 12 Digital Services Act (DSA).'
            : 'Legal notice pursuant to § 5 DDG (German Digital Services Act) and Art. 11 & 12 EU Digital Services Act (DSA).'
        }
        align="left"
      />

      <LegalDocumentLayout>
        <div className="flex flex-col gap-16 text-[var(--text-muted)] leading-relaxed">

          {/* Service Provider */}
          <div>
            <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">
              {isDe ? 'Diensteanbieter (§ 5 DDG)' : 'Service Provider (§ 5 DDG)'}
            </div>
            <div className="border-l-2 border-[var(--accent)] pl-6 py-1 text-sm leading-7">
              <p className="font-medium text-foreground text-base">Anton Schmidt</p>
              <p>{isDe ? 'VaultScope (Einzelunternehmen)' : 'VaultScope (Sole Proprietorship / Einzelunternehmen)'}</p>
              <p>Gottlob-Spieß-Straße 2</p>
              <p>74343 Sachsenheim</p>
              <p>{isDe ? 'Deutschland' : 'Germany'}</p>
              <div className="mt-4 pt-4 border-t border-border flex flex-col gap-1.5">
                <p>
                  <span className="text-foreground/40 uppercase tracking-widest text-xs mr-3">
                    {isDe ? 'E-Mail' : 'Email'}
                  </span>
                  <a href="mailto:administration@vaultscope.de" className="text-foreground hover:underline">
                    administration@vaultscope.de
                  </a>
                </p>
                <p>
                  <span className="text-foreground/40 uppercase tracking-widest text-xs mr-3">
                    {isDe ? 'Support' : 'Support'}
                  </span>
                  <a href="mailto:support@vaultscope.de" className="text-foreground hover:underline">
                    support@vaultscope.de
                  </a>
                </p>
                <p>
                  <span className="text-foreground/40 uppercase tracking-widest text-xs mr-3">
                    {isDe ? 'Direktkontakt' : 'Direct Contact'}
                  </span>
                  <Link to="/company/contact/" className="text-foreground hover:underline">
                    {isDe ? 'Kontakt- & Support-Kanäle' : 'Contact & Support Channels'}
                  </Link>
                  {' / '}
                  <Link to="/dashboard/support" className="text-foreground hover:underline">
                    {isDe ? 'Kunden-Ticket-Portal' : 'Customer Ticket Portal'}
                  </Link>
                </p>
              </div>
            </div>
            <p className="text-sm mt-6 text-foreground/50">
              {isDe ? (
                <>
                  Dieses Impressum gilt für die Websites{' '}
                  <strong className="text-foreground/70 font-medium">vaultscope.de</strong>,{' '}
                  <strong className="text-foreground/70 font-medium">pegasusbot.app</strong> sowie das VaultScope-Kundenportal und alle zugehörigen Dienste.
                </>
              ) : (
                <>
                  This imprint applies to the websites{' '}
                  <strong className="text-foreground/70 font-medium">vaultscope.de</strong> and{' '}
                  <strong className="text-foreground/70 font-medium">pegasusbot.app</strong>, the VaultScope customer portal, and associated services.
                </>
              )}
            </p>
          </div>

          {/* Legal Form & Tax Status */}
          <div>
            <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">
              {isDe ? 'Rechtsform & Steuerliche Hinweise' : 'Legal Form & Tax Information'}
            </div>
            <p className="text-sm mb-3">
              {isDe
                ? 'VaultScope wird als Einzelunternehmen nach deutschem Recht geführt. Ein Eintrag im Handelsregister besteht nicht.'
                : 'VaultScope is operated as a sole proprietorship (Einzelunternehmen) under German law and is not registered in the commercial register (Handelsregister).'}
            </p>
            <p className="text-sm">
              {isDe
                ? 'Eine Umsatzsteuer-Identifikationsnummer (USt-IdNr.) nach § 27a UStG besteht derzeit nicht. Sofern die Kleinunternehmerregelung gemäß § 19 UStG Anwendung findet, wird auf Rechnungen und im Checkout keine Umsatzsteuer ausgewiesen; andernfalls wird die jeweils gültige gesetzliche Umsatzsteuer ausgewiesen.'
                : 'VaultScope does not currently hold a VAT identification number (Umsatzsteuer-Identifikationsnummer) pursuant to § 27a UStG. Where the small business regulation pursuant to § 19 UStG (Kleinunternehmerregelung) applies, no VAT is charged or itemized; otherwise applicable statutory VAT is itemized at checkout and on invoices.'}
            </p>
          </div>

          {/* Responsible for Content */}
          <div>
            <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">
              {isDe ? 'Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)' : 'Responsible for Content (§ 18 Abs. 2 MStV)'}
            </div>
            <p className="text-sm mb-4">
              {isDe
                ? 'Verantwortlich für journalistisch-redaktionelle Inhalte gemäß § 18 Abs. 2 MStV:'
                : 'Person responsible for editorial content pursuant to § 18 Abs. 2 MStV:'}
            </p>
            <div className="border-l-2 border-[var(--accent)] pl-6 py-1 text-sm leading-7">
              <p className="font-medium text-foreground">Anton Schmidt</p>
              <p>Gottlob-Spieß-Straße 2</p>
              <p>74343 Sachsenheim</p>
              <p>{isDe ? 'Deutschland' : 'Germany'}</p>
            </div>
          </div>

          {/* Data Protection Contact */}
          <div>
            <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">
              {isDe ? 'Ansprechpartner für Datenschutz' : 'Data Protection Contact'}
            </div>
            <p className="text-sm mb-4">
              {isDe
                ? 'Verantwortlicher und zentraler Ansprechpartner für alle datenschutzrechtlichen Anfragen (ein gesetzlicher Datenschutzbeauftragter nach § 38 BDSG / Art. 37 DSGVO ist aufgrund der Unternehmensgröße nicht erforderlich):'
                : 'Data controller and primary point of contact for all data protection inquiries (a formal Data Protection Officer pursuant to § 38 BDSG / Art. 37 GDPR is not legally required):'}
            </p>
            <div className="border-l-2 border-[var(--accent)] pl-6 py-1 text-sm leading-7">
              <p className="font-medium text-foreground">Anton Schmidt</p>
              <p>Gottlob-Spieß-Straße 2</p>
              <p>74343 Sachsenheim, {isDe ? 'Deutschland' : 'Germany'}</p>
              <div className="mt-3 pt-3 border-t border-border flex flex-col gap-1">
                <p>
                  <span className="text-foreground/40 uppercase tracking-widest text-xs mr-3">
                    {isDe ? 'E-Mail' : 'Email'}
                  </span>
                  <a href="mailto:data@vaultscope.de" className="text-foreground hover:underline">
                    data@vaultscope.de
                  </a>
                  {' / '}
                  <a href="mailto:administration@vaultscope.de" className="text-foreground hover:underline">
                    administration@vaultscope.de
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* DSA Point of Contact */}
          <div>
            <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">
              {isDe
                ? 'Zentrale Kontaktstelle nach dem Digital Services Act (Art. 11 & 12 DSA)'
                : 'Single Point of Contact under the Digital Services Act (Art. 11 & 12 DSA)'}
            </div>
            <p className="text-sm mb-4">
              {isDe
                ? 'Zentrale elektronische Kontaktstelle für Behörden der EU-Mitgliedstaaten, die Europäische Kommission, das Gremium für digitale Dienste sowie für Nutzerinnen und Nutzer zur Meldung rechtswidriger Inhalte:'
                : 'Single electronic point of contact for EU Member State authorities, the European Commission, the European Board for Digital Services, and users for notices regarding allegedly illegal content:'}
            </p>
            <div className="border-l-2 border-[var(--accent)] pl-6 py-1 text-sm leading-7">
              <p>
                <span className="text-foreground/40 uppercase tracking-widest text-xs mr-3">
                  {isDe ? 'E-Mail' : 'Email'}
                </span>
                <a href="mailto:administration@vaultscope.de" className="text-foreground hover:underline">
                  administration@vaultscope.de
                </a>
              </p>
              <p>
                <span className="text-foreground/40 uppercase tracking-widest text-xs mr-3">
                  {isDe ? 'Meldeportal' : 'Report Portal'}
                </span>
                <Link to="/report/abuse" className="text-foreground hover:underline">
                  vaultscope.de/report
                </Link>
              </p>
              <p>
                <span className="text-foreground/40 uppercase tracking-widest text-xs mr-3">
                  {isDe ? 'Sprachen' : 'Languages'}
                </span>
                <span>{isDe ? 'Deutsch, Englisch' : 'German, English'}</span>
              </p>
            </div>
          </div>

          {/* Dispute Resolution */}
          <div>
            <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">
              {isDe ? 'Streitbeilegung (§ 36 VSBG)' : 'Dispute Resolution (§ 36 VSBG)'}
            </div>
            <p className="text-sm">
              {isDe
                ? 'VaultScope ist weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle gemäß § 36 VSBG (Verbraucherstreitbeilegungsgesetz) teilzunehmen.'
                : 'VaultScope is neither obligated nor willing to participate in dispute resolution proceedings before a consumer arbitration board pursuant to § 36 VSBG (Verbraucherstreitbeilegungsgesetz).'}
            </p>
          </div>

          {/* Liability for Content */}
          <div>
            <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">
              {isDe ? 'Haftung für Inhalte' : 'Liability for Content'}
            </div>
            <p className="text-sm mb-4">
              {isDe
                ? 'Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.'
                : 'The content of these websites has been compiled with reasonable care. However, VaultScope cannot guarantee the accuracy, completeness, or timeliness of the information provided.'}
            </p>
            <p className="text-sm">
              {isDe
                ? 'Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Eine Verpflichtung zur Überwachung übermittelter oder gespeicherter fremder Informationen besteht nicht; Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.'
                : 'As a service provider, VaultScope is responsible for its own content on these websites in accordance with general law. VaultScope is not obligated to monitor transmitted or stored third-party information or to investigate circumstances indicating unlawful activity. Obligations to remove or block the use of information pursuant to general law remain unaffected.'}
            </p>
          </div>

          {/* Liability for Links */}
          <div>
            <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">
              {isDe ? 'Haftung für Links' : 'Liability for Links'}
            </div>
            <p className="text-sm">
              {isDe
                ? 'Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.'
                : 'These websites contain links to external third-party websites over which VaultScope has no control. The respective provider or operator of the linked pages is always responsible for their content. Upon becoming aware of legal violations, VaultScope will remove such links immediately.'}
            </p>
          </div>

          {/* Copyright */}
          <div>
            <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">
              {isDe ? 'Urheberrecht' : 'Copyright'}
            </div>
            <p className="text-sm">
              {isDe
                ? 'Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht, soweit sie nicht ausdrücklich unter einer Open-Source- oder sonstigen freien Lizenz veröffentlicht werden. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bzw. der jeweiligen Lizenz bedürfen der schriftlichen Zustimmung des jeweiligen Autors.'
                : 'Content and works on these websites created by VaultScope are subject to German copyright law unless expressly released under an applicable open-source licence. Duplication, processing, distribution, or commercialisation beyond statutory copyright limits or the applicable licence requires prior written consent.'}
            </p>
          </div>

        </div>
      </LegalDocumentLayout>
    </div>
  );
};
