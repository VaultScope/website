import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n';

describe('InfrastructureCloud', () => {
  it('renders without crashing', async () => {
    const { InfrastructureCloud } = await import('./InfrastructureCloud');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <InfrastructureCloud />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(document.body).toBeDefined();
  });

  it('sets document title', async () => {
    const { InfrastructureCloud } = await import('./InfrastructureCloud');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <InfrastructureCloud />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(document.title).toBeTruthy();
  });
});
