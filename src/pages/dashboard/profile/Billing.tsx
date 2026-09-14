import { useEffect, useState } from 'react';
import { CreditCard, Download } from 'lucide-react';
import { Button } from '../../../components/Shared';
import { api } from '../../../lib/api';
import { useToast } from '../../../components/Toast';

export function ProfileBilling() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [billingInfo, setBillingInfo] = useState<any>(null);
  const { error } = useToast();

  useEffect(() => {
    api.get<any[]>('/storefront/invoices')
      .then(res => setInvoices(Array.isArray(res) ? res : []))
      .catch(err => {
        console.error(err);
        error('Failed to load invoices');
      });

    api.get<any>('/storefront/billing')
      .then(res => setBillingInfo(res))
      .catch(err => {
        console.error(err);
        error('Failed to load billing information');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      {/* Balance & Payment Method */}
      <div className="grid md:grid-cols-2 gap-px border border-border bg-border">
        <div className="bg-background p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Balance due</p>
          <div className="text-2xl font-light mb-1">{billingInfo?.balance || '€0.00'}</div>
          <p className="text-xs text-muted-foreground">Next charge: {billingInfo?.next_charge || '—'}</p>
          <p className="text-xs text-green-500 mt-1">{billingInfo?.status || 'Payment current'}</p>
        </div>
        <div className="bg-background p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Payment method</p>
          <div className="flex items-center gap-3 mb-3">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-mono">•••• {billingInfo?.card_last4 || '----'}</span>
            <span className="text-xs text-muted-foreground">Exp {billingInfo?.card_exp || '--/--'}</span>
          </div>
          <div className="flex gap-2">
            <Button disabled title="Coming soon" variant="outline" className="h-7 px-3 text-xs">Update</Button>
            <Button disabled title="Coming soon" variant="outline" className="h-7 px-3 text-xs border-red-500/20 text-red-500 hover:bg-red-500/5">Remove</Button>
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/40">Billing Address</h2>
          <Button disabled title="Coming soon" variant="outline" className="h-7 px-3 text-xs">Edit</Button>
        </div>
        <div className="border border-border divide-y divide-border">
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Name</span>
            <span className="text-sm">{billingInfo?.address?.name || '—'}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Company</span>
            <span className="text-sm">{billingInfo?.address?.company || '—'}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Address</span>
            <span className="text-sm text-right">{billingInfo?.address?.line1 || '—'}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Country</span>
            <span className="text-sm">{billingInfo?.address?.country || '—'}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">VAT ID</span>
            <span className="text-sm font-mono">{billingInfo?.vat_id || '—'}</span>
          </div>
        </div>
      </div>

      {/* Active Subscriptions */}
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/40 mb-3">Active Subscriptions</h2>
        <div className="border border-border divide-y divide-border">
          {billingInfo?.subscriptions?.map((sub: any) => (
            <div key={sub.id} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <div className="text-sm font-medium">{sub.name}</div>
                <div className="text-xs text-muted-foreground">{sub.description}</div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm font-medium">{sub.price}</div>
                  <div className="text-xs text-muted-foreground">Next: {sub.next_date}</div>
                </div>
                <Button disabled title="Coming soon" variant="outline" className="h-7 px-3 text-xs">Manage</Button>
              </div>
            </div>
          ))}
          {!billingInfo?.subscriptions?.length && (
            <div className="px-5 py-4 text-sm text-muted-foreground text-center">No active subscriptions</div>
          )}
        </div>
      </div>

      {/* Invoices */}
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/40 mb-3">Invoice History</h2>
        <div className="border border-border overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border">
              <tr className="text-xs uppercase tracking-wider text-foreground/40">
                <th className="px-5 py-3 font-medium">Invoice</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.length > 0 ? invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-foreground/[0.02] transition-colors">
                  <td className="px-5 py-3 font-mono text-xs">{inv.invoice_number}</td>
                  <td className="px-5 py-3">{inv.issue_date}</td>
                  <td className="px-5 py-3">€{inv.total}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-green-500">{inv.status}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="inline-flex items-center gap-1 text-xs text-foreground/60 hover:text-foreground cursor-pointer">
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground text-sm">No invoices found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
