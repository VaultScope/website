import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProfileMfa } from './Mfa';
import { api } from '../../../lib/api';

vi.mock('../../../lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

function renderComponent() {
  return render(
    <MemoryRouter>
      <ProfileMfa />
    </MemoryRouter>
  );
}

describe('ProfileMfa', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders disabled state when 2FA is inactive', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ two_factor_enabled: false });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Two-Factor Authentication (TOTP)')).toBeDefined();
    });

    expect(screen.getByText('Set up 2FA')).toBeDefined();
    expect(screen.getByText(/Protect your VaultScope account and cloud infrastructure/)).toBeDefined();
  });

  it('renders active state when 2FA is enabled', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ two_factor_enabled: true });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Two-Factor Authentication (TOTP)')).toBeDefined();
    });

    expect(screen.getByText('Disable 2FA')).toBeDefined();
    expect(screen.getByText(/Your account is actively protected/)).toBeDefined();
  });
});
