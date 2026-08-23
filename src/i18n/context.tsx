import { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { en } from './locales/en';
import { de } from './locales/de';

export type Locale = 'en' | 'de';

interface LanguageContextValue {
  locale: Locale;
  t: typeof en;
  localePath: (path: string) => string;
  switchLocale: (newLocale: Locale) => void;
  stripLocale: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const locales = { en, de } as const;

function getLocaleFromPath(pathname: string): Locale {
  if (pathname === '/de' || pathname.startsWith('/de/')) return 'de';
  return 'en';
}

function stripLocalePath(pathname: string): string {
  if (pathname === '/de') return '/';
  if (pathname.startsWith('/de/')) return pathname.slice(3);
  return pathname;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const locale = getLocaleFromPath(location.pathname);
  const t = locales[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    t,
    localePath: (path: string) => {
      if (path.startsWith('http') || path.startsWith('#')) return path;
      if (locale === 'en') return path;
      return `/de${path === '/' ? '' : path}`;
    },
    switchLocale: (newLocale: Locale) => {
      const stripped = stripLocalePath(location.pathname);
      const search = location.search;
      const hash = location.hash;
      if (newLocale === 'en') {
        navigate(`${stripped}${search}${hash}`);
      } else {
        navigate(`/de${stripped === '/' ? '' : stripped}${search}${hash}`);
      }
    },
    stripLocale: stripLocalePath,
  }), [locale, t, location.pathname, location.search, location.hash, navigate]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
