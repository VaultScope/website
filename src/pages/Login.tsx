import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/Shared';
import { useLanguage } from '../i18n';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { setStoredUsername } from '../lib/quickNav';

const API_BASE =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'vaultscope.de' ||
    window.location.hostname.endsWith('.vaultscope.de'))
    ? '/api'
    : import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function Login() {
  const { locale, localePath } = useLanguage();
  const isDe = locale === 'de';
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect') || sessionStorage.getItem('vs_redirect') || '';

  useDocumentMeta({
    title: isDe ? 'Anmelden — VaultScope' : 'Sign In — VaultScope',
    description: isDe
      ? 'Melden Sie sich bei Ihrem VaultScope-Konto an.'
      : 'Sign in to your VaultScope infrastructure account.',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = form.email.trim();
    if (!identifier) {
      setError(
        isDe
          ? 'Bitte geben Sie Ihren Benutzernamen oder Ihre E-Mail-Adresse ein.'
          : 'Email or username is required.',
      );
      return;
    }
    if (!form.password) {
      setError(isDe ? 'Passwort ist erforderlich.' : 'Password is required.');
      return;
    }
    if (mfaRequired && (!totpCode || totpCode.trim().length !== 6)) {
      setError(
        isDe
          ? 'Bitte geben Sie Ihren 6-stelligen Authentifizierungscode ein.'
          : 'Please enter your 6-digit authenticator code.',
      );
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload: Record<string, any> = {
        email: identifier,
        username: identifier,
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

      const { token, claims, name, username, email_verified } = data;
      localStorage.setItem('vs_token', token);
      const resolvedUsername =
        username ||
        claims?.username ||
        (!identifier.includes('@') ? identifier : identifier.split('@')[0]);
      if (resolvedUsername) {
        setStoredUsername(resolvedUsername);
      }
      if (name) {
        localStorage.setItem('vs_user_name', name);
      } else if (resolvedUsername) {
        localStorage.setItem('vs_user_name', resolvedUsername);
      }
      if (claims) {
        localStorage.setItem('vs_claims', JSON.stringify({ ...claims, username: resolvedUsername }));
      } else {
        try {
          const tokenParts = token.split('.');
          const decoded = JSON.parse(atob(tokenParts[1]));
          localStorage.setItem(
            'vs_claims',
            JSON.stringify({ ...decoded, username: decoded.username || resolvedUsername }),
          );
        } catch {
          // ignore decode error
        }
      }

      const activeRedirect =
        searchParams.get('redirect') || sessionStorage.getItem('vs_redirect');
      if (activeRedirect) {
        sessionStorage.removeItem('vs_redirect');
        window.location.href = activeRedirect;
      } else if (email_verified === false) {
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

  const registerHref = redirectParam
    ? `${localePath('/register')}?redirect=${encodeURIComponent(redirectParam)}`
    : localePath('/register');

  const inputCls =
    'w-full rounded-[6px] border border-[var(--line)] bg-[var(--bg-subtle)] text-[var(--fg)] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[var(--accent-bright)] focus:ring-1 focus:ring-[var(--accent-bright)]/30 transition-colors placeholder:text-[var(--fg-faint)]';
  const labelCls = 'block font-sans text-xs font-medium text-[var(--fg-muted)] mb-1.5';

  return (
    <div className="flex flex-col w-full bg-[var(--bg)] text-[var(--fg)]">
      <div className="vs-container w-full pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Control Panel Access Context */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent-bright)] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-bright)]" />
                {isDe ? 'Kundenportal-Zugang' : 'Control Panel Access'}
              </div>
              <h1 className="text-display-m text-[var(--fg)] mb-3">
                {mfaRequired
                  ? isDe
                    ? 'Zwei-Faktor-Authentifizierung'
                    : 'Two-Factor Challenge'
                  : isDe
                    ? 'Anmelden'
                    : 'Sign in'}
              </h1>
              <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
                {mfaRequired
                  ? isDe
                    ? 'Geben Sie den 6-stelligen Code aus Ihrer Authenticator-App ein, um die Sitzung zu autorisieren.'
                    : 'Enter the 6-digit code from your authenticator app to authorize this session.'
                  : isDe
                    ? 'Melden Sie sich mit Ihrem Benutzernamen oder Ihrer E-Mail-Adresse an, um Infrastruktur-Dienste, Rechnungen und Support-Tickets zu verwalten.'
                    : 'Sign in with your username or email to manage your infrastructure services, billing, and support tickets.'}
              </p>
            </div>

            <div className="divide-y divide-[var(--line)]">
              <div className="py-3 flex items-center justify-between text-xs">
                <span className="text-[var(--fg-muted)]">
                  {isDe ? 'Authentifizierung' : 'Authentication'}
                </span>
                <span className="font-mono text-[11px] text-[var(--fg)]">
                  Password + TOTP 2FA
                </span>
              </div>
              <div className="py-3 flex items-center justify-between text-xs">
                <span className="text-[var(--fg-muted)]">
                  {isDe ? 'API-Endpunkt' : 'Control Plane'}
                </span>
                <span className="font-mono text-[11px] text-[var(--fg)]">
                  DE / AT Storefront API
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Form Surface */}
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="max-w-[540px]">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-[var(--fg)]">
                      {mfaRequired
                        ? isDe
                          ? 'Sicherheitscode bestätigen'
                          : 'Verify Authenticator Code'
                        : isDe
                          ? 'Konto-Anmeldedaten'
                          : 'Account Credentials'}
                    </h2>
                    <span className="font-mono text-[11px] text-[var(--fg-faint)]">
                      TLS 1.3
                    </span>
                  </div>

                  {!mfaRequired ? (
                    <>
                      <div>
                        <label htmlFor="login-email" className={labelCls}>
                          {isDe ? 'E-Mail oder Benutzername' : 'Email or Username'}
                        </label>
                        <input
                          id="login-email"
                          type="text"
                          value={form.email}
                          onChange={(e) => update('email', e.target.value)}
                          placeholder={
                            isDe ? 'benutzername oder name@company.eu' : 'username or name@company.eu'
                          }
                          autoComplete="username"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label htmlFor="login-password" className={labelCls}>
                          {isDe ? 'Passwort' : 'Password'}
                        </label>
                        <input
                          id="login-password"
                          type="password"
                          value={form.password}
                          onChange={(e) => update('password', e.target.value)}
                          placeholder={isDe ? 'Ihr Passwort' : 'Your password'}
                          autoComplete="current-password"
                          className={inputCls}
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label htmlFor="login-totp" className={labelCls}>
                        {isDe ? '6-stelliger Authenticator-Code' : '6-Digit Authenticator Code'}
                      </label>
                      <input
                        id="login-totp"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={totpCode}
                        onChange={(e) => {
                          setTotpCode(e.target.value.replace(/\D/g, ''));
                          if (error) setError('');
                        }}
                        placeholder="123456"
                        autoFocus
                        className="w-full rounded-[6px] border border-[var(--line)] bg-[var(--bg-subtle)] text-[var(--fg)] px-4 py-3 text-center text-xl font-mono tracking-widest focus:outline-none focus:border-[var(--accent-bright)] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setMfaRequired(false);
                          setTotpCode('');
                        }}
                        className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] mt-3 block cursor-pointer"
                      >
                        ← {isDe ? 'Zurück zur Passworteingabe' : 'Back to credentials'}
                      </button>
                    </div>
                  )}

                  {error && (
                    <div
                      className="rounded-[6px] border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-400"
                      role="alert"
                    >
                      {error}
                    </div>
                  )}

                  <div className="pt-1">
                    <Button type="submit" disabled={submitting} className="w-full justify-center py-2.5">
                      {submitting
                        ? isDe
                          ? 'Wird überprüft...'
                          : 'Verifying...'
                        : mfaRequired
                          ? isDe
                            ? 'Code bestätigen & anmelden'
                            : 'Verify & Sign In'
                          : isDe
                            ? 'Anmelden'
                            : 'Sign In'}
                    </Button>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-[var(--fg-muted)]">
                    {isDe ? 'Noch kein Konto?' : "Don't have an account?"}
                  </span>
                  <Link
                    to={registerHref}
                    className="text-[var(--accent-bright)] hover:underline underline-offset-4 font-medium"
                  >
                    {isDe ? 'Konto erstellen →' : 'Create one →'}
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
