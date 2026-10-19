import { useState } from 'react';
import { Button } from './Shared';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';

type Status = 'idle' | 'loading' | 'success' | 'error' | 'unconfigured';

const LISTMONK_URL       = (import.meta.env.VITE_LISTMONK_URL       as string | undefined) || 'https://sub.vaultscope.de';
const LISTMONK_LIST_UUID = (import.meta.env.VITE_LISTMONK_LIST_UUID as string | undefined) || '75f4bf59-4f9b-41ea-b636-7d4bdb062041';

export const WaitlistForm = (_props: {
  variant?: string;
  className?: string;
  productSlug?: string;
} = {}) => {
  const { t, locale } = useLanguage();
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
      const endpoint = '/api/listmonk/api/public/subscription';

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

  if (status === 'unconfigured') {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-[var(--line)]">
          <p className="text-xs font-mono uppercase tracking-[0.06em] text-[var(--accent-bright)]">
            {t.waitlistForm.label}
          </p>
          <span className="font-mono text-[11px] text-[var(--fg-faint)]">
            info@vaultscope.de
          </span>
        </div>
        <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-5">
          {locale === 'de'
            ? 'Für Vorab-Kontingente, individuelle Hardware-Anfragen oder Status-Updates zu unseren Servern und unserer Software kontaktieren Sie unser Engineering-Team direkt.'
            : 'For priority capacity allocation, custom hardware configurations, or release notifications across our servers and software, contact our engineering team directly.'}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <LocaleLink to="/company/contact/">
            <Button variant="primary" className="h-9 px-4 text-xs">
              {t.common.contact}
            </Button>
          </LocaleLink>
          <a
            href="mailto:info@vaultscope.de?subject=VaultScope%20Allocation%20Inquiry"
            className="btn-secondary h-9 px-4 text-xs font-mono"
          >
            info@vaultscope.de
          </a>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="w-full py-2">
        <p className="text-xs font-semibold text-[var(--ok)] mb-1.5">
          {t.waitlistForm.subscribedLabel}
        </p>
        <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
          {t.waitlistForm.successMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-end pb-2 mb-3">
        <span className="font-mono text-[11px] text-[var(--fg-faint)]">
          {locale === 'de' ? 'Jederzeit abmeldbar' : 'Unsubscribe anytime'}
        </span>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5">
            <label className="block text-[11px] font-mono text-[var(--fg-muted)] mb-1.5">
              {(t.waitlistForm as any).namePlaceholder || (locale === 'de' ? 'Ihr Name' : 'Your Name')}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => { setName(e.target.value); if (status === 'error') setStatus('idle'); }}
              placeholder={(t.waitlistForm as any).namePlaceholder || (locale === 'de' ? 'Ihr Name' : 'Your Name')}
              aria-label={(t.waitlistForm as any).namePlaceholder || (locale === 'de' ? 'Ihr Name' : 'Your Name')}
              disabled={status === 'loading'}
              className="
                w-full h-10 px-3.5 rounded-[6px] bg-[var(--bg-subtle)] border border-[var(--line)]
                text-sm text-[var(--fg)]
                placeholder:text-[var(--fg-faint)]
                focus:outline-none focus:border-[var(--accent-bright)] focus:ring-1 focus:ring-[var(--accent-bright)]/40
                transition-all
                disabled:opacity-50
              "
            />
          </div>
          <div className="sm:col-span-7">
            <label className="block text-[11px] font-mono text-[var(--fg-muted)] mb-1.5">
              {(t.waitlistForm as any).emailPlaceholder || (locale === 'de' ? 'E-Mail-Adresse' : 'Email address')}
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
                placeholder={(t.waitlistForm as any).emailPlaceholder || 'your@email.com'}
                aria-label={(t.waitlistForm as any).emailPlaceholder || (locale === 'de' ? 'E-Mail-Adresse' : 'Email address')}
                disabled={status === 'loading'}
                className="
                  flex-1 h-10 px-3.5 rounded-[6px] bg-[var(--bg-subtle)] border border-[var(--line)]
                  text-sm text-[var(--fg)]
                  placeholder:text-[var(--fg-faint)]
                  focus:outline-none focus:border-[var(--accent-bright)] focus:ring-1 focus:ring-[var(--accent-bright)]/40
                  transition-all
                  disabled:opacity-50
                "
              />
              <Button
                type="submit"
                variant="primary"
                disabled={status === 'loading'}
                className="h-10 px-5 shrink-0 disabled:opacity-50"
              >
                {status === 'loading' ? t.waitlistForm.sending : t.waitlistForm.notifyMe}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {status === 'error' && (
        <p role="alert" className="mt-2.5 text-xs text-[var(--err)]">{errorMsg}</p>
      )}

      <p className="mt-3.5 text-xs text-[var(--fg-faint)]">
        {t.waitlistForm.disclaimer}{' '}
        <LocaleLink to="/legal/privacy/" className="text-[var(--fg-muted)] hover:text-[var(--accent-bright)] transition-colors underline underline-offset-2">
          {t.nav.privacyPolicy}
        </LocaleLink>
      </p>
    </div>
  );
};

