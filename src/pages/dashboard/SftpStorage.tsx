import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { HardDrive, Check, Copy, AlertCircle, RotateCcw, HelpCircle, Sliders, ChevronDown } from 'lucide-react';
import { CancelServiceModal } from '../../components/CancelServiceModal';
import { SftpFthrConfigModal, type FthrConfig } from '../../components/SftpFthrConfigModal';

export default function SftpStorage() {
  const [services, setServices] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [cancellingService, setCancellingService] = useState<any | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [fthrModalConfig, setFthrModalConfig] = useState<{
    isOpen: boolean;
    config: FthrConfig | null;
    serviceName?: string;
  }>({ isOpen: false, config: null });
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    if (openDropdownId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);

  const handleCopyFthrConfig = async (s: any) => {
    setOpenDropdownId(null);
    
    // Official domain of the SFTP storage, NOT custom hostname
    const officialDomain = s.config?.official_domain || s.config?.server_domain || 'sftp.vaultscope.de';

    const fthrConfig: FthrConfig = {
      username: s.provider_resource_id || '',
      password: s.config?.raw_response?.password || '',
      port: 2022,
      domain: officialDomain,
      providerName: 'VaultScope',
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(fthrConfig, null, 2));
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }

    setFthrModalConfig({
      isOpen: true,
      config: fthrConfig,
      serviceName: s.name,
    });
  };

  const fetchServices = () => {
    api.get<any[]>('/storefront/services').then(data => {
      setServices(data.filter(s => s.name.toLowerCase().includes('sftp')));
    });
  };

  useEffect(() => {
    fetchServices();

    // Fetch products to find the SFTP offering
    api.get<any[]>('/storefront/catalog').then(data => {
      setProducts(data.filter(p => p.name.toLowerCase().includes('sftp')));
    });
  }, []);

  const handleUncancel = async (serviceId: string) => {
    try {
      await api.post(`/storefront/services/${serviceId}/uncancel`);
      alert('Cancellation revoked! Your service will continue renewing normally.');
      fetchServices();
    } catch (err: any) {
      alert(err?.message || 'Failed to revoke cancellation');
    }
  };

  const subscribe = async (productId: string) => {
    try {
      await api.post('/storefront/orders', { product_id: productId });
      alert('Subscription created! Your SFTP server is being provisioned.');
      window.location.reload();
    } catch (err) {
      alert('Failed to subscribe.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">SFTP Storage</h2>

      {services.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Active Storage</h3>
          {services.map(s => (
            <div key={s.id} className="bg-card border border-border p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <HardDrive className="text-blue-500" />
                  <h4 className="text-lg font-medium">{s.name}</h4>
                  <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full uppercase">
                    {s.status}
                  </span>
                  {s.is_trial && (
                    <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs rounded-full font-mono">
                      Trial Active
                    </span>
                  )}
                </div>
                {s.cancel_at_period_end && (
                  <span className="px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs rounded-full font-medium">
                    Cancelling at period end
                  </span>
                )}
              </div>

              {s.cancel_at_period_end && (
                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-between text-xs text-amber-600 dark:text-amber-400">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Scheduled to terminate on {s.next_due ? new Date(s.next_due).toLocaleDateString() : 'end of cycle'}. No renewal charges.</span>
                  </div>
                  <button
                    onClick={() => handleUncancel(s.id)}
                    className="inline-flex items-center gap-1 font-medium hover:underline text-amber-600 dark:text-amber-300 ml-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Undo
                  </button>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground block text-xs">Hostname / Server Domain</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{s.hostname || 'sftp.vaultscope.de'}</span>
                    <button onClick={() => copyToClipboard(s.hostname || 'sftp.vaultscope.de')}><Copy size={14} /></button>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono block mt-0.5">
                    Direct IP: {s.ip && s.ip !== '10.20.10.60' ? s.ip : '176.9.0.171'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Port</span>
                  <span className="font-mono">2022</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Username</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{s.provider_resource_id}</span>
                    <button onClick={() => copyToClipboard(s.provider_resource_id)}><Copy size={14} /></button>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Password</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{s.config?.raw_response?.password || '********'}</span>
                    <button onClick={() => copyToClipboard(s.config?.raw_response?.password || '')}><Copy size={14} /></button>
                  </div>
                  <span className="text-xs text-muted-foreground block mt-1">
                    {s.config?.raw_response?.password ? 'Save this password securely. It will be hidden later.' : 'Check your email or provisioning logs for the initial password.'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Storage Quota</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-foreground">
                      {s.quota_gb || (s.config?.raw_response?.sftpgo_user?.quota_size ? Math.round(s.config.raw_response.sftpgo_user.quota_size / (1024 * 1024 * 1024)) : 25)} GB
                    </span>
                    {s.is_trial && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                        Trial (auto-upgrades to 150 GB plan on renewal)
                      </span>
                    )}
                  </div>
                </div>
                </div>
              <div className="mt-6 border-t border-border pt-6 flex flex-col sm:flex-row items-center gap-3">
                <a 
                  href="/web/client" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-foreground text-background hover:bg-foreground/90 flex-1 w-full flex justify-center items-center gap-2 py-2.5 rounded-md font-medium text-sm transition-colors"
                >
                  <HardDrive className="w-4 h-4" />
                  Open Web File Manager
                </a>

                {/* Configurations Dropdown */}
                <div className="relative w-full sm:w-auto" ref={openDropdownId === s.id ? dropdownRef : undefined}>
                  <button
                    type="button"
                    onClick={() => setOpenDropdownId(openDropdownId === s.id ? null : s.id)}
                    className="w-full sm:w-auto px-4 py-2.5 border border-border text-foreground hover:bg-muted/50 rounded-md text-sm font-medium transition-colors inline-flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                    aria-haspopup="true"
                    aria-expanded={openDropdownId === s.id}
                    id={`config-dropdown-${s.id}`}
                  >
                    <Sliders className="w-4 h-4 text-blue-500" />
                    <span>CONFIGURATIONS</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdownId === s.id ? 'rotate-180' : ''}`} />
                  </button>

                  {openDropdownId === s.id && (
                    <div 
                      className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl z-20 py-1 animate-in fade-in zoom-in-95 duration-100"
                      role="menu"
                      aria-labelledby={`config-dropdown-${s.id}`}
                    >
                      <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">
                        Preset Integrations
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyFthrConfig(s)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted/60 flex items-center justify-between transition-colors group cursor-pointer"
                        role="menuitem"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs">
                            F
                          </div>
                          <div>
                            <div className="font-medium text-foreground group-hover:text-blue-500 transition-colors">
                              FTHR
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              Copy clipping JSON
                            </div>
                          </div>
                        </div>
                        <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </button>
                    </div>
                  )}
                </div>

                <Link
                  to={`/dashboard/support?service_id=${s.id}`}
                  className="w-full sm:w-auto px-4 py-2.5 border border-border text-foreground hover:bg-muted/50 rounded-md text-sm font-medium transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4" />
                  Get Support
                </Link>
                {!s.cancel_at_period_end && s.status !== 'terminated' && (
                  <button
                    onClick={() => setCancellingService(s)}
                    className="w-full sm:w-auto px-4 py-2.5 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-md text-sm font-medium transition-colors cursor-pointer"
                  >
                    Cancel Service
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border p-8 rounded-lg text-center shadow-sm max-w-2xl mx-auto">
          <HardDrive size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Need more space?</h3>
          <p className="text-muted-foreground mb-6">
            Subscribe to our scalable SFTP Storage solution. Connect your favorite clipping software instantly.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 text-left">
            {products.map(p => {
              const hasTrial = (p.trial_days && p.trial_days > 0) || p.price === "0.00" || p.price === 0;
              const trialBadge = p.trial_days && p.trial_days > 0 ? `${p.trial_days}-Day FREE Trial` : '1st Month FREE';
              return (
              <div key={p.id} className="border border-border p-6 rounded-lg relative overflow-hidden">
                {hasTrial ? (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    {trialBadge}
                  </div>
                ) : null}
                <h4 className="font-medium text-lg mb-2">{p.name}</h4>
                <div className="text-2xl font-bold mb-4">
                  €{(parseFloat(p.price) * 1.19).toFixed(2)} <span className="text-sm font-normal text-muted-foreground">/ mo incl. VAT</span>
                </div>
                <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                  <li className="flex gap-2 items-center"><Check size={16} className="text-green-500" /> {p.specs?.storage_gb || 'Scalable'}GB Storage</li>
                  <li className="flex gap-2 items-center"><Check size={16} className="text-green-500" /> Dedicated User</li>
                  <li className="flex gap-2 items-center"><Check size={16} className="text-green-500" /> High Availability</li>
                </ul>
                <button 
                  onClick={() => subscribe(p.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium transition-colors"
                >
                  {hasTrial ? 'Start Free Trial' : 'Subscribe Now'}
                </button>
              </div>
            );})}
            {products.length === 0 && (
              <p className="col-span-2 text-center text-sm text-yellow-500">
                No SFTP products found in the catalog.
              </p>
            )}
          </div>
        </div>
      )}

      <CancelServiceModal
        isOpen={!!cancellingService}
        service={cancellingService}
        onClose={() => setCancellingService(null)}
        onSuccess={() => {
          alert('Cancellation request processed successfully.');
          fetchServices();
        }}
      />

      <SftpFthrConfigModal
        isOpen={fthrModalConfig.isOpen}
        onClose={() => setFthrModalConfig({ isOpen: false, config: null })}
        config={fthrModalConfig.config}
        serviceName={fthrModalConfig.serviceName}
      />
    </div>
  );
}
