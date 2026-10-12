import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Download, RotateCcw, Mail, Plus, Trash2, CheckCircle2, Clock, Building } from 'lucide-react';
import { Button } from '../../../components/Shared';
import { api } from '../../../lib/api';
import { useToast } from '../../../components/Toast';
import { CancelServiceModal } from '../../../components/CancelServiceModal';

interface BillingEmail {
  id: string;
  email: string;
  label?: string | null;
  verified: boolean;
  created_at: string;
  verified_at?: string | null;
}

export function ProfileBilling() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [billingInfo, setBillingInfo] = useState<any>(null);
  const [cancellingSub, setCancellingSub] = useState<any | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [billingEmails, setBillingEmails] = useState<BillingEmail[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newEmailLabel, setNewEmailLabel] = useState('');
  const [addingEmail, setAddingEmail] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const { error, success } = useToast();

  const loadBilling = () => {
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

    api.get<any>('/storefront/profile')
      .then(p => {
        setProfile(p);
        if (p?.company) {
          api.get<BillingEmail[]>('/storefront/profile/billing-emails')
            .then(res => setBillingEmails(Array.isArray(res) ? res : []))
            .catch(() => {});
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadBilling();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRevoke = async (serviceId: string) => {
    try {
      await api.post(`/storefront/services/${serviceId}/uncancel`);
      success('Cancellation revoked! Your subscription will continue renewing.');
      loadBilling();
    } catch (err: any) {
      error(err?.message || 'Failed to revoke cancellation');
    }
  };

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setAddingEmail(true);
    try {
      const added = await api.post<BillingEmail>('/storefront/profile/billing-emails', {
        email: newEmail.trim(),
        label: newEmailLabel.trim() || undefined,
      });
      setBillingEmails(prev => [...prev, added]);
      setNewEmail('');
      setNewEmailLabel('');
      success('Verification email sent to recipient. Once verified, invoices will be CC\'d to this address.');
    } catch (err: any) {
      error(err?.message || 'Failed to add billing email');
    } finally {
      setAddingEmail(false);
    }
  };

  const handleResendVerification = async (id: string) => {
    setResendingId(id);
    try {
      await api.post(`/storefront/profile/billing-emails/${id}/resend`, {});
      success('Verification link resent successfully');
    } catch (err: any) {
      error(err?.message || 'Failed to resend verification link');
    } finally {
      setResendingId(null);
    }
  };

  const handleDownloadPdf = async (invId: string, invoiceNumber: string) => {
    try {
      const token = localStorage.getItem('vs_token');
      const res = await fetch(`/api/storefront/invoices/${invId}/pdf`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      if (!res.ok) throw new Error('Failed to download invoice PDF');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      success(`Invoice ${invoiceNumber} downloaded.`);
    } catch (err: any) {
      error(err?.message || 'Failed to download invoice PDF');
    }
  };

  const handleDeleteEmail = async (id: string) => {
    if (!confirm('Are you sure you want to remove this invoice recipient?')) return;
    try {
      await api.delete(`/storefront/profile/billing-emails/${id}`);
      setBillingEmails(prev => prev.filter(e => e.id !== id));
      success('Invoice recipient removed');
    } catch (err: any) {
      error(err?.message || 'Failed to remove invoice recipient');
    }
  };

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

      {/* Additional Invoice Recipients (CC) - Business Only */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/40">Invoice CC Recipients</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Automatically deliver invoice copies to accounting or finance team members.</p>
          </div>
          {profile?.company && (
            <span className="text-[11px] font-mono px-2 py-0.5 border border-blue-500/30 bg-blue-500/10 text-blue-400 rounded">
              Business Account
            </span>
          )}
        </div>

        {!profile?.company ? (
          <div className="border border-border p-5 bg-foreground/[0.01] flex items-start gap-3">
            <Building className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium mb-1">Business Feature</div>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Multi-email invoice CC is exclusively available for business accounts. Add your registered company name in your profile to unlock additional invoice recipients.
              </p>
              <Link to="/dashboard/profile">
                <Button variant="outline" className="h-7 px-3 text-xs">
                  Update Account Profile
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border border-border divide-y divide-border">
              {billingEmails.length > 0 ? (
                billingEmails.map(item => (
                  <div key={item.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-foreground/[0.01] transition-colors">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div>
                        <div className="text-sm font-mono flex items-center gap-2">
                          <span>{item.email}</span>
                          {item.label && (
                            <span className="text-xs font-sans px-2 py-0.5 bg-muted text-muted-foreground rounded">
                              {item.label}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                          {item.verified ? (
                            <span className="text-green-500 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Verified for Invoice CC
                            </span>
                          ) : (
                            <span className="text-amber-500 inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Verification Pending (Invoices won't be sent until verified)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!item.verified && (
                        <Button
                          onClick={() => handleResendVerification(item.id)}
                          disabled={resendingId === item.id}
                          variant="outline"
                          className="h-7 px-3 text-xs"
                        >
                          {resendingId === item.id ? 'Sending...' : 'Resend Link'}
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDeleteEmail(item.id)}
                        variant="outline"
                        className="h-7 px-2.5 text-xs text-red-500 border-red-500/20 hover:bg-red-500/5"
                        title="Remove recipient"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-4 text-center text-sm text-muted-foreground">
                  No additional recipients added. Invoices are delivered only to your primary account email.
                </div>
              )}
            </div>

            {billingEmails.length < 5 && (
              <form onSubmit={handleAddEmail} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="e.g. accounting@company.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="flex-1 bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                />
                <input
                  type="text"
                  placeholder="Label (e.g. Accounting, CFO)"
                  value={newEmailLabel}
                  onChange={e => setNewEmailLabel(e.target.value)}
                  className="sm:w-48 bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                />
                <Button type="submit" disabled={addingEmail || !newEmail.trim()} className="h-9 px-4 text-sm gap-1.5 whitespace-nowrap">
                  <Plus className="w-3.5 h-3.5" /> {addingEmail ? 'Adding...' : 'Add Recipient'}
                </Button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Active Subscriptions */}
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/40 mb-3">Active Subscriptions</h2>
        <div className="border border-border divide-y divide-border">
          {billingInfo?.subscriptions?.map((sub: any) => (
            <div key={sub.id} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <div className="text-sm font-medium">{sub.name}</div>
                <div className={`text-xs ${sub.cancel_at_period_end ? 'text-amber-500 font-medium' : 'text-muted-foreground'}`}>
                  {sub.description}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm font-medium">{sub.price}</div>
                  <div className="text-xs text-muted-foreground">Next: {sub.next_date}</div>
                </div>
                {sub.cancel_at_period_end ? (
                  <Button
                    onClick={() => handleRevoke(sub.id)}
                    variant="outline"
                    className="h-7 px-3 text-xs border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" /> Revoke
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCancellingSub({ id: sub.id, name: sub.name, next_due: sub.next_date })}
                    variant="outline"
                    className="h-7 px-3 text-xs border-red-500/30 text-red-500 hover:bg-red-500/10"
                  >
                    Cancel
                  </Button>
                )}
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
                    <button 
                      onClick={() => handleDownloadPdf(inv.id, inv.invoice_number)}
                      className="inline-flex items-center gap-1 text-xs text-foreground/60 hover:text-foreground cursor-pointer"
                    >
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

      <CancelServiceModal
        isOpen={!!cancellingSub}
        service={cancellingSub}
        onClose={() => setCancellingSub(null)}
        onSuccess={() => {
          success('Subscription cancellation processed.');
          loadBilling();
        }}
      />
    </div>
  );
}
