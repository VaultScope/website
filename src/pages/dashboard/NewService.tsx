import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Server, Cpu, HardDrive, FolderLock, Lock } from 'lucide-react';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import {
  Elements,
  ExpressCheckoutElement,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { api } from '../../lib/api';

function CheckoutForm({
  onSuccess,
  totalGross,
}: {
  onSuccess: (paymentIntentId?: string) => void;
  totalGross: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [hasExpressMethods, setHasExpressMethods] = useState(false);

  const confirmStripePayment = async () => {
    if (!stripe || !elements) return;
    setProcessing(true);
    setError('');

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setProcessing(false);
    } else {
      onSuccess(paymentIntent?.id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await confirmStripePayment();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--line)]">
        <span className="text-xs font-medium text-[var(--fg-muted)]">
          Select a payment method
        </span>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--fg-faint)]">
          <span className="px-2 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--line)] text-[var(--fg)]">
            Apple Pay
          </span>
          <span className="px-2 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--line)] text-[var(--fg)]">
            Google Pay
          </span>
          <span className="px-2 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--line)]">
            Card / SEPA
          </span>
        </div>
      </div>

      {/* Express Wallet Checkout (Apple Pay & Google Pay) */}
      <div className={hasExpressMethods ? 'space-y-4' : ''}>
        <ExpressCheckoutElement
          options={{
            paymentMethods: {
              applePay: 'always',
              googlePay: 'always',
              link: 'auto',
            },
            paymentMethodOrder: ['apple_pay', 'google_pay', 'link'],
            buttonType: {
              applePay: 'buy',
              googlePay: 'buy',
            },
            buttonTheme: {
              applePay: 'white-outline',
              googlePay: 'black',
            },
            layout: {
              maxColumns: 2,
              maxRows: 1,
            },
          }}
          onReady={({ availablePaymentMethods }) => {
            if (availablePaymentMethods) {
              setHasExpressMethods(
                Boolean(
                  availablePaymentMethods.applePay ||
                    availablePaymentMethods.googlePay ||
                    availablePaymentMethods.link
                )
              );
            }
          }}
          onConfirm={confirmStripePayment}
        />

        {hasExpressMethods && (
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-[var(--line)]" />
            <span className="flex-shrink mx-3 text-[11px] font-mono uppercase tracking-wider text-[var(--fg-faint)]">
              Or pay with card / wallet
            </span>
            <div className="flex-grow border-t border-[var(--line)]" />
          </div>
        )}
      </div>

      <div className="p-5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--line)]">
        <PaymentElement
          options={{
            layout: 'tabs',
            wallets: {
              applePay: 'auto',
              googlePay: 'auto',
            },
            paymentMethodOrder: [
              'apple_pay',
              'google_pay',
              'card',
              'paypal',
              'klarna',
              'sepa_debit',
            ],
          }}
        />
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
  if (c === 'odp' || c === 'ocd' || c.includes('one click')) return 'odp';
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
  const [serviceForms, setServiceForms] = useState<any[]>([]);
  const [sshKeys, setSshKeys] = useState<any[]>([]);
  const [customConfig, setCustomConfig] = useState<Record<string, any>>({});
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

      const rawForms = optsData?.service_forms || optsData?.serviceForms || [];
      setServiceForms(Array.isArray(rawForms) ? rawForms : []);
      const rawSshKeys = optsData?.ssh_keys || optsData?.sshKeys || [];
      setSshKeys(Array.isArray(rawSshKeys) ? rawSshKeys : []);
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

  // Determine if the selected product has a custom CAMOS Service Form attached
  const activeServiceForm = selectedProduct?.service_form_id
    ? serviceForms.find((f: any) => String(f.id) === String(selectedProduct.service_form_id)) ||
      selectedProduct?.service_form ||
      null
    : selectedProduct?.service_form || null;

  const customFields: any[] = Array.isArray(activeServiceForm?.fields)
    ? activeServiceForm.fields
    : Array.isArray(selectedProduct?.custom_fields)
      ? selectedProduct.custom_fields
      : [];

  const hasCustomConfig = Boolean(customFields.length > 0);

  // Initialize default values when the active service form changes
  useEffect(() => {
    if (!hasCustomConfig) {
      setCustomConfig({});
      if (currentStep === 1) {
        setCurrentStep(0);
      }
      return;
    }
    const defaults: Record<string, any> = {};
    for (const field of customFields) {
      const key = field.variable || field.id;
      if (!key) continue;
      if (field.type === 'checkbox') {
        defaults[key] = false;
      } else if (field.type === 'select' && field.options) {
        const opts = String(field.options)
          .split(',')
          .map((o: string) => o.trim())
          .filter(Boolean);
        defaults[key] = opts[0] || '';
      } else {
        defaults[key] = '';
      }
    }
    setCustomConfig(defaults);
  }, [selectedProduct?.id, activeServiceForm?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeSteps = hasCustomConfig
    ? [
        { id: 0, label: 'Product' },
        { id: 1, label: 'Configuration' },
        { id: 2, label: 'Review' },
        { id: 3, label: 'Payment' },
        { id: 4, label: 'Provisioning' },
      ]
    : [
        { id: 0, label: 'Product' },
        { id: 2, label: 'Review' },
        { id: 3, label: 'Payment' },
        { id: 4, label: 'Provisioning' },
      ];

  const nextStep = () => {
    setError('');
    if (currentStep === 0) {
      setCurrentStep(hasCustomConfig ? 1 : 2);
      return;
    }
    if (currentStep === 1) {
      for (const field of customFields) {
        const key = field.variable || field.id;
        if (field.required && field.type !== 'checkbox') {
          const val = customConfig[key];
          if (val === undefined || val === null || String(val).trim() === '') {
            setError(`Please fill in required field: ${field.label || key}`);
            return;
          }
        }
      }
      setCurrentStep(2);
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setError('');
    if (currentStep === 2) {
      setCurrentStep(hasCustomConfig ? 1 : 0);
      return;
    }
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const price = selectedProduct ? parseFloat(selectedProduct.price || '0') : 0;
  const vat = price * 0.19;
  const total = price + vat;

  const handleProceedToPayment = async () => {
    if (!selectedProduct) return;
    // When Stripe isn't configured or the plan is free/trial, provision directly
    if (!stripePromise || total <= 0) {
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
      const secret = res?.client_secret || res?.clientSecret || '';
      const piId =
        res?.payment_intent_id ||
        res?.paymentIntentId ||
        (secret.includes('_secret_') ? secret.split('_secret_')[0] : '');
      setClientSecret(secret);
      setPaymentIntentId(piId);
      setCurrentStep(3);
    } catch (e: any) {
      setError(e.message || 'Failed to initialize payment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateOrder = async (confirmedPaymentIntentId?: string) => {
    if (!selectedProduct) return;
    setCurrentStep(4);
    setError('');
    try {
      const configuredHostname =
        typeof customConfig.hostname === 'string' && customConfig.hostname.trim()
          ? customConfig.hostname.trim()
          : undefined;
      const effectivePaymentIntentId =
        confirmedPaymentIntentId ||
        paymentIntentId ||
        (clientSecret.includes('_secret_') ? clientSecret.split('_secret_')[0] : undefined);

      const res: any = await api.post('/storefront/orders', {
        product_id: selectedProduct.id,
        hostname: configuredHostname,
        payment_intent_id: effectivePaymentIntentId || undefined,
        billing_cycle: selectedProduct.billing_cycle || 'monthly',
        config: hasCustomConfig ? customConfig : undefined,
      });
      setTimeout(() => {
        if (category === 'storage') {
          navigate('/dashboard/sftp');
        } else {
          navigate(`/dashboard/${category}/${res?.service_id || res?.id || ''}`);
        }
      }, 1000);
    } catch (e: any) {
      setError(e.message || 'Provisioning failed');
      setCurrentStep(2);
    }
  };

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
          {activeSteps.map((step, index) => {
            const done = step.id < currentStep;
            const active = step.id === currentStep;
            return (
              <div
                key={step.label}
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
                <span>{step.label}</span>
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
                                specs.disk || specs.storage || (plan.quota_gb ? `${plan.quota_gb} GB Storage` : undefined),
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

          {currentStep === 1 && hasCustomConfig && (
            <div className="space-y-6">
              {activeServiceForm && (
                <div className="space-y-1 border-b border-[var(--line)] pb-4">
                  <h2 className="text-base font-semibold text-[var(--fg)]">
                    {activeServiceForm.name || 'Service Configuration'}
                  </h2>
                  {activeServiceForm.description && (
                    <p className="text-xs text-[var(--fg-muted)]">
                      {activeServiceForm.description}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-4">
                {customFields.map((field: any) => {
                  const key = field.variable || field.id;
                  const fieldId = `service-form-field-${key}`;
                  const value = customConfig[key] ?? '';
                  const selectOptions =
                    field.type === 'select' && field.options
                      ? String(field.options)
                          .split(',')
                          .map((o: string) => o.trim())
                          .filter(Boolean)
                      : [];

                  return (
                    <div key={field.id || key}>
                      {field.type === 'checkbox' ? (
                        <label
                          htmlFor={fieldId}
                          className="flex items-center gap-2.5 cursor-pointer py-1"
                        >
                          <input
                            id={fieldId}
                            type="checkbox"
                            checked={Boolean(value)}
                            onChange={(e) =>
                              setCustomConfig((prev) => ({ ...prev, [key]: e.target.checked }))
                            }
                            className="w-4 h-4 rounded border-[var(--line)] accent-[var(--accent)]"
                          />
                          <span className="text-xs font-medium text-[var(--fg)]">
                            {field.label || key}
                          </span>
                        </label>
                      ) : (
                        <>
                          <label
                            htmlFor={fieldId}
                            className="block text-xs font-medium text-[var(--fg-muted)] mb-1.5"
                          >
                            {field.label || key}
                            {field.required && (
                              <span className="text-[var(--err)] ml-1">*</span>
                            )}
                          </label>

                          {field.type === 'select' ? (
                            <select
                              id={fieldId}
                              value={value}
                              onChange={(e) =>
                                setCustomConfig((prev) => ({ ...prev, [key]: e.target.value }))
                              }
                              className="w-full rounded-[5px] bg-[var(--bg-subtle)] border border-[var(--line)] px-4 py-2.5 text-xs font-mono text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)] transition-colors"
                            >
                              {selectOptions.map((opt: string) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : field.type === 'ssh_key_selector' ? (
                            <div className="space-y-2">
                              {sshKeys.length > 0 && (
                                <select
                                  value={value}
                                  onChange={(e) =>
                                    setCustomConfig((prev) => ({ ...prev, [key]: e.target.value }))
                                  }
                                  className="w-full rounded-[5px] bg-[var(--bg-subtle)] border border-[var(--line)] px-4 py-2 text-xs font-mono text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)] transition-colors"
                                >
                                  <option value="">-- Select saved SSH key or paste below --</option>
                                  {sshKeys.map((k: any) => (
                                    <option key={k.id} value={k.public_key || k.name || k.id}>
                                      {k.name}
                                    </option>
                                  ))}
                                </select>
                              )}
                              <textarea
                                id={fieldId}
                                rows={2}
                                value={value}
                                onChange={(e) =>
                                  setCustomConfig((prev) => ({ ...prev, [key]: e.target.value }))
                                }
                                placeholder="ssh-ed25519 AAAAC3NzaC..."
                                className="w-full rounded-[5px] bg-[var(--bg-subtle)] border border-[var(--line)] px-4 py-2.5 text-xs font-mono text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)] transition-colors"
                              />
                            </div>
                          ) : (
                            <input
                              id={fieldId}
                              type={
                                field.type === 'password'
                                  ? 'password'
                                  : field.type === 'number'
                                    ? 'number'
                                    : 'text'
                              }
                              value={value}
                              onChange={(e) =>
                                setCustomConfig((prev) => ({ ...prev, [key]: e.target.value }))
                              }
                              placeholder={field.placeholder || ''}
                              className="w-full rounded-[5px] bg-[var(--bg-subtle)] border border-[var(--line)] px-4 py-2.5 text-xs font-mono text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)] transition-colors"
                            />
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
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
                {selectedProduct.quota_gb ? (
                  <div className="flex justify-between py-3">
                    <span className="text-[var(--fg-muted)]">Storage Quota</span>
                    <span className="font-mono text-[var(--fg)]">{selectedProduct.quota_gb} GB</span>
                  </div>
                ) : null}
                {hasCustomConfig &&
                  customFields.map((field: any) => {
                    const key = field.variable || field.id;
                    const val = customConfig[key];
                    if (val === undefined || val === null || val === '') return null;
                    return (
                      <div key={field.id || key} className="flex justify-between py-3 gap-4">
                        <span className="text-[var(--fg-muted)]">{field.label || key}</span>
                        <span className="font-mono text-[var(--fg)] truncate max-w-[260px]">
                          {field.type === 'password'
                            ? '••••••••'
                            : typeof val === 'boolean'
                              ? val
                                ? 'Yes'
                                : 'No'
                              : String(val)}
                        </span>
                      </div>
                    );
                  })}
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
                Allocating resource and configuring access credentials.
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
                    : stripePromise && total > 0
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
            {selectedProduct?.quota_gb ? (
              <div className="flex items-center justify-between gap-2">
                <span className="text-[var(--fg-muted)]">Storage Quota</span>
                <span className="font-mono text-[var(--fg)]">
                  {selectedProduct.quota_gb} GB
                </span>
              </div>
            ) : null}
            {selectedProduct?.specs &&
              Object.entries(selectedProduct.specs)
                .slice(0, 4)
                .map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-2">
                    <span className="text-[var(--fg-muted)] capitalize">
                      {k.replace(/_/g, ' ')}
                    </span>
                    <span className="font-mono text-[var(--fg)] truncate max-w-[180px]">
                      {String(v)}
                    </span>
                  </div>
                ))}
            {hasCustomConfig &&
              customFields.map((field: any) => {
                const key = field.variable || field.id;
                const val = customConfig[key];
                if (val === undefined || val === null || val === '') return null;
                return (
                  <div key={field.id || key} className="flex items-center justify-between gap-2">
                    <span className="text-[var(--fg-muted)]">{field.label || key}</span>
                    <span className="font-mono text-[var(--fg)] truncate max-w-[180px]">
                      {field.type === 'password'
                        ? '••••••••'
                        : typeof val === 'boolean'
                          ? val
                            ? 'Yes'
                            : 'No'
                          : String(val)}
                    </span>
                  </div>
                );
              })}
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
