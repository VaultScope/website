import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Server, Cpu, HardDrive, FolderLock, Lock } from 'lucide-react';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { api } from '../../lib/api';

const steps = ['Product', 'Configuration', 'Review', 'Payment', 'Provisioning'];

function CheckoutForm({
  onSuccess,
  totalGross,
}: {
  onSuccess: () => void;
  totalGross: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError('');

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--line)]">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
      {error && (
        <div role="alert" className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[var(--err)] text-xs">{error}</div>
      )}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!stripe || processing}
          className="vs-btn-primary px-6 py-2.5 text-xs font-medium disabled:opacity-50"
        >
          <Lock className="w-3.5 h-3.5" />
          {processing ? 'Processing...' : `Pay €${totalGross.toFixed(2)} & Deploy`}
        </button>
      </div>
    </form>
  );
}

function resolveCategoryTab(rawCat?: string, rawProvider?: string): 'vps' | 'ds' | 'odp' | 'storage' {
  const c = (rawCat || '').toLowerCase();
  const p = (rawProvider || '').toLowerCase();
  if (c === 'ds' || c === 'dedicated' || c === 'bare-metal' || p === 'reliablesite') return 'ds';
  if (c === 'odp' || c === 'ocd') return 'odp';
  if (c === 'storage' || c === 'sftp' || p === 'sftpgo') return 'storage';
  return 'vps';
}

