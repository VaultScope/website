import { Hash } from 'lucide-react';

export interface TocItem {
  id: string;
  label: string;
}

interface InThisArticleProps {
  items: TocItem[];
}

export const InThisArticle = ({ items }: InThisArticleProps) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="not-prose my-6 p-4 rounded-lg border border-border bg-foreground/[0.015]">
      <div className="flex items-center gap-2 mb-2.5">
        <Hash className="w-3.5 h-3.5 text-foreground/40" />
        <span className="text-[11px] font-mono uppercase tracking-widest text-foreground/50 font-semibold">
          In this article
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono text-foreground/70 bg-foreground/[0.03] border border-border hover:border-foreground/30 hover:text-foreground transition-all cursor-pointer"
          >
            <span className="text-foreground/30">#</span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};
