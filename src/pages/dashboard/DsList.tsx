import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Shared';
import { api } from '../../lib/api';

export function DsList() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<any[]>('/storefront/services'),
      api.get<any[]>('/storefront/catalog')
    ]).then(([svcs, catalog]) => {
      const dsCatalogIds = new Set(catalog.filter(p => p.category === 'ds').map(p => p.id));
      const dsServices = svcs.filter(s => dsCatalogIds.has(s.product_id));
      setServices(dsServices.map(s => {
        const prod = catalog.find(p => p.id === s.product_id);
        return {
          id: s.id,
          name: s.hostname || s.name || 'Dedicated Server',
          type: prod?.name || 'Unknown',
          status: s.status,
          location: prod?.specs?.location || 'Unknown',
          ram: prod?.specs?.ram || '-',
          cpu: prod?.specs?.server_type || '-',
          disk: prod?.specs?.disk || '-',
          nextBilling: s.next_due ? new Date(s.next_due).toLocaleDateString() : '-',
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
          <h1 className="text-2xl font-light mb-1">Dedicated Servers</h1>
          <p className="text-sm text-muted-foreground">Manage your bare-metal infrastructure.</p>
        </div>
        <Link to="/dashboard/new">
          <Button className="h-9 px-5 text-sm">Order Dedicated</Button>
        </Link>
      </div>

      <div className="border border-border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border">
            <tr className="text-xs uppercase tracking-wider text-foreground/40">
              <th className="px-5 py-3 font-medium">Name & ID</th>
              <th className="px-5 py-3 font-medium">Type</th>
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
                <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">No Dedicated Servers found.</td>
              </tr>
            )}
            {!loading && services.map(ds => (
              <tr key={ds.id} className="hover:bg-foreground/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <div className="font-medium mb-0.5">{ds.name}</div>
                  <div className="text-xs font-mono text-muted-foreground">{ds.id}</div>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{ds.type}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs flex items-center gap-1.5 ${ds.status === 'running' ? 'text-green-500' : ds.status === 'pending' ? 'text-yellow-500 animate-pulse' : 'text-red-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${ds.status === 'running' ? 'bg-green-500' : ds.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    {ds.status.charAt(0).toUpperCase() + ds.status.slice(1)}
                  </span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{ds.location}</td>
                <td className="px-5 py-4 text-muted-foreground text-xs space-y-0.5">
                  <div>{ds.cpu}</div>
                  <div>{ds.ram}</div>
                  <div>{ds.disk}</div>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{ds.nextBilling}</td>
                <td className="px-5 py-4 text-right">
                  <Link to={`/dashboard/ds/${ds.id}`}>
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
