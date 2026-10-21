import { Suspense, lazy, type ComponentType } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Navbar, Footer } from './components/Shared';
import { LanguageProvider } from './i18n';
import { ToastProvider } from './components/Toast';
import { ExplainModeProvider } from './components/HelpTooltip';
import { ErrorBoundary } from './components/ErrorBoundary';

// ─── Eagerly loaded (homepage + primary routes) ───────────────────────────────
import { Home }       from './pages/Home';
import { InfrastructureOverview } from './pages/InfrastructureOverview';
import { Odp }        from './pages/Odp';
import { Contact }    from './pages/Contact';
import { NotFound }   from './pages/NotFound';

// Resilient React.lazy wrapper that retries transient network blips and never resolves with an undefined default export
function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
) {
  return lazy(async () => {
    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const mod = await factory();
        if (mod && typeof mod === 'object' && 'default' in mod && mod.default) {
          return mod;
        }
        throw new Error('Chunk resolved without a default component export');
      } catch (err) {
        lastError = err;
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, 350 * (attempt + 1)));
        }
      }
    }
    if (typeof window !== 'undefined' && !sessionStorage.getItem('chunk_reload_triggered')) {
      sessionStorage.setItem('chunk_reload_triggered', '1');
      try {
        const res = await fetch('/api/health', { method: 'HEAD', cache: 'no-store' });
        if (res.ok) {
          window.location.reload();
          return new Promise<{ default: T }>(() => {});
        }
      } catch {
        // Server momentarily unreachable; let ErrorBoundary handle without forcing browser ERR_CONNECTION_REFUSED
      }
    }
    throw lastError instanceof Error ? lastError : new Error('Failed to load page module');
  });
}

// ─── Lazily loaded ───────────────────────────────────────────────────────────
const InfrastructureCloud     = lazyWithRetry(() => import('./pages/InfrastructureCloud').then(m => ({ default: m.InfrastructureCloud })));
const InfrastructureDedicated = lazyWithRetry(() => import('./pages/InfrastructureDedicated').then(m => ({ default: m.InfrastructureDedicated })));
const InfrastructureManaged   = lazyWithRetry(() => import('./pages/InfrastructureManaged').then(m => ({ default: m.InfrastructureManaged })));
const InfrastructureStorage   = lazyWithRetry(() => import('./pages/InfrastructureStorage').then(m => ({ default: m.InfrastructureStorage })));
const OpenSource   = lazyWithRetry(() => import('./pages/OpenSource').then(m => ({ default: m.OpenSource })));
const About        = lazyWithRetry(() => import('./pages/About').then(m => ({ default: m.About })));
const Team         = lazyWithRetry(() => import('./pages/Team').then(m => ({ default: m.Team })));
const Pegasus      = lazyWithRetry(() => import('./pages/Pegasus').then(m => ({ default: m.Pegasus })));
const Vamos        = lazyWithRetry(() => import('./pages/Vamos').then(m => ({ default: m.Vamos })));
const Camos        = lazyWithRetry(() => import('./pages/Camos').then(m => ({ default: m.Camos })));
const Privacy      = lazyWithRetry(() => import('./pages/Privacy').then(m => ({ default: m.Privacy })));
const Terms        = lazyWithRetry(() => import('./pages/Terms').then(m => ({ default: m.Terms })));
const Imprint      = lazyWithRetry(() => import('./pages/Imprint').then(m => ({ default: m.Imprint })));
const HostingTerms = lazyWithRetry(() => import('./pages/HostingTerms').then(m => ({ default: m.HostingTerms })));
const Cancellation = lazyWithRetry(() => import('./pages/Cancellation').then(m => ({ default: m.Cancellation })));
const Aup          = lazyWithRetry(() => import('./pages/Aup').then(m => ({ default: m.Aup })));
const Dpa          = lazyWithRetry(() => import('./pages/Dpa').then(m => ({ default: m.Dpa })));
const Partners     = lazyWithRetry(() => import('./pages/Partners').then(m => ({ default: m.Partners })));
const Roadmap      = lazyWithRetry(() => import('./pages/Roadmap').then(m => ({ default: m.Roadmap })));

// ─── Dashboard Routes ────────────────────────────────────────────────────────
const DashboardLayout = lazyWithRetry(() => import('./pages/dashboard/Layout').then(m => ({ default: m.DashboardLayout })));
const DashboardOverview = lazyWithRetry(() => import('./pages/dashboard/Overview').then(m => ({ default: m.DashboardOverview })));
const NewService = lazyWithRetry(() => import('./pages/dashboard/NewService').then(m => ({ default: m.NewService })));

