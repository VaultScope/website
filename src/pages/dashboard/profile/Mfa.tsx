import { useState, useEffect } from 'react';
import { Shield, Smartphone, Key, CheckCircle2, Copy, Check } from 'lucide-react';
import { api } from '../../../lib/api';

export function ProfileMfa() {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [setupData, setSetupData] = useState<{ secret: string; qr_url: string } | null>(null);
  const [code, setCode] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [showDisablePrompt, setShowDisablePrompt] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [copiedRecovery, setCopiedRecovery] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadProfile = () => {
    setLoading(true);
    api
      .get('/storefront/profile')
      .then((p: any) => {
        setMfaEnabled(Boolean(p?.two_factor_enabled));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleStartSetup = async () => {
    setError('');
    setSubmitting(true);
    try {
      const res: any = await api.post('/storefront/profile/mfa/setup');
      setSetupData(res);
    } catch (e: any) {
      setError(e.message || 'Failed to initiate 2FA setup');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEnable = async () => {
    if (!code.trim()) return;
    setError('');
    setSubmitting(true);
    try {
      const res: any = await api.post('/storefront/profile/mfa/enable', { code: code.trim() });
      setSetupData(null);
      setCode('');
      setMfaEnabled(true);
      if (Array.isArray(res?.recovery_codes)) {
        setRecoveryCodes(res.recovery_codes);
      }
    } catch (e: any) {
      setError(e.message || 'Invalid verification code');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisable = async () => {
    if (!disableCode.trim()) {
      setError('Please enter your 6-digit authenticator code or recovery code');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await api.post('/storefront/profile/mfa/disable', { code: disableCode.trim() });
      setMfaEnabled(false);
      setShowDisablePrompt(false);
      setDisableCode('');
      setRecoveryCodes(null);
    } catch (e: any) {
      setError(e.message || 'Failed to disable 2FA');
    } finally {
      setSubmitting(false);
    }
  };

  const copyRecoveryCodes = () => {
    if (!recoveryCodes) return;
    navigator.clipboard.writeText(recoveryCodes.join('\n'));
    setCopiedRecovery(true);
    setTimeout(() => setCopiedRecovery(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
              <h2 className="text-base font-semibold text-[var(--fg)]">
                Two-Factor Authentication (TOTP)
              </h2>
              {!loading && (
                <span
                  className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full ${
                    mfaEnabled
                      ? 'bg-emerald-500/15 text-[var(--ok)]'
                      : 'bg-[var(--bg-subtle)] text-[var(--fg-faint)]'
                  }`}
                >
                  {mfaEnabled ? 'Enabled' : 'Disabled'}
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--fg-muted)] max-w-xl leading-relaxed">
              {mfaEnabled
                ? 'Your account is actively protected with Time-based One-Time Password (TOTP) verification.'
                : 'Protect your VaultScope account and cloud infrastructure by requiring a time-based 6-digit code at sign-in.'}
            </p>
          </div>

          {!loading && !setupData && (
            <div>
              {mfaEnabled ? (
                <button
                  type="button"
                  onClick={() => setShowDisablePrompt((v) => !v)}
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-rose-500/15 border border-rose-500/25 text-[var(--err)] hover:bg-rose-500 hover:text-white transition-colors"
                >
                  Disable 2FA
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartSetup}
                  disabled={submitting}
                  className="vs-btn-primary !px-5 !py-2 !text-xs"
                >
                  {submitting ? 'Preparing...' : 'Set up 2FA'}
                </button>
              )}
            </div>
          )}
        </div>

        {error && (
          <div role="alert" className="rounded-xl bg-rose-500/10 border border-rose-500/25 px-4 py-3 text-xs text-[var(--err)]">{error}</div>
        )}

        {showDisablePrompt && mfaEnabled && (
          <div className="pt-5 border-t border-[var(--line)] space-y-4">
            <p className="text-xs text-[var(--fg-muted)]">
              Enter your current 6-digit TOTP code or a recovery code to disable 2FA:
            </p>
            <div className="flex flex-wrap gap-2 max-w-md">
              <input
                type="text"
                aria-label="Current 6-digit TOTP or recovery code"
                value={disableCode}
                onChange={(e) => setDisableCode(e.target.value)}
                placeholder="000000"
                className="flex-1 rounded-xl bg-[var(--bg)] border border-[var(--line)] px-4 py-2 text-xs font-mono text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)]"
              />
              <button
                type="button"
                onClick={handleDisable}
                disabled={submitting}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-rose-500 text-white hover:bg-rose-600 transition-colors"
              >
                {submitting ? 'Disabling...' : 'Confirm Disable'}
              </button>
            </div>
          </div>
        )}

        {setupData && (
          <div className="pt-6 border-t border-[var(--line)] space-y-5">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {setupData.qr_url && (
                <div className="p-3 bg-white rounded-xl shrink-0">
                  <img src={setupData.qr_url} alt="TOTP QR Code" className="w-36 h-36" />
                </div>
              )}
              <div className="space-y-3 flex-1">
                <div className="text-xs text-[var(--fg-muted)]">
                  Scan the QR code in your authenticator app or enter this manual secret key:
                </div>
                <div className="inline-block rounded-lg bg-[var(--bg-subtle)] px-3 py-1.5 font-mono text-xs text-[var(--accent-bright)]">
                  {setupData.secret}
                </div>
                <div className="flex flex-wrap gap-2 pt-2 max-w-sm">
                  <input
                    type="text"
                    aria-label="6-digit authenticator verification code"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="6-digit code"
                    className="flex-1 rounded-xl bg-[var(--bg)] border border-[var(--line)] px-4 py-2 text-xs font-mono text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)]"
                  />
                  <button
                    type="button"
                    onClick={handleEnable}
                    disabled={submitting}
                    className="vs-btn-primary !px-5 !py-2 !text-xs"
                  >
                    {submitting ? 'Verifying...' : 'Verify & Enable'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {recoveryCodes && (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--ok)] text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Your Emergency Recovery Codes</span>
              </div>
              <button
                type="button"
                onClick={copyRecoveryCodes}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--ok)] hover:underline"
              >
                {copiedRecovery ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedRecovery ? 'Copied' : 'Copy All'}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs text-[var(--fg)]">
              {recoveryCodes.map((rc) => (
                <div key={rc} className="rounded-lg bg-[var(--bg-card)] border border-[var(--line)] px-3 py-2 text-center">
                  {rc}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-5 flex items-center gap-3.5 opacity-60">
          <Key className="w-4 h-4 text-[var(--fg-faint)]" />
          <div>
            <div className="text-xs font-medium text-[var(--fg)]">WebAuthn / YubiKey</div>
            <div className="text-[11px] text-[var(--fg-faint)]">Hardware FIDO2 keys (Planned)</div>
          </div>
        </div>
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-5 flex items-center gap-3.5 opacity-60">
          <Shield className="w-4 h-4 text-[var(--fg-faint)]" />
          <div>
            <div className="text-xs font-medium text-[var(--fg)]">Backup Recovery Key</div>
            <div className="text-[11px] text-[var(--fg-faint)]">Generated upon TOTP enrollment</div>
          </div>
        </div>
      </div>
    </div>
  );
}
