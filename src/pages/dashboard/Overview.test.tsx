import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { DashboardOverview } from './Overview';
import { setQuickNavIds } from '../../lib/quickNav';

vi.mock('../../lib/api', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from '../../lib/api';
const mockGet = vi.mocked(api.get);

const mockServices = [
  { id: 'svc-1', name: 'Web Server', status: 'running', hostname: 'web-01.vaultscope.de', ip: '10.0.0.1', price: '29.99', next_due: '2026-09-01', config: {} },
  { id: 'svc-2', name: 'DB Server', status: 'running', hostname: 'db-01.vaultscope.de', ip: '10.0.0.2', price: '49.99', next_due: '2026-09-01', config: {} },
  { id: 'svc-3', name: 'Old Server', status: 'terminated', hostname: 'old-01', ip: '10.0.0.3', price: '19.99', next_due: null, config: {} },
];

function renderComponent() {
  return render(
    <MemoryRouter>
      <DashboardOverview />
    </MemoryRouter>
  );
}

describe('DashboardOverview', () => {
  beforeEach(() => {
    mockGet.mockReset();
    localStorage.clear();
  });

  it('shows loading state initially', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText('Loading services...')).toBeDefined();
  });

  it('renders service count excluding terminated', async () => {
    mockGet.mockResolvedValue(mockServices);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('2 Services')).toBeDefined();
    });
  });

  it('does not render "All operational", "Active Footprint", or "Frankfurt DE-FRA1 & Nuremberg"', async () => {
    mockGet.mockResolvedValue(mockServices);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('2 Services')).toBeDefined();
    });

    expect(screen.queryByText('All operational')).toBeNull();
    expect(screen.queryByText('Active Footprint')).toBeNull();
    expect(screen.queryByText(/Frankfurt DE-FRA1 & Nuremberg/i)).toBeNull();
  });

  it('shows attention message when a service is not running', async () => {
    const withPending = [...mockServices];
    withPending[0] = { ...withPending[0], status: 'pending' };
    mockGet.mockResolvedValue(withPending);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Some services need attention')).toBeDefined();
    });
  });

  it('calculates total monthly billing from active services', async () => {
    mockGet.mockResolvedValue(mockServices);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('€95.18 / month incl. VAT')).toBeDefined();
    });
  });

  it('renders service table with names and hostnames', async () => {
    mockGet.mockResolvedValue(mockServices);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Web Server')).toBeDefined();
      expect(screen.getByText('web-01.vaultscope.de')).toBeDefined();
      expect(screen.getByText('DB Server')).toBeDefined();
      expect(screen.getByText('db-01.vaultscope.de')).toBeDefined();
    });
  });

  it('does not render terminated services in the table', async () => {
    mockGet.mockResolvedValue(mockServices);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Web Server')).toBeDefined();
    });

    expect(screen.queryByText('Old Server')).toBeNull();
  });

  it('shows empty state when no services', async () => {
    mockGet.mockResolvedValue([]);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/No services yet/)).toBeDefined();
    });
  });

  it('renders "Order New" button linking to /dashboard/new', async () => {
    mockGet.mockResolvedValue([]);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Order New')).toBeDefined();
    });
  });

  it('renders "View tickets" link', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText('View tickets')).toBeDefined();
  });

  it('routes SFTP services to /dashboard/sftp and VPS to /dashboard/vps/:id', async () => {
    mockGet.mockResolvedValue([
      { id: 'sftp-1', name: 'SFTP Sovereign Storage', status: 'running', hostname: 'sftp.vaultscope.de', ip: '10.20.10.60', price: '12.00', next_due: null, config: {} },
      { id: 'vps-1', name: 'Standard VPS Instance', status: 'running', hostname: 'vps.vaultscope.de', ip: '1.2.3.4', price: '20.00', next_due: null, config: {} },
    ]);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('SFTP Sovereign Storage')).toBeDefined();
    });

    const manageLinks = screen.getAllByText('Manage').map(el => el.closest('a')?.getAttribute('href'));
    expect(manageLinks).toEqual(['/dashboard/sftp', '/dashboard/vps/vps-1']);
  });

  it('renders customized quick navigation items', async () => {
    setQuickNavIds(['sftp', 'mfa']);
    mockGet.mockResolvedValue([]);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('SFTP')).toBeDefined();
      expect(screen.getByText('2FA Security')).toBeDefined();
    });
    expect(screen.queryByText('VPS')).toBeNull();
  });
});
