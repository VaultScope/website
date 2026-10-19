import { useState, useEffect } from 'react';
import { CreditCard, Download } from 'lucide-react';
import { api } from '../../../lib/api';
import { useToast } from '../../../components/Toast';

export function ProfileBilling() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [billingInfo, setBillingInfo] = useState<any>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDownloadPdf = async (invoiceId: string, invoiceNumber?: string) => {
    setDownloadingId(invoiceId);
    try {
      const token = localStorage.getItem('vs_token');
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
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

  useEffect(() => {
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

  return (
    <div className="space-y-6">
      {/* Top Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-6 space-y-2">
          <div className="text-xs text-[var(--fg-faint)]">Current Balance</div>
          <div className="text-2xl font-semibold text-[var(--fg)] font-mono tabular-nums">
            {billingInfo?.balance || '€0.00'}
          </div>
          <div className="text-xs text-[var(--ok)]">
            {billingInfo?.status || 'No outstanding balance'}
          </div>
        </div>

        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--fg-faint)]">Payment Method</span>
            <CreditCard className="w-4 h-4 text-[var(--accent-bright)]" />
          </div>
          <div>
            <div className="text-sm font-mono font-semibold text-[var(--fg)]">
              •••• {billingInfo?.card_last4 || '----'}
            </div>
            <div className="text-xs font-mono text-[var(--fg-muted)]">
              Exp {billingInfo?.card_exp || '--/--'}
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              disabled
              className="text-xs text-[var(--fg-faint)] cursor-not-allowed opacity-50"
            >
              Update
            </button>
            <button
              type="button"
              disabled
              className="text-xs text-[var(--fg-faint)] cursor-not-allowed opacity-50"
            >
              Remove
            </button>
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
        <h2 className="text-sm font-medium text-[var(--fg-muted)]">Active Subscriptions</h2>
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
                  <div className="text-sm font-medium text-[var(--fg)]">{sub.name}</div>
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
              return (
                <div
                  key={inv.id}
                  className="py-3.5 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono font-semibold text-[var(--fg)]">
                      {invNum}
                    </span>
                    <span className="text-xs font-mono text-[var(--fg-muted)]">
                      {inv.issue_date || inv.date || '—'}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-[var(--ok)]">
                      {inv.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono font-semibold text-[var(--fg)]">
                      €{inv.total ?? inv.amount ?? '0.00'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDownloadPdf(inv.id, invNum)}
                      disabled={downloadingId === inv.id}
                      className="vs-btn-secondary !px-3 !py-1 !text-xs inline-flex items-center gap-1.5"
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
    </div>
  );
}