const VpsList = lazyWithRetry(() => import('./pages/dashboard/VpsList').then(m => ({ default: m.VpsList })));
const VpsDetail = lazyWithRetry(() => import('./pages/dashboard/VpsDetail').then(m => ({ default: m.VpsDetail })));
const DsList = lazyWithRetry(() => import('./pages/dashboard/DsList').then(m => ({ default: m.DsList })));
const DsDetail = lazyWithRetry(() => import('./pages/dashboard/DsDetail').then(m => ({ default: m.DsDetail })));
const OdpList = lazyWithRetry(() => import('./pages/dashboard/OdpList').then(m => ({ default: m.OdpList })));
const OdpDetail = lazyWithRetry(() => import('./pages/dashboard/OdpDetail').then(m => ({ default: m.OdpDetail })));
const SftpStorage = lazyWithRetry(() => import('./pages/dashboard/SftpStorage').then(m => ({ default: m.default })));

const SupportList = lazyWithRetry(() => import('./pages/dashboard/SupportList').then(m => ({ default: m.SupportList })));
const SupportDetail = lazyWithRetry(() => import('./pages/dashboard/SupportDetail').then(m => ({ default: m.SupportDetail })));

const ProfileLayout = lazyWithRetry(() => import('./pages/dashboard/profile/Layout').then(m => ({ default: m.ProfileLayout })));
const ProfileAccount = lazyWithRetry(() => import('./pages/dashboard/profile/Account').then(m => ({ default: m.ProfileAccount })));
const ProfileMfa = lazyWithRetry(() => import('./pages/dashboard/profile/Mfa').then(m => ({ default: m.ProfileMfa })));
const ProfileBilling = lazyWithRetry(() => import('./pages/dashboard/profile/Billing').then(m => ({ default: m.ProfileBilling })));
const ProfileLogs = lazyWithRetry(() => import('./pages/dashboard/profile/Logs').then(m => ({ default: m.ProfileLogs })));

// ─── Resources Routes ────────────────────────────────────────────────────────
const BlogList = lazyWithRetry(() => import('./pages/BlogList').then(m => ({ default: m.BlogList })));
const BlogDetail = lazyWithRetry(() => import('./pages/BlogDetail').then(m => ({ default: m.BlogDetail })));
const ForumList = lazyWithRetry(() => import('./pages/ForumList').then(m => ({ default: m.ForumList })));
const ForumCategory = lazyWithRetry(() => import('./pages/ForumCategory').then(m => ({ default: m.ForumCategory })));
const ForumThread = lazyWithRetry(() => import('./pages/ForumThread').then(m => ({ default: m.ForumThread })));

// ─── Report Routes ────────────────────────────────────────────────────────
const ReportLayout = lazyWithRetry(() => import('./pages/report/Layout').then(m => ({ default: m.ReportLayout })));
const ReportAbuse = lazyWithRetry(() => import('./pages/report/Abuse').then(m => ({ default: m.ReportAbuse })));
const ReportDmca = lazyWithRetry(() => import('./pages/report/Dmca').then(m => ({ default: m.ReportDmca })));
const ReportOther = lazyWithRetry(() => import('./pages/report/Other').then(m => ({ default: m.ReportOther })));

// ─── Docs Routes ──────────────────────────────────────────────────────────
const DocsLayout = lazyWithRetry(() => import('./pages/docs/Layout').then(m => ({ default: m.DocsLayout })));
const DocsOverview = lazyWithRetry(() => import('./pages/docs/Overview').then(m => ({ default: m.DocsOverview })));
const DocsArchitecture = lazyWithRetry(() => import('./pages/docs/Architecture').then(m => ({ default: m.DocsArchitecture })));
const DocsAuthentikGuide = lazyWithRetry(() => import('./pages/docs/AuthentikGuide').then(m => ({ default: m.DocsAuthentikGuide })));
const DocsApiReference = lazyWithRetry(() => import('./pages/docs/ApiReference').then(m => ({ default: m.DocsApiReference })));
const DocsRunbooks = lazyWithRetry(() => import('./pages/docs/Runbooks').then(m => ({ default: m.DocsRunbooks })));
const DocsProjects = lazyWithRetry(() => import('./pages/docs/Projects').then(m => ({ default: m.DocsProjects })));

