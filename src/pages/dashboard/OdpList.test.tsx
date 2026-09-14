import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { OdpList } from './OdpList';

vi.mock('../../lib/api', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from '../../lib/api';
const mockGet = vi.mocked(api.get);

const mockCatalog = [
  { id: 'prod-odp', name: 'ODP Standard', category: 'odp', specs: { location: 'Nuremberg' } },
  { id: 'prod-vps', name: 'VPS', category: 'vps', specs: {} },
];

const mockServices = [
  { id: 'svc-odp-1', hostname: 'app.example.com', name: 'My ODP', status: 'running', product_id: 'prod-odp', next_due: '2026-09-15T00:00:00Z', ip: '10.0.0.10' },
  { id: 'svc-vps-1', hostname: 'web-01', name: 'A VPS', status: 'running', product_id: 'prod-vps', next_due: null, ip: '10.0.0.5' },
];

function renderComponent() {
  return render(
    <MemoryRouter>
      <OdpList />
    </MemoryRouter>
  );
}

describe('OdpList', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('shows loading state', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('renders page heading', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText('Optimized Deployment Platform')).toBeDefined();
  });

  it('filters services to only show ODP category', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/services') return Promise.resolve(mockServices);
      if (path === '/storefront/catalog') return Promise.resolve(mockCatalog);
      return Promise.resolve([]);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getAllByText('app.example.com').length).toBeGreaterThan(0);
    });

    expect(screen.queryByText('A VPS')).toBeNull();
  });

  it('shows endpoint and location from catalog', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/services') return Promise.resolve(mockServices);
      if (path === '/storefront/catalog') return Promise.resolve(mockCatalog);
      return Promise.resolve([]);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Nuremberg')).toBeDefined();
    });
  });

  it('shows empty state when no ODP services', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/services') return Promise.resolve([]);
      if (path === '/storefront/catalog') return Promise.resolve(mockCatalog);
      return Promise.resolve([]);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No ODP instances found.')).toBeDefined();
    });
  });

  it('renders "Deploy ODP" button', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText('Deploy ODP')).toBeDefined();
  });
});
