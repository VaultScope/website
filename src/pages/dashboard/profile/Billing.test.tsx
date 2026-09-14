import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProfileBilling } from './Billing';
import { ToastProvider } from '../../../components/Toast';

vi.mock('../../../lib/api', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from '../../../lib/api';
const mockGet = vi.mocked(api.get);

const mockBillingInfo = {
  balance: '€45.99',
  next_charge: '2026-09-01',
  status: 'Payment current',
  card_last4: '4242',
  card_exp: '12/28',
  address: {
    name: 'Max Mustermann',
    company: 'VaultScope GmbH',
    line1: 'Musterstraße 1, 10115 Berlin',
    country: 'Germany',
  },
  vat_id: 'DE123456789',
  subscriptions: [
    { id: 'sub-1', name: 'VPS Pro', description: 'Active service', price: '€29.99/mo', next_date: '2026-09-15' },
    { id: 'sub-2', name: 'DS Standard', description: 'Active service', price: '€49.99/mo', next_date: '2026-09-01' },
  ],
};

const mockInvoices = [
  { id: 'inv-1', invoice_number: 'INV-A1B2C3D4', issue_date: '2026-08-01', total: '45.99', status: 'paid' },
  { id: 'inv-2', invoice_number: 'INV-E5F6G7H8', issue_date: '2026-07-01', total: '29.99', status: 'paid' },
];

function renderComponent() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <ProfileBilling />
      </ToastProvider>
    </MemoryRouter>
  );
}

describe('ProfileBilling', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('calls both billing and invoices endpoints', async () => {
    mockGet.mockResolvedValue([]);
    renderComponent();

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/storefront/invoices');
      expect(mockGet).toHaveBeenCalledWith('/storefront/billing');
    });
  });

  it('renders balance from billing info', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/billing') return Promise.resolve(mockBillingInfo);
      if (path === '/storefront/invoices') return Promise.resolve([]);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('€45.99')).toBeDefined();
    });
  });

  it('renders card last 4 digits', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/billing') return Promise.resolve(mockBillingInfo);
      if (path === '/storefront/invoices') return Promise.resolve([]);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('•••• 4242')).toBeDefined();
      expect(screen.getByText('Exp 12/28')).toBeDefined();
    });
  });

  it('renders billing address fields', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/billing') return Promise.resolve(mockBillingInfo);
      if (path === '/storefront/invoices') return Promise.resolve([]);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Max Mustermann')).toBeDefined();
      expect(screen.getByText('VaultScope GmbH')).toBeDefined();
      expect(screen.getByText('Musterstraße 1, 10115 Berlin')).toBeDefined();
      expect(screen.getByText('Germany')).toBeDefined();
      expect(screen.getByText('DE123456789')).toBeDefined();
    });
  });

  it('renders active subscriptions', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/billing') return Promise.resolve(mockBillingInfo);
      if (path === '/storefront/invoices') return Promise.resolve([]);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('VPS Pro')).toBeDefined();
      expect(screen.getByText('DS Standard')).toBeDefined();
      expect(screen.getByText('€29.99/mo')).toBeDefined();
      expect(screen.getByText('€49.99/mo')).toBeDefined();
    });
  });

  it('renders "No active subscriptions" when empty', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/billing') return Promise.resolve({ ...mockBillingInfo, subscriptions: [] });
      if (path === '/storefront/invoices') return Promise.resolve([]);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No active subscriptions')).toBeDefined();
    });
  });

  it('renders invoice table with correct field names', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/billing') return Promise.resolve({ ...mockBillingInfo, balance: '€0.00' });
      if (path === '/storefront/invoices') return Promise.resolve(mockInvoices);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('INV-A1B2C3D4')).toBeDefined();
      expect(screen.getByText('INV-E5F6G7H8')).toBeDefined();
      expect(screen.getByText('2026-08-01')).toBeDefined();
      expect(screen.getByText('€45.99')).toBeDefined();
      expect(screen.getByText('€29.99')).toBeDefined();
    });
  });

  it('renders "No invoices found" when empty', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/billing') return Promise.resolve(mockBillingInfo);
      if (path === '/storefront/invoices') return Promise.resolve([]);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No invoices found')).toBeDefined();
    });
  });

  it('renders fallback values when billing info is null', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/billing') return Promise.resolve(null);
      if (path === '/storefront/invoices') return Promise.resolve([]);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('€0.00')).toBeDefined();
      expect(screen.getByText('•••• ----')).toBeDefined();
      expect(screen.getByText('Exp --/--')).toBeDefined();
    });
  });

  it('has disabled Update and Remove buttons', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/billing') return Promise.resolve(mockBillingInfo);
      if (path === '/storefront/invoices') return Promise.resolve([]);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      const updateBtn = screen.getByText('Update');
      const removeBtn = screen.getByText('Remove');
      expect(updateBtn.closest('button')?.disabled).toBe(true);
      expect(removeBtn.closest('button')?.disabled).toBe(true);
    });
  });
});
