import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar, Footer } from './components/Shared';
import { LanguageProvider } from './i18n';

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
const OpenSource   = lazy(() => import('./pages/OpenSource').then(m => ({ default: m.OpenSource })));
const About        = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Pegasus      = lazy(() => import('./pages/Pegasus').then(m => ({ default: m.Pegasus })));
const Pricing      = lazy(() => import('./pages/Pricing').then(m => ({ default: m.Pricing })));
const Privacy      = lazy(() => import('./pages/Privacy').then(m => ({ default: m.Privacy })));
const Terms        = lazy(() => import('./pages/Terms').then(m => ({ default: m.Terms })));
const Imprint      = lazy(() => import('./pages/Imprint').then(m => ({ default: m.Imprint })));
const HostingTerms = lazy(() => import('./pages/HostingTerms').then(m => ({ default: m.HostingTerms })));
const Cancellation = lazy(() => import('./pages/Cancellation').then(m => ({ default: m.Cancellation })));
const Aup          = lazy(() => import('./pages/Aup').then(m => ({ default: m.Aup })));
const Dpa          = lazy(() => import('./pages/Dpa').then(m => ({ default: m.Dpa })));

// ─── Route definitions ───────────────────────────────────────────────────────

interface RouteConfig {
  path: string;
  element: React.ReactNode;
}

const PAGE_ROUTES: RouteConfig[] = [
  { path: '/', element: <Home /> },
  { path: '/infrastructure', element: <InfrastructureOverview /> },
  { path: '/infrastructure/cloud', element: <InfrastructureCloud /> },
  { path: '/infrastructure/dedicated', element: <InfrastructureDedicated /> },
  { path: '/infrastructure/managed', element: <InfrastructureManaged /> },
  { path: '/deploy', element: <Odp /> },
  { path: '/software', element: <Navigate to="/software/pegasus" replace /> },
  { path: '/software/pegasus', element: <Pegasus /> },
  { path: '/pricing', element: <Pricing /> },
  { path: '/company', element: <Navigate to="/company/about" replace /> },
  { path: '/company/about', element: <About /> },
  { path: '/company/open-source', element: <OpenSource /> },
  { path: '/company/contact', element: <Contact /> },
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
  { path: '/open-source', element: <Navigate to="/company/open-source" replace /> },
  { path: '/contact', element: <Navigate to="/company/contact" replace /> },
  { path: '/principles', element: <Navigate to="/company/about" replace /> },
  { path: '/projects', element: <Navigate to="/company/open-source" replace /> },
  { path: '/privacy', element: <Navigate to="/legal/privacy" replace /> },
  { path: '/terms', element: <Navigate to="/legal/terms" replace /> },
  { path: '/imprint', element: <Navigate to="/legal/imprint" replace /> },
  { path: '/hosting-terms', element: <Navigate to="/legal/hosting-terms" replace /> },
  { path: '/cancellation', element: <Navigate to="/legal/cancellation" replace /> },
  { path: '/aup', element: <Navigate to="/legal/aup" replace /> },
  { path: '/dpa', element: <Navigate to="/legal/dpa" replace /> },
];

function renderRoutes(prefix: string) {
  return PAGE_ROUTES.map(({ path, element }) => (
    <Route
      key={`${prefix}${path}`}
      path={prefix + (path === '/' && prefix ? '' : path)}
      element={element}
    />
  ));
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <div className="min-h-screen bg-background selection:bg-foreground/20 flex flex-col text-foreground font-sans">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:text-sm focus:font-medium"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main-content" className="flex-1 flex flex-col">
            <Suspense fallback={null}>
              <Routes>
                {/* ─── German locale routes (/de/...) ─────────────────── */}
                {renderRoutes('/de')}

                {/* ─── Default (English) routes ───────────────────────── */}
                {renderRoutes('')}

                {/* ─── Redirects (old routes → new routes) ────────────── */}
                {REDIRECT_ROUTES.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}

                {/* ─── 404 ────────────────────────────────────────────── */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </BrowserRouter>
  );
}
