import { render, screen, fireEvent } from '@testing-library/react';
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
  describe('Standalone Portal Mode (/docs & /docs/projects)', () => {
    it('renders /docs without a project sidebar', () => {
      renderComponent('/docs');
      expect(screen.queryByText('Documentation Hub')).toBeNull();
      expect(screen.queryByRole('complementary')).toBeNull();
    });

    it('renders /docs/projects without a project sidebar', () => {
      renderComponent('/docs/projects');
      expect(screen.queryByText('Documentation Hub')).toBeNull();
      expect(screen.queryByRole('complementary')).toBeNull();
    });
  });

  describe('Contextual Project Sidebar Mode', () => {
    it('renders Customer Experience sidebar on /docs/projects/storefront', () => {
      renderComponent('/docs/projects/storefront');
      expect(screen.getAllByText('Customer Experience').length).toBeGreaterThan(0);
      expect(screen.getByText('Storefront Portal')).toBeDefined();
      expect(screen.getByText('Documentation Hub')).toBeDefined();

      const hubLink = screen.getByText('Documentation Hub').closest('a');
      expect(hubLink?.getAttribute('href')).toBe('/docs');

      expect(screen.getByText('Installation')).toBeDefined();
      expect(screen.getByText('Configuration')).toBeDefined();
      expect(screen.getByText('Upgrades & Backups')).toBeDefined();
    });

    it('renders VAMOS Backend sidebar on /docs/projects/vamos', () => {
      renderComponent('/docs/projects/vamos');
      expect(screen.getAllByText('VAMOS Backend').length).toBeGreaterThan(0);
      expect(screen.getByText('Engine & Gateway')).toBeDefined();
      expect(screen.getByText('Upgrades & DB Migrations')).toBeDefined();
      expect(screen.getByText('VAMOS API Reference')).toBeDefined();
    });

    it('renders CAMOS Admin sidebar on /docs/projects/camos', () => {
      renderComponent('/docs/projects/camos');
      expect(screen.getAllByText('CAMOS Admin').length).toBeGreaterThan(0);
      expect(screen.getByText('Operations Control Plane')).toBeDefined();
      expect(screen.getByText('Production Runbooks')).toBeDefined();
    });

    it('renders Platform Guides sidebar on /docs/architecture', () => {
      renderComponent('/docs/architecture');
      expect(screen.getAllByText('Platform Guides').length).toBeGreaterThan(0);
      expect(screen.getByText('System Architecture')).toBeDefined();
      expect(screen.getByText('Authentik OIDC SSO')).toBeDefined();
    });
  });

  describe('Mobile Navigation Drawer', () => {
    it('renders mobile menu toggle button on project routes', () => {
      renderComponent('/docs/projects/vamos');
      expect(screen.getByRole('button', { name: /open documentation navigation/i })).toBeDefined();
    });

    it('opens and closes the mobile navigation drawer', () => {
      renderComponent('/docs/projects/vamos');
      
      const openButton = screen.getByRole('button', { name: /open documentation navigation/i });
      fireEvent.click(openButton);

      // Drawer dialog should be open
      const dialog = screen.getByRole('dialog', { name: /documentation menu/i });
      expect(dialog).toBeDefined();

      // Close button should be present
      const closeButton = screen.getByRole('button', { name: /close navigation/i });
      fireEvent.click(closeButton);

      // Dialog should be closed
      expect(screen.queryByRole('dialog', { name: /documentation menu/i })).toBeNull();
    });
  });

  describe('Docs Search Modal Integration', () => {
    it('opens search modal when clicking search button in sidebar', () => {
      renderComponent('/docs/projects/storefront');
      const searchButtons = screen.getAllByRole('button', { name: /search documentation/i });
      fireEvent.click(searchButtons[0]);

      expect(screen.getByRole('dialog', { name: /search documentation/i })).toBeDefined();
      expect(screen.getByPlaceholderText(/search documentation, guides, and apis/i)).toBeDefined();
    });

    it('opens search modal on Ctrl+K and closes on Escape', () => {
      renderComponent('/docs');
      
      fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
      expect(screen.getByRole('dialog', { name: /search documentation/i })).toBeDefined();

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(screen.queryByRole('dialog', { name: /search documentation/i })).toBeNull();
    });
  });
});
