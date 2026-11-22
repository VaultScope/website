import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Cancellation } from './Cancellation';
import { LanguageProvider } from '../i18n';

describe('Cancellation', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><LanguageProvider><Cancellation /></LanguageProvider></MemoryRouter>);
    expect(document.body).toBeDefined();
  });

  it('sets document title', () => {
    render(<MemoryRouter><LanguageProvider><Cancellation /></LanguageProvider></MemoryRouter>);
    expect(document.title).toContain('Cancellation');
  });

  it('renders German translation on /de route', () => {
    render(
      <MemoryRouter initialEntries={['/de/legal/cancellation']}>
        <LanguageProvider>
          <Cancellation />
        </LanguageProvider>
      </MemoryRouter>,
    );
    expect(document.title).toContain('Widerrufsbelehrung');
    expect(screen.getAllByText('Muster-Widerrufsformular').length).toBeGreaterThan(0);
  });
});
