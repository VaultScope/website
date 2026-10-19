import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { GettingStarted } from './customer/GettingStarted';
import { SftpGuide } from './customer/SftpGuide';

describe('Customer Documentation Suite', () => {
  it('renders GettingStarted (User Login & Account) guide', () => {
    render(
      <MemoryRouter>
        <GettingStarted />
      </MemoryRouter>
    );
    expect(screen.getByText('User Login & Account Guide')).toBeDefined();
    expect(screen.getAllByText(/Two-Factor Authentication/).length).toBeGreaterThan(0);
  });

  it('renders SftpGuide guide', () => {
    render(
      <MemoryRouter>
        <SftpGuide />
      </MemoryRouter>
    );
    expect(screen.getByText('SFTP Storage Guide')).toBeDefined();
    expect(screen.getAllByText(/2022/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Built-in Web File Manager/).length).toBeGreaterThan(0);
  });
});
