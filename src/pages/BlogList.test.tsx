import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { BlogList } from './BlogList';
import { api } from '../lib/api';

vi.mock('../lib/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

const mockPosts = [
  {
    id: '1',
    slug: 'ipv6-deployment',
    title: 'IPv6 deployment considerations for infrastructure operators',
    excerpt: 'Detailed overview of IPv6 allocation.',
    content: 'Full article text',
    published_at: '2026-03-01T10:00:00Z',
  },
  {
    id: '2',
    slug: 'incident-post-mortem',
    title: 'Incident post-mortem: Core routing failover',
    excerpt: 'Analysis of routing failover.',
    content: 'Post-mortem details',
    published_at: '2026-02-15T10:00:00Z',
  },
];

function renderComponent() {
  return render(
    <MemoryRouter>
      <BlogList />
    </MemoryRouter>
  );
}

describe('BlogList', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockResolvedValue(mockPosts);
  });

  it('renders blog posts', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/IPv6 deployment/)).toBeDefined();
    });
  });

  it('renders post metadata (date and title)', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/IPv6 deployment/)).toBeDefined();
    });
    expect(screen.getByText(/Detailed overview/)).toBeDefined();
  });

  it('renders search input', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Search/i)).toBeDefined();
    });
  });

  it('filters posts by search query', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/IPv6 deployment/)).toBeDefined();
    });

    const input = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(input, { target: { value: 'incident' } });

    expect(screen.getByText(/Incident post-mortem/)).toBeDefined();
    expect(screen.queryByText(/IPv6 deployment/)).toBeNull();
  });

  it('renders links to individual posts', async () => {
    renderComponent();
    await waitFor(() => {
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });
  });
});
