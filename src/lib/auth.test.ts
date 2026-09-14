import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getStoredClaims, isAuthenticated, getToken, logout, handleCallback } from './auth';
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
  it('removes token and claims from storage', () => {
    localStorage.setItem('vs_token', 'token');
    localStorage.setItem('vs_claims', JSON.stringify(validClaims));
    logout();
    expect(localStorage.getItem('vs_token')).toBeNull();
    expect(localStorage.getItem('vs_claims')).toBeNull();
  });
});

describe('handleCallback', () => {
  it('throws on state mismatch', async () => {
    sessionStorage.setItem('oidc_state', 'correct-state');
    await expect(handleCallback('code123', 'wrong-state')).rejects.toThrow('Invalid state parameter');
  });

  it('throws when no saved state exists', async () => {
    await expect(handleCallback('code123', 'some-state')).rejects.toThrow('Invalid state parameter');
  });

  it('clears oidc_state from sessionStorage on valid state', async () => {
    sessionStorage.setItem('oidc_state', 'valid-state');
    const mockResponse = { token: 'new-token', claims: validClaims };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await handleCallback('code123', 'valid-state');
    expect(sessionStorage.getItem('oidc_state')).toBeNull();
    expect(result).toEqual(validClaims);
    expect(localStorage.getItem('vs_token')).toBe('new-token');
    expect(JSON.parse(localStorage.getItem('vs_claims')!)).toEqual(validClaims);
  });

  it('throws on API error', async () => {
    sessionStorage.setItem('oidc_state', 'valid-state');
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Invalid code' }),
    });

    await expect(handleCallback('bad-code', 'valid-state')).rejects.toThrow('Invalid code');
  });
});
