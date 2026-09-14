import { Link } from 'react-router-dom';
import { PlusCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/Shared';
import { useApi } from '../../lib/hooks';

interface Service {
  id: string;
  name: string;
  status: 'running' | 'suspended' | 'pending' | 'terminated';
  hostname: string;
  ip: string;
  price: string;
  next_due: string | null;
  config: Record<string, unknown>;
}

const STATUS_DISPLAY: Record<string, { label: string; color: string }> = {
  running: { label: 'Online', color: 'green' },
  pending: { label: 'Configuring', color: 'yellow' },
  suspended: { label: 'Suspended', color: 'red' },
  terminated: { label: 'Terminated', color: 'neutral' },
};

export function DashboardOverview() {
  const { data: services, loading } = useApi<Service[]>('/storefront/services');

  const activeServices = services?.filter(s => s.status !== 'terminated') || [];
  const allOperational = activeServices.every(s => s.status === 'running');
  const totalMonthly = activeServices.reduce((sum, s) => sum + parseFloat(s.price || '0'), 0);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-2xl font-light mb-4">Welcome back.</h1>
          <div className="space-y-1">
            <div className="font-medium">{loading ? '...' : `${activeServices.length} Service${activeServices.length !== 1 ? 's' : ''}`}</div>
            {!loading && activeServices.length > 0 && (
              <div className={`text-sm flex items-center gap-1.5 ${allOperational ? 'text-green-500' : 'text-yellow-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${allOperational ? 'bg-green-500' : 'bg-yellow-500'}`} />
                {allOperational ? 'All operational' : 'Some services need attention'}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-10 text-sm">
          <div>
            <div className="text-muted-foreground mb-1">Current billing</div>
            <div className="font-medium text-lg">{loading ? '...' : `€${totalMonthly.toFixed(2)} / month`}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Support</div>
            <Link to="/dashboard/support" className="text-xs text-foreground/50 hover:text-foreground transition-colors">
              View tickets
            </Link>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-3">
          <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/50">Your Services</h2>
          <Link to="/dashboard/new">
            <Button variant="outline" className="h-8 px-4 text-xs gap-2">
              <PlusCircle className="w-3.5 h-3.5" /> Order New
            </Button>
          </Link>
        </div>

        <div className="border border-border overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border">
              <tr className="text-xs uppercase tracking-wider text-foreground/40">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">IP</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">Loading services...</td></tr>
              ) : activeServices.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                  No services yet. <Link to="/dashboard/new" className="text-foreground hover:underline">Order your first service</Link>
                </td></tr>
              ) : activeServices.map(svc => {
                const st = STATUS_DISPLAY[svc.status] || STATUS_DISPLAY.running;
                return (
                  <tr key={svc.id} className="hover:bg-foreground/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium">{svc.name}</div>
                      <div className="text-xs text-muted-foreground">{svc.hostname}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs text-${st.color}-500 flex items-center gap-1.5`}>
                        <span className={`w-1.5 h-1.5 bg-${st.color}-500 rounded-full ${svc.status === 'pending' ? 'animate-pulse' : ''}`} />
                        {st.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground font-mono text-xs">{svc.ip || '—'}</td>
                    <td className="px-5 py-4 text-muted-foreground">€{parseFloat(svc.price).toFixed(2)}/mo</td>
                    <td className="px-5 py-4 text-right">
                      <Link to={`/dashboard/vps/${svc.id}`} className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                        Manage
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-3">
          <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/50">Recent Activity</h2>
          <Link to="/dashboard/profile/logs" className="text-xs text-foreground/40 hover:text-foreground transition-colors flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="border border-border divide-y divide-border text-sm text-muted-foreground px-5 py-4">
          Activity log will appear here once connected.
        </div>
      </div>
    </div>
  );
}
