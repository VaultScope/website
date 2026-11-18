import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProfileMfa } from './Mfa';
import { api } from '../../../lib/api';

vi.mock('../../../lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

function renderComponent() {
  return render(
    <MemoryRouter>
      <ProfileMfa />
    </MemoryRouter>
  );
}

describe('ProfileMfa', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders disabled state when 2FA is inactive', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ two_factor_enabled: false });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Two-Factor Authentication (TOTP)')).toBeDefined();
    });

    expect(screen.getByText('Set up 2FA')).toBeDefined();
    expect(screen.getByText(/Protect your VaultScope account and cloud infrastructure/)).toBeDefined();
  });

  it('renders active state when 2FA is enabled', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ two_factor_enabled: true });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Two-Factor Authentication (TOTP)')).toBeDefined();
    });

    expect(screen.getByText('Disable 2FA')).toBeDefined();
    expect(screen.getByText(/Your account is actively protected/)).toBeDefined();
  });

  it('renders QR code image, manual secret, cancel button, and recovery codes during setup', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ two_factor_enabled: false });
    vi.mocked(api.post)
      .mockResolvedValueOnce({
        secret: 'JBSWY3DPEHPK3PXP',
        qr_base64: 'iVBORw0KGgoAAAANSUhEUg==',
      })
      .mockResolvedValueOnce({
        recovery_codes: ['AAAA-BBBB', 'CCCC-DDDD'],
      });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Set up 2FA')).toBeDefined();
    });

    fireEvent.click(screen.getByText('Set up 2FA'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/storefront/profile/mfa/setup');
      const qrImg = screen.getByAltText('TOTP QR Code') as HTMLImageElement;
      expect(qrImg.src).toContain('data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==');
      expect(screen.getByText('JBSWY3DPEHPK3PXP')).toBeDefined();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeDefined();
    });

    const codeInput = screen.getByLabelText('6-digit authenticator verification code');
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Verify & Enable' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/storefront/profile/mfa/enable', { code: '123456' });
      expect(screen.getByText('Save Your Emergency Recovery Codes')).toBeDefined();
      expect(screen.getByText('AAAA-BBBB')).toBeDefined();
      expect(screen.getByText('CCCC-DDDD')).toBeDefined();
    });
  });

  it('cancels 2FA setup when Cancel button is clicked', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ two_factor_enabled: false });
    vi.mocked(api.post).mockResolvedValueOnce({
      secret: 'JBSWY3DPEHPK3PXP',
      qr_url: 'data:image/png;base64,QUJDREVGRw==',
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Set up 2FA')).toBeDefined();
    });

    fireEvent.click(screen.getByText('Set up 2FA'));

    await waitFor(() => {
      expect(screen.getByAltText('TOTP QR Code')).toBeDefined();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByAltText('TOTP QR Code')).toBeNull();
    expect(screen.getByText('Set up 2FA')).toBeDefined();
  });
});
