import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n';

describe('Projects', () => {
  it('renders without crashing', async () => {
    const { Projects } = await import('./Projects');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <Projects />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(document.body).toBeDefined();
  });

  it('sets document title', async () => {
    const { Projects } = await import('./Projects');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <Projects />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(document.title).toBeTruthy();
  });
});
