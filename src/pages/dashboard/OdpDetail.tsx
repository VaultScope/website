import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import {
  Cloud, Terminal, Network, Cpu, HardDrive,
  ArrowLeft, Copy, Tag, Activity, AlertTriangle
} from 'lucide-react';
import { Button } from '../../components/Shared';

export function OdpDetail() {
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

  const [endpointVisible, setEndpointVisible] = useState(false);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  if (!service) return <div className="p-8 text-center text-red-500">Service not found</div>;

  const odp = {
    id: service.id,
    name: service.hostname || service.name || 'Worker Node',
    type: product?.name || 'Unknown',
    status: service.status,
    location: product?.specs?.location || 'Unknown',
    country: '—',
    endpointDomain: service.hostname || service.ip || 'Pending',
    port: '443',
    ram: product?.specs?.ram || '—',
    cpu: product?.specs?.server_type || '—',
    disk: product?.specs?.disk || '—',
    backupStatus: '—',
    nextBilling: service.next_due ? new Date(service.next_due).toLocaleDateString() : '—',
    tags: ['odp'],
    latency: '—',
  };
  const endpointFull = `${odp.endpointDomain}:${odp.port}`;
  const endpointMasked = `•••.vaultscope.net:•••`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-border">
        <Link to="/dashboard/odp" className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5 mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> ODP
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-medium">{odp.name}</h1>
              <span className="text-xs text-yellow-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" /> Configuring
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="font-mono">{odp.id}</span>
              <span className="flex items-center gap-1"><Cloud className="w-3.5 h-3.5" /> {odp.type}</span>
              <span>{odp.country}</span>
            </div>
            {odp.tags.length > 0 && (
              <div className="flex gap-2 mt-3">
                {odp.tags.map(tag => (
                  <span key={tag} className="text-[10px] uppercase tracking-wider border border-border px-2 py-0.5 flex items-center gap-1 text-muted-foreground">
                    <Tag className="w-2.5 h-2.5" /> {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-8 px-3 text-xs gap-1.5" disabled={odp.status !== 'online'}>
              <Terminal className="w-3.5 h-3.5" /> Console
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
          <span className="text-lg font-light">{odp.latency}</span>
          <span className="text-xs text-yellow-500">Acceptable</span>
        </div>
      </div>

      {/* Endpoint */}
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/40 mb-3 flex items-center gap-2">
          <Network className="w-3.5 h-3.5" /> Endpoint Access
        </h2>
        <div className="border border-border divide-y divide-border">
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Domain & Port</span>
            <span
              className="font-mono text-sm cursor-pointer hover:text-foreground transition-colors flex items-center gap-2"
              onMouseEnter={() => setEndpointVisible(true)}
              onMouseLeave={() => setEndpointVisible(false)}
              onClick={() => navigator.clipboard.writeText(endpointFull)}
              title="Click to copy"
            >
              {endpointVisible ? endpointFull : endpointMasked}
              <Copy className="w-3.5 h-3.5 text-foreground/30" />
            </span>
          </div>
        </div>
      </div>

      {/* Service Information */}
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/40 mb-3 flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5" /> Service Information
        </h2>
        <div className="border border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-border">
            {[
              { label: 'vCores', value: odp.cpu },
              { label: 'RAM', value: odp.ram },
              { label: 'Storage', value: odp.disk },
              { label: 'Backups', value: odp.backupStatus },
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
            <span className="font-mono text-sm">{odp.id}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Next Billing</span>
            <span className="text-sm">{odp.nextBilling}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Location</span>
            <span className="text-sm">{odp.location} — {odp.country}</span>
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
            <p className="text-sm font-medium">Delete Service</p>
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
