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
    <div className="mt-16 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
      {prev ? (
        <Link
          to={getPath(prev.path)}
          className="group flex flex-col p-4 rounded-lg border border-border hover:border-foreground/30 hover:bg-foreground/[0.02] transition-all"
        >
          <span className="flex items-center gap-1.5 text-xs font-mono text-foreground/50 group-hover:text-foreground/70 transition-colors mb-1">
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            {prev.category || 'Previous'}
          </span>
          <span className="text-sm font-medium text-foreground group-hover:underline underline-offset-4">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          to={getPath(next.path)}
          className="group flex flex-col p-4 rounded-lg border border-border hover:border-foreground/30 hover:bg-foreground/[0.02] transition-all text-right sm:ml-auto w-full"
        >
          <span className="flex items-center justify-end gap-1.5 text-xs font-mono text-foreground/50 group-hover:text-foreground/70 transition-colors mb-1">
            {next.category || 'Next'}
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="text-sm font-medium text-foreground group-hover:underline underline-offset-4">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
};
