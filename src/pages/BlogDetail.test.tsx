import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { BlogDetail } from './BlogDetail';
import { api } from '../lib/api';

vi.mock('../lib/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

const mockArticle = {
  id: '1',
  slug: 'ipv6-deployment-considerations',
  title: 'IPv6 deployment considerations for infrastructure operators',
  content: 'Address allocation strategy and BGP routing best practices.',
  published_at: '2026-03-01T10:00:00Z',
};

function renderComponent(slug = 'ipv6-deployment-considerations') {
  return render(
    <MemoryRouter initialEntries={[`/blog/${slug}`]}>
      <Routes>
        <Route path="/blog/:slug" element={<BlogDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('BlogDetail', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockImplementation(async (path: string) => {
      if (path.includes('non-existent')) {
        throw new Error('Not found');
      }
      return mockArticle;
    });
  });

  it('renders article title for known slug', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('IPv6 deployment considerations for infrastructure operators')).toBeDefined();
    });
  });

  it('renders article content', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/Address allocation strategy/)).toBeDefined();
    });
  });

  it('renders back link to blog list', async () => {
    renderComponent();
    await waitFor(() => {
      const links = screen.getAllByRole('link');
      const backLink = links.find(l => l.getAttribute('href')?.includes('/blog'));
      expect(backLink).toBeDefined();
    });
  });

  it('renders not found for unknown slug', async () => {
    renderComponent('non-existent-article');
    await waitFor(() => {
      expect(screen.getByText(/Article not found/i)).toBeDefined();
    });
  });
});
