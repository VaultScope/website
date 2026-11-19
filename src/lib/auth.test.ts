import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  getStoredClaims,
  isAuthenticated,
  getToken,
  logout,
  sanitizeRedirectPath,
  sanitizeSafeUrl,
} from './auth';
import type { AuthClaims } from './auth';

const validClaims: AuthClaims = {
  sub: '550e8400-e29b-41d4-a716-446655440000',
  email: 'user@example.com',
  role: 'customer',
  audience: 'storefront',
  exp: Math.floor(Date.now() / 1000) + 3600,
  iat: Math.floor(Date.now() / 1000),
};

const expiredClaims: AuthClaims = {
  ...validClaims,
  exp: Math.floor(Date.now() / 1000) - 3600,
};

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getStoredClaims', () => {
  it('returns null when no claims stored', () => {
    expect(getStoredClaims()).toBeNull();
  });

  it('returns claims when valid and not expired', () => {
    localStorage.setItem('vs_claims', JSON.stringify(validClaims));
    const result = getStoredClaims();
    expect(result).toEqual(validClaims);
  });

  it('returns null and clears storage when claims are expired', () => {
    localStorage.setItem('vs_claims', JSON.stringify(expiredClaims));
    localStorage.setItem('vs_token', 'some-token');
    const result = getStoredClaims();
    expect(result).toBeNull();
    expect(localStorage.getItem('vs_token')).toBeNull();
    expect(localStorage.getItem('vs_claims')).toBeNull();
  });

  it('returns null for invalid JSON', () => {
    localStorage.setItem('vs_claims', 'not-json');
    expect(getStoredClaims()).toBeNull();
  });
});

describe('isAuthenticated', () => {
  it('returns false when no claims', () => {
    expect(isAuthenticated()).toBe(false);
  });

  it('returns true when valid claims exist', () => {
    localStorage.setItem('vs_claims', JSON.stringify(validClaims));
    expect(isAuthenticated()).toBe(true);
  });

  it('returns false when claims are expired', () => {
    localStorage.setItem('vs_claims', JSON.stringify(expiredClaims));
    expect(isAuthenticated()).toBe(false);
  });
});

describe('getToken', () => {
  it('returns null when not authenticated', () => {
    expect(getToken()).toBeNull();
  });

  it('returns token when authenticated', () => {
    localStorage.setItem('vs_claims', JSON.stringify(validClaims));
    localStorage.setItem('vs_token', 'jwt-token-123');
    expect(getToken()).toBe('jwt-token-123');
  });

  it('returns null when claims expired even if token exists', () => {
    localStorage.setItem('vs_claims', JSON.stringify(expiredClaims));
    localStorage.setItem('vs_token', 'jwt-token-123');
    expect(getToken()).toBeNull();
  });
});

describe('logout', () => {
  it('dispatches best-effort POST /api/auth/logout and removes all auth storage keys', () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({ ok: true, json: async () => ({}) } as Response);

    localStorage.setItem('vs_token', 'token');
    localStorage.setItem('vs_claims', JSON.stringify(validClaims));
    localStorage.setItem('vs_user_name', 'User');
    localStorage.setItem('vs_username', 'user');
    localStorage.setItem('vs_preview_mode', '1');
    sessionStorage.setItem('vs_redirect', '/dashboard/vps');

    logout();

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/auth/logout'),
      expect.objectContaining({
        method: 'POST',
        headers: { Authorization: 'Bearer token' },
        credentials: 'include',
        keepalive: true,
      }),
    );
    expect(localStorage.getItem('vs_token')).toBeNull();
    expect(localStorage.getItem('vs_claims')).toBeNull();
    expect(localStorage.getItem('vs_user_name')).toBeNull();
    expect(localStorage.getItem('vs_username')).toBeNull();
    expect(localStorage.getItem('vs_preview_mode')).toBeNull();
    expect(sessionStorage.getItem('vs_redirect')).toBeNull();
  });
});

describe('sanitizeRedirectPath', () => {
  it('allows valid same-origin relative paths with query and hash', () => {
    expect(sanitizeRedirectPath('/dashboard/vps?tab=network#top')).toBe(
      '/dashboard/vps?tab=network#top',
    );
    expect(sanitizeRedirectPath('/de/dashboard/billing')).toBe('/de/dashboard/billing');
  });

  it('rejects external origins, protocol-relative URLs, backslashes, and javascript URIs', () => {
    expect(sanitizeRedirectPath('https://evil.com/phish')).toBe('/dashboard');
    expect(sanitizeRedirectPath('http://evil.com')).toBe('/dashboard');
    expect(sanitizeRedirectPath('//evil.com')).toBe('/dashboard');
    expect(sanitizeRedirectPath('///evil.com')).toBe('/dashboard');
    expect(sanitizeRedirectPath('/\\evil.com')).toBe('/dashboard');
    expect(sanitizeRedirectPath('javascript:alert(1)')).toBe('/dashboard');
    expect(sanitizeRedirectPath('/\t//evil.com')).toBe('/dashboard');
    expect(sanitizeRedirectPath(null)).toBe('/dashboard');
    expect(sanitizeRedirectPath('')).toBe('/dashboard');
  });

  it('rejects redirect loops back to login or register routes', () => {
    expect(sanitizeRedirectPath('/login')).toBe('/dashboard');
    expect(sanitizeRedirectPath('/login?redirect=/dashboard')).toBe('/dashboard');
    expect(sanitizeRedirectPath('/de/login')).toBe('/dashboard');
    expect(sanitizeRedirectPath('/register')).toBe('/dashboard');
    expect(sanitizeRedirectPath('/de/register?next=/x')).toBe('/dashboard');
    expect(sanitizeRedirectPath('/foo/../login')).toBe('/dashboard');
  });
});

describe('sanitizeSafeUrl', () => {
  it('allows http and https URLs and rejects dangerous schemes', () => {
    expect(sanitizeSafeUrl('https://vaultscope.de/docs')).toBe('https://vaultscope.de/docs');
    expect(sanitizeSafeUrl('http://localhost:8080/test')).toBe('http://localhost:8080/test');
    expect(sanitizeSafeUrl('javascript:alert(1)')).toBeNull();
    expect(sanitizeSafeUrl('JaVaScRiPt:alert(document.cookie)')).toBeNull();
    expect(sanitizeSafeUrl('data:text/html,<script>alert(1)</script>')).toBeNull();
    expect(sanitizeSafeUrl('vbscript:msgbox(1)')).toBeNull();
    expect(sanitizeSafeUrl('wss://console.example.com/1')).toBeNull();
  });

  it('supports allowRelative only for single-slash paths and explicit protocol allowlist', () => {
    expect(sanitizeSafeUrl('/uploads/tickets/error.png')).toBeNull();
    expect(sanitizeSafeUrl('/uploads/tickets/error.png', true)).toBe('/uploads/tickets/error.png');
    expect(sanitizeSafeUrl('//evil.com/img.png', true)).toBeNull();
    expect(sanitizeSafeUrl('/\\evil.com/img.png', true)).toBeNull();
    expect(sanitizeSafeUrl('wss://console.example.com/1', true, ['https:', 'http:', 'wss:'])).toBe(
      'wss://console.example.com/1',
    );
  });
});


