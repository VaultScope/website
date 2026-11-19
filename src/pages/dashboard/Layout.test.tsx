import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './Layout';

function renderLayout(initialEntry = '/dashboard') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<div>Dashboard Content</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('DashboardLayout auth & session hygiene', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('handles malformed JSON in vs_claims safely without crashing and blocks dashboard', () => {
    localStorage.setItem('vs_token', 'some-token');
    localStorage.setItem('vs_claims', '{not-valid-json');

    renderLayout();

    expect(screen.getByText('VaultScope Dashboard')).toBeDefined();
    expect(screen.queryByText('Dashboard Content')).toBeNull();
  });

  it('rejects expired claims even when vs_token exists and clears auth storage', () => {
    localStorage.setItem('vs_token', 'expired-jwt');
    localStorage.setItem(
      'vs_claims',
      JSON.stringify({
        sub: 'u1',
        email: 'user@example.com',
        role: 'customer',
        audience: 'storefront',
        exp: Math.floor(Date.now() / 1000) - 60,
        iat: Math.floor(Date.now() / 1000) - 3600,
      }),
    );

    renderLayout();

    expect(screen.getByText('VaultScope Dashboard')).toBeDefined();
    expect(screen.queryByText('Dashboard Content')).toBeNull();
    expect(localStorage.getItem('vs_token')).toBeNull();
  });

  it('renders outlet for valid session and clears all auth keys via unified logout', () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({ ok: true, json: async () => ({}) } as Response);

    localStorage.setItem('vs_token', 'valid-jwt');
    localStorage.setItem('vs_user_name', 'User');
    localStorage.setItem('vs_username', 'user1');
    localStorage.setItem('vs_preview_mode', '1');
    sessionStorage.setItem('vs_redirect', '/dashboard');
    localStorage.setItem(
      'vs_claims',
      JSON.stringify({
        sub: 'u1',
        email: 'user@example.com',
        username: 'user1',
        role: 'customer',
        audience: 'storefront',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      }),
    );

    renderLayout();

    expect(screen.getByText('Dashboard Content')).toBeDefined();

    fireEvent.click(screen.getByLabelText('Sign out'));

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/auth/logout'),
      expect.objectContaining({ method: 'POST' }),
    );
    expect(localStorage.getItem('vs_token')).toBeNull();
    expect(localStorage.getItem('vs_claims')).toBeNull();
    expect(localStorage.getItem('vs_user_name')).toBeNull();
    expect(localStorage.getItem('vs_username')).toBeNull();
    expect(localStorage.getItem('vs_preview_mode')).toBeNull();
    expect(sessionStorage.getItem('vs_redirect')).toBeNull();
    expect(screen.getByText('Login Page')).toBeDefined();
  });
});
