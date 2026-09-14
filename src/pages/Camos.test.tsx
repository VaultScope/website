import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n';

describe('Camos', () => {
  it('renders without crashing', async () => {
    const { Camos } = await import('./Camos');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <Camos />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(document.body).toBeDefined();
  });

  it('sets document title', async () => {
    const { Camos } = await import('./Camos');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <Camos />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(document.title).toBeTruthy();
  });
});
