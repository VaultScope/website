import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { DsDetail } from './DsDetail';

vi.mock('../../lib/api', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from '../../lib/api';
const mockGet = vi.mocked(api.get);

const mockService = {
  id: 'ds-456',
  hostname: 'bare-metal-01',
  name: 'DS Enterprise',
  status: 'running',
  product_id: 'prod-ds-1',
  ip: '195.1.2.3',
  provider_resource_id: 'hetzner-abc',
  next_due: '2026-11-01T00:00:00Z',
};

const mockCatalog = [
  { id: 'prod-ds-1', name: 'DS Enterprise', category: 'ds', specs: { location: 'Helsinki', ram: '128 GB', server_type: 'AMD EPYC 7763', disk: '4x 1TB NVMe' } },
];

function renderComponent() {
  return render(
    <MemoryRouter initialEntries={['/dashboard/ds/ds-456']}>
      <Routes>
        <Route path="/dashboard/ds/:id" element={<DsDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('DsDetail', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('shows loading state initially', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('shows "Service not found" when null', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path.includes('/storefront/services/')) return Promise.resolve(null);
      if (path.includes('/storefront/catalog')) return Promise.resolve([]);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Service not found')).toBeDefined();
    });
  });

  it('renders server details after load', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path.includes('/storefront/services/')) return Promise.resolve(mockService);
      if (path.includes('/storefront/catalog')) return Promise.resolve(mockCatalog);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('bare-metal-01')).toBeDefined();
    });

    expect(screen.getByText('DS Enterprise')).toBeDefined();
    expect(screen.getByText('128 GB')).toBeDefined();
    expect(screen.getByText('AMD EPYC 7763')).toBeDefined();
  });

  it('renders VaultScope ID and Provider ID', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path.includes('/storefront/services/')) return Promise.resolve(mockService);
      if (path.includes('/storefront/catalog')) return Promise.resolve(mockCatalog);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getAllByText('ds-456').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('hetzner-abc')).toBeDefined();
    });
  });

  it('masks IPv4 by default', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path.includes('/storefront/services/')) return Promise.resolve(mockService);
      if (path.includes('/storefront/catalog')) return Promise.resolve(mockCatalog);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('195.•••.•••.•••')).toBeDefined();
    });
  });

  it('renders back link to Dedicated Servers list', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path.includes('/storefront/services/')) return Promise.resolve(mockService);
      if (path.includes('/storefront/catalog')) return Promise.resolve(mockCatalog);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      const link = screen.getByText('Dedicated Servers').closest('a');
      expect(link?.getAttribute('href')).toBe('/dashboard/ds');
    });
  });

  it('renders Danger Zone with Delete button', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path.includes('/storefront/services/')) return Promise.resolve(mockService);
      if (path.includes('/storefront/catalog')) return Promise.resolve(mockCatalog);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Delete')).toBeDefined();
    });
  });
});
