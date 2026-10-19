import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useSearchHighlight } from '../hooks/useSearchHighlight';
import { SearchHighlightBanner } from './SearchHighlightBanner';

interface Breadcrumb {
  label: string;
  path?: string;
}

export interface TocItem {
  id: string;
  label: string;
}

interface DocHeaderProps {
  breadcrumbs: Breadcrumb[];
  title: string;
  badge?: {
    label: string;
    variant?: 'neutral' | 'blue' | 'purple' | 'amber' | 'emerald';
  };
  description?: string;
  projectKey?: 'storefront' | 'vamos' | 'camos';
  tocItems?: TocItem[];
}

export const DocHeader = ({
  breadcrumbs,
  title,
  description,
  projectKey,
}: DocHeaderProps) => {
  const location = useLocation();
  const isGerman = location.pathname.startsWith('/de');
  const getPath = (p: string) => (isGerman ? `/de${p}` : p);
  const currentPath = isGerman ? location.pathname.slice(3) || '/' : location.pathname;
  const { query, clearHighlight } = useSearchHighlight();

  const projectTabs = projectKey
    ? [
        { label: 'Overview', path: `/docs/projects/${projectKey}` },
        { label: 'Installation', path: `/docs/projects/${projectKey}/install` },
        { label: 'Configuration', path: `/docs/projects/${projectKey}/config` },
        { label: 'Lifecycle & Upgrades', path: `/docs/projects/${projectKey}/lifecycle` },
      ]
    : null;

  return (
    <header className="space-y-4 not-prose pb-6 mb-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumbs" className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--fg-muted)]">
        <Link to={getPath('/docs')} className="hover:text-[var(--fg)] transition-colors">
          Docs
        </Link>
        {breadcrumbs.map((crumb, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-[var(--fg-faint)]" />
            {crumb.path ? (
              <Link to={getPath(crumb.path)} className="hover:text-[var(--fg)] transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-[var(--fg)] font-medium">{crumb.label}</span>
            )}
          </div>
        ))}
      </nav>

      {/* Title & Lead Description */}
      <div className="space-y-2.5">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--fg)]">
          {title}
        </h1>
        {description && (
          <p className="text-base text-[var(--fg-muted)] leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Subpage Tabs for Legacy Project Tests */}
      {projectTabs && (
        <div className="flex items-center gap-1.5 pt-3 overflow-x-auto text-sm">
          {projectTabs.map((tab) => {
            const isActive = currentPath === tab.path;
            return (
              <Link
                key={tab.path}
                to={getPath(tab.path)}
                className={`px-3 py-1.5 text-xs font-mono transition-colors shrink-0 rounded ${
                  isActive
                    ? 'bg-[var(--accent)] text-white font-medium'
                    : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Active Search Highlight Banner */}
      <SearchHighlightBanner query={query} onClear={clearHighlight} />
    </header>
  );
};
