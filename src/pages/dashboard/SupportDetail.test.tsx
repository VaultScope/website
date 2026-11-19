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
      expect(mockPost).toHaveBeenCalledWith('/storefront/tickets/tkt-1/messages', { content: 'Thanks!', attachments: [] });
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

  it('renders attached images in messages', async () => {
    const dataWithAttachment = {
      ...mockTicketData,
      messages: [
        {
          id: 'msg-att',
          author_id: 'cust-1',
          author_type: 'customer',
          content: 'Here is screenshot',
          created_at: '2026-08-25T10:00:00Z',
          attachments: [
            {
              id: 'att-1',
              filename: 'error.png',
              url: '/uploads/tickets/error.png',
              size: 20480,
              content_type: 'image/png',
            },
          ],
        },
      ],
    };
    mockGet.mockResolvedValue(dataWithAttachment);
    renderComponent();

    await waitFor(() => {
      const img = screen.getByRole('img', { name: 'error.png' });
      expect(img).toBeDefined();
      expect(img.getAttribute('src')).toBe('/uploads/tickets/error.png');
    });
  });

  it('rejects non-image files with error message', async () => {
    mockGet.mockResolvedValue(mockTicketData);
    const { container } = renderComponent();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type your reply...')).toBeDefined();
    });

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const fakePdf = new File(['%PDF-1.4'], 'document.pdf', { type: 'application/pdf' });

    fireEvent.change(fileInput, { target: { files: [fakePdf] } });

    await waitFor(() => {
      expect(screen.getByText(/Only PNG, JPEG, WebP, and GIF images are permitted/)).toBeDefined();
    });
  });

  it('rejects files larger than 10MB', async () => {
    mockGet.mockResolvedValue(mockTicketData);
    const { container } = renderComponent();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type your reply...')).toBeDefined();
    });

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const bigFile = new File(['x'.repeat(100)], 'huge.png', { type: 'image/png' });
    Object.defineProperty(bigFile, 'size', { value: 11 * 1024 * 1024 });

    fireEvent.change(fileInput, { target: { files: [bigFile] } });

    await waitFor(() => {
      expect(screen.getByText(/exceeds the 10MB limit/)).toBeDefined();
    });
  });

  it('requests a single-use SSE ticket via POST /auth/sse-ticket instead of passing JWT in query string', async () => {
    localStorage.setItem('vs_token', 'secret-bearer-jwt');
    mockGet.mockResolvedValue(mockTicketData);
    mockPost.mockResolvedValueOnce({ ticket: 'one-time-sse-ticket-42' });

    const esInstances: Array<{ url: string; close: ReturnType<typeof vi.fn>; onmessage: ((e: any) => void) | null }> = [];
    const MockEventSource = vi.fn(function (this: any, url: string) {
      this.url = url;
      this.close = vi.fn();
      this.onmessage = null;
      esInstances.push(this);
    });
    vi.stubGlobal('EventSource', MockEventSource);

    try {
      const { unmount } = renderComponent();

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith('/auth/sse-ticket', {});
        expect(MockEventSource).toHaveBeenCalledTimes(1);
      });

      const connectedUrl = esInstances[0].url;
      expect(connectedUrl).toContain('/storefront/tickets/tkt-1/events?ticket=one-time-sse-ticket-42');
      expect(connectedUrl).not.toContain('token=');
      expect(connectedUrl).not.toContain('secret-bearer-jwt');

      unmount();
      expect(esInstances[0].close).toHaveBeenCalledTimes(1);
    } finally {
      vi.unstubAllGlobals();
      localStorage.clear();
    }
  });

  it('does not open EventSource if unmounted before sse-ticket resolves', async () => {
    localStorage.setItem('vs_token', 'secret-bearer-jwt');
    mockGet.mockResolvedValue(mockTicketData);

    let resolveTicket!: (val: { ticket: string }) => void;
    mockPost.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveTicket = resolve;
        }),
    );

    const MockEventSource = vi.fn();
    vi.stubGlobal('EventSource', MockEventSource);

    try {
      const { unmount } = renderComponent();

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith('/auth/sse-ticket', {});
      });

      unmount();
      resolveTicket({ ticket: 'late-ticket' });
      await Promise.resolve();

      expect(MockEventSource).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
      localStorage.clear();
    }
  });

  it('blocks unsafe javascript: attachment URLs from rendering links or images', async () => {
    mockGet.mockResolvedValue({
      ...mockTicketData,
      messages: [
        {
          id: 'msg-xss-att',
          author_id: 'staff-1',
          author_type: 'staff',
          content: 'Attachment check',
          created_at: '2026-08-25T10:00:00Z',
          attachments: [
            {
              id: 'att-bad',
              filename: 'evil.png',
              url: 'javascript:alert(1)',
            },
          ],
        },
      ],
    });

    const { container } = renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Attachment check')).toBeDefined();
    });

    expect(container.querySelector('a[href^="javascript:"]')).toBeNull();
    expect(container.querySelector('img[src^="javascript:"]')).toBeNull();
  });
});
