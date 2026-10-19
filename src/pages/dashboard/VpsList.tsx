import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowUpRight, Eye, EyeOff, Server } from 'lucide-react';
import { api } from '../../lib/api';

function maskIp(ip?: string) {
  if (!ip || ip === 'Pending' || ip === 'Unassigned') return ip || 'Pending';
  const parts = ip.split('.');
  if (parts.length === 4) return `${parts[0]}.•••.•••.•••`;
  return ip.slice(0, 4) + '••••';
}

export function VpsList() {
  const [services, setServices] = useState<any[]>([]);
  const [catalog, setCatalog] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [revealedIps, setRevealedIps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    Promise.all([
      api.get('/storefront/services').catch(() => []),
      api.get('/storefront/catalog').catch(() => []),
    ]).then(([srvData, catData]) => {
      const catMap: Record<string, any> = {};
      if (Array.isArray(catData)) {
        for (const p of catData) catMap[p.id] = p;
      }
      setCatalog(catMap);

      if (Array.isArray(srvData)) {
        const filtered = srvData.filter((s: any) => {
          if (s.provider_type === 'sftp') return false;
          const prod = catMap[s.product_id];
          return !prod || prod.category === 'vps';
        });
        setServices(filtered);
      }
      setLoading(false);
    });
  }, []);

  const toggleIp = (id: string) =>
    setRevealedIps((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">
            Virtual Private Servers
          </h1>
          <p className="text-xs text-[var(--fg-muted)]">
            KVM compute instances backed by AMD EPYC™ processors and Gen4 NVMe storage.
          </p>
        </div>
        <Link
          to="/dashboard/new?category=vps"
          className="vs-btn-primary px-4 py-2 text-xs font-medium self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Deploy VPS
        </Link>
      </div>

      {loading ? (
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-12 text-center text-sm text-[var(--fg-muted)] font-mono">
          Loading...
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-12 text-center space-y-3">
          <p className="text-sm text-[var(--fg-muted)]">No VPS instances found.</p>
          <Link
            to="/dashboard/new?category=vps"
            className="vs-btn-secondary px-4 py-2 text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Deploy your first VPS
          </Link>
        </div>
      ) : (
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] divide-y divide-[var(--line)] overflow-hidden">
          {services.map((vps) => {
            const prod = catalog[vps.product_id] || {};
            const specs = prod.specs || {};
            const isHealthy = vps.status === 'running' || vps.status === 'active';

            return (
              <div
                key={vps.id}
                className="hover:bg-[var(--bg-elevated)] px-5 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <Server className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isHealthy ? 'bg-[var(--ok)]' : 'bg-[var(--warn)]'
                        }`}
                      />
                      <span className="text-sm font-medium text-[var(--fg)] font-mono truncate">
                        {vps.hostname || `srv-${vps.id.slice(0, 8)}`}
                      </span>
                      <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--fg-muted)]">
                        {vps.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--fg-faint)] mt-1">
                      <span className="text-[var(--fg-muted)]">{prod.name || vps.name || 'VPS'}</span>
                      {specs.location && <span>{specs.location}</span>}
                      {(specs.cpu || specs.server_type) && (
                        <span className="font-mono">{specs.cpu || specs.server_type}</span>
                      )}
                      {specs.ram && <span className="font-mono">{specs.ram}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between lg:justify-end gap-4 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--fg-muted)] bg-[var(--bg-subtle)] px-2.5 py-1 rounded">
                    <span>
                      {revealedIps[vps.id] ? vps.ip || 'Pending' : maskIp(vps.ip || 'Pending')}
                    </span>
                    {vps.ip && vps.ip !== 'Pending' && (
                      <button
                        type="button"
                        onClick={() => toggleIp(vps.id)}
                        aria-label={revealedIps[vps.id] ? 'Hide IP address' : 'Reveal IP address'}
                        className="p-0.5 text-[var(--fg-faint)] hover:text-[var(--fg)] transition-colors ml-0.5 cursor-pointer"
                        title={revealedIps[vps.id] ? 'Hide IP' : 'Reveal IP'}
                      >
                        {revealedIps[vps.id] ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  {vps.next_due && (
                    <span className="text-xs font-mono text-[var(--fg-faint)] hidden sm:inline">
                      Due {new Date(vps.next_due).toLocaleDateString()}
                    </span>
                  )}

                  <Link
                    to={`/dashboard/vps/${vps.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
                  >
                    Manage
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
