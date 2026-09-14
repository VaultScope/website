import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { DocsOverview } from './Overview';

function renderComponent() {
  return render(
    <MemoryRouter>
      <DocsOverview />
    </MemoryRouter>
  );
}

describe('DocsOverview', () => {
  it('renders the main heading', () => {
    renderComponent();
    expect(screen.getByText('VaultScope Ecosystem Documentation')).toBeDefined();
  });

  it('renders description of the ecosystem', () => {
    renderComponent();
    expect(screen.getByText(/Comprehensive documentation covering the VaultScope ecosystem/)).toBeDefined();
  });

  it('mentions VaultScope Storefront', () => {
    renderComponent();
    expect(screen.getByText(/VaultScope Storefront/)).toBeDefined();
  });

  it('mentions VAMOS', () => {
    renderComponent();
    expect(screen.getAllByText(/VAMOS/).length).toBeGreaterThan(0);
  });

  it('mentions CAMOS', () => {
    renderComponent();
    expect(screen.getAllByText(/CAMOS/).length).toBeGreaterThan(0);
  });

  it('mentions Security architecture', () => {
    renderComponent();
    expect(screen.getByText(/Security First Approach/)).toBeDefined();
  });

  it('sets document title', () => {
    renderComponent();
    expect(document.title).toBe('Documentation Overview — VaultScope');
  });
});
