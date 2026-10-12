import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { StorefrontInstall } from './storefront/StorefrontInstall';
import { StorefrontConfig } from './storefront/StorefrontConfig';
import { StorefrontLifecycle } from './storefront/StorefrontLifecycle';
import { VamosInstall } from './vamos/VamosInstall';
import { VamosConfig } from './vamos/VamosConfig';
import { VamosLifecycle } from './vamos/VamosLifecycle';
import { CamosInstall } from './camos/CamosInstall';
import { CamosConfig } from './camos/CamosConfig';
import { CamosLifecycle } from './camos/CamosLifecycle';
import { DocsArchitecture } from './Architecture';
import { DocsAuthentikGuide } from './AuthentikGuide';
import { DocsApiReference } from './ApiReference';
import { DocsRunbooks } from './Runbooks';

describe('Storefront Subpages', () => {
  it('renders StorefrontInstall', () => {
    render(<MemoryRouter><StorefrontInstall /></MemoryRouter>);
    expect(screen.getByText('Storefront Installation')).toBeDefined();
    expect(document.title).toContain('Storefront Installation');
  });

  it('renders StorefrontConfig', () => {
    render(<MemoryRouter><StorefrontConfig /></MemoryRouter>);
    expect(screen.getByText('Storefront Configuration')).toBeDefined();
    expect(document.title).toContain('Storefront Configuration');
  });

  it('renders StorefrontLifecycle', () => {
    render(<MemoryRouter><StorefrontLifecycle /></MemoryRouter>);
    expect(screen.getByText('Storefront Maintenance & Lifecycle')).toBeDefined();
    expect(document.title).toContain('Storefront Lifecycle');
  });
});

describe('VAMOS Subpages', () => {
  it('renders VamosInstall', () => {
    render(<MemoryRouter><VamosInstall /></MemoryRouter>);
    expect(screen.getByText('VAMOS Installation')).toBeDefined();
    expect(document.title).toContain('VAMOS Installation');
  });

  it('renders VamosConfig', () => {
    render(<MemoryRouter><VamosConfig /></MemoryRouter>);
    expect(screen.getByText('VAMOS Configuration')).toBeDefined();
    expect(document.title).toContain('VAMOS Configuration');
  });

  it('renders VamosLifecycle', () => {
    render(<MemoryRouter><VamosLifecycle /></MemoryRouter>);
    expect(screen.getByText('VAMOS Maintenance & Migrations')).toBeDefined();
    expect(document.title).toContain('VAMOS Lifecycle');
  });
});

describe('CAMOS Subpages', () => {
  it('renders CamosInstall', () => {
    render(<MemoryRouter><CamosInstall /></MemoryRouter>);
    expect(screen.getByText('CAMOS Installation')).toBeDefined();
    expect(document.title).toContain('CAMOS Installation');
  });

  it('renders CamosConfig', () => {
    render(<MemoryRouter><CamosConfig /></MemoryRouter>);
    expect(screen.getByText('CAMOS Configuration')).toBeDefined();
    expect(document.title).toContain('CAMOS Configuration');
  });

  it('renders CamosLifecycle', () => {
    render(<MemoryRouter><CamosLifecycle /></MemoryRouter>);
    expect(screen.getByText('CAMOS Maintenance & Lifecycle')).toBeDefined();
    expect(document.title).toContain('CAMOS Lifecycle');
  });
});

describe('Core Architecture & Guides', () => {
  it('renders DocsArchitecture', () => {
    render(<MemoryRouter><DocsArchitecture /></MemoryRouter>);
    expect(screen.getByText('System Architecture & Data Flow')).toBeDefined();
    expect(document.title).toContain('System Architecture');
  });

  it('renders DocsAuthentikGuide', () => {
    render(<MemoryRouter><DocsAuthentikGuide /></MemoryRouter>);
    expect(screen.getByText('Authentik OIDC Single Sign-On')).toBeDefined();
    expect(document.title).toContain('Authentik');
  });

  it('renders DocsApiReference', () => {
    render(<MemoryRouter><DocsApiReference /></MemoryRouter>);
    expect(screen.getByText('VAMOS REST API Reference')).toBeDefined();
    expect(document.title).toContain('API Reference');
  });

  it('renders DocsRunbooks', () => {
    render(<MemoryRouter><DocsRunbooks /></MemoryRouter>);
    expect(screen.getByText('Production Operations Runbooks')).toBeDefined();
    expect(document.title).toContain('Production Operations Runbooks');
  });
});
