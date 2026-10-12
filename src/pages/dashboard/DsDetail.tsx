import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useToast } from '../../components/Toast';
import {
  Power, Terminal, Network,
  Cpu, HardDrive, ArrowLeft, Tag, Activity, AlertTriangle,
  Shield, ExternalLink, Copy, Check, Eye, EyeOff, RefreshCw, X, Radio
} from 'lucide-react';
import { Button } from '../../components/Shared';

const OS_OPTIONS = [
  { id: 'ubuntu-24.04', name: 'Ubuntu 24.04 LTS (Noble Numbat)', type: 'Linux' },
  { id: 'debian-12', name: 'Debian 12 (Bookworm)', type: 'Linux' },
  { id: 'almalinux-9', name: 'AlmaLinux 9.4 (Enterprise)', type: 'Linux' },
  { id: 'rocky-9', name: 'Rocky Linux 9.4', type: 'Linux' },
  { id: 'proxmox-8', name: 'Proxmox VE 8.2 (Hypervisor)', type: 'Virtualization' },
  { id: 'windows-server-2022', name: 'Windows Server 2022 Standard', type: 'Windows' },
];

export function DsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [service, setService] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // IPMI / KVM Modal State
  const [showIpmiModal, setShowIpmiModal] = useState(false);
  const [ipmiData, setIpmiData] = useState<any | null>(null);
  const [ipmiLoading, setIpmiLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Reinstall & Delete States
  const [showReinstallModal, setShowReinstallModal] = useState(false);
  const [selectedOs, setSelectedOs] = useState('ubuntu-24.04');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchServiceData = () => {
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
      error('Failed to load service details');
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchServiceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [ipVisible, setIpVisible] = useState<'v4' | 'v6' | null>(null);

  const maskIp = (ip: string, type: 'v4' | 'v6') => {
    if (!ip) return '—';
    if (type === 'v4') {
      const parts = ip.split('.');
      if (parts.length !== 4) return ip;
      return `${parts[0]}.•••.•••.•••`;
    }
    return ip.length > 4 ? ip.substring(0, 4) + ':•••:•••:•••::•••' : ip;
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePowerAction = async (action: 'start' | 'stop' | 'restart') => {
    if (!id) return;
    setActionLoading(action);
    try {
      await api.post(`/storefront/services/${id}/${action}`);
      success(`Chassis ${action} action sent to IPMI controller`);
      fetchServiceData();
    } catch (err: any) {
      console.error(err);
      error(err.message || `Failed to perform ${action} action`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenIpmi = async () => {
    if (!id) return;
    setShowIpmiModal(true);
    setIpmiLoading(true);
    try {
      const data = await api.post<any>(`/storefront/services/${id}/ipmi`);
      setIpmiData(data);
    } catch (err: any) {
      console.error(err);
      error(err.message || 'Failed to request IPMI / KVM access session');
    } finally {
      setIpmiLoading(false);
    }
  };

  const handleReinstall = async () => {
    if (!id) return;
    setActionLoading('reinstall');
    try {
      await api.post(`/storefront/services/${id}/reinstall`, { os: selectedOs });
      success(`PXE OS reload scheduled with ${selectedOs}`);
      setShowReinstallModal(false);
      fetchServiceData();
    } catch (err: any) {
      console.error(err);
      error(err.message || 'Failed to trigger PXE OS reload');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setActionLoading('delete');
    try {
      await api.delete(`/storefront/services/${id}`);
      success('Dedicated server decommissioned successfully');
      navigate('/dashboard/ds');
    } catch (err: any) {
      console.error(err);
      error(err.message || 'Failed to delete server');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  if (!service) return <div className="p-8 text-center text-red-500">Service not found</div>;

  // Extract specs from product or service config
  const hw = service.config?.hardware || {};
  const ds = {
    id: service.id,
    providerId: service.provider_resource_id || `rs-ds-${service.id.slice(0, 8)}`,
    name: service.hostname || service.name || 'Dedicated Server',
    type: product?.name || 'Bare Metal Dedicated',
    status: service.status,
    location: product?.specs?.location || 'Miami, FL (US-East)',
    country: 'United States',
    ram: hw.ram || product?.specs?.ram || '128 GB DDR4 ECC',
    cpu: hw.cpu || product?.specs?.cpu || product?.specs?.server_type || 'AMD EPYC 7402P (24C / 48T)',
    chassis: hw.chassis || 'Supermicro 1U Rackmount Server',
    disk: hw.disks || product?.specs?.disk || '2x 1.92 TB NVMe (HW RAID1)',
    network: hw.port_speed || '1 Gbps Unmetered',
    ipv4: service.ip || '104.238.140.22',
    ipv6: '2607:f130:0:108::1',
    backupStatus: 'Active (Daily IPMI Snapshots)',
    nextBilling: service.next_due ? new Date(service.next_due).toLocaleDateString() : '—',
    tags: ['dedicated', 'bare-metal', 'ipmi-enabled'],
    latency: '18 ms',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-border">
        <Link to="/dashboard/ds" className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5 mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Dedicated Servers
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-medium">{ds.name}</h1>
              <span className={`text-xs flex items-center gap-1.5 ${ds.status === 'running' ? 'text-green-500' : 'text-yellow-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${ds.status === 'running' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                {ds.status === 'running' ? 'Chassis Powered On' : ds.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="font-mono">{ds.id}</span>
              <span>{ds.type}</span>
              <span>{ds.location}</span>
            </div>
            {ds.tags.length > 0 && (
              <div className="flex gap-2 mt-3">
                {ds.tags.map(tag => (
                  <span key={tag} className="text-[10px] uppercase tracking-wider border border-border px-2 py-0.5 flex items-center gap-1 text-muted-foreground">
                    <Tag className="w-2.5 h-2.5" /> {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={handleOpenIpmi}
              variant="default"
              className="h-8 px-3 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Terminal className="w-3.5 h-3.5" /> Out-of-Band KVM / IPMI
            </Button>
            <Button
              onClick={() => handlePowerAction('restart')}
              disabled={actionLoading !== null}
              variant="outline"
              className="h-8 px-3 text-xs gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${actionLoading === 'restart' ? 'animate-spin' : ''}`} /> Cold Reset
            </Button>
            {ds.status === 'running' ? (
              <Button
                onClick={() => handlePowerAction('stop')}
                disabled={actionLoading !== null}
                variant="outline"
                className="h-8 px-3 text-xs gap-1.5 text-red-500 hover:bg-red-500/10 border-red-500/30"
              >
                <Power className="w-3.5 h-3.5" /> Power Off
              </Button>
            ) : (
              <Button
                onClick={() => handlePowerAction('start')}
                disabled={actionLoading !== null}
                variant="outline"
                className="h-8 px-3 text-xs gap-1.5 text-green-500 hover:bg-green-500/10 border-green-500/30"
              >
                <Power className="w-3.5 h-3.5" /> Power On
              </Button>
            )}
            <Button
              onClick={() => setShowReinstallModal(true)}
              variant="outline"
              className="h-8 px-3 text-xs gap-1.5"
            >
              <HardDrive className="w-3.5 h-3.5" /> Reinstall OS
            </Button>
          </div>
        </div>
      </div>

      {/* Out-of-Band IPMI Info Banner */}
      <div className="border border-blue-500/30 bg-blue-500/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20 text-blue-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">ReliableSite Out-of-Band Hardware Control (IPMI 2.0 / KVM)</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Access the bare-metal chassis even when the operating system is unresponsive or offline.
            </p>
          </div>
        </div>
        <Button onClick={handleOpenIpmi} className="h-8 px-4 text-xs shrink-0 bg-blue-600 hover:bg-blue-700 text-white">
          Launch IPMI Console
        </Button>
      </div>

      {/* Latency & Connectivity */}
      <div className="border border-border px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Network gateway latency</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-light">{ds.latency}</span>
          <span className="text-xs text-green-500 flex items-center gap-1">
            <Radio className="w-3 h-3 animate-pulse" /> Optimal (1 Gbps)
          </span>
        </div>
      </div>

      {/* Network */}
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/40 mb-3 flex items-center gap-2">
          <Network className="w-3.5 h-3.5" /> Network Interfaces & IP Allocation
        </h2>
        <div className="border border-border divide-y divide-border">
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Primary IPv4</span>
            <span
              className="font-mono text-sm cursor-pointer hover:text-foreground transition-colors flex items-center gap-2"
              onMouseEnter={() => setIpVisible('v4')}
              onMouseLeave={() => setIpVisible(null)}
              onClick={() => copyToClipboard(ds.ipv4, 'ipv4')}
              title="Click to copy"
            >
              {ipVisible === 'v4' ? ds.ipv4 : maskIp(ds.ipv4, 'v4')}
              {copiedField === 'ipv4' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 opacity-40" />}
            </span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Routed IPv6 (/64)</span>
            <span
              className="font-mono text-xs cursor-pointer hover:text-foreground transition-colors flex items-center gap-2"
              onMouseEnter={() => setIpVisible('v6')}
              onMouseLeave={() => setIpVisible(null)}
              onClick={() => copyToClipboard(ds.ipv6, 'ipv6')}
              title="Click to copy"
            >
              {ipVisible === 'v6' ? ds.ipv6 : maskIp(ds.ipv6, 'v6')}
              {copiedField === 'ipv6' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 opacity-40" />}
            </span>
          </div>
        </div>
      </div>

      {/* Hardware */}
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/40 mb-3 flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5" /> Dedicated Hardware Specifications
        </h2>
        <div className="border border-border">
          <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y divide-border">
            {[
              { label: 'Processor', value: ds.cpu },
              { label: 'Chassis Type', value: ds.chassis },
              { label: 'System Memory', value: ds.ram },
              { label: 'NVMe / Storage Array', value: ds.disk },
              { label: 'Uplink & Bandwidth', value: ds.network },
              { label: 'Hardware Management', value: 'IPMI 2.0 / HTML5 KVM' },
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
          <HardDrive className="w-3.5 h-3.5" /> Identifiers & Contract
        </h2>
        <div className="border border-border divide-y divide-border">
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">VaultScope Service ID</span>
            <span className="font-mono text-sm">{ds.id}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">ReliableSite Server ID</span>
            <span className="font-mono text-sm text-blue-400">{ds.providerId}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Next Renewal Date</span>
            <span className="text-sm">{ds.nextBilling}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Datacenter Location</span>
            <span className="text-sm">{ds.location}</span>
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
            <p className="text-sm font-medium">Decommission Dedicated Server</p>
            <p className="text-xs text-muted-foreground">
              Cancels the server lease and triggers secure cryptographic hardware wipe.
            </p>
          </div>
          <Button
            onClick={() => setShowDeleteModal(true)}
            variant="outline"
            className="h-8 px-4 text-xs border-red-500/30 text-red-500 hover:bg-red-500/5"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* IPMI / KVM Console Modal */}
      {showIpmiModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border max-w-xl w-full p-6 shadow-xl relative animate-in fade-in-50">
            <button
              onClick={() => setShowIpmiModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-blue-600/10 border border-blue-600/30 text-blue-500 rounded">
                <Terminal className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Out-of-Band KVM / IPMI Session</h3>
                <p className="text-xs text-muted-foreground">
                  Direct hardware-level Baseboard Management Controller (BMC)
                </p>
              </div>
            </div>

            {ipmiLoading ? (
              <div className="py-12 text-center text-muted-foreground space-y-3">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                <p className="text-sm">Requesting temporary IPMI session & whitelisting client IP...</p>
              </div>
            ) : ipmiData ? (
              <div className="space-y-4">
                <div className="p-3 bg-foreground/5 border border-border text-xs flex items-center justify-between">
                  <span className="text-muted-foreground">Security Status</span>
                  <span className="text-green-500 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full" /> IP Whitelisted for 2 hours
                  </span>
                </div>

                <div className="border border-border divide-y divide-border text-sm">
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">IPMI Host Gateway</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{ipmiData.ipmi_host}</span>
                      <button
                        onClick={() => copyToClipboard(ipmiData.ipmi_host, 'ipmi_host')}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {copiedField === 'ipmi_host' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Port</span>
                    <span className="font-mono text-xs">{ipmiData.ipmi_port} (HTTPS / Web KVM)</span>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Username</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold">{ipmiData.ipmi_username}</span>
                      <button
                        onClick={() => copyToClipboard(ipmiData.ipmi_username, 'ipmi_username')}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {copiedField === 'ipmi_username' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Session Password</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">
                        {showPassword ? ipmiData.ipmi_password : '••••••••••••••••'}
                      </span>
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(ipmiData.ipmi_password, 'ipmi_password')}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {copiedField === 'ipmi_password' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">BMC Controller</span>
                    <span className="text-xs">{ipmiData.bmc_type || 'Supermicro IPMI / HTML5 KVM'}</span>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground leading-relaxed bg-foreground/[0.02] p-3 border border-border">
                  <p className="font-medium text-foreground mb-1">Connecting to Web IPMI:</p>
                  Click the button below to open the Supermicro/ASRock management console. Because IPMI appliances use a self-signed TLS certificate, click "Advanced &rarr; Proceed" if your browser warns about the certificate.
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    onClick={handleOpenIpmi}
                    variant="outline"
                    className="h-9 px-4 text-xs gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh Session
                  </Button>
                  <Button
                    onClick={() => window.open(ipmiData.web_url, '_blank')}
                    className="h-9 px-4 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open Web IPMI GUI
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-red-500 text-sm">
                Failed to load IPMI session. Please try again.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reinstall OS Modal */}
      {showReinstallModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border max-w-lg w-full p-6 shadow-xl relative animate-in fade-in-50">
            <button
              onClick={() => setShowReinstallModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-medium mb-1">Automated PXE OS Reload</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Select an operating system image to reinstall on your dedicated hardware. All existing disk partitions will be formatted.
            </p>

            <div className="space-y-2 mb-6">
              {OS_OPTIONS.map(os => (
                <label
                  key={os.id}
                  className={`flex items-center justify-between p-3 border cursor-pointer text-sm transition-colors ${
                    selectedOs === os.id ? 'border-foreground bg-foreground/5' : 'border-border hover:bg-foreground/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="os"
                      value={os.id}
                      checked={selectedOs === os.id}
                      onChange={() => setSelectedOs(os.id)}
                      className="accent-foreground"
                    />
                    <div>
                      <div className="font-medium">{os.name}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{os.type}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs mb-6">
              Warning: This operation will completely wipe all local NVMe disks on the dedicated server.
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowReinstallModal(false)}
                className="h-9 px-4 text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReinstall}
                disabled={actionLoading === 'reinstall'}
                className="h-9 px-4 text-xs bg-red-600 hover:bg-red-700 text-white"
              >
                {actionLoading === 'reinstall' ? 'Dispatching PXE...' : 'Confirm Reinstall'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border max-w-md w-full p-6 shadow-xl relative animate-in fade-in-50">
            <h3 className="text-lg font-medium text-red-500 mb-2">Decommission Server</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-6">
              Are you sure you want to decommission this dedicated server? This action will permanently release the hardware lease, wipe all data, and remove the server from your account.
            </p>
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="h-9 px-4 text-xs"
              >
                Keep Server
              </Button>
              <Button
                onClick={handleDelete}
                disabled={actionLoading === 'delete'}
                className="h-9 px-4 text-xs bg-red-600 hover:bg-red-700 text-white"
              >
                {actionLoading === 'delete' ? 'Decommissioning...' : 'Yes, Decommission'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
