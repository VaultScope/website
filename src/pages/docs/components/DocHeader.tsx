import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Search, Hash } from 'lucide-react';
import { openDocsSearch } from '../search/searchEvents';
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
  badge,
  description,
  projectKey,
  tocItems,
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
    <header className="space-y-6 not-prose border-b border-border pb-6 mb-8">
      {/* Top Bar: Breadcrumbs + Search Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumbs" className="flex flex-wrap items-center gap-2 text-xs font-mono text-foreground/50">
          <Link to={getPath('/docs')} className="hover:text-foreground transition-colors">
            Docs
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-foreground/30" />
              {crumb.path ? (
                <Link to={getPath(crumb.path)} className="hover:text-foreground transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>

        {/* Search Bar Trigger Button */}
        <button
          type="button"
          onClick={openDocsSearch}
          className="inline-flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg border border-border bg-foreground/[0.02] hover:bg-foreground/5 text-foreground/50 hover:text-foreground transition-all text-xs font-mono w-full sm:w-64 cursor-pointer"
          aria-label="Open search modal"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>Search docs...</span>
          </span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] bg-foreground/5 border border-border rounded text-foreground/40">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Title & Badge */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono border border-border bg-foreground/[0.04] text-foreground/70">
              {badge.label}
            </span>
          )}
        </div>
        {description && (
          <p className="text-base text-foreground/70 font-light max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Subpage Tabs for Projects */}
      {projectTabs && (
        <div className="flex items-center gap-1.5 border-t border-border/60 pt-4 overflow-x-auto text-sm -mx-2 px-2 sm:mx-0 sm:px-0 pb-1">
          {projectTabs.map((tab) => {
            const isActive = currentPath === tab.path;
            return (
              <Link
                key={tab.path}
                to={getPath(tab.path)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors shrink-0 ${
                  isActive
                    ? 'bg-foreground text-background font-medium'
                    : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* In This Article - Clean Pill Navigation below title/tabs */}
      {tocItems && tocItems.length > 0 && (
        <div className="pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-foreground/40 font-semibold mb-2">
            <Hash className="w-3.5 h-3.5 text-foreground/30" />
            <span>In this article</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {tocItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono text-foreground/70 bg-foreground/[0.02] border border-border hover:border-foreground/30 hover:text-foreground transition-all cursor-pointer"
              >
                <span className="text-foreground/30">#</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Active Search Highlight Banner */}
      <SearchHighlightBanner query={query} onClear={clearHighlight} />
    </header>
  );
};
