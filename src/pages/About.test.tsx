import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { About } from './About';
import { LanguageProvider } from '../i18n';

function renderComponent() {
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <About />
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe('About', () => {
  it('renders without crashing', () => {
    renderComponent();
    expect(document.body).toBeDefined();
  });

  it('sets document title', () => {
    renderComponent();
    expect(document.title).toBeTruthy();
  });

  it('renders breadcrumbs', () => {
    renderComponent();
    expect(screen.getByText(/Company|Unternehmen/)).toBeDefined();
  });
});
