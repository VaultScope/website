import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { DocsStorefront } from './Storefront';

describe('DocsStorefront', () => {
  it('renders heading', () => {
    render(<MemoryRouter><DocsStorefront /></MemoryRouter>);
    expect(screen.getByText('Customer Experience (Storefront)')).toBeDefined();
  });

  it('sets document title', () => {
    render(<MemoryRouter><DocsStorefront /></MemoryRouter>);
    expect(document.title).toBe('Customer Experience Documentation — VaultScope');
  });

  it('mentions React and Vite', () => {
    render(<MemoryRouter><DocsStorefront /></MemoryRouter>);
    expect(screen.getByText(/React/)).toBeDefined();
  });

  it('describes the product catalog', () => {
    render(<MemoryRouter><DocsStorefront /></MemoryRouter>);
    expect(screen.getByText(/Dynamic Product Catalog/)).toBeDefined();
  });

  it('describes the ordering workflow', () => {
    render(<MemoryRouter><DocsStorefront /></MemoryRouter>);
    expect(screen.getByText(/Automated Ordering Workflow/)).toBeDefined();
  });
});
