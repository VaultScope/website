import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { api } from '../../../lib/api';
import { useToast } from '../../../components/Toast';

export function ProfileLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const { error } = useToast();

  useEffect(() => {
    api.get<any[]>('/storefront/activity')
      .then(res => setLogs(Array.isArray(res) ? res : []))
      .catch(err => {
        console.error(err);
        error('Failed to load activity logs');
      });
  }, [error]);

  return (
    <div className="space-y-6">
      <div className="border border-border px-5 py-3 text-xs text-muted-foreground">
        Customer-visible activity for the last 72 hours. Internal audit logs are retained separately.
      </div>

      <div className="border border-border divide-y divide-border">
        {logs.length > 0 ? logs.map((log) => {
          const date = new Date(log.created_at);
          return (
            <div key={log.id} className="flex items-start gap-4 px-5 py-3.5">
              <div className="w-7 h-7 flex items-center justify-center shrink-0 text-foreground/50">
                <Settings className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{log.action} <span className="text-muted-foreground font-normal">{log.target}</span></span>
                  <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">{date.toLocaleDateString()} {date.toLocaleTimeString()}</span>
                </div>
                <p className="text-xs mt-0.5 text-muted-foreground">{log.detail}</p>
              </div>
            </div>
          );
        }) : (
          <div className="px-5 py-8 text-center text-muted-foreground text-sm">No activity logs found</div>
        )}
      </div>
    </div>
  );
}
