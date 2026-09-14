import { useState } from 'react';
import { Button } from './Shared';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';

type Status = 'idle' | 'loading' | 'success' | 'error' | 'unconfigured';

const LISTMONK_URL       = import.meta.env.VITE_LISTMONK_URL       as string | undefined;
const LISTMONK_LIST_UUID = import.meta.env.VITE_LISTMONK_LIST_UUID as string | undefined;

export const WaitlistForm = () => {
  const { t } = useLanguage();
  const [email,  setEmail]  = useState('');
  const [status, setStatus] = useState<Status>(
    !LISTMONK_URL || !LISTMONK_LIST_UUID ? 'unconfigured' : 'idle'
  );
  const [errorMsg, setErrorMsg] = useState('');

  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading' || status === 'success') return;

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    if (!trimmedEmail || !trimmedName) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const isProd = import.meta.env.PROD;
      const endpoint = isProd && LISTMONK_URL 
        ? `${LISTMONK_URL}/api/public/subscription` 
        : '/api/listmonk/api/public/subscription';

      const res = await fetch(endpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:      trimmedEmail,
          name:       trimmedName,
          list_uuids: [LISTMONK_LIST_UUID],
        }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
        setName('');
      } else {
        const body = await res.json().catch(() => ({}));
        setErrorMsg(body?.message ?? t.waitlistForm.errorGeneric);
        setStatus('error');
      }
    } catch {
      setErrorMsg(t.waitlistForm.errorNetwork);
      setStatus('error');
    }
  };

  // Env vars not configured - show a fallback during development
  if (status === 'unconfigured') {
    return (
      <div className="border border-border p-6 max-w-md w-full">
        <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-2">
          {t.waitlistForm.label}
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
          {t.waitlistForm.subscribedLabel}
        </p>
        <p className="text-sm text-foreground/60 font-light leading-relaxed">
          {t.waitlistForm.successMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full">
      <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-4">
        {t.waitlistForm.getNotified}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => { setName(e.target.value); if (status === 'error') setStatus('idle'); }}
          placeholder={(t.waitlistForm as any).namePlaceholder || "Your Name"}
          disabled={status === 'loading'}
          className="
            w-full h-14 px-5 bg-background border border-border
            text-sm text-foreground font-light
            placeholder:text-foreground/25
            focus:outline-none focus:border-foreground/40
            transition-colors
            disabled:opacity-50
          "
        />
        <div className="flex flex-col sm:flex-row gap-0">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
            placeholder={(t.waitlistForm as any).emailPlaceholder || "your@email.com"}
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
            className="h-14 px-8 shrink-0 sm:border-l-0 sm:border-t border-border sm:mt-0 mt-3 disabled:opacity-50"
          >
            {status === 'loading' ? t.waitlistForm.sending : t.waitlistForm.notifyMe}
          </Button>
        </div>
      </form>

      {status === 'error' && (
        <p className="mt-3 text-xs text-foreground/50 font-light">{errorMsg}</p>
      )}

      <p className="mt-3 text-xs text-foreground/30 font-light">
        {t.waitlistForm.disclaimer}{' '}
        <LocaleLink to="/legal/privacy/" className="hover:text-foreground/50 transition-colors underline underline-offset-2">
          {t.nav.privacyPolicy}
        </LocaleLink>
      </p>
    </div>
  );
};
