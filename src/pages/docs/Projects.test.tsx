import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { DocsProjects } from './Projects';

describe('DocsProjects', () => {
  it('renders the main heading', () => {
    render(
      <MemoryRouter>
        <DocsProjects />
      </MemoryRouter>
    );
    expect(screen.getByText('VaultScope Core Projects')).toBeDefined();
  });

  it('sets document title', () => {
    render(
      <MemoryRouter>
        <DocsProjects />
      </MemoryRouter>
    );
    expect(document.title).toBe('Core Projects — VaultScope Documentation');
  });

  it('renders all three core project names', () => {
    render(
      <MemoryRouter>
        <DocsProjects />
      </MemoryRouter>
    );
    expect(screen.getByText('VaultScope Storefront')).toBeDefined();
    expect(screen.getByText('VAMOS API & Engine')).toBeDefined();
    expect(screen.getByText('CAMOS Admin Panel')).toBeDefined();
  });

  it('renders links to project guides', () => {
    render(
      <MemoryRouter>
        <DocsProjects />
      </MemoryRouter>
    );
    const links = screen.getAllByText('Read Lifecycle Guide');
    expect(links.length).toBe(3);
  });
});
