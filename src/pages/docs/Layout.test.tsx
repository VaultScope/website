import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { DocsLayout } from './Layout';

function renderComponent(route = '/docs') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <DocsLayout />
    </MemoryRouter>
  );
}

describe('DocsLayout', () => {
  it('renders "Documentation" heading', () => {
    renderComponent();
    expect(screen.getByText('Documentation')).toBeDefined();
  });

  it('renders Overview nav item', () => {
    renderComponent();
    expect(screen.getByText('Overview')).toBeDefined();
  });

  it('renders Customer Experience nav item', () => {
    renderComponent();
    expect(screen.getByText('Customer Experience')).toBeDefined();
  });

  it('renders VAMOS Backend nav item', () => {
    renderComponent();
    expect(screen.getByText('VAMOS Backend')).toBeDefined();
  });

  it('renders CAMOS Admin nav item', () => {
    renderComponent();
    expect(screen.getByText('CAMOS Admin')).toBeDefined();
  });

  it('links Overview to /docs', () => {
    renderComponent();
    const link = screen.getByText('Overview').closest('a');
    expect(link?.getAttribute('href')).toBe('/docs');
  });

  it('links VAMOS Backend to /docs/projects/vamos', () => {
    renderComponent();
    const link = screen.getByText('VAMOS Backend').closest('a');
    expect(link?.getAttribute('href')).toBe('/docs/projects/vamos');
  });

  it('applies active style to Overview on /docs route', () => {
    renderComponent('/docs');
    const link = screen.getByText('Overview').closest('a');
    expect(link?.className).toContain('bg-foreground/5');
  });
});
