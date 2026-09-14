import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { OdpDetail } from './OdpDetail';

vi.mock('../../lib/api', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from '../../lib/api';
const mockGet = vi.mocked(api.get);

const mockService = {
  id: 'odp-789',
  hostname: 'app.example.com',
  name: 'My ODP App',
  status: 'running',
  product_id: 'prod-odp-1',
  ip: '10.20.30.40',
  provider_resource_id: 'odp-res-1',
  next_due: '2026-10-01T00:00:00Z',
};

const mockCatalog = [
  { id: 'prod-odp-1', name: 'ODP Pro', category: 'odp', specs: { location: 'Nuremberg', runtime: 'Node.js 20' } },
];

function renderComponent() {
  return render(
    <MemoryRouter initialEntries={['/dashboard/odp/odp-789']}>
      <Routes>
        <Route path="/dashboard/odp/:id" element={<OdpDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('OdpDetail', () => {
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

  it('renders ODP service details', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path.includes('/storefront/services/')) return Promise.resolve(mockService);
      if (path.includes('/storefront/catalog')) return Promise.resolve(mockCatalog);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('app.example.com')).toBeDefined();
    });

    expect(screen.getByText('ODP Pro')).toBeDefined();
  });

  it('renders service identifiers', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path.includes('/storefront/services/')) return Promise.resolve(mockService);
      if (path.includes('/storefront/catalog')) return Promise.resolve(mockCatalog);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getAllByText('odp-789').length).toBeGreaterThanOrEqual(1);
    });
  });
});
