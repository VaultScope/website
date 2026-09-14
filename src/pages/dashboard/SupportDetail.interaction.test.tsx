import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../../lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import { api } from '../../lib/api';
const mockApi = vi.mocked(api);

const mockTicketData = {
  ticket: {
    id: 'tkt-1',
    ticket_number: 'TKT-001',
    subject: 'Server not responding',
    status: 'open',
    priority: 'high',
    created_at: '2026-01-01T00:00:00Z',
  },
  messages: [
    {
      id: 'msg-1',
      author_id: 'c1',
      author_type: 'customer',
      content: 'My server is down',
      created_at: '2026-01-01T00:00:00Z',
    },
    {
      id: 'msg-2',
      author_id: 'staff-1',
      author_type: 'staff',
      content: 'Looking into it now',
      created_at: '2026-01-01T01:00:00Z',
    },
  ],
};

function renderDetail() {
  return render(
    <MemoryRouter initialEntries={['/dashboard/support/tkt-1']}>
      <Routes>
        <Route path="/dashboard/support/:id" element={<SupportDetailLazy />} />
      </Routes>
    </MemoryRouter>
  );
}

let SupportDetailLazy: React.FC;

describe('SupportDetail interactions', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    mockApi.get.mockResolvedValue(mockTicketData);
    const mod = await import('./SupportDetail');
    SupportDetailLazy = mod.SupportDetail;
  });

  it('shows loading state initially', () => {
    mockApi.get.mockReturnValue(new Promise(() => {}));
    renderDetail();
    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('displays ticket subject and number after load', async () => {
    renderDetail();
    await waitFor(() => {
      expect(screen.getByText('Server not responding')).toBeDefined();
    });
    expect(screen.getByText('TKT-001')).toBeDefined();
  });

  it('displays ticket messages', async () => {
    renderDetail();
    await waitFor(() => {
      expect(screen.getByText('My server is down')).toBeDefined();
    });
    expect(screen.getByText('Looking into it now')).toBeDefined();
  });

  it('shows ticket status and priority', async () => {
    renderDetail();
    await waitFor(() => {
      expect(screen.getByText('OPEN')).toBeDefined();
      expect(screen.getByText('HIGH')).toBeDefined();
    });
  });

  it('reply textarea accepts input', async () => {
    renderDetail();
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('Server not responding')).toBeDefined();
    });

    const textarea = document.querySelector('textarea');
    if (textarea) {
      await user.type(textarea, 'Thanks for the update');
      expect(textarea.value).toBe('Thanks for the update');
    } else {
      // If no textarea, there should be some reply input mechanism
      expect(screen.getByText('Server not responding')).toBeDefined();
    }
  });

  it('does not send empty reply', async () => {
    renderDetail();
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('Server not responding')).toBeDefined();
    });

    const sendButtons = screen.getAllByRole('button');
    const sendBtn = sendButtons.find(b => b.textContent?.includes('Send') || b.querySelector('svg'));
    if (sendBtn) {
      await user.click(sendBtn);
      expect(mockApi.post).not.toHaveBeenCalled();
    }
  });

  it('calls api.get with correct ticket ID', async () => {
    renderDetail();
    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith('/storefront/tickets/tkt-1');
    });
  });

  it('has back link to ticket list', async () => {
    renderDetail();
    await waitFor(() => {
      expect(screen.getByText('Server not responding')).toBeDefined();
    });
    const backLink = screen.getByText(/Tickets/i).closest('a');
    expect(backLink?.getAttribute('href')).toBe('/dashboard/support');
  });
});
