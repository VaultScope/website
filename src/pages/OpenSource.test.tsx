import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n';

describe('OpenSource', () => {
  it('renders without crashing', async () => {
    const { OpenSource } = await import('./OpenSource');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <OpenSource />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(document.body).toBeDefined();
  });

  it('sets document title', async () => {
    const { OpenSource } = await import('./OpenSource');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <OpenSource />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(document.title).toBeTruthy();
  });
});
