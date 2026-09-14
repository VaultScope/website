import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { VpsDetail } from './VpsDetail';
import { ToastProvider } from '../../components/Toast';

vi.mock('../../lib/api', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from '../../lib/api';
const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);
const mockDelete = vi.mocked(api.delete);

const mockService = {
  id: 'svc-123',
  hostname: 'web-prod-01',
  name: 'Web Production',
  status: 'running',
  product_id: 'prod-vps-1',
  ip: '185.10.20.30',
  provider_resource_id: 'hcloud-999',
  next_due: '2026-10-01T00:00:00Z',
};

const mockCatalog = [
  { id: 'prod-vps-1', name: 'VPS Pro', category: 'vps', specs: { location: 'Falkenstein', ram: '8 GB', server_type: '4 vCPU', disk: '80 GB NVMe' } },
];

const mockOptions = { osImages: [{ id: 'ubuntu-24', name: 'Ubuntu 24.04' }], sshKeys: [{ id: 'key-1', name: 'work-laptop' }] };

function renderComponent() {
  return render(
    <MemoryRouter initialEntries={['/dashboard/vps/svc-123']}>
      <ToastProvider>
        <Routes>
          <Route path="/dashboard/vps/:id" element={<VpsDetail />} />
        </Routes>
      </ToastProvider>
    </MemoryRouter>
  );
}

describe('VpsDetail', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPost.mockReset();
    mockDelete.mockReset();
  });

  it('shows loading state initially', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('shows "Service not found" when service is null', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path.includes('/storefront/services/')) return Promise.resolve(null);
      if (path.includes('/storefront/catalog')) return Promise.resolve([]);
      return Promise.resolve({ osImages: [], sshKeys: [] });
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
      if (path.includes('/storefront/options')) return Promise.resolve(mockOptions);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('web-prod-01')).toBeDefined();
    });

    expect(screen.getByText('VPS Pro')).toBeDefined();
    expect(screen.getByText('8 GB')).toBeDefined();
    expect(screen.getByText('4 vCPU')).toBeDefined();
    expect(screen.getByText('80 GB NVMe')).toBeDefined();
  });

  it('renders VaultScope ID and Provider ID', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path.includes('/storefront/services/')) return Promise.resolve(mockService);
      if (path.includes('/storefront/catalog')) return Promise.resolve(mockCatalog);
      if (path.includes('/storefront/options')) return Promise.resolve(mockOptions);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getAllByText('svc-123').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('hcloud-999')).toBeDefined();
    });
  });

  it('masks IPv4 by default', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path.includes('/storefront/services/')) return Promise.resolve(mockService);
      if (path.includes('/storefront/catalog')) return Promise.resolve(mockCatalog);
      if (path.includes('/storefront/options')) return Promise.resolve(mockOptions);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('185.•••.•••.•••')).toBeDefined();
    });
  });

  it('renders Restart, Stop, and Console buttons', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path.includes('/storefront/services/')) return Promise.resolve(mockService);
      if (path.includes('/storefront/catalog')) return Promise.resolve(mockCatalog);
      if (path.includes('/storefront/options')) return Promise.resolve(mockOptions);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Restart')).toBeDefined();
      expect(screen.getByText('Stop')).toBeDefined();
      expect(screen.getByText('Console')).toBeDefined();
    });
  });

  it('renders Danger Zone with Reinstall and Delete buttons', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path.includes('/storefront/services/')) return Promise.resolve(mockService);
      if (path.includes('/storefront/catalog')) return Promise.resolve(mockCatalog);
      if (path.includes('/storefront/options')) return Promise.resolve(mockOptions);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Reinstall')).toBeDefined();
      expect(screen.getByText('Delete')).toBeDefined();
    });
  });

  it('calls restart endpoint when Restart clicked', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path.includes('/storefront/services/')) return Promise.resolve(mockService);
      if (path.includes('/storefront/catalog')) return Promise.resolve(mockCatalog);
      if (path.includes('/storefront/options')) return Promise.resolve(mockOptions);
      return Promise.resolve(null);
    });
    mockPost.mockResolvedValue({});

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Restart')).toBeDefined();
    });

    fireEvent.click(screen.getByText('Restart'));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/storefront/services/svc-123/restart');
    });
  });
});
