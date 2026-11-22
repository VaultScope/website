import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Privacy } from './Privacy';
import { LanguageProvider } from '../i18n';

describe('Privacy', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><LanguageProvider><Privacy /></LanguageProvider></MemoryRouter>);
    expect(document.body).toBeDefined();
    expect(screen.queryByText(/Datenschutzbeauftragter:/i)).toBeNull();
  });

  it('sets document title', () => {
    render(<MemoryRouter><LanguageProvider><Privacy /></LanguageProvider></MemoryRouter>);
    expect(document.title).toContain('Privacy');
  });

  it('renders German translation on /de route', () => {
    render(
      <MemoryRouter initialEntries={['/de/legal/privacy']}>
        <LanguageProvider>
          <Privacy />
        </LanguageProvider>
      </MemoryRouter>,
    );
    expect(document.title).toContain('Datenschutzerklärung');
    expect(screen.getByText('1. Verantwortlicher & Datenschutz-Kontakt')).toBeDefined();
  });
});
