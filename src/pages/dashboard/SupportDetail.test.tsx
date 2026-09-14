import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SupportDetail } from './SupportDetail';

vi.mock('../../lib/api', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from '../../lib/api';
const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);

const mockTicketData = {
  ticket: {
    id: 'tkt-1',
    ticket_number: 'TKT-001',
    subject: 'Server unreachable',
    status: 'open',
    priority: 'high',
    created_at: '2026-08-25T10:00:00Z',
  },
  messages: [
    { id: 'msg-1', author_id: 'cust-1', author_type: 'customer', content: 'My server is down!', created_at: '2026-08-25T10:00:00Z' },
    { id: 'msg-2', author_id: 'staff-1', author_type: 'staff', content: 'Looking into it now.', created_at: '2026-08-25T10:05:00Z' },
  ],
};

function renderComponent() {
  return render(
    <MemoryRouter initialEntries={['/dashboard/support/tkt-1']}>
      <Routes>
        <Route path="/dashboard/support/:id" element={<SupportDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('SupportDetail', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPost.mockReset();
  });

  it('shows loading state initially', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('shows "Ticket not found" when data is null', async () => {
    mockGet.mockResolvedValue(null);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Ticket not found')).toBeDefined();
    });
  });

  it('renders ticket subject and metadata', async () => {
    mockGet.mockResolvedValue(mockTicketData);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Server unreachable')).toBeDefined();
      expect(screen.getByText('TKT-001')).toBeDefined();
      expect(screen.getByText('OPEN')).toBeDefined();
      expect(screen.getByText('HIGH')).toBeDefined();
    });
  });

  it('renders messages from both customer and staff', async () => {
    mockGet.mockResolvedValue(mockTicketData);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('My server is down!')).toBeDefined();
      expect(screen.getByText('Looking into it now.')).toBeDefined();
      expect(screen.getByText('You')).toBeDefined();
      expect(screen.getByText('Support Staff')).toBeDefined();
    });
  });

  it('renders reply textarea', async () => {
    mockGet.mockResolvedValue(mockTicketData);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type your reply...')).toBeDefined();
    });
  });

  it('sends reply on button click', async () => {
    mockGet.mockResolvedValue(mockTicketData);
    mockPost.mockResolvedValue({ id: 'msg-3', author_id: 'cust-1', author_type: 'customer', content: 'Thanks!', created_at: '2026-08-25T10:10:00Z' });
    renderComponent();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type your reply...')).toBeDefined();
    });

    fireEvent.change(screen.getByPlaceholderText('Type your reply...'), { target: { value: 'Thanks!' } });
    fireEvent.click(screen.getByText('Send Reply'));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/storefront/tickets/tkt-1/messages', { content: 'Thanks!' });
    });
  });

  it('appends new message to conversation after reply', async () => {
    mockGet.mockResolvedValue(mockTicketData);
    mockPost.mockResolvedValue({ id: 'msg-3', author_id: 'cust-1', author_type: 'customer', content: 'Follow up message', created_at: '2026-08-25T10:10:00Z' });
    renderComponent();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type your reply...')).toBeDefined();
    });

    fireEvent.change(screen.getByPlaceholderText('Type your reply...'), { target: { value: 'Follow up message' } });
    fireEvent.click(screen.getByText('Send Reply'));

    await waitFor(() => {
      expect(screen.getByText('Follow up message')).toBeDefined();
    });
  });

  it('renders back link to tickets list', async () => {
    mockGet.mockResolvedValue(mockTicketData);
    renderComponent();

    await waitFor(() => {
      const link = screen.getByText('Tickets').closest('a');
      expect(link?.getAttribute('href')).toBe('/dashboard/support');
    });
  });
});
