import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Shared';
import { api } from '../../lib/api';

export function VpsList() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<any[]>('/storefront/services'),
      api.get<any[]>('/storefront/catalog')
    ]).then(([svcs, catalog]) => {
      const vpsCatalogIds = new Set(catalog.filter(p => p.category === 'vps').map(p => p.id));
      const vpsServices = svcs.filter(s => vpsCatalogIds.has(s.product_id));
      setServices(vpsServices.map(s => {
        const prod = catalog.find(p => p.id === s.product_id);
        return {
          id: s.id,
          name: s.hostname || s.name || 'VPS Instance',
          plan: prod?.name || 'Unknown',
          status: s.status,
          location: prod?.specs?.location || 'Unknown',
          ram: prod?.specs?.ram || '-',
          cpu: prod?.specs?.server_type || '-',
          disk: prod?.specs?.disk || '-',
          nextBilling: s.next_due ? new Date(s.next_due).toLocaleDateString() : '-',
          tags: ['vps']
        };
      }));
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-light mb-1">Virtual Private Servers</h1>
          <p className="text-sm text-muted-foreground">Manage your flexible compute instances.</p>
        </div>
        <Link to="/dashboard/new">
          <Button className="h-9 px-5 text-sm">Deploy VPS</Button>
        </Link>
      </div>

      <div className="border border-border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border">
            <tr className="text-xs uppercase tracking-wider text-foreground/40">
              <th className="px-5 py-3 font-medium">Name & ID</th>
              <th className="px-5 py-3 font-medium">Plan</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Location</th>
              <th className="px-5 py-3 font-medium">Specs</th>
              <th className="px-5 py-3 font-medium">Next Billing</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">Loading...</td>
              </tr>
            )}
            {!loading && services.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">No VPS instances found.</td>
              </tr>
            )}
            {!loading && services.map(vps => (
              <tr key={vps.id} className="hover:bg-foreground/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <div className="font-medium mb-0.5">{vps.name}</div>
                  <div className="text-xs font-mono text-muted-foreground mb-1.5">{vps.id}</div>
                  <div className="flex gap-1">
                    {vps.tags.map((tag: string) => (
                      <span key={tag} className="text-[10px] uppercase tracking-wider bg-foreground/5 border border-border px-1.5 py-0.5 text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{vps.plan}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs flex items-center gap-1.5 ${vps.status === 'running' ? 'text-green-500' : vps.status === 'pending' ? 'text-yellow-500 animate-pulse' : 'text-red-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${vps.status === 'running' ? 'bg-green-500' : vps.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    {vps.status.charAt(0).toUpperCase() + vps.status.slice(1)}
                  </span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{vps.location}</td>
                <td className="px-5 py-4 text-muted-foreground text-xs space-y-0.5">
                  <div>{vps.cpu}</div>
                  <div>{vps.ram}</div>
                  <div>{vps.disk}</div>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{vps.nextBilling}</td>
                <td className="px-5 py-4 text-right">
                  <Link to={`/dashboard/vps/${vps.id}`}>
                    <Button variant="outline" className="h-7 px-3 text-xs">Manage</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
