import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import { api } from '../../../lib/api';
const mockApi = vi.mocked(api);

const mockAccount = {
  id: 'c1',
  email: 'test@example.com',
  email_verified: true,
  name: 'Test User',
  company: 'Acme Corp',
  country: 'DE',
  phone: '+49123456',
};

describe('ProfileAccount interactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state', async () => {
    mockApi.get.mockReturnValue(new Promise(() => {}));
    const { ProfileAccount } = await import('./Account');
    render(<MemoryRouter><ProfileAccount /></MemoryRouter>);
    expect(screen.getByText(/Loading profile/)).toBeDefined();
  });

  it('displays account information after load', async () => {
    mockApi.get.mockResolvedValue(mockAccount);
    const { ProfileAccount } = await import('./Account');
    render(<MemoryRouter><ProfileAccount /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getAllByText('test@example.com').length).toBeGreaterThan(0);
    });
    expect(screen.getByText('Test User')).toBeDefined();
    expect(screen.getByText('Acme Corp')).toBeDefined();
    expect(screen.getByText('DE')).toBeDefined();
    expect(screen.getByText('+49123456')).toBeDefined();
  });

  it('displays account ID', async () => {
    mockApi.get.mockResolvedValue(mockAccount);
    const { ProfileAccount } = await import('./Account');
    render(<MemoryRouter><ProfileAccount /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText('c1')).toBeDefined();
    });
  });

  it('calls api.get with profile path', async () => {
    mockApi.get.mockResolvedValue(mockAccount);
    const { ProfileAccount } = await import('./Account');
    render(<MemoryRouter><ProfileAccount /></MemoryRouter>);

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith('/storefront/profile');
    });
  });

  it('shows error state when API fails', async () => {
    mockApi.get.mockRejectedValue(new Error('API error'));
    const { ProfileAccount } = await import('./Account');
    render(<MemoryRouter><ProfileAccount /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load profile/)).toBeDefined();
    });
  });

  it('renders edit button', async () => {
    mockApi.get.mockResolvedValue(mockAccount);
    const { ProfileAccount } = await import('./Account');
    render(<MemoryRouter><ProfileAccount /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeDefined();
    });
  });

  it('renders section headers', async () => {
    mockApi.get.mockResolvedValue(mockAccount);
    const { ProfileAccount } = await import('./Account');
    render(<MemoryRouter><ProfileAccount /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText('Account Information')).toBeDefined();
    });
  });
});
