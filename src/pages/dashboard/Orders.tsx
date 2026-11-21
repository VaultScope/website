import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ClipboardList, Plus } from 'lucide-react';
import { api } from '../../lib/api';
import { getOrderStateDisplay } from '../../lib/orderState';

interface ServiceOrder {
  id: string;
  name?: string;
  hostname?: string;
  status: string;
  order_state?: string;
  order_state_note?: string | null;
  order_state_updated_at?: string | null;
  product_id?: string;
  provider_type?: string;
  ip?: string;
  price?: string;
  created_at?: string;
}

interface CatalogProduct {
  id: string;
  name: string;
  category?: string;
  provider?: string;
}

export function DashboardOrders() {
  const [services, setServices] = useState<ServiceOrder[]>([]);
  const [catalog, setCatalog] = useState<Record<string, CatalogProduct>>({});
  const [filterState, setFilterState] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/storefront/services').catch(() => []),
      api.get('/storefront/catalog').catch(() => []),
    ]).then(([srvData, catData]) => {
      setServices(Array.isArray(srvData) ? srvData : []);
      const map: Record<string, CatalogProduct> = {};
      if (Array.isArray(catData)) {
        for (const p of catData) map[p.id] = p;
      }
      setCatalog(map);
      setLoading(false);
    });
  }, []);

  const filtered = services.filter((s) => {
    if (filterState === 'all') return true;
    return (s.order_state || 'active').toLowerCase() === filterState;
  });

  const resolveManagePath = (service: ServiceOrder, prod?: CatalogProduct) => {
    const cat = String(prod?.category || '').toLowerCase();
    const prov = String(prod?.provider || '').toLowerCase();
    if (
      service.provider_type === 'sftp' ||
      cat === 'storage' ||
      cat === 'sftp' ||
      prov === 'sftpgo'
    ) {
      return '/dashboard/sftp';
    }
    if (
      cat === 'ds' ||
      cat === 'dedicated' ||
      cat === 'dedicated servers' ||
      cat === 'bare-metal' ||
      prov === 'vaultscope_dedicated' ||
      prov === 'reliablesite'
    ) {
      return `/dashboard/ds/${service.id}`;
    }
    if (cat === 'odp' || cat === 'ocd') return `/dashboard/odp/${service.id}`;
    return `/dashboard/vps/${service.id}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">
            Orders &amp; Provisioning Status
          </h1>
          <p className="text-xs text-[var(--fg-muted)]">
            Track every order from payment to delivery. Dedicated servers are provisioned regularly within up to 7 business days after payment succeeds.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            aria-label="Filter by order state"
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="rounded-md bg-[var(--bg-card)] border border-[var(--line)] px-3 py-2 text-xs text-[var(--fg)] focus:outline-none"
          >
            <option value="all">All Order States</option>
            <option value="payment_received">Payment Received</option>
            <option value="provisioning">Provisioning</option>
            <option value="hardware_setup">Hardware Setup</option>
            <option value="active">Active / Ready</option>
            <option value="action_required">Action Required</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Link to="/dashboard/new" className="vs-btn-primary px-4 py-2 text-xs font-medium">
            <Plus className="w-3.5 h-3.5" />
            New Order
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-12 text-center text-sm text-[var(--fg-muted)] font-mono">
          Loading orders...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-12 text-center space-y-3">
          <ClipboardList className="w-6 h-6 mx-auto text-[var(--fg-faint)]" />
          <p className="text-sm text-[var(--fg-muted)]">No orders found matching this filter.</p>
        </div>
      ) : (
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] divide-y divide-[var(--line)] overflow-hidden">
          {filtered.map((order) => {
            const prod = order.product_id ? catalog[order.product_id] : undefined;
            const stateInfo = getOrderStateDisplay(order.order_state);
            const managePath = resolveManagePath(order, prod);

            return (
              <div
                key={order.id}
                className="px-5 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[var(--bg-subtle)] transition-colors"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-sm font-semibold text-[var(--fg)]">
                      {prod?.name || order.name || 'Infrastructure Order'}
                    </span>
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${stateInfo.badgeClass}`}>
                      {stateInfo.label}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--fg-faint)] uppercase">
                      #{order.id.slice(0, 8)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--fg-muted)] font-mono">
                    {order.hostname && <span>Host: {order.hostname}</span>}
                    {order.ip && <span>IP: {order.ip}</span>}
                    {order.created_at && (
                      <span>Ordered: {new Date(order.created_at).toLocaleDateString()}</span>
                    )}
                    {order.price && Number.parseFloat(order.price) > 0 && (
                      <span>€{Number.parseFloat(order.price).toFixed(2)}</span>
                    )}
                  </div>
                  {order.order_state_note && (
                    <p className="text-xs text-[var(--fg-muted)]">
                      {order.order_state_note}
                    </p>
                  )}
                </div>

                <div className="shrink-0">
                  <Link
                    to={managePath}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--bg-subtle)] hover:bg-[var(--accent-subtle)] text-[var(--fg)] transition-colors"
                  >
                    View Details
                    <ArrowUpRight className="w-3.5 h-3.5 text-[var(--accent-bright)]" />
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
