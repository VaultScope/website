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

  it('strips script tags, event handlers, and javascript: links via DOMPurify', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      ...mockArticle,
      slug: 'xss-test',
      image_url: 'javascript:alert(1)',
      content:
        'Safe text <script>window.__xss=1</script><img src="x" onerror="window.__xss=2" /><a href="javascript:alert(3)">evil</a><a href="/docs">safe</a>',
    });

    const { container } = renderComponent('xss-test');

    await waitFor(() => {
      expect(screen.getByText(/Safe text/)).toBeDefined();
    });

    expect(container.querySelector('script')).toBeNull();
    const renderedImg = container.querySelector('.markdown-preview img');
    expect(renderedImg?.getAttribute('onerror')).toBeNull();
    const links = Array.from(container.querySelectorAll('.markdown-preview a'));
    expect(links.some((a) => a.getAttribute('href')?.toLowerCase().startsWith('javascript:'))).toBe(false);
    expect(links.some((a) => a.getAttribute('href') === '/docs')).toBe(true);
    // Unsafe cover image_url should not render <img>
    expect(container.querySelector('header img')).toBeNull();
  });

  it('URL-encodes slug when fetching article from API', async () => {
    vi.mocked(api.get).mockResolvedValueOnce(mockArticle);
    renderComponent('slug with spaces');

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/storefront/blog/slug%20with%20spaces');
    });
  });
});
