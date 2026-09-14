import { Outlet, Link, useLocation } from 'react-router-dom';

export function ProfileLayout() {
  const location = useLocation();

  const tabs = [
    { name: 'Account', href: '/dashboard/profile' },
    { name: 'Security', href: '/dashboard/profile/mfa' },
    { name: 'Billing', href: '/dashboard/profile/billing' },
    { name: 'Activity', href: '/dashboard/profile/logs' },
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-light mb-1">Profile & Settings</h1>
        <p className="text-sm text-muted-foreground">Account, security, and billing.</p>
      </div>

      <div className="border-b border-border mb-8">
        <nav className="flex gap-6">
          {tabs.map(tab => {
            const isActive = location.pathname === tab.href || location.pathname === `${tab.href}/`;
            return (
              <Link
                key={tab.name}
                to={tab.href}
                className={`py-3 text-xs uppercase tracking-wider font-medium border-b-2 transition-colors ${
                  isActive ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="min-h-[400px]">
        <Outlet />
      </div>
    </div>
  );
}
