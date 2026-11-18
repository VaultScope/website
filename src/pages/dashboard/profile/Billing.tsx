import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard,
  Download,
  AlertTriangle,
  Clock,
  Lock,
  X,
  CheckCircle2,
} from 'lucide-react';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import {
  Elements,
  ExpressCheckoutElement,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { api } from '../../../lib/api';
import { useToast } from '../../../components/Toast';

interface InvoicePaymentModalProps {
  invoice: any;
  stripePromise: Promise<Stripe | null>;
  clientSecret: string;
  paymentIntentId: string;
  onClose: () => void;
  onPaid: () => void;
}

function InvoiceCheckoutForm({
  invoice,
  paymentIntentId,
  onSuccess,
}: {
  invoice: any;
  paymentIntentId: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [hasExpressMethods, setHasExpressMethods] = useState(false);

  const totalAmount = Number(invoice.total ?? invoice.amount ?? 0);

  const confirmPayment = async () => {
    if (!stripe || !elements) return;
    setProcessing(true);
    setError('');

    try {
      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/profile/billing`,
        },
        redirect: 'if_required',
      });

      if (submitError) {
        setError(submitError.message || 'Payment failed');
        setProcessing(false);
        return;
      }

      const confirmedPiId = paymentIntent?.id || paymentIntentId;
      await api.post(`/storefront/invoices/${invoice.id}/pay`, {
        payment_intent_id: confirmedPiId,
      });

      onSuccess();
    } catch (e: any) {
      setError(e?.message || 'Could not verify payment completion');
      setProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await confirmPayment();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className={hasExpressMethods ? 'space-y-3' : ''}>
        <ExpressCheckoutElement
          options={{
            paymentMethods: {
              applePay: 'always',
              googlePay: 'always',
              link: 'auto',
            },
            paymentMethodOrder: ['apple_pay', 'google_pay', 'link'],
            layout: {
              maxColumns: 2,
              maxRows: 1,
            },
          }}
          onReady={({ availablePaymentMethods }) => {
            if (availablePaymentMethods) {
              setHasExpressMethods(
                Boolean(
                  availablePaymentMethods.applePay ||
                    availablePaymentMethods.googlePay ||
                    availablePaymentMethods.link
                )
              );
            }
          }}
          onConfirm={confirmPayment}
        />

        {hasExpressMethods && (
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-[var(--line)]" />
            <span className="flex-shrink mx-3 text-[11px] font-mono uppercase tracking-wider text-[var(--fg-faint)]">
              Or pay with card / wallet
            </span>
            <div className="flex-grow border-t border-[var(--line)]" />
          </div>
        )}
      </div>

      <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--line)]">
        <PaymentElement
          options={{
            layout: 'tabs',
            wallets: {
              applePay: 'auto',
              googlePay: 'auto',
            },
            paymentMethodOrder: [
              'apple_pay',
              'google_pay',
              'card',
              'paypal',
              'klarna',
              'sepa_debit',
            ],
          }}
        />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg bg-rose-500/10 border border-rose-500/25 px-3.5 py-2.5 text-xs text-[var(--err)]"
        >
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="submit"
          disabled={!stripe || processing}
          className="vs-btn-primary w-full justify-center disabled:opacity-50"
        >
          <Lock className="w-3.5 h-3.5" />
          {processing ? 'Processing payment...' : `Pay €${totalAmount.toFixed(2)} Now`}
        </button>
      </div>
    </form>
  );
}

function InvoicePaymentModal({
  invoice,
  stripePromise,
  clientSecret,
  paymentIntentId,
  onClose,
  onPaid,
}: InvoicePaymentModalProps) {
  const invNum =
    invoice.invoice_number || `INV-${(invoice.id || '').slice(0, 8).toUpperCase()}`;
  const isDark =
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pay-invoice-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
    >
      <div className="bg-[var(--bg-elevated)] border border-[var(--line)] rounded-xl max-w-lg w-full p-6 space-y-5 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 id="pay-invoice-modal-title" className="text-base font-semibold text-[var(--fg)]">
              Pay Invoice {invNum}
            </h3>
            <p className="text-xs font-mono text-[var(--fg-muted)]">
              Amount due: €{Number(invoice.total ?? invoice.amount ?? 0).toFixed(2)}
              {invoice.due_date ? ` · Due ${invoice.due_date}` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment modal"
            className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-[var(--fg-faint)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: isDark ? 'night' : 'stripe',
              variables: {
                colorPrimary: '#6D28D9',
              },
            },
          }}
        >
          <InvoiceCheckoutForm
            invoice={invoice}
            paymentIntentId={paymentIntentId}
            onSuccess={onPaid}
          />
        </Elements>
      </div>
    </div>
  );
}

export function ProfileBilling() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [billingInfo, setBillingInfo] = useState<any>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [paymentModal, setPaymentModal] = useState<{
    invoice: any;
    stripePromise: Promise<Stripe | null>;
    clientSecret: string;
    paymentIntentId: string;
  } | null>(null);
  const { toast } = useToast();

  const loadBillingData = useCallback(() => {
    api
      .get('/storefront/invoices')
      .then((data) => {
        if (Array.isArray(data)) setInvoices(data);
      })
      .catch(() => {});

    api
      .get('/storefront/billing')
      .then((data) => {
        if (data) setBillingInfo(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadBillingData();
  }, [loadBillingData]);

  const handleDownloadPdf = async (invoiceId: string, invoiceNumber?: string) => {
    setDownloadingId(invoiceId);
    try {
      const token = localStorage.getItem('vs_token');
      const API_BASE =
        typeof window !== 'undefined' &&
        (window.location.hostname === 'vaultscope.de' ||
          window.location.hostname.endsWith('.vaultscope.de'))
          ? '/api'
          : import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const res = await fetch(`${API_BASE}/storefront/invoices/${invoiceId}/pdf`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to download PDF');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceNumber || `INV-${invoiceId.slice(0, 8)}`}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast(e.message || 'Could not download invoice PDF', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleStartPayInvoice = async (invoice: any) => {
    setPayingId(invoice.id);
    try {
      const [cfg, intent]: any[] = await Promise.all([
        api.get('/storefront/config'),
        api.post(`/storefront/invoices/${invoice.id}/create-payment-intent`),
      ]);
      const pubKey =
        cfg?.stripe_public_key ||
        cfg?.stripe_publishable_key ||
        import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
        import.meta.env.VITE_STRIPE_PUBLIC_KEY ||
        '';
      const clientSecret = intent?.client_secret;
      const paymentIntentId = intent?.payment_intent_id;
      if (!pubKey || !clientSecret || !paymentIntentId) {
        throw new Error('Stripe online payment is not configured yet.');
      }
      setPaymentModal({
        invoice,
        stripePromise: loadStripe(pubKey),
        clientSecret,
        paymentIntentId,
      });
    } catch (e: any) {
      toast(e?.message || 'Unable to initialize Stripe payment', 'error');
    } finally {
      setPayingId(null);
    }
  };

  const openInvoices = invoices.filter(
    (inv) => inv.status === 'pending' || inv.status === 'overdue'
  );
  const overdueInvoices = invoices.filter((inv) => inv.status === 'overdue');
  const dueSoonSubs = Array.isArray(billingInfo?.subscriptions)
    ? billingInfo.subscriptions.filter((sub: any) => sub.due_soon && !sub.cancel_at_period_end)
    : [];

  const openTotal = openInvoices.reduce(
    (sum, inv) => sum + parseFloat(inv.total ?? inv.amount ?? '0'),
    0
  );
  const hasUnpaid =
    openInvoices.length > 0 || Boolean(billingInfo?.has_unpaid_invoices);
  const hasOverdue =
    overdueInvoices.length > 0 || Boolean(billingInfo?.has_overdue_invoices);

  const displayedBalance =
    billingInfo?.balance || (openTotal > 0 ? `€${openTotal.toFixed(2)}` : '€0.00');

  const statusText = hasOverdue
    ? billingInfo?.status && billingInfo.status !== 'Payment current'
      ? billingInfo.status
      : `${overdueInvoices.length || 1} overdue invoice requiring immediate payment`
    : hasUnpaid
      ? billingInfo?.status && billingInfo.status !== 'Payment current'
        ? billingInfo.status
        : `${openInvoices.length || 1} open invoice awaiting payment`
      : 'No outstanding invoices';

  return (
    <div className="space-y-6">
      {/* Payment Warnings */}
      {hasOverdue && (
        <div
          role="alert"
          className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-[var(--err)] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs font-semibold text-[var(--err)]">
                Overdue Payment Required
              </div>
              <p className="text-xs text-[var(--fg-muted)]">
                You have {overdueInvoices.length || billingInfo?.overdue_invoices_count || 1}{' '}
                overdue invoice(s) totaling{' '}
                <span className="font-mono text-[var(--fg)]">{displayedBalance}</span>. Please
                complete payment to prevent service suspension.
              </p>
            </div>
          </div>
          {overdueInvoices[0] && (
            <button
              type="button"
              onClick={() => handleStartPayInvoice(overdueInvoices[0])}
              disabled={payingId === overdueInvoices[0].id}
              className="vs-btn-primary shrink-0"
            >
              {payingId === overdueInvoices[0].id ? 'Preparing...' : 'Pay Overdue Invoice'}
            </button>
          )}
        </div>
      )}

      {!hasOverdue && hasUnpaid && (
        <div
          role="status"
          className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-[var(--warn)] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs font-semibold text-[var(--warn)]">
                Open Invoice Awaiting Payment
              </div>
              <p className="text-xs text-[var(--fg-muted)]">
                You have {openInvoices.length || billingInfo?.open_invoices_count || 1} unpaid
                invoice(s) totaling{' '}
                <span className="font-mono text-[var(--fg)]">{displayedBalance}</span>.
              </p>
            </div>
          </div>
          {openInvoices[0] && (
            <button
              type="button"
              onClick={() => handleStartPayInvoice(openInvoices[0])}
              disabled={payingId === openInvoices[0].id}
              className="vs-btn-primary shrink-0"
            >
              {payingId === openInvoices[0].id ? 'Preparing...' : 'Pay Open Invoice'}
            </button>
          )}
        </div>
      )}

      {dueSoonSubs.length > 0 && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-4 sm:p-5 flex items-start gap-3">
          <Clock className="w-4 h-4 text-[var(--warn)] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[var(--warn)]">
              Upcoming Renewal Within 7 Days
            </div>
            <p className="text-xs text-[var(--fg-muted)]">
              {dueSoonSubs
                .map((sub: any) => `${sub.name} (${sub.price}, renews ${sub.next_date})`)
                .join(' · ')}
            </p>
          </div>
        </div>
      )}

      {/* Top Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-6 space-y-2">
          <div className="text-xs text-[var(--fg-faint)]">
            {hasUnpaid ? 'Open Invoice Balance' : 'Outstanding Balance'}
          </div>
          <div className="text-2xl font-semibold text-[var(--fg)] font-mono tabular-nums">
            {displayedBalance}
          </div>
          <div
            className={`text-xs ${
              hasOverdue
                ? 'text-[var(--err)]'
                : hasUnpaid
                  ? 'text-[var(--warn)]'
                  : 'text-[var(--ok)]'
            }`}
          >
            {statusText}
          </div>
        </div>

        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--fg-faint)]">Payment Method</span>
            <CreditCard className="w-4 h-4 text-[var(--accent-bright)]" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[var(--fg)]">Stripe Checkout</div>
            <div className="text-xs text-[var(--fg-muted)] mt-0.5">
              Cards, Apple Pay, Google Pay, PayPal, Klarna &amp; SEPA
            </div>
          </div>
          <div className="pt-1">
            {openInvoices[0] ? (
              <button
                type="button"
                onClick={() => handleStartPayInvoice(openInvoices[0])}
                disabled={payingId === openInvoices[0].id}
                className="vs-btn-primary"
              >
                {payingId === openInvoices[0].id
                  ? 'Preparing...'
                  : `Pay Open Invoice (€${Number(
                      openInvoices[0].total ?? openInvoices[0].amount ?? 0
                    ).toFixed(2)})`}
              </button>
            ) : (
              <div className="text-xs text-[var(--fg-faint)] inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--ok)]" />
                Processed securely per invoice via Stripe
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-6 space-y-2">
          <div className="text-xs text-[var(--fg-faint)]">Billing Entity</div>
          <div className="text-xs text-[var(--fg-muted)] space-y-1">
            <div className="text-sm font-medium text-[var(--fg)]">
              {billingInfo?.address?.name || 'Not configured'}
            </div>
            {billingInfo?.address?.company && <div>{billingInfo.address.company}</div>}
            {billingInfo?.address?.line1 && <div>{billingInfo.address.line1}</div>}
            {billingInfo?.address?.country && <div>{billingInfo.address.country}</div>}
            {billingInfo?.vat_id && (
              <div className="font-mono text-[var(--fg-faint)] pt-1">
                VAT: <span>{billingInfo.vat_id}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Subscriptions */}
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-[var(--fg-muted)]">Active Subscriptions</h2>
          {billingInfo?.next_charge && (
            <span className="text-xs font-mono text-[var(--fg-faint)]">
              Next renewal: {billingInfo.next_charge}
            </span>
          )}
        </div>
        {!billingInfo?.subscriptions || billingInfo.subscriptions.length === 0 ? (
          <div className="py-6 text-center text-xs text-[var(--fg-faint)]">
            No active subscriptions
          </div>
        ) : (
          <div className="divide-y divide-[var(--line)] border-t border-[var(--line)]">
            {billingInfo.subscriptions.map((sub: any) => (
              <div
                key={sub.id}
                className="py-3.5 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--fg)]">{sub.name}</span>
                    {sub.due_soon && !sub.cancel_at_period_end && (
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-[var(--warn)]">
                        Due soon
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-[var(--fg-faint)]">
                    {sub.description}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-semibold text-[var(--fg)]">
                    {sub.price}
                  </div>
                  <div className="text-[11px] font-mono text-[var(--fg-faint)]">
                    Renews {sub.next_date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoices */}
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-6 sm:p-8 space-y-4">
        <h2 className="text-sm font-medium text-[var(--fg-muted)]">Invoice Ledger</h2>
        {invoices.length === 0 ? (
          <div className="py-6 text-center text-xs text-[var(--fg-faint)]">No invoices found</div>
        ) : (
          <div className="divide-y divide-[var(--line)] border-t border-[var(--line)]">
            {invoices.map((inv) => {
              const invNum =
                inv.invoice_number || `INV-${(inv.id || '').slice(0, 8).toUpperCase()}`;
              const isPayable = inv.status === 'pending' || inv.status === 'overdue';
              const statusBadgeClass =
                inv.status === 'paid'
                  ? 'bg-emerald-500/15 text-[var(--ok)]'
                  : inv.status === 'overdue'
                    ? 'bg-rose-500/15 text-[var(--err)]'
                    : inv.status === 'pending'
                      ? 'bg-amber-500/15 text-[var(--warn)]'
                      : 'bg-[var(--bg-subtle)] text-[var(--fg-muted)]';

              return (
                <div
                  key={inv.id}
                  className="py-3.5 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <span className="text-xs font-mono font-semibold text-[var(--fg)]">
                      {invNum}
                    </span>
                    <span className="text-xs font-mono text-[var(--fg-muted)]">
                      {inv.issue_date || inv.date || '—'}
                    </span>
                    {isPayable && inv.due_date && (
                      <span className="text-xs font-mono text-[var(--fg-faint)]">
                        Due {inv.due_date}
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${statusBadgeClass}`}
                    >
                      {inv.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-semibold text-[var(--fg)] mr-1">
                      €{inv.total ?? inv.amount ?? '0.00'}
                    </span>
                    {isPayable && (
                      <button
                        type="button"
                        onClick={() => handleStartPayInvoice(inv)}
                        disabled={payingId === inv.id}
                        className="vs-btn-primary"
                      >
                        {payingId === inv.id ? 'Preparing...' : 'Pay Now'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDownloadPdf(inv.id, invNum)}
                      disabled={downloadingId === inv.id}
                      className="vs-btn-secondary inline-flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      PDF
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {paymentModal && (
        <InvoicePaymentModal
          invoice={paymentModal.invoice}
          stripePromise={paymentModal.stripePromise}
          clientSecret={paymentModal.clientSecret}
          paymentIntentId={paymentModal.paymentIntentId}
          onClose={() => setPaymentModal(null)}
          onPaid={() => {
            setPaymentModal(null);
            toast('Invoice paid successfully!', 'success');
            loadBillingData();
          }}
        />
      )}
    </div>
  );
}
