import { Link, Outlet, useLocation } from 'react-router-dom';
import { User, Shield, CreditCard, Activity } from 'lucide-react';

const profileTabs = [
  { name: 'Account', path: '/dashboard/profile', icon: User },
  { name: 'Security', path: '/dashboard/profile/mfa', icon: Shield },
  { name: 'Billing', path: '/dashboard/profile/billing', icon: CreditCard },
  { name: 'Activity', path: '/dashboard/profile/logs', icon: Activity },
];

export function ProfileLayout() {
  const location = useLocation();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">
            Profile & Settings
          </h1>
          <p className="text-xs text-[var(--fg-muted)]">
            Account, security, and billing.
          </p>
        </div>

        {/* Minimal Horizontal Pill Sub-Nav */}
        <nav aria-label="Profile sections" className="flex flex-wrap items-center gap-1 p-1 rounded-full bg-[var(--bg-card)] border border-[var(--line)] self-start sm:self-auto">
          {profileTabs.map((tab) => {
            const active =
              location.pathname === tab.path ||
              (tab.path === '/dashboard/profile' &&
                location.pathname === '/dashboard/profile/account');
            const Icon = tab.icon;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  active
                    ? 'border-foreground bg-[var(--accent)]/25 text-[var(--fg)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                    : 'border-transparent text-[var(--fg-muted)] hover:text-[var(--fg)]'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    active ? 'text-[var(--accent-bright)]' : 'text-[var(--fg-faint)]'
                  }`}
                />
                <span>{tab.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  );
}
