import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProfileLayout } from './Layout';

function renderComponent(route = '/dashboard/profile') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ProfileLayout />
    </MemoryRouter>
  );
}

describe('ProfileLayout', () => {
  it('renders the page title', () => {
    renderComponent();
    expect(screen.getByText('Profile & Settings')).toBeDefined();
  });

  it('renders the subtitle', () => {
    renderComponent();
    expect(screen.getByText('Account, security, and billing.')).toBeDefined();
  });

  it('renders all 4 tab links', () => {
    renderComponent();
    expect(screen.getByText('Account')).toBeDefined();
    expect(screen.getByText('Security')).toBeDefined();
    expect(screen.getByText('Billing')).toBeDefined();
    expect(screen.getByText('Activity')).toBeDefined();
  });

  it('Account tab links to /dashboard/profile', () => {
    renderComponent();
    const link = screen.getByText('Account').closest('a');
    expect(link?.getAttribute('href')).toBe('/dashboard/profile');
  });

  it('Security tab links to /dashboard/profile/mfa', () => {
    renderComponent();
    const link = screen.getByText('Security').closest('a');
    expect(link?.getAttribute('href')).toBe('/dashboard/profile/mfa');
  });

  it('Billing tab links to /dashboard/profile/billing', () => {
    renderComponent();
    const link = screen.getByText('Billing').closest('a');
    expect(link?.getAttribute('href')).toBe('/dashboard/profile/billing');
  });

  it('Activity tab links to /dashboard/profile/logs', () => {
    renderComponent();
    const link = screen.getByText('Activity').closest('a');
    expect(link?.getAttribute('href')).toBe('/dashboard/profile/logs');
  });

  it('applies active styling to Account tab when on profile route', () => {
    renderComponent('/dashboard/profile');
    const link = screen.getByText('Account').closest('a');
    expect(link?.className).toContain('border-foreground');
  });

  it('applies active styling to Security tab when on mfa route', () => {
    renderComponent('/dashboard/profile/mfa');
    const link = screen.getByText('Security').closest('a');
    expect(link?.className).toContain('border-foreground');
  });

  it('non-active tabs have transparent border', () => {
    renderComponent('/dashboard/profile');
    const billingLink = screen.getByText('Billing').closest('a');
    expect(billingLink?.className).toContain('border-transparent');
  });
});
