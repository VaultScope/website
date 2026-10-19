import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from '../i18n';
import { Register } from './Register';

function renderRegister() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/register']}>
        <LanguageProvider>
          <Register />
        </LanguageProvider>
      </MemoryRouter>
    </HelmetProvider>,
  );
}

describe('Register page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders account credentials, billing address with autofill attributes, company, and EU VAT ID fields', () => {
    renderRegister();

    expect(screen.getByLabelText(/Username/i)).toBeDefined();
    expect(screen.getByLabelText(/Full Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Email/i)).toBeDefined();

    const streetInput = screen.getByLabelText(/Street Address/i) as HTMLInputElement;
    const postalInput = screen.getByLabelText(/Postal Code/i) as HTMLInputElement;
    const cityInput = screen.getByLabelText(/City/i) as HTMLInputElement;
    const countrySelect = screen.getByLabelText(/Country/i) as HTMLSelectElement;
    const companyInput = screen.getByLabelText(/Company/i) as HTMLInputElement;
    const vatInput = screen.getByLabelText(/EU VAT ID/i) as HTMLInputElement;

    expect(streetInput.getAttribute('autocomplete')).toBe('street-address');
    expect(postalInput.getAttribute('autocomplete')).toBe('postal-code');
    expect(cityInput.getAttribute('autocomplete')).toBe('address-level2');
    expect(countrySelect.getAttribute('autocomplete')).toBe('country');
    expect(companyInput.getAttribute('autocomplete')).toBe('organization');
    expect(vatInput).toBeDefined();
  });

  it('autofills street address, postal code, city, and country when selecting an address suggestion', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [
        {
          display_name: 'Friedrichstraße 123, 10117 Berlin, Germany',
          address: {
            road: 'Friedrichstraße',
            house_number: '123',
            postcode: '10117',
            city: 'Berlin',
            country_code: 'de',
          },
        },
      ],
    } as Response);

    renderRegister();

    const streetInput = screen.getByLabelText(/Street Address/i) as HTMLInputElement;
    await act(async () => {
      fireEvent.change(streetInput, { target: { value: 'Friedrichstraße 123' } });
    });

    await waitFor(
      () => {
        expect(fetchMock).toHaveBeenCalled();
        expect(screen.getByText('Friedrichstraße 123')).toBeDefined();
      },
      { timeout: 1500 },
    );

    const suggestionBtn = screen.getByText('Friedrichstraße 123');
    await act(async () => {
      fireEvent.click(suggestionBtn);
    });

    expect((screen.getByLabelText(/Street Address/i) as HTMLInputElement).value).toBe(
      'Friedrichstraße 123',
    );
    expect((screen.getByLabelText(/Postal Code/i) as HTMLInputElement).value).toBe('10117');
    expect((screen.getByLabelText(/City/i) as HTMLInputElement).value).toBe('Berlin');
    expect(screen.getByText(/Autofilled/i)).toBeDefined();
  });

  it('submits registration payload including address, company, and VAT ID', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok' }),
    } as Response);

    renderRegister();

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'maxm' } });
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Max Mustermann' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'max@acme.de' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'SecretPass123!' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'SecretPass123!' },
    });
    fireEvent.change(screen.getByLabelText(/Street Address/i), {
      target: { value: 'Mainzer Landstraße 50' },
    });
    fireEvent.change(screen.getByLabelText(/Postal Code/i), { target: { value: '60325' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Frankfurt am Main' } });
    fireEvent.change(screen.getByLabelText(/Company/i), { target: { value: 'Acme Infrastructure GmbH' } });
    fireEvent.change(screen.getByLabelText(/EU VAT ID/i), { target: { value: 'DE123456789' } });

    const submitBtn = screen.getByRole('button', { name: /Create Account/i });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      const registerCall = fetchMock.mock.calls.find((c) =>
        String(c[0]).includes('/auth/register'),
      );
      expect(registerCall).toBeDefined();
      const body = JSON.parse((registerCall![1] as RequestInit).body as string);
      expect(body).toMatchObject({
        username: 'maxm',
        name: 'Max Mustermann',
        email: 'max@acme.de',
        address: 'Mainzer Landstraße 50',
        postal_code: '60325',
        city: 'Frankfurt am Main',
        country: 'DE',
        company: 'Acme Infrastructure GmbH',
        vat_id: 'DE123456789',
      });
    });
  });
});
