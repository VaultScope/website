import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from '../i18n';
import { Login } from './Login';

function renderLogin(initialEntry = '/login') {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <LanguageProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<div>Dashboard Home</div>} />
            <Route path="/dashboard/vps" element={<div>Dashboard VPS</div>} />
            <Route path="/dashboard/profile" element={<div>Dashboard Profile</div>} />
          </Routes>
        </LanguageProvider>
      </MemoryRouter>
    </HelmetProvider>,
  );
}

describe('Login page security & redirects', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    '/login?redirect=https://evil.com/phish',
    '/login?redirect=//evil.com/phish',
    '/login?redirect=/\\evil.com',
    '/login?redirect=javascript:alert(1)',
    '/login?redirect=/login',
    '/login?redirect=/register',
  ])('blocks open redirect / auth loop for %s and falls back to /dashboard', async (entry) => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'header.eyJzdWIiOiJ1MSIsImVtYWlsIjoidUBleGFtcGxlLmNvbSJ9.sig',
        claims: { sub: 'u1', email: 'u@example.com', role: 'customer', audience: 'storefront', exp: 9999999999, iat: 1000 },
        username: 'user1',
        email_verified: true,
      }),
    } as Response);

    renderLogin(entry);

    fireEvent.change(screen.getByLabelText(/Email or Username/i), { target: { value: 'user1' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText('Dashboard Home')).toBeDefined();
    });
  });

  it('allows valid same-origin relative redirect paths and decodes Base64URL JWT payloads', async () => {
    // Base64URL payload containing '-' and '_' without '=' padding:
    // {"sub":"u-1","email":"u@example.com","name":"Test_User?>"}
    const payloadJson = JSON.stringify({ sub: 'u-1', email: 'u@example.com', name: 'Test_User?>' });
    const base64Url = Buffer.from(payloadJson)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: `eyJhbGciOiJIUzI1NiJ9.${base64Url}.sig`,
        username: 'user1',
        email_verified: true,
      }),
    } as Response);

    renderLogin('/login?redirect=%2Fdashboard%2Fvps%3Fid%3D1');

    fireEvent.change(screen.getByLabelText(/Email or Username/i), { target: { value: 'user1' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText('Dashboard VPS')).toBeDefined();
    });

    const savedClaims = JSON.parse(localStorage.getItem('vs_claims') || '{}');
    expect(savedClaims.sub).toBe('u-1');
    expect(savedClaims.name).toBe('Test_User?>');
  });
});
