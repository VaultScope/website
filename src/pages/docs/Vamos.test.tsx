import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { DocsVamos } from './Vamos';

describe('DocsVamos', () => {
  it('renders heading', () => {
    render(<MemoryRouter><DocsVamos /></MemoryRouter>);
    expect(screen.getByText('VAMOS (API & Backend)')).toBeDefined();
  });

  it('sets document title', () => {
    render(<MemoryRouter><DocsVamos /></MemoryRouter>);
    expect(document.title).toBe('VAMOS Documentation — VaultScope');
  });

  it('mentions Rust and Axum', () => {
    render(<MemoryRouter><DocsVamos /></MemoryRouter>);
    expect(screen.getByText(/Rust/)).toBeDefined();
  });

  it('describes API Gateway', () => {
    render(<MemoryRouter><DocsVamos /></MemoryRouter>);
    expect(screen.getByText(/Centralized API Gateway/)).toBeDefined();
  });
});
