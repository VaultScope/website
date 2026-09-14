import { useState, useCallback, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import { getInitialDark, applyDark } from '../../hooks/useTheme';
import { Logo } from '../../components/Shared';
import { isAuthenticated, redirectToLogin, logout, getStoredClaims } from '../../lib/auth';
import { api } from '../../lib/api';
import { Onboarding } from './Onboarding';
import {
  LayoutDashboard,
  Server,
  HardDrive,
  Cloud,
  PlusCircle,
  LifeBuoy,
  UserCircle,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';

function useTheme() {
  const [dark, setDarkState] = useState<boolean>(() => getInitialDark());
  const setDark = useCallback((next: boolean) => {
    setDarkState(next);
    applyDark(next);
  }, []);
  const toggle = useCallback(() => setDark(!dark), [dark, setDark]);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('vs-theme')) setDark(e.matches);
    };
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, [setDark]);
  return { dark, toggle };
}

export function DashboardLayout() {
  const { localePath } = useLanguage();
  const location = useLocation();
  const { dark, toggle } = useTheme();
  const claims = getStoredClaims();
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) return;
    api.get<{ name: string; address: string; city: string; country: string }>('/storefront/profile')
      .then(profile => {
        const complete = !!(profile.name?.trim() && profile.address?.trim() && profile.city?.trim() && profile.country?.trim());
        setProfileComplete(complete);
      })
      .catch(() => setProfileComplete(true));
  }, []);

  const handleLogin = async () => {
    try {
      setLoginError(null);
      await redirectToLogin();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Failed to initialize login');
    }
  };

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full border border-border p-8 text-center">
          <h2 className="text-lg font-medium mb-4">Sign in to access your dashboard</h2>
          {loginError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
              {loginError}
            </div>
          )}
          <button
            onClick={handleLogin}
            className="w-full border border-border bg-foreground text-background font-medium py-3 px-6 hover:bg-foreground/90 transition-colors cursor-pointer"
          >
            Login with VaultScope
          </button>
          <p className="text-xs text-foreground/40 mt-4">
            Don't have an account?{' '}
            <Link to={localePath('/register')} className="text-foreground/60 hover:text-foreground transition-colors underline underline-offset-2">
              Create one
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (profileComplete === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!profileComplete) {
    return <Onboarding />;
  }

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'VPS', href: '/dashboard/vps', icon: Server },
    { name: 'Dedicated Servers', href: '/dashboard/ds', icon: HardDrive },
    { name: 'ODP', href: '/dashboard/odp', icon: Cloud },
    { name: 'Order New Service', href: '/dashboard/new', icon: PlusCircle },
    { name: 'Support', href: '/dashboard/support', icon: LifeBuoy },
    { name: 'Profile', href: '/dashboard/profile', icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="w-full md:w-60 border-r border-border bg-background flex flex-col md:fixed h-full z-10">
        <div className="h-16 flex items-center justify-between px-5 border-b border-border">
          <Link to={localePath('/')} className="flex items-center">
            <Logo className="h-10 w-auto" />
          </Link>
          <button
            onClick={toggle}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-8 h-8 flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors cursor-pointer"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
        <nav className="flex-1 py-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === localePath(item.href) || location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={localePath(item.href)}
                className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors border-l-2 ${
                  isActive
                    ? 'border-foreground text-foreground bg-foreground/5'
                    : 'border-transparent text-foreground/50 hover:text-foreground hover:bg-foreground/[0.02]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <div className="text-xs text-foreground/40 mb-2 truncate">{claims?.email}</div>
          <button
            onClick={() => { logout(); window.location.href = '/'; }}
            className="flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-60 p-6 md:p-10 min-h-screen relative">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
