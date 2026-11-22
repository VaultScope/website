import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Imprint } from './Imprint';
import { LanguageProvider } from '../i18n';

describe('Imprint', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><LanguageProvider><Imprint /></LanguageProvider></MemoryRouter>);
    expect(document.body).toBeDefined();
    expect(screen.queryByText(/Data Protection Officer \(Datenschutzbeauftragter\)/i)).toBeNull();
  });

  it('sets document title', () => {
    render(<MemoryRouter><LanguageProvider><Imprint /></LanguageProvider></MemoryRouter>);
    expect(document.title).toContain('Imprint');
  });

  it('renders German translation and DSA contact on /de route', () => {
    render(
      <MemoryRouter initialEntries={['/de/legal/imprint']}>
        <LanguageProvider>
          <Imprint />
        </LanguageProvider>
      </MemoryRouter>,
    );
    expect(document.title).toContain('Impressum');
    expect(screen.getAllByText(/Digital Services Act/i).length).toBeGreaterThan(0);
  });
});
