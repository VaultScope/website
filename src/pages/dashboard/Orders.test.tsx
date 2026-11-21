import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { DashboardOrders } from './Orders';

vi.mock('../../lib/api', () => ({
  api: { get: vi.fn() },
}));

import { api } from '../../lib/api';
const mockGet = vi.mocked(api.get);

describe('DashboardOrders', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('displays orders with their provisioning state and notes and supports filtering', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/services') {
        return Promise.resolve([
          {
            id: 'ord-ds-1234',
            name: 'Dual Xeon Metal',
            hostname: 'nl-ds.vaultscope.de',
            status: 'pending',
            order_state: 'hardware_setup',
            order_state_note: 'Chassis racked in AMS01',
            product_id: 'prod-ds',
            price: '312.90',
            created_at: '2026-11-21T00:00:00Z',
          },
          {
            id: 'ord-sftp-5678',
            name: 'SFTP Vault 150GB',
            hostname: 'sftp.vaultscope.de',
            status: 'running',
            order_state: 'active',
            order_state_note: null,
            product_id: 'prod-sftp',
            provider_type: 'sftp',
            price: '8.40',
            created_at: '2026-11-20T00:00:00Z',
          },
        ]);
      }
      if (path === '/storefront/catalog') {
        return Promise.resolve([
          { id: 'prod-ds', name: 'Dual Xeon Metal', category: 'dedicated', provider: 'reliablesite' },
          { id: 'prod-sftp', name: 'SFTP Vault 150GB', category: 'storage', provider: 'sftpgo' },
        ]);
      }
      return Promise.resolve([]);
    });

    render(
      <MemoryRouter>
        <DashboardOrders />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Hardware Setup & OS Install')).toBeDefined();
    });

    expect(screen.getByText('Chassis racked in AMS01')).toBeDefined();
    expect(screen.getAllByText('Active / Ready').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/up to 7 business days/i)).toBeDefined();

    fireEvent.change(screen.getByLabelText('Filter by order state'), {
      target: { value: 'hardware_setup' },
    });

    expect(screen.getByText('Dual Xeon Metal')).toBeDefined();
    expect(screen.queryByText('SFTP Vault 150GB')).toBeNull();
  });
});
