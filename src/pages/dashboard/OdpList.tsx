import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowUpRight, Cpu } from 'lucide-react';
import { api } from '../../lib/api';

export function OdpList() {
  const [services, setServices] = useState<any[]>([]);
  const [catalog, setCatalog] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

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
          const prod = catMap[s.product_id];
          return prod && (prod.category === 'odp' || prod.category === 'ocd');
        });
        setServices(filtered);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">
            One-Click Deploy (OCD)
          </h1>
          <p className="text-xs text-[var(--fg-muted)]">
            Containerized self-hosted applications managed by the Pegasus control plane.
          </p>
        </div>
        <Link
          to="/dashboard/new?category=odp"
          className="vs-btn-primary px-4 py-2 text-xs font-medium self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Deploy OCD
        </Link>
      </div>

      {loading ? (
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-12 text-center text-sm text-[var(--fg-muted)] font-mono">
          Loading...
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-12 text-center space-y-3">
          <p className="text-sm text-[var(--fg-muted)]">No OCD instances found.</p>
          <Link
            to="/dashboard/new?category=odp"
            className="vs-btn-secondary px-4 py-2 text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Deploy First Application
          </Link>
        </div>
      ) : (
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] divide-y divide-[var(--line)] overflow-hidden">
          {services.map((odp) => {
            const prod = catalog[odp.product_id] || {};
            const specs = prod.specs || {};
            const isHealthy = odp.status === 'running' || odp.status === 'active';

            return (
              <div
                key={odp.id}
                className="hover:bg-[var(--bg-elevated)] px-5 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <Cpu className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isHealthy ? 'bg-[var(--ok)]' : 'bg-[var(--warn)]'
                        }`}
                      />
                      <span className="text-sm font-medium text-[var(--fg)] font-mono truncate">
                        {odp.hostname || `ocd-${odp.id.slice(0, 8)}`}
                      </span>
                      <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--fg-muted)]">
                        {odp.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--fg-faint)] mt-1">
                      <span className="text-[var(--fg-muted)]">{prod.name || odp.name || 'OCD'}</span>
                      <span>{specs.location || 'EU-Central'}</span>
                      <span className="font-mono">{odp.hostname || odp.ip || 'Pending'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between lg:justify-end gap-4 shrink-0">
                  {odp.next_due && (
                    <span className="text-xs font-mono text-[var(--fg-faint)] hidden sm:inline">
                      Due {new Date(odp.next_due).toLocaleDateString()}
                    </span>
                  )}
                  <Link
                    to={`/dashboard/odp/${odp.id}`}
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
