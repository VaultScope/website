import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useToast } from '../../components/Toast';
import {
  Power, Terminal, Network, Square,
  Cpu, HardDrive, AlertTriangle, ArrowLeft, Tag, Activity, X
} from 'lucide-react';
import { Button } from '../../components/Shared';

export function VpsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [service, setService] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [osImages, setOsImages] = useState<any[]>([]);
  const [sshKeys, setSshKeys] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get<any>(`/storefront/services/${id}`),
      api.get<any[]>('/storefront/catalog'),
      api.get<any>('/storefront/options').catch(() => ({ osImages: [], sshKeys: [] }))
    ]).then(([svc, catalog, options]) => {
      setService(svc);
      setProduct(catalog.find((p: any) => p.id === svc.product_id));
      setOsImages(options.osImages || []);
      setSshKeys(options.sshKeys || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      error('Failed to load service details');
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [ipVisible, setIpVisible] = useState<'v4' | 'v6' | null>(null);
  const [showReinstall, setShowReinstall] = useState(false);
  const [selectedOs, setSelectedOs] = useState('');
  const [authMethod, setAuthMethod] = useState<'password' | 'ssh'>('password');
  const [ptrEditing, setPtrEditing] = useState(false);
  const [ptrValue, setPtrValue] = useState('mail.vaultscope.de');

  const maskIp = (ip: string, type: 'v4' | 'v6') => {
    if (!ip) return '—';
    if (type === 'v4') {
      const parts = ip.split('.');
      if (parts.length !== 4) return ip;
      return `${parts[0]}.•••.•••.•••`;
    }
    return ip.length > 4 ? ip.substring(0, 4) + ':•••:•••:•••::•••' : ip;
  };

  const handleAction = async (action: string) => {
    try {
      await api.post(`/storefront/services/${id}/${action}`);
      success(`Successfully executed ${action}`);
    } catch (err) {
      console.error(err);
      error(`Failed to ${action} service`);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/storefront/services/${id}`);
      success('Service deleted successfully');
      navigate('/dashboard/vps');
    } catch (err) {
      console.error(err);
      error('Failed to delete service');
    }
  };

  const handleReinstall = async () => {
    if (!selectedOs) {
      error('Please select an OS image');
      return;
    }
    try {
      await api.post(`/storefront/services/${id}/reinstall`, { os: selectedOs, auth: authMethod });
      success('Reinstallation started');
      setShowReinstall(false);
    } catch (err) {
      console.error(err);
      error('Failed to reinstall OS');
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  if (!service) return <div className="p-8 text-center text-red-500">Service not found</div>;

  const vps = {
    id: service.id,
    providerId: service.provider_resource_id || '—',
    name: service.hostname || service.name || 'VPS Instance',
    plan: product?.name || 'Unknown',
    status: service.status,
    location: product?.specs?.location || 'Unknown',
    country: '—',
    ram: product?.specs?.ram || '—',
    cpu: product?.specs?.server_type || '—',
    cpuModel: '—',
    disk: product?.specs?.disk || '—',
    network: '—',
    ipv4: service.ip || '—',
    ipv6: '—',
    backupStatus: 'Active',
    nextBilling: service.next_due ? new Date(service.next_due).toLocaleDateString() : '—',
    tags: ['vps'],
    latency: '—',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-border">
        <Link to="/dashboard/vps" className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5 mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> VPS
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-medium">{vps.name}</h1>
              <span className="text-xs text-green-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Online
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="font-mono">{vps.id}</span>
              <span>{vps.plan}</span>
              <span>{vps.country}</span>
            </div>
            {vps.tags.length > 0 && (
              <div className="flex gap-2 mt-3">
                {vps.tags.map(tag => (
                  <span key={tag} className="text-[10px] uppercase tracking-wider border border-border px-2 py-0.5 flex items-center gap-1 text-muted-foreground">
                    <Tag className="w-2.5 h-2.5" /> {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-8 px-3 text-xs gap-1.5">
              <Terminal className="w-3.5 h-3.5" /> Console
            </Button>
            <Button onClick={() => handleAction('restart')} variant="outline" className="h-8 px-3 text-xs gap-1.5">
              <Power className="w-3.5 h-3.5" /> Restart
            </Button>
            <Button onClick={() => handleAction('stop')} variant="outline" className="h-8 px-3 text-xs gap-1.5 border-red-500/20 text-red-500 hover:bg-red-500/5">
              <Square className="w-3.5 h-3.5" /> Stop
            </Button>
          </div>
        </div>
      </div>

      {/* Latency */}
      <div className="border border-border px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <div>
            <span className="text-sm text-muted-foreground">Client latency</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-light">{vps.latency}</span>
          <span className="text-xs text-green-500">Good</span>
        </div>
      </div>

      {/* Network */}
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/40 mb-3 flex items-center gap-2">
          <Network className="w-3.5 h-3.5" /> Network Interfaces
        </h2>
        <div className="border border-border divide-y divide-border">
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">IPv4</span>
            <div className="flex items-center gap-4">
              <span
                className="font-mono text-sm cursor-pointer hover:text-foreground transition-colors"
                onMouseEnter={() => setIpVisible('v4')}
                onMouseLeave={() => setIpVisible(null)}
                onClick={() => navigator.clipboard.writeText(vps.ipv4)}
                title="Click to copy"
              >
                {ipVisible === 'v4' ? vps.ipv4 : maskIp(vps.ipv4, 'v4')}
              </span>
              {ptrEditing ? (
                <div className="flex gap-2">
                  <input type="text" value={ptrValue} onChange={e => setPtrValue(e.target.value)} className="bg-transparent border border-border px-1 py-0.5 text-xs focus:outline-none" />
                  <button onClick={() => setPtrEditing(false)} className="text-xs text-green-500 hover:underline">Save</button>
                </div>
              ) : (
                <button onClick={() => setPtrEditing(true)} className="text-xs text-muted-foreground underline hover:text-foreground">{ptrValue}</button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">IPv6</span>
            <span
              className="font-mono text-xs cursor-pointer hover:text-foreground transition-colors"
              onMouseEnter={() => setIpVisible('v6')}
              onMouseLeave={() => setIpVisible(null)}
              onClick={() => navigator.clipboard.writeText(vps.ipv6)}
              title="Click to copy"
            >
              {ipVisible === 'v6' ? vps.ipv6 : maskIp(vps.ipv6, 'v6')}
            </span>
          </div>
        </div>
      </div>

      {/* Server Information */}
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/40 mb-3 flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5" /> Server Information
        </h2>
        <div className="border border-border">
          <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y divide-border">
            {[
              { label: 'vCPU', value: vps.cpu },
              { label: 'CPU Model', value: vps.cpuModel },
              { label: 'RAM', value: vps.ram },
              { label: 'Disk', value: vps.disk },
              { label: 'Network', value: vps.network },
              { label: 'Backup', value: vps.backupStatus },
            ].map((item, i) => (
              <div key={i} className="px-5 py-4">
                <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                <p className="text-sm font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Identifiers */}
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/40 mb-3 flex items-center gap-2">
          <HardDrive className="w-3.5 h-3.5" /> Identifiers & Metadata
        </h2>
        <div className="border border-border divide-y divide-border">
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">VaultScope ID</span>
            <span className="font-mono text-sm">{vps.id}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Provider ID</span>
            <span className="font-mono text-sm">{vps.providerId}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Next Billing</span>
            <span className="text-sm">{vps.nextBilling}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Location</span>
            <span className="text-sm">{vps.location} — {vps.country}</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="pt-6 border-t border-border">
        <h2 className="text-xs font-medium uppercase tracking-wider text-red-500/70 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5" /> Danger Zone
        </h2>
        <div className="border border-red-500/20 divide-y divide-red-500/10">
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Reinstall OS</p>
              <p className="text-xs text-muted-foreground">Wipes all data and installs a clean operating system.</p>
            </div>
            <Button onClick={() => setShowReinstall(true)} variant="outline" className="h-8 px-4 text-xs border-red-500/30 text-red-500 hover:bg-red-500/5">
              Reinstall
            </Button>
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Delete Server</p>
              <p className="text-xs text-muted-foreground">This action is permanent and cannot be undone.</p>
            </div>
            <Button onClick={handleDelete} variant="outline" className="h-8 px-4 text-xs border-red-500/30 text-red-500 hover:bg-red-500/5">
              Delete
            </Button>
          </div>
        </div>
      </div>

      {showReinstall && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-background border border-border p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-light text-red-500 flex items-center gap-2"><HardDrive className="w-5 h-5" /> OS Reinstallation</h2>
              <button onClick={() => setShowReinstall(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">Select a clean image to deploy. All existing data on the disk will be permanently erased. This action cannot be undone.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {osImages.length > 0 ? osImages.map((os: any) => (
                <button
                  key={os.id || os}
                  onClick={() => setSelectedOs(os.id || os)}
                  className={`border p-4 flex flex-col items-center gap-3 transition-colors cursor-pointer ${(selectedOs === (os.id || os)) ? 'border-foreground bg-foreground/5' : 'border-border hover:border-muted-foreground'}`}
                >
                  <HardDrive className="w-8 h-8 text-muted-foreground" />
                  <span className="text-xs font-medium text-center">{os.name || os}</span>
                </button>
              )) : (
                <div className="col-span-4 text-sm text-muted-foreground text-center">No OS images available</div>
              )}
            </div>

            <div className="mb-6 space-y-4 border border-border p-4">
              <h3 className="text-sm font-medium">Authentication Method</h3>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" checked={authMethod === 'password'} onChange={() => setAuthMethod('password')} className="accent-foreground" />
                  Generate Password
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" checked={authMethod === 'ssh'} onChange={() => setAuthMethod('ssh')} className="accent-foreground" />
                  Inject SSH Key
                </label>
              </div>
              {authMethod === 'ssh' && (
                <select className="w-full bg-transparent border border-border p-2 text-sm outline-none">
                  <option value="">Select an SSH Key...</option>
                  {sshKeys.map(key => (
                    <option key={key.id} value={key.id}>{key.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button onClick={() => setShowReinstall(false)} variant="outline" className="px-4 py-2">Cancel</Button>
              <button onClick={handleReinstall} className="px-4 py-2 text-sm bg-red-500 text-white font-medium hover:bg-red-600 transition-colors">Confirm Reinstall</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