const DocsStorefront = lazyWithRetry(() => import('./pages/docs/Storefront').then(m => ({ default: m.DocsStorefront })));
const StorefrontInstall = lazyWithRetry(() => import('./pages/docs/storefront/StorefrontInstall').then(m => ({ default: m.StorefrontInstall })));
const StorefrontConfig = lazyWithRetry(() => import('./pages/docs/storefront/StorefrontConfig').then(m => ({ default: m.StorefrontConfig })));
const StorefrontLifecycle = lazyWithRetry(() => import('./pages/docs/storefront/StorefrontLifecycle').then(m => ({ default: m.StorefrontLifecycle })));

const DocsVamos = lazyWithRetry(() => import('./pages/docs/Vamos').then(m => ({ default: m.DocsVamos })));
const VamosInstall = lazyWithRetry(() => import('./pages/docs/vamos/VamosInstall').then(m => ({ default: m.VamosInstall })));
const VamosConfig = lazyWithRetry(() => import('./pages/docs/vamos/VamosConfig').then(m => ({ default: m.VamosConfig })));
const VamosLifecycle = lazyWithRetry(() => import('./pages/docs/vamos/VamosLifecycle').then(m => ({ default: m.VamosLifecycle })));

const DocsCamos = lazyWithRetry(() => import('./pages/docs/Camos').then(m => ({ default: m.DocsCamos })));
const CamosInstall = lazyWithRetry(() => import('./pages/docs/camos/CamosInstall').then(m => ({ default: m.CamosInstall })));
const CamosConfig = lazyWithRetry(() => import('./pages/docs/camos/CamosConfig').then(m => ({ default: m.CamosConfig })));
const CamosLifecycle = lazyWithRetry(() => import('./pages/docs/camos/CamosLifecycle').then(m => ({ default: m.CamosLifecycle })));

const CustomerGettingStarted = lazyWithRetry(() => import('./pages/docs/customer/GettingStarted').then(m => ({ default: m.GettingStarted })));
const CustomerVpsGuide = lazyWithRetry(() => import('./pages/docs/customer/VpsGuide').then(m => ({ default: m.VpsGuide })));
const CustomerSftpGuide = lazyWithRetry(() => import('./pages/docs/customer/SftpGuide').then(m => ({ default: m.SftpGuide })));
const CustomerDedicatedGuide = lazyWithRetry(() => import('./pages/docs/customer/DedicatedGuide').then(m => ({ default: m.DedicatedGuide })));
const CustomerBillingGuide = lazyWithRetry(() => import('./pages/docs/customer/BillingGuide').then(m => ({ default: m.BillingGuide })));
const CustomerSupportGuide = lazyWithRetry(() => import('./pages/docs/customer/SupportGuide').then(m => ({ default: m.SupportGuide })));

// ─── Registration ────────────────────────────────────────────────────────────
const Register = lazyWithRetry(() => import('./pages/Register').then(m => ({ default: m.Register })));
const Login = lazyWithRetry(() => import('./pages/Login').then(m => ({ default: m.Login })));
const VerifyEmail = lazyWithRetry(() => import('./pages/VerifyEmail').then(m => ({ default: m.VerifyEmail })));
const PartnerLanding = lazyWithRetry(() => import('./pages/PartnerLanding').then(m => ({ default: m.PartnerLanding })));

// ─── Route definitions ───────────────────────────────────────────────────────

interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
}

