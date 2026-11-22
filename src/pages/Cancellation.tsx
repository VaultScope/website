import { useEffect } from 'react';
import { PageHero, LegalDocumentLayout } from '../components/Shared';
import { SeoHead } from '../components/SeoHead';
import { useLanguage } from '../i18n';

export const Cancellation = () => {
  const { locale } = useLanguage();
  const isDe = locale === 'de';
  const title = isDe
    ? 'Widerrufsbelehrung — VaultScope'
    : 'Cancellation Policy — VaultScope';

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="flex flex-col w-full">
      <SeoHead
        title={isDe ? 'Widerrufsbelehrung' : 'Cancellation Policy'}
        description={
          isDe
            ? 'Gesetzliche Widerrufsbelehrung und Muster-Widerrufsformular für Verbraucher beim Bezug von VaultScope Hosting-Diensten.'
            : 'Statutory right of withdrawal and model withdrawal form for consumers purchasing VaultScope hosting services.'
        }
        path={isDe ? '/de/legal/cancellation' : '/legal/cancellation'}
      />

      <PageHero
        title={isDe ? 'Widerrufsbelehrung' : 'Cancellation Policy'}
        description={
          isDe
            ? 'Informationen zum gesetzlichen Widerrufsrecht für Verbraucher (§ 13 BGB).'
            : 'Statutory right of withdrawal for consumers (§ 13 BGB) purchasing VaultScope hosting services.'
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
                ? 'Diese Widerrufsbelehrung gilt ausschließlich für Verbraucher (§ 13 BGB). Kunden, die als Unternehmer (§ 14 BGB) handeln, steht kein gesetzliches Widerrufsrecht zu.'
                : 'This Cancellation Policy applies exclusively to consumers (natural persons acting outside a trade, business, or profession pursuant to § 13 BGB). Customers acting as businesses (Unternehmer, § 14 BGB) do not have a statutory right of withdrawal.'}
            </p>
          </div>

          {/* Right of Withdrawal */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? 'Widerrufsbelehrung' : 'Right of Withdrawal'}
            </h2>

            <div className="border border-border p-8 mb-8">
              <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-5">
                {isDe ? 'Widerrufsrecht' : 'Widerrufsbelehrung / Notice of Right of Withdrawal'}
              </p>

              <h3 className="text-base font-medium text-foreground tracking-tight mb-4">
                {isDe ? 'Widerrufsrecht' : 'Right of Withdrawal'}
              </h3>
              <p className="text-sm mb-4">
                {isDe
                  ? 'Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.'
                  : 'You have the right to withdraw from this contract within fourteen days without giving any reason.'}
              </p>
              <p className="text-sm mb-4">
                {isDe
                  ? 'Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.'
                  : 'The withdrawal period is fourteen days from the date on which the contract is concluded.'}
              </p>
              <p className="text-sm mb-4">
                {isDe
                  ? 'Um Ihr Widerrufsrecht auszuüben, müssen Sie uns:'
                  : 'To exercise your right of withdrawal, you must inform us:'}
              </p>
              <div className="border border-border p-6 text-sm leading-7 mb-4">
                <p className="font-medium text-foreground">Anton Schmidt</p>
                <p>VaultScope (Einzelunternehmen)</p>
                <p>Gottlob-Spieß-Straße 2</p>
                <p>74343 Sachsenheim</p>
                <p>{isDe ? 'Deutschland' : 'Germany'}</p>
                <p className="mt-3">
                  {isDe ? 'E-Mail: ' : 'Email: '}
                  <a href="mailto:administration@vaultscope.de" className="text-foreground hover:underline">
                    administration@vaultscope.de
                  </a>
                </p>
              </div>
              <p className="text-sm mb-4">
                {isDe
                  ? 'mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.'
                  : 'of your decision to withdraw from this contract by means of an unambiguous statement (e.g. a letter sent by post or an email). You may use the model withdrawal form provided at the end of this page, though it is not obligatory.'}
              </p>
              <p className="text-sm">
                {isDe
                  ? 'Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.'
                  : 'To meet the withdrawal deadline, it is sufficient for you to send your communication concerning your exercise of the right of withdrawal before the withdrawal period expires.'}
              </p>
            </div>

            <div className="border border-border p-8 mb-8">
              <h3 className="text-base font-medium text-foreground tracking-tight mb-4">
                {isDe ? 'Folgen des Widerrufs' : 'Consequences of Withdrawal'}
              </h3>
              <p className="text-sm mb-4">
                {isDe
                  ? 'Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.'
                  : 'If you withdraw from this contract, we will reimburse all payments received from you without undue delay and in any event not later than fourteen days from the day on which we are informed about your decision to withdraw. We will use the same means of payment as you used for the initial transaction, unless expressly agreed otherwise; you will not incur any fees as a result of the reimbursement.'}
              </p>
              <p className="text-sm font-medium text-foreground/70">
                {isDe
                  ? 'Wertersatz bei vorzeitigem Beginn der Dienstleistung (§ 357a Abs. 2 BGB):'
                  : 'Proportionate compensation for services commenced before expiry of the withdrawal period (§ 357a(2) BGB):'}
              </p>
              <p className="text-sm mt-2">
                {isDe
                  ? 'Haben Sie im Bestellprozess ausdrücklich verlangt, dass die Bereitstellung der Infrastruktur- oder Speicherdienstleistung bereits während der Widerrufsfrist beginnen soll, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht (tagesanteilige Berechnung für den laufenden Abrechnungszeitraum).'
                  : 'If you expressly requested during checkout that provisioning begin during the withdrawal period, you must pay a proportionate amount corresponding to the services already provided up to the moment you notified us of your withdrawal, compared to the full scope of the contract (calculated on a pro-rata daily basis for the active billing period).'}
              </p>
            </div>

            <div className="border border-border p-8 mb-8">
              <h3 className="text-base font-medium text-foreground tracking-tight mb-4">
                {isDe
                  ? 'Vorzeitiges Erlöschen bei vollständiger Vertragserfüllung (§ 356 Abs. 4 BGB)'
                  : 'Early Expiry of the Right of Withdrawal (§ 356(4) BGB)'}
              </h3>
              <p className="text-sm mb-4">
                {isDe
                  ? 'Bei einem Vertrag über die Erbringung von Dienstleistungen (etwa einer einmaligen Server-Einrichtung bzw. Setup-Leistung) erlischt das Widerrufsrecht vorzeitig, wenn VaultScope die geschuldete Dienstleistung vollständig erbracht hat und mit der Ausführung der Dienstleistung erst begonnen hat, nachdem Sie dazu Ihre ausdrückliche Zustimmung gegeben und gleichzeitig Ihre Kenntnis davon bestätigt haben, dass Sie Ihr Widerrufsrecht bei vollständiger Vertragserfüllung durch VaultScope verlieren.'
                  : 'For service contracts (such as one-time setup or provisioning fees), the right of withdrawal expires early if VaultScope has fully performed the service and only began performance after you gave your express prior consent and simultaneously confirmed your acknowledgement that you lose your right of withdrawal once the contract is fully performed.'}
              </p>
              <p className="text-sm">
                {isDe
                  ? 'Im Checkout unseres Kundenportals bestätigen Sie vor Bestellabschluss per ausdrücklicher Checkbox Ihren Wunsch nach sofortiger Bereitstellung sowie die Kenntnisnahme der gesetzlichen Folgen (Wertersatz bei laufenden Diensten gemäß § 357a Abs. 2 BGB bzw. Erlöschen bei vollständig erbrachten Einmalleistungen gemäß § 356 Abs. 4 BGB).'
                  : 'During checkout in the customer portal, an explicit confirmation checkbox records your express request for immediate provisioning and your acknowledgement of the statutory consequences (proportionate compensation for ongoing services under § 357a(2) BGB and early expiry upon full performance of one-time services under § 356(4) BGB).'}
              </p>
            </div>
          </div>

          {/* Contractual Cancellation */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? 'Ordentliche Kündigung nach Ablauf der Widerrufsfrist' : 'Ordinary Contract Cancellation'}
            </h2>
            <p className="text-sm mb-4">
              {isDe
                ? 'Das gesetzliche Widerrufsrecht besteht nur innerhalb der ersten 14 Tage ab Vertragsschluss. Danach gelten die Kündigungsregelungen der Besonderen Hosting-Geschäftsbedingungen:'
                : 'The statutory right of withdrawal applies only within the first 14 days after contract conclusion. Thereafter, cancellation is governed by the Hosting Terms:'}
            </p>
            <ul className="flex flex-col gap-3 text-sm">
              {(isDe
                ? [
                    'Die Vertragslaufzeit richtet sich nach dem gewählten Abrechnungszyklus (standardmäßig 1 Monat).',
                    'Im Kundenportal können Sie jederzeit zum Ende des laufenden Abrechnungszeitraums („At Period End“) oder auf eigenen Wunsch sofort unter sofortiger Datenlöschung („Immediately“) kündigen – oder per E-Mail an administration@vaultscope.de.',
                    'Bei Kündigung zum Laufzeitende läuft der Dienst bis zum Ende der bezahlten Periode weiter; bei vorzeitiger Selbstkündigung nach Ablauf des Widerrufsrechts erfolgt keine anteilige Rückerstattung.',
                  ]
                : [
                    'The contract term corresponds to the selected billing cycle (typically 1 month).',
                    'In the customer portal, you may cancel at any time either at the end of the current billing period ("At Period End") or immediately with immediate data erasure ("Immediately"), or by email to administration@vaultscope.de.',
                    'Cancellation at period end takes effect at the end of the paid period; no refunds are issued for unused time within an active period after the statutory withdrawal period has expired.',
                  ]
              ).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-px h-4 bg-foreground/20 block shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Model Form */}
          <div>
            <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
              {isDe ? 'Muster-Widerrufsformular' : 'Model Withdrawal Form'}
            </h2>
            <p className="text-sm mb-6">
              {isDe
                ? '(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)'
                : 'Complete and return this form only if you wish to withdraw from the contract.'}
            </p>
            <div className="border border-border p-8 text-sm leading-8 bg-foreground/[0.01]">
              <p className="font-medium text-foreground mb-4">
                {isDe ? 'Muster-Widerrufsformular' : 'Model Withdrawal Form'}
              </p>
              <p>{isDe ? 'An:' : 'To:'}</p>
              <div className="ml-4 mb-4">
                <p>Anton Schmidt / VaultScope</p>
                <p>Gottlob-Spieß-Straße 2, 74343 Sachsenheim, {isDe ? 'Deutschland' : 'Germany'}</p>
                <p>
                  {isDe ? 'E-Mail: ' : 'Email: '}
                  <a href="mailto:administration@vaultscope.de" className="text-foreground hover:underline">
                    administration@vaultscope.de
                  </a>
                </p>
              </div>
              <p className="mb-4">
                {isDe
                  ? 'Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung:'
                  : 'I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract for the provision of the following service:'}
              </p>
              <div className="ml-4 mb-4 text-foreground/50 text-xs">
                <p>{isDe ? '[Bezeichnung des Dienstes / Bestellnummer]' : '[Description of service / order number]'}</p>
              </div>
              <p className="mb-2">{isDe ? 'Bestellt am (*):' : 'Ordered on (*):'} ___________________________</p>
              <p className="mb-2">{isDe ? 'Name des/der Verbraucher(s):' : 'Name of consumer(s):'} ___________________________</p>
              <p className="mb-2">{isDe ? 'Anschrift des/der Verbraucher(s):' : 'Address of consumer(s):'} ___________________________</p>
              <p className="mb-4">
                {isDe
                  ? 'Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):'
                  : 'Signature of consumer(s) (only if this form is notified on paper):'}{' '}
                ___________________________
              </p>
              <p className="mb-4">{isDe ? 'Datum:' : 'Date:'} ___________________________</p>
              <p className="text-xs text-foreground/40">
                {isDe ? '(*) Unzutreffendes streichen.' : '(*) Delete as appropriate.'}
              </p>
            </div>
          </div>

        </div>
      </LegalDocumentLayout>
    </div>
  );
};
