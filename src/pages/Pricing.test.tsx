import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Pricing } from './Pricing';
import { LanguageProvider } from '../i18n';

function renderComponent() {
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <Pricing />
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe('Pricing', () => {
  it('renders "Pricing" heading', () => {
    renderComponent();
    expect(screen.getByText('Pricing')).toBeDefined();
  });

  it('renders description text', () => {
    renderComponent();
    expect(screen.getByText(/Transparent pricing/)).toBeDefined();
  });

  it('sets document title', () => {
    renderComponent();
    expect(document.title).toBeTruthy();
  });
});
