import { useState } from 'react';
import { AlertTriangle, Calendar, Trash2, X, ChevronDown, HelpCircle } from 'lucide-react';
import { Button } from './Shared';
import { api } from '../lib/api';

interface CancelServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  service: {
    id: string;
    name: string;
    hostname?: string;
    next_due?: string;
  } | null;
}

export function CancelServiceModal({
  isOpen,
  onClose,
  onSuccess,
  service,
}: CancelServiceModalProps) {
  const [mode, setMode] = useState<'end_of_period' | 'immediate'>('end_of_period');
  const [reason, setReason] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !service) return null;

  const handleCancel = async () => {
    if (!confirmed) return;
    setLoading(true);
    setError(null);

    try {
      await api.post(`/storefront/services/${service.id}/cancel`, {
        mode,
        reason: reason || undefined,
        feedback: feedback.trim() || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to process cancellation. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Cancel Service</h3>
              <p className="text-xs text-muted-foreground font-mono">{service.name} {service.hostname ? `(${service.hostname})` : ''}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Cancellation Type Selector */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
              Cancellation Timing
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setMode('end_of_period')}
                className={`cursor-pointer border p-4 rounded-lg transition-all flex flex-col justify-between ${
                  mode === 'end_of_period'
                    ? 'border-blue-500 bg-blue-500/5'
                    : 'border-border hover:border-border/80'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className={`w-4 h-4 ${mode === 'end_of_period' ? 'text-blue-500' : 'text-muted-foreground'}`} />
                  <span className="font-medium text-sm">At Period End</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Stay active until {service.next_due ? new Date(service.next_due).toLocaleDateString() : 'end of cycle'}. No more charges.
                </p>
              </div>

              <div
                onClick={() => setMode('immediate')}
                className={`cursor-pointer border p-4 rounded-lg transition-all flex flex-col justify-between ${
                  mode === 'immediate'
                    ? 'border-red-500 bg-red-500/5'
                    : 'border-border hover:border-border/80'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Trash2 className={`w-4 h-4 ${mode === 'immediate' ? 'text-red-500' : 'text-muted-foreground'}`} />
                  <span className="font-medium text-sm">Immediately</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Terminate service and erase storage right away.
                </p>
              </div>
            </div>
          </div>

          {/* Reason Selector */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/70" />
              <span>Reason for Cancellation</span>
              <span className="text-muted-foreground/50 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative">
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-background border border-border rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="">Select a reason...</option>
                <option value="project_finished">Project finished / No longer needed</option>
                <option value="switching_provider">Switching to another provider</option>
                <option value="too_expensive">Too expensive / Budget changes</option>
                <option value="technical_issues">Technical issues or missing features</option>
                <option value="temporary_pause">Temporary pause</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Feedback Textarea */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Feedback / Suggestions <span className="text-muted-foreground/50 font-normal">(optional)</span>
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="How could we improve our services for you?"
              rows={2}
              className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Backup / Data Warning */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs leading-relaxed text-amber-600 dark:text-amber-400">
            <span className="font-semibold block mb-1">Important: Permanent Data Deletion</span>
            Upon cancellation {mode === 'immediate' ? 'now' : 'at the end of your billing cycle'}, all files, credentials, and configurations associated with this service will be wiped. Please ensure you have downloaded any needed backups before final termination.
          </div>

          {/* Confirmation Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 rounded border-border text-red-600 focus:ring-red-500"
            />
            <span className="text-xs text-muted-foreground leading-normal">
              I understand that this action will permanently terminate my service and delete all stored data.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-card">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Keep Service
          </Button>
          <Button
            onClick={handleCancel}
            disabled={!confirmed || loading}
            className="bg-red-600 hover:bg-red-700 text-white border-transparent"
          >
            {loading ? 'Processing...' : mode === 'immediate' ? 'Cancel Service Now' : 'Confirm Cancellation'}
          </Button>
        </div>
      </div>
    </div>
  );
}
