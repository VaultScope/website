import { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Server,
  HardDrive,
  Cpu,
  FolderLock,
  LifeBuoy,
  User,
  LogOut,
  Plus,
  Sun,
  Moon,
  Menu,
  X,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { getInitialDark, applyDark } from '../../hooks/useTheme';
import { getStoredUsername } from '../../lib/quickNav';

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard, exact: true },
  { name: 'VPS', path: '/dashboard/vps', icon: Server },
  { name: 'Dedicated', path: '/dashboard/ds', icon: HardDrive },
  { name: 'OCD', path: '/dashboard/odp', icon: Cpu },
  { name: 'SFTP', path: '/dashboard/sftp', icon: FolderLock },
  { name: 'Support', path: '/dashboard/support', icon: LifeBuoy },
  { name: 'Account', path: '/dashboard/profile', icon: User },
];

export function DashboardLayout() {
  const [dark, setDark] = useState<boolean>(() => getInitialDark());
  const theme = dark ? 'dark' : 'light';
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    applyDark(next);
  };
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('vs_token') : null;
  const rawClaims = typeof window !== 'undefined' ? localStorage.getItem('vs_claims') : null;
  const claims = rawClaims ? JSON.parse(rawClaims) : null;
  const storedUsername = getStoredUsername() || claims?.username;

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Eagerly warm dashboard route chunks once inside the dashboard so tab transitions (e.g. /dashboard/odp) never fail mid-navigation
  useEffect(() => {
    if (!token) return;
    const timer = window.setTimeout(() => {
      void import('./Overview').catch(() => {});
      void import('./VpsList').catch(() => {});
      void import('./DsList').catch(() => {});
      void import('./OdpList').catch(() => {});
      void import('./OdpDetail').catch(() => {});
      void import('./SftpStorage').catch(() => {});
      void import('./SupportList').catch(() => {});
      void import('./NewService').catch(() => {});
    }, 150);
    return () => window.clearTimeout(timer);
  }, [token]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('vs_token');
    localStorage.removeItem('vs_claims');
    localStorage.removeItem('vs_username');
    localStorage.removeItem('vs_preview_mode');
    navigate('/login');
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-8 sm:p-10 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--accent)]/15 text-[var(--accent-bright)] mx-auto">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight text-[var(--fg)]">
              VaultScope Dashboard
            </h1>
            <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
              Sign in with your VaultScope credentials to manage your infrastructure services, billing, and support tickets.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 pt-2">
            <Link
              to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
              className="vs-btn-primary w-full justify-center"
            >
              Sign In
            </Link>
          </div>
          <div className="pt-2">
            <Link
              to="/"
              className="text-xs text-[var(--fg-faint)] hover:text-[var(--fg-muted)] transition-colors"
            >
              ← Return to storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isItemActive = (item: (typeof navItems)[number]) => {
    if (item.exact) {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/';
    }
    return location.pathname === item.path || location.pathname.startsWith(item.path + '/');
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col selection:bg-[var(--accent)] selection:text-white">
      {/* Architectural Obsidian Navigation Bar */}
      <header className="sticky top-0 left-0 right-0 h-16 z-50 bg-[var(--bg)]/88 backdrop-blur-xl border-b border-[var(--line)]">
        <div className="vs-container-wide h-full flex items-center justify-between gap-4">
          {/* Left: Brand Identity + Architectural Tabs */}
          <div className="flex items-center gap-6 xl:gap-8 h-full min-w-0">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 select-none group focus-visible:outline-none shrink-0"
              title="Back to Storefront"
            >
              <img
                src={theme === 'dark' ? '/logos/logo-picture.png' : '/logos/logo-picture-whitemode.png'}
                alt="VaultScope"
                className="h-[22px] w-auto object-contain shrink-0"
              />
              <span className="font-sans font-semibold text-[15px] tracking-[-0.022em] text-[var(--fg)] leading-none">
                VaultScope
              </span>
            </Link>

            <nav
              aria-label="Dashboard navigation"
              className="hidden lg:flex items-center gap-1 h-full"
            >
              {navItems.map((item) => {
                const active = isItemActive(item);
                const Icon = item.icon;
                return (
                  <div key={item.path} className="relative h-full flex items-center">
                    <Link
                      to={item.path}
                      className={`group h-8 px-2.5 xl:px-3 rounded-lg flex items-center gap-1.5 text-[12.5px] xl:text-[13px] font-sans font-medium tracking-[-0.01em] whitespace-nowrap transition-all duration-150 ${
                        active
                          ? 'text-[var(--fg)] bg-[var(--accent-subtle)]'
                          : 'text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-elevated)]'
                      }`}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                          active
                            ? 'text-[var(--accent-bright)]'
                            : 'text-[var(--fg-faint)] group-hover:text-[var(--fg-muted)]'
                        }`}
                      />
                      <span>{item.name}</span>
                    </Link>
                    {active && (
                      <span className="pointer-events-none absolute bottom-0 inset-x-2 h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-[var(--accent-bright)] to-transparent" />
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions, Theme & Account — Unified 32px (h-8) Control Grid */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              to="/dashboard/new"
              className="h-8 px-3 rounded-lg inline-flex items-center gap-1.5 text-[12.5px] font-sans font-medium vs-btn-primary shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Deploy</span>
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-elevated)] border border-transparent hover:border-[var(--line)] transition-all duration-150 cursor-pointer shrink-0"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <div className="hidden sm:block h-4 w-px bg-[var(--line)] mx-1" />

            <div className="relative hidden md:block" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
                className={`flex items-center gap-2 h-8 px-2.5 rounded-lg border text-xs font-medium text-[var(--fg)] transition-all duration-150 cursor-pointer max-w-[175px] ${
                  userMenuOpen
                    ? 'border-[var(--line-strong)] bg-[var(--bg-subtle)]'
                    : 'border-[var(--line)] bg-[var(--bg-elevated)] hover:border-[var(--line-strong)] hover:bg-[var(--bg-subtle)]'
                }`}
                title={storedUsername || claims?.email || 'Account'}
              >
                <User className="w-3.5 h-3.5 text-[var(--accent-bright)] shrink-0" />
                <span className="truncate font-mono text-[11.5px]">
                  {storedUsername ? `@${storedUsername}` : claims?.name || claims?.email || 'Account'}
                </span>
                <ChevronDown
                  className={`w-3 h-3 text-[var(--fg-faint)] shrink-0 transition-transform duration-200 ${
                    userMenuOpen ? 'rotate-180 text-[var(--accent-bright)]' : ''
                  }`}
                />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 vs-dropdown-panel animate-vs-dropdown rounded-xl p-1.5 z-50 overflow-hidden">
                  <div className="px-3 py-2.5 mb-1 border-b border-[var(--line)] min-w-0">
                    <p className="text-xs font-semibold text-[var(--fg)] truncate">
                      {storedUsername ? `@${storedUsername}` : claims?.name || 'VaultScope User'}
                    </p>
                    <p className="text-[11px] font-mono text-[var(--fg-muted)] truncate mt-0.5">
                      {claims?.email || 'Authenticated Session'}
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="group flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
                    >
                      <span className="inline-flex items-center gap-2.5">
                        <User className="w-4 h-4 text-[var(--fg-muted)] group-hover:text-[var(--accent-bright)] transition-colors shrink-0" />
                        Account & Quick Nav
                      </span>
                      <ChevronRight className="w-3 h-3 text-[var(--fg-faint)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <Link
                      to="/"
                      onClick={() => setUserMenuOpen(false)}
                      className="group flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
                    >
                      <span className="inline-flex items-center gap-2.5">
                        <ArrowUpRight className="w-4 h-4 text-[var(--fg-muted)] group-hover:text-[var(--accent-bright)] transition-colors shrink-0" />
                        Return to Storefront
                      </span>
                    </Link>
                  </div>

                  <div className="my-1 border-t border-[var(--line)]" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--err)] hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4 text-[var(--err)] shrink-0" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign out"
              aria-label="Sign out"
              className="md:hidden w-8 h-8 rounded-lg inline-flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--err)] hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden w-8 h-8 rounded-lg inline-flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer shrink-0"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pb-4 pt-2 bg-[var(--bg)]/95 backdrop-blur-2xl border-t border-[var(--line)] space-y-1">
            {navItems.map((item) => {
              const active = isItemActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? 'bg-[var(--accent-subtle)] text-[var(--fg)]'
                      : 'text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-elevated)]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[var(--accent-bright)]" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-2 flex items-center justify-between px-3.5 text-xs text-[var(--fg-faint)]">
              <Link to="/" className="inline-flex items-center gap-1 hover:text-[var(--fg)]">
                Storefront <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Workspace Canvas */}
      <div className="flex-1 w-full vs-container-wide py-8 sm:py-12">
        <Outlet />
      </div>
    </div>
  );
}
