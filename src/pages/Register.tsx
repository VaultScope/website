import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, MapPin, Mail, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '../components/Shared';
import { useLanguage } from '../i18n';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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

export function Register() {
  const navigate = useNavigate();
  const { localePath } = useLanguage();
  const [step, setStep] = useState<'account' | 'profile' | 'verify_notice'>('account');
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

  // Address Autocomplete States
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [isAddressVerified, setIsAddressVerified] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<any>(null);

  const update = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
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
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query.trim()
        )}&format=json&addressdetails=1&limit=5&countrycodes=${countryCode.toLowerCase()}`;
        const res = await fetch(url, { headers: { 'Accept-Language': 'de,en' } });
        if (res.ok) {
          const data = await res.json();
          const items = data
            .map((item: any) => {
              const addr = item.address || {};
              const street = [addr.road, addr.house_number].filter(Boolean).join(' ') || item.name;
              const city = addr.city || addr.town || addr.village || addr.municipality || '';
              const postalCode = addr.postcode || '';
              const country = (addr.country_code || countryCode).toUpperCase();
              return {
                display: item.display_name,
                street,
                city,
                postal_code: postalCode,
                country,
              };
            })
            .filter((item: any) => Boolean(item.street));
          setSuggestions(items);
          setShowSuggestions(items.length > 0);
        }
      } catch {
        // Ignore network errors gracefully
      } finally {
        setIsSearchingAddress(false);
      }
    }, 350);
  };

  const selectSuggestion = (s: any) => {
    setForm(prev => ({
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

  const handleNext = () => {
    if (!form.username.trim()) { setError('Username is required.'); return; }
    if (!form.email.trim() || !form.email.includes('@')) { setError('Valid email is required.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (form.password !== form.password_confirm) { setError('Passwords do not match.'); return; }
    setStep('profile');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Full name is required.'); return; }
    if (!form.address.trim()) { setError('Street address is required.'); return; }
    if (!form.city.trim()) { setError('City is required.'); return; }
    if (!form.postal_code.trim()) { setError('Postal code (PLZ) is required.'); return; }
    if (!form.country.trim()) { setError('Country is required.'); return; }

    // Country-specific postal code validation
    if (form.country === 'DE' && !/^[0-9]{5}$/.test(form.postal_code.trim())) {
      setError('Please enter a valid 5-digit German postal code (PLZ, e.g. 10115).');
      return;
    }
    if ((form.country === 'AT' || form.country === 'CH') && !/^[0-9]{4}$/.test(form.postal_code.trim())) {
      setError('Please enter a valid 4-digit postal code (e.g. 1010).');
      return;
    }

    // Basic EU VAT validation if entered
    if (form.vat_id.trim()) {
      const cleanVat = form.vat_id.trim().toUpperCase();
      if (form.country === 'DE' && !/^DE[0-9]{9}$/.test(cleanVat)) {
        setError('German VAT ID must start with DE followed by 9 digits (e.g. DE123456789).');
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
          vat_id: form.vat_id.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Registration failed (${res.status})`);
      }

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
      setResendStatus(data.message || 'Verification email resent! Please check your inbox and spam folder.');
    } catch {
      setResendStatus('Failed to resend email. Please try again later.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-6 lg:px-12 pt-32 pb-20">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-medium tracking-tight mb-2">
              {step === 'verify_notice' ? 'Verify your email' : 'Create your account'}
            </h1>
            <p className="text-sm text-foreground/50">
              {step === 'account'
                ? 'Step 1 of 2 — Account credentials'
                : step === 'profile'
                ? 'Step 2 of 2 — Billing & address details'
                : 'Account created — Email verification required'}
            </p>
          </div>

          <div className="border border-border p-8 bg-card rounded-xl shadow-sm">
            {step === 'account' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">
                    Username <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.username}
                    onChange={e => update('username', e.target.value)}
                    placeholder="johndoe"
                    autoComplete="username"
                    className="w-full border border-border bg-transparent px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder="john@example.com"
                    autoComplete="email"
                    className="w-full border border-border bg-transparent px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    className="w-full border border-border bg-transparent px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    value={form.password_confirm}
                    onChange={e => update('password_confirm', e.target.value)}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    className="w-full border border-border bg-transparent px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <div className="pt-2">
                  <Button onClick={handleNext} className="w-full py-2.5">Continue to Address</Button>
                </div>
              </div>
            )}

            {step === 'profile' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    placeholder="Max Mustermann"
                    autoComplete="name"
                    required
                    className="w-full border border-border bg-transparent px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">
                    Company <span className="text-muted-foreground/50 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={e => update('company', e.target.value)}
                    placeholder="Acme GmbH"
                    autoComplete="organization"
                    className="w-full border border-border bg-transparent px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>

                {/* Country Selector */}
                <div>
                  <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">
                    Country <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.country}
                    onChange={e => update('country', e.target.value)}
                    autoComplete="country"
                    className="w-full border border-border bg-background px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-foreground transition-colors"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Street Address with Live Verification Dropdown */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider">
                      Street Address <span className="text-red-400">*</span>
                    </label>
                    {isAddressVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-green-500 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.address}
                      onChange={e => update('address', e.target.value)}
                      onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                      placeholder="Musterstraße 1"
                      autoComplete="street-address"
                      required
                      className="w-full border border-border bg-transparent px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-foreground transition-colors pr-9"
                    />
                    {isSearchingAddress && (
                      <div className="absolute right-3 top-3 text-muted-foreground animate-spin">
                        <Loader2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Address Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-xl z-20 overflow-hidden divide-y divide-border">
                      {suggestions.map((s, idx) => (
                        <div
                          key={idx}
                          onClick={() => selectSuggestion(s)}
                          className="p-3 hover:bg-muted/50 cursor-pointer text-xs flex items-start gap-2.5 transition-colors"
                        >
                          <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-foreground block">{s.street}</span>
                            <span className="text-muted-foreground">{s.postal_code} {s.city}, {s.country}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Postal Code & City */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">
                      Postal Code (PLZ) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.postal_code}
                      onChange={e => update('postal_code', e.target.value)}
                      placeholder={form.country === 'DE' ? '10115' : '1010'}
                      autoComplete="postal-code"
                      required
                      className="w-full border border-border bg-transparent px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">
                      City <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={e => update('city', e.target.value)}
                      placeholder="Berlin"
                      autoComplete="address-level2"
                      required
                      className="w-full border border-border bg-transparent px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">
                    Phone <span className="text-muted-foreground/50 font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => update('phone', e.target.value)}
                    placeholder="+49 170 1234567"
                    autoComplete="tel"
                    className="w-full border border-border bg-transparent px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">
                    EU VAT ID <span className="text-muted-foreground/50 font-normal">(optional, for businesses)</span>
                  </label>
                  <input
                    type="text"
                    value={form.vat_id}
                    onChange={e => update('vat_id', e.target.value)}
                    placeholder="DE123456789"
                    className="w-full border border-border bg-transparent px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-foreground transition-colors uppercase font-mono"
                  />
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" type="button" onClick={() => setStep('account')} className="flex-1 py-2.5">
                    Back
                  </Button>
                  <Button type="submit" disabled={submitting} className="flex-1 py-2.5">
                    {submitting ? 'Creating account...' : 'Create Account'}
                  </Button>
                </div>
              </form>
            )}

            {step === 'verify_notice' && (
              <div className="text-center space-y-6 py-2">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto ring-8 ring-primary/5">
                  <Mail className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-foreground">Verify your email address</h2>
                  <p className="text-sm text-foreground/70">
                    We've sent a verification link to:
                  </p>
                  <p className="font-mono text-sm font-medium text-foreground bg-muted/60 py-1.5 px-3 rounded-md inline-block border border-border">
                    {form.email}
                  </p>
                </div>

                <div className="border border-amber-500/30 bg-amber-500/10 rounded-lg p-4 text-left flex gap-3 items-start">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1 text-foreground/80">
                    <p className="font-semibold text-amber-500">Check your Spam or Junk folder</p>
                    <p>
                      Automated confirmation emails may sometimes be filtered by email providers.
                      If you do not see the email in your inbox within a few minutes, please check your spam or junk folder.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Button
                    onClick={() => navigate(localePath('/login'))}
                    className="w-full flex items-center justify-center gap-2 py-2.5"
                  >
                    Proceed to Sign in <ArrowRight className="w-4 h-4" />
                  </Button>

                  <div className="flex flex-col items-center gap-2 pt-2">
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
                          Sending...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                          Resend Verification Email
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

          <p className="text-center text-xs text-foreground/40 mt-6">
            Already have an account?{' '}
            <Link to={localePath('/login')} className="text-foreground/60 hover:text-foreground transition-colors underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
