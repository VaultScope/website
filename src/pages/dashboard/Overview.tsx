import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowUpRight, Server, HardDrive, Cpu, FolderLock, SlidersHorizontal } from 'lucide-react';
import { api } from '../../lib/api';
import { getQuickNavItems, type QuickNavItem } from '../../lib/quickNav';

const VAT_RATE = 0.19;

interface ServiceItem {
  id: string;
  name?: string;
  hostname?: string;
  status: string;
  product_id?: string;
  provider_type?: string;
  ip?: string;
  price?: string;
  billing_cycle?: string;
  next_due?: string | null;
}

interface CatalogProduct {
  id: string;
  name: string;
  category?: string;
  specs?: Record<string, unknown>;
}

export function DashboardOverview() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [catalog, setCatalog] = useState<Record<string, CatalogProduct>>({});
  const [loading, setLoading] = useState(true);
  const [quickNavItems, setQuickNavItems] = useState<QuickNavItem[]>(() => getQuickNavItems());

  useEffect(() => {
    Promise.all([
      api.get('/storefront/services').catch(() => []),
      api.get('/storefront/catalog').catch(() => []),
    ]).then(([srvData, catData]) => {
      setServices(Array.isArray(srvData) ? srvData : []);
      const map: Record<string, CatalogProduct> = {};
      if (Array.isArray(catData)) {
        for (const p of catData) {
          map[p.id] = p;
        }
      }
      setCatalog(map);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const syncQuickNav = () => setQuickNavItems(getQuickNavItems());
    window.addEventListener('vs-quick-nav-updated', syncQuickNav);
    window.addEventListener('storage', syncQuickNav);
    return () => {
      window.removeEventListener('vs-quick-nav-updated', syncQuickNav);
      window.removeEventListener('storage', syncQuickNav);
    };
  }, []);

  const activeServices = services.filter((s) => s.status !== 'terminated');

  const allOperational =
    activeServices.length === 0 ||
    activeServices.every((s) => s.status === 'running' || s.status === 'active');

  const monthlyNet = activeServices.reduce((sum, s) => {
    const p = parseFloat(s.price || '0');
    if (isNaN(p) || p <= 0) return sum;
    if (s.billing_cycle === 'yearly' || s.billing_cycle === 'annual') return sum + p / 12;
    return sum + p;
  }, 0);

  const monthlyGross = monthlyNet * (1 + VAT_RATE);

  const isSftpService = (service: ServiceItem, cat: string) =>
    service.provider_type === 'sftp' ||
    cat === 'storage' ||
    cat === 'sftp' ||
    (service.name || '').toLowerCase().includes('sftp') ||
    (service.hostname || '').toLowerCase().includes('sftp');

  const getCategoryIcon = (service: ServiceItem, cat: string) => {
    if (isSftpService(service, cat)) return FolderLock;
    if (cat === 'ds' || cat === 'dedicated') return HardDrive;
    if (cat === 'odp' || cat === 'ocd') return Cpu;
    return Server;
  };

  return (
    <div className="space-y-12">
      {/* Minimal Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          {!loading && !allOperational && (
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--warn)]">
              <span className="w-2 h-2 rounded-full bg-[var(--warn)]" />
              <span>Some services need attention</span>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--fg)]">
            Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/support"
            className="vs-btn-secondary px-4 py-2 text-xs font-medium"
          >
            View tickets
          </Link>
          <Link
            to="/dashboard/new"
            className="vs-btn-primary px-4 py-2 text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Order New
          </Link>
        </div>
      </div>

      {/* Whisper-quiet Metric & Quick Nav Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-6 space-y-1.5">
          <div className="text-xs text-[var(--fg-faint)] font-mono uppercase tracking-[0.06em]">Instances</div>
          <div className="text-xl font-semibold text-[var(--fg)] font-mono tabular-nums">
            {loading
              ? '—'
              : `${activeServices.length} ${activeServices.length === 1 ? 'Service' : 'Services'}`}
          </div>
        </div>

        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-6 space-y-1.5">
          <div className="text-xs text-[var(--fg-faint)] font-mono uppercase tracking-[0.06em]">Run Rate</div>
          <div className="text-xl font-semibold text-[var(--fg)] font-mono tabular-nums">
            {loading
              ? '—'
              : monthlyGross > 0
                ? `€${monthlyGross.toFixed(2)} / month incl. VAT`
                : 'No active spend'}
          </div>
          <div className="text-xs text-[var(--fg-muted)]">
            {monthlyNet > 0 ? `€${monthlyNet.toFixed(2)} net + 19% VAT` : 'Predictable monthly billing'}
          </div>
        </div>

        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-6 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-[var(--fg-faint)] font-mono uppercase tracking-[0.06em]">Quick Navigation</span>
            <Link
              to="/dashboard/profile"
              className="inline-flex items-center gap-1 text-[11px] text-[var(--fg-muted)] hover:text-[var(--accent-bright)] transition-colors"
              title="Customize shortcuts in Profile Settings"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Customize</span>
            </Link>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {quickNavItems.length > 0 ? (
              quickNavItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className="px-2.5 py-1 rounded-md text-xs bg-[var(--bg-subtle)] hover:bg-[var(--accent-subtle)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                >
                  {item.label}
                </Link>
              ))
            ) : (
              <Link
                to="/dashboard/profile"
                className="text-xs text-[var(--fg-faint)] hover:text-[var(--fg)] transition-colors"
              >
                Add shortcuts in Profile Settings →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Active Services Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-[var(--fg-muted)]">Deployed Infrastructure</h2>
          <span className="text-xs font-mono text-[var(--fg-faint)]">
            {activeServices.length} total
          </span>
        </div>

        {loading ? (
          <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-12 text-center text-sm text-[var(--fg-muted)] font-mono">
            Loading services...
          </div>
        ) : activeServices.length === 0 ? (
          <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-12 text-center space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-medium text-[var(--fg)]">No services yet</h3>
              <p className="text-xs text-[var(--fg-muted)] max-w-md mx-auto">
                Deploy a Cloud VPS, Dedicated Server, One-Click application, or SFTP storage vault in seconds.
              </p>
            </div>
            <div>
              <Link
                to="/dashboard/new"
                className="vs-btn-primary px-4 py-2 text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Deploy First Service
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] divide-y divide-[var(--line)] overflow-hidden">
            {activeServices.map((service) => {
              const prod = service.product_id ? catalog[service.product_id] : undefined;
              const cat = prod?.category || 'vps';
              const isSftp = isSftpService(service, cat);
              const managePath = isSftp
                ? '/dashboard/sftp'
                : `/dashboard/${cat === 'dedicated' ? 'ds' : cat}/${service.id}`;
              const Icon = getCategoryIcon(service, cat);
              const isHealthy = service.status === 'running' || service.status === 'active';
              const isPending = service.status === 'provisioning' || service.status === 'pending';

              return (
                <div
                  key={service.id}
                  className="group hover:bg-[var(--bg-subtle)] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Icon className="w-4 h-4 text-[var(--fg-muted)] group-hover:text-[var(--accent-bright)] transition-colors shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isHealthy
                              ? 'bg-[var(--ok)]'
                              : isPending
                                ? 'bg-[var(--warn)] animate-pulse'
                                : 'bg-[var(--err)]'
                          }`}
                        />
                        <span className="text-sm font-medium text-[var(--fg)] font-mono truncate">
                          {service.hostname || service.name || `srv-${service.id.slice(0, 8)}`}
                        </span>
                        <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--fg-muted)]">
                          {service.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--fg-faint)] mt-1">
                        <span>{prod?.name || service.name || 'Infrastructure Node'}</span>
                        {service.ip && (
                          <span className="font-mono text-[var(--fg-muted)]">{service.ip}</span>
                        )}
                        {service.next_due && (
                          <span className="font-mono">
                            Due {new Date(service.next_due).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 shrink-0">
                    {service.price && parseFloat(service.price) > 0 && (
                      <span className="text-xs font-mono text-[var(--fg-muted)] hidden md:inline">
                        €{(parseFloat(service.price) * (1 + VAT_RATE)).toFixed(2)}/mo
                      </span>
                    )}
                    <Link
                      to={managePath}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-elevated)] transition-colors"
                    >
                      Manage
                      <ArrowUpRight className="w-3.5 h-3.5 text-[var(--accent-bright)]" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
