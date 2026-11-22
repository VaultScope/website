import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from '../i18n';
import { GuidesIndex } from './GuidesIndex';
import { GuideDetail } from './GuideDetail';
import { BlogList } from './BlogList';
import { api } from '../lib/api';

vi.mock('../lib/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('SEO Guides & Blog separation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders static technical guides under /guides and /de/guides', async () => {
    vi.mocked(api.get).mockResolvedValue([]);
    render(
      <MemoryRouter initialEntries={['/de/guides']}>
        <LanguageProvider>
          <GuidesIndex />
        </LanguageProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Technische Guides & Themen')).toBeDefined();
      expect(screen.getByText('DSGVO-konformes Cloud-VPS-Hosting in Deutschland & der EU')).toBeDefined();
    });
  });

  it('renders GuideDetail for a static guide slug', () => {
    render(
      <MemoryRouter initialEntries={['/guides/eu-cloud-vps-gdpr-hosting']}>
        <LanguageProvider>
          <Routes>
            <Route path="/guides/:slug" element={<GuideDetail />} />
          </Routes>
        </LanguageProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('GDPR-Compliant Cloud VPS Hosting in Germany & the EU')).toBeDefined();
  });

  it('excludes unlisted/guide posts from public BlogList', async () => {
    vi.mocked(api.get).mockImplementation(async (url: string) => {
      if (url === '/storefront/blog') {
        return [
          {
            id: '1',
            slug: 'public-release',
            title: 'Public Release Note',
            content: 'Public post content',
            published_at: '2026-11-20',
            visibility: 'public',
          },
          {
            id: '2',
            slug: 'seo-hidden-guide',
            title: 'Unlisted SEO Guide Post',
            content: 'Guide content',
            published_at: '2026-11-20',
            visibility: 'unlisted',
          },
        ];
      }
      return [];
    });

    render(
      <MemoryRouter initialEntries={['/resources/blog']}>
        <LanguageProvider>
          <BlogList />
        </LanguageProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Public Release Note')).toBeDefined();
    });
    expect(screen.queryByText('Unlisted SEO Guide Post')).toBeNull();
  });
});
