import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  User, 
  ChevronRight, 
  Network, 
  KeyRound, 
  Code2, 
  Terminal,
  Download,
  Settings,
  RefreshCw,
  Menu,
  X,
  ArrowLeft,
  Search,
  BookOpen,
  Server,
  HardDrive,
  CreditCard,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { DocsSearchModal } from './components/DocsSearchModal';
import { OPEN_DOCS_SEARCH_EVENT, openDocsSearch } from './search/searchEvents';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface ProjectContextNav {
  title: string;
  subtitle: string;
  badge: string;
  items: NavItem[];
  relatedLinks?: { label: string; path: string }[];
}

function getContextNav(currentPath: string): ProjectContextNav | null {
  if (currentPath.startsWith('/docs/customer')) {
    return {
      title: 'Customer Knowledge Base',
      subtitle: 'Customer Guides',
      badge: 'Guides',
      items: [
        { path: '/docs/customer/getting-started', label: 'Getting Started & Security', icon: ShieldCheck },
        { path: '/docs/customer/vps', label: 'Cloud VPS Management', icon: Server },
        { path: '/docs/customer/sftp', label: 'Sovereign SFTP Storage', icon: HardDrive },
        { path: '/docs/customer/dedicated', label: 'Dedicated Bare-Metal', icon: Zap },
        { path: '/docs/customer/billing', label: 'Billing, VAT & Invoices', icon: CreditCard },
        { path: '/docs/customer/support', label: 'Support Desk & SLAs', icon: HelpCircle },
      ],
      relatedLinks: [
        { label: 'Documentation Hub', path: '/docs' },
        { label: 'VAMOS API Reference', path: '/docs/api' },
        { label: 'System Architecture', path: '/docs/architecture' },
      ]
    };
  }

  if (currentPath.startsWith('/docs/projects/storefront')) {
    return {
      title: 'Customer Experience',
      subtitle: 'Storefront Portal',
      badge: 'React 19',
      items: [
        { path: '/docs/projects/storefront', label: 'Overview', icon: User },
        { path: '/docs/projects/storefront/install', label: 'Installation', icon: Download },
        { path: '/docs/projects/storefront/config', label: 'Configuration', icon: Settings },
        { path: '/docs/projects/storefront/lifecycle', label: 'Upgrades & Backups', icon: RefreshCw },
      ],
      relatedLinks: [
        { label: 'VAMOS Backend API', path: '/docs/projects/vamos' },
        { label: 'Authentik OIDC Setup', path: '/docs/authentik' },
      ]
    };
  }

  if (currentPath.startsWith('/docs/projects/vamos')) {
    return {
      title: 'VAMOS Backend',
      subtitle: 'Engine & Gateway',
      badge: 'Rust Axum',
      items: [
        { path: '/docs/projects/vamos', label: 'Overview', icon: Zap },
        { path: '/docs/projects/vamos/install', label: 'Installation', icon: Download },
        { path: '/docs/projects/vamos/config', label: 'Configuration', icon: Settings },
        { path: '/docs/projects/vamos/lifecycle', label: 'Upgrades & DB Migrations', icon: RefreshCw },
        { path: '/docs/api', label: 'VAMOS API Reference', icon: Code2 },
      ],
      relatedLinks: [
        { label: 'System Architecture', path: '/docs/architecture' },
        { label: 'CAMOS Admin Panel', path: '/docs/projects/camos' },
      ]
    };
  }

  if (currentPath.startsWith('/docs/projects/camos')) {
    return {
      title: 'CAMOS Admin',
      subtitle: 'Operations Control Plane',
      badge: 'Admin',
      items: [
        { path: '/docs/projects/camos', label: 'Overview', icon: Shield },
        { path: '/docs/projects/camos/install', label: 'Installation', icon: Download },
        { path: '/docs/projects/camos/config', label: 'Configuration', icon: Settings },
        { path: '/docs/projects/camos/lifecycle', label: 'Upgrades & Backups', icon: RefreshCw },
        { path: '/docs/runbooks', label: 'Production Runbooks', icon: Terminal },
      ],
      relatedLinks: [
        { label: 'Authentik OIDC Setup', path: '/docs/authentik' },
        { label: 'VAMOS Backend API', path: '/docs/projects/vamos' },
      ]
    };
  }

  const isGuide = ['/docs/architecture', '/docs/authentik', '/docs/api', '/docs/runbooks'].some(
    p => currentPath === p || currentPath.startsWith(`${p}/`)
  );

  if (isGuide) {
    return {
      title: 'Platform Guides',
      subtitle: 'Architecture & Operations',
      badge: 'Guides',
      items: [
        { path: '/docs/architecture', label: 'System Architecture', icon: Network },
        { path: '/docs/authentik', label: 'Authentik OIDC SSO', icon: KeyRound },
        { path: '/docs/api', label: 'VAMOS API Reference', icon: Code2 },
        { path: '/docs/runbooks', label: 'Production Runbooks', icon: Terminal },
      ],
      relatedLinks: [
        { label: 'VAMOS Backend', path: '/docs/projects/vamos' },
        { label: 'Customer Storefront', path: '/docs/projects/storefront' },
        { label: 'CAMOS Admin', path: '/docs/projects/camos' },
      ]
    };
  }

  return null;
}