const PAGE_ROUTES: RouteConfig[] = [
  { path: '/', element: <Home /> },
  { path: '/infrastructure', element: <InfrastructureOverview /> },
  { path: '/infrastructure/cloud', element: <InfrastructureCloud /> },
  { path: '/infrastructure/dedicated', element: <InfrastructureDedicated /> },
  { path: '/infrastructure/managed', element: <InfrastructureManaged /> },
  { path: '/infrastructure/storage', element: <InfrastructureStorage /> },
  { path: '/deploy', element: <Odp /> },
  { 
    path: '/dashboard', 
    element: (
      <DashboardLayout />
    ),
    children: [
      { path: '', element: <DashboardOverview /> },
      { path: 'new', element: <NewService /> },
      { path: 'vps', element: <VpsList /> },
      { path: 'vps/:id', element: <VpsDetail /> },
      { path: 'ds', element: <DsList /> },
      { path: 'ds/:id', element: <DsDetail /> },
      { path: 'odp', element: <OdpList /> },
      { path: 'odp/:id', element: <OdpDetail /> },
      { path: 'sftp', element: <SftpStorage /> },
      { path: 'support', element: <SupportList /> },
      { path: 'support/:id', element: <SupportDetail /> },
      { 
        path: 'profile', 
        element: <ProfileLayout />,
        children: [
          { path: '', element: <ProfileAccount /> },
          { path: 'mfa', element: <ProfileMfa /> },
          { path: 'billing', element: <ProfileBilling /> },
          { path: 'logs', element: <ProfileLogs /> },
        ]
      },
    ]
  },
  { path: '/software', element: <Navigate to="/software/pegasus" replace /> },
  { path: '/software/pegasus', element: <Pegasus /> },
  { path: '/software/vamos', element: <Vamos /> },
  { path: '/software/camos', element: <Camos /> },
  { path: '/company', element: <Navigate to="/company/about" replace /> },
  { path: '/company/about', element: <About /> },
  { path: '/company/team', element: <Team /> },
  { path: '/company/open-source', element: <OpenSource /> },
  { path: '/company/contact', element: <Contact /> },
  { path: '/company/roadmap', element: <Roadmap /> },
  { path: '/roadmap', element: <Roadmap /> },
  { path: '/company/partners', element: <Partners /> },
  { path: '/company/partners/:partner', element: <PartnerLanding /> },
  { path: '/partners/:partner', element: <PartnerLanding /> },
  { path: '/resources', element: <Navigate to="/resources/blog" replace /> },
  { path: '/resources/blog', element: <BlogList /> },
  { path: '/resources/blog/:slug', element: <BlogDetail /> },
  { path: '/blog', element: <BlogList /> },
  { path: '/blog/:slug', element: <BlogDetail /> },

  { path: '/resources/forum', element: <ForumList /> },
  { path: '/resources/forum/:category', element: <ForumCategory /> },
  { path: '/resources/forum/:category/:threadId', element: <ForumThread /> },
  { 
    path: '/report', 
    element: <ReportLayout />,
    children: [
      { path: '', element: <Navigate to="/report/abuse" replace /> },
      { path: 'abuse', element: <ReportAbuse /> },
      { path: 'dmca', element: <ReportDmca /> },
      { path: 'other', element: <ReportOther /> },
    ]
  },
  { 
    path: '/docs', 
    element: <DocsLayout />,
    children: [
      { path: '', element: <DocsOverview /> },
      { path: 'customer', element: <Navigate to="/docs/customer/getting-started" replace /> },
      { path: 'customer/getting-started', element: <CustomerGettingStarted /> },
      { path: 'customer/vps', element: <CustomerVpsGuide /> },
      { path: 'customer/sftp', element: <CustomerSftpGuide /> },
      { path: 'customer/dedicated', element: <CustomerDedicatedGuide /> },
      { path: 'customer/billing', element: <CustomerBillingGuide /> },
      { path: 'customer/support', element: <CustomerSupportGuide /> },
      { path: 'architecture', element: <DocsArchitecture /> },
      { path: 'authentik', element: <DocsAuthentikGuide /> },
      { path: 'api', element: <DocsApiReference /> },
      { path: 'runbooks', element: <DocsRunbooks /> },
      { path: 'projects', element: <DocsProjects /> },
      { path: 'projects/storefront', element: <DocsStorefront /> },
      { path: 'projects/storefront/install', element: <StorefrontInstall /> },
      { path: 'projects/storefront/config', element: <StorefrontConfig /> },
      { path: 'projects/storefront/lifecycle', element: <StorefrontLifecycle /> },
      { path: 'projects/vamos', element: <DocsVamos /> },
      { path: 'projects/vamos/install', element: <VamosInstall /> },
      { path: 'projects/vamos/config', element: <VamosConfig /> },
      { path: 'projects/vamos/lifecycle', element: <VamosLifecycle /> },
      { path: 'projects/camos', element: <DocsCamos /> },
      { path: 'projects/camos/install', element: <CamosInstall /> },
      { path: 'projects/camos/config', element: <CamosConfig /> },
      { path: 'projects/camos/lifecycle', element: <CamosLifecycle /> },
      { path: 'storefront', element: <Navigate to="/docs/projects/storefront" replace /> },
      { path: 'vamos', element: <Navigate to="/docs/projects/vamos" replace /> },
      { path: 'camos', element: <Navigate to="/docs/projects/camos" replace /> },
    ]
  },
  { path: '/register', element: <Register /> },
  { path: '/login', element: <Login /> },
  { path: '/verify-email', element: <VerifyEmail /> },
  { path: '/ps/:partner', element: <PartnerLanding /> },
  { path: '/profile', element: <Navigate to="/dashboard/profile" replace /> },
  { path: '/legal', element: <Navigate to="/legal/privacy" replace /> },
  { path: '/legal/privacy', element: <Privacy /> },
  { path: '/legal/terms', element: <Terms /> },
  { path: '/legal/imprint', element: <Imprint /> },
  { path: '/legal/hosting-terms', element: <HostingTerms /> },
  { path: '/legal/cancellation', element: <Cancellation /> },
  { path: '/legal/aup', element: <Aup /> },
  { path: '/legal/dpa', element: <Dpa /> },
];

