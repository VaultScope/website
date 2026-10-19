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
  describe('Documentation Sidebar', () => {
    it('renders navigation links for Overview, User Login & Account, and SFTP Storage', () => {
      renderComponent('/docs');
      expect(screen.getAllByText('Overview').length).toBeGreaterThan(0);
      expect(screen.getAllByText('User Login & Account').length).toBeGreaterThan(0);
      expect(screen.getAllByText('SFTP Storage').length).toBeGreaterThan(0);
    });
  });

  describe('Mobile Navigation Drawer', () => {
    it('renders mobile menu toggle button', () => {
      renderComponent('/docs/customer/sftp');
      expect(screen.getByRole('button', { name: /open documentation navigation/i })).toBeDefined();
    });

    it('opens and closes the mobile navigation drawer', () => {
      renderComponent('/docs/customer/sftp');

      const openButton = screen.getByRole('button', { name: /open documentation navigation/i });
      fireEvent.click(openButton);

      const dialog = screen.getByRole('dialog', { name: /documentation menu/i });
      expect(dialog).toBeDefined();

      const closeButton = screen.getByRole('button', { name: /close navigation/i });
      fireEvent.click(closeButton);

      expect(screen.queryByRole('dialog', { name: /documentation menu/i })).toBeNull();
    });
  });

  describe('Docs Search Modal Integration', () => {
    it('opens search modal when clicking search button in sidebar', () => {
      renderComponent('/docs');
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
