import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Loader2,
  MapPin,
  Mail,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Building2,
} from 'lucide-react';
import { Button, CustomSelect } from '../components/Shared';
import { useLanguage } from '../i18n';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { setStoredUsername } from '../lib/quickNav';

const API_BASE =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'vaultscope.de' ||
    window.location.hostname.endsWith('.vaultscope.de'))
    ? '/api'
    : import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const COUNTRIES = [
  { code: 'DE', name: 'Germany (Deutschland)' },
  { code: 'AT', name: 'Austria (Österreich)' },
  { code: 'CH', name: 'Switzerland (Schweiz)' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'FR', name: 'France' },
  { code: 'BE', name: 'Belgium' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'DK', name: 'Denmark' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'FI', name: 'Finland' },
  { code: 'PL', name: 'Poland' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
];

interface AddressSuggestion {
  display: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
}

export function Register() {
  const navigate = useNavigate();
  const { locale, localePath } = useLanguage();
  const isDe = locale === 'de';

  useDocumentMeta({
    title: isDe ? 'Konto erstellen — VaultScope' : 'Create Account — VaultScope',
    description: isDe
      ? 'Erstellen Sie Ihr VaultScope-Infrastrukturkonto.'
      : 'Create your VaultScope infrastructure account.',
  });

  const [step, setStep] = useState<'form' | 'verify_notice'>('form');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    name: '',
    company: '',
    address: '',
    postal_code: '',
    city: '',
    country: 'DE',
    phone: '',
    vat_id: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect) {
      sessionStorage.setItem('vs_redirect', redirect);
    }
  }, []);

  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [isAddressVerified, setIsAddressVerified] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addressContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        addressContainerRef.current &&
        !addressContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError('');
    if (key === 'address') {
      setIsAddressVerified(false);
      handleAddressSearch(value, form.country);
    }
    if (key === 'country') {
      setIsAddressVerified(false);
      if (form.address) handleAddressSearch(form.address, value);
    }
  };

  const handleAddressSearch = (query: string, countryCode: string) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!query || query.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSearchingAddress(true);
        let parsedItems: AddressSuggestion[] = [];

        // Primary lookup via OpenStreetMap Nominatim with country filter
        try {
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query.trim(),
          )}&format=json&addressdetails=1&limit=5&countrycodes=${countryCode.toLowerCase()}`;
          const res = await fetch(url, { headers: { 'Accept-Language': isDe ? 'de,en' : 'en,de' } });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              parsedItems = data
                .map((item: any) => {
                  const addr = item.address || {};
                  const street =
                    [addr.road || addr.pedestrian || addr.footway, addr.house_number]
                      .filter(Boolean)
                      .join(' ') || item.name || '';
                  const city =
                    addr.city ||
                    addr.town ||
                    addr.village ||
                    addr.municipality ||
                    addr.suburb ||
                    '';
                  const postalCode = addr.postcode || '';
                  const country = (addr.country_code || countryCode).toUpperCase();
                  return {
                    display: item.display_name || street,
                    street,
                    city,
                    postal_code: postalCode,
                    country,
                  };
                })
                .filter((item: AddressSuggestion) => Boolean(item.street));
            }
          }
        } catch {
          // Fallback to Photon below if Nominatim fails
        }

        // Fallback to Komoot Photon geocoder if Nominatim returned no results
        if (parsedItems.length === 0) {
          const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(
            query.trim(),
          )}&limit=5&lang=${isDe ? 'de' : 'en'}`;
          const photonRes = await fetch(photonUrl);
          if (photonRes.ok) {
            const photonData = await photonRes.json();
            if (Array.isArray(photonData?.features)) {
              parsedItems = photonData.features
                .map((f: any) => {
                  const p = f.properties || {};
                  const street = p.street
                    ? [p.street, p.housenumber].filter(Boolean).join(' ')
                    : p.name || '';
                  const city = p.city || p.town || p.locality || '';
                  const postalCode = p.postcode || '';
                  const country = (p.countrycode || countryCode).toUpperCase();
                  return {
                    display: [street, postalCode, city, country].filter(Boolean).join(', '),
                    street,
                    city,
                    postal_code: postalCode,
                    country,
                  };
                })
                .filter((item: AddressSuggestion) => Boolean(item.street));
            }
          }
        }

        setSuggestions(parsedItems);
        setShowSuggestions(parsedItems.length > 0);
      } catch {
        // Ignore network errors gracefully
      } finally {
        setIsSearchingAddress(false);
      }
    }, 300);
  };

  const selectSuggestion = (s: AddressSuggestion) => {
    setForm((prev) => ({
      ...prev,
      address: s.street,
      city: s.city || prev.city,
      postal_code: s.postal_code || prev.postal_code,
      country: s.country || prev.country,
    }));
    setSuggestions([]);
    setShowSuggestions(false);
    setIsAddressVerified(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim()) {
      setError(isDe ? 'Benutzername ist erforderlich.' : 'Username is required.');
      return;
    }
    if (!form.name.trim()) {
      setError(isDe ? 'Vollständiger Name ist erforderlich.' : 'Full name is required.');
      return;
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      setError(isDe ? 'Gültige E-Mail-Adresse ist erforderlich.' : 'Valid email is required.');
      return;
    }
    if (form.password.length < 8) {
      setError(
        isDe
          ? 'Das Passwort muss mindestens 8 Zeichen lang sein.'
          : 'Password must be at least 8 characters.',
      );
      return;
    }
    if (form.password !== form.password_confirm) {
      setError(isDe ? 'Die Passwörter stimmen nicht überein.' : 'Passwords do not match.');
      return;
    }
    if (!form.address.trim()) {
      setError(isDe ? 'Straße und Hausnummer sind erforderlich.' : 'Street address is required.');
      return;
    }
    if (!form.postal_code.trim()) {
      setError(isDe ? 'Postleitzahl (PLZ) ist erforderlich.' : 'Postal code (PLZ) is required.');
      return;
    }
    if (!form.city.trim()) {
      setError(isDe ? 'Stadt ist erforderlich.' : 'City is required.');
      return;
    }
    if (!form.country.trim()) {
      setError(isDe ? 'Land ist erforderlich.' : 'Country is required.');
      return;
    }

    if (form.country === 'DE' && !/^[0-9]{5}$/.test(form.postal_code.trim())) {
      setError(
        isDe
          ? 'Bitte geben Sie eine gültige 5-stellige deutsche Postleitzahl ein (z. B. 10115).'
          : 'Please enter a valid 5-digit German postal code (PLZ, e.g. 10115).',
      );
      return;
    }
    if (
      (form.country === 'AT' || form.country === 'CH') &&
      !/^[0-9]{4}$/.test(form.postal_code.trim())
    ) {
      setError(
        isDe
          ? 'Bitte geben Sie eine gültige 4-stellige Postleitzahl ein (z. B. 1010).'
          : 'Please enter a valid 4-digit postal code (e.g. 1010).',
      );
      return;
    }

    if (form.vat_id.trim()) {
      const cleanVat = form.vat_id.trim().replace(/\s+/g, '').toUpperCase();
      if (form.country === 'DE' && !/^DE[0-9]{9}$/.test(cleanVat)) {
        setError(
          isDe
            ? 'Eine deutsche USt-IdNr. muss mit DE gefolgt von 9 Ziffern beginnen (z. B. DE123456789).'
            : 'German VAT ID must start with DE followed by 9 digits (e.g. DE123456789).',
        );
        return;
      }
      if (!/^[A-Z]{2}[A-Z0-9]{2,12}$/.test(cleanVat)) {
        setError(
          isDe
            ? 'Bitte geben Sie eine gültige EU-USt-IdNr. mit Ländercode ein (z. B. DE123456789).'
            : 'Please enter a valid EU VAT ID starting with a 2-letter country code (e.g. DE123456789).',
        );
        return;
      }
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
          name: form.name.trim(),
          company: form.company.trim() || undefined,
          address: form.address.trim(),
          postal_code: form.postal_code.trim() || undefined,
          city: form.city.trim(),
          country: form.country.trim(),
          phone: form.phone.trim() || undefined,
          vat_id: form.vat_id.trim().replace(/\s+/g, '').toUpperCase() || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Registration failed (${res.status})`);
      }

      setStoredUsername(form.username.trim());
      setStep('verify_notice');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendStatus(null);
    try {
      const res = await fetch(`${API_BASE}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      setResendStatus(
        data.message ||
          (isDe
            ? 'Bestätigungs-E-Mail erneut gesendet! Bitte prüfen Sie Ihren Posteingang und Spam-Ordner.'
            : 'Verification email resent! Please check your inbox and spam folder.'),
      );
    } catch {
      setResendStatus(
        isDe
          ? 'E-Mail konnte nicht erneut gesendet werden. Bitte versuchen Sie es später erneut.'
          : 'Failed to resend email. Please try again later.',
      );
    } finally {
      setResending(false);
    }
  };

  const inputCls =
    'w-full rounded-[6px] border border-[var(--line)] bg-[var(--bg-subtle)] text-[var(--fg)] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[var(--accent-bright)] focus:ring-1 focus:ring-[var(--accent-bright)]/30 transition-colors placeholder:text-[var(--fg-faint)]';
  const labelCls = 'block font-sans text-xs font-medium text-[var(--fg-muted)] mb-1.5';

  return (
    <div className="flex flex-col w-full bg-[var(--bg)] text-[var(--fg)]">
      <div className="vs-container w-full pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Account Context & Provisioning Structure */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent-bright)] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-bright)]" />
                {isDe ? 'Konto-Registrierung' : 'Account Registration'}
              </div>
              <h1 className="text-display-m text-[var(--fg)] mb-3">
                {step === 'verify_notice'
                  ? isDe
                    ? 'E-Mail-Adresse bestätigen'
                    : 'Verify your email'
                  : isDe
                    ? 'Konto erstellen'
                    : 'Create your account'}
              </h1>
              <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
                {step === 'form'
                  ? isDe
                    ? 'Erstellen Sie Ihr VaultScope-Konto für das Kunden-Dashboard, Infrastruktur-Bestellungen, Rechnungsstellung und technischen Support.'
                    : 'Register your VaultScope account to access the customer control panel, configure infrastructure orders, manage invoices, and open engineering support tickets.'
                  : isDe
                    ? 'Konto erstellt — E-Mail-Bestätigung erforderlich, um alle Funktionen freizuschalten.'
                    : 'Account created — Email verification is required to activate provisioning.'}
              </p>
            </div>

            {/* Structured Section Index */}
            <div className="space-y-5">
              <div className="flex items-start gap-3.5">
                <span className="font-mono text-xs font-semibold text-[var(--accent-bright)] shrink-0 mt-0.5">
                  01
                </span>
                <div>
                  <div className="text-xs font-semibold text-[var(--fg)]">
                    {isDe ? 'Zugangsdaten & Identität' : 'Credentials & Identity'}
                  </div>
                  <p className="text-xs text-[var(--fg-muted)] mt-0.5 leading-relaxed">
                    {isDe
                      ? 'Benutzername, vollständiger Name, E-Mail-Adresse und Passwort für das Kundenportal.'
                      : 'Username, full name, primary email address, and control panel password.'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <span className="font-mono text-xs font-semibold text-[var(--accent-bright)] shrink-0 mt-0.5">
                  02
                </span>
                <div>
                  <div className="text-xs font-semibold text-[var(--fg)]">
                    {isDe ? 'Rechnungsadresse & Autofill' : 'Billing Address & Autofill'}
                  </div>
                  <p className="text-xs text-[var(--fg-muted)] mt-0.5 leading-relaxed">
                    {isDe
                      ? 'Erforderlich für rechtskonforme Rechnungen und Steuerberechnung innerhalb der EU.'
                      : 'Required for compliant invoicing and tax jurisdiction determination.'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <span className="font-mono text-xs font-semibold text-[var(--fg-muted)] shrink-0 mt-0.5">
                  03
                </span>
                <div>
                  <div className="text-xs font-semibold text-[var(--fg)]">
                    {isDe ? 'Unternehmen & EU-USt-IdNr.' : 'Company & EU VAT ID'}
                  </div>
                  <p className="text-xs text-[var(--fg-muted)] mt-0.5 leading-relaxed">
                    {isDe
                      ? 'Optional für Geschäftskunden und Reverse-Charge-Abrechnung.'
                      : 'Optional organization name and EU VAT identifier for B2B invoicing.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Jurisdiction & Existing Account Info */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--fg-muted)]">
                  {isDe ? 'Datenhaltung & Recht' : 'Data Residency'}
                </span>
                <span className="font-mono text-[11px] text-[var(--fg)]">
                  DE / AT (GDPR)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--fg-muted)]">
                  {isDe ? 'Sie haben bereits ein Konto?' : 'Already have an account?'}
                </span>
                <Link
                  to={localePath('/login')}
                  className="text-[var(--accent-bright)] hover:underline underline-offset-4 font-medium inline-flex items-center gap-1"
                >
                  {isDe ? 'Anmelden' : 'Sign in'} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Form Surface */}
          <div className="lg:col-span-7">
            <div>
              {step === 'form' && (
                <form onSubmit={handleSubmit} className="space-y-10" autoComplete="on">
                  {/* 1. Account Credentials */}
                  <div className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h2 className="text-sm font-semibold text-[var(--fg)]">
                          {isDe ? '1. Kontozugangsdaten' : '1. Account Credentials'}
                        </h2>
                        <p className="text-xs text-[var(--fg-muted)] mt-0.5">
                          {isDe
                            ? 'Primäre Anmeldedaten für Ihr VaultScope-Konto.'
                            : 'Primary authentication details for your VaultScope account.'}
                        </p>
                      </div>
                      <span className="font-mono text-[11px] text-[var(--fg-faint)] uppercase">
                        {isDe ? 'Pflichtangaben *' : 'Required *'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="reg-username" className={labelCls}>
                          {isDe ? 'Benutzername' : 'Username'} <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="reg-username"
                          name="username"
                          type="text"
                          value={form.username}
                          onChange={(e) => update('username', e.target.value)}
                          placeholder="johndoe"
                          autoComplete="username"
                          required
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label htmlFor="reg-name" className={labelCls}>
                          {isDe ? 'Vollständiger Name' : 'Full Name'}{' '}
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="reg-name"
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={(e) => update('name', e.target.value)}
                          placeholder="Max Mustermann"
                          autoComplete="name"
                          required
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-email" className={labelCls}>
                        {isDe ? 'E-Mail-Adresse' : 'Email'} <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="reg-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        placeholder="john@example.com"
                        autoComplete="email"
                        required
                        className={inputCls}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="reg-password" className={labelCls}>
                          {isDe ? 'Passwort' : 'Password'} <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="reg-password"
                          name="password"
                          type="password"
                          value={form.password}
                          onChange={(e) => update('password', e.target.value)}
                          placeholder={isDe ? 'Mindestens 8 Zeichen' : 'Minimum 8 characters'}
                          autoComplete="new-password"
                          required
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label htmlFor="reg-password-confirm" className={labelCls}>
                          {isDe ? 'Passwort bestätigen' : 'Confirm Password'}{' '}
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="reg-password-confirm"
                          name="password_confirm"
                          type="password"
                          value={form.password_confirm}
                          onChange={(e) => update('password_confirm', e.target.value)}
                          placeholder={isDe ? 'Passwort wiederholen' : 'Repeat your password'}
                          autoComplete="new-password"
                          required
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Billing Address & Autofill */}
                  <div className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h2 className="text-sm font-semibold text-[var(--fg)]">
                          {isDe ? '2. Rechnungsadresse' : '2. Billing Address'}
                        </h2>
                        <p className="text-xs text-[var(--fg-muted)] mt-0.5">
                          {isDe
                            ? 'Geben Sie Ihre Straße ein, um PLZ, Ort und Land automatisch auszufüllen.'
                            : 'Start typing your street address to autofill postal code, city, and country.'}
                        </p>
                      </div>
                      {isAddressVerified && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-[4px] shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />{' '}
                          {isDe ? 'Automatisch ausgefüllt' : 'Autofilled'}
                        </span>
                      )}
                    </div>

                    <div className="relative" ref={addressContainerRef}>
                      <label htmlFor="reg-address" className={labelCls}>
                        {isDe ? 'Straße & Hausnummer' : 'Street Address'}{' '}
                        <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="reg-address"
                          name="address"
                          type="text"
                          value={form.address}
                          onChange={(e) => update('address', e.target.value)}
                          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') setShowSuggestions(false);
                          }}
                          placeholder={isDe ? 'Musterstraße 1' : 'Musterstraße 1'}
                          autoComplete="street-address"
                          required
                          className={`${inputCls} pr-9`}
                        />
                        {isSearchingAddress && (
                          <div
                            className="absolute right-3 top-3 text-[var(--fg-faint)] animate-spin"
                            aria-label="Searching address"
                          >
                            <Loader2 className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      {showSuggestions && suggestions.length > 0 && (
                        <div
                          className="absolute left-0 right-0 top-full mt-1.5 rounded-[8px] vs-dropdown-panel animate-vs-dropdown p-1.5 z-30 overflow-hidden space-y-0.5"
                          role="listbox"
                          aria-label={isDe ? 'Adressvorschläge' : 'Address suggestions'}
                        >
                          {suggestions.map((s, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => selectSuggestion(s)}
                              className="group w-full text-left px-3 py-2.5 rounded-[6px] hover:bg-[var(--bg-subtle)] cursor-pointer text-xs flex items-start gap-3 transition-all"
                              role="option"
                            >
                              <span className="w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0 bg-[var(--bg-subtle)] border border-[var(--line)] text-[var(--accent-bright)] group-hover:border-[var(--line-strong)] transition-all mt-0.5">
                                <MapPin className="w-3.5 h-3.5" />
                              </span>
                              <div className="min-w-0">
                                <span className="font-semibold text-[var(--fg)] block truncate">
                                  {s.street}
                                </span>
                                <span className="text-[11px] text-[var(--fg-muted)] block truncate">
                                  {[s.postal_code, s.city].filter(Boolean).join(' ')}
                                  {s.country ? `, ${s.country}` : ''}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="reg-postal-code" className={labelCls}>
                          {isDe ? 'Postleitzahl (PLZ)' : 'Postal Code (PLZ)'}{' '}
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="reg-postal-code"
                          name="postal_code"
                          type="text"
                          value={form.postal_code}
                          onChange={(e) => update('postal_code', e.target.value)}
                          placeholder={form.country === 'DE' ? '10115' : '1010'}
                          autoComplete="postal-code"
                          required
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label htmlFor="reg-city" className={labelCls}>
                          {isDe ? 'Stadt / Ort' : 'City'} <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="reg-city"
                          name="city"
                          type="text"
                          value={form.city}
                          onChange={(e) => update('city', e.target.value)}
                          placeholder="Berlin"
                          autoComplete="address-level2"
                          required
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label htmlFor="reg-country" className={labelCls}>
                          {isDe ? 'Land' : 'Country'} <span className="text-red-400">*</span>
                        </label>
                        <CustomSelect
                          id="reg-country"
                          name="country"
                          value={form.country}
                          onChange={(val) => update('country', val)}
                          autoComplete="country"
                          options={COUNTRIES.map((c) => ({
                            value: c.code,
                            label: c.name,
                            hint: c.code,
                          }))}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-phone" className={labelCls}>
                        {isDe ? 'Telefonnummer' : 'Phone'}{' '}
                        <span className="text-[var(--fg-faint)] font-normal">(optional)</span>
                      </label>
                      <input
                        id="reg-phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        placeholder="+49 170 1234567"
                        autoComplete="tel"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* 3. Company & VAT ID */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
                      <div>
                        <h2 className="text-sm font-semibold text-[var(--fg)]">
                          {isDe
                            ? '3. Unternehmen & USt-IdNr. (Optional)'
                            : '3. Company & VAT ID (Optional)'}
                        </h2>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="reg-company" className={labelCls}>
                          {isDe ? 'Unternehmen / Firma' : 'Company'}{' '}
                          <span className="text-[var(--fg-faint)] font-normal">(optional)</span>
                        </label>
                        <input
                          id="reg-company"
                          name="company"
                          type="text"
                          value={form.company}
                          onChange={(e) => update('company', e.target.value)}
                          placeholder="Acme GmbH"
                          autoComplete="organization"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label htmlFor="reg-vat-id" className={labelCls}>
                          {isDe ? 'EU-USt-IdNr. (VAT ID)' : 'EU VAT ID'}{' '}
                          <span className="text-[var(--fg-faint)] font-normal">(optional)</span>
                        </label>
                        <input
                          id="reg-vat-id"
                          name="vat_id"
                          type="text"
                          value={form.vat_id}
                          onChange={(e) => update('vat_id', e.target.value.toUpperCase())}
                          placeholder="DE123456789"
                          className={`${inputCls} uppercase font-mono`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Footer */}
                  <div className="pt-2 space-y-4">
                    {error && (
                      <div
                        className="rounded-[6px] border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-400"
                        role="alert"
                      >
                        {error}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <p className="text-xs text-[var(--fg-muted)]">
                        {isDe
                          ? 'Nach dem Absenden erhalten Sie einen Bestätigungslink per E-Mail.'
                          : 'A verification link will be sent to your email address upon submission.'}
                      </p>
                      <Button type="submit" disabled={submitting} className="w-full sm:w-auto sm:min-w-[200px] py-2.5">
                        {submitting
                          ? isDe
                            ? 'Konto wird erstellt...'
                            : 'Creating account...'
                          : isDe
                            ? 'Konto erstellen'
                            : 'Create Account'}
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              {step === 'verify_notice' && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4 pb-2">
                    <div className="w-10 h-10 rounded-[6px] bg-[var(--bg-subtle)] flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-[var(--fg)]" />
                    </div>
                    <div className="space-y-1.5">
                      <h2 className="text-lg font-semibold text-[var(--fg)]">
                        {isDe ? 'Bestätigen Sie Ihre E-Mail-Adresse' : 'Verify your email address'}
                      </h2>
                      <p className="text-xs text-[var(--fg-muted)]">
                        {isDe
                          ? 'Wir haben einen Bestätigungslink gesendet an:'
                          : "We've sent a verification link to:"}
                      </p>
                      <p className="font-mono text-xs font-medium text-[var(--fg)] bg-[var(--bg-subtle)] py-1.5 px-3 rounded-[6px] inline-block">
                        {form.email}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[6px] border border-amber-500/30 bg-amber-500/10 p-4 text-left flex gap-3 items-start">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1 text-[var(--fg-muted)]">
                      <p className="font-semibold text-amber-500">
                        {isDe
                          ? 'Prüfen Sie Ihren Spam- oder Junk-Ordner'
                          : 'Check your Spam or Junk folder'}
                      </p>
                      <p>
                        {isDe
                          ? 'Automatische Bestätigungs-E-Mails werden manchmal herausgefiltert. Falls Sie innerhalb weniger Minuten keine E-Mail erhalten, prüfen Sie bitte Ihren Spam-Ordner.'
                          : 'Automated confirmation emails may sometimes be filtered by email providers. If you do not see the email in your inbox within a few minutes, please check your spam or junk folder.'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button
                      onClick={() => navigate(localePath('/login'))}
                      className="w-full flex items-center justify-center gap-2 py-2.5"
                    >
                      {isDe ? 'Weiter zur Anmeldung' : 'Proceed to Sign in'}{' '}
                      <ArrowRight className="w-4 h-4" />
                    </Button>

                    <div className="flex flex-col items-center gap-2 pt-1">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={handleResend}
                        disabled={resending}
                        className="w-full text-xs py-2"
                      >
                        {resending ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                            {isDe ? 'Wird gesendet...' : 'Sending...'}
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                            {isDe ? 'Bestätigungs-E-Mail erneut senden' : 'Resend Verification Email'}
                          </>
                        )}
                      </Button>
                      {resendStatus && (
                        <p className="text-xs text-emerald-400 mt-1">{resendStatus}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
