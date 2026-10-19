import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n';

describe('Odp', () => {
  it('renders without crashing and displays the background catalog of self-hostable apps', async () => {
    const { Odp } = await import('./Odp');
    render(
      <MemoryRouter>
        <LanguageProvider>
          <Odp />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(document.body).toBeDefined();
    const bgCatalog = screen.getByTestId('self-hosted-apps-catalog-bg');
    expect(bgCatalog).toBeInTheDocument();
    expect(bgCatalog).toHaveTextContent('Nextcloud Hub');
    expect(bgCatalog).toHaveTextContent('Vaultwarden');
    expect(bgCatalog).toHaveTextContent('PostgreSQL');
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
