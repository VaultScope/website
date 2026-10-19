import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { api } from '../../../lib/api';

export function ProfileLogs() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    api
      .get('/storefront/activity')
      .then((data) => {
        if (Array.isArray(data)) setLogs(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] px-5 py-4 flex items-center gap-3 text-xs text-[var(--fg-muted)]">
        <Clock className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
        <span>
          Customer-visible activity for the last 72 hours. Older entries are automatically rotated.
        </span>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-12 text-center text-xs text-[var(--fg-faint)]">
          No activity logs found
        </div>
      ) : (
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] divide-y divide-[var(--line)] overflow-hidden">
          {logs.map((log) => (
            <div
              key={log.id}
              className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
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
          ))}
        </div>
      )}
    </div>
  );
}
