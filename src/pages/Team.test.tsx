import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n';

describe('Team', () => {
  it('renders without crashing', async () => {
    const { Team } = await import('./Team');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <Team />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(document.body).toBeDefined();
  });

  it('sets document title', async () => {
    const { Team } = await import('./Team');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <Team />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(document.title).toBeTruthy();
  });
});
