import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PageLink {
  title: string;
  path: string;
  category?: string;
}

interface DocPaginationProps {
  prev?: PageLink;
  next?: PageLink;
}

export const DocPagination = ({ prev, next }: DocPaginationProps) => {
  const location = useLocation();
  const isGerman = location.pathname.startsWith('/de');
  const getPath = (p: string) => (isGerman ? `/de${p}` : p);

  return (
    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[var(--line)] not-prose">
      {prev ? (
        <Link
          to={getPath(prev.path)}
          className="group flex flex-col py-5 pr-4 hover:bg-[var(--accent-glow)]/15 transition-colors"
        >
          <span className="flex items-center gap-1.5 text-xs font-mono text-[var(--fg-muted)] group-hover:text-[var(--accent-bright)] transition-colors mb-1">
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            {prev.category || 'Previous'}
          </span>
          <span className="text-sm font-medium text-[var(--fg)] group-hover:text-[var(--accent-bright)] transition-colors">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <Link
          to={getPath(next.path)}
          className="group flex flex-col py-5 sm:pl-4 hover:bg-[var(--accent-glow)]/15 transition-colors text-right sm:ml-auto w-full"
        >
          <span className="flex items-center justify-end gap-1.5 text-xs font-mono text-[var(--fg-muted)] group-hover:text-[var(--accent-bright)] transition-colors mb-1">
            {next.category || 'Next'}
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="text-sm font-medium text-[var(--fg)] group-hover:text-[var(--accent-bright)] transition-colors">
            {next.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </div>
  );
};