const REDIRECT_ROUTES: RouteConfig[] = [
  { path: '/hosting', element: <Navigate to="/infrastructure" replace /> },
  { path: '/de/hosting', element: <Navigate to="/de/infrastructure" replace /> },
  { path: '/storage', element: <Navigate to="/infrastructure/storage" replace /> },
  { path: '/de/storage', element: <Navigate to="/de/infrastructure/storage" replace /> },
  { path: '/sftp', element: <Navigate to="/infrastructure/storage" replace /> },
  { path: '/de/sftp', element: <Navigate to="/de/infrastructure/storage" replace /> },
  { path: '/cloud', element: <Navigate to="/infrastructure/cloud" replace /> },
  { path: '/de/cloud', element: <Navigate to="/de/infrastructure/cloud" replace /> },
  { path: '/dedicated', element: <Navigate to="/infrastructure/dedicated" replace /> },
  { path: '/de/dedicated', element: <Navigate to="/de/infrastructure/dedicated" replace /> },
  { path: '/managed', element: <Navigate to="/infrastructure/managed" replace /> },
  { path: '/de/managed', element: <Navigate to="/de/infrastructure/managed" replace /> },
  { path: '/odp', element: <Navigate to="/deploy" replace /> },
  { path: '/de/odp', element: <Navigate to="/de/deploy" replace /> },
  { path: '/infrastructure/odp', element: <Navigate to="/deploy" replace /> },
  { path: '/de/infrastructure/odp', element: <Navigate to="/de/deploy" replace /> },
  { path: '/pegasus', element: <Navigate to="/software/pegasus" replace /> },
  { path: '/about', element: <Navigate to="/company/about" replace /> },
  { path: '/team', element: <Navigate to="/company/team" replace /> },
  { path: '/open-source', element: <Navigate to="/company/open-source" replace /> },
  { path: '/contact', element: <Navigate to="/company/contact" replace /> },
  { path: '/partners', element: <Navigate to="/company/partners" replace /> },
  { path: '/principles', element: <Navigate to="/company/about" replace /> },
  { path: '/projects', element: <Navigate to="/company/open-source" replace /> },
  { path: '/privacy', element: <Navigate to="/legal/privacy" replace /> },
  { path: '/terms', element: <Navigate to="/legal/terms" replace /> },
  { path: '/imprint', element: <Navigate to="/legal/imprint" replace /> },
  { path: '/hosting-terms', element: <Navigate to="/legal/hosting-terms" replace /> },
  { path: '/blog', element: <Navigate to="/resources/blog" replace /> },
  { path: '/cancellation', element: <Navigate to="/legal/cancellation" replace /> },
  { path: '/aup', element: <Navigate to="/legal/aup" replace /> },
  { path: '/dpa', element: <Navigate to="/legal/dpa" replace /> },
];

function renderRoutes(prefix: string, routes: RouteConfig[] = PAGE_ROUTES) {
  return routes.map(({ path, element, children }) => (
    <Route
      key={`${prefix}${path}`}
      path={prefix + (path === '/' && prefix ? '' : path)}
      element={element}
    >
      {children && renderRoutes('', children)}
    </Route>
  ));
}


function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>
      {!isDashboard && <Navbar />}
      <main id="main-content" className="flex-1 flex flex-col">
        <ErrorBoundary key={location.pathname}>
          <Suspense fallback={
            <div className="flex-1 flex items-center justify-center min-h-[40vh] p-8">
              <div className="flex flex-col items-center gap-3 text-[var(--text-muted)]">
                <div className="w-5 h-5 border border-white/20 border-t-white rounded-full animate-spin" />
                <span className="text-[11px] font-mono text-[var(--text-faint)]">Loading...</span>
              </div>
            </div>
          }>
            <Routes>
              {/* ─── German locale routes (/de/...) ─────────────────── */}
              {renderRoutes('/de')}

              {/* ─── Default (English) routes ───────────────────────── */}
              {renderRoutes('')}

              {/* ─── Redirects (old routes → new routes) ────────────── */}
              {REDIRECT_ROUTES.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}

              {/* ─── Auth ───────────────────────────────────────────── */}
              <Route path="/login" element={<Login />} />

              {/* ─── 404 ────────────────────────────────────────────── */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <ToastProvider>
          <LanguageProvider>
            <ExplainModeProvider>
              <AppContent />
            </ExplainModeProvider>
          </LanguageProvider>
        </ToastProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}
