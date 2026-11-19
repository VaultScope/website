import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VncConsoleModal } from './VncConsoleModal';
import { api } from '../lib/api';

vi.mock('../lib/api', () => ({
  api: { post: vi.fn() },
}));

describe('VncConsoleModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('opens safe External Viewer URL with noopener,noreferrer', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      wss_url: 'wss://console.hetzner.cloud/123?token=abc',
      password: 'vnc-secret',
    });
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(
      <VncConsoleModal
        isOpen={true}
        onClose={() => {}}
        service={{ id: 'srv-1', name: 'VPS-1', hostname: 'vps1', ip: '1.2.3.4' }}
      />,
    );

    const btn = await screen.findByRole('button', { name: 'External Viewer' });
    expect((btn as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(btn);
    expect(openSpy).toHaveBeenCalledWith(
      'wss://console.hetzner.cloud/123?token=abc',
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('disables External Viewer and blocks window.open for javascript: URLs', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      wss_url: 'javascript:alert(1)',
      password: 'vnc-secret',
    });
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(
      <VncConsoleModal
        isOpen={true}
        onClose={() => {}}
        service={{ id: 'srv-1', name: 'VPS-1' }}
      />,
    );

    await waitFor(() => {
      const btn = screen.getByRole('button', { name: 'External Viewer' }) as HTMLButtonElement;
      expect(btn.disabled).toBe(true);
      fireEvent.click(btn);
    });

    expect(openSpy).not.toHaveBeenCalled();
  });
});
