import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n';
import { Home } from './Home';

function renderHome() {
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <Home />
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe('Home page interactions', () => {
  it('renders hero section with pixelated typewriter heading and sleek purple highlight', () => {
    renderHome();
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeDefined();
    expect(h1.className).toContain('font-pixel');
    expect(h1.textContent).toContain('Infrastructure and Software.');
    expect(h1.textContent).toContain('Engineered together.');
  });

  it('renders Explore Services and About VaultScope CTA buttons in hero', () => {
    renderHome();
    const exploreLink = screen.getByRole('link', { name: /Explore Services/i });
    const aboutLink = screen.getByRole('link', { name: /About VaultScope/i });
    expect(exploreLink.getAttribute('href')).toContain('/infrastructure');
    expect(aboutLink.getAttribute('href')).toContain('/company/about');
  });

  it('renders low-poly 3D floating hero stack without mock hostnames or spec arrays', () => {
    renderHome();
    const stack3D = screen.getByRole('img', { name: 'VaultScope 3D Infrastructure Stack' });
    expect(stack3D).toBeDefined();
    expect(stack3D.className).toContain('pointer-events-none');
    expect(screen.queryByText('vps-eu-01')).toBeNull();
    expect(screen.queryByText('srv-eu-ded-01')).toBeNull();
    expect(screen.queryByText('VaultScope System Architecture')).toBeNull();
  });

  it('renders Section 2: Why us? and Our Principles', () => {
    renderHome();
    expect(screen.getByText('Why us?')).toBeDefined();
    expect(screen.getByText('Built on Open-Source')).toBeDefined();
    expect(screen.getByText('User friendliness')).toBeDefined();
    expect(screen.getByText('Fair Pricing')).toBeDefined();
    expect(screen.getByText('Integration')).toBeDefined();

    expect(screen.getByText('Our Principles')).toBeDefined();
    expect(screen.getByText('Transparency')).toBeDefined();
    expect(
      screen.getByText(
        /Transparency is the foundation of VaultScope\. From public pricing and hardware specifications/i
      )
    ).toBeDefined();
    expect(screen.getByText('Community')).toBeDefined();
    expect(
      screen.getByText(
        /We build VaultScope alongside the developers, system administrators, and teams/i
      )
    ).toBeDefined();
    expect(screen.getByText('Trust')).toBeDefined();
    expect(
      screen.getByText(/Trust is earned through consistency and mutual respect\./i)
    ).toBeDefined();
  });

  it('renders Section 3: Products (VPS soon, Dedicated soon, Storage SFTP only as of now)', () => {
    renderHome();
    expect(screen.getByText('Products')).toBeDefined();
    expect(screen.getByText('VPS (soon)')).toBeDefined();
    expect(screen.getByText('Dedicated (soon)')).toBeDefined();
    expect(screen.getByText('Storage (SFTP only as of now)')).toBeDefined();
  });

  it('renders Section 4: Open-Source Software with Vamos and Camos only', () => {
    renderHome();
    expect(
      screen.getByText(
        /VaultScope engineers its own software stack alongside proven open-source technologies/i
      )
    ).toBeDefined();
    expect(screen.getByText('Vamos')).toBeDefined();
    expect(screen.getByText('Camos')).toBeDefined();
    expect(screen.queryByText('Pegasus')).toBeNull();
  });

  it('allows switching catalog category filter buttons', async () => {
    renderHome();
    const user = userEvent.setup();

    const tabButtons = screen.getAllByRole('button');
    const dedButton = tabButtons.find((b) => b.textContent === 'Dedicated');
    const vpsButton = tabButtons.find((b) => b.textContent === 'Cloud VPS');

    expect(dedButton).toBeDefined();
    expect(vpsButton).toBeDefined();

    if (dedButton) {
      await user.click(dedButton);
      expect(dedButton.className).toContain('bg-[var(--accent-subtle)]');
    }
    if (vpsButton) {
      await user.click(vpsButton);
      expect(vpsButton.className).toContain('bg-[var(--accent-subtle)]');
    }
  });

  it('renders Newsletter section and contact link', async () => {
    renderHome();
    expect(screen.getByText('Newsletter')).toBeDefined();
    expect(await screen.findByText(/Subscribe to our newsletter/i)).toBeDefined();
    const links = screen.getAllByRole('link');
    const contactLink = links.find((l) => l.getAttribute('href')?.includes('/contact'));
    expect(contactLink).toBeDefined();
  });
});
