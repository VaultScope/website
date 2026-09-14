import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n';

describe('Home', () => {
  it('renders without crashing', async () => {
    const { Home } = await import('./Home');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <Home />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(document.body).toBeDefined();
  });
});
