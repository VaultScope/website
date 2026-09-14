import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import {
  Power, Terminal, Network,
  Cpu, HardDrive, ArrowLeft, Tag, Activity, AlertTriangle
} from 'lucide-react';
import { Button } from '../../components/Shared';

export function DsDetail() {
  const { id } = useParams();

  const [service, setService] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get<any>(`/storefront/services/${id}`),
      api.get<any[]>('/storefront/catalog')
    ]).then(([svc, catalog]) => {
      setService(svc);
      setProduct(catalog.find((p: any) => p.id === svc.product_id));
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  const [ipVisible, setIpVisible] = useState<'v4' | 'v6' | null>(null);

  const maskIp = (ip: string, type: 'v4' | 'v6') => {
    if (!ip) return '—';
    if (type === 'v4') {
      const parts = ip.split('.');
      if (parts.length !== 4) return ip;
      return `${parts[0]}.•••.•••.•••`;
    }
    return ip.length > 4 ? ip.substring(0, 4) + ':•••:•••:•••::•••' : ip;
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  if (!service) return <div className="p-8 text-center text-red-500">Service not found</div>;

  const ds = {
    id: service.id,
    providerId: service.provider_resource_id || '—',
    name: service.hostname || service.name || 'Dedicated Server',
    type: product?.name || 'Unknown',
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
    backupStatus: '—',
    nextBilling: service.next_due ? new Date(service.next_due).toLocaleDateString() : '—',
    tags: ['ds'],
    latency: '—',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-border">
        <Link to="/dashboard/ds" className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5 mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Dedicated Servers
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-medium">{ds.name}</h1>
              <span className="text-xs text-green-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Online
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="font-mono">{ds.id}</span>
              <span>{ds.type}</span>
              <span>{ds.country}</span>
            </div>
            {ds.tags.length > 0 && (
              <div className="flex gap-2 mt-3">
                {ds.tags.map(tag => (
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
            <Button variant="outline" className="h-8 px-3 text-xs gap-1.5">
              <Power className="w-3.5 h-3.5" /> Restart
            </Button>
          </div>
        </div>
      </div>

      {/* Latency */}
      <div className="border border-border px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Client latency</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-light">{ds.latency}</span>
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
            <span
              className="font-mono text-sm cursor-pointer hover:text-foreground transition-colors"
              onMouseEnter={() => setIpVisible('v4')}
              onMouseLeave={() => setIpVisible(null)}
              onClick={() => navigator.clipboard.writeText(ds.ipv4)}
              title="Click to copy"
            >
              {ipVisible === 'v4' ? ds.ipv4 : maskIp(ds.ipv4, 'v4')}
            </span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">IPv6</span>
            <span
              className="font-mono text-xs cursor-pointer hover:text-foreground transition-colors"
              onMouseEnter={() => setIpVisible('v6')}
              onMouseLeave={() => setIpVisible(null)}
              onClick={() => navigator.clipboard.writeText(ds.ipv6)}
              title="Click to copy"
            >
              {ipVisible === 'v6' ? ds.ipv6 : maskIp(ds.ipv6, 'v6')}
            </span>
          </div>
        </div>
      </div>

      {/* Hardware */}
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/40 mb-3 flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5" /> Server Hardware
        </h2>
        <div className="border border-border">
          <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y divide-border">
            {[
              { label: 'Cores', value: ds.cpu },
              { label: 'CPU Model', value: ds.cpuModel },
              { label: 'RAM', value: ds.ram },
              { label: 'Disk Array', value: ds.disk },
              { label: 'Network', value: ds.network },
              { label: 'Backup', value: ds.backupStatus },
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
            <span className="font-mono text-sm">{ds.id}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Provider ID</span>
            <span className="font-mono text-sm">{ds.providerId}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Next Billing</span>
            <span className="text-sm">{ds.nextBilling}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Location</span>
            <span className="text-sm">{ds.location} — {ds.country}</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="pt-6 border-t border-border">
        <h2 className="text-xs font-medium uppercase tracking-wider text-red-500/70 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5" /> Danger Zone
        </h2>
        <div className="border border-red-500/20 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Delete Server</p>
            <p className="text-xs text-muted-foreground">This action is permanent and cannot be undone.</p>
          </div>
          <Button variant="outline" className="h-8 px-4 text-xs border-red-500/30 text-red-500 hover:bg-red-500/5">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
