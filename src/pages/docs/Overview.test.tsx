import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { DocsOverview } from './Overview';

function renderComponent() {
  return render(
    <MemoryRouter>
      <DocsOverview />
    </MemoryRouter>
  );
}

describe('DocsOverview', () => {
  it('renders the main heading', () => {
    renderComponent();
    expect(screen.getByText('VaultScope Documentation')).toBeDefined();
  });

  it('renders description of the documentation', () => {
    renderComponent();
    expect(screen.getByText(/Clear, step-by-step guides for signing in/)).toBeDefined();
  });

  it('mentions User Login & Account', () => {
    renderComponent();
    expect(screen.getAllByText(/User Login & Account/).length).toBeGreaterThan(0);
  });

  it('mentions SFTP Storage Guide and Port 2022', () => {
    renderComponent();
    expect(screen.getAllByText(/SFTP Storage Guide/).length).toBeGreaterThan(0);
    expect(screen.getAllByText('2022').length).toBeGreaterThan(0);
    expect(screen.getByText('sftp.vaultscope.de')).toBeDefined();
  });

  it('sets document title', () => {
    renderComponent();
    expect(document.title).toBe('Documentation Overview — VaultScope');
  });
});
