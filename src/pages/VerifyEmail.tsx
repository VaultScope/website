import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '../components/Shared';
import { useLanguage } from '../i18n';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { localePath } = useLanguage();

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
      setResendMessage(data.message || 'If an account exists, a new verification link was sent.');
    } catch {
      setResendMessage('Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[70vh] justify-center items-center px-6 py-24">
      <div className="max-w-md w-full border border-border p-8 bg-card rounded-xl shadow-lg text-center">
        {loading ? (
          <div className="py-12 space-y-4">
            <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
            <h2 className="text-xl font-medium">Verifying your email...</h2>
            <p className="text-sm text-muted-foreground">Please wait while we confirm your email address.</p>
          </div>
        ) : success ? (
          <div className="py-8 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Email Verified!</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {message}
            </p>
            <div className="pt-4 flex flex-col gap-3">
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
          <div className="py-8 space-y-5">
            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Verification Failed</h2>
            <p className="text-sm text-red-400/90 leading-relaxed">
              {message}
            </p>
            <div className="border-t border-border pt-6 mt-6 text-left">
              <h3 className="text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-2">
                Need a new verification link?
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Enter your email address to receive a fresh verification link. Don't forget to check your Spam folder!
              </p>
              <form onSubmit={handleResend} className="space-y-3">
                <input
                  type="email"
                  value={resendEmail}
                  onChange={e => setResendEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border border-border bg-transparent px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-foreground"
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
