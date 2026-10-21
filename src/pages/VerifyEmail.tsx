import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '../components/Shared';
import { useLanguage } from '../i18n';
import { useDocumentMeta } from '../lib/useDocumentMeta';

const API_BASE =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'vaultscope.de' ||
    window.location.hostname.endsWith('.vaultscope.de'))
    ? '/api'
    : import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { locale, localePath } = useLanguage();
  const isDe = locale === 'de';

  useDocumentMeta({
    title: isDe ? 'E-Mail bestätigen — VaultScope' : 'Verify Email — VaultScope',
    description: isDe
      ? 'Bestätigen Sie Ihre E-Mail-Adresse für Ihr VaultScope-Konto.'
      : 'Confirm your email address for your VaultScope account.',
  });

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setSuccess(false);
      setMessage('No verification token provided in the URL.');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setSuccess(true);
          setMessage(data.message || 'Your email has been successfully verified.');
        } else {
          setSuccess(false);
          setMessage(data.error || 'Verification failed or link has expired.');
        }
      } catch {
        setSuccess(false);
        setMessage('Network error while verifying email. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim() || !resendEmail.includes('@')) return;

    setResending(true);
    setResendMessage(null);
    try {
      const res = await fetch(`${API_BASE}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      setResendMessage(
        data.message || 'If an account exists, a new verification link was sent.',
      );
    } catch {
      setResendMessage('Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[70vh] justify-center items-center px-6 pt-32 pb-24 bg-[var(--bg-primary)] text-[var(--text)]">
      <div className="max-w-md w-full border-t-2 border-[var(--accent)] border-x border-b border-[var(--line)] p-8 bg-[var(--bg-surface)]/50 backdrop-blur-md">
        {loading ? (
          <div className="py-10 space-y-4 text-center">
            <Loader2 className="w-8 h-8 text-[var(--accent-bright)] mx-auto animate-spin" />
            <h2 className="text-lg font-semibold tracking-tight">Verifying your email...</h2>
            <p className="text-xs text-[var(--text-muted)]">
              Please wait while we confirm your email address.
            </p>
          </div>
        ) : success ? (
          <div className="space-y-5">
            <div className="w-10 h-10 border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-[var(--accent-bright)] mb-1.5">Identity Confirmed</div>
              <h2 className="text-2xl font-semibold tracking-[-0.025em] text-[var(--text)] mb-2">
                Email Verified!
              </h2>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{message}</p>
            </div>
            <div className="pt-2 flex flex-col gap-3">
              <Link to={localePath('/dashboard')}>
                <Button className="w-full flex items-center justify-center gap-2 py-2.5">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to={localePath('/dashboard/profile')}>
                <Button variant="outline" className="w-full py-2.5">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="w-10 h-10 border border-red-500/30 bg-red-500/10 text-red-400 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-red-400 mb-1.5">Verification Error</div>
              <h2 className="text-2xl font-semibold tracking-[-0.025em] text-[var(--text)] mb-2">
                Verification Failed
              </h2>
              <p className="text-xs text-red-400 leading-relaxed">{message}</p>
            </div>
            <div className="border-t border-[var(--line)] pt-5 mt-5">
              <h3 className="font-mono text-xs text-[var(--text)] mb-1.5">
                Need a new verification link?
              </h3>
              <p className="text-xs text-[var(--text-muted)] mb-3">
                Enter your email address to receive a fresh verification link. Don't forget to check
                your Spam folder!
              </p>
              <form onSubmit={handleResend} className="space-y-3">
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border border-[var(--line)] bg-[var(--bg-primary)] text-[var(--text)] px-3.5 py-2 text-sm focus:outline-none focus:border-[var(--accent-bright)]"
                />
                <Button type="submit" disabled={resending} className="w-full text-xs py-2">
                  {resending ? 'Sending...' : 'Resend Verification Email'}
                </Button>
                {resendMessage && (
                  <p className="text-xs text-emerald-400 mt-2">{resendMessage}</p>
                )}
              </form>
            </div>
            <div className="pt-2">
              <Link to={localePath('/login')}>
                <Button variant="outline" className="w-full text-xs py-2">
                  Back to Sign in
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
