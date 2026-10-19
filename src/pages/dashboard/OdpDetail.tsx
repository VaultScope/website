import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Square,
  RotateCw,
  Terminal,
  Copy,
  Check,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../components/Toast';

export function OdpDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { toast } = useToast();

  const loadData = useCallback(() => {
    Promise.all([
      api.get(`/storefront/services/${id}`).catch(() => null),
      api.get('/storefront/catalog').catch(() => []),
    ]).then(([srv, cat]) => {
      setService(srv);
      if (srv && Array.isArray(cat)) {
        setProduct(cat.find((p: any) => p.id === (srv as any).product_id) || null);
      }
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAction = async (action: string) => {
    setActionLoading(action);
    try {
      const res: any = await api.post(`/storefront/services/${id}/${action}`);
      const consoleUrl = res?.url || res?.wss_url;
      if (action === 'console' && consoleUrl) {
        window.open(consoleUrl, '_blank');
      }
      loadData();
    } catch (e: any) {
      toast(e.message || `Failed to ${action} container`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async () => {
    setActionLoading('cancel');
    try {
      await api.post(`/storefront/services/${id}/cancel`, { mode: 'period_end' });
      setShowCancelModal(false);
      toast('OCD service scheduled for cancellation at period end.', 'success');
      loadData();
    } catch (e: any) {
      toast(e.message || 'Failed to cancel service', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUncancel = async () => {
    setActionLoading('uncancel');
    try {
      await api.post(`/storefront/services/${id}/uncancel`);
      toast('Cancellation revoked.', 'success');
      loadData();
    } catch (e: any) {
      toast(e.message || 'Failed to revoke cancellation', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteNow = async () => {
    setActionLoading('delete');
    try {
      await api.delete(`/storefront/services/${id}`);
      toast('OCD application permanently deleted.', 'success');
      navigate('/dashboard/odp');
    } catch (e: any) {
      toast(e.message || 'Failed to delete application', 'error');
      setActionLoading(null);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-12 text-center text-sm text-[var(--fg-muted)] font-mono">
        Loading...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-12 text-center text-sm text-[var(--fg-muted)]">
        Service not found
      </div>
    );
  }

  const specs = product?.specs || {};
  const isRunning = service.status === 'running' || service.status === 'active';

  return (
    <div className="space-y-8">
      <Link
        to="/dashboard/odp"
        className="inline-flex items-center gap-1.5 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        One-Click Deploy (OCD)
      </Link>

      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isRunning
                  ? 'bg-[var(--ok)] shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                  : 'bg-[var(--warn)]'
              }`}
            />
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--fg)] font-mono">
              {service.name || product?.name || `ocd-${service.id.slice(0, 8)}`}
            </h1>
            <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--fg-muted)]">
              {service.status}
            </span>
          </div>
          <p className="text-xs text-[var(--fg-muted)]">
            <span>{product?.name || 'One-Click Deploy Instance'}</span> ·{' '}
            <span className="font-mono text-[var(--fg-faint)]">{service.id}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {service.status === 'stopped' ? (
            <button
              type="button"
              onClick={() => handleAction('start')}
              disabled={!!actionLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-[var(--ok-bg)] text-[var(--ok)] border border-[var(--ok)]/25 hover:bg-[var(--ok)]/20 transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              Start
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleAction('restart')}
                disabled={!!actionLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--line-bright)] text-[var(--fg)] transition-colors disabled:opacity-50"
              >
                <RotateCw
                  className={`w-3.5 h-3.5 ${actionLoading === 'restart' ? 'animate-spin' : ''}`}
                />
                Restart
              </button>
              <button
                type="button"
                onClick={() => handleAction('stop')}
                disabled={!!actionLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-[var(--err-bg)] text-[var(--err)] border border-[var(--err)]/25 hover:bg-[var(--err)]/20 transition-colors disabled:opacity-50"
              >
                <Square className="w-3.5 h-3.5" />
                Stop
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => handleAction('console')}
            disabled={!!actionLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-[var(--accent-subtle)] text-[var(--accent-bright)] border border-[var(--accent)]/30 hover:bg-[var(--accent)] hover:text-white transition-colors disabled:opacity-50"
          >
            <Terminal className="w-3.5 h-3.5" />
            Shell
          </button>

          {service.cancel_at_period_end ? (
            <button
              type="button"
              onClick={handleUncancel}
              disabled={!!actionLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-[var(--warn-bg)] text-[var(--warn)] border border-[var(--warn)]/25 hover:bg-[var(--warn)]/20 transition-colors disabled:opacity-50"
            >
              Revoke Cancel
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              disabled={!!actionLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-[var(--bg)] border border-[var(--line)] hover:bg-[var(--warn-bg)] text-[var(--fg-muted)] hover:text-[var(--warn)] hover:border-[var(--warn)]/30 transition-colors disabled:opacity-50"
            >
              Cancel at Period End
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            disabled={!!actionLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-[var(--bg)] border border-[var(--line)] hover:bg-[var(--err-bg)] text-[var(--fg-muted)] hover:text-[var(--err)] hover:border-[var(--err)]/30 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>

      {service.cancel_at_period_end && (
        <div className="rounded-xl bg-[var(--warn-bg)] border border-[var(--warn)]/25 px-5 py-4 flex items-center gap-3 text-xs text-[var(--warn)]">
          <AlertTriangle className="w-4 h-4 text-[var(--warn)] shrink-0" />
          <span>
            Scheduled for cancellation at the end of the current period
            {service.next_due ? ` (${new Date(service.next_due).toLocaleDateString()})` : ''}.
          </span>
        </div>
      )}

      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--line)] overflow-hidden">
        <div className="p-6 space-y-5">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--fg-faint)]">Endpoint & Identifiers</h2>
          <div className="divide-y divide-[var(--line)]">
            <div className="flex items-center justify-between gap-4 pb-3">
              <span className="text-xs text-[var(--fg-muted)]">Application Endpoint</span>
              <div className="flex items-center gap-1.5 font-mono text-sm text-[var(--fg)]">
                <span>{service.hostname || service.ip || 'Unassigned'}</span>
                {(service.hostname || service.ip) && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(service.hostname || service.ip, 'endpoint')}
                    aria-label="Copy application endpoint"
                    className="p-1 rounded-md text-[var(--fg-faint)] hover:text-[var(--fg)] transition-colors"
                  >
                    {copied === 'endpoint' ? (
                      <Check className="w-3.5 h-3.5 text-[var(--ok)]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <span className="text-xs text-[var(--fg-muted)]">Service ID</span>
              <span className="text-xs font-mono text-[var(--fg)]">{service.id}</span>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <span className="text-xs text-[var(--fg-muted)]">Container ID</span>
              <span className="text-xs font-mono text-[var(--fg)]">
                {service.provider_resource_id || '—'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-3">
              <span className="text-xs text-[var(--fg-muted)]">Region</span>
              <span className="text-xs font-mono text-[var(--fg)]">
                {specs.location || 'Frankfurt (DE-FRA1)'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--fg-faint)]">Runtime Environment</h2>
          <div className="divide-y divide-[var(--line)]">
            <div className="flex items-center justify-between gap-4 pb-3">
              <span className="text-xs text-[var(--fg-muted)]">Engine</span>
              <span className="text-xs font-mono text-[var(--fg)]">
                {specs.runtime || 'Pegasus Container Engine'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <span className="text-xs text-[var(--fg-muted)]">CPU / Memory</span>
              <span className="text-xs font-mono text-[var(--fg)]">
                {specs.cpu || 'Shared vCPU'} · {specs.ram || 'Managed RAM'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <span className="text-xs text-[var(--fg-muted)]">Persistent Volume</span>
              <span className="text-xs font-mono text-[var(--fg)]">
                {specs.disk || 'NVMe Persistent Volume'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-3">
              <span className="text-xs text-[var(--fg-muted)]">Next Renewal</span>
              <span className="text-xs font-mono text-[var(--fg)]">
                {service.next_due ? new Date(service.next_due).toLocaleDateString() : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {showCancelModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Cancel at Period End"
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-[var(--bg-elevated)] border border-[var(--line)] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-semibold text-[var(--fg)]">Cancel at Period End</h3>
            <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
              Your application will stay online until{' '}
              <span className="text-[var(--fg)] font-mono">
                {service.next_due ? new Date(service.next_due).toLocaleDateString() : 'period end'}
              </span>
              .
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-lg text-xs text-[var(--fg-muted)] hover:text-[var(--fg)]"
              >
                Keep Service
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={actionLoading === 'cancel'}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-amber-500 text-black hover:bg-amber-400 transition-colors"
              >
                {actionLoading === 'cancel' ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Delete Application"
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-[var(--bg-elevated)] border border-[var(--line)] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-semibold text-[var(--err)]">Delete Application</h3>
            <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
              This will permanently remove{' '}
              <span className="text-[var(--fg)] font-mono">
                {service.hostname || service.id.slice(0, 8)}
              </span>{' '}
              and all container volumes.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg text-xs text-[var(--fg-muted)] hover:text-[var(--fg)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteNow}
                disabled={actionLoading === 'delete'}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-rose-500 text-white hover:bg-rose-400 transition-colors"
              >
                {actionLoading === 'delete' ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
