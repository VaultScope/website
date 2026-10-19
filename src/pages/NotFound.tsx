import { useEffect } from 'react';
import { Button } from '../components/Shared';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';

export const NotFound = () => {
  const { locale } = useLanguage();
  useEffect(() => {
    document.title = '404 — VaultScope';
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-24 bg-[var(--bg-primary)] text-[var(--text)]">
      <div className="max-w-lg w-full border-t-2 border-[var(--accent)] pt-8 md:pt-12">
        <p className="font-mono text-xs font-semibold text-[var(--accent-bright)] mb-4">
          404
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-[var(--text)] mb-4">
          {locale === 'de' ? 'Seite nicht gefunden.' : 'Page not found.'}
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-8">
          {locale === 'de'
            ? 'Die gesuchte Seite existiert nicht oder wurde verschoben.'
            : "The page you're looking for doesn't exist or has been moved."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[var(--line)]">
          <LocaleLink to="/">
            <Button>{locale === 'de' ? 'Zur Startseite' : 'Go Home'}</Button>
          </LocaleLink>
          <LocaleLink to="/company/contact/">
            <Button variant="outline">{locale === 'de' ? 'Kontakt' : 'Contact Us'}</Button>
          </LocaleLink>
        </div>
      </div>
    </div>
  );
};
