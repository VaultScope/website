import { Search, X } from 'lucide-react';

interface SearchHighlightBannerProps {
  query: string;
  onClear: () => void;
}

export const SearchHighlightBanner = ({ query, onClear }: SearchHighlightBannerProps) => {
  if (!query || !query.trim()) return null;

  return (
    <div className="not-prose my-4 px-3.5 py-2 border border-[var(--line)] bg-[var(--bg-card)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
      <div className="flex items-center gap-2">
        <Search className="w-3.5 h-3.5 text-[var(--text-muted)]" />
        <span>
          Keywords highlighted for: <strong className="text-[var(--text)] font-mono bg-[var(--bg-elevated)] border border-[var(--line)] px-1.5 py-0.5">"{query}"</strong>
        </span>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="flex items-center gap-1 text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
        aria-label="Clear keyword highlight"
      >
        <span>Clear</span>
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};
