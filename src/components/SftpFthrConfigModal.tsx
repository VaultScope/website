import { useState } from 'react';
import { ShieldAlert, Copy, Check, X, AlertTriangle, Eye, EyeOff, Lock } from 'lucide-react';
import { Button } from './Shared';

export interface FthrConfig {
  username: string;
  password: string;
  port: number;
  domain: string;
  providerName: string;
}

interface SftpFthrConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FthrConfig | null;
  serviceName?: string;
}

export function SftpFthrConfigModal({
  isOpen,
  onClose,
  config: initialConfig,
  serviceName,
}: SftpFthrConfigModalProps) {
  const [copied, setCopied] = useState(true);
  const [customPassword, setCustomPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen || !initialConfig) return null;

  // Use custom password if user overrides/provides it
  const effectiveConfig: FthrConfig = {
    ...initialConfig,
    password: customPassword || initialConfig.password || '',
  };

  const jsonString = JSON.stringify(effectiveConfig, null, 2);

  const handleCopyAgain = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-card border border-red-500/30 w-full max-w-xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Warning Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-amber-500 to-red-500" />

        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Don't share this with anyone
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                FTHR configuration for {serviceName || 'SFTP Storage'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-sm">
          {/* Security Alert Banner */}
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <div className="text-xs leading-relaxed space-y-1">
              <p className="font-semibold text-red-500 uppercase tracking-wider text-[11px]">
                High Security Warning
              </p>
              <p className="text-foreground/90">
                The configuration containing your SFTP credentials has been copied to your clipboard.
                Anyone who gets access to this JSON model can <strong>connect, read, upload, and permanently delete</strong> all files stored on your server.
              </p>
              <p className="text-muted-foreground">
                Never share this configuration in public chats, live streams, support tickets, or repositories.
              </p>
            </div>
          </div>

          {/* Copied Success Badge */}
          <div className="flex items-center justify-between px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-md text-green-500 text-xs">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>Copied to clipboard successfully!</span>
            </div>
            <span className="font-mono text-[11px] text-green-600 dark:text-green-400">Ready to paste into FTHR</span>
          </div>

          {/* JSON Display */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Copied JSON Model
              </span>
              <button
                type="button"
                onClick={handleCopyAgain}
                className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-400 font-medium transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy again</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-zinc-950 text-zinc-200 border border-border rounded-lg font-mono text-xs overflow-x-auto selection:bg-blue-600/30">
              <code>{jsonString}</code>
            </pre>
          </div>

          {/* Optional Password Provider if empty */}
          {!initialConfig.password && (
            <div className="p-3.5 bg-muted/40 border border-border rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Need to supply your password?</span>
              </div>
              <p className="text-xs text-muted-foreground">
                If the initial password is no longer stored in session memory, enter it below to include it in the copied JSON.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <div className="relative flex-1">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    placeholder="Enter SFTP password..."
                    className="w-full bg-background border border-border rounded px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-foreground pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAgain}
                  className="px-3 py-1.5 bg-foreground text-background hover:bg-foreground/90 rounded text-xs font-medium transition-colors shrink-0"
                >
                  Update & Copy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-3 border-t border-border bg-card flex justify-end">
          <Button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 font-medium text-sm"
          >
            I understand, keep safe
          </Button>
        </div>
      </div>
    </div>
  );
}
