import { Suspense, lazy } from 'react';
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


// ─── Lazily loaded ───────────────────────────────────────────────────────────
const InfrastructureCloud     = lazy(() => import('./pages/InfrastructureCloud').then(m => ({ default: m.InfrastructureCloud })));
const InfrastructureDedicated = lazy(() => import('./pages/InfrastructureDedicated').then(m => ({ default: m.InfrastructureDedicated })));
const InfrastructureManaged   = lazy(() => import('./pages/InfrastructureManaged').then(m => ({ default: m.InfrastructureManaged })));
const InfrastructureStorage   = lazy(() => import('./pages/InfrastructureStorage').then(m => ({ default: m.InfrastructureStorage })));
const OpenSource   = lazy(() => import('./pages/OpenSource').then(m => ({ default: m.OpenSource })));
const About        = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Team         = lazy(() => import('./pages/Team').then(m => ({ default: m.Team })));
const Pegasus      = lazy(() => import('./pages/Pegasus').then(m => ({ default: m.Pegasus })));
const Vamos        = lazy(() => import('./pages/Vamos').then(m => ({ default: m.Vamos })));
const Camos        = lazy(() => import('./pages/Camos').then(m => ({ default: m.Camos })));
const Pricing      = lazy(() => import('./pages/Pricing').then(m => ({ default: m.Pricing })));
const Privacy      = lazy(() => import('./pages/Privacy').then(m => ({ default: m.Privacy })));
const Terms        = lazy(() => import('./pages/Terms').then(m => ({ default: m.Terms })));
const Imprint      = lazy(() => import('./pages/Imprint').then(m => ({ default: m.Imprint })));
const HostingTerms = lazy(() => import('./pages/HostingTerms').then(m => ({ default: m.HostingTerms })));
const Cancellation = lazy(() => import('./pages/Cancellation').then(m => ({ default: m.Cancellation })));
const Aup          = lazy(() => import('./pages/Aup').then(m => ({ default: m.Aup })));
const Dpa          = lazy(() => import('./pages/Dpa').then(m => ({ default: m.Dpa })));

// ─── Dashboard Routes ────────────────────────────────────────────────────────
const DashboardLayout = lazy(() => import('./pages/dashboard/Layout').then(m => ({ default: m.DashboardLayout })));
const DashboardOverview = lazy(() => import('./pages/dashboard/Overview').then(m => ({ default: m.DashboardOverview })));
const NewService = lazy(() => import('./pages/dashboard/NewService').then(m => ({ default: m.NewService })));

const VpsList = lazy(() => import('./pages/dashboard/VpsList').then(m => ({ default: m.VpsList })));
const VpsDetail = lazy(() => import('./pages/dashboard/VpsDetail').then(m => ({ default: m.VpsDetail })));
const DsList = lazy(() => import('./pages/dashboard/DsList').then(m => ({ default: m.DsList })));
const DsDetail = lazy(() => import('./pages/dashboard/DsDetail').then(m => ({ default: m.DsDetail })));
const OdpList = lazy(() => import('./pages/dashboard/OdpList').then(m => ({ default: m.OdpList })));
const OdpDetail = lazy(() => import('./pages/dashboard/OdpDetail').then(m => ({ default: m.OdpDetail })));
const SftpStorage = lazy(() => import('./pages/dashboard/SftpStorage').then(m => ({ default: m.default })));

const SupportList = lazy(() => import('./pages/dashboard/SupportList').then(m => ({ default: m.SupportList })));
const SupportDetail = lazy(() => import('./pages/dashboard/SupportDetail').then(m => ({ default: m.SupportDetail })));

const ProfileLayout = lazy(() => import('./pages/dashboard/profile/Layout').then(m => ({ default: m.ProfileLayout })));
const ProfileAccount = lazy(() => import('./pages/dashboard/profile/Account').then(m => ({ default: m.ProfileAccount })));
const ProfileMfa = lazy(() => import('./pages/dashboard/profile/Mfa').then(m => ({ default: m.ProfileMfa })));
const ProfileBilling = lazy(() => import('./pages/dashboard/profile/Billing').then(m => ({ default: m.ProfileBilling })));
const ProfileLogs = lazy(() => import('./pages/dashboard/profile/Logs').then(m => ({ default: m.ProfileLogs })));

// ─── Resources Routes ────────────────────────────────────────────────────────
const BlogList = lazy(() => import('./pages/BlogList').then(m => ({ default: m.BlogList })));
const BlogDetail = lazy(() => import('./pages/BlogDetail').then(m => ({ default: m.BlogDetail })));
const ForumList = lazy(() => import('./pages/ForumList').then(m => ({ default: m.ForumList })));
const ForumCategory = lazy(() => import('./pages/ForumCategory').then(m => ({ default: m.ForumCategory })));
const ForumThread = lazy(() => import('./pages/ForumThread').then(m => ({ default: m.ForumThread })));

