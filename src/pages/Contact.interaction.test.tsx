import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n';
import { Contact } from './Contact';

function renderContact() {
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <Contact />
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe('Contact page interactions', () => {
  it('renders all contact email addresses', () => {
    renderContact();
    expect(screen.getByText('support@vaultscope.de')).toBeDefined();
    expect(screen.getByText('billing@vaultscope.de')).toBeDefined();
    expect(screen.getByText('data@vaultscope.de')).toBeDefined();
    expect(screen.getByText('dmca@vaultscope.de')).toBeDefined();
    expect(screen.getByText('opensource@vaultscope.de')).toBeDefined();
    expect(screen.getByText('partner@vaultscope.de')).toBeDefined();
    expect(screen.getByText('pegasus@vaultscope.de')).toBeDefined();
  });

  it('renders correct mailto: links', () => {
    renderContact();
    const supportLink = screen.getByText('support@vaultscope.de');
    expect(supportLink.closest('a')?.getAttribute('href')).toBe('mailto:support@vaultscope.de');

    const billingLink = screen.getByText('billing@vaultscope.de');
    expect(billingLink.closest('a')?.getAttribute('href')).toBe('mailto:billing@vaultscope.de');
  });

  it('renders contact department labels', () => {
    renderContact();
    expect(screen.getByText('Technical Support')).toBeDefined();
    expect(screen.getByText('Billing & Sales')).toBeDefined();
    expect(screen.getByText('Data & Privacy')).toBeDefined();
    expect(screen.getByText('Open Source')).toBeDefined();
    expect(screen.getByText('Partnerships')).toBeDefined();
  });

  it('renders department descriptions', () => {
    renderContact();
    expect(screen.getByText(/help with your instances/i)).toBeDefined();
    expect(screen.getByText(/invoice and payment/i)).toBeDefined();
    expect(screen.getByText(/GDPR and data removal/i)).toBeDefined();
  });

  it('renders external links with target blank', () => {
    renderContact();
    const statusLink = screen.getByText(/Service Status/i).closest('a');
    expect(statusLink?.getAttribute('target')).toBe('_blank');
    expect(statusLink?.getAttribute('href')).toContain('status.vaultscope.de');

    const githubLink = screen.getByText(/GitHub/i).closest('a');
    expect(githubLink?.getAttribute('target')).toBe('_blank');
    expect(githubLink?.getAttribute('href')).toContain('github.com');
  });

  it('renders documentation link', () => {
    renderContact();
    const docsLink = screen.getByText(/Documentation/i).closest('a');
    expect(docsLink?.getAttribute('href')).toContain('docs');
  });

  it('renders imprint link without target blank', () => {
    renderContact();
    const imprintLink = screen.getByText(/Imprint/i).closest('a');
    expect(imprintLink?.getAttribute('target')).toBeNull();
    expect(imprintLink?.getAttribute('href')).toContain('/legal/imprint');
  });

  it('renders waitlist form section', () => {
    renderContact();
    // The waitlist section contains a WaitlistForm component
    // Check for the section heading or form presence
    const headings = screen.getAllByRole('heading');
    const hasWaitlistHeading = headings.some(h => h.textContent?.toLowerCase().includes('notif') || h.textContent?.toLowerCase().includes('launch'));
    const hasForm = document.querySelector('form') !== null;
    const hasViteEnvText = screen.queryByText(/VITE_LISTMONK/) !== null;
    expect(hasWaitlistHeading || hasForm || hasViteEnvText).toBe(true);
  });

  it('sets document title', () => {
    renderContact();
    expect(document.title).toBeTruthy();
  });
});
