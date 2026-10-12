import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { HardDrive, Check, Copy, AlertCircle, RotateCcw, HelpCircle } from 'lucide-react';
import { CancelServiceModal } from '../../components/CancelServiceModal';

export default function SftpStorage() {
  const [services, setServices] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [cancellingService, setCancellingService] = useState<any | null>(null);

  const fetchServices = () => {
    api.get<any[]>('/storefront/services').then(data => {
      setServices(data.filter(s => s.name.toLowerCase().includes('sftp')));
    });
  };

  useEffect(() => {
    fetchServices();

    // Fetch products to find the SFTP offering
    api.get<any[]>('/storefront/catalog').then(data => {
      setProducts(data.filter(p => p.name.toLowerCase().includes('sftp')));
    });
  }, []);

  const handleUncancel = async (serviceId: string) => {
    try {
      await api.post(`/storefront/services/${serviceId}/uncancel`);
      alert('Cancellation revoked! Your service will continue renewing normally.');
      fetchServices();
    } catch (err: any) {
      alert(err?.message || 'Failed to revoke cancellation');
    }
  };

  const subscribe = async (productId: string) => {
    try {
      await api.post('/storefront/orders', { product_id: productId });
      alert('Subscription created! Your SFTP server is being provisioned.');
      window.location.reload();
    } catch (err) {
      alert('Failed to subscribe.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">SFTP Storage</h2>

      {services.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Active Storage</h3>
          {services.map(s => (
            <div key={s.id} className="bg-card border border-border p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <HardDrive className="text-blue-500" />
                  <h4 className="text-lg font-medium">{s.name}</h4>
                  <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full uppercase">
                    {s.status}
                  </span>
                </div>
                {s.cancel_at_period_end && (
                  <span className="px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs rounded-full font-medium">
                    Cancelling at period end
                  </span>
                )}
              </div>

              {s.cancel_at_period_end && (
                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-between text-xs text-amber-600 dark:text-amber-400">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Scheduled to terminate on {s.next_due ? new Date(s.next_due).toLocaleDateString() : 'end of cycle'}. No renewal charges.</span>
                  </div>
                  <button
                    onClick={() => handleUncancel(s.id)}
                    className="inline-flex items-center gap-1 font-medium hover:underline text-amber-600 dark:text-amber-300 ml-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Undo
                  </button>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground block text-xs">Hostname</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{s.hostname || 'node1.vaultscope.de'}</span>
                    <button onClick={() => copyToClipboard(s.hostname || 'node1.vaultscope.de')}><Copy size={14} /></button>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Port</span>
                  <span className="font-mono">2022</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Username</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{s.provider_resource_id}</span>
                    <button onClick={() => copyToClipboard(s.provider_resource_id)}><Copy size={14} /></button>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Password</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{s.config?.raw_response?.password || '********'}</span>
                    <button onClick={() => copyToClipboard(s.config?.raw_response?.password || '')}><Copy size={14} /></button>
                  </div>
                  <span className="text-xs text-muted-foreground block mt-1">
                    {s.config?.raw_response?.password ? 'Save this password securely. It will be hidden later.' : 'Check your email or provisioning logs for the initial password.'}
                  </span>
                </div>
                </div>
              <div className="mt-6 border-t border-border pt-6 flex flex-col sm:flex-row items-center gap-3">
                <a 
                  href="https://sftp.vaultscope.de/web/client" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-foreground text-background hover:bg-foreground/90 flex-1 w-full flex justify-center items-center gap-2 py-2.5 rounded-md font-medium text-sm transition-colors"
                >
                  <HardDrive className="w-4 h-4" />
                  Open Web File Manager
                </a>
                <Link
                  to={`/dashboard/support?service_id=${s.id}`}
                  className="w-full sm:w-auto px-4 py-2.5 border border-border text-foreground hover:bg-muted/50 rounded-md text-sm font-medium transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4" />
                  Get Support
                </Link>
                {!s.cancel_at_period_end && s.status !== 'terminated' && (
                  <button
                    onClick={() => setCancellingService(s)}
                    className="w-full sm:w-auto px-4 py-2.5 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-md text-sm font-medium transition-colors cursor-pointer"
                  >
                    Cancel Service
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border p-8 rounded-lg text-center shadow-sm max-w-2xl mx-auto">
          <HardDrive size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Need more space?</h3>
          <p className="text-muted-foreground mb-6">
            Subscribe to our scalable SFTP Storage solution. Connect your favorite clipping software instantly.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 text-left">
            {products.map(p => (
              <div key={p.id} className="border border-border p-6 rounded-lg relative overflow-hidden">
                {p.price === "0.00" || p.price === 0 ? (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    1st Month FREE
                  </div>
                ) : null}
                <h4 className="font-medium text-lg mb-2">{p.name}</h4>
                <div className="text-2xl font-bold mb-4">
                  €{(parseFloat(p.price) * 1.19).toFixed(2)} <span className="text-sm font-normal text-muted-foreground">/ mo incl. VAT</span>
                </div>
                <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                  <li className="flex gap-2 items-center"><Check size={16} className="text-green-500" /> {p.specs?.storage_gb || 'Scalable'}GB Storage</li>
                  <li className="flex gap-2 items-center"><Check size={16} className="text-green-500" /> Dedicated User</li>
                  <li className="flex gap-2 items-center"><Check size={16} className="text-green-500" /> High Availability</li>
                </ul>
                <button 
                  onClick={() => subscribe(p.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium transition-colors"
                >
                  {p.price === "0.00" || p.price === 0 ? 'Start Free Trial' : 'Subscribe Now'}
                </button>
              </div>
            ))}
            {products.length === 0 && (
              <p className="col-span-2 text-center text-sm text-yellow-500">
                No SFTP products found in the catalog.
              </p>
            )}
          </div>
        </div>
      )}

      <CancelServiceModal
        isOpen={!!cancellingService}
        service={cancellingService}
        onClose={() => setCancellingService(null)}
        onSuccess={() => {
          alert('Cancellation request processed successfully.');
          fetchServices();
        }}
      />
    </div>
  );
}
