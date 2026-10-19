import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { DocsSearchModal } from './components/DocsSearchModal';
import { OPEN_DOCS_SEARCH_EVENT, openDocsSearch } from './search/searchEvents';

interface NavItem {
  path: string;
  label: string;
}

interface NavCategory {
  category: string;
  items: NavItem[];
}

const DOC_CATEGORIES: NavCategory[] = [
  {
    category: 'Getting Started',
    items: [
      {
        path: '/docs',
        label: 'Overview',
      },
    ],
  },
  {
    category: 'Account & Login',
    items: [
      {
        path: '/docs/customer/getting-started',
        label: 'User Login & Account',
      },
    ],
  },
  {
    category: 'Storage',
    items: [
      {
        path: '/docs/customer/sftp',
        label: 'SFTP Storage',
      },
    ],
  },
];

const ALL_NAV_ITEMS: NavItem[] = DOC_CATEGORIES.flatMap((c) => c.items);

const PAGE_TOC: Record<string, { id: string; label: string }[]> = {
  '/docs': [
    { id: 'welcome', label: 'Introduction' },
    { id: 'user-login', label: 'User Login & Account' },
    { id: 'sftp-overview', label: 'SFTP Storage' },
    { id: 'connection-details', label: 'Connection Details' },
  ],
  '/docs/customer/getting-started': [
    { id: 'create-account', label: '1. Create an Account' },
    { id: 'verify-email', label: '2. Verify Your Email' },
    { id: 'sign-in', label: '3. Sign In to Dashboard' },
    { id: 'two-factor-auth', label: '4. Two-Factor Auth (2FA)' },
  ],
  '/docs/customer/sftp': [
    { id: 'connection-details', label: '1. Connection Details' },
    { id: 'web-file-manager', label: '2. Web File Manager' },
    { id: 'fthr-integration', label: '3. FTHR Clipping Preset' },
    { id: 'sftp-clients', label: '4. SFTP Clients & CLI' },
  ],
};

export const DocsLayout = () => {
  const location = useLocation();
  const isGerman = location.pathname === '/de' || location.pathname.startsWith('/de/');
  const rawPath = isGerman ? location.pathname.slice(3) || '/' : location.pathname;
  const currentPath = rawPath.endsWith('/') && rawPath.length > 1 ? rawPath.slice(0, -1) : rawPath;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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

  const activeItem =
    ALL_NAV_ITEMS.find((i) => i.path === currentPath) || ALL_NAV_ITEMS[0];
  const tocItems = PAGE_TOC[currentPath] || PAGE_TOC['/docs'];

  return (
    <div className="w-full min-h-screen bg-[var(--bg)] text-[var(--fg)] pt-24 pb-24">
      {/* Global Search Modal */}
      <DocsSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Top Bar (< lg) */}
      <div className="lg:hidden sticky top-16 z-20 px-6 py-3 bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--line)] flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 min-w-0 pr-3">
          <span className="text-xs text-[var(--fg-muted)] truncate">
            Docs / <strong className="text-[var(--fg)] font-medium">{activeItem.label}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={openDocsSearch}
            className="p-1.5 rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] text-[var(--fg-muted)] hover:text-[var(--fg)] cursor-pointer"
            aria-label="Search documentation"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] text-[var(--fg)] text-xs font-medium transition-colors cursor-pointer"
            aria-label="Open documentation navigation"
            aria-expanded={mobileOpen}
          >
            <Menu className="w-3.5 h-3.5" />
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* 3-Column Documentation Layout: Left Categorized Sidebar | Center Content | Right "On this page" */}
      <div className="vs-container-wide flex items-start gap-10 lg:gap-12">
        {/* 1. LEFT SIDEBAR: Categorized Navigation */}
        <aside className="hidden lg:block w-60 shrink-0 sticky top-24 self-start border-r border-[var(--line)] pr-6 min-h-[calc(100vh-8rem)]">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={openDocsSearch}
            className="w-full flex items-center justify-between px-3 py-2 mb-6 rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)]/60 hover:border-[var(--line-strong)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors text-xs cursor-pointer"
            aria-label="Search documentation"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search docs...</span>
            </span>
            <kbd className="text-[10px] font-mono bg-[var(--bg)] border border-[var(--line)] rounded px-1.5 py-0.5 text-[var(--fg-faint)]">
              Ctrl K
            </kbd>
          </button>

          {/* Categorized Navigation Tree */}
          <nav aria-label="Documentation navigation" className="space-y-6">
            {DOC_CATEGORIES.map((group) => (
              <div key={group.category}>
                <h3 className="text-xs font-semibold text-[var(--fg)] mb-2 px-2">
                  {group.category}
                </h3>
                <ul className="space-y-0.5 border-l border-[var(--line)] ml-2">
                  {group.items.map(({ path, label }) => {
                    const targetPath = getPath(path);
                    const isActive = currentPath === path;

                    return (
                      <li key={path}>
                        <Link
                          to={targetPath}
                          className={`block pl-3 py-1.5 text-sm -ml-px border-l-2 transition-colors ${
                            isActive
                              ? 'border-[var(--accent-bright)] text-[var(--accent-bright)] font-medium'
                              : 'border-transparent text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-faint)]'
                          }`}
                        >
                          {label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* 2. CENTER COLUMN: Main Documentation Article */}
        <div className="flex-1 min-w-0 [&_p]:max-w-[75ch] [&_li]:max-w-[75ch]">
          <Outlet />
        </div>

        {/* 3. RIGHT SIDEBAR: "On this page" Sections */}
        <aside
          aria-label="On this page"
          className="hidden xl:block w-56 shrink-0 sticky top-24 self-start"
        >
          <div className="text-xs font-semibold text-[var(--fg)] mb-3">
            On this page
          </div>
          <ul className="space-y-2 border-l border-[var(--line)] text-xs">
            {tocItems.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="block pl-3 py-0.5 -ml-px border-l border-transparent text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--accent-bright)] transition-colors"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>
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
            className="fixed inset-y-0 left-0 w-full max-w-xs bg-[var(--bg)] border-r border-[var(--line)] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
                <span className="text-sm font-semibold text-[var(--fg)]">
                  Documentation
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-md text-[var(--fg-muted)] hover:text-[var(--fg)] cursor-pointer"
                  aria-label="Close navigation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="space-y-5">
                {DOC_CATEGORIES.map((group) => (
                  <div key={group.category}>
                    <h4 className="text-xs font-semibold text-[var(--fg)] mb-2">
                      {group.category}
                    </h4>
                    <ul className="space-y-1 border-l border-[var(--line)] ml-1">
                      {group.items.map(({ path, label }) => {
                        const targetPath = getPath(path);
                        const isActive = currentPath === path;
                        return (
                          <li key={path}>
                            <Link
                              to={targetPath}
                              className={`block pl-3 py-1.5 text-sm -ml-px border-l-2 transition-colors ${
                                isActive
                                  ? 'border-[var(--accent-bright)] text-[var(--accent-bright)] font-medium'
                                  : 'border-transparent text-[var(--fg-muted)] hover:text-[var(--fg)]'
                              }`}
                            >
                              {label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
