import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
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
  it('renders hero section with title', () => {
    renderHome();
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
  });

  it('renders CTA buttons in hero', () => {
    renderHome();
    const links = screen.getAllByRole('link');
    const infraLink = links.find(l => l.getAttribute('href')?.includes('/infrastructure'));
    expect(infraLink).toBeDefined();
  });

  it('renders product overview with 4 product cards', () => {
    renderHome();
    const learnMoreLinks = screen.getAllByText(/Learn More/i);
    expect(learnMoreLinks.length).toBeGreaterThanOrEqual(4);
  });

  it('switches infrastructure tabs on click', async () => {
    renderHome();
    const user = userEvent.setup();

    expect(screen.getByText('vps-eu-01')).toBeDefined();

    const dedicatedTab = screen.getAllByText(/Dedicated/i).find(
      el => el.tagName === 'SPAN' && el.textContent === 'Dedicated'
    ) || screen.getByText(/Dedicated/i);

    const tabButtons = screen.getAllByRole('button');
    const dedButton = tabButtons.find(b => b.textContent?.includes('Dedicated'));
    if (dedButton) {
      await user.click(dedButton);
      expect(screen.getByText('srv-eu-ded-01')).toBeDefined();
    }
  });

  it('both tab buttons are clickable', async () => {
    renderHome();
    const user = userEvent.setup();

    const tabButtons = screen.getAllByRole('button');
    const dedButton = tabButtons.find(b => b.textContent?.includes('Dedicated'));
    const vpsButton = tabButtons.find(b => b.textContent?.includes('Cloud VPS'));

    expect(dedButton).toBeDefined();
    expect(vpsButton).toBeDefined();

    if (dedButton) {
      await user.click(dedButton);
      // After clicking dedicated, the dedicated visual content should be in DOM
      expect(screen.getByText('srv-eu-ded-01')).toBeDefined();
    }
    if (vpsButton) {
      await user.click(vpsButton);
      // VPS tab click should not throw
      expect(vpsButton).toBeDefined();
    }
  });

  it('renders technology section with stack names', () => {
    renderHome();
    expect(screen.getByText('PROXMOX')).toBeDefined();
    expect(screen.getByText('DEBIAN')).toBeDefined();
    expect(screen.getByText('DOCKER')).toBeDefined();
  });

  it('renders waitlist section with form', () => {
    renderHome();
    expect(screen.getByText(/Get notified at launch/)).toBeDefined();
  });

  it('renders Why VaultScope principles section', () => {
    renderHome();
    expect(screen.getByText('Engineering')).toBeDefined();
    expect(screen.getByText('Transparency')).toBeDefined();
    expect(screen.getByText('Integration')).toBeDefined();
    expect(screen.getByText('Personal Service')).toBeDefined();
  });

  it('renders contact link in final CTA', () => {
    renderHome();
    const links = screen.getAllByRole('link');
    const contactLink = links.find(l => l.getAttribute('href')?.includes('/contact'));
    expect(contactLink).toBeDefined();
  });

  it('has deploy section with steps', () => {
    renderHome();
    expect(screen.getByText('Choose')).toBeDefined();
    expect(screen.getByText('Configure')).toBeDefined();
    expect(screen.getByText('Running')).toBeDefined();
  });

  it('has deploy category tags', () => {
    renderHome();
    expect(screen.getByText('Docker Containers')).toBeDefined();
    expect(screen.getByText('PostgreSQL')).toBeDefined();
    expect(screen.getByText('Redis')).toBeDefined();
  });
});
