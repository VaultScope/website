import { Outlet, Link, useLocation } from 'react-router-dom';
import { Book, Shield, Zap, User } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/docs', label: 'Overview', icon: Book },
  { path: '/docs/storefront', label: 'Customer Experience', icon: User },
  { path: '/docs/vamos', label: 'VAMOS Backend', icon: Zap },
  { path: '/docs/camos', label: 'CAMOS Admin', icon: Shield },
];

export const DocsLayout = () => {
  const location = useLocation();

  return (
    <div className="container mx-auto px-6 lg:px-12 py-16 flex flex-col md:flex-row gap-12">
      <aside className="w-full md:w-64 shrink-0">
        <div className="sticky top-24">
          <h2 className="text-xl font-medium tracking-tight mb-6">Documentation</h2>
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path || (path !== '/docs' && location.pathname.startsWith(path));
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium border ${isActive ? 'bg-foreground/5 border-border text-foreground' : 'border-transparent text-foreground/50 hover:text-foreground hover:bg-foreground/[0.02]'}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
      
      <main className="flex-1 min-w-0">
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-medium prose-headings:tracking-tight prose-a:text-foreground prose-a:underline-offset-4 hover:prose-a:text-foreground/80 prose-p:text-foreground/70 prose-p:font-light prose-li:text-foreground/70 prose-li:font-light">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
