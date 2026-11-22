import { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';
import {
  getStoredConsent,
  setAnalyticsConsent,
  OPEN_CONSENT_EVENT,
  trackPageView,
} from '../lib/analytics';

export function ConsentBanner() {
  const { locale } = useLanguage();
  const isDe = locale === 'de';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = getStoredConsent();
    if (!existing) {
      setVisible(true);
    }

    const handleOpen = () => setVisible(true);
    window.addEventListener(OPEN_CONSENT_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, handleOpen);
  }, []);

  if (!visible) return null;

  const handleChoice = (status: 'accepted' | 'rejected') => {
    setAnalyticsConsent(status);
    setVisible(false);
    if (status === 'accepted') {
      trackPageView(window.location.pathname + window.location.search, document.title);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={isDe ? 'Datenschutz- und Cookie-Einstellungen' : 'Privacy and Cookie Settings'}
      className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 rounded-xl border border-[var(--line-strong)] bg-[var(--bg-elevated)]/95 backdrop-blur-xl p-5 shadow-2xl"
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
          <h2 className="text-xs font-semibold text-[var(--fg)] uppercase tracking-wider font-mono">
            {isDe ? 'Datenschutz & Analyse' : 'Privacy & Analytics'}
          </h2>
        </div>
        {getStoredConsent() && (
          <button
            type="button"
            onClick={() => setVisible(false)}
            aria-label={isDe ? 'Schließen' : 'Close'}
            className="text-[var(--fg-faint)] hover:text-[var(--fg)] p-0.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-xs text-[var(--fg-muted)] leading-relaxed mb-4">
        {isDe ? (
          <>
            Wir verwenden technisch notwendigen Speicher für Portal-Funktionen. Mit Ihrer Einwilligung laden wir zusätzlich Google Tag Manager / Analytics zur Reichweitenmessung. Details in unserer{' '}
            <LocaleLink to="/legal/privacy" className="underline text-[var(--fg)] hover:text-[var(--accent-bright)]">
              Datenschutzerklärung
            </LocaleLink>
            .
          </>
        ) : (
          <>
            We use strictly necessary storage for core portal features. With your consent, we also load Google Tag Manager / Analytics to measure traffic. See our{' '}
            <LocaleLink to="/legal/privacy" className="underline text-[var(--fg)] hover:text-[var(--accent-bright)]">
              Privacy Policy
            </LocaleLink>
            .
          </>
        )}
      </p>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={() => handleChoice('rejected')}
          className="flex-1 h-9 px-3 rounded-lg border border-[var(--line-strong)] bg-transparent text-xs font-medium text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
        >
          {isDe ? 'Nur notwendige' : 'Essential Only'}
        </button>
        <button
          type="button"
          onClick={() => handleChoice('accepted')}
          className="flex-1 h-9 px-3 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-bright)] transition-colors cursor-pointer"
        >
          {isDe ? 'Analyse akzeptieren' : 'Accept Analytics'}
        </button>
      </div>
    </div>
  );
}
