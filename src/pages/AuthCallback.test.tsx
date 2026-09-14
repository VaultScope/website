import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthCallback } from './AuthCallback';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../lib/auth', () => ({
  handleCallback: vi.fn(),
}));

import { handleCallback } from '../lib/auth';
const mockHandleCallback = vi.mocked(handleCallback);

function renderWithParams(params: string) {
  return render(
    <MemoryRouter initialEntries={[`/auth/callback${params}`]}>
      <AuthCallback />
    </MemoryRouter>
  );
}

describe('AuthCallback', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockHandleCallback.mockReset();
  });

  it('shows loading state initially', () => {
    mockHandleCallback.mockReturnValue(new Promise(() => {}));
    renderWithParams('?code=abc123&state=valid-state');
    expect(screen.getByText('Authenticating...')).toBeDefined();
  });

  it('shows error when code is missing', async () => {
    renderWithParams('?state=valid-state');

    await waitFor(() => {
      expect(screen.getByText('Missing authorization code')).toBeDefined();
    });
  });

  it('shows error when state is missing', async () => {
    renderWithParams('?code=abc123');

    await waitFor(() => {
      expect(screen.getByText('Missing authorization code')).toBeDefined();
    });
  });

  it('shows error when both code and state are missing', async () => {
    renderWithParams('');

    await waitFor(() => {
      expect(screen.getByText('Missing authorization code')).toBeDefined();
    });
  });

  it('calls handleCallback with code and state', async () => {
    mockHandleCallback.mockResolvedValue({
      sub: 'user-1', email: 'test@example.com', role: 'customer',
      audience: 'storefront', exp: 9999999999, iat: 0,
    });

    renderWithParams('?code=my-code&state=my-state');

    await waitFor(() => {
      expect(mockHandleCallback).toHaveBeenCalledWith('my-code', 'my-state');
    });
  });

  it('navigates to /dashboard on success', async () => {
    mockHandleCallback.mockResolvedValue({
      sub: 'user-1', email: 'test@example.com', role: 'customer',
      audience: 'storefront', exp: 9999999999, iat: 0,
    });

    renderWithParams('?code=valid-code&state=valid-state');

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('shows error message on auth failure', async () => {
    mockHandleCallback.mockRejectedValue(new Error('Invalid state parameter'));
    renderWithParams('?code=abc&state=wrong-state');

    await waitFor(() => {
      expect(screen.getByText('Authentication Failed')).toBeDefined();
      expect(screen.getByText('Invalid state parameter')).toBeDefined();
    });
  });

  it('renders "Try again" link pointing to /dashboard', async () => {
    mockHandleCallback.mockRejectedValue(new Error('Token expired'));
    renderWithParams('?code=abc&state=xyz');

    await waitFor(() => {
      const link = screen.getByText('Try again');
      expect(link.getAttribute('href')).toBe('/dashboard');
    });
  });

  it('does not call handleCallback twice (StrictMode guard)', async () => {
    mockHandleCallback.mockResolvedValue({
      sub: 'user-1', email: 'test@example.com', role: 'customer',
      audience: 'storefront', exp: 9999999999, iat: 0,
    });

    renderWithParams('?code=code1&state=state1');

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });

    expect(mockHandleCallback).toHaveBeenCalledTimes(1);
  });
});
