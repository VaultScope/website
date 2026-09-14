import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { NotFound } from './NotFound';
import { LanguageProvider } from '../i18n';

function renderComponent() {
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <NotFound />
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe('NotFound', () => {
  it('renders 404 text', () => {
    renderComponent();
    expect(screen.getByText('404')).toBeDefined();
  });

  it('renders "Page not found" heading in English', () => {
    renderComponent();
    expect(screen.getByText('Page not found.')).toBeDefined();
  });

  it('renders description text', () => {
    renderComponent();
    expect(screen.getByText(/doesn't exist or has been moved/)).toBeDefined();
  });

  it('renders "Go Home" button', () => {
    renderComponent();
    expect(screen.getByText('Go Home')).toBeDefined();
  });

  it('renders "Contact Us" button', () => {
    renderComponent();
    expect(screen.getByText('Contact Us')).toBeDefined();
  });

  it('sets document title to 404', () => {
    renderComponent();
    expect(document.title).toBe('404 — VaultScope');
  });
});
