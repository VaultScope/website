import { useEffect, useState, useCallback } from 'react';
import { Settings, Shield, User, Server, FileText, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../../../lib/api';
import { useToast } from '../../../components/Toast';

interface ActivityLogItem {
  id: string;
  action: string;
  target: string;
  detail: string;
  created_at: string;
}

export function ProfileLogs() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { error } = useToast();

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await api.get<ActivityLogItem[]>('/storefront/activity');
      setLogs(Array.isArray(res) ? res : []);
    } catch (err: any) {
      console.error('Failed to load activity logs:', err);
      const msg = err?.message || 'Failed to load activity logs';
      setLoadError(msg);
      error(msg);
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getActionIcon = (action: string, target: string) => {
    const act = (action + ' ' + target).toLowerCase();
    if (act.includes('2fa') || act.includes('security') || act.includes('password') || act.includes('auth') || act.includes('login')) {
      return <Shield className="w-4 h-4 text-emerald-400" />;
    }
    if (act.includes('service') || act.includes('vps') || act.includes('storage') || act.includes('sftp')) {
      return <Server className="w-4 h-4 text-blue-400" />;
    }
    if (act.includes('profile') || act.includes('name') || act.includes('contact') || act.includes('account')) {
      return <User className="w-4 h-4 text-indigo-400" />;
    }
    if (act.includes('billing') || act.includes('invoice') || act.includes('ticket') || act.includes('vat')) {
      return <FileText className="w-4 h-4 text-amber-400" />;
    }
    return <Settings className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <div className="border border-border px-5 py-3 text-xs text-muted-foreground flex items-center justify-between">
        <span>Customer-visible activity for the last 72 hours. Internal audit logs are retained separately.</span>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer text-xs disabled:opacity-50 ml-4 shrink-0"
          title="Refresh activity logs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {loadError && (
        <div className="p-4 border border-red-500/30 bg-red-500/5 text-red-400 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{loadError}</span>
          </div>
          <button
            onClick={fetchLogs}
            className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded text-red-300 font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <div className="border border-border divide-y divide-border">
        {loading && logs.length === 0 ? (
          <div className="px-5 py-12 text-center text-muted-foreground text-xs flex flex-col items-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground/60" />
            <span>Loading activity logs...</span>
          </div>
        ) : logs.length > 0 ? (
          logs.map((log) => {
            const date = new Date(log.created_at);
            return (
              <div key={log.id} className="flex items-start gap-4 px-5 py-3.5 hover:bg-foreground/[0.01] transition-colors">
                <div className="w-7 h-7 flex items-center justify-center shrink-0 border border-border/60 bg-foreground/[0.02]">
                  {getActionIcon(log.action, log.target)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">
                      {log.action} <span className="text-muted-foreground font-normal">{log.target}</span>
                    </span>
                    <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                      {date.toLocaleDateString()} {date.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 text-muted-foreground leading-relaxed">{log.detail}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="px-5 py-8 text-center text-muted-foreground text-sm">
            No activity logs found
          </div>
        )}
      </div>
    </div>
  );
}
