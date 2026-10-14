import { useEffect, useState, useRef } from 'react';
import { ShieldCheck, AlertTriangle, RefreshCw, Loader2, CheckCircle2, MapPin, Trash2 } from 'lucide-react';
import { Button } from '../../../components/Shared';
import { api } from '../../../lib/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface AccountData {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  postal_code?: string;
  city: string;
  country: string;
  vat_id: string;
  vat_verified?: boolean;
  two_factor_enabled: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

interface PhotonFeature {
  properties: {
    name?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    city?: string;
    countrycode?: string;
    country?: string;
  };
}

export function ProfileAccount() {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    if (!account || deletingAccount) return;
    if (!confirm('Are you absolutely sure you want to permanently delete your VaultScope account? All services, configuration, and data will be removed.')) return;
    setDeletingAccount(true);
    setDeleteError(null);
    try {
      await api.delete('/storefront/profile');
      localStorage.removeItem('vs_token');
      window.location.href = '/login';
    } catch (err: any) {
      setDeleteError(err?.message || 'Failed to delete account. Ensure all active services are terminated first.');
      setDeletingAccount(false);
    }
  };

  // VAT verification state
  const [verifyingVat, setVerifyingVat] = useState(false);
  const [vatFeedback, setVatFeedback] = useState<{ valid: boolean; message: string; name?: string } | null>(null);

  // Address autocomplete state
  const [addressSuggestions, setAddressSuggestions] = useState<PhotonFeature[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const addressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    company: '',
    address: '',
    postal_code: '',
    city: '',
    country: '',
    vat_id: '',
  });

  useEffect(() => {
    api.get<AccountData>('/storefront/profile')
      .then(data => {
        setAccount(data);
        setForm({
          name: data.name || '',
          phone: data.phone || '',
          company: data.company || '',
          address: data.address || '',
          postal_code: data.postal_code || '',
          city: data.city || '',
          country: data.country || '',
          vat_id: data.vat_id || '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleResendVerification = async () => {
    if (!account?.email) return;
    setResendingEmail(true);
    setResendSuccess(null);
    setResendError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: account.email }),
      });
      const data = await res.json().catch(() => ({}));
      setResendSuccess(data.message || 'Verification email sent! Please check your spam folder.');
    } catch {
      setResendError('Failed to send verification email. Please try again later.');
    } finally {
      setResendingEmail(false);
    }
  };

  const handleVerifyVat = async (vatToVerify?: string) => {
    const vat = vatToVerify || form.vat_id || account?.vat_id;
    if (!vat || !vat.trim()) return;

    setVerifyingVat(true);
    setVatFeedback(null);
    try {
      const res = await api.post<{ valid: boolean; message: string; company_name?: string }>(
        '/storefront/profile/verify-vat',
        { vat_id: vat.trim() }
      );
      setVatFeedback({
        valid: res.valid,
        message: res.message,
        name: res.company_name,
      });
      if (res.valid && account) {
        setAccount({ ...account, vat_verified: true, vat_id: vat.trim().toUpperCase() });
      }
    } catch (err: any) {
      setVatFeedback({
        valid: false,
        message: err?.message || 'Failed to verify VAT ID via EU VIES.',
      });
    } finally {
      setVerifyingVat(false);
    }
  };

  const handleAddressChange = (val: string) => {
    setForm(prev => ({ ...prev, address: val }));

    if (addressTimeoutRef.current) {
      clearTimeout(addressTimeoutRef.current);
    }

    if (!val || val.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    addressTimeoutRef.current = setTimeout(async () => {
      try {
        const resp = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(val)}&limit=5`
        );
        if (resp.ok) {
          const data = await resp.json();
          if (data?.features) {
            setAddressSuggestions(data.features);
            setShowSuggestions(true);
          }
        }
      } catch {
        // Ignore network errors on autocomplete
      }
    }, 300);
  };

  const handleSelectAddressSuggestion = (feature: PhotonFeature) => {
    const p = feature.properties;
    const street = p.street ? `${p.street} ${p.housenumber || ''}`.trim() : (p.name || '');
    setForm(prev => ({
      ...prev,
      address: street,
      postal_code: p.postcode || prev.postal_code,
      city: p.city || prev.city,
      country: p.countrycode ? p.countrycode.toUpperCase() : prev.country,
    }));
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.put<AccountData>('/storefront/profile', form);
      setAccount(updated);
      setEditing(false);
      setShowSuggestions(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (!account) return <div>Failed to load profile.</div>;

  const fields = [
    { label: 'Name', key: 'name' as const },
    { label: 'Phone', key: 'phone' as const },
    { label: 'Company', key: 'company' as const },
    { label: 'Address', key: 'address' as const },
    { label: 'Postal Code', key: 'postal_code' as const },
    { label: 'City', key: 'city' as const },
    { label: 'Country', key: 'country' as const },
    { label: 'VAT ID', key: 'vat_id' as const },
  ];

  return (
    <div className="space-y-8">
      {!account.email_verified && (
        <div className="border border-amber-500/40 bg-amber-500/10 p-5 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-amber-500">Email Address Unverified</h3>
                <span className="text-xs px-2 py-0.5 font-medium uppercase tracking-wider rounded bg-amber-500/20 text-amber-400">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">
                Your account email <strong className="font-mono text-foreground">{account.email}</strong> has not been verified yet.
                Please check your inbox and your <strong>Spam or Junk folder</strong> for our verification message.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <Button
                  onClick={handleResendVerification}
                  disabled={resendingEmail}
                  variant="outline"
                  className="h-8 text-xs border-amber-500/40 hover:bg-amber-500/20 text-amber-400"
                >
                  {resendingEmail ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
                {resendSuccess && (
                  <span className="text-xs text-emerald-400 font-medium">{resendSuccess}</span>
                )}
                {resendError && (
                  <span className="text-xs text-red-400 font-medium">{resendError}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {vatFeedback && (
        <div className={`p-4 border text-xs rounded-lg flex items-center justify-between ${
          vatFeedback.valid
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <div>
            <span className="font-medium">{vatFeedback.message}</span>
            {vatFeedback.name && <span className="block text-muted-foreground mt-0.5">Registered to: {vatFeedback.name}</span>}
          </div>
          <button onClick={() => setVatFeedback(null)} className="underline ml-4">Dismiss</button>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/40">Account Information</h2>
          {!editing ? (
            <Button variant="outline" className="h-7 px-3 text-xs" onClick={() => setEditing(true)}>Edit</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" className="h-7 px-3 text-xs" onClick={() => { setEditing(false); setShowSuggestions(false); }}>Cancel</Button>
              <Button className="h-7 px-3 text-xs" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )}
        </div>
        <div className="border border-border divide-y divide-border">
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Account ID</span>
            <span className="font-mono text-sm">{account.id}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="text-sm flex items-center gap-2">
              {account.email}
              {account.email_verified ? (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Unverified
                  </span>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendingEmail}
                    className="text-xs underline text-amber-400/80 hover:text-amber-400 transition-colors ml-1"
                  >
                    Resend link
                  </button>
                </div>
              )}
            </span>
          </div>

          {fields.map(({ label, key }) => (
            <div key={key} className="flex items-center justify-between px-5 py-3 relative">
              <span className="text-sm text-muted-foreground">{label}</span>
              {editing ? (
                <div className="relative flex items-center gap-2">
                  {key === 'address' ? (
                    <div className="relative">
                      <input
                        type="text"
                        value={form.address}
                        onChange={e => handleAddressChange(e.target.value)}
                        placeholder="Street & Number"
                        className="text-sm text-right bg-transparent border border-border px-2 py-1 focus:outline-none focus:border-foreground w-64"
                      />
                      {showSuggestions && addressSuggestions.length > 0 && (
                        <div className="absolute right-0 top-full mt-1 w-80 bg-card border border-border shadow-xl z-20 rounded-md overflow-hidden divide-y divide-border">
                          {addressSuggestions.map((s, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectAddressSuggestion(s)}
                              className="w-full text-left px-3 py-2 text-xs hover:bg-secondary/80 flex items-start gap-2 transition-colors"
                            >
                              <MapPin className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
                              <div>
                                <span className="font-medium text-foreground block">
                                  {s.properties.street ? `${s.properties.street} ${s.properties.housenumber || ''}` : s.properties.name}
                                </span>
                                <span className="text-muted-foreground text-[10px]">
                                  {[s.properties.postcode, s.properties.city, s.properties.country].filter(Boolean).join(', ')}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : key === 'vat_id' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={form.vat_id}
                        onChange={e => setForm({ ...form, vat_id: e.target.value })}
                        placeholder="e.g. DE123456789"
                        className="text-sm text-right bg-transparent border border-border px-2 py-1 focus:outline-none focus:border-foreground w-48 font-mono"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerifyVat(form.vat_id)}
                        disabled={verifyingVat || !form.vat_id}
                        className="h-7 px-2 text-xs"
                      >
                        {verifyingVat ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Check VIES'}
                      </Button>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className="text-sm text-right bg-transparent border border-border px-2 py-1 focus:outline-none focus:border-foreground w-48"
                    />
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm">{account[key] || '-'}</span>
                  {key === 'vat_id' && account.vat_id && (
                    account.vat_verified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> EU VIES Valid
                      </span>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerifyVat(account.vat_id)}
                        disabled={verifyingVat}
                        className="h-6 px-2 text-[10px] gap-1"
                      >
                        {verifyingVat ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Verify VIES'}
                      </Button>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/40">Compliance & Contacts</h2>
        </div>
        <div className="border border-border divide-y divide-border">
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Abuse Contact</span>
            <span className="text-sm">{account.email}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Data Processing Agreement (AVV)</span>
              <span className="text-xs text-muted-foreground/60">Required under GDPR (DSGVO)</span>
            </div>
            <span className="text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Accepted
            </span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/40 mb-4">Account History</h2>
        <div className="border border-border divide-y divide-border">
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Member since</span>
            <span className="text-sm">{new Date(account.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Last updated</span>
            <span className="text-sm">{new Date(account.updated_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Last login</span>
            <span className="text-sm">{account.last_login ? new Date(account.last_login).toLocaleString() : 'Never'}</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-red-500/20">
        <h2 className="text-xs font-medium uppercase tracking-wider text-red-500 mb-2">Danger Zone</h2>
        <div className="border border-red-500/30 bg-red-500/5 p-5 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Delete Account</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Permanently close your customer account and erase your identity and configuration. Active running services must be terminated first.
            </p>
            {deleteError && (
              <p className="text-xs text-red-400 mt-2 font-medium">{deleteError}</p>
            )}
          </div>
          <Button
            type="button"
            onClick={handleDeleteAccount}
            disabled={deletingAccount}
            className="bg-red-600 hover:bg-red-700 text-white shrink-0 h-9 text-xs gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {deletingAccount ? 'Deleting...' : 'Delete Account'}
          </Button>
        </div>
      </div>
    </div>
  );
}
