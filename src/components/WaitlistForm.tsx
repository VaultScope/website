import { useState } from 'react';
import { Button } from './Shared';

type Status = 'idle' | 'loading' | 'success' | 'error' | 'unconfigured';

const LISTMONK_URL       = import.meta.env.VITE_LISTMONK_URL       as string | undefined;
const LISTMONK_LIST_UUID = import.meta.env.VITE_LISTMONK_LIST_UUID as string | undefined;

export const WaitlistForm = () => {
  const [email,  setEmail]  = useState('');
  const [status, setStatus] = useState<Status>(
    !LISTMONK_URL || !LISTMONK_LIST_UUID ? 'unconfigured' : 'idle'
  );
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading' || status === 'success') return;

    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch(`${LISTMONK_URL}/api/public/subscription`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:      trimmed,
          list_uuids: [LISTMONK_LIST_UUID],
        }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        const body = await res.json().catch(() => ({}));
        setErrorMsg(body?.message ?? 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Unable to reach the subscription service. Please try again later.');
      setStatus('error');
    }
  };

  // Env vars not configured — show a fallback during development
  if (status === 'unconfigured') {
    return (
      <div className="border border-border p-6 max-w-md w-full">
        <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-2">
          Waitlist
        </p>
        <p className="text-sm text-foreground/40 font-light">
          Set <code className="font-mono bg-foreground/5 px-1 py-0.5 text-xs">VITE_LISTMONK_URL</code> and{' '}
          <code className="font-mono bg-foreground/5 px-1 py-0.5 text-xs">VITE_LISTMONK_LIST_UUID</code> to
          enable the waitlist form.
        </p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="border border-border p-6 max-w-md w-full">
        <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-2">
          Subscribed
        </p>
        <p className="text-sm text-foreground/60 font-light leading-relaxed">
          Check your inbox — a confirmation email is on its way. Click the link inside
          to confirm your place on the waitlist.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full">
      <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-4">
        Get notified when we launch
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
          placeholder="your@email.com"
          disabled={status === 'loading'}
          className="
            flex-1 h-14 px-5 bg-background border border-border
            text-sm text-foreground font-light
            placeholder:text-foreground/25
            focus:outline-none focus:border-foreground/40
            transition-colors
            disabled:opacity-50
          "
        />
        <Button
          type="submit"
          disabled={status === 'loading'}
          className="h-14 px-8 shrink-0 sm:border-l-0 border-border disabled:opacity-50"
        >
          {status === 'loading' ? 'Sending…' : 'Notify me'}
        </Button>
      </form>

      {status === 'error' && (
        <p className="mt-3 text-xs text-foreground/50 font-light">{errorMsg}</p>
      )}

      <p className="mt-3 text-xs text-foreground/30 font-light">
        Double opt-in. No spam. Unsubscribe any time.{' '}
        <a href="/legal/privacy/" className="hover:text-foreground/50 transition-colors underline underline-offset-2">
          Privacy Policy
        </a>
      </p>
    </div>
  );
};
