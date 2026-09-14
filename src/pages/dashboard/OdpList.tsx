import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Shared';
import { api } from '../../lib/api';

export function OdpList() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<any[]>('/storefront/services'),
      api.get<any[]>('/storefront/catalog')
    ]).then(([svcs, catalog]) => {
      const odpCatalogIds = new Set(catalog.filter(p => p.category === 'odp').map(p => p.id));
      const odpServices = svcs.filter(s => odpCatalogIds.has(s.product_id));
      setServices(odpServices.map(s => {
        const prod = catalog.find(p => p.id === s.product_id);
        return {
          id: s.id,
          name: s.hostname || s.name || 'ODP Instance',
          type: prod?.name || 'Unknown',
          status: s.status,
          location: prod?.specs?.location || 'Unknown',
          endpoint: s.hostname || s.ip || 'Pending',
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
          <h1 className="text-2xl font-light mb-1">Optimized Deployment Platform</h1>
          <p className="text-sm text-muted-foreground">Manage your containerized ODP services.</p>
        </div>
        <Link to="/dashboard/new">
          <Button className="h-9 px-5 text-sm">Deploy ODP</Button>
        </Link>
      </div>

      <div className="border border-border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border">
            <tr className="text-xs uppercase tracking-wider text-foreground/40">
              <th className="px-5 py-3 font-medium">Name & ID</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Endpoint</th>
              <th className="px-5 py-3 font-medium">Location</th>
              <th className="px-5 py-3 font-medium">Next Billing</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">Loading...</td>
              </tr>
            )}
            {!loading && services.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">No ODP instances found.</td>
              </tr>
            )}
            {!loading && services.map(odp => (
              <tr key={odp.id} className="hover:bg-foreground/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <div className="font-medium mb-0.5">{odp.name}</div>
                  <div className="text-xs font-mono text-muted-foreground">{odp.id}</div>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs flex items-center gap-1.5 ${odp.status === 'running' ? 'text-green-500' : odp.status === 'pending' ? 'text-yellow-500 animate-pulse' : 'text-red-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${odp.status === 'running' ? 'bg-green-500' : odp.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    {odp.status.charAt(0).toUpperCase() + odp.status.slice(1)}
                  </span>
                </td>
                <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{odp.endpoint}</td>
                <td className="px-5 py-4 text-muted-foreground">{odp.location}</td>
                <td className="px-5 py-4 text-muted-foreground">{odp.nextBilling}</td>
                <td className="px-5 py-4 text-right">
                  <Link to={`/dashboard/odp/${odp.id}`}>
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
