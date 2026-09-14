import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, PageHero } from '../components/Shared';
import { useLanguage } from '../i18n';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function Register() {
  const navigate = useNavigate();
  const { localePath } = useLanguage();
  const [step, setStep] = useState<'account' | 'profile'>('account');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    name: '',
    company: '',
    address: '',
    city: '',
    country: 'DE',
    phone: '',
    vat_id: '',
  });

  const update = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (error) setError('');
  };

  const handleNext = () => {
    if (!form.username.trim()) { setError('Username is required.'); return; }
    if (!form.email.trim() || !form.email.includes('@')) { setError('Valid email is required.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (form.password !== form.password_confirm) { setError('Passwords do not match.'); return; }
    setStep('profile');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Full name is required.'); return; }
    if (!form.address.trim()) { setError('Address is required.'); return; }
    if (!form.city.trim()) { setError('City is required.'); return; }
    if (!form.country.trim()) { setError('Country is required.'); return; }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
          name: form.name.trim(),
          company: form.company.trim() || undefined,
          address: form.address.trim(),
          city: form.city.trim(),
          country: form.country.trim(),
          phone: form.phone.trim() || undefined,
          vat_id: form.vat_id.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Registration failed (${res.status})`);
      }

      navigate(localePath('/register/success'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-6 lg:px-12 pt-32 pb-20">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-medium tracking-tight mb-2">Create your account</h1>
            <p className="text-sm text-foreground/50">
              {step === 'account' ? 'Step 1 of 2 — Account credentials' : 'Step 2 of 2 — Billing details'}
            </p>
          </div>

          <div className="border border-border p-8">
            {step === 'account' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">
                    Username <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.username}
                    onChange={e => update('username', e.target.value)}
                    placeholder="johndoe"
                    autoComplete="username"
                    className="w-full border border-border bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder="john@example.com"
                    autoComplete="email"
                    className="w-full border border-border bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    className="w-full border border-border bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    value={form.password_confirm}
                    onChange={e => update('password_confirm', e.target.value)}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    className="w-full border border-border bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <div className="pt-2">
                  <Button onClick={handleNext} className="w-full">Continue</Button>
                </div>
              </div>
            )}

            {step === 'profile' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input type="text" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Max Mustermann" required className="w-full border border-border bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">Company</label>
                  <input type="text" value={form.company} onChange={e => update('company', e.target.value)} placeholder="Optional" className="w-full border border-border bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">
                    Street Address <span className="text-red-400">*</span>
                  </label>
                  <input type="text" value={form.address} onChange={e => update('address', e.target.value)} placeholder="Musterstraße 1" required className="w-full border border-border bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">
                      City <span className="text-red-400">*</span>
                    </label>
                    <input type="text" value={form.city} onChange={e => update('city', e.target.value)} placeholder="Berlin" required className="w-full border border-border bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">
                      Country <span className="text-red-400">*</span>
                    </label>
                    <input type="text" value={form.country} onChange={e => update('country', e.target.value)} placeholder="DE" required className="w-full border border-border bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+49 170 1234567 (optional)" className="w-full border border-border bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">VAT ID</label>
                  <input type="text" value={form.vat_id} onChange={e => update('vat_id', e.target.value)} placeholder="DE123456789 (optional)" className="w-full border border-border bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" type="button" onClick={() => setStep('account')} className="flex-1">Back</Button>
                  <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? 'Creating account...' : 'Create Account'}
                  </Button>
                </div>
              </form>
            )}
          </div>

          <p className="text-center text-xs text-foreground/40 mt-6">
            Already have an account?{' '}
            <Link to={localePath('/dashboard')} className="text-foreground/60 hover:text-foreground transition-colors underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function RegisterSuccess() {
  const { localePath } = useLanguage();
  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-6 lg:px-12 pt-32 pb-20">
        <div className="max-w-lg mx-auto text-center">
          <div className="border border-border p-10">
            <div className="w-16 h-16 border border-border flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">&#10003;</span>
            </div>
            <h1 className="text-2xl font-medium tracking-tight mb-3">Account created</h1>
            <p className="text-sm text-foreground/50 mb-8 leading-relaxed">
              Your VaultScope account has been created successfully. You can now sign in to access your dashboard.
            </p>
            <Link to={localePath('/dashboard')}>
              <Button className="w-full">Sign in to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
