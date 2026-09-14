import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/Shared';
import { api } from '../../../lib/api';

interface AccountData {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  country: string;
  vat_id: string;
  two_factor_enabled: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

export function ProfileAccount() {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    company: '',
    address: '',
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
          city: data.city || '',
          country: data.country || '',
          vat_id: data.vat_id || '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.put<AccountData>('/storefront/profile', form);
      setAccount(updated);
      setEditing(false);
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
    { label: 'City', key: 'city' as const },
    { label: 'Country', key: 'country' as const },
    { label: 'VAT ID', key: 'vat_id' as const },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/40">Account Information</h2>
          {!editing ? (
            <Button variant="outline" className="h-7 px-3 text-xs" onClick={() => setEditing(true)}>Edit</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" className="h-7 px-3 text-xs" onClick={() => setEditing(false)}>Cancel</Button>
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
              {account.email_verified && <ShieldCheck className="w-3.5 h-3.5 text-green-500" />}
            </span>
          </div>
          {fields.map(({ label, key }) => (
            <div key={key} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-muted-foreground">{label}</span>
              {editing ? (
                <input
                  type="text"
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className="text-sm text-right bg-transparent border border-border px-2 py-1 focus:outline-none focus:border-foreground w-48"
                />
              ) : (
                <span className="text-sm">{account[key] || '-'}</span>
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
    </div>
  );
}
