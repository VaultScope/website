import { Search, X } from 'lucide-react';

interface SearchHighlightBannerProps {
  query: string;
  onClear: () => void;
}

export const SearchHighlightBanner = ({ query, onClear }: SearchHighlightBannerProps) => {
  if (!query || !query.trim()) return null;

  return (
    <div className="not-prose my-4 px-3.5 py-2 rounded-lg border border-amber-500/30 bg-amber-500/[0.04] flex items-center justify-between text-xs text-foreground/80">
      <div className="flex items-center gap-2">
        <Search className="w-3.5 h-3.5 text-amber-500" />
        <span>
          Keywords highlighted for: <strong className="text-foreground font-mono bg-amber-500/20 px-1 py-0.5 rounded">"{query}"</strong>
        </span>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="flex items-center gap-1 text-[11px] font-mono text-foreground/50 hover:text-foreground transition-colors cursor-pointer"
        aria-label="Clear keyword highlight"
      >
        <span>Clear</span>
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};