// ─── Report Routes ────────────────────────────────────────────────────────
const ReportLayout = lazy(() => import('./pages/report/Layout').then(m => ({ default: m.ReportLayout })));
const ReportAbuse = lazy(() => import('./pages/report/Abuse').then(m => ({ default: m.ReportAbuse })));
const ReportDmca = lazy(() => import('./pages/report/Dmca').then(m => ({ default: m.ReportDmca })));
const ReportOther = lazy(() => import('./pages/report/Other').then(m => ({ default: m.ReportOther })));

// ─── Docs Routes ──────────────────────────────────────────────────────────
const DocsLayout = lazy(() => import('./pages/docs/Layout').then(m => ({ default: m.DocsLayout })));
const DocsOverview = lazy(() => import('./pages/docs/Overview').then(m => ({ default: m.DocsOverview })));
const DocsArchitecture = lazy(() => import('./pages/docs/Architecture').then(m => ({ default: m.DocsArchitecture })));
const DocsAuthentikGuide = lazy(() => import('./pages/docs/AuthentikGuide').then(m => ({ default: m.DocsAuthentikGuide })));
const DocsApiReference = lazy(() => import('./pages/docs/ApiReference').then(m => ({ default: m.DocsApiReference })));
const DocsRunbooks = lazy(() => import('./pages/docs/Runbooks').then(m => ({ default: m.DocsRunbooks })));
const DocsProjects = lazy(() => import('./pages/docs/Projects').then(m => ({ default: m.DocsProjects })));

const DocsStorefront = lazy(() => import('./pages/docs/Storefront').then(m => ({ default: m.DocsStorefront })));
const StorefrontInstall = lazy(() => import('./pages/docs/storefront/StorefrontInstall').then(m => ({ default: m.StorefrontInstall })));
const StorefrontConfig = lazy(() => import('./pages/docs/storefront/StorefrontConfig').then(m => ({ default: m.StorefrontConfig })));
const StorefrontLifecycle = lazy(() => import('./pages/docs/storefront/StorefrontLifecycle').then(m => ({ default: m.StorefrontLifecycle })));

const DocsVamos = lazy(() => import('./pages/docs/Vamos').then(m => ({ default: m.DocsVamos })));
const VamosInstall = lazy(() => import('./pages/docs/vamos/VamosInstall').then(m => ({ default: m.VamosInstall })));
const VamosConfig = lazy(() => import('./pages/docs/vamos/VamosConfig').then(m => ({ default: m.VamosConfig })));
const VamosLifecycle = lazy(() => import('./pages/docs/vamos/VamosLifecycle').then(m => ({ default: m.VamosLifecycle })));

const DocsCamos = lazy(() => import('./pages/docs/Camos').then(m => ({ default: m.DocsCamos })));
const CamosInstall = lazy(() => import('./pages/docs/camos/CamosInstall').then(m => ({ default: m.CamosInstall })));
const CamosConfig = lazy(() => import('./pages/docs/camos/CamosConfig').then(m => ({ default: m.CamosConfig })));
const CamosLifecycle = lazy(() => import('./pages/docs/camos/CamosLifecycle').then(m => ({ default: m.CamosLifecycle })));

const CustomerGettingStarted = lazy(() => import('./pages/docs/customer/GettingStarted').then(m => ({ default: m.GettingStarted })));
const CustomerVpsGuide = lazy(() => import('./pages/docs/customer/VpsGuide').then(m => ({ default: m.VpsGuide })));
const CustomerSftpGuide = lazy(() => import('./pages/docs/customer/SftpGuide').then(m => ({ default: m.SftpGuide })));
const CustomerDedicatedGuide = lazy(() => import('./pages/docs/customer/DedicatedGuide').then(m => ({ default: m.DedicatedGuide })));
const CustomerBillingGuide = lazy(() => import('./pages/docs/customer/BillingGuide').then(m => ({ default: m.BillingGuide })));
const CustomerSupportGuide = lazy(() => import('./pages/docs/customer/SupportGuide').then(m => ({ default: m.SupportGuide })));

// ─── Registration ────────────────────────────────────────────────────────────
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail').then(m => ({ default: m.VerifyEmail })));
const PartnerLanding = lazy(() => import('./pages/PartnerLanding').then(m => ({ default: m.PartnerLanding })));

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
  { path: '/pricing', element: <Pricing /> },
  { path: '/company', element: <Navigate to="/company/about" replace /> },
  { path: '/company/about', element: <About /> },
  { path: '/company/team', element: <Team /> },
  { path: '/company/open-source', element: <OpenSource /> },
  { path: '/company/contact', element: <Contact /> },
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
  { path: '/odp', element: <Navigate to="/deploy" replace /> },
  { path: '/pegasus', element: <Navigate to="/software/pegasus" replace /> },
  { path: '/about', element: <Navigate to="/company/about" replace /> },
  { path: '/team', element: <Navigate to="/company/team" replace /> },
  { path: '/open-source', element: <Navigate to="/company/open-source" replace /> },
  { path: '/contact', element: <Navigate to="/company/contact" replace /> },
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
        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex-1 flex items-center justify-center min-h-[40vh] p-8">
              <div className="flex flex-col items-center gap-3 text-muted-foreground animate-pulse">
                <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                <span className="text-[11px] font-mono tracking-wider uppercase opacity-60">Loading...</span>
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
