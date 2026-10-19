import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X, FileText, Hash } from 'lucide-react';
import { searchDocs, type SearchMatch } from '../search/docsIndex';
import { HighlightText } from './HighlightText';

interface DocsSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_QUERIES = [
  'SFTP Port 2022',
  'Web File Manager',
  'FTHR JSON',
  'FileZilla',
  'WinSCP',
  'Sign In',
  'Two-Factor Authentication',
  'Verify Email',
];

export const DocsSearchModal = ({ isOpen, onClose }: DocsSearchModalProps) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isGerman = location.pathname.startsWith('/de');
  const getPath = (p: string) => (isGerman ? `/de${p}` : p);

  const results: SearchMatch[] = query.trim() ? searchDocs(query) : [];

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation inside search results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex(prev => (prev + 1) % results.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  const handleSelect = (match: SearchMatch) => {
    const targetAnchor = match.matchedSection ? `#${match.matchedSection.id}` : '';
    const searchParam = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : '';
    const targetUrl = getPath(`${match.article.path}${targetAnchor}${searchParam}`);
    navigate(targetUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 not-prose">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Box */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
        onKeyDown={handleKeyDown}
        className="relative w-full max-w-2xl bg-[var(--bg)] border border-[var(--line-strong)] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] z-10"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--line)] bg-[var(--bg-card)]">
          <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search documentation, guides, and APIs..."
            className="w-full bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none"
            aria-label="Search documentation input"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-faint)] bg-[var(--bg-elevated)] border border-[var(--line)]">
              ESC
            </kbd>
          )}
        </div>

        {/* Results / Empty View */}
        <div ref={resultsRef} className="overflow-y-auto divide-y divide-[var(--line)]">
          {query.trim() === '' ? (
            <div className="py-6 px-4 space-y-4">
              <p className="text-[11px] font-mono uppercase tracking-[0.06em] text-[var(--text-muted)] font-semibold">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_QUERIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setQuery(q);
                      inputRef.current?.focus();
                    }}
                    className="px-2.5 py-1 text-xs font-mono border border-[var(--line)] bg-[var(--bg-card)] hover:border-[var(--line-strong)] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-xs text-[var(--text-muted)] space-y-2">
              <p className="text-sm font-medium text-[var(--text)]">No matches found</p>
              <p>No documentation pages matched <span className="font-mono text-[var(--text)]">"{query}"</span></p>
            </div>
          ) : (
            results.map((match, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={`${match.article.id}-${match.matchedSection?.id || idx}`}
                  onClick={() => handleSelect(match)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3.5 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[var(--bg-elevated)] border-l-2 border-[var(--text)] pl-3'
                      : 'hover:bg-[var(--bg-card)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      {match.matchedSection ? (
                        <Hash className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                      )}
                      <h4 className="text-sm font-medium text-[var(--text)] truncate">
                        <HighlightText text={match.article.title} query={query} />
                      </h4>
                      {match.matchedSection && (
                        <span className="text-xs font-mono text-[var(--text-muted)] truncate">
                          &gt; <HighlightText text={match.matchedSection.title} query={query} />
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 border border-[var(--line)] bg-[var(--bg-elevated)] text-[var(--text-muted)] shrink-0">
                      {match.article.category}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed pl-5.5">
                    <HighlightText text={match.matchSnippet} query={query} />
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--line)] bg-[var(--bg-card)] text-[11px] font-mono text-[var(--text-muted)]">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.2 bg-[var(--bg-elevated)] border border-[var(--line)]">↑</kbd> <kbd className="px-1 py-0.2 bg-[var(--bg-elevated)] border border-[var(--line)]">↓</kbd> to navigate</span>
            <span><kbd className="px-1 py-0.2 bg-[var(--bg-elevated)] border border-[var(--line)]">↵</kbd> to select</span>
          </div>
          <span>VaultScope Docs Search</span>
        </div>
      </div>
    </div>
  );
};
