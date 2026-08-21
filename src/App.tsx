import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/Shared';

// ─── Eagerly loaded (homepage + primary routes) ───────────────────────────────
import { Home }       from './pages/Home';
import { Hosting }    from './pages/Hosting';
import { Contact }    from './pages/Contact';
import { OpenSource } from './pages/OpenSource';
import { About }      from './pages/About';
import { NotFound }   from './pages/NotFound';

// ─── Lazily loaded (secondary + legal pages) ─────────────────────────────────
const Pegasus      = lazy(() => import('./pages/Pegasus').then(m => ({ default: m.Pegasus })));
const Pricing      = lazy(() => import('./pages/Pricing').then(m => ({ default: m.Pricing })));
const Principles   = lazy(() => import('./pages/Principles').then(m => ({ default: m.Principles })));
const Projects     = lazy(() => import('./pages/Projects').then(m => ({ default: m.Projects })));
const Odp          = lazy(() => import('./pages/Odp').then(m => ({ default: m.Odp })));
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
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Suspense fallback={null}>
            <Routes>
              {/* Primary */}
              <Route path="/"            element={<Home />} />
              <Route path="/hosting"     element={<Hosting />} />
              <Route path="/contact"     element={<Contact />} />
              <Route path="/open-source" element={<OpenSource />} />
              <Route path="/about"       element={<About />} />

              {/* Secondary */}
              <Route path="/pegasus"    element={<Pegasus />} />
              <Route path="/pricing"    element={<Pricing />} />
              <Route path="/principles" element={<Principles />} />
              <Route path="/projects"   element={<Projects />} />
              <Route path="/odp"        element={<Odp />} />

              {/* Legal */}
              <Route path="/privacy"       element={<Privacy />} />
              <Route path="/terms"         element={<Terms />} />
              <Route path="/imprint"       element={<Imprint />} />
              <Route path="/hosting-terms" element={<HostingTerms />} />
              <Route path="/cancellation"  element={<Cancellation />} />
              <Route path="/aup"           element={<Aup />} />
              <Route path="/dpa"           element={<Dpa />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
