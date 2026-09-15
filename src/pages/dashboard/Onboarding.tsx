import { useState } from 'react';
import { Button } from '../../components/Shared';
import { api } from '../../lib/api';

export function Onboarding() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    country: 'DE',
    vat_id: '',
  });

  const update = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required.'); return; }
    if (!form.address.trim()) { setError('Address is required.'); return; }
    if (!form.city.trim()) { setError('City is required.'); return; }
    if (!form.country.trim()) { setError('Country is required.'); return; }

    setSaving(true);
    setError('');
    try {
      await api.put('/storefront/profile', form);
      // Force page reload to refresh profile completion check
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile.');
      setSaving(false);
    }
  };

  const fields: { label: string; key: keyof typeof form; required?: boolean; placeholder: string; type?: string }[] = [
    { label: 'Full Name', key: 'name', required: true, placeholder: 'Max Mustermann' },
    { label: 'Company', key: 'company', placeholder: 'Mustermann GmbH (optional)' },
    { label: 'Street Address', key: 'address', required: true, placeholder: 'Musterstraße 1' },
    { label: 'City', key: 'city', required: true, placeholder: 'Berlin' },
    { label: 'Country', key: 'country', required: true, placeholder: 'DE' },
    { label: 'Phone', key: 'phone', placeholder: '+49 170 1234567 (optional)', type: 'tel' },
    { label: 'VAT ID', key: 'vat_id', placeholder: 'DE123456789 (optional for businesses)' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="border border-border p-8">
          <h1 className="text-xl font-medium mb-1">Complete your profile</h1>
          <p className="text-sm text-muted-foreground mb-8">
            We need a few details before you can use VaultScope services. Required for invoicing and legal compliance.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ label, key, required, placeholder, type }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">
                  {label} {required && <span className="text-red-400">*</span>}
                </label>
                <input
                  type={type || 'text'}
                  value={form[key]}
                  onChange={e => update(key, e.target.value)}
                  placeholder={placeholder}
                  required={required}
                  className="w-full border border-border bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
            ))}

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <div className="pt-4">
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Continue to Dashboard'}
              </Button>
            </div>
          </form>

          <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
            Your data is stored in the EU and processed in accordance with our privacy policy.
            Business customers can add their VAT ID to receive reverse-charge invoices.
          </p>
        </div>
      </div>
    </div>
  );
}
