import { useState, useEffect, useMemo } from 'react';
import { Clock, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../../../lib/api';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'auth', label: 'Auth' },
  { value: 'security', label: 'Security' },
  { value: 'account', label: 'Account' },
  { value: 'service', label: 'Service' },
  { value: 'billing', label: 'Billing' },
  { value: 'ticket', label: 'Support' },
];

const MAX_PER_PAGE = 100;
const PER_PAGE_OPTIONS = [10, 25, 50, 100];

function inferCategory(log: any): string {
  if (log.category && typeof log.category === 'string') {
    return log.category.toLowerCase();
  }
  const text = `${log.action || ''} ${log.target || ''} ${log.detail || ''}`.toLowerCase();
  if (text.includes('2fa') || text.includes('password') || text.includes('totp')) return 'security';
  if (text.includes('login') || text.includes('session')) return 'auth';
  if (text.includes('invoice') || text.includes('payment') || text.includes('billing')) return 'billing';
  if (text.includes('ticket')) return 'ticket';
  if (text.includes('service') || text.includes('vps') || text.includes('sftp') || text.includes('server')) return 'service';
  return 'account';
}

export function ProfileLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [totalServer, setTotalServer] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [paginateEnabled, setPaginateEnabled] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    let endpoint = '/storefront/activity';
    if (hasInteracted) {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      const clampedPerPage = Math.min(MAX_PER_PAGE, Math.max(1, perPage));
      params.set('per_page', String(clampedPerPage));
      if (paginateEnabled) {
        params.set('paginate', 'true');
        params.set('page', String(page));
      }
      const qs = params.toString();
      if (qs) endpoint = `/storefront/activity?${qs}`;
    }

    api
      .get<any>(endpoint)
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data)) {
          setLogs(data);
          setTotalServer(null);
        } else if (data && Array.isArray(data.items)) {
          setLogs(data.items);
          setTotalServer(typeof data.total === 'number' ? data.total : data.items.length);
        } else {
          setLogs([]);
          setTotalServer(null);
        }
      })
      .catch(() => {
        if (!active) return;
        setLogs([]);
        setTotalServer(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [hasInteracted, searchQuery, selectedCategory, paginateEnabled, page, perPage]);

  const filteredLogs = useMemo(() => {
    if (totalServer !== null) {
      return logs;
    }
    const q = searchQuery.trim().toLowerCase();
    return logs.filter((log) => {
      const cat = inferCategory(log);
      if (selectedCategory !== 'all' && cat !== selectedCategory) {
        return false;
      }
      if (q) {
        const hay = `${log.action || ''} ${log.target || ''} ${log.detail || ''} ${cat}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [logs, totalServer, searchQuery, selectedCategory]);

  const effectivePerPage = Math.min(MAX_PER_PAGE, Math.max(1, perPage));
  const totalCount = totalServer !== null ? totalServer : filteredLogs.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / effectivePerPage));
  const safePage = Math.min(page, totalPages);

  const displayedLogs = useMemo(() => {
    if (totalServer !== null) {
      return filteredLogs;
    }
    if (!paginateEnabled) {
      return filteredLogs.slice(0, MAX_PER_PAGE);
    }
    const start = (safePage - 1) * effectivePerPage;
    return filteredLogs.slice(start, start + effectivePerPage);
  }, [filteredLogs, totalServer, paginateEnabled, safePage, effectivePerPage]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] px-5 py-4 flex items-center gap-3 text-xs text-[var(--fg-muted)]">
        <Clock className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
        <span>
          Customer-visible activity for the last 72 hours. Older entries are automatically rotated.
        </span>
      </div>

      {/* Search, Category Filter & Optional Pagination Controls */}
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-[var(--fg-faint)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              aria-label="Search activity logs"
              placeholder="Search action, target, or details..."
              value={searchQuery}
              onChange={(e) => {
                setHasInteracted(true);
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full h-8 pl-8 pr-8 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setHasInteracted(true);
                  setSearchQuery('');
                  setPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--fg-faint)] hover:text-[var(--fg)] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <label className="inline-flex items-center gap-2 text-[var(--fg-muted)] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={paginateEnabled}
                onChange={(e) => {
                  setHasInteracted(true);
                  setPaginateEnabled(e.target.checked);
                  setPage(1);
                }}
                className="rounded border-[var(--line)]"
              />
              <span>Paginate</span>
            </label>

            {paginateEnabled && (
              <div className="inline-flex items-center gap-2">
                <label htmlFor="activity-per-page" className="text-[var(--fg-faint)]">
                  Per page (max {MAX_PER_PAGE}):
                </label>
                <select
                  id="activity-per-page"
                  aria-label="Entries per page"
                  value={effectivePerPage}
                  onChange={(e) => {
                    setHasInteracted(true);
                    setPerPage(Math.min(MAX_PER_PAGE, Number(e.target.value) || 25));
                    setPage(1);
                  }}
                  className="h-8 px-2 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-xs font-mono text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)]"
                >
                  {PER_PAGE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by category">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => {
                  setHasInteracted(true);
                  setSelectedCategory(cat.value);
                  setPage(1);
                }}
                className={`h-7 px-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--bg-subtle)] text-[var(--fg-muted)] hover:text-[var(--fg)]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading && logs.length === 0 ? (
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-12 text-center text-xs text-[var(--fg-muted)] font-mono">
          Loading activity logs...
        </div>
      ) : displayedLogs.length === 0 ? (
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-12 text-center text-xs text-[var(--fg-faint)]">
          No activity logs found
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] divide-y divide-[var(--line)] overflow-hidden">
            {displayedLogs.map((log) => {
              const cat = inferCategory(log);
              return (
                <div
                  key={log.id}
                  className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--fg-muted)]">
                        {cat}
                      </span>
                      <span className="font-medium text-[var(--fg)]">{log.action}</span>
                      {log.target && (
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent-bright)]">
                          {log.target}
                        </span>
                      )}
                    </div>
                    {log.detail && (
                      <div className="text-xs text-[var(--fg-muted)]">{log.detail}</div>
                    )}
                  </div>

                  <div className="text-[11px] font-mono text-[var(--fg-faint)] shrink-0">
                    {log.created_at
                      ? `${new Date(log.created_at).toLocaleDateString()} ${new Date(
                          log.created_at
                        ).toLocaleTimeString()}`
                      : ''}
                  </div>
                </div>
              );
            })}
          </div>

          {paginateEnabled && totalCount > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--fg-muted)]">
              <span className="font-mono">
                Page {safePage} of {totalPages} ({totalCount} total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => {
                    setHasInteracted(true);
                    setPage((p) => Math.max(1, p - 1));
                  }}
                  className="vs-btn-secondary disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Previous
                </button>
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => {
                    setHasInteracted(true);
                    setPage((p) => Math.min(totalPages, p + 1));
                  }}
                  className="vs-btn-secondary disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
