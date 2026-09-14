import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { DsList } from './DsList';

vi.mock('../../lib/api', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from '../../lib/api';
const mockGet = vi.mocked(api.get);

const mockCatalog = [
  { id: 'prod-ds', name: 'DS Enterprise', category: 'ds', specs: { location: 'Helsinki', ram: '64 GB', server_type: 'AMD EPYC 7763', disk: '2x 1TB NVMe' } },
  { id: 'prod-vps', name: 'VPS Basic', category: 'vps', specs: {} },
];

const mockServices = [
  { id: 'svc-ds-1', hostname: 'bare-01', name: 'My DS', status: 'running', product_id: 'prod-ds', next_due: '2026-10-01T00:00:00Z', ip: '185.1.2.3' },
  { id: 'svc-vps-1', hostname: 'web-01', name: 'A VPS', status: 'running', product_id: 'prod-vps', next_due: null, ip: '10.0.0.5' },
];

function renderComponent() {
  return render(
    <MemoryRouter>
      <DsList />
    </MemoryRouter>
  );
}

describe('DsList', () => {
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
    expect(screen.getByText('Dedicated Servers')).toBeDefined();
  });

  it('filters services to only show DS category', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/services') return Promise.resolve(mockServices);
      if (path === '/storefront/catalog') return Promise.resolve(mockCatalog);
      return Promise.resolve([]);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('bare-01')).toBeDefined();
    });

    expect(screen.queryByText('A VPS')).toBeNull();
  });

  it('renders DS with type and specs from catalog', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/services') return Promise.resolve(mockServices);
      if (path === '/storefront/catalog') return Promise.resolve(mockCatalog);
      return Promise.resolve([]);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('DS Enterprise')).toBeDefined();
      expect(screen.getByText('Helsinki')).toBeDefined();
      expect(screen.getByText('64 GB')).toBeDefined();
    });
  });

  it('shows empty state when no DS services', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/services') return Promise.resolve([]);
      if (path === '/storefront/catalog') return Promise.resolve(mockCatalog);
      return Promise.resolve([]);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No Dedicated Servers found.')).toBeDefined();
    });
  });

  it('renders "Order Dedicated" button', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText('Order Dedicated')).toBeDefined();
  });
});
