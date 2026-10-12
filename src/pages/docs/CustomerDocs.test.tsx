import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { GettingStarted } from './customer/GettingStarted';
import { VpsGuide } from './customer/VpsGuide';
import { SftpGuide } from './customer/SftpGuide';
import { DedicatedGuide } from './customer/DedicatedGuide';
import { BillingGuide } from './customer/BillingGuide';
import { SupportGuide } from './customer/SupportGuide';

describe('Customer Documentation Suite', () => {
  it('renders GettingStarted guide', () => {
    render(
      <MemoryRouter>
        <GettingStarted />
      </MemoryRouter>
    );
    expect(screen.getByText('Getting Started & Account Security')).toBeDefined();
    expect(screen.getAllByText(/Two-Factor Authentication/).length).toBeGreaterThan(0);
  });

  it('renders VpsGuide guide', () => {
    render(
      <MemoryRouter>
        <VpsGuide />
      </MemoryRouter>
    );
    expect(screen.getByText('Cloud VPS Management Guide')).toBeDefined();
    expect(screen.getAllByText(/Interactive In-Browser noVNC Console/).length).toBeGreaterThan(0);
  });

  it('renders SftpGuide guide', () => {
    render(
      <MemoryRouter>
        <SftpGuide />
      </MemoryRouter>
    );
    expect(screen.getByText('Sovereign SFTP Storage Guide')).toBeDefined();
    expect(screen.getAllByText(/FileZilla Setup Guide/).length).toBeGreaterThan(0);
  });

  it('renders DedicatedGuide guide', () => {
    render(
      <MemoryRouter>
        <DedicatedGuide />
      </MemoryRouter>
    );
    expect(screen.getByText('Dedicated Bare-Metal Servers Guide')).toBeDefined();
    expect(screen.getAllByText(/Out-of-Band IPMI \/ KVM Access/).length).toBeGreaterThan(0);
  });

  it('renders BillingGuide guide', () => {
    render(
      <MemoryRouter>
        <BillingGuide />
      </MemoryRouter>
    );
    expect(screen.getByText('Billing, VAT & GoBD Invoices Guide')).toBeDefined();
    expect(screen.getAllByText(/GoBD & DIN 5008 Compliance/).length).toBeGreaterThan(0);
  });

  it('renders SupportGuide guide', () => {
    render(
      <MemoryRouter>
        <SupportGuide />
      </MemoryRouter>
    );
    expect(screen.getByText('Support Desk & SLAs Guide')).toBeDefined();
    expect(screen.getAllByText(/Diagnostic File Attachments \(10MB Limit\)/).length).toBeGreaterThan(0);
  });
});
