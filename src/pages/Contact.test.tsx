import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Contact } from './Contact';
import { LanguageProvider } from '../i18n';

function renderComponent() {
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <Contact />
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe('Contact', () => {
  it('renders contact page', () => {
    renderComponent();
    expect(document.body).toBeDefined();
  });

  it('renders support email link', () => {
    renderComponent();
    expect(screen.getByText('Technical Support')).toBeDefined();
  });

  it('renders billing email link', () => {
    renderComponent();
    expect(screen.getByText('Billing & Sales')).toBeDefined();
  });

  it('renders data privacy link', () => {
    renderComponent();
    expect(screen.getByText('Data & Privacy')).toBeDefined();
  });

  it('sets document title', () => {
    renderComponent();
    expect(document.title).toBeTruthy();
  });
});
