import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { BlogDetail } from './BlogDetail';

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
  it('renders article title for known slug', () => {
    renderComponent();
    expect(screen.getByText('IPv6 deployment considerations for infrastructure operators')).toBeDefined();
  });

  it('renders article metadata', () => {
    renderComponent();
    expect(screen.getByText(/Infrastructure/)).toBeDefined();
    expect(screen.getByText(/VaultScope Engineering/)).toBeDefined();
  });

  it('renders article content', () => {
    renderComponent();
    expect(screen.getByText(/Address allocation strategy/)).toBeDefined();
  });

  it('renders back link to blog list', () => {
    renderComponent();
    const links = screen.getAllByRole('link');
    const backLink = links.find(l => l.getAttribute('href')?.includes('/blog'));
    expect(backLink).toBeDefined();
  });

  it('renders not found for unknown slug', () => {
    renderComponent('non-existent-article');
    expect(screen.getByText(/not found|Article not found/i)).toBeDefined();
  });
});
