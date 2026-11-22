import { describe, it, expect, beforeEach } from 'vitest';
import {
  getGtmContainerIds,
  getStoredConsent,
  initAnalyticsConsent,
  setAnalyticsConsent,
  trackPageView,
} from './analytics';

describe('analytics consent & GTM integration', () => {
  beforeEach(() => {
    localStorage.clear();
    window.dataLayer = [];
    delete window.gtag;
  });

  it('includes both configured GTM container IDs', () => {
    expect(getGtmContainerIds()).toEqual(['GTM-K99ZS3QV', 'GTM-WFZPL3MZ']);
  });

  it('initializes Consent Mode v2 with denied defaults when no consent is stored', () => {
    initAnalyticsConsent();
    expect(getStoredConsent()).toBeNull();
    expect(window.dataLayer?.length).toBe(1);
    const entry = window.dataLayer?.[0] as unknown[];
    expect(entry[0]).toBe('consent');
    expect(entry[1]).toBe('default');
    expect(entry[2]).toMatchObject({ analytics_storage: 'denied', ad_storage: 'denied' });
  });

  it('persists consent choice and tracks page views only after acceptance', () => {
    initAnalyticsConsent();
    trackPageView('/infrastructure');
    expect(window.dataLayer?.some((item: any) => item?.event === 'page_view')).toBe(false);

    setAnalyticsConsent('accepted');
    expect(getStoredConsent()?.status).toBe('accepted');

    trackPageView('/infrastructure', 'Infrastructure');
    expect(
      window.dataLayer?.some(
        (item: any) => item?.event === 'page_view' && item?.page_path === '/infrastructure',
      ),
    ).toBe(true);
  });

  it('stops tracking page views when consent is rejected', () => {
    setAnalyticsConsent('rejected');
    expect(getStoredConsent()?.status).toBe('rejected');
    trackPageView('/legal/privacy');
    expect(window.dataLayer?.some((item: any) => item?.event === 'page_view')).toBe(false);
  });
});
