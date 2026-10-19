import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderLock,
  Copy,
  Check,
  Eye,
  EyeOff,
  Terminal,
  ShieldAlert,
  ChevronDown,
  Plus,
} from 'lucide-react';
import { api } from '../../lib/api';

interface SftpService {
  id: string;
  name: string;
  status: string;
  is_trial: boolean;
  trial_ends_at?: string;
  hostname?: string;
  provider_resource_id?: string;
  config?: any;
  created_at?: string;
}

export default function SftpStorage() {
  const [services, setServices] = useState<SftpService[]>([]);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingTrial, setClaimingTrial] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [openConfigDropdown, setOpenConfigDropdown] = useState<string | null>(null);
  const [showSecurityWarning, setShowSecurityWarning] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [srvList, catList] = await Promise.all([
        api.get<SftpService[]>('/storefront/services').catch(() => []),
        api.get<any[]>('/storefront/catalog').catch(() => []),
      ]);
      const sftpServices = (Array.isArray(srvList) ? srvList : []).filter(
        (s) =>
          s.name?.toLowerCase().includes('sftp') ||
          s.config?.storage_gb ||
          s.hostname?.includes('sftp') ||
          (s as any).provider_type === 'sftp'
      );
      setServices(sftpServices);
      setCatalog(
        (Array.isArray(catList) ? catList : []).filter(
          (p) =>
            !p.hidden &&
            (p.name?.toLowerCase().includes('sftp') ||
              p.category?.toLowerCase() === 'storage' ||
              p.provider?.toLowerCase() === 'sftpgo')
        )
      );
    } catch (e: any) {
      setError(e.message || 'Failed to load SFTP storage services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClaimTrial = async (productId: string) => {
    setClaimingTrial(true);
    setError('');
    try {
      await api.post('/storefront/orders', {
        product_id: productId,
        billing_cycle: 'monthly',
        is_trial: true,
        config: {},
      });
      await loadData();
    } catch (e: any) {
      setError(e.message || 'Failed to activate trial');
    } finally {
      setClaimingTrial(false);
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyFthr = (s: SftpService) => {
    const username = s.provider_resource_id || `vs_${s.id.substring(0, 8)}`;
    const password =
      s.config?.raw_response?.password || s.config?.password || 'Check welcome email';
    const fthrPayload = {
      username,
      password,
      port: 2022,
      domain: 'sftp.vaultscope.de',
      providerName: 'VaultScope',
    };
    navigator.clipboard.writeText(JSON.stringify(fthrPayload, null, 2));
    setOpenConfigDropdown(null);
    setShowSecurityWarning(true);
  };

  const trialProduct = catalog.find(
    (p) => p.trial_days > 0 || parseFloat(p.price || '0') === 0
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">
            SFTP Vault Storage
          </h1>
          <p className="text-xs text-[var(--fg-muted)]">
            Encrypted ZFS datasets accessible via SFTP, SSHFS, Rclone, and rsync on port 2022.
          </p>
        </div>

        <Link
          to="/dashboard/new?category=storage"
          className="vs-btn-primary text-xs py-2 px-4 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          New Storage Vault
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl bg-[var(--err-bg)] border border-[var(--err)]/25 px-5 py-3.5 text-xs text-[var(--err)]"
        >
          {error}
        </div>
      )}

      {services.length === 0 && !loading && trialProduct && (
        <div className="rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent)]/30 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent-bright)]">
              Complimentary Trial
            </span>
            <h2 className="text-lg font-semibold text-[var(--fg)]">
              25 GB SFTP Vault — 14 Days Free
            </h2>
            <p className="text-xs text-[var(--fg-muted)] max-w-xl">
              Instant provisioning in Frankfurt (DE-FRA1) with chroot isolation and automated snapshots.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleClaimTrial(trialProduct.id)}
            disabled={claimingTrial}
            className="vs-btn-primary text-xs py-2.5 px-5 shrink-0 disabled:opacity-50"
          >
            {claimingTrial ? 'Provisioning...' : 'Claim 25 GB Free Trial'}
          </button>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-12 text-center text-sm text-[var(--fg-muted)] font-mono">
          Loading SFTP storage...
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-12 text-center space-y-3">
          <FolderLock className="w-8 h-8 text-[var(--fg-faint)] mx-auto" />
          <p className="text-sm text-[var(--fg-muted)]">No SFTP storage vaults active.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((s) => {
            const username = s.provider_resource_id || `vs_${s.id.substring(0, 8)}`;
            const password =
              s.config?.raw_response?.password || s.config?.password || 'Check welcome email';
            const host = 'sftp.vaultscope.de';
            const port = 2022;
            const sftpCmd = `sftp -P ${port} ${username}@${host}`;

            return (
              <div
                key={s.id}
                className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-6 sm:p-8 space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <FolderLock className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
                      <h3 className="text-base font-semibold text-[var(--fg)]">{s.name}</h3>
                      <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--ok-bg)] text-[var(--ok)]">
                        {s.status}
                      </span>
                      {s.is_trial && (
                        <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent-bright)]">
                          Trial
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-[var(--fg-faint)] pl-6">
                      {host}:{port}
                    </p>
                  </div>

                  {/* Configurations Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      aria-expanded={openConfigDropdown === s.id}
                      aria-haspopup="menu"
                      onClick={() =>
                        setOpenConfigDropdown(openConfigDropdown === s.id ? null : s.id)
                      }
                      className={`inline-flex items-center gap-2 h-8 px-3 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
                        openConfigDropdown === s.id
                          ? 'bg-[var(--bg-subtle)] border-[var(--line-strong)] text-[var(--fg)]'
                          : 'bg-[var(--bg-elevated)] border-[var(--line)] hover:border-[var(--line-strong)] hover:bg-[var(--bg-subtle)] text-[var(--fg)]'
                      }`}
                    >
                      <span>CONFIGURATIONS</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-[var(--fg-faint)] transition-transform duration-200 ${
                          openConfigDropdown === s.id
                            ? 'rotate-180 text-[var(--accent-bright)]'
                            : ''
                        }`}
                      />
                    </button>

                    {openConfigDropdown === s.id && (
                      <div
                        role="menu"
                        className="absolute right-0 mt-2 w-56 rounded-xl vs-dropdown-panel animate-vs-dropdown p-1.5 z-30"
                      >
                        <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--fg-faint)]">
                          Client Presets
                        </div>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => handleCopyFthr(s)}
                          className="group w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors flex items-center justify-between gap-3 cursor-pointer"
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-[var(--fg)]">FTHR</div>
                            <div className="text-[11px] text-[var(--fg-muted)]">
                              Copy clipping JSON
                            </div>
                          </div>
                          <Copy className="w-4 h-4 text-[var(--fg-muted)] group-hover:text-[var(--accent-bright)] transition-colors shrink-0" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Credentials Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-5 border-y border-[var(--line)]">
                  <div className="space-y-1">
                    <div className="text-[11px] text-[var(--fg-faint)]">Host</div>
                    <div className="flex items-center justify-between gap-2 font-mono text-xs text-[var(--fg)]">
                      <span className="truncate">{host}</span>
                      <button
                        type="button"
                        onClick={() => copyText(host, `host-${s.id}`)}
                        aria-label="Copy SFTP host"
                        className="p-1 rounded-md text-[var(--fg-faint)] hover:text-[var(--fg)]"
                      >
                        {copiedKey === `host-${s.id}` ? (
                          <Check className="w-3.5 h-3.5 text-[var(--ok)]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] text-[var(--fg-faint)]">Port</div>
                    <div className="font-mono text-xs text-[var(--fg)]">{port}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] text-[var(--fg-faint)]">Username</div>
                    <div className="flex items-center justify-between gap-2 font-mono text-xs text-[var(--fg)]">
                      <span className="truncate">{username}</span>
                      <button
                        type="button"
                        onClick={() => copyText(username, `user-${s.id}`)}
                        aria-label="Copy SFTP username"
                        className="p-1 rounded-md text-[var(--fg-faint)] hover:text-[var(--fg)]"
                      >
                        {copiedKey === `user-${s.id}` ? (
                          <Check className="w-3.5 h-3.5 text-[var(--ok)]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] text-[var(--fg-faint)]">Password</div>
                    <div className="flex items-center justify-between gap-2 font-mono text-xs text-[var(--fg)]">
                      <span className="truncate">
                        {showPass[s.id] ? password : '••••••••••••'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setShowPass((prev) => ({ ...prev, [s.id]: !prev[s.id] }))
                          }
                          aria-label={showPass[s.id] ? 'Hide SFTP password' : 'Show SFTP password'}
                          className="p-1 rounded-md text-[var(--fg-faint)] hover:text-[var(--fg)]"
                        >
                          {showPass[s.id] ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => copyText(password, `pass-${s.id}`)}
                          aria-label="Copy SFTP password"
                          className="p-1 rounded-md text-[var(--fg-faint)] hover:text-[var(--fg)]"
                        >
                          {copiedKey === `pass-${s.id}` ? (
                            <Check className="w-3.5 h-3.5 text-[var(--ok)]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CLI Quick Connect */}
                <div className="rounded-lg bg-[var(--bg-subtle)] px-4 py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5 min-w-0 font-mono text-xs text-[var(--accent-bright)]">
                    <Terminal className="w-3.5 h-3.5 text-[var(--fg-faint)] shrink-0" />
                    <code className="truncate">{sftpCmd}</code>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText(sftpCmd, `cmd-${s.id}`)}
                    className="text-xs font-mono text-[var(--fg-muted)] hover:text-[var(--fg)] shrink-0"
                  >
                    {copiedKey === `cmd-${s.id}` ? 'Copied' : 'Copy CLI'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showSecurityWarning && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="High Security Warning"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
        >
          <div className="bg-[var(--bg-elevated)] border border-[var(--line)] rounded-2xl max-w-md w-full p-8 text-center space-y-5 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[var(--err-bg)] text-[var(--err)] flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono uppercase text-[var(--err)]">
                High Security Warning
              </div>
              <h3 className="text-lg font-semibold text-[var(--fg)]">
                Don't share this with anyone
              </h3>
              <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                The FTHR configuration copied to your clipboard contains unencrypted SFTP credentials.
              </p>
            </div>
            <div className="rounded-xl bg-[var(--ok-bg)] border border-[var(--ok)]/20 py-2 px-3 text-xs font-mono text-[var(--ok)] inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              Copied to clipboard successfully!
            </div>
            <button
              type="button"
              onClick={() => setShowSecurityWarning(false)}
              className="vs-btn-primary w-full justify-center py-2.5 text-xs"
            >
              I understand, keep safe
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
