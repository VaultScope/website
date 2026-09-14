import { Outlet, NavLink } from 'react-router-dom';

export function ReportLayout() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-light mb-2">Report an Issue</h1>
      <p className="text-muted-foreground mb-8">Please select the appropriate category to ensure your report reaches the right department.</p>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-col gap-2">
            <NavLink to="/report/abuse" className={({isActive}) => `px-4 py-2 text-sm border-l-2 transition-colors ${isActive ? 'border-foreground font-medium bg-foreground/5' : 'border-transparent text-muted-foreground hover:bg-foreground/[0.02]'}`}>Abuse</NavLink>
            <NavLink to="/report/dmca" className={({isActive}) => `px-4 py-2 text-sm border-l-2 transition-colors ${isActive ? 'border-foreground font-medium bg-foreground/5' : 'border-transparent text-muted-foreground hover:bg-foreground/[0.02]'}`}>DMCA Takedown</NavLink>
            <NavLink to="/report/other" className={({isActive}) => `px-4 py-2 text-sm border-l-2 transition-colors ${isActive ? 'border-foreground font-medium bg-foreground/5' : 'border-transparent text-muted-foreground hover:bg-foreground/[0.02]'}`}>Other Issue</NavLink>
          </nav>
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
