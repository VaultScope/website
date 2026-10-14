import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Button } from '../../components/Shared';
import { api } from '../../lib/api';
interface Product {
  id: string;
  name: string;
  category: string;
  provider: string;
  specs: {
    server_type?: string;
    location?: string;
    image?: string;
  };
  price: number | string;
  trial_days?: number | null;
}

function CheckoutForm({ onPaymentSuccess, amount, productId, hostname }: { onPaymentSuccess: () => void; amount: number; productId: string; hostname: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Payment validation failed');
      setProcessing(false);
      return;
    }

    try {
      const { client_secret } = await api.post<{ client_secret: string }>(
        '/storefront/orders/create-payment-intent',
        { product_id: productId }
      );

      const res = await stripe.confirmPayment({
        elements,
        clientSecret: client_secret,
        confirmParams: {
          return_url: window.location.origin + '/dashboard',
        },
        redirect: 'if_required',
      });

      if (res.error) {
        setError(res.error.message || 'Payment failed');
        setProcessing(false);
        return;
      }

      await api.post('/storefront/orders', {
        product_id: productId,
        hostname,
        payment_intent_id: res.paymentIntent?.id,
      });
      setProcessing(false);
      onPaymentSuccess();
    } catch (err: any) {
      setError(err?.message || 'Payment processing failed');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border border-border p-5">
        <PaymentElement />
      </div>

      {error && (
        <div className="text-sm text-red-500 border border-red-500/20 bg-red-500/5 px-4 py-3">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-muted-foreground">
          Encrypted and processed by Stripe. VaultScope does not store card details.
        </p>
        <Button type="submit" disabled={!stripe || processing} className="h-10 px-6">
          {processing ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            `Pay €${amount.toFixed(2)}`
          )}
        </Button>
      </div>
    </form>
  );
}

const STEPS = ['Product', 'Configuration', 'Review', 'Payment', 'Provisioning'] as const;

export function NewService() {
  const [currentStep, setCurrentStep] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [hostname, setHostname] = useState<string>('');

  useEffect(() => {
    api.get<any>('/storefront/config')
      .then(res => {
        if (res.stripe_public_key) {
          setStripePromise(loadStripe(res.stripe_public_key));
        }
      })
      .catch(console.error);

    api.get<Product[]>('/storefront/catalog')
      .then(res => {
        setProducts(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const isTrial = selectedProduct ? ((selectedProduct.trial_days && selectedProduct.trial_days > 0) || parseFloat(selectedProduct.price as string) === 0) : false;
  const priceNum = selectedProduct ? parseFloat(selectedProduct.price as string) : 0;
  const vat = priceNum * 0.19;
  const total = isTrial ? 0 : priceNum + vat;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-light mb-1">Deploy New Service</h1>
        <p className="text-sm text-muted-foreground">Configure and provision your infrastructure.</p>
      </div>

      <div className="border border-border mb-8">
        <div className="flex">
          {STEPS.map((step, index) => {
            const isActive = index === currentStep;
            const isPassed = index < currentStep;
            return (
              <div
                key={step}
                className={`flex-1 py-2.5 text-center text-[11px] uppercase tracking-wider border-r border-border last:border-r-0 transition-colors ${
                  isActive ? 'bg-foreground text-background font-medium' :
                  isPassed ? 'bg-foreground/10 text-foreground' :
                  'text-foreground/30'
                }`}
              >
                <span className="hidden sm:inline">{step}</span>
                <span className="sm:hidden">{index + 1}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="min-h-[360px]">
        {currentStep === 0 && (
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider text-foreground/50 mb-4">Select a product</h2>
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading products...</div>
            ) : (
              <div className="border border-border divide-y divide-border">
                {products.map(p => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProductId(p.id)}
                    className={`flex items-center justify-between px-5 py-4 cursor-pointer transition-colors ${
                      selectedProductId === p.id ? 'bg-foreground/5' : 'hover:bg-foreground/[0.02]'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-sm flex items-center gap-2">
                        {p.name} <span className="text-xs text-muted-foreground uppercase">({p.category})</span>
                        {p.trial_days && p.trial_days > 0 ? (
                          <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded font-mono">
                            {p.trial_days}d trial
                          </span>
                        ) : null}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {p.specs?.server_type} - {p.specs?.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <span className="text-sm font-medium">€{(parseFloat(p.price as string) * 1.19).toFixed(2)} / mo incl. VAT</span>
                      <div className={`w-3.5 h-3.5 border flex items-center justify-center ${
                        selectedProductId === p.id ? 'border-foreground bg-foreground' : 'border-foreground/20'
                      }`}>
                        {selectedProductId === p.id && <Check className="w-2.5 h-2.5 text-background" />}
                      </div>
                    </div>
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="px-5 py-4 text-sm text-muted-foreground">No products available.</div>
                )}
              </div>
            )}
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider text-foreground/50 mb-4">Configuration</h2>
            <div className="border border-border p-5">
              <label className="block text-sm font-medium mb-2">Hostname</label>
              <input
                type="text"
                value={hostname}
                onChange={e => setHostname(e.target.value)}
                placeholder="e.g. server-01.example.com"
                className="w-full bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground/50 transition-colors"
              />
              <p className="text-xs text-muted-foreground mt-2">The desired hostname for your new instance.</p>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider text-foreground/50 mb-4">Review</h2>
            <div className="border border-border">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-5 py-3 text-muted-foreground">Product</td>
                    <td className="px-5 py-3 text-right font-medium">{selectedProduct?.name}</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 text-muted-foreground">Hostname</td>
                    <td className="px-5 py-3 text-right font-medium">{hostname || '—'}</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 text-muted-foreground">Location</td>
                    <td className="px-5 py-3 text-right font-medium">{selectedProduct?.specs?.location || '—'}</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 text-muted-foreground">Server Type</td>
                    <td className="px-5 py-3 text-right font-medium">{selectedProduct?.specs?.server_type || '—'}</td>
                  </tr>
                </tbody>
              </table>
              <div className="border-t border-border px-5 py-4 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>€{priceNum.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>VAT (19%)</span>
                  <span>€{vat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-medium pt-3 border-t border-border">
                  <span>Total due today</span>
                  <span className={isTrial ? "text-green-500 font-semibold" : ""}>
                    €{total.toFixed(2)} {isTrial && `(${selectedProduct?.trial_days || 30}-day trial)`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider text-foreground/50 mb-4">
              {isTrial ? 'Free Trial Confirmation' : 'Payment'}
            </h2>
            <div className="border border-border p-6 bg-background">
              {isTrial ? (
                <div className="space-y-6">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400">
                    <p className="font-medium text-base mb-1">
                      {selectedProduct?.trial_days ? `${selectedProduct.trial_days}-Day Free Trial Active` : 'Free Trial Active'}
                    </p>
                    <p className="text-xs text-blue-400/80 leading-relaxed">
                      No payment is due today. You can evaluate this instance risk-free. You will only be billed the regular price (€{(priceNum * 1.19).toFixed(2)}/mo incl. VAT) after your trial concludes unless cancelled in your dashboard.
                    </p>
                  </div>
                  <div className="flex justify-between items-center py-3 border-y border-border text-sm">
                    <span className="text-muted-foreground">Due today</span>
                    <span className="font-semibold text-lg text-green-500">€0.00</span>
                  </div>
                  <Button 
                    onClick={async () => {
                      try {
                        await api.post('/storefront/orders', {
                          product_id: selectedProductId,
                          hostname,
                        });
                        handleNext();
                      } catch (err: any) {
                        alert(err?.message || 'Failed to start trial');
                      }
                    }} 
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    Start {selectedProduct?.trial_days ? `${selectedProduct.trial_days}-Day ` : ''}Free Trial
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-5 pb-4 border-b border-border text-sm">
                    <span className="text-muted-foreground">Amount due</span>
                    <span className="font-medium text-lg">€{total.toFixed(2)}</span>
                  </div>
                  {stripePromise ? (
                    <Elements
                      stripe={stripePromise}
                      options={{
                        mode: 'payment',
                        amount: Math.max(Math.round(total * 100), 1),
                        currency: 'eur',
                        appearance: {
                          theme: 'night',
                          variables: {
                            colorPrimary: '#ffffff',
                            colorBackground: '#1a1a1a',
                            colorText: '#ffffff',
                            colorDanger: '#ef4444',
                            borderRadius: '0px',
                            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                          },
                          rules: {
                            '.Input': { border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' },
                            '.Input:focus': { border: '1px solid rgba(255,255,255,0.3)', boxShadow: 'none' },
                          }
                        }
                      }}
                    >
                      <CheckoutForm onPaymentSuccess={handleNext} amount={total} productId={selectedProductId} hostname={hostname} />
                    </Elements>
                  ) : (
                    <div className="text-sm text-muted-foreground p-5 text-center">Loading payment processor...</div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider text-foreground/50 mb-6">Provisioning</h2>
            <div className="border border-border p-6 mb-6">
              <div className="space-y-4 text-sm font-mono">
                <div className="flex items-center justify-between">
                  <span>{isTrial ? 'Trial verified' : 'Payment confirmed'}</span>
                  <span className="text-green-500">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Order created</span>
                  <span className="text-green-500">✓</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Provisioning resources</span>
                  <span className="text-yellow-500 animate-pulse">●</span>
                </div>
              </div>
            </div>
            <div className="border border-border p-6 bg-foreground/[0.02]">
              <p className="text-sm mb-1">Your instance is being provisioned.</p>
              <p className="text-xs text-muted-foreground mb-5">This typically takes 30–90 seconds.</p>
              <Button onClick={() => window.location.href = '/dashboard'} variant="outline" className="h-9 px-5 text-sm">
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>

      {currentStep < 3 && (
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="h-9 px-4 text-sm gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 0 && !selectedProductId) ||
              (currentStep === 1 && !hostname.trim())
            }
            className="h-9 px-5 text-sm gap-2"
          >
            {currentStep === 2 ? (isTrial ? 'Confirm & Start Trial' : 'Proceed to Payment') : 'Continue'} <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
