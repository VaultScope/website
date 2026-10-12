import { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, KeyRound, Copy, Check, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/Shared';
import { api } from '../../../lib/api';

interface MfaSetupResponse {
  secret: string;
  qr_base64: string;
  url: string;
}

export function ProfileMfa() {
  const [loading, setLoading] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [setupStep, setSetupStep] = useState<'idle' | 'setting_up' | 'confirming'>('idle');
  const [setupData, setSetupData] = useState<MfaSetupResponse | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Disable modal state
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');

  const loadProfile = async () => {
    try {
      const data = await api.get<{ two_factor_enabled: boolean }>('/storefront/profile');
      setTwoFactorEnabled(data.two_factor_enabled);
    } catch (e: any) {
      setError(e?.message || 'Failed to load profile MFA status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleStartSetup = async () => {
    setError(null);
    setSuccess(null);
    setActionLoading(true);
    try {
      const res = await api.post<MfaSetupResponse>('/storefront/profile/mfa/setup');
      setSetupData(res);
      setSetupStep('setting_up');
    } catch (err: any) {
      setError(err?.message || 'Failed to initialize MFA setup');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEnableMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.trim().length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }
    setError(null);
    setActionLoading(true);
    try {
      await api.post('/storefront/profile/mfa/enable', { code: code.trim() });
      setTwoFactorEnabled(true);
      setSetupStep('idle');
      setSetupData(null);
      setCode('');
      setSuccess('Two-factor authentication has been successfully activated!');
    } catch (err: any) {
      setError(err?.message || 'Invalid verification code. Please check your authenticator app.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisableMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disablePassword) {
      setError('Please enter your account password');
      return;
    }
    setError(null);
    setActionLoading(true);
    try {
      await api.post('/storefront/profile/mfa/disable', { password: disablePassword });
      setTwoFactorEnabled(false);
      setShowDisableModal(false);
      setDisablePassword('');
      setSuccess('Two-factor authentication has been disabled.');
    } catch (err: any) {
      setError(err?.message || 'Failed to disable 2FA. Incorrect password.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopySecret = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading security settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
          {success}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="border border-border p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-card/40">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${twoFactorEnabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
            {twoFactorEnabled ? <ShieldCheck className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
          </div>
          <div>
            <h2 className="text-xl font-medium mb-1">
              Two-Factor Authentication (TOTP)
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              {twoFactorEnabled
                ? 'Your account is actively protected with time-based one-time passwords (TOTP). Every login requires a 6-digit code from your authenticator app.'
                : 'Protect your VaultScope account and cloud infrastructure against unauthorized access by requiring an authenticator code (Google Authenticator, 1Password, Bitwarden) during login.'}
            </p>
          </div>
        </div>

        <div>
          {twoFactorEnabled ? (
            <Button
              variant="outline"
              onClick={() => setShowDisableModal(true)}
              className="text-red-400 border-red-500/30 hover:bg-red-500/10"
            >
              Disable 2FA
            </Button>
          ) : setupStep === 'idle' ? (
            <Button onClick={handleStartSetup} disabled={actionLoading} className="gap-2">
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              Set up 2FA
            </Button>
          ) : null}
        </div>
      </div>

      {setupStep === 'setting_up' && setupData && (
        <div className="border border-border p-6 bg-card/60 space-y-6">
          <div className="border-b border-border pb-4">
            <h3 className="text-lg font-medium">Link Your Authenticator App</h3>
            <p className="text-sm text-muted-foreground">
              Scan the QR code below using Google Authenticator, 1Password, Bitwarden or your preferred 2FA app.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg w-fit mx-auto md:mx-0 shadow-sm">
              <img
                src={`data:image/png;base64,${setupData.qr_base64}`}
                alt="2FA QR Code"
                className="w-48 h-48 block"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider block mb-1">
                  Manual Entry Key
                </label>
                <div className="flex items-center gap-2">
                  <code className="bg-secondary/70 border border-border px-3 py-2 text-sm font-mono tracking-widest flex-1 select-all break-all">
                    {setupData.secret}
                  </code>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopySecret}
                    className="h-9 px-3 gap-1.5"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>

              <form onSubmit={handleEnableMfa} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider block mb-1">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-secondary/50 border border-border px-3 py-2 text-center text-xl font-mono tracking-widest focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="submit"
                    disabled={actionLoading || code.length !== 6}
                    className="flex-1 gap-2"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    Verify & Activate
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSetupStep('idle');
                      setSetupData(null);
                      setCode('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDisableModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-lg font-medium text-red-400">Disable Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">
              To deactivate 2FA security on your account, please enter your current password to confirm:
            </p>

            <form onSubmit={handleDisableMfa} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Account Password</label>
                <input
                  type="password"
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-secondary/50 border border-border px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowDisableModal(false);
                    setDisablePassword('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={actionLoading || !disablePassword}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Disable'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
