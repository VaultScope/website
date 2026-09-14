import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { SupportList } from './SupportList';
import { ToastProvider } from '../../components/Toast';

vi.mock('../../lib/api', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

import { api } from '../../lib/api';
const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);

const mockTickets = [
  { id: 'tkt-1', ticket_number: 'TKT-001', subject: 'Server unreachable', status: 'open', priority: 'high', updated_at: '2026-08-28T10:00:00Z' },
  { id: 'tkt-2', ticket_number: 'TKT-002', subject: 'Billing question', status: 'waiting_customer', priority: 'normal', updated_at: '2026-08-27T14:00:00Z' },
  { id: 'tkt-3', ticket_number: 'TKT-003', subject: 'Old resolved', status: 'resolved', priority: 'low', updated_at: '2026-08-20T09:00:00Z' },
];

function renderComponent() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <SupportList />
      </ToastProvider>
    </MemoryRouter>
  );
}

describe('SupportList', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPost.mockReset();
    mockNavigate.mockReset();
  });

  it('shows loading state', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('renders page heading', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText('Support')).toBeDefined();
  });

  it('renders tickets after load', async () => {
    mockGet.mockResolvedValue(mockTickets);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Server unreachable')).toBeDefined();
      expect(screen.getByText('Billing question')).toBeDefined();
      expect(screen.getByText('TKT-001')).toBeDefined();
      expect(screen.getByText('TKT-002')).toBeDefined();
    });
  });

  it('shows open ticket count', async () => {
    mockGet.mockResolvedValue(mockTickets);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('2 open')).toBeDefined();
    });
  });

  it('shows awaiting reply count', async () => {
    mockGet.mockResolvedValue(mockTickets);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('1 awaiting your reply')).toBeDefined();
    });
  });

  it('shows empty state when no tickets', async () => {
    mockGet.mockResolvedValue([]);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No tickets found')).toBeDefined();
    });
  });

  it('opens new ticket form when "Open Ticket" clicked', async () => {
    mockGet.mockResolvedValue([]);
    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    fireEvent.click(screen.getByText('Open Ticket'));

    expect(screen.getByText('New Support Ticket')).toBeDefined();
    expect(screen.getByPlaceholderText('Subject')).toBeDefined();
    expect(screen.getByPlaceholderText('Describe your issue...')).toBeDefined();
  });

  it('calls API to create ticket and navigates on success', async () => {
    mockGet.mockResolvedValue([]);
    mockPost.mockResolvedValue({ id: 'new-tkt', ticket_number: 'TKT-999' });
    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    fireEvent.click(screen.getByText('Open Ticket'));
    fireEvent.change(screen.getByPlaceholderText('Subject'), { target: { value: 'Test subject' } });
    fireEvent.change(screen.getByPlaceholderText('Describe your issue...'), { target: { value: 'Test content' } });
    fireEvent.click(screen.getByText('Submit Ticket'));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/storefront/tickets', {
        subject: 'Test subject',
        content: 'Test content',
        category: 'support',
        priority: 'normal',
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/support/new-tkt');
    });
  });
});
