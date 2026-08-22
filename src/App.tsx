import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar, Footer } from './components/Shared';

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

export default function App() {
  return (
    <BrowserRouter>
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
              {/* ─── Primary ──────────────────────────────────────────── */}
              <Route path="/"                       element={<Home />} />

              {/* ─── Infrastructure ───────────────────────────────────── */}
              <Route path="/infrastructure"         element={<InfrastructureOverview />} />
              <Route path="/infrastructure/cloud"   element={<InfrastructureCloud />} />
              <Route path="/infrastructure/dedicated" element={<InfrastructureDedicated />} />
              <Route path="/infrastructure/managed" element={<InfrastructureManaged />} />

              {/* ─── Deploy ───────────────────────────────────────────── */}
              <Route path="/deploy"                 element={<Odp />} />

              {/* ─── Software ─────────────────────────────────────────── */}
              <Route path="/software"               element={<Navigate to="/software/pegasus" replace />} />
              <Route path="/software/pegasus"       element={<Pegasus />} />

              {/* ─── Pricing ──────────────────────────────────────────── */}
              <Route path="/pricing"                element={<Pricing />} />

              {/* ─── Company ──────────────────────────────────────────── */}
              <Route path="/company"                element={<Navigate to="/company/about" replace />} />
              <Route path="/company/about"          element={<About />} />
              <Route path="/company/open-source"    element={<OpenSource />} />
              <Route path="/company/contact"        element={<Contact />} />

              {/* ─── Legal ────────────────────────────────────────────── */}
              <Route path="/legal"                  element={<Navigate to="/legal/privacy" replace />} />
              <Route path="/legal/privacy"          element={<Privacy />} />
              <Route path="/legal/terms"            element={<Terms />} />
              <Route path="/legal/imprint"          element={<Imprint />} />
              <Route path="/legal/hosting-terms"    element={<HostingTerms />} />
              <Route path="/legal/cancellation"     element={<Cancellation />} />
              <Route path="/legal/aup"              element={<Aup />} />
              <Route path="/legal/dpa"              element={<Dpa />} />

              {/* ─── Redirects (old routes → new routes) ──────────────── */}
              <Route path="/hosting"      element={<Navigate to="/infrastructure" replace />} />
              <Route path="/odp"          element={<Navigate to="/deploy" replace />} />
              <Route path="/pegasus"      element={<Navigate to="/software/pegasus" replace />} />
              <Route path="/about"        element={<Navigate to="/company/about" replace />} />
              <Route path="/open-source"  element={<Navigate to="/company/open-source" replace />} />
              <Route path="/contact"      element={<Navigate to="/company/contact" replace />} />
              <Route path="/principles"   element={<Navigate to="/company/about" replace />} />
              <Route path="/projects"     element={<Navigate to="/company/open-source" replace />} />
              <Route path="/privacy"      element={<Navigate to="/legal/privacy" replace />} />
              <Route path="/terms"        element={<Navigate to="/legal/terms" replace />} />
              <Route path="/imprint"      element={<Navigate to="/legal/imprint" replace />} />
              <Route path="/hosting-terms" element={<Navigate to="/legal/hosting-terms" replace />} />
              <Route path="/cancellation" element={<Navigate to="/legal/cancellation" replace />} />
              <Route path="/aup"          element={<Navigate to="/legal/aup" replace />} />
              <Route path="/dpa"          element={<Navigate to="/legal/dpa" replace />} />

              {/* ─── 404 ──────────────────────────────────────────────── */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
