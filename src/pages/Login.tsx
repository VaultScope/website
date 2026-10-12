import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Shared';
import { useLanguage } from '../i18n';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function Login() {
  const { localePath } = useLanguage();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const update = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() || !form.email.includes('@')) { setError('Valid email is required.'); return; }
    if (!form.password) { setError('Password is required.'); return; }
    if (mfaRequired && (!totpCode || totpCode.trim().length !== 6)) {
      setError('Please enter your 6-digit authenticator code.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload: Record<string, any> = {
        email: form.email.trim(),
        password: form.password,
        audience: 'storefront',
      };
      if (mfaRequired && totpCode) {
        payload.totp_code = totpCode.trim();
      }

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `Login failed (${res.status})`);
      }

      if (data.mfa_required) {
        setMfaRequired(true);
        setSubmitting(false);
        return;
      }

      const { token, claims, email_verified } = data;
      localStorage.setItem('vs_token', token);
      if (claims) {
        localStorage.setItem('vs_claims', JSON.stringify(claims));
      } else {
        try {
            const tokenParts = token.split('.');
            const payload = JSON.parse(atob(tokenParts[1]));
            localStorage.setItem('vs_claims', JSON.stringify(payload));
        } catch(e) {}
      }

      if (email_verified === false) {
        window.location.href = localePath('/dashboard/profile');
      } else {
        window.location.href = localePath('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-6 lg:px-12 pt-32 pb-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-medium tracking-tight mb-2">
              {mfaRequired ? 'Two-Factor Challenge' : 'Sign in'}
            </h1>
            <p className="text-sm text-foreground/50">
              {mfaRequired
                ? 'Enter the 6-digit code from your authenticator app'
                : 'Welcome back to VaultScope'}
            </p>
          </div>

          <div className="border border-border p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!mfaRequired ? (
                <>
                  <div>
                    <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">
                      Email
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
                      Password
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={e => update('password', e.target.value)}
                      placeholder="Your password"
                      autoComplete="current-password"
                      className="w-full border border-border bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">
                    6-Digit Authenticator Code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={totpCode}
                    onChange={e => {
                      setTotpCode(e.target.value.replace(/\D/g, ''));
                      if (error) setError('');
                    }}
                    placeholder="123456"
                    autoFocus
                    className="w-full border border-border bg-transparent px-4 py-3 text-center text-xl font-mono tracking-widest focus:outline-none focus:border-foreground transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMfaRequired(false);
                      setTotpCode('');
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground mt-2 block"
                  >
                    ← Back to credentials
                  </button>
                </div>
              )}

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="pt-2">
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? 'Verifying...' : mfaRequired ? 'Verify & Sign In' : 'Sign In'}
                </Button>
              </div>
            </form>
          </div>

          <p className="text-center text-xs text-foreground/40 mt-6">
            Don't have an account?{' '}
            <Link to={localePath('/register')} className="text-foreground/60 hover:text-foreground transition-colors underline underline-offset-2">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
