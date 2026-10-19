import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n';
import { api } from '../lib/api';

vi.mock('../lib/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('InfrastructureCloud', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', async () => {
    vi.mocked(api.get).mockResolvedValueOnce([]);
    const { InfrastructureCloud } = await import('./InfrastructureCloud');
    const { container } = render(
      <MemoryRouter>
        <LanguageProvider>
          <InfrastructureCloud />
        </LanguageProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });
    expect(container).toBeDefined();
  });

  it('sets document title', async () => {
    vi.mocked(api.get).mockResolvedValueOnce([]);
    const { InfrastructureCloud } = await import('./InfrastructureCloud');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <InfrastructureCloud />
        </LanguageProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(document.title).toBeTruthy();
    });
  });

  it('renders live catalog products without [object Object], unset dash specs, or double euro symbols', async () => {
    vi.mocked(api.get).mockResolvedValueOnce([
      {
        id: 'vps-1',
        name: 'VS-Cloud-4',
        category: 'vps',
        provider: 'proxmox',
        price: '10.00',
        stock: 5,
        specs: {
          cpu: 4,
          ram: 8,
          storage: 160,
        },
      },
    ]);
    const { InfrastructureCloud } = await import('./InfrastructureCloud');
    const { container } = render(
      <MemoryRouter>
        <LanguageProvider>
          <InfrastructureCloud />
        </LanguageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(container.textContent).toContain('VS-Cloud-4');
    });

    const tableText = container.querySelector('table')?.textContent ?? '';
    expect(tableText).toContain('€11.90');
    expect(tableText).toContain('€10.00');
    expect(tableText).not.toContain('€€');
    expect(tableText).not.toContain('[object Object]');
    expect(tableText).not.toContain('bandwidth');
  });
});
