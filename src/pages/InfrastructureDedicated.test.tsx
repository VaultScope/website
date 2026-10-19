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

describe('InfrastructureDedicated', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', async () => {
    vi.mocked(api.get).mockResolvedValueOnce([]);
    const { InfrastructureDedicated } = await import('./InfrastructureDedicated');
    const { container } = render(
      <MemoryRouter>
        <LanguageProvider>
          <InfrastructureDedicated />
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
    const { InfrastructureDedicated } = await import('./InfrastructureDedicated');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <InfrastructureDedicated />
        </LanguageProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(document.title).toBeTruthy();
    });
  });

  it('renders live dedicated products without [object Object], unset dash specs, or double euro symbols', async () => {
    vi.mocked(api.get).mockResolvedValueOnce([
      {
        id: 'ds-1',
        name: 'VS-Metal-EPYC',
        category: 'dedicated',
        provider: 'reliablesite',
        price: '100.00',
        stock: 2,
        specs: {
          cpu: 'AMD EPYC 7443P',
          ram: '128 GB ECC',
          storage: '2x 1.92 TB NVMe',
        },
      },
    ]);
    const { InfrastructureDedicated } = await import('./InfrastructureDedicated');
    const { container } = render(
      <MemoryRouter>
        <LanguageProvider>
          <InfrastructureDedicated />
        </LanguageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(container.textContent).toContain('VS-Metal-EPYC');
    });

    const tableText = container.querySelector('table')?.textContent ?? '';
    expect(tableText).toContain('€119.00');
    expect(tableText).toContain('€100.00');
    expect(tableText).not.toContain('€€');
    expect(tableText).not.toContain('[object Object]');
    expect(tableText).not.toContain('bandwidth');
  });
});
