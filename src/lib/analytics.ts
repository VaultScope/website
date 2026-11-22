export type ConsentStatus = 'accepted' | 'rejected';

export interface StoredConsent {
  status: ConsentStatus;
  updatedAt: string;
}

const CONSENT_STORAGE_KEY = 'vs_consent';
export const OPEN_CONSENT_EVENT = 'vs-open-consent';

const DEFAULT_GTM_IDS = ['GTM-K99ZS3QV', 'GTM-WFZPL3MZ'];

export function getGtmContainerIds(): string[] {
  const envIds = import.meta.env.VITE_GTM_IDS as string | undefined;
  if (envIds && envIds.trim()) {
    return envIds
      .split(',')
      .map((s) => s.trim())
      .filter((s) => /^GTM-[A-Z0-9]+$/i.test(s));
  }
  return DEFAULT_GTM_IDS;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | unknown[]>;
    gtag?: (...args: unknown[]) => void;
  }
}

function ensureGtagStub() {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
  }
}

export function getStoredConsent(): StoredConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && (parsed.status === 'accepted' || parsed.status === 'rejected')) {
      return parsed as StoredConsent;
    }
  } catch {
    // Ignore storage read errors
  }
  return null;
}

function injectGtmScripts() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (import.meta.env.MODE === 'test') return;

  ensureGtagStub();
  const ids = getGtmContainerIds();

  for (const id of ids) {
    if (document.querySelector(`script[data-gtm-id="${id}"]`)) {
      continue;
    }
    window.dataLayer!.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
    script.setAttribute('data-gtm-id', id);
    document.head.appendChild(script);
  }
}

/**
 * Initializes Google Consent Mode v2 defaults (denied) and loads GTM only if
 * the user has already explicitly consented.
 */
export function initAnalyticsConsent(): void {
  if (typeof window === 'undefined') return;
  ensureGtagStub();

  const stored = getStoredConsent();
  const granted = stored?.status === 'accepted';

  window.gtag!('consent', 'default', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500,
  });

  if (granted) {
    window.gtag!('js', new Date());
    injectGtmScripts();
  }
}

/**
 * Persists user consent decision and dynamically enables GTM + Consent Mode v2
 * update on acceptance.
 */
export function setAnalyticsConsent(status: ConsentStatus): void {
  if (typeof window === 'undefined') return;
  ensureGtagStub();

  const payload: StoredConsent = {
    status,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage write errors
  }

  window.gtag!('consent', 'update', {
    analytics_storage: status === 'accepted' ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  if (status === 'accepted') {
    window.gtag!('js', new Date());
    injectGtmScripts();
  } else if (typeof document !== 'undefined') {
    document
      .querySelectorAll('script[data-gtm-id]')
      .forEach((node) => node.parentNode?.removeChild(node));
  }
}

function isSensitiveRoute(rawPath: string): boolean {
  const clean = rawPath.split(/[?#]/)[0].replace(/^\/de(?=\/|$)/, '') || '/';
  return (
    clean === '/dashboard' ||
    clean.startsWith('/dashboard/') ||
    clean === '/verify-email' ||
    clean.startsWith('/verify-email/') ||
    clean === '/login' ||
    clean.startsWith('/login/') ||
    clean === '/register' ||
    clean.startsWith('/register/')
  );
}

export function trackPageView(path: string, title?: string): void {
  if (typeof window === 'undefined') return;
  const stored = getStoredConsent();
  if (stored?.status !== 'accepted') return;
  if (isSensitiveRoute(path) || isSensitiveRoute(window.location.pathname)) return;

  const cleanPath = path.split(/[?#]/)[0] || '/';
  const cleanLocation = `${window.location.origin}${window.location.pathname}`;

  ensureGtagStub();
  window.dataLayer!.push({
    event: 'page_view',
    page_path: cleanPath,
    page_location: cleanLocation,
    page_title: title || document.title,
  });
}

export function openConsentPreferences(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT));
}
