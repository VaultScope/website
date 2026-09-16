import { Outlet, Link, useLocation } from 'react-router-dom';
import { Book, Shield, Zap, User, Layers, ChevronRight } from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'GETTING STARTED',
    items: [
      { path: '/docs', label: 'Overview', icon: Book },
      { path: '/docs/projects', label: 'Projects Hub', icon: Layers },
    ]
  },
  {
    title: 'CORE PROJECTS',
    items: [
      { path: '/docs/projects/storefront', label: 'Customer Experience', icon: User, badge: 'React 19' },
      { path: '/docs/projects/vamos', label: 'VAMOS Backend', icon: Zap, badge: 'Rust' },
      { path: '/docs/projects/camos', label: 'CAMOS Admin', icon: Shield, badge: 'Admin' },
    ]
  }
];

export const DocsLayout = () => {
  const location = useLocation();
  const isGerman = location.pathname === '/de' || location.pathname.startsWith('/de/');
  const currentPath = isGerman ? (location.pathname.slice(3) || '/') : location.pathname;

  return (
    <div className="w-full min-h-screen bg-background text-foreground pt-28 lg:pt-32 pb-24">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-12">
        {/* Left Navigation Sidebar */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-28 lg:top-32 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-foreground/40">VaultScope Docs</span>
              </div>
              <h2 className="text-2xl font-medium tracking-tight text-foreground">Documentation</h2>
            </div>

            <nav className="space-y-6">
              {NAV_SECTIONS.map((section) => (
                <div key={section.title} className="space-y-2">
                  <h3 className="text-[11px] font-mono tracking-wider text-foreground/40 uppercase font-semibold px-3">
                    {section.title}
                  </h3>
                  <div className="flex flex-col gap-1">
                    {section.items.map(({ path, label, icon: Icon, badge }) => {
                      const targetPath = isGerman ? `/de${path === '/' ? '' : path}` : path;
                      const isActive = currentPath === path || (path !== '/docs' && path !== '/docs/projects' && currentPath.startsWith(path));

                      return (
                        <Link
                          key={path}
                          to={targetPath}
                          className={`group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                            isActive
                              ? 'bg-foreground/5 text-foreground font-semibold border-l-2 border-foreground rounded-l-none pl-2.5'
                              : 'text-foreground/60 hover:text-foreground hover:bg-foreground/[0.02]'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-foreground' : 'text-foreground/40 group-hover:text-foreground/70'}`} />
                            <span className="truncate">{label}</span>
                          </div>
                          {badge && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-foreground/5 text-foreground/50 border border-border">
                              {badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Quick Links & GitHub */}
            <div className="pt-4 border-t border-border space-y-2 text-xs text-foreground/50 font-mono">
              <a 
                href="https://github.com/VaultScope" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between hover:text-foreground transition-colors p-1"
              >
                <span>GitHub Repositories</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://subscribe.vaultscope.de" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between hover:text-foreground transition-colors p-1"
              >
                <span>Status & Release Notes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className="flex-1 min-w-0">
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-medium prose-headings:tracking-tight prose-a:text-foreground prose-a:underline-offset-4 hover:prose-a:text-foreground/80 prose-p:text-foreground/70 prose-p:font-light prose-li:text-foreground/70 prose-li:font-light">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
