import { useEffect } from 'react';
import { Button } from '../components/Shared';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';

export const NotFound = () => {
  const { locale } = useLanguage();
  useEffect(() => {
    document.title = "404 — VaultScope";
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-32 pb-24">
      <p className="text-xs font-medium text-foreground/25 uppercase tracking-widest mb-6">404</p>
      <h1 className="text-4xl md:text-6xl font-medium tracking-tighter text-foreground mb-6 leading-[0.9] max-w-lg">
        {locale === 'de' ? 'Seite nicht gefunden.' : 'Page not found.'}
      </h1>
      <p className="text-lg text-foreground/40 font-light mb-12 max-w-sm">
        {locale === 'de'
          ? 'Die gesuchte Seite existiert nicht oder wurde verschoben.'
          : "The page you're looking for doesn't exist or has been moved."}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <LocaleLink to="/">
          <Button>{locale === 'de' ? 'Zur Startseite' : 'Go Home'}</Button>
        </LocaleLink>
        <LocaleLink to="/company/contact/">
          <Button variant="outline">{locale === 'de' ? 'Kontakt' : 'Contact Us'}</Button>
        </LocaleLink>
      </div>
    </div>
  );
};
