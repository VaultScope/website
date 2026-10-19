import { useState, useEffect } from 'react';
import { AlertTriangle, Calendar, Trash2, X, HelpCircle } from 'lucide-react';
import { Button, CustomSelect } from './Shared';
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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-service-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
    >
      <div className="bg-card border border-border w-full max-w-lg rounded-xl shadow-2xl overflow-visible animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10 text-[var(--err)]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="cancel-service-modal-title" className="text-lg font-semibold text-foreground">Cancel Service</h3>
              <p className="text-xs text-muted-foreground font-mono">{service.name} {service.hostname ? `(${service.hostname})` : ''}</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            disabled={loading}
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-[var(--bg-subtle)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div role="alert" className="p-3 bg-red-500/10 border border-red-500/20 text-[var(--err)] text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Cancellation Type Selector */}
          <div role="radiogroup" aria-label="Cancellation Timing">
            <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
              Cancellation Timing
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                role="radio"
                aria-checked={mode === 'end_of_period'}
                tabIndex={0}
                onClick={() => setMode('end_of_period')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setMode('end_of_period');
                  }
                }}
                className={`cursor-pointer border p-4 rounded-lg transition-all flex flex-col justify-between ${
                  mode === 'end_of_period'
                    ? 'border-[var(--accent-bright)] bg-[var(--accent-subtle)]'
                    : 'border-border hover:border-[var(--line-strong)]'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className={`w-4 h-4 ${mode === 'end_of_period' ? 'text-[var(--accent-bright)]' : 'text-muted-foreground'}`} />
                  <span className="font-medium text-sm text-foreground">At Period End</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Stay active until {service.next_due ? new Date(service.next_due).toLocaleDateString() : 'end of cycle'}. No more charges.
                </p>
              </div>

              <div
                role="radio"
                aria-checked={mode === 'immediate'}
                tabIndex={0}
                onClick={() => setMode('immediate')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setMode('immediate');
                  }
                }}
                className={`cursor-pointer border p-4 rounded-lg transition-all flex flex-col justify-between ${
                  mode === 'immediate'
                    ? 'border-red-500 bg-red-500/5'
                    : 'border-border hover:border-[var(--line-strong)]'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Trash2 className={`w-4 h-4 ${mode === 'immediate' ? 'text-[var(--err)]' : 'text-muted-foreground'}`} />
                  <span className="font-medium text-sm text-foreground">Immediately</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Terminate service and erase storage right away.
                </p>
              </div>
            </div>
          </div>

          {/* Reason Selector */}
          <div>
            <label htmlFor="cancel-reason" className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/70" />
              <span>Reason for Cancellation</span>
              <span className="text-muted-foreground/50 font-normal lowercase">(optional)</span>
            </label>
            <CustomSelect
              id="cancel-reason"
              name="reason"
              value={reason}
              onChange={setReason}
              placeholder="Select a reason..."
              options={[
                { value: '', label: 'Select a reason...' },
                { value: 'project_finished', label: 'Project finished / No longer needed' },
                { value: 'switching_provider', label: 'Switching to another provider' },
                { value: 'too_expensive', label: 'Too expensive / Budget changes' },
                { value: 'technical_issues', label: 'Technical issues or missing features' },
                { value: 'temporary_pause', label: 'Temporary pause' },
                { value: 'other', label: 'Other' },
              ]}
            />
          </div>

          {/* Feedback Textarea */}
          <div>
            <label htmlFor="cancel-feedback" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Feedback / Suggestions <span className="text-muted-foreground/50 font-normal">(optional)</span>
            </label>
            <textarea
              id="cancel-feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="How could we improve our services for you?"
              rows={2}
              className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:outline-none focus:border-[var(--accent-bright)] resize-none"
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
