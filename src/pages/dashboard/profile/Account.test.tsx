import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProfileAccount } from './Account';

vi.mock('../../../lib/api', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from '../../../lib/api';
const mockGet = vi.mocked(api.get);

const mockProfile = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Max Mustermann',
  email: 'max@vaultscope.de',
  phone: '+49 170 1234567',
  company: 'VaultScope GmbH',
  address: 'Musterstraße 1',
  city: 'Berlin',
  country: 'DE',
  vat_id: 'DE123456789',
  two_factor_enabled: true,
  email_verified: true,
  created_at: '2025-06-15T10:30:00Z',
  updated_at: '2026-08-20T14:00:00Z',
  last_login: '2026-08-28T09:00:00Z',
};

function renderComponent() {
  return render(
    <MemoryRouter>
      <ProfileAccount />
    </MemoryRouter>
  );
}

describe('ProfileAccount', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('shows loading state initially', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText('Loading profile...')).toBeDefined();
  });

  it('renders profile data after successful load', async () => {
    mockGet.mockResolvedValue(mockProfile);
    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Loading profile...')).toBeNull();
    });

    expect(screen.getAllByText('max@vaultscope.de').length).toBeGreaterThan(0);
    expect(screen.getByText('Max Mustermann')).toBeDefined();
    expect(screen.getByText('VaultScope GmbH')).toBeDefined();
    expect(screen.getByText('DE')).toBeDefined();
    expect(screen.getByText('+49 170 1234567')).toBeDefined();
  });

  it('renders account ID', async () => {
    mockGet.mockResolvedValue(mockProfile);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('550e8400-e29b-41d4-a716-446655440000')).toBeDefined();
    });
  });

  it('renders created_at and updated_at dates', async () => {
    mockGet.mockResolvedValue(mockProfile);
    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Loading profile...')).toBeNull();
    });

    const dateElements = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}|\d{4}/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it('shows error state when API fails', async () => {
    mockGet.mockRejectedValue(new Error('Network error'));
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Failed to load profile.')).toBeDefined();
    });
  });

  it('renders email_verified badge when verified', async () => {
    mockGet.mockResolvedValue(mockProfile);
    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Loading profile...')).toBeNull();
    });

    // When email_verified is true, ShieldCheck icon renders beside the email
    const emailSpan = screen.getAllByText('max@vaultscope.de')[0];
    const svgIcon = emailSpan.closest('span')?.querySelector('svg');
    expect(svgIcon).not.toBeNull();
  });

  it('renders dash for missing optional fields', async () => {
    mockGet.mockResolvedValue({ ...mockProfile, company: '', phone: '' });
    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Loading profile...')).toBeNull();
    });

    const dashes = screen.getAllByText('-');
    expect(dashes.length).toBeGreaterThanOrEqual(2);
  });

  it('calls API with correct endpoint', async () => {
    mockGet.mockResolvedValue(mockProfile);
    renderComponent();

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/storefront/profile');
    });
  });

  it('renders last login as Never if null', async () => {
    mockGet.mockResolvedValue({ ...mockProfile, last_login: null });
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Never')).toBeDefined();
    });
  });
});
