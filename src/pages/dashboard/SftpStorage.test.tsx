import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SftpStorage from './SftpStorage';

vi.mock('../../lib/api', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from '../../lib/api';
const mockGet = vi.mocked(api.get);

const mockServices = [
  {
    id: 'sftp-svc-1',
    name: 'SFTP Storage Pro',
    status: 'active',
    is_trial: false,
    hostname: 'custom.mybrand.io', // Custom hostname to verify official domain takes precedence
    provider_resource_id: 'vs_user_alpha',
    config: {
      raw_response: {
        password: 'sftp-secret-password-123',
      },
    },
  },
];

const mockCatalog = [
  {
    id: 'prod-sftp-1',
    name: 'SFTP Storage Trial (25GB)',
    price: '0.00',
    trial_days: 14,
    specs: { storage_gb: 25 },
  },
];

function renderComponent() {
  return render(
    <MemoryRouter>
      <SftpStorage />
    </MemoryRouter>
  );
}

describe('SftpStorage - CONFIGURATIONS & FTHR Preset', () => {
  beforeEach(() => {
    mockGet.mockReset();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders SFTP service and CONFIGURATIONS button', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/services') return Promise.resolve(mockServices);
      if (path === '/storefront/catalog') return Promise.resolve(mockCatalog);
      return Promise.resolve([]);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('SFTP Storage Pro')).toBeDefined();
    });

    expect(screen.getByText('CONFIGURATIONS')).toBeDefined();
  });

  it('opens dropdown menu on clicking CONFIGURATIONS and shows FTHR', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/services') return Promise.resolve(mockServices);
      if (path === '/storefront/catalog') return Promise.resolve(mockCatalog);
      return Promise.resolve([]);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('CONFIGURATIONS')).toBeDefined();
    });

    const configButton = screen.getByText('CONFIGURATIONS').closest('button')!;
    await act(async () => {
      fireEvent.click(configButton);
    });

    expect(screen.getByText('FTHR')).toBeDefined();
    expect(screen.getByText('Copy clipping JSON')).toBeDefined();
  });

  it('copies FTHR JSON model to clipboard with official domain and port as number', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/services') return Promise.resolve(mockServices);
      if (path === '/storefront/catalog') return Promise.resolve(mockCatalog);
      return Promise.resolve([]);
    });

    const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText');

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('CONFIGURATIONS')).toBeDefined();
    });

    await act(async () => {
      fireEvent.click(screen.getByText('CONFIGURATIONS').closest('button')!);
    });

    await act(async () => {
      fireEvent.click(screen.getByText('FTHR'));
    });

    expect(writeTextSpy).toHaveBeenCalledTimes(1);
    const copiedJsonStr = writeTextSpy.mock.calls[0][0];
    const parsed = JSON.parse(copiedJsonStr);

    expect(parsed).toEqual({
      username: 'vs_user_alpha',
      password: 'sftp-secret-password-123',
      port: 2022,
      domain: 'sftp.vaultscope.de', // official domain, not 'custom.mybrand.io'
      providerName: 'VaultScope',
    });
    expect(typeof parsed.port).toBe('number');
  });

  it('displays the "Don\'t share this with anyone" screen modal after selecting FTHR', async () => {
    mockGet.mockImplementation((path: string) => {
      if (path === '/storefront/services') return Promise.resolve(mockServices);
      if (path === '/storefront/catalog') return Promise.resolve(mockCatalog);
      return Promise.resolve([]);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('CONFIGURATIONS')).toBeDefined();
    });

    await act(async () => {
      fireEvent.click(screen.getByText('CONFIGURATIONS').closest('button')!);
    });

    await act(async () => {
      fireEvent.click(screen.getByText('FTHR'));
    });

    // Modal screen should appear
    await waitFor(() => {
      expect(screen.getByText("Don't share this with anyone")).toBeDefined();
    });
    expect(screen.getByText(/High Security Warning/i)).toBeDefined();
    expect(screen.getByText(/Copied to clipboard successfully!/i)).toBeDefined();

    // Closing modal
    const closeBtn = screen.getByText('I understand, keep safe');
    await act(async () => {
      fireEvent.click(closeBtn);
    });

    await waitFor(() => {
      expect(screen.queryByText("Don't share this with anyone")).toBeNull();
    });
  });
});
