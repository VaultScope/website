import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { BlogList } from './BlogList';

function renderComponent() {
  return render(
    <MemoryRouter>
      <BlogList />
    </MemoryRouter>
  );
}

describe('BlogList', () => {
  it('renders blog posts', () => {
    renderComponent();
    expect(screen.getByText(/IPv6 deployment/)).toBeDefined();
  });

  it('renders post metadata (category, author, read time)', () => {
    renderComponent();
    expect(screen.getByText('Infrastructure')).toBeDefined();
    expect(screen.getByText(/VaultScope Engineering/)).toBeDefined();
  });

  it('renders search input', () => {
    renderComponent();
    expect(screen.getByPlaceholderText(/Search/i)).toBeDefined();
  });

  it('filters posts by search query', () => {
    renderComponent();
    const input = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(input, { target: { value: 'incident' } });
    expect(screen.getByText(/Incident post-mortem/)).toBeDefined();
    expect(screen.queryByText(/IPv6 deployment/)).toBeNull();
  });

  it('renders links to individual posts', () => {
    renderComponent();
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});
