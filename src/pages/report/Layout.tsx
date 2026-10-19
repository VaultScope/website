import { Outlet, NavLink } from 'react-router-dom';
import { useLocalePath } from '../../i18n/context';

export function ReportLayout() {
  const lp = useLocalePath();

  return (
    <div className="vs-container pt-28 lg:pt-32 pb-24">
      <div className="mb-10 border-b border-[var(--line)] pb-6">
        <span className="inline-flex items-center gap-2 text-xs font-mono text-[var(--accent-bright)] mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-bright)]" />
          Abuse &amp; Legal Compliance
        </span>
        <h1 className="text-display-m font-semibold tracking-tight text-foreground mb-2">Report an Issue</h1>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Please select the appropriate category below to submit a structured report for our abuse and compliance team at{' '}
          <a href="mailto:info@vaultscope.de" className="text-[var(--accent-bright)] underline underline-offset-4">
            info@vaultscope.de
          </a>.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <aside className="lg:col-span-4 lg:border-r lg:border-[var(--line)] lg:pr-8 space-y-8">
          <nav
            aria-label="Report categories"
            className="flex flex-col border-t border-b border-[var(--line)] divide-y divide-[var(--line)]"
          >
            <NavLink
              to={lp('/report/abuse')}
              className={({ isActive }) =>
                `py-3 text-xs font-mono transition-colors ${
                  isActive
                    ? 'text-[var(--accent-bright)] font-semibold pl-3 border-l-2 border-[var(--accent-bright)]'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              Abuse
            </NavLink>
            <NavLink
              to={lp('/report/dmca')}
              className={({ isActive }) =>
                `py-3 text-xs font-mono transition-colors ${
                  isActive
                    ? 'text-[var(--accent-bright)] font-semibold pl-3 border-l-2 border-[var(--accent-bright)]'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              DMCA Takedown
            </NavLink>
            <NavLink
              to={lp('/report/other')}
              className={({ isActive }) =>
                `py-3 text-xs font-mono transition-colors ${
                  isActive
                    ? 'text-[var(--accent-bright)] font-semibold pl-3 border-l-2 border-[var(--accent-bright)]'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              Other Issue
            </NavLink>
          </nav>

          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-[0.06em] text-[var(--accent-bright)]">
              Compliance &amp; Response Protocol
            </div>
            <dl className="space-y-2.5 text-xs">
              <div className="flex justify-between gap-4 border-b border-[var(--line)] pb-2">
                <dt className="text-[var(--fg-muted)]">Abuse Desk</dt>
                <dd className="font-mono text-[var(--fg)]">info@vaultscope.de</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[var(--line)] pb-2">
                <dt className="text-[var(--fg-muted)]">Jurisdiction</dt>
                <dd className="font-mono text-[var(--fg)]">Germany (EU / GDPR)</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--fg-muted)]">Required Evidence</dt>
                <dd className="font-mono text-[var(--fg)]">UTC Timestamps + IP/URL</dd>
              </div>
            </dl>
          </div>
        </aside>
        <div className="lg:col-span-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
