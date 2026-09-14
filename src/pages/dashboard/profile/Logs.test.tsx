import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProfileLogs } from './Logs';
import { ToastProvider } from '../../../components/Toast';

vi.mock('../../../lib/api', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from '../../../lib/api';
const mockGet = vi.mocked(api.get);

const mockLogs = [
  {
    id: 'log-1',
    action: 'Service started',
    target: 'vps-prod-01',
    detail: 'Power-on initiated by customer',
    created_at: '2026-08-28T09:15:00Z',
  },
  {
    id: 'log-2',
    action: 'Password changed',
    target: 'account',
    detail: 'Password updated via Authentik',
    created_at: '2026-08-27T14:30:00Z',
  },
  {
    id: 'log-3',
    action: 'Login',
    target: 'session',
    detail: 'Successful login from 192.168.1.1',
    created_at: '2026-08-27T08:00:00Z',
  },
];

function renderComponent() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <ProfileLogs />
      </ToastProvider>
    </MemoryRouter>
  );
}

describe('ProfileLogs', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('calls the activity endpoint', async () => {
    mockGet.mockResolvedValue([]);
    renderComponent();

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/storefront/activity');
    });
  });

  it('renders activity logs with action and target', async () => {
    mockGet.mockResolvedValue(mockLogs);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Service started')).toBeDefined();
      expect(screen.getByText('vps-prod-01')).toBeDefined();
      expect(screen.getByText('Password changed')).toBeDefined();
      expect(screen.getByText('account')).toBeDefined();
      expect(screen.getByText('Login')).toBeDefined();
      expect(screen.getByText('session')).toBeDefined();
    });
  });

  it('renders detail text for each log', async () => {
    mockGet.mockResolvedValue(mockLogs);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Power-on initiated by customer')).toBeDefined();
      expect(screen.getByText('Password updated via Authentik')).toBeDefined();
      expect(screen.getByText('Successful login from 192.168.1.1')).toBeDefined();
    });
  });

  it('renders empty state when no logs', async () => {
    mockGet.mockResolvedValue([]);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No activity logs found')).toBeDefined();
    });
  });

  it('shows the 72 hours notice', async () => {
    mockGet.mockResolvedValue([]);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Customer-visible activity for the last 72 hours/)).toBeDefined();
    });
  });

  it('renders formatted date and time from created_at', async () => {
    mockGet.mockResolvedValue([mockLogs[0]]);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Service started')).toBeDefined();
    });

    // The date should be formatted (toLocaleDateString + toLocaleTimeString)
    const dateElements = screen.getAllByText(/\d{1,2}[\/.]\d{1,2}[\/.]\d{2,4}/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it('handles non-array response gracefully', async () => {
    mockGet.mockResolvedValue(null as any);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No activity logs found')).toBeDefined();
    });
  });
});