export const DocsLayout = () => {
  const location = useLocation();
  const isGerman = location.pathname === '/de' || location.pathname.startsWith('/de/');
  const currentPath = isGerman ? (location.pathname.slice(3) || '/') : location.pathname;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const contextNav = getContextNav(currentPath);
  const hasSidebar = Boolean(contextNav);
  const getPath = (p: string) => (isGerman ? `/de${p === '/' ? '' : p}` : p);

  // Close drawer on path change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Global search shortcut (Ctrl+K or /) & custom event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      } else if (
        e.key === '/' && 
        document.activeElement?.tagName !== 'INPUT' && 
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === 'Escape') {
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };

    const handleCustomOpen = () => setSearchOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener(OPEN_DOCS_SEARCH_EVENT, handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener(OPEN_DOCS_SEARCH_EVENT, handleCustomOpen);
    };
  }, []);

  // Body scroll lock during mobile drawer
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Active label
  const activeItem = contextNav?.items.find(i => i.path === currentPath);
  const currentNavTitle = activeItem ? activeItem.label : contextNav?.title || 'Documentation';

  return (
    <div className="w-full min-h-screen bg-background text-foreground pt-28 lg:pt-32 pb-24">
      {/* Global Search Modal */}
      <DocsSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {hasSidebar && contextNav ? (
        <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-10">
          {/* Desktop Project-Specific Sidebar (hidden on mobile) */}
          <aside className="hidden lg:block lg:w-72 shrink-0">
            <div className="sticky top-28 lg:top-32 space-y-6 max-h-[calc(100vh-9rem)] overflow-y-auto pr-2 pb-8">
              {/* Back to Docs Overview */}
              <Link
                to={getPath('/docs')}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-foreground/50 hover:text-foreground transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>Documentation Hub</span>
              </Link>

              {/* Project Title & Badge */}
              <div className="border-b border-border pb-4">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-mono uppercase tracking-widest text-foreground/40 font-semibold">
                    {contextNav.subtitle}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-foreground/5 text-foreground/60 border border-border">
                    {contextNav.badge}
                  </span>
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  {contextNav.title}
                </h2>
              </div>

              {/* Search Trigger Button */}
              <button
                type="button"
                onClick={openDocsSearch}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-border bg-foreground/[0.02] hover:bg-foreground/5 text-foreground/50 hover:text-foreground transition-colors text-xs font-mono cursor-pointer"
                aria-label="Search documentation"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5" />
                  <span>Search docs...</span>
                </span>
                <kbd className="text-[10px] bg-foreground/5 border border-border rounded px-1 py-0.2">
                  Ctrl K
                </kbd>
              </button>

              {/* Project Navigation Links */}
              <nav className="space-y-1">
                {contextNav.items.map(({ path, label, icon: Icon, badge }) => {
                  const targetPath = getPath(path);
                  const isActive = currentPath === path;

                  return (
                    <Link
                      key={path}
                      to={targetPath}
                      className={`group flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-all ${
                        isActive
                          ? 'bg-foreground/5 text-foreground font-semibold border-l-2 border-foreground rounded-l-none pl-2.5'
                          : 'text-foreground/60 hover:text-foreground hover:bg-foreground/[0.03]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${isActive ? 'text-foreground' : 'text-foreground/40 group-hover:text-foreground/70'}`} />
                        <span className="truncate">{label}</span>
                      </div>
                      {badge && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-foreground/5 text-foreground/50 border border-border">
                          {badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Related Project Links */}
              {contextNav.relatedLinks && contextNav.relatedLinks.length > 0 && (
                <div className="pt-4 border-t border-border space-y-2">
                  <h3 className="text-[10px] font-mono uppercase tracking-wider text-foreground/40 font-semibold px-1">
                    Related Topics
                  </h3>
                  <div className="space-y-1">
                    {contextNav.relatedLinks.map(link => (
                      <Link
                        key={link.path}
                        to={getPath(link.path)}
                        className="flex items-center justify-between px-2 py-1.5 text-xs text-foreground/60 hover:text-foreground hover:bg-foreground/[0.02] rounded transition-colors"
                      >
                        <span className="truncate">{link.label}</span>
                        <ChevronRight className="w-3 h-3 text-foreground/30" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* External Repos */}
              <div className="pt-4 border-t border-border space-y-1 text-xs text-foreground/50 font-mono">
                <a 
                  href="https://github.com/VaultScope" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between hover:text-foreground transition-colors p-1"
                >
                  <span>GitHub Repository</span>
                  <ChevronRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </aside>

          {/* Mobile Sticky Bar (< lg) */}
          <div className="lg:hidden sticky top-20 z-20 -mx-6 px-6 py-3 bg-background/95 backdrop-blur-md border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 pr-3">
              <Link to={getPath('/docs')} className="text-foreground/40 hover:text-foreground shrink-0" title="Back to Docs">
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-xs font-mono uppercase tracking-wider text-foreground/70 truncate">
                {contextNav.title} &bull; {currentNavTitle}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={openDocsSearch}
                className="p-1.5 rounded-md border border-border bg-foreground/[0.03] text-foreground/60 hover:text-foreground cursor-pointer"
                aria-label="Search documentation"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-foreground/[0.03] hover:bg-foreground/5 text-foreground text-xs font-mono font-medium transition-colors cursor-pointer"
                aria-label="Open documentation navigation"
                aria-expanded={mobileOpen}
              >
                <Menu className="w-3.5 h-3.5" />
                <span>Menu</span>
              </button>
            </div>
          </div>

          {/* Mobile Drawer Overlay */}
          {mobileOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
              />

              <div 
                role="dialog"
                aria-modal="true"
                aria-label="Documentation menu"
                className="fixed inset-y-0 left-0 w-full max-w-xs bg-background border-r border-border shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10"
              >
                <div className="space-y-6">
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/40">VaultScope</span>
                      <h3 className="text-base font-semibold text-foreground">{contextNav.title}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMobileOpen(false)}
                      className="p-1.5 rounded-md text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
                      aria-label="Close navigation"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Hub Link */}
                  <Link
                    to={getPath('/docs')}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-foreground/5 text-foreground text-xs font-mono font-medium"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Back to Documentation Hub</span>
                  </Link>

                  {/* Drawer Nav Items */}
                  <nav className="space-y-1">
                    {contextNav.items.map(({ path, label, icon: Icon, badge }) => {
                      const targetPath = getPath(path);
                      const isActive = currentPath === path;

                      return (
                        <Link
                          key={path}
                          to={targetPath}
                          onClick={() => setMobileOpen(false)}
                          className={`group flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-all ${
                            isActive
                              ? 'bg-foreground/5 text-foreground font-semibold border-l-2 border-foreground rounded-l-none pl-2.5'
                              : 'text-foreground/60 hover:text-foreground hover:bg-foreground/[0.03]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${isActive ? 'text-foreground' : 'text-foreground/40'}`} />
                            <span className="truncate">{label}</span>
                          </div>
                          {badge && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-foreground/5 text-foreground/50 border border-border">
                              {badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Related Links in Drawer */}
                  {contextNav.relatedLinks && (
                    <div className="pt-4 border-t border-border space-y-1.5">
                      <h4 className="text-[10px] font-mono uppercase tracking-wider text-foreground/40 font-semibold px-1">
                        Related Topics
                      </h4>
                      {contextNav.relatedLinks.map(link => (
                        <Link
                          key={link.path}
                          to={getPath(link.path)}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between px-2 py-1.5 text-xs text-foreground/60 hover:text-foreground rounded transition-colors"
                        >
                          <span>{link.label}</span>
                          <ChevronRight className="w-3 h-3 text-foreground/30" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Article Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      ) : (
        /* Standalone Portal Layout (No Sidebar) for /docs Overview */
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <Outlet />
        </div>
      )}
    </div>
  );
};
