import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProfileBilling } from './Billing';
import { ToastProvider } from '../../../components/Toast';

vi.mock('../../../lib/api', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve({} as any)),
}));

vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: { children: ReactNode }) => <div data-testid="stripe-elements">{children}</div>,
  PaymentElement: () => <div data-testid="stripe-payment-element" />,
  ExpressCheckoutElement: () => <div data-testid="stripe-express-element" />,
  useStripe: () => null,
  useElements: () => null,
}));

import { api } from '../../../lib/api';
const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);

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
    mockPost.mockReset();
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

  it('renders Stripe Checkout payment method', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/billing') return Promise.resolve(mockBillingInfo);
      if (path === '/storefront/invoices') return Promise.resolve([]);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Stripe Checkout')).toBeDefined();
      expect(screen.getByText(/Cards, Apple Pay, Google Pay, PayPal, Klarna/)).toBeDefined();
      expect(screen.getByText('No outstanding invoices')).toBeDefined();
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
      expect(screen.getByText('Outstanding Balance')).toBeDefined();
      expect(screen.getByText('No outstanding invoices')).toBeDefined();
      expect(screen.getByText('Stripe Checkout')).toBeDefined();
      expect(screen.getByText('Processed securely per invoice via Stripe')).toBeDefined();
    });
  });

  it('renders open and overdue invoice payment warnings and Pay Now buttons', async () => {
    const unpaidInvoices = [
      { id: 'inv-open', invoice_number: 'INV-OPEN1', issue_date: '2026-08-10', due_date: '2026-08-24', total: '29.99', status: 'pending' },
      { id: 'inv-over', invoice_number: 'INV-OVER1', issue_date: '2026-07-10', due_date: '2026-07-24', total: '15.00', status: 'overdue' },
    ];
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/billing') {
        return Promise.resolve({
          ...mockBillingInfo,
          balance: '€44.99',
          status: '1 overdue invoice requiring immediate payment',
          has_unpaid_invoices: true,
          has_overdue_invoices: true,
          overdue_invoices_count: 1,
          open_invoices_count: 2,
        });
      }
      if (path === '/storefront/invoices') return Promise.resolve(unpaidInvoices);
      return Promise.resolve(null);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Overdue Payment Required')).toBeDefined();
      expect(screen.getByText('Open Invoice Balance')).toBeDefined();
      expect(screen.getByText('Pay Overdue Invoice')).toBeDefined();
      expect(screen.getByText('Due 2026-08-24')).toBeDefined();
      expect(screen.getAllByText('Pay Now').length).toBe(2);
    });
  });

  it('requests Stripe config and payment intent when clicking Pay Now', async () => {
    const openInvoice = {
      id: 'inv-open',
      invoice_number: 'INV-OPEN1',
      issue_date: '2026-08-10',
      due_date: '2026-08-24',
      total: '29.99',
      status: 'pending',
    };
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/billing') {
        return Promise.resolve({
          ...mockBillingInfo,
          balance: '€29.99',
          has_unpaid_invoices: true,
          open_invoices_count: 1,
        });
      }
      if (path === '/storefront/invoices') return Promise.resolve([openInvoice]);
      if (path === '/storefront/config') {
        return Promise.resolve({ stripe_public_key: 'pk_test_123' });
      }
      return Promise.resolve(null);
    });
    mockPost.mockResolvedValueOnce({
      client_secret: 'pi_test_secret_123',
      payment_intent_id: 'pi_test_123',
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Pay Now')).toBeDefined();
    });

    fireEvent.click(screen.getByText('Pay Now'));

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/storefront/config');
      expect(mockPost).toHaveBeenCalledWith('/storefront/invoices/inv-open/create-payment-intent');
      expect(screen.getByText('Pay Invoice INV-OPEN1')).toBeDefined();
    });
  });
});
