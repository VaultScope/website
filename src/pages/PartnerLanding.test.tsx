import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from '../i18n';

describe('PartnerLanding', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading state initially', async () => {
    // Hang fetch so it stays loading
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => new Promise(() => {})));

    const { PartnerLanding } = await import('./PartnerLanding');
    render(
      <MemoryRouter initialEntries={['/ps/testpartner']}>
        <LanguageProvider>
          <Routes>
            <Route path="/ps/:partner" element={<PartnerLanding />} />
          </Routes>
        </LanguageProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading partner offer/)).toBeDefined();
  });

  it('renders partner details and product trial on success', async () => {
    const mockPayload = {
      partner: {
        id: 'p-1',
        slug: 'techcorp',
        name: 'TechCorp',
        headline: 'Exclusive Free Cloud Trial',
        description: 'Special trial offer for TechCorp members.',
        badge_text: 'Community Special',
        trial_days: 30,
      },
      product: {
        id: 'prod-1',
        name: 'CX22 Cloud Server',
        slug: 'cx22',
        category: 'vps',
        provider: 'hetzner',
        target: 'cx22',
        specs: { cpu: '2 vCPU', ram: '4 GB RAM' },
        price: '4.50',
        billing_cycle: 'monthly',
        trial_days: 14,
      },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockPayload,
      })
    );

    const { PartnerLanding } = await import('./PartnerLanding');
    render(
      <MemoryRouter initialEntries={['/ps/techcorp']}>
        <LanguageProvider>
          <Routes>
            <Route path="/ps/:partner" element={<PartnerLanding />} />
          </Routes>
        </LanguageProvider>
      </MemoryRouter>
    );

    const partnerElements = await screen.findAllByText(/TechCorp/);
    expect(partnerElements.length).toBeGreaterThan(0);
    expect(await screen.findByText('CX22 Cloud Server')).toBeDefined();
    expect(await screen.findByText(/30-Day Free Trial/)).toBeDefined();
  });
});
