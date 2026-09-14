import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n';

describe('Vamos', () => {
  it('renders without crashing', async () => {
    const { Vamos } = await import('./Vamos');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <Vamos />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(document.body).toBeDefined();
  });

  it('sets document title', async () => {
    const { Vamos } = await import('./Vamos');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <Vamos />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(document.title).toBeTruthy();
  });
});
