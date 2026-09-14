import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n';

describe('Hosting', () => {
  it('renders without crashing', async () => {
    const { Hosting } = await import('./Hosting');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <Hosting />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(document.body).toBeDefined();
  });

  it('sets document title', async () => {
    const { Hosting } = await import('./Hosting');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <Hosting />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(document.title).toBeTruthy();
  });
});
