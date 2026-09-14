import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n';

describe('InfrastructureManaged', () => {
  it('renders without crashing', async () => {
    const { InfrastructureManaged } = await import('./InfrastructureManaged');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <InfrastructureManaged />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(document.body).toBeDefined();
  });

  it('sets document title', async () => {
    const { InfrastructureManaged } = await import('./InfrastructureManaged');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <InfrastructureManaged />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(document.title).toBeTruthy();
  });
});
