import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n';
import { api } from '../lib/api';

vi.mock('../lib/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing and shows empty catalog notice when API returns no plans', async () => {
    vi.mocked(api.get).mockResolvedValueOnce([]);
    const { Home } = await import('./Home');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <Home />
        </LanguageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/No public self-service plans currently published in live catalog/i)
      ).toBeDefined();
    });
  });

  it('formats location and bandwidth cleanly without trailing dash when bandwidth is missing', async () => {
    vi.mocked(api.get).mockResolvedValueOnce([
      {
        id: 'vps-no-bw',
        name: 'VS-Cloud-NoBW',
        category: 'vps',
        provider: 'proxmox',
        price: '10.00',
        stock: 3,
        specs: {
          cpu: 2,
          ram: 4,
          storage: 80,
        },
      },
      {
        id: 'vps-with-bw',
        name: 'VS-Cloud-WithBW',
        category: 'vps',
        provider: 'proxmox',
        price: '20.00',
        stock: 5,
        specs: {
          cpu: 4,
          ram: 8,
          storage: 160,
          bandwidth: '20 TB',
          location: 'Falkenstein, DE',
        },
      },
    ]);

    const { Home } = await import('./Home');
    const { container } = render(
      <MemoryRouter>
        <LanguageProvider>
          <Home />
        </LanguageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('VS-Cloud-NoBW')).toBeDefined();
    });

    const text = container.textContent ?? '';
    expect(text).toContain('Germany (EU-Central)');
    expect(text).not.toContain('Germany (EU-Central) · —');
    expect(text).toContain('Falkenstein, DE · 20 TB');
  });

  it('filters out N/A and dash bandwidth placeholders and falls back location when empty', async () => {
    vi.mocked(api.get).mockResolvedValueOnce([
      {
        id: 'vps-na-bw',
        name: 'VS-Cloud-NA',
        category: 'vps',
        provider: 'proxmox',
        price: '12.00',
        stock: 2,
        specs: {
          cpu: 2,
          ram: 4,
          storage: 60,
          bandwidth: 'N/A',
          location: '',
          description: '-',
        },
      },
      {
        id: 'vps-custom-loc',
        name: 'VS-Cloud-CustomLoc',
        category: 'vps',
        provider: 'proxmox',
        price: '15.00',
        stock: 2,
        specs: {
          cpu: 4,
          ram: 8,
          storage: 120,
          bandwidth: '-',
          location: 'Frankfurt, DE',
        },
      },
    ]);

    const { Home } = await import('./Home');
    const { container } = render(
      <MemoryRouter>
        <LanguageProvider>
          <Home />
        </LanguageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('VS-Cloud-NA')).toBeDefined();
    });

    const text = container.textContent ?? '';
    expect(text).toContain('Germany (EU-Central)');
    expect(text).toContain('Frankfurt, DE');
    expect(text).not.toContain('· N/A');
    expect(text).not.toContain('· -');
    expect(text).not.toContain('· —');
  });

  it('shows category empty notice when a selected filter has zero matching plans and allows resetting', async () => {
    vi.mocked(api.get).mockResolvedValueOnce([
      {
        id: 'vps-1',
        name: 'VS-Cloud-Starter',
        category: 'vps',
        provider: 'proxmox',
        price: '10.00',
        stock: 2,
        specs: { cpu: 2, ram: 4, storage: 40 },
      },
    ]);

    const { Home } = await import('./Home');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <Home />
        </LanguageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('VS-Cloud-Starter')).toBeDefined();
    });

    const user = userEvent.setup();
    const dedicatedTab = screen
      .getAllByRole('button')
      .find((b) => b.textContent?.includes('Dedicated'));
    expect(dedicatedTab).toBeDefined();

    await user.click(dedicatedTab!);

    expect(
      screen.getByText(/No public self-service plans currently published in this category/i)
    ).toBeDefined();

    const showAllBtn = screen.getByRole('button', { name: /Show All Plans/i });
    await user.click(showAllBtn);

    expect(screen.getByText('VS-Cloud-Starter')).toBeDefined();
  });

  it('renders German (/de/) empty-state notice and category filter reset button accurately', async () => {
    vi.mocked(api.get).mockResolvedValueOnce([]);

    const { Home } = await import('./Home');
    render(
      <MemoryRouter initialEntries={['/de/']}>
        <LanguageProvider>
          <Home />
        </LanguageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          /Keine öffentlichen Selbstbedienungs-Tarife im Live-Katalog freigeschaltet/i
        )
      ).toBeDefined();
    });

    const user = userEvent.setup();
    const storageTab = screen
      .getAllByRole('button')
      .find((b) => b.textContent?.trim() === 'Speicher');
    expect(storageTab).toBeDefined();

    await user.click(storageTab!);

    expect(
      screen.getByText(/Keine Tarife in dieser Kategorie freigeschaltet/i)
    ).toBeDefined();

    const resetBtn = screen.getByRole('button', { name: /Alle Tarife anzeigen/i });
    await user.click(resetBtn);

    expect(
      screen.getByText(
        /Keine öffentlichen Selbstbedienungs-Tarife im Live-Katalog freigeschaltet/i
      )
    ).toBeDefined();
  });

  it('fetches from /storefront/catalog and treats stock: -1 as Available', async () => {
    vi.mocked(api.get).mockResolvedValueOnce([
      {
        id: '01a13705-90f5-7a90-bde7-02686af823d1',
        name: 'SFTP - Basic',
        category: 'Storage',
        provider: 'sftpgo',
        price: '8.40',
        stock: -1,
        hidden: false,
        specs: {
          location: 'Helsinki, FI',
          protocols: 'SFTP, SCP, FTPS, WebDAV',
          storage: '150 GB SFTP Storage',
          traffic: 'Unmetered / Fair Use',
        },
      },
    ]);

    const { Home } = await import('./Home');
    const { container } = render(
      <MemoryRouter>
        <LanguageProvider>
          <Home />
        </LanguageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('SFTP - Basic')).toBeDefined();
    });

    expect(api.get).toHaveBeenCalledWith('/storefront/catalog');
    const text = container.textContent ?? '';
    expect(text).toContain('Available');
    expect(text).toContain('150 GB SFTP Storage · SFTP, SCP, FTPS, WebDAV');
    expect(text).toContain('Helsinki, FI · Unmetered / Fair Use');
    expect(text).not.toContain('150 GB SFTP Storage GB NVMe');
  });
});

