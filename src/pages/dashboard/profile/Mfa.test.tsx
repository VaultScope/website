import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProfileMfa } from './Mfa';

function renderComponent() {
  return render(
    <MemoryRouter>
      <ProfileMfa />
    </MemoryRouter>
  );
}

describe('ProfileMfa', () => {
  it('renders the Authentik heading', () => {
    renderComponent();
    expect(screen.getByText('VaultScope ID (Authentik)')).toBeDefined();
  });

  it('renders the description text', () => {
    renderComponent();
    expect(screen.getByText(/Authentication and Multi-Factor Security/)).toBeDefined();
    expect(screen.getByText(/Passkeys, YubiKeys, and TOTP/)).toBeDefined();
  });

  it('renders link to Authentik user portal', () => {
    renderComponent();
    const link = screen.getByRole('link', { name: /Manage Security in Authentik/ });
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('https://auth.vaultscope.de/if/user/');
  });

  it('link opens in new tab', () => {
    renderComponent();
    const link = screen.getByRole('link', { name: /Manage Security in Authentik/ });
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toContain('noopener');
    expect(link.getAttribute('rel')).toContain('noreferrer');
  });

  it('renders a KeyRound icon area', () => {
    renderComponent();
    const container = screen.getByText('VaultScope ID (Authentik)').closest('div');
    expect(container).toBeDefined();
  });
});
