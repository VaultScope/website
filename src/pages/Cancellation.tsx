import { useEffect } from 'react';
import { PageHero } from '../components/Shared';

export const Cancellation = () => {
  useEffect(() => {
    document.title = "Cancellation Policy — VaultScope";
  }, []);

  return (
    <div className="flex flex-col w-full">
      <PageHero
        title="Cancellation Policy"
        description="Right of withdrawal for consumers purchasing VaultScope hosting services."
        align="left"
      />

      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="flex flex-col gap-16 text-foreground/70 font-light leading-relaxed">

            <div>
              <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-3">Version</div>
              <p className="text-sm text-foreground/50">Last updated: August 2026</p>
              <p className="text-sm mt-4">
                This Cancellation Policy applies to consumers (natural persons acting outside a
                trade, business, or profession) purchasing VaultScope hosting services. Customers
                acting as businesses (Unternehmer, § 14 BGB) do not have a statutory right of
                withdrawal and this policy does not apply to them.
              </p>
            </div>

            {/* Right of Withdrawal */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
                Right of Withdrawal
              </h2>

              <div className="border border-border p-8 mb-8">
                <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-5">
                  Widerrufsbelehrung / Notice of Right of Withdrawal
                </p>

                <h3 className="text-base font-medium text-foreground tracking-tight mb-4">
                  Right of Withdrawal
                </h3>
                <p className="text-sm mb-4">
                  You have the right to withdraw from this contract within fourteen days without
                  giving any reason.
                </p>
                <p className="text-sm mb-4">
                  The withdrawal period is fourteen days from the date on which the contract is concluded.
                </p>
                <p className="text-sm mb-4">
                  To exercise your right of withdrawal, you must inform us:
                </p>
                <div className="border border-border p-6 text-sm leading-7 mb-4">
                  <p className="font-medium text-foreground">Anton Schmidt</p>
                  <p>VaultScope (Einzelunternehmen)</p>
                  <p>Gottlob-Spieß-Straße 2</p>
                  <p>74343 Sachsenheim</p>
                  <p>Germany</p>
                  <p className="mt-3">
                    Email:{' '}
                    <a href="mailto:cptcr@proton.me" className="text-foreground hover:underline">
                      cptcr@proton.me
                    </a>
                  </p>
                </div>
                <p className="text-sm mb-4">
                  of your decision to withdraw from this contract by means of an unambiguous statement
                  (e.g. a letter sent by post or an email). You may use the model withdrawal form
                  provided at the end of this page, but it is not obligatory.
                </p>
                <p className="text-sm">
                  To meet the withdrawal deadline, it is sufficient for you to send your communication
                  concerning your exercise of the right of withdrawal before the withdrawal period
                  has expired.
                </p>
              </div>

              <div className="border border-border p-8 mb-8">
                <h3 className="text-base font-medium text-foreground tracking-tight mb-4">
                  Consequences of Withdrawal
                </h3>
                <p className="text-sm mb-4">
                  If you withdraw from this contract, we will reimburse all payments received from
                  you, without undue delay and in any event not later than fourteen days from the day
                  on which we are informed about your decision to withdraw. We will use the same means
                  of payment as you used for the initial transaction, unless you have expressly agreed
                  otherwise; in any event, you will not incur any fees as a result of the reimbursement.
                </p>
                <p className="text-sm font-medium text-foreground/70">
                  Special provision for services commenced before expiry of the withdrawal period:
                </p>
                <p className="text-sm mt-2">
                  If you have requested that services begin before the end of the withdrawal period,
                  you must pay us an amount proportional to the services provided up to the point at
                  which you informed us of your exercise of the right of withdrawal, compared to the
                  full price under the contract. The proportional amount is calculated on a pro-rata
                  daily basis for the current billing month.
                </p>
              </div>

              <div className="border border-border p-8 mb-8">
                <h3 className="text-base font-medium text-foreground tracking-tight mb-4">
                  Exclusion of the Right of Withdrawal
                </h3>
                <p className="text-sm mb-4">
                  The right of withdrawal expires before the end of the withdrawal period for service
                  contracts if VaultScope has fully performed the service and performance only began
                  after you gave your express prior consent and acknowledged that you would lose your
                  right of withdrawal once the contract was fully performed by VaultScope.
                </p>
                <p className="text-sm">
                  During the order process, if you select immediate service activation, you will be
                  presented with an explicit checkbox requiring you to acknowledge: (1) that you
                  request immediate commencement of the service; and (2) that you understand that
                  your right of withdrawal is reduced once the service has commenced. Where you do
                  not provide this consent, service activation will not begin until the 14-day
                  withdrawal period has expired.
                </p>
              </div>

            </div>

            {/* Contractual Cancellation */}
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight mb-5">
                Ordinary Contract Cancellation
              </h2>
              <p className="text-sm mb-4">
                The statutory right of withdrawal described above applies only within the first
                14 days of the contract. After this period, cancellation is governed by the
                Hosting General Terms and Conditions:
              </p>
              <ul className="flex flex-col gap-3 text-sm">
                {[
                  'Services are contracted on a minimum 1-month term.',
                  'To cancel, submit notice at least 7 days before the next billing date.',
                  'Cancellation takes effect at the end of the current billing period.',
                  'No refunds are issued for unused time within a billing period after the withdrawal period has expired.',
                ].map((item, i) => (
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
                Model Withdrawal Form
              </h2>
              <p className="text-sm mb-6">
                Complete and return this form only if you wish to withdraw from the contract.
              </p>
              <div className="border border-border p-8 text-sm leading-8 bg-foreground/[0.01]">
                <p className="font-medium text-foreground mb-4">Model Withdrawal Form</p>
                <p>To:</p>
                <div className="ml-4 mb-4">
                  <p>Anton Schmidt / VaultScope</p>
                  <p>Gottlob-Spieß-Straße 2, 74343 Sachsenheim, Germany</p>
                  <p>
                    Email:{' '}
                    <a href="mailto:cptcr@proton.me" className="text-foreground hover:underline">
                      cptcr@proton.me
                    </a>
                  </p>
                </div>
                <p className="mb-4">
                  I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract for
                  the provision of the following service:
                </p>
                <div className="ml-4 mb-4 text-foreground/50 text-xs">
                  <p>[Description of service / order number]</p>
                </div>
                <p className="mb-2">Ordered on (*): ___________________________</p>
                <p className="mb-2">Name of consumer(s): ___________________________</p>
                <p className="mb-2">Address of consumer(s): ___________________________</p>
                <p className="mb-4">
                  Signature of consumer(s) (only if this form is notified on paper):
                  ___________________________
                </p>
                <p className="mb-4">Date: ___________________________</p>
                <p className="text-xs text-foreground/40">(*) Delete as appropriate.</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
