import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Server, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  HardDrive
} from 'lucide-react';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';
import { api } from '../lib/api';
import { isAuthenticated } from '../lib/auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface PartnerInfo {
  id: string;
  slug: string;
  name: string;
  headline?: string | null;
  description?: string | null;
  badge_text?: string | null;
  trial_days?: number | null;
  trial_quota_gb?: number | null;
  quota_gb?: number | null;
  limit_one_per_user?: boolean | null;
}

interface ProductInfo {
  id: string;
  name: string;
  slug: string;
  category: string;
  provider: string;
  target: string;
  specs: Record<string, any>;
  price: string | number;
  billing_cycle: string;
  trial_days?: number | null;
  trial_quota_gb?: number | null;
  quota_gb?: number | null;
}

interface PartnerPayload {
  partner: PartnerInfo;
  product: ProductInfo;
}

export function PartnerLanding() {
  const { partner: slug } = useParams<{ partner: string }>();
  const navigate = useNavigate();
  const { locale, localePath } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PartnerPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [hostname, setHostname] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [alreadyClaimedTrial, setAlreadyClaimedTrial] = useState(false);

  const isAuth = isAuthenticated();

  useEffect(() => {
    if (isAuth) {
      api.get<any[]>('/storefront/services')
        .then(services => {
          if (Array.isArray(services) && services.some(s => s.is_trial)) {
            setAlreadyClaimedTrial(true);
          }
        })
        .catch(() => {});
    }
  }, [isAuth]);

  useEffect(() => {
    if (!slug) {
      setError('No partner specified.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/storefront/ps/${encodeURIComponent(slug)}`)
      .then(async res => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || 'Partner promotion not found or expired.');
        }
        return res.json();
      })
      .then((res: PartnerPayload) => {
        setData(res);
        setHostname(`${res.partner.slug}-node`);
        document.title = `${res.partner.name} × VaultScope | Exclusive Trial`;
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  const handleOrderTrial = async () => {
    if (!data) return;
    setOrdering(true);
    setOrderError(null);

    try {
      await api.post('/storefront/orders', {
        product_id: data.product.id,
        hostname: hostname.trim() || undefined,
        partner_slug: data.partner.slug,
      });

      setOrderSuccess(true);
    } catch (err: any) {
      setOrderError(err?.message || 'Failed to activate trial service. Please try again.');
    } finally {
      setOrdering(false);
    }
  };

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : `/ps/${slug}`;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mb-4" />
        <p className="text-sm text-foreground/50 font-mono tracking-wider">
          {locale === 'de' ? 'Partner-Aktion wird geladen...' : 'Loading partner offer...'}
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-medium tracking-tight mb-2">
          {locale === 'de' ? 'Partner-Angebot nicht gefunden' : 'Partner Offer Not Found'}
        </h1>
        <p className="text-foreground/50 max-w-md mb-8 text-sm">
          {error || (locale === 'de' 
            ? 'Diese Partner-Aktion existiert nicht oder ist bereits abgelaufen.' 
            : 'This partner promotion does not exist or has expired.')}
        </p>
        <LocaleLink 
          to="/infrastructure/cloud" 
          className="border border-border px-6 py-2.5 text-sm hover:border-foreground/40 transition-colors inline-flex items-center gap-2"
        >
          {locale === 'de' ? 'Alle Cloud-Instanzen ansehen' : 'Explore Cloud Instances'}
          <ArrowRight className="w-4 h-4" />
        </LocaleLink>
      </div>
    );
  }

  const { partner, product } = data;
  const trialDays = partner.trial_days || product.trial_days || 14;
  const priceNum = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const monthlyPriceVat = (priceNum * 1.19).toFixed(2);
  const specs = (product.specs || {}) as Record<string, any>;

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Hero Header */}
      <section className="pt-32 pb-16 border-b border-border/10 bg-radial-[circle_at_top,_var(--tw-gradient-stops)] from-blue-900/10 via-transparent to-transparent">
        <div className="container mx-auto px-6 lg:px-12 text-center max-w-4xl">
          {/* Partner & VaultScope Co-brand Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-medium text-blue-400 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>VaultScope × {partner.name}</span>
            <span className="w-1 h-1 rounded-full bg-blue-400/40 mx-0.5" />
            <span className="text-foreground/80">{partner.badge_text || (locale === 'de' ? 'Exklusive Partnerschaft' : 'Exclusive Partner Special')}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 text-foreground"
          >
            {partner.headline || (
              locale === 'de' 
                ? `Kostenloser ${trialDays}-Tage-Test für ${partner.name}-Kunden` 
                : `${trialDays}-Day Free Cloud Trial for ${partner.name} Community`
            )}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto font-light leading-relaxed"
          >
            {partner.description || (
              locale === 'de'
                ? `Testen Sie Premium-Cloud-Infrastruktur für ${trialDays} Tage komplett kostenlos. Keine Vorauszahlung, jederzeit kündbar.`
                : `Deploy high-performance cloud infrastructure for ${trialDays} days completely free. Zero upfront cost, cancel anytime with one click.`
            )}
          </motion.p>
        </div>
      </section>

      {/* Main Conversion Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          {orderSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border border-green-500/30 bg-green-500/5 p-8 md:p-12 text-center rounded-sm max-w-2xl mx-auto"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-medium tracking-tight mb-3">
                {locale === 'de' ? 'Testversion erfolgreich aktiviert!' : 'Trial Successfully Activated!'}
              </h2>
              <p className="text-foreground/70 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                {locale === 'de'
                  ? `Ihre ${product.name} Instanz wird nun automatisch bereitgestellt. Sie können den Status und Zugangsdaten in Ihrem Dashboard einsehen.`
                  : `Your ${product.name} instance is now being automatically provisioned. You can access IP and connection credentials in your dashboard.`}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate(localePath(product.category === 'sftp' ? '/dashboard/sftp' : '/dashboard/vps'))}
                  className="bg-foreground text-background font-medium px-6 py-3 text-sm hover:bg-foreground/90 transition-colors inline-flex items-center justify-center gap-2"
                >
                  {locale === 'de' ? 'Zum Dashboard' : 'Open Dashboard'}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate(localePath('/dashboard'))}
                  className="border border-border text-foreground font-medium px-6 py-3 text-sm hover:border-foreground/40 transition-colors"
                >
                  {locale === 'de' ? 'Übersicht' : 'Overview'}
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Product Spotlight Card */}
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="lg:col-span-7 border border-border bg-background p-8 relative flex flex-col justify-between"
              >
                {/* Banner overlay */}
                <div className="flex items-center justify-between pb-6 border-b border-border mb-6">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-foreground/40 font-mono block mb-1">
                      {product.category.toUpperCase()} INSTANCE
                    </span>
                    <h3 className="text-2xl font-medium tracking-tight">{product.name}</h3>
                  </div>
                  <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-sm flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {trialDays}-Day Free Trial
                  </div>
                </div>

                {/* Specs list */}
                <div className="space-y-4 mb-8">
                  <div className="text-xs uppercase tracking-wider text-foreground/40 font-mono">
                    {locale === 'de' ? 'Hardware-Spezifikationen' : 'Included Hardware Specs'}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {specs && Object.keys(specs).length > 0 ? (
                      Object.entries(specs).map(([key, val]) => (
                        <div key={key} className="border border-border/40 p-3 bg-muted/5">
                          <div className="text-xs text-foreground/50 capitalize">{key.replace('_', ' ')}</div>
                          <div className="text-sm font-medium mt-0.5">{String(val)}</div>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="border border-border/40 p-3 bg-muted/5">
                          <div className="text-xs text-foreground/50">Location</div>
                          <div className="text-sm font-medium mt-0.5">Nuremberg (FSN1)</div>
                        </div>
                        <div className="border border-border/40 p-3 bg-muted/5">
                          <div className="text-xs text-foreground/50">Port Speed</div>
                          <div className="text-sm font-medium mt-0.5">1 Gbps Unmetered</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Storage Quota Information */}
                {((product.category || '').toLowerCase().includes('storage') || (product.category || '').toLowerCase().includes('sftp') || product.provider === 'sftpgo') && (
                  <div className="border border-cyan-500/20 bg-cyan-500/5 p-4 rounded-sm mb-6 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>{locale === 'de' ? 'Speicherkapazität & Automatisches Upgrade' : 'Storage Quota & Automatic Upgrade'}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground/70">
                        {locale === 'de' ? `Speicherplatz während der ${trialDays}-Tage-Testphase:` : `Storage during ${trialDays}-day trial:`}
                      </span>
                      <strong className="font-mono text-cyan-400 text-sm">
                        {partner.trial_quota_gb || 25} GB
                      </strong>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-cyan-500/10">
                      <span className="text-foreground/70">
                        {locale === 'de' ? 'Automatisches Upgrade auf regulären Tarif:' : 'Automatic upgrade to regular plan:'}
                      </span>
                      <strong className="font-mono text-cyan-300 text-sm">
                        {product.quota_gb || 150} GB
                      </strong>
                    </div>
                  </div>
                )}

                {/* Pricing summary */}
                <div className="border-t border-border pt-6 mt-auto">
                  {priceNum > 0 ? (
                    <>
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-sm text-foreground/60">
                          {locale === 'de' ? `Kosten während der ${trialDays}-Tage-Testphase:` : `Price during ${trialDays}-day trial period:`}
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm line-through text-foreground/40">€{monthlyPriceVat}</span>
                          <span className="text-2xl font-bold text-green-500">€0.00</span>
                        </div>
                      </div>
                      <p className="text-xs text-foreground/50 text-right">
                        {locale === 'de' 
                          ? `Danach regulär €${monthlyPriceVat} / Monat inkl. MwSt. Jederzeit vor Ablauf kündbar.` 
                          : `Then regular €${monthlyPriceVat} / mo incl. VAT. Cancel anytime prior.`}
                      </p>
                    </>
                  ) : (
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-foreground/60">
                        {locale === 'de' ? 'Tarif-Gebühr:' : 'Plan Price:'}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-green-500">
                          {locale === 'de' ? 'Kostenlos' : 'Free'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Right Column: Activation / CTA Card */}
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="lg:col-span-5 border border-blue-600/40 bg-blue-950/5 p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2 text-blue-500">
                    <Zap className="w-5 h-5" />
                    <h4 className="text-lg font-medium text-foreground">
                      {locale === 'de' ? 'Jetzt Testzugang sichern' : 'Claim Trial Access'}
                    </h4>
                  </div>
                  <p className="text-xs text-foreground/60 mb-6 leading-relaxed">
                    {locale === 'de'
                      ? `Sofortige Bereitstellung über die VaultScope-Plattform in Kooperation mit ${partner.name}.`
                      : `Instant automated provisioning in co-operation with ${partner.name}.`}
                  </p>

                  {orderError && (
                    <div className="border border-red-500/20 bg-red-500/5 text-red-500 text-xs p-3 mb-5 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{orderError}</span>
                    </div>
                  )}

                  {data.partner.limit_one_per_user !== false && (
                    <div className="border border-border/40 bg-foreground/[0.02] p-2.5 rounded text-xs text-foreground/70 flex items-center gap-2 mb-4">
                      <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>
                        {locale === 'de'
                          ? 'Gültig für Neukunden: Maximal 1 Einlösung pro Person/Account.'
                          : 'Valid for new customers: Strictly limited to 1 claim per user.'}
                      </span>
                    </div>
                  )}

                  {isAuth ? (
                    alreadyClaimedTrial && data.partner.limit_one_per_user !== false ? (
                      <div className="space-y-4">
                        <div className="border border-amber-500/30 bg-amber-500/10 text-amber-500 text-xs p-4 space-y-2">
                          <div className="flex items-center gap-2 font-semibold">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{locale === 'de' ? 'Testphasen-Limit erreicht (1 pro Person)' : 'Trial Limit Reached (1 per Person)'}</span>
                          </div>
                          <p className="leading-relaxed text-foreground/80">
                            {locale === 'de'
                              ? 'Für diesen Account wurde bereits eine kostenlose Testphase beansprucht. Um Missbrauch zu verhindern, ist jede Partner-Testphase auf maximal 1 pro Person/Account limitiert.'
                              : 'A free trial has already been claimed under this account. Partnership trials are strictly limited to one per customer.'}
                          </p>
                        </div>

                        <Link
                          to={localePath('/dashboard')}
                          className="w-full bg-foreground text-background font-medium py-3 text-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <span>{locale === 'de' ? 'Aktive Dienste im Dashboard öffnen' : 'Open Dashboard'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-foreground/60 mb-1.5">
                            {locale === 'de' ? 'Hostname (optional)' : 'Server Hostname (optional)'}
                          </label>
                          <input
                            type="text"
                            value={hostname}
                            onChange={e => setHostname(e.target.value)}
                            placeholder="e.g. cloud-node-01"
                            className="w-full bg-background border border-border px-3.5 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>

                        <div className="p-3 bg-muted/10 border border-border/40 text-xs text-foreground/70 space-y-1">
                          <div className="flex justify-between">
                            <span>{locale === 'de' ? 'Fällig heute:' : 'Due today:'}</span>
                            <span className="font-semibold text-green-500">€0.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{locale === 'de' ? 'Testdauer:' : 'Trial duration:'}</span>
                            <span className="font-medium text-foreground">{trialDays} {locale === 'de' ? 'Tage' : 'days'}</span>
                          </div>
                        </div>

                        <button
                          onClick={handleOrderTrial}
                          disabled={ordering}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 text-sm transition-colors flex items-center justify-center gap-2 mt-4"
                        >
                          {ordering ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>{locale === 'de' ? 'Wird aktiviert...' : 'Activating trial...'}</span>
                            </>
                          ) : (
                            <>
                              <span>{locale === 'de' ? `Testphase jetzt starten (${trialDays} Tage)` : `Start ${trialDays}-Day Free Trial`}</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    )
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/10 border border-border/50 text-xs text-foreground/70 leading-relaxed">
                        {locale === 'de' 
                          ? 'Um Ihren exklusiven Partner-Testzugang freizuschalten, erstellen Sie bitte ein kostenloses VaultScope-Konto oder melden Sie sich an.' 
                          : 'To activate your partner trial, create a free VaultScope account or log in to your existing account.'}
                      </div>

                      <LocaleLink
                        to={`/register?redirect=${encodeURIComponent(currentPath)}`}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 text-sm transition-colors flex items-center justify-center gap-2 block text-center"
                      >
                        <span>{locale === 'de' ? 'Konto erstellen & Test starten' : 'Create Account & Claim Trial'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </LocaleLink>

                      <LocaleLink
                        to={`/login?redirect=${encodeURIComponent(currentPath)}`}
                        className="w-full border border-border hover:border-foreground/40 text-foreground py-2.5 text-xs transition-colors flex items-center justify-center gap-1.5 block text-center"
                      >
                        <span>{locale === 'de' ? 'Bereits registriert? Hier anmelden' : 'Already have an account? Sign in'}</span>
                      </LocaleLink>
                    </div>
                  )}
                </div>

                {/* Trust guarantee micro-copy */}
                <div className="border-t border-border/40 pt-5 mt-6 space-y-2 text-xs text-foreground/50">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    <span>{locale === 'de' ? 'Keine Zahlungsdaten heute erforderlich' : 'Zero payment due today'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    <span>{locale === 'de' ? '1-Klick Kündigung direkt im Dashboard' : '1-click cancellation in dashboard'}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Guarantees / Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-border/20">
            <div className="border border-border/60 p-6 bg-background">
              <ShieldCheck className="w-5 h-5 text-blue-500 mb-3" />
              <h5 className="font-medium text-sm mb-1">
                {locale === 'de' ? 'Sicherheit & Datenschutz' : 'Certified Enterprise Security'}
              </h5>
              <p className="text-xs text-foreground/50 leading-relaxed">
                {locale === 'de'
                  ? 'ISO 27001 zertifizierte Rechenzentren, 100% europäische Datenhaltung ohne Drittanbieter-Tracking.'
                  : 'ISO 27001 certified facilities, strict GDPR adherence, and zero telemetry or overseas tracking.'}
              </p>
            </div>

            <div className="border border-border/60 p-6 bg-background">
              <Server className="w-5 h-5 text-blue-500 mb-3" />
              <h5 className="font-medium text-sm mb-1">
                {locale === 'de' ? 'Volle Enterprise-Leistung' : 'Full Dedicated Performance'}
              </h5>
              <p className="text-xs text-foreground/50 leading-relaxed">
                {locale === 'de'
                  ? 'Keine künstlichen Drosselungen in der Testphase. Voller Zugriff auf NVMe-I/O und 1 Gbit/s Uplink.'
                  : 'No throttles during evaluation. Full NVMe disk speeds and unshared 1 Gbps networking.'}
              </p>
            </div>

            <div className="border border-border/60 p-6 bg-background">
              <Zap className="w-5 h-5 text-blue-500 mb-3" />
              <h5 className="font-medium text-sm mb-1">
                {locale === 'de' ? 'Automatisiertes Provisioning' : 'Automated Provisioning'}
              </h5>
              <p className="text-xs text-foreground/50 leading-relaxed">
                {locale === 'de'
                  ? 'Ihre Instanz wird vollautomatisch innerhalb von 60 Sekunden eingerichtet und gestartet.'
                  : 'Your compute node is set up and powered on within 60 seconds through automated worker jobs.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
