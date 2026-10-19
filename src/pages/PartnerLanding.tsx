import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Server, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  HardDrive
} from 'lucide-react';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';
import { api } from '../lib/api';
import { isAuthenticated } from '../lib/auth';
import { SeoHead } from '../components/SeoHead';

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

export function PartnerLanding({ defaultPartnerSlug }: { defaultPartnerSlug?: string } = {}) {
  const { partner: routeSlug } = useParams<{ partner: string }>();
  const slug = routeSlug || defaultPartnerSlug;
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
        <div className="w-12 h-12 flex items-center justify-center text-red-500 mb-4">
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
        <div className="flex flex-wrap items-center justify-center gap-3">
          <LocaleLink 
            to="/company/partners" 
            className="vs-btn-primary"
          >
            {locale === 'de' ? 'Partner ansehen' : 'View Partners'}
            <ArrowRight className="w-4 h-4" />
          </LocaleLink>
          <LocaleLink 
            to="/infrastructure/cloud" 
            className="vs-btn-secondary"
          >
            {locale === 'de' ? 'Alle Cloud-Instanzen ansehen' : 'Explore Cloud Instances'}
          </LocaleLink>
        </div>
      </div>
    );
  }

  const { partner, product } = data;
  const trialDays = partner.trial_days || product.trial_days || 14;
  const priceNum = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const monthlyPriceVat = (priceNum * 1.19).toFixed(2);
  const specs = (product.specs || {}) as Record<string, any>;

  return (
    <div className="flex flex-col w-full pb-28 bg-[var(--bg)] text-[var(--fg)]">
      <SeoHead
        title={`${partner.name} × VaultScope — Exclusive Partner Offer`}
        description={partner.description || partner.headline || `Claim your free ${trialDays}-day trial sponsored by ${partner.name}.`}
        path={`/ps/${partner.slug}`}
      />
      {/* Hero Header */}
      <section className="pt-28 pb-14 lg:pt-36 lg:pb-16">
        <div className="vs-container">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--accent-bright)] mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-bright)]" />
            VaultScope × {partner.name} — {partner.badge_text || (locale === 'de' ? 'Exklusive Partnerschaft' : 'Partner Offer')}
          </motion.p>

          <motion.h1 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-display-xl text-[var(--fg)] max-w-4xl mb-5"
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
            className="text-body-l text-[var(--fg-muted)] max-w-[64ch]"
          >
            {partner.description || (
              locale === 'de'
                ? `Testen Sie Cloud-Infrastruktur für ${trialDays} Tage kostenlos. Keine Vorauszahlung, jederzeit kündbar.`
                : `Deploy cloud infrastructure for ${trialDays} days free of charge. Zero upfront cost, cancel anytime with one click.`
            )}
          </motion.p>
        </div>
      </section>

      {/* Main Conversion Section */}
      <section className="py-10 lg:py-14">
        <div className="vs-container">
          {orderSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 max-w-2xl"
            >
              <div className="w-12 h-12 text-emerald-400 flex items-center justify-start mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight mb-3 text-[var(--fg)]">
                {locale === 'de' ? 'Testversion erfolgreich aktiviert!' : 'Trial Successfully Activated!'}
              </h2>
              <p className="text-[var(--fg-muted)] mb-8 max-w-lg text-sm leading-relaxed">
                {locale === 'de'
                  ? `Ihre ${product.name} Instanz wird nun automatisch bereitgestellt. Sie können den Status und Zugangsdaten in Ihrem Dashboard einsehen.`
                  : `Your ${product.name} instance is now being automatically provisioned. You can access IP and connection credentials in your dashboard.`}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate(localePath(product.category === 'sftp' ? '/dashboard/sftp' : '/dashboard/vps'))}
                  className="vs-btn-primary"
                >
                  {locale === 'de' ? 'Zum Dashboard' : 'Open Dashboard'}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate(localePath('/dashboard'))}
                  className="vs-btn-secondary"
                >
                  {locale === 'de' ? 'Übersicht' : 'Overview'}
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Product Specification Ledger */}
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="lg:col-span-7 flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[var(--accent-bright)] font-mono block mb-1.5">
                      {product.category.toUpperCase()} INSTANCE
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--fg)]">{product.name}</h3>
                  </div>
                  <div className="px-3 py-1.5 border border-[var(--line)] text-xs font-mono text-[var(--fg)] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[var(--accent-bright)]" />
                    {locale === 'de' ? `${trialDays}-Tage-Testversion` : `${trialDays}-Day Free Trial`}
                  </div>
                </div>

                {/* Specs list */}
                <div className="space-y-3 mb-8">
                  <div className="text-xs uppercase tracking-wider text-[var(--fg-faint)] font-mono">
                    {locale === 'de' ? 'Spezifikationen' : 'Specifications'}
                  </div>
                  <div className="divide-y divide-[var(--line)]">
                    {specs && Object.keys(specs).length > 0 ? (
                      Object.entries(specs).map(([key, val]) => (
                        <div key={key} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                          <span className="text-xs text-[var(--fg-muted)] capitalize">{key.replace('_', ' ')}</span>
                          <span className="text-sm font-medium font-mono text-[var(--fg)] break-words">{String(val)}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="py-3 flex items-center justify-between gap-4">
                          <span className="text-xs text-[var(--fg-muted)]">{locale === 'de' ? 'Kategorie' : 'Category'}</span>
                          <span className="text-sm font-medium font-mono uppercase text-[var(--fg)]">{product.category}</span>
                        </div>
                        <div className="py-3 flex items-center justify-between gap-4">
                          <span className="text-xs text-[var(--fg-muted)]">{locale === 'de' ? 'Abrechnung' : 'Billing Cycle'}</span>
                          <span className="text-sm font-medium font-mono text-[var(--fg)]">{product.billing_cycle || 'monthly'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Storage Quota Information */}
                {((product.category || '').toLowerCase().includes('storage') || (product.category || '').toLowerCase().includes('sftp') || product.provider === 'sftpgo') && (
                  <div className="pt-4 mb-6 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[var(--fg)] uppercase tracking-wider">
                      <HardDrive className="w-3.5 h-3.5 text-[var(--accent-bright)] shrink-0" />
                      <span>{locale === 'de' ? 'Speicherkapazität & Automatisches Upgrade' : 'Storage Quota & Automatic Upgrade'}</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-[var(--fg-muted)]">
                        {locale === 'de' ? `Speicherplatz während der ${trialDays}-Tage-Testphase:` : `Storage during ${trialDays}-day trial:`}
                      </span>
                      <strong className="font-mono text-[var(--fg)] text-sm">
                        {partner.trial_quota_gb || 25} GB
                      </strong>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2">
                      <span className="text-[var(--fg-muted)]">
                        {locale === 'de' ? 'Automatisches Upgrade auf regulären Tarif:' : 'Automatic upgrade to regular plan:'}
                      </span>
                      <strong className="font-mono text-[var(--fg)] text-sm">
                        {product.quota_gb || 150} GB
                      </strong>
                    </div>
                  </div>
                )}

                {/* Pricing summary */}
                <div className="pt-4 mt-auto">
                  {priceNum > 0 ? (
                    <>
                      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                        <span className="text-sm text-[var(--fg-muted)]">
                          {locale === 'de' ? `Kosten während der ${trialDays}-Tage-Testphase:` : `Price during ${trialDays}-day trial period:`}
                        </span>
                        <div className="flex items-baseline gap-2 font-mono">
                          <span className="text-sm line-through text-[var(--fg-faint)]">€{monthlyPriceVat}</span>
                          <span className="text-2xl font-bold text-emerald-500">€0.00</span>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--fg-faint)] sm:text-right">
                        {locale === 'de' 
                          ? `Danach regulär €${monthlyPriceVat} / Monat inkl. MwSt. Jederzeit vor Ablauf kündbar.` 
                          : `Then regular €${monthlyPriceVat} / mo incl. VAT. Cancel anytime prior.`}
                      </p>
                    </>
                  ) : (
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-[var(--fg-muted)]">
                        {locale === 'de' ? 'Tarif-Gebühr:' : 'Plan Price:'}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-emerald-500 font-mono">
                          {locale === 'de' ? 'Kostenlos' : 'Free'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Right Column: Activation / CTA */}
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="lg:col-span-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2 text-[var(--fg)]">
                    <Zap className="w-5 h-5 text-[var(--accent-bright)]" />
                    <h4 className="text-xl font-semibold text-[var(--fg)]">
                      {locale === 'de' ? 'Jetzt Testzugang sichern' : 'Claim Trial Access'}
                    </h4>
                  </div>
                  <p className="text-sm text-[var(--fg-muted)] mb-6 leading-relaxed">
                    {locale === 'de'
                      ? `Sofortige Bereitstellung über die VaultScope-Plattform in Kooperation mit ${partner.name}.`
                      : `Instant automated provisioning in co-operation with ${partner.name}.`}
                  </p>

                  {orderError && (
                    <div className="text-red-400 text-xs py-2 mb-5 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{orderError}</span>
                    </div>
                  )}

                  {data.partner.limit_one_per_user !== false && (
                    <div className="py-2 text-xs text-[var(--fg-muted)] flex items-center gap-2 mb-5">
                      <ShieldCheck className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
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
                        <div className="text-amber-400 text-xs py-3 space-y-2">
                          <div className="flex items-center gap-2 font-semibold">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{locale === 'de' ? 'Testphasen-Limit erreicht (1 pro Person)' : 'Trial Limit Reached (1 per Person)'}</span>
                          </div>
                          <p className="leading-relaxed text-[var(--fg-muted)]">
                            {locale === 'de'
                              ? 'Für diesen Account wurde bereits eine kostenlose Testphase beansprucht. Um Missbrauch zu verhindern, ist jede Partner-Testphase auf maximal 1 pro Person/Account limitiert.'
                              : 'A free trial has already been claimed under this account. Partnership trials are strictly limited to one per customer.'}
                          </p>
                        </div>

                        <Link
                          to={localePath('/dashboard')}
                          className="w-full vs-btn-primary justify-center"
                        >
                          <span>{locale === 'de' ? 'Aktive Dienste im Dashboard öffnen' : 'Open Dashboard'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--fg-muted)] mb-1.5">
                            {locale === 'de' ? 'Hostname (optional)' : 'Server Hostname (optional)'}
                          </label>
                          <input
                            type="text"
                            value={hostname}
                            onChange={e => setHostname(e.target.value)}
                            placeholder="e.g. cloud-node-01"
                            className="vs-input"
                          />
                        </div>

                        <div className="py-3 text-xs text-[var(--fg-muted)] space-y-1.5">
                          <div className="flex justify-between">
                            <span>{locale === 'de' ? 'Fällig heute:' : 'Due today:'}</span>
                            <span className="font-semibold text-emerald-500 font-mono">€0.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{locale === 'de' ? 'Testdauer:' : 'Trial duration:'}</span>
                            <span className="font-medium text-[var(--fg)] font-mono">{trialDays} {locale === 'de' ? 'Tage' : 'days'}</span>
                          </div>
                        </div>

                        <button
                          onClick={handleOrderTrial}
                          disabled={ordering}
                          className="w-full vs-btn-primary justify-center mt-2"
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
                      <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                        {locale === 'de' 
                          ? 'Um Ihren exklusiven Partner-Testzugang freizuschalten, erstellen Sie bitte ein kostenloses VaultScope-Konto oder melden Sie sich an.' 
                          : 'To activate your partner trial, create a free VaultScope account or log in to your existing account.'}
                      </p>

                      <LocaleLink
                        to={`/register?redirect=${encodeURIComponent(currentPath)}`}
                        className="w-full vs-btn-primary justify-center"
                      >
                        <span>{locale === 'de' ? 'Konto erstellen & Test starten' : 'Create Account & Claim Trial'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </LocaleLink>

                      <LocaleLink
                        to={`/login?redirect=${encodeURIComponent(currentPath)}`}
                        className="w-full vs-btn-secondary justify-center"
                      >
                        <span>{locale === 'de' ? 'Bereits registriert? Hier anmelden' : 'Already have an account? Sign in'}</span>
                      </LocaleLink>
                    </div>
                  )}
                </div>

                {/* Trust guarantee micro-copy */}
                <div className="pt-6 mt-6 space-y-2 text-xs text-[var(--fg-muted)]">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{locale === 'de' ? 'Keine Zahlungsdaten heute erforderlich' : 'Zero payment due today'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{locale === 'de' ? '1-Klick Kündigung direkt im Dashboard' : '1-click cancellation in dashboard'}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Guarantees / Features Open Grid */}
          <div className="grid md:grid-cols-3 gap-10 lg:gap-12 mt-20">
            <div>
              <ShieldCheck className="w-5 h-5 text-[var(--accent-bright)] mb-3" />
              <h5 className="font-semibold text-base text-[var(--fg)] mb-1.5">
                {locale === 'de' ? 'Europäische Datensouveränität' : 'European Data Sovereignty'}
              </h5>
              <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
                {locale === 'de'
                  ? 'Europäische Datenhaltung mit DSGVO-Konformität ohne Drittanbieter-Tracking.'
                  : 'Strict GDPR adherence, European data residency, and zero third-party telemetry or tracking.'}
              </p>
            </div>

            <div>
              <Server className="w-5 h-5 text-[var(--accent-bright)] mb-3" />
              <h5 className="font-semibold text-base text-[var(--fg)] mb-1.5">
                {locale === 'de' ? 'Dedizierte Ressourcen' : 'Unthrottled Evaluation'}
              </h5>
              <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
                {locale === 'de'
                  ? 'Keine künstlichen Drosselungen in der Testphase. Voller Zugriff auf die zugewiesene Instanzleistung.'
                  : 'No artificial throttles during evaluation. Full access to your allocated instance resources.'}
              </p>
            </div>

            <div>
              <Zap className="w-5 h-5 text-[var(--accent-bright)] mb-3" />
              <h5 className="font-semibold text-base text-[var(--fg)] mb-1.5">
                {locale === 'de' ? 'Automatisiertes Provisioning' : 'Automated Provisioning'}
              </h5>
              <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
                {locale === 'de'
                  ? 'Ihre Instanz wird vollautomatisch über VAMOS eingerichtet und im Dashboard bereitgestellt.'
                  : 'Your instance is automatically provisioned via VAMOS and ready in your customer dashboard.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
