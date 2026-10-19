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
    <div className="not-prose my-6 p-4 border border-[var(--line)] bg-[var(--bg-card)]">
      <div className="flex items-center gap-2 mb-2.5">
        <Hash className="w-3.5 h-3.5 text-[var(--text-faint)]" />
        <span className="text-[11px] font-mono uppercase tracking-[0.06em] text-[var(--text-muted)] font-semibold">
          In this article
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-elevated)] border border-[var(--line)] hover:border-[var(--line-strong)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            <span className="text-[var(--text-faint)]">#</span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};
