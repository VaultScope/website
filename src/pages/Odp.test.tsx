import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n';

describe('Odp', () => {
  it('renders without crashing', async () => {
    const { Odp } = await import('./Odp');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <Odp />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(document.body).toBeDefined();
  });

  it('sets document title', async () => {
    const { Odp } = await import('./Odp');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <Odp />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(document.title).toBeTruthy();
  });
});
