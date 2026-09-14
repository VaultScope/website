import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { VpsList } from './VpsList';

vi.mock('../../lib/api', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from '../../lib/api';
const mockGet = vi.mocked(api.get);

const mockCatalog = [
  { id: 'prod-1', name: 'VPS Starter', category: 'vps', specs: { location: 'Falkenstein', ram: '4 GB', server_type: '2 vCPU', disk: '40 GB NVMe' } },
  { id: 'prod-2', name: 'DS Basic', category: 'ds', specs: { location: 'Helsinki', ram: '32 GB', server_type: 'AMD EPYC', disk: '2x 512 GB' } },
];

const mockServices = [
  { id: 'svc-1', hostname: 'app-01', name: 'My VPS', status: 'running', product_id: 'prod-1', next_due: '2026-09-15T00:00:00Z', ip: '10.0.0.1' },
  { id: 'svc-2', hostname: '', name: 'DS Instance', status: 'running', product_id: 'prod-2', next_due: null, ip: '10.0.0.2' },
];

function renderComponent() {
  return render(
    <MemoryRouter>
      <VpsList />
    </MemoryRouter>
  );
}

describe('VpsList', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('shows loading state initially', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('renders page heading', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText('Virtual Private Servers')).toBeDefined();
  });

  it('filters services to only show VPS category', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/services') return Promise.resolve(mockServices);
      if (path === '/storefront/catalog') return Promise.resolve(mockCatalog);
      return Promise.resolve([]);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('app-01')).toBeDefined();
    });

    expect(screen.queryByText('DS Instance')).toBeNull();
  });

  it('renders VPS with plan and specs from catalog', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/services') return Promise.resolve(mockServices);
      if (path === '/storefront/catalog') return Promise.resolve(mockCatalog);
      return Promise.resolve([]);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('VPS Starter')).toBeDefined();
      expect(screen.getByText('Falkenstein')).toBeDefined();
      expect(screen.getByText('4 GB')).toBeDefined();
      expect(screen.getByText('2 vCPU')).toBeDefined();
    });
  });

  it('shows empty state when no VPS services', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/services') return Promise.resolve([]);
      if (path === '/storefront/catalog') return Promise.resolve(mockCatalog);
      return Promise.resolve([]);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No VPS instances found.')).toBeDefined();
    });
  });

  it('renders "Deploy VPS" button', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText('Deploy VPS')).toBeDefined();
  });

  it('renders Manage button for each VPS', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/services') return Promise.resolve(mockServices);
      if (path === '/storefront/catalog') return Promise.resolve(mockCatalog);
      return Promise.resolve([]);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Manage')).toBeDefined();
    });
  });
});
