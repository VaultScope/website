import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';
import { ToastProvider } from '../components/Toast';
import { LanguageProvider } from '../i18n';

export function renderWithProviders(
  ui: ReactElement,
  { route = '/', routes }: { route?: string; routes?: string[] } = {}
) {
  const initialEntries = routes || [route];
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ToastProvider>{ui}</ToastProvider>
    </MemoryRouter>
  );
}

export function renderWithI18n(
  ui: ReactElement,
  { route = '/' }: { route?: string } = {}
) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <LanguageProvider>
        <ToastProvider>{ui}</ToastProvider>
      </LanguageProvider>
    </MemoryRouter>
  );
}

export const mockService = {
  id: 'svc-1',
  customer_id: 'c1',
  product_id: 'p1',
  connector_id: 'con1',
  name: 'Test VPS',
  status: 'running',
  provider_resource_id: 'htz-123',
  ip: '1.2.3.4',
  hostname: 'test.example.com',
  config: {},
  price: '9.99',
  next_due: '2026-09-01T00:00:00Z',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

export const mockProduct = {
  id: 'p1',
  name: 'VPS Pro',
  category: 'vps',
  provider: 'hetzner_cloud',
  target: '',
  specs: { server_type: 'cx22', location: 'fsn1', image: 'ubuntu-22.04' },
  cost: '5.00',
  price: '9.99',
  setup_fee: '0',
  stock: 10,
  user_limit: 0,
  billing_cycle: 'monthly',
  hidden: false,
  service_form_id: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

export const mockDsProduct = {
  ...mockProduct,
  id: 'p2',
  name: 'Dedicated Server',
  category: 'ds',
};

export const mockOdpProduct = {
  ...mockProduct,
  id: 'p3',
  name: 'ODP Service',
  category: 'odp',
};

export const mockTicket = {
  id: 'tkt-1',
  ticket_number: 'TKT-ABC123',
  customer_id: 'c1',
  category: 'support',
  subject: 'Help me',
  status: 'open',
  priority: 'normal',
  assignee_id: null,
  mailbox: 'support@vs.de',
  related_service_id: null,
  ip: '127.0.0.1',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

export const mockTicketMessage = {
  id: 'msg-1',
  ticket_id: 'tkt-1',
  author_id: 'c1',
  author_type: 'customer',
  content: 'I need help with my server',
  internal: false,
  created_at: '2026-01-01T00:00:00Z',
};

export const mockProfile = {
  id: 'c1',
  name: 'Test User',
  email: 'test@example.com',
  phone: '+49123456',
  company: 'Acme Corp',
  address: '123 Main St',
  city: 'Berlin',
  country: 'DE',
  vat_id: 'DE123456789',
  two_factor_enabled: false,
  email_verified: true,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-06-15T00:00:00Z',
  last_login: '2026-08-01T12:00:00Z',
};

export const mockInvoice = {
  id: 'inv-1',
  invoice_number: 'INV-001',
  customer_id: 'c1',
  status: 'paid',
  subtotal: '8.40',
  tax_rate: '19.00',
  tax_amount: '1.60',
  total: '9.99',
  issue_date: '2026-01-15',
  due_date: '2026-02-15',
  paid_at: '2026-01-20T00:00:00Z',
  stripe_payment_intent_id: null,
  notes: '',
  created_at: '2026-01-15T00:00:00Z',
  updated_at: '2026-01-20T00:00:00Z',
};

export const mockBillingInfo = {
  balance: '€0.00',
  next_charge: null,
  status: 'Payment current',
  card_last4: '4242',
  card_exp: '12/28',
  address: {
    name: 'Test User',
    company: 'Acme Corp',
    line1: '123 Main St',
    country: 'DE',
  },
  vat_id: 'DE123456789',
  subscriptions: [
    {
      id: 'sub-1',
      name: 'VPS Pro',
      description: 'Active service',
      price: '€9.99/mo',
      next_date: '2026-09-01',
    },
  ],
};

export const mockActivityLog = {
  id: 'log-1',
  action: 'service.created',
  target: 'VPS Pro',
  detail: 'Service provisioned successfully',
  created_at: '2026-08-01T12:00:00Z',
};

export const mockClaims = {
  sub: 'c1',
  email: 'test@example.com',
  role: 'customer',
  audience: 'storefront' as const,
  exp: Math.floor(Date.now() / 1000) + 3600,
  iat: Math.floor(Date.now() / 1000),
};
