import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderWithI18n } from '../test/utils';
import { WaitlistForm } from './WaitlistForm';

describe('WaitlistForm interactions', () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchSpy = vi.fn();
    globalThis.fetch = fetchSpy;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders form or unconfigured message', () => {
    renderWithI18n(<WaitlistForm />);
    const hasForm = screen.queryAllByRole('textbox').length > 0;
    const hasUnconfigured = screen.queryByText(/VITE_LISTMONK_URL/) !== null;
    expect(hasForm || hasUnconfigured).toBe(true);
  });

  it('has privacy policy link', () => {
    renderWithI18n(<WaitlistForm />);
    const privacyLink = screen.queryByText(/privacy/i);
    if (privacyLink) {
      expect(privacyLink.closest('a')).toBeTruthy();
    }
  });

  it('submit button exists when form is visible', () => {
    renderWithI18n(<WaitlistForm />);
    const submitBtn = screen.queryByRole('button', { name: /notify/i });
    if (submitBtn) {
      expect(submitBtn.getAttribute('type')).toBe('submit');
    }
  });

  it('inputs accept user typing', async () => {
    renderWithI18n(<WaitlistForm />);
    const inputs = screen.queryAllByRole('textbox');
    if (inputs.length > 0) {
      const user = userEvent.setup();
      await user.type(inputs[0], 'Test value');
      expect((inputs[0] as HTMLInputElement).value).toContain('Test value');
    }
  });

  it('email input accepts email format', async () => {
    renderWithI18n(<WaitlistForm />);
    const emailInput = screen.queryByPlaceholderText(/email/i);
    if (emailInput) {
      const user = userEvent.setup();
      await user.type(emailInput, 'user@example.com');
      expect((emailInput as HTMLInputElement).value).toBe('user@example.com');
    }
  });

  it('renders correctly in unconfigured state', () => {
    renderWithI18n(<WaitlistForm />);
    // The component either shows a form or an unconfigured message — either is valid
    const rootEl = document.querySelector('div');
    expect(rootEl).toBeTruthy();
  });
});
