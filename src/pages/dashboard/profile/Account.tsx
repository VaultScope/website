import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Check,
  AlertTriangle,
  Plus,
  Trash2,
  Mail,
  RefreshCw,
  Compass,
  RotateCcw,
} from 'lucide-react';
import { api } from '../../../lib/api';
import {
  ALL_QUICK_NAV_ITEMS,
  DEFAULT_QUICK_NAV_IDS,
  getQuickNavIds,
  setQuickNavIds,
  getStoredUsername,
  setStoredUsername,
} from '../../../lib/quickNav';

export function ProfileAccount() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [form, setForm] = useState({
    username: '',
    name: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    country: '',
    vat_id: '',
  });
  const [verifyingVat, setVerifyingVat] = useState(false);
  const [vatResult, setVatResult] = useState<{
    valid: boolean;
    company_name?: string;
    company_address?: string;
  } | null>(null);

  const [quickNavIds, setQuickNavState] = useState<string[]>(() => getQuickNavIds());

  const [billingEmails, setBillingEmails] = useState<any[]>([]);
  const [newBillingEmail, setNewBillingEmail] = useState('');
  const [addingEmail, setAddingEmail] = useState(false);
  const [emailMsg, setEmailMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    api
      .get('/storefront/profile')
      .then((data: any) => {
        setProfile(data);
        if (data) {
          const uname = data.username || getStoredUsername() || '';
          if (data.username) {
            setStoredUsername(data.username);
          }
          setForm({
            username: uname,
            name: data.name || '',
            phone: data.phone || '',
            company: data.company || '',
            address: data.address || '',
            city: data.city || '',
            country: data.country || '',
            vat_id: data.vat_id || '',
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    api
      .get('/storefront/profile/billing-emails')
      .then((res: any) => {
        if (Array.isArray(res)) setBillingEmails(res);
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const updated: any = await api.put('/storefront/profile', form);
      const nextProfile = updated ? { ...updated, username: updated.username ?? form.username } : { ...profile, ...form };
      setProfile(nextProfile);
      if (form.username.trim()) {
        setStoredUsername(form.username.trim());
      }
      setEditing(false);
      setSaveMsg({ type: 'ok', text: 'Profile updated.' });
    } catch (e: any) {
      setSaveMsg({ type: 'err', text: e.message || 'Failed to save profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleQuickNav = (id: string) => {
    const exists = quickNavIds.includes(id);
    const next = exists ? quickNavIds.filter((x) => x !== id) : [...quickNavIds, id];
    setQuickNavState(next);
    setQuickNavIds(next);
  };

  const handleResetQuickNav = () => {
    setQuickNavState(DEFAULT_QUICK_NAV_IDS);
    setQuickNavIds(DEFAULT_QUICK_NAV_IDS);
  };

  const handleVerifyVat = async () => {
    if (!form.vat_id.trim()) return;
    setVerifyingVat(true);
    setVatResult(null);
    try {
      const res: any = await api.post('/storefront/profile/verify-vat', {
        vat_id: form.vat_id.trim(),
      });
      setVatResult(res);
      if (res?.valid && res.company_name && !form.company) {
        setForm((prev) => ({ ...prev, company: res.company_name }));
      }
    } catch (e: any) {
      setSaveMsg({ type: 'err', text: e.message || 'VAT validation failed' });
    } finally {
      setVerifyingVat(false);
    }
  };

  const handleAddBillingEmail = async () => {
    if (!newBillingEmail.trim()) return;
    setAddingEmail(true);
    setEmailMsg(null);
    try {
      const added: any = await api.post('/storefront/profile/billing-emails', {
        email: newBillingEmail.trim(),
      });
      setBillingEmails((prev) => [...prev, added]);
      setNewBillingEmail('');
      setEmailMsg({ type: 'ok', text: 'Verification link dispatched.' });
    } catch (e: any) {
      setEmailMsg({ type: 'err', text: e.message || 'Failed to add billing email' });
    } finally {
      setAddingEmail(false);
    }
  };

  const handleDeleteBillingEmail = async (emailId: string) => {
    try {
      await api.delete(`/storefront/profile/billing-emails/${emailId}`);
      setBillingEmails((prev) => prev.filter((e) => e.id !== emailId));
    } catch (e: any) {
      setEmailMsg({ type: 'err', text: e.message || 'Failed to remove billing email' });
    }
  };

  const handleResendBillingEmail = async (emailId: string) => {
    try {
      await api.post(`/storefront/profile/billing-emails/${emailId}/resend`);
      setEmailMsg({ type: 'ok', text: 'Verification email resent.' });
    } catch (e: any) {
      setEmailMsg({ type: 'err', text: e.message || 'Failed to resend verification email' });
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError('Please enter your password to confirm.');
      return;
    }
    setDeleting(true);
    setDeleteError('');
    try {
      await api.delete('/storefront/profile', { password: deletePassword });
      localStorage.removeItem('vs_token');
      localStorage.removeItem('vs_claims');
      localStorage.removeItem('vs_username');
      navigate('/login');
    } catch (e: any) {
      setDeleteError(e.message || 'Failed to delete account');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-12 text-center text-sm text-[var(--fg-muted)] font-mono">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-12 text-center text-sm text-[var(--err)]">
        Failed to load profile.
      </div>
    );
  }

  const displayedUsername = profile.username || form.username || getStoredUsername() || '-';

  return (
    <div className="space-y-6">
      {saveMsg && (
        <div
          role={saveMsg.type === 'err' ? 'alert' : 'status'}
          className={`rounded-xl px-5 py-3.5 text-xs border ${
            saveMsg.type === 'ok'
              ? 'bg-emerald-500/10 border-emerald-500/25 text-[var(--ok)]'
              : 'bg-rose-500/10 border-rose-500/25 text-[var(--err)]'
          }`}
        >
          {saveMsg.text}
        </div>
      )}

      {/* Account Information */}
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-[var(--fg)]">Account Information</h2>
            <p className="text-xs font-mono text-[var(--fg-faint)]">{profile.id}</p>
          </div>

          {!editing ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="vs-btn-secondary !px-4 !py-1.5 !text-xs"
            >
              Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="vs-btn-secondary !px-3.5 !py-1.5 !text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="vs-btn-primary !px-4 !py-1.5 !text-xs disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {!editing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            <div>
              <div className="text-xs text-[var(--fg-faint)] mb-1">Username</div>
              <div className="text-sm font-mono text-[var(--fg)]">{displayedUsername}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--fg-faint)] mb-1">Full Name</div>
              <div className="text-sm text-[var(--fg)]">{profile.name || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--fg-faint)] mb-1">Email Address</div>
              <span className="inline-flex items-center gap-1.5 text-sm text-[var(--fg)]">
                {profile.email}
                {profile.email_verified && (
                  <ShieldCheck className="w-4 h-4 text-[var(--ok)]" />
                )}
              </span>
            </div>
            <div>
              <div className="text-xs text-[var(--fg-faint)] mb-1">Phone</div>
              <div className="text-sm font-mono text-[var(--fg)]">{profile.phone || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--fg-faint)] mb-1">Organization</div>
              <div className="text-sm text-[var(--fg)]">{profile.company || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--fg-faint)] mb-1">VAT ID</div>
              <div className="text-sm font-mono text-[var(--fg)]">{profile.vat_id || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--fg-faint)] mb-1">Country</div>
              <div className="text-sm font-mono text-[var(--fg)]">{profile.country || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--fg-faint)] mb-1">Address</div>
              <div className="text-sm text-[var(--fg)]">
                {[profile.address, profile.city].filter(Boolean).join(', ') || '-'}
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--fg-faint)] mb-1">Member Since</div>
              <div className="text-sm font-mono text-[var(--fg)]">
                {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : '-'}
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--fg-faint)] mb-1">Last Login</div>
              <div className="text-sm font-mono text-[var(--fg)]">
                {profile.last_login ? new Date(profile.last_login).toLocaleString() : 'Never'}
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--fg-faint)] mb-1">Last Updated</div>
              <div className="text-sm font-mono text-[var(--fg)]">
                {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : '-'}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label htmlFor="profile-username" className="block text-xs text-[var(--fg-muted)] mb-1.5">
                Username (Forum & Login)
              </label>
              <input
                id="profile-username"
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="e.g. lsteiner"
                className="w-full rounded-xl bg-[var(--bg)] border border-[var(--line)] px-4 py-2.5 text-xs font-mono text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)] focus:ring-1 focus:ring-[var(--accent-bright)]"
              />
            </div>
            <div>
              <label htmlFor="profile-name" className="block text-xs text-[var(--fg-muted)] mb-1.5">Full Name</label>
              <input
                id="profile-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl bg-[var(--bg)] border border-[var(--line)] px-4 py-2.5 text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)] focus:ring-1 focus:ring-[var(--accent-bright)]"
              />
            </div>
            <div>
              <label htmlFor="profile-phone" className="block text-xs text-[var(--fg-muted)] mb-1.5">Phone</label>
              <input
                id="profile-phone"
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl bg-[var(--bg)] border border-[var(--line)] px-4 py-2.5 text-xs font-mono text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)] focus:ring-1 focus:ring-[var(--accent-bright)]"
              />
            </div>
            <div>
              <label htmlFor="profile-company" className="block text-xs text-[var(--fg-muted)] mb-1.5">Company</label>
              <input
                id="profile-company"
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full rounded-xl bg-[var(--bg)] border border-[var(--line)] px-4 py-2.5 text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)] focus:ring-1 focus:ring-[var(--accent-bright)]"
              />
            </div>
            <div>
              <label htmlFor="profile-vat-id" className="block text-xs text-[var(--fg-muted)] mb-1.5">
                EU VAT ID (VIES)
              </label>
              <div className="flex gap-2">
                <input
                  id="profile-vat-id"
                  type="text"
                  value={form.vat_id}
                  onChange={(e) => setForm({ ...form, vat_id: e.target.value })}
                  placeholder="DE123456789"
                  className="flex-1 rounded-xl bg-[var(--bg)] border border-[var(--line)] px-4 py-2.5 text-xs font-mono text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)] focus:ring-1 focus:ring-[var(--accent-bright)]"
                />
                <button
                  type="button"
                  onClick={handleVerifyVat}
                  disabled={verifyingVat}
                  className="vs-btn-secondary !px-3.5 !py-2 !text-xs"
                >
                  {verifyingVat ? '...' : 'Verify'}
                </button>
              </div>
              {vatResult && (
                <div
                  className={`mt-1.5 text-[11px] font-mono flex items-center gap-1 ${
                    vatResult.valid ? 'text-[var(--ok)]' : 'text-[var(--err)]'
                  }`}
                >
                  <Check className="w-3 h-3" />
                  {vatResult.valid
                    ? `Verified: ${vatResult.company_name || 'Valid EU VAT'}`
                    : 'Invalid VAT number'}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="profile-address" className="block text-xs text-[var(--fg-muted)] mb-1.5">Street Address</label>
              <input
                id="profile-address"
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-xl bg-[var(--bg)] border border-[var(--line)] px-4 py-2.5 text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)] focus:ring-1 focus:ring-[var(--accent-bright)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="profile-city" className="block text-xs text-[var(--fg-muted)] mb-1.5">City</label>
                <input
                  id="profile-city"
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded-xl bg-[var(--bg)] border border-[var(--line)] px-4 py-2.5 text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)] focus:ring-1 focus:ring-[var(--accent-bright)]"
                />
              </div>
              <div>
                <label htmlFor="profile-country" className="block text-xs text-[var(--fg-muted)] mb-1.5">Country</label>
                <input
                  id="profile-country"
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  placeholder="DE"
                  className="w-full rounded-xl bg-[var(--bg)] border border-[var(--line)] px-4 py-2.5 text-xs font-mono text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)] focus:ring-1 focus:ring-[var(--accent-bright)]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customizable Quick Navigation */}
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[var(--accent-bright)]" />
              <h2 className="text-base font-semibold text-[var(--fg)]">Quick Navigation</h2>
            </div>
            <p className="text-xs text-[var(--fg-muted)]">
              Choose which shortcuts appear in the Quick Navigation panel on your dashboard overview.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetQuickNav}
            className="vs-btn-secondary !px-3.5 !py-1.5 !text-xs inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {ALL_QUICK_NAV_ITEMS.map((item) => {
            const selected = quickNavIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleToggleQuickNav(item.id)}
                aria-pressed={selected}
                className={`flex items-center justify-between gap-2 rounded-lg px-3.5 py-2.5 text-left text-xs transition-colors cursor-pointer ${
                  selected
                    ? 'bg-[var(--accent)]/15 text-[var(--fg)]'
                    : 'bg-[var(--bg-subtle)] text-[var(--fg-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--fg)]'
                }`}
              >
                <div className="min-w-0">
                  <div className="font-medium truncate">{item.label}</div>
                  <div className="text-[10px] font-mono text-[var(--fg-faint)] truncate">
                    {item.path}
                  </div>
                </div>
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    selected
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--line)] text-transparent'
                  }`}
                >
                  <Check className="w-2.5 h-2.5" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Billing Notification Recipients */}
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-6 sm:p-8 space-y-5">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-[var(--fg)]">Invoice Recipients</h2>
          <p className="text-xs text-[var(--fg-muted)]">
            Additional email addresses that receive PDF invoices and billing alerts.
          </p>
        </div>

        {emailMsg && (
          <div
            role={emailMsg.type === 'err' ? 'alert' : 'status'}
            className={`rounded-xl px-4 py-2.5 text-xs border ${
              emailMsg.type === 'ok'
                ? 'bg-emerald-500/10 border-emerald-500/25 text-[var(--ok)]'
                : 'bg-rose-500/10 border-rose-500/25 text-[var(--err)]'
            }`}
          >
            {emailMsg.text}
          </div>
        )}

        {billingEmails.length > 0 && (
          <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {billingEmails.map((item) => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Mail className="w-3.5 h-3.5 text-[var(--fg-faint)] shrink-0" />
                  <span className="text-xs font-mono text-[var(--fg)] truncate">{item.email}</span>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                      item.verified
                        ? 'bg-emerald-500/15 text-[var(--ok)]'
                        : 'bg-amber-500/15 text-[var(--warn)]'
                    }`}
                  >
                    {item.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {!item.verified && (
                    <button
                      type="button"
                      onClick={() => handleResendBillingEmail(item.id)}
                      className="p-1.5 text-[var(--fg-faint)] hover:text-[var(--fg)]"
                      title="Resend verification"
                      aria-label={`Resend verification to ${item.email}`}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteBillingEmail(item.id)}
                    className="p-1.5 text-[var(--fg-faint)] hover:text-[var(--err)]"
                    title="Remove email"
                    aria-label={`Remove ${item.email}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 max-w-md">
          <input
            type="email"
            aria-label="Additional invoice email address"
            value={newBillingEmail}
            onChange={(e) => setNewBillingEmail(e.target.value)}
            placeholder="accounting@company.de"
            className="flex-1 rounded-xl bg-[var(--bg)] border border-[var(--line)] px-4 py-2 text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)] focus:ring-1 focus:ring-[var(--accent-bright)]"
          />
          <button
            type="button"
            onClick={handleAddBillingEmail}
            disabled={addingEmail}
            className="vs-btn-secondary !px-4 !py-2 !text-xs inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>

      {/* Minimal Danger Zone */}
      <div className="rounded-xl bg-rose-500/[0.04] border border-rose-500/20 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-[var(--err)]">Close Account</h3>
          <p className="text-xs text-[var(--fg-muted)]">
            Permanently delete your customer record after all active services are terminated.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 rounded-lg text-xs font-medium bg-rose-500/15 border border-rose-500/25 text-[var(--err)] hover:bg-rose-500 hover:text-white transition-colors self-start sm:self-auto shrink-0"
        >
          Delete Account
        </button>
      </div>

      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-[var(--bg-elevated)] border border-[var(--line)] rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-[var(--err)]">
              <AlertTriangle className="w-5 h-5" />
              <h3 id="delete-account-title" className="text-base font-semibold">Confirm Account Closure</h3>
            </div>
            <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
              Enter your password to permanently close your VaultScope account.
            </p>
            <input
              type="password"
              aria-label="Current password to confirm account closure"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Current password"
              className="w-full rounded-xl bg-[var(--bg)] border border-[var(--line)] px-4 py-2.5 text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)]"
            />
            {deleteError && <div role="alert" className="text-xs text-[var(--err)]">{deleteError}</div>}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="vs-btn-secondary !px-4 !py-2 !text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-rose-500 text-white hover:bg-rose-600 transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