export function NewService() {
  const [searchParams] = useSearchParams();
  const rawCatParam = searchParams.get('category');
  const productParam = searchParams.get('product') || searchParams.get('plan');
  const initialCat = rawCatParam ? resolveCategoryTab(rawCatParam) : 'vps';

  const [currentStep, setCurrentStep] = useState(0);
  const [category, setCategory] = useState<'vps' | 'ds' | 'odp' | 'storage'>(initialCat);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [osTemplates, setOsTemplates] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [location, setLocation] = useState('');
  const [os, setOs] = useState('');
  const [hostname, setHostname] = useState('');
  const [sshKey, setSshKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get<{ stripe_public_key?: string; stripe_publishable_key?: string }>('/storefront/config')
      .then((cfg) => {
        const key =
          cfg?.stripe_public_key ||
          cfg?.stripe_publishable_key ||
          import.meta.env.VITE_STRIPE_PUBLIC_KEY ||
          '';
        if (key) setStripePromise(loadStripe(key));
      })
      .catch(() => {
        const fallback = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
        if (fallback) setStripePromise(loadStripe(fallback));
      });

    Promise.all([
      api.get('/storefront/catalog').catch(() => []),
      api.get('/storefront/options').catch(() => ({})),
    ]).then(([catData, optsData]: [any, any]) => {
      const list = (Array.isArray(catData) ? catData : []).filter(
        (p: any) => !p.hidden && (p.stock === null || p.stock === undefined || Number(p.stock) !== 0)
      );
      setCatalog(list);

      if (productParam) {
        const matched = list.find((p: any) => String(p.id) === productParam);
        if (matched) {
          setCategory(resolveCategoryTab(matched.category, matched.provider));
          setSelectedProduct(matched);
        }
      } else if (!rawCatParam && list.length > 0) {
        const hasInitialCat = list.some(
          (p: any) => resolveCategoryTab(p.category, p.provider) === initialCat
        );
        if (!hasInitialCat) {
          const firstCat = resolveCategoryTab(list[0].category, list[0].provider);
          setCategory(firstCat);
          setSelectedProduct(list[0]);
        }
      }

      const locs = Array.isArray(optsData?.locations) ? optsData.locations : [];
      const rawTemplates =
        optsData?.os_templates || optsData?.osImages || optsData?.os_images || [];
      const templates = Array.isArray(rawTemplates) ? rawTemplates : [];
      const gms = Array.isArray(optsData?.games) ? optsData.games : [];
      setLocations(locs);
      setOsTemplates(templates);
      setGames(gms);

      if (locs.length > 0) setLocation(locs[0].id);
      if (templates.length > 0) setOs(templates[0].id);
      setLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredProducts = catalog.filter(
    (p) => resolveCategoryTab(p.category, p.provider) === category
  );

  useEffect(() => {
    if (
      filteredProducts.length > 0 &&
      (!selectedProduct ||
        resolveCategoryTab(selectedProduct.category, selectedProduct.provider) !== category)
    ) {
      setSelectedProduct(filteredProducts[0]);
    }
  }, [category, catalog]); // eslint-disable-line react-hooks/exhaustive-deps

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const price = selectedProduct ? parseFloat(selectedProduct.price || '0') : 0;
  const vat = price * 0.19;
  const total = price + vat;

  const handleProceedToPayment = async () => {
    if (!selectedProduct) return;
    // When Stripe isn't configured, provision directly
    if (!stripePromise) {
      await handleCreateOrder();
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const amountCents = Math.max(Math.round(total * 100), 50);
      const res: any = await api.post('/storefront/orders/create-payment-intent', {
        product_id: selectedProduct.id,
        amount: amountCents,
        currency: 'eur',
      });
      setClientSecret(res?.client_secret || res?.clientSecret || '');
      setPaymentIntentId(res?.payment_intent_id || res?.paymentIntentId || '');
      nextStep();
    } catch (e: any) {
      setError(e.message || 'Failed to initialize payment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedProduct) return;
    setCurrentStep(4);
    setError('');
    try {
      const resolvedHostname = hostname || `${category}-node.vaultscope.internal`;
      const res: any = await api.post('/storefront/orders', {
        product_id: selectedProduct.id,
        hostname: resolvedHostname,
        payment_intent_id: paymentIntentId || undefined,
        billing_cycle: selectedProduct.billing_cycle || 'monthly',
        config: {
          hostname: resolvedHostname,
          location,
          os_template: os,
          ssh_key: sshKey || undefined,
        },
      });
      setTimeout(() => {
        if (category === 'storage') {
          navigate('/dashboard/sftp');
        } else {
          navigate(`/dashboard/${category}/${res?.id || ''}`);
        }
      }, 1000);
    } catch (e: any) {
      setError(e.message || 'Provisioning failed');
      setCurrentStep(2);
    }
  };

  const selectedLocObj = locations.find((l: any) => l.id === location);
  const selectedOsObj = (category === 'odp' ? games : osTemplates).find((o: any) => o.id === os);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">
            Deploy Infrastructure
          </h1>
          <p className="text-xs text-[var(--fg-muted)]">
            Configure and launch new compute or storage resources on the VaultScope network.
          </p>
        </div>

        {/* Step Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {steps.map((step, index) => {
            const done = index < currentStep;
            const active = index === currentStep;
            return (
              <div
                key={step}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-[5px] text-xs font-medium shrink-0 border transition-colors ${
                  active
                    ? 'bg-[var(--accent-subtle)] border-[var(--accent-bright)] text-[var(--fg)]'
                    : done
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-[var(--ok)]'
                      : 'bg-[var(--bg-card)] border-[var(--line)] text-[var(--fg-faint)]'
                }`}
              >
                <span className="font-mono text-[10px]">
                  {done ? <Check className="w-3 h-3" /> : `0${index + 1}`}
                </span>
                <span>{step}</span>
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-[6px] bg-rose-500/10 border border-rose-500/20 px-5 py-3.5 text-xs text-[var(--err)]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 rounded-[6px] bg-[var(--bg-card)] border border-[var(--line)] p-6 sm:p-8">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Infrastructure categories">
                {[
                  { id: 'vps', label: 'Cloud VPS', icon: Server },
                  { id: 'ds', label: 'Dedicated Server', icon: HardDrive },
                  { id: 'odp', label: 'One-Click Deploy', icon: Cpu },
                  { id: 'storage', label: 'SFTP Vault', icon: FolderLock },
                ].map((cat) => {
                  const Icon = cat.icon;
                  const active = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setCategory(cat.id as any)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-[5px] text-xs font-medium border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                          : 'bg-[var(--bg-subtle)] border-[var(--line)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--line-strong)]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {loading ? (
                <div className="py-8 text-center text-xs font-mono text-[var(--fg-muted)]">
                  Loading catalog...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-8 text-center text-xs text-[var(--fg-muted)]">
                  No plans currently available in this category.
                </div>
              ) : (
                <div className="divide-y divide-[var(--line)] border-t border-[var(--line)]" role="radiogroup" aria-label="Select infrastructure plan">
                  {filteredProducts.map((plan) => {
                    const selected = selectedProduct?.id === plan.id;
                    const specs = plan.specs || {};
                    return (
                      <div
                        key={plan.id}
                        role="radio"
                        aria-checked={selected}
                        tabIndex={0}
                        onClick={() => setSelectedProduct(plan)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedProduct(plan);
                          }
                        }}
                        className={`cursor-pointer px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                          selected
                            ? 'bg-[var(--accent-subtle)]'
                            : 'hover:bg-[var(--bg-subtle)]'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                selected
                                  ? 'border-[var(--accent-bright)] bg-[var(--accent)]'
                                  : 'border-[var(--line-strong)]'
                              }`}
                            >
                              {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                            <span className="text-sm font-semibold text-[var(--fg)]">{plan.name}</span>
                          </div>
                          <div className="text-xs text-[var(--fg-muted)] pl-6">
                            {plan.description ||
                              [
                                specs.cpu,
                                specs.ram,
                                specs.disk || specs.storage,
                                specs.protocols,
                                specs.location,
                              ]
                                .filter(Boolean)
                                .join(' · ')}
                          </div>
                        </div>
                        <div className="text-right shrink-0 pl-6 sm:pl-0">
                          <div className="text-base font-semibold font-mono text-[var(--fg)]">
                            €{parseFloat(plan.price || '0').toFixed(2)}
                            <span className="text-xs text-[var(--fg-faint)] font-normal"> / mo</span>
                          </div>
                          <div className="text-[11px] font-mono text-[var(--fg-faint)]">
                            excl. 19% VAT
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              {locations.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-[var(--fg-muted)]">Datacenter Region</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {locations.map((loc: any) => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => setLocation(loc.id)}
                        className={`p-3.5 rounded-[5px] text-left flex items-center justify-between border transition-all cursor-pointer ${
                          location === loc.id
                            ? 'bg-[var(--accent-subtle)] border-[var(--accent-bright)]'
                            : 'bg-[var(--bg-subtle)] border-[var(--line)] hover:border-[var(--line-strong)]'
                        }`}
                      >
                        <span className="text-xs font-medium text-[var(--fg)]">
                          {loc.flag} {loc.name}
                        </span>
                        {loc.ping_ms && (
                          <span className="text-[11px] font-mono text-[var(--ok)]">
                            {loc.ping_ms} ms
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(category === 'odp' ? games : osTemplates).length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-[var(--fg-muted)]">
                    {category === 'odp' ? 'Application Template' : 'Operating System Image'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(category === 'odp' ? games : osTemplates).map((item: any) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setOs(item.id)}
                        className={`p-3.5 rounded-[5px] text-left border transition-all cursor-pointer ${
                          os === item.id
                            ? 'bg-[var(--accent-subtle)] border-[var(--accent-bright)]'
                            : 'bg-[var(--bg-subtle)] border-[var(--line)] hover:border-[var(--line-strong)]'
                        }`}
                      >
                        <div className="text-xs font-medium text-[var(--fg)]">{item.name}</div>
                        {item.version && (
                          <div className="text-[11px] font-mono text-[var(--fg-faint)]">
                            v{item.version}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="new-service-hostname" className="block text-xs font-medium text-[var(--fg-muted)] mb-1.5">Hostname</label>
                  <input
                    id="new-service-hostname"
                    type="text"
                    value={hostname}
                    onChange={(e) => setHostname(e.target.value)}
                    placeholder="node-01.vaultscope.internal"
                    className="w-full rounded-[5px] bg-[var(--bg-subtle)] border border-[var(--line)] px-4 py-2.5 text-xs font-mono text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)] transition-colors"
                  />
                </div>
                {category !== 'odp' && (
                  <div>
                    <label htmlFor="new-service-ssh-key" className="block text-xs font-medium text-[var(--fg-muted)] mb-1.5">
                      SSH Public Key (Optional)
                    </label>
                    <textarea
                      id="new-service-ssh-key"
                      rows={2}
                      value={sshKey}
                      onChange={(e) => setSshKey(e.target.value)}
                      placeholder="ssh-ed25519 AAAAC3NzaC..."
                      className="w-full rounded-[5px] bg-[var(--bg-subtle)] border border-[var(--line)] px-4 py-2.5 text-xs font-mono text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)] transition-colors"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && selectedProduct && (
            <div className="space-y-6">
              <h2 className="text-base font-semibold text-[var(--fg)]">Order Summary</h2>
              <div className="divide-y divide-[var(--line)] border-t border-[var(--line)] text-xs">
                <div className="flex justify-between py-3">
                  <span className="text-[var(--fg-muted)]">Plan</span>
                  <span className="font-mono text-[var(--fg)]">{selectedProduct.name}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-[var(--fg-muted)]">Hostname</span>
                  <span className="font-mono text-[var(--fg)]">
                    {hostname || `${category}-node.vaultscope.internal`}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-[var(--fg-muted)]">Net Monthly</span>
                  <span className="font-mono text-[var(--fg)]">€{price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-[var(--fg-muted)]">19% German VAT</span>
                  <span className="font-mono text-[var(--fg)]">€{vat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 text-sm font-semibold">
                  <span className="text-[var(--fg)]">Total Monthly (Gross)</span>
                  <span className="font-mono text-[var(--accent-bright)]">€{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && clientSecret && stripePromise && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#6D4AFF',
                    colorBackground: '#101013',
                    colorText: '#F8FAFC',
                  },
                },
              }}
            >
              <CheckoutForm onSuccess={handleCreateOrder} totalGross={total} />
            </Elements>
          )}

          {currentStep === 4 && (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-bright)] border-t-transparent animate-spin mx-auto" />
              <div className="text-sm font-medium text-[var(--fg)]">Provisioning resource...</div>
              <p className="text-xs text-[var(--fg-muted)]">
                Allocating compute node and configuring network interfaces.
              </p>
            </div>
          )}

          {currentStep < 3 && (
            <div className="mt-8 flex items-center justify-between">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="vs-btn-secondary px-4 py-2 text-xs font-medium"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < 2 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!selectedProduct}
                  className="vs-btn-primary px-5 py-2 text-xs font-medium disabled:opacity-50"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  disabled={submitting}
                  className="vs-btn-primary px-5 py-2 text-xs font-medium disabled:opacity-50"
                >
                  {submitting
                    ? 'Initializing...'
                    : stripePromise
                      ? 'Proceed to Payment'
                      : 'Deploy Now'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Live Deployment Summary Sidebar */}
        <aside className="lg:col-span-4 rounded-[6px] bg-[var(--bg-card)] border border-[var(--line)] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
            <span className="text-xs font-mono uppercase tracking-[0.06em] text-[var(--fg-faint)]">
              Deployment Spec
            </span>
            <span className="text-[11px] font-mono text-[var(--accent-bright)] uppercase">
              {category}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[var(--fg-muted)]">Selected Plan</span>
              <span className="font-mono text-[var(--fg)] font-medium">
                {selectedProduct?.name || 'None'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[var(--fg-muted)]">Region</span>
              <span className="font-mono text-[var(--fg)]">
                {selectedLocObj?.name || 'Frankfurt (DE)'}
              </span>
            </div>
            {selectedOsObj && (
              <div className="flex items-center justify-between gap-2">
                <span className="text-[var(--fg-muted)]">Image</span>
                <span className="font-mono text-[var(--fg)]">{selectedOsObj.name}</span>
              </div>
            )}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[var(--fg-muted)]">Hostname</span>
              <span className="font-mono text-[var(--fg)] truncate max-w-[180px]">
                {hostname || `${category}-node.vaultscope.internal`}
              </span>
            </div>
          </div>

          <div className="border-t border-[var(--line)] pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-[var(--fg-muted)]">
              <span>Net Monthly</span>
              <span className="font-mono text-[var(--fg)]">€{price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[var(--fg-muted)]">
              <span>19% German VAT</span>
              <span className="font-mono text-[var(--fg)]">€{vat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[var(--line)] text-sm font-semibold">
              <span className="text-[var(--fg)]">Total / mo</span>
              <span className="font-mono text-[var(--accent-bright)]">€{total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
