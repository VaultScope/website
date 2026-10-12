import { useState, useEffect } from 'react';
import { PageHero } from '../components/Shared';
import { 
  Shield, 
  Layout, 
  Server, 
  Database, 
  Users, 
  HeadphonesIcon, 
  Activity, 
  Terminal, 
  Cpu, 
  DollarSign, 
  CheckCircle2, 
  RefreshCw, 
  Eye, 
  ExternalLink, 
  FileText,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { HelpTooltip, useExplainMode } from '../components/HelpTooltip';

const FEATURES = [
  {
    icon: Layout,
    title: 'Dashboard & Telemetry',
    description: 'Visualize MRR, active servers, open tickets, and infrastructure node capacity in real time.'
  },
  {
    icon: Users,
    title: 'Customers & Billing',
    description: 'View client profiles, manage Stripe subscriptions/invoices, handle tax rates, and generate promotional coupons.'
  },
  {
    icon: Database,
    title: 'Service & Product Management',
    description: 'Map retail plans to underlying upstream infrastructure. Support for custom configuration options.'
  },
  {
    icon: Server,
    title: 'Automated Job Orchestration',
    description: 'Asynchronous workers asynchronously provision Hetzner VPS, SftpGo storage, and Dedicated Server power/IPMI.'
  },
  {
    icon: HeadphonesIcon,
    title: 'Support Desk & Real-time Chat',
    description: 'Fully-featured ticketing system with live updates, file attachments, and internal staff notes.'
  },
  {
    icon: Shield,
    title: 'Sovereign RBAC & Audit Trails',
    description: 'Fine-grained role-based permissions, Argon2 password verification, and tamper-evident event logs.'
  }
];

export const Camos = () => {
  const { explainMode, toggleExplainMode } = useExplainMode();
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'services' | 'billing'>('overview');

  useEffect(() => {
    document.title = "CAMOS — Operations Control Plane | VaultScope";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "CAMOS is the centralized internal operations dashboard used by staff to manage VaultScope services, automated job queues, billing, and telemetry.");
    }
  }, []);

  return (
    <div className="flex flex-col w-full">
      <PageHero
        eyebrow="OPERATIONS SUITE"
        title="CAMOS Control Plane"
        description="Client Administration & Management Operations System. The sovereign internal platform powering billing workflows, asynchronous job pipelines, upstream cloud integrations, and staff RBAC."
        primaryCta="Read Documentation"
        primaryLink="/docs/projects/camos"
        secondaryCta="View GitHub"
        secondaryLink="https://github.com/VaultScope"
        align="left"
      />

      {/* Interactive CAMOS Operations Preview Section */}
      <section className="py-20 relative bg-background border-t border-border/[0.08]">
        <div className="container mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-primary/10 border border-primary/20 text-xs font-mono text-primary mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Architecture Sandbox</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                Explore the CAMOS Console
              </h2>
              <p className="text-sm text-foreground/60 mt-1 max-w-2xl">
                Hover or click any <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-foreground/10 text-[10px] font-bold mx-1 align-baseline">?</span> icon to inspect backend data schemas, API contracts, and security rules.
              </p>
            </div>

            {/* Explain Mode Toggle Button */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={toggleExplainMode}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  explainMode
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20 ring-2 ring-primary/40'
                    : 'bg-card text-muted-foreground border-border hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{explainMode ? 'Inspection Mode Active' : 'Enable Inspection Mode'}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${explainMode ? 'bg-black/20 text-white' : 'bg-foreground/10 text-foreground/70'}`}>
                  {explainMode ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>
          </div>

          {/* Simulated CAMOS Browser Frame */}
          <div className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
            {/* Top Bar / Breadcrumb Navigation */}
            <div className="border-b border-border bg-foreground/[0.02] px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-mono text-foreground/70">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-primary" />
                  camos.vaultscope.internal
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-foreground/30" />
                <span className="capitalize">{activeTab}</span>
                <HelpTooltip
                  title="Internal Mutual TLS Gateway"
                  badge="Network Isolation"
                  content="CAMOS is hosted on an isolated management VLAN behind strict mTLS and Cloudflare Zero Trust tunnels. It is inaccessible from the public internet."
                  example="mtls://admin-camos.vaultscope.internal"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-mono text-emerald-500 font-medium">API v1.4.0 Online</span>
                  <HelpTooltip
                    title="VaultScope-API Health"
                    badge="Heartbeat"
                    content="Continuous 10-second polling against GET /api/health validating PostgreSQL pool status, Redis job queues, and upstream connectivity."
                  />
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono bg-foreground/5 px-2 py-1 rounded border border-border/50 text-foreground/60">
                  <kbd className="font-bold">Ctrl</kbd> + <kbd className="font-bold">K</kbd> Command Palette
                  <HelpTooltip
                    title="Quick-Jump Navigation"
                    badge="UX"
                    content="Omnibar search allowing operators to jump instantly to any customer, service, job ID, or system settings."
                  />
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-border bg-foreground/[0.01] px-4 flex gap-1 overflow-x-auto text-xs">
              {[
                { id: 'overview', label: 'Overview & Telemetry', icon: Layout },
                { id: 'jobs', label: 'Job Orchestration', icon: Activity },
                { id: 'services', label: 'Upstream Services', icon: Server },
                { id: 'billing', label: 'Billing & Ledger', icon: DollarSign },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'border-foreground text-foreground'
                        : 'border-transparent text-foreground/50 hover:text-foreground hover:border-foreground/30'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mock Dashboard Body */}
            <div className="p-6 md:p-8 space-y-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Top Metric Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
                      <div className="flex items-center justify-between text-xs text-foreground/50 mb-1">
                        <span>Monthly Recurring Revenue</span>
                        <HelpTooltip
                          title="Monthly Recurring Revenue (MRR)"
                          badge="Financial Metric"
                          content="Normalized recurring subscription revenue across active VPS instances, SFTP buckets, and Dedicated Servers excluding one-time setup fees."
                          example="EUR 14,850.00"
                        />
                      </div>
                      <div className="text-xl md:text-2xl font-bold font-mono text-foreground">€14,850.00</div>
                      <div className="text-[11px] text-emerald-500 font-medium mt-1 flex items-center gap-1">
                        +18.4% from last month
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
                      <div className="flex items-center justify-between text-xs text-foreground/50 mb-1">
                        <span>Active Infrastructure Nodes</span>
                        <HelpTooltip
                          title="Active Managed Nodes"
                          badge="Infrastructure"
                          content="Count of provisioned compute instances across Hetzner Cloud, Dedicated bare metal servers, and sovereign SFTP clusters."
                          example="Hetzner: 142 | Dedicated: 28 | SFTP: 42"
                        />
                      </div>
                      <div className="text-xl md:text-2xl font-bold font-mono text-foreground">212</div>
                      <div className="text-[11px] text-foreground/50 font-medium mt-1">
                        99.98% overall uptime
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
                      <div className="flex items-center justify-between text-xs text-foreground/50 mb-1">
                        <span>Queued Background Jobs</span>
                        <HelpTooltip
                          title="Asynchronous Job Queue"
                          badge="Task Pipeline"
                          content="Pending or processing idempotent asynchronous tasks handled by background workers with exponential backoff retry."
                          example="Status: 0 pending, 2 active"
                        />
                      </div>
                      <div className="text-xl md:text-2xl font-bold font-mono text-foreground">2 Active</div>
                      <div className="text-[11px] text-emerald-500 font-medium mt-1">
                        0 failures in 24h
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
                      <div className="flex items-center justify-between text-xs text-foreground/50 mb-1">
                        <span>Open Support Tickets</span>
                        <HelpTooltip
                          title="Support Desk SLA"
                          badge="Customer Operations"
                          content="Real-time ticket queue with live WebSocket updates, Mailcow SMTP outbound notifications, and attachment security scanning."
                        />
                      </div>
                      <div className="text-xl md:text-2xl font-bold font-mono text-foreground">3 Open</div>
                      <div className="text-[11px] text-foreground/50 font-medium mt-1">
                        Avg response: 11 mins
                      </div>
                    </div>
                  </div>

                  {/* Systems Status Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-lg border border-border bg-foreground/[0.01] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <Cpu className="w-4 h-4 text-primary" />
                          <span>Infrastructure Fleet Telemetry</span>
                        </div>
                        <HelpTooltip
                          title="Hardware & Virtualization"
                          badge="Telemetry"
                          content="Real-time metrics polled via node exporters and provider APIs reporting CPU load, memory commit, and NVMe disk wear."
                        />
                      </div>
                      <div className="space-y-2 pt-2 text-xs font-mono">
                        <div>
                          <div className="flex justify-between text-foreground/60 mb-1">
                            <span>Falkenstein DC (FSN1) Load</span>
                            <span>42% (Normal)</span>
                          </div>
                          <div className="w-full bg-foreground/10 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-[42%]" />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-foreground/60 mb-1">
                            <span>Helsinki DC (HEL1) Load</span>
                            <span>68% (Optimal)</span>
                          </div>
                          <div className="w-full bg-foreground/10 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-[68%]" />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-foreground/60 mb-1">
                            <span>Sovereign Storage Cluster IOPS</span>
                            <span>12,400 IOPS</span>
                          </div>
                          <div className="w-full bg-foreground/10 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[31%]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-lg border border-border bg-foreground/[0.01] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <Shield className="w-4 h-4 text-emerald-500" />
                          <span>Security & Audit State</span>
                        </div>
                        <HelpTooltip
                          title="Security Posture"
                          badge="Compliance"
                          content="Continuous automated vulnerability scanning, zero CVEs, strict Argon2id password hashing, and encrypted JWT tokens."
                        />
                      </div>
                      <div className="space-y-2 pt-1 text-xs">
                        <div className="flex items-center justify-between p-2 rounded bg-foreground/5 border border-border/50">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Vulnerability Audit (Storefront, Admin, API)</span>
                          </div>
                          <span className="font-mono text-emerald-500 text-[11px] font-bold">0 CVEs</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-foreground/5 border border-border/50">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Staff Authentication Protocol</span>
                          </div>
                          <span className="font-mono text-foreground/70 text-[11px]">Argon2id + JWT</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-foreground/5 border border-border/50">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>GoBD Audit Trail Logging</span>
                          </div>
                          <span className="font-mono text-emerald-500 text-[11px] font-bold">Immutable</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'jobs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Asynchronous Provisioning Queue</h3>
                      <p className="text-xs text-foreground/50">Idempotent background execution engine executing multi-step server setups.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-foreground/50 font-mono">Poll Interval: 2000ms</span>
                      <HelpTooltip
                        title="Background Worker Engine"
                        badge="Tokio Cron / Queue"
                        content="Pulls jobs from PostgreSQL jobs table using row-level locking (FOR UPDATE SKIP LOCKED). Guarantees zero double-execution."
                      />
                    </div>
                  </div>

                  <div className="border border-border rounded-lg overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-foreground/5 border-b border-border text-foreground/70">
                        <tr>
                          <th className="p-3">
                            <span className="inline-flex items-center gap-1">
                              Job ID
                              <HelpTooltip title="Job ID" content="UUIDv4 identifier linking the provisioning pipeline." />
                            </span>
                          </th>
                          <th className="p-3">
                            <span className="inline-flex items-center gap-1">
                              Task Type
                              <HelpTooltip title="Task Type" content="Provision, resize, power cycle, or destroy service." />
                            </span>
                          </th>
                          <th className="p-3">
                            <span className="inline-flex items-center gap-1">
                              Target Provider
                              <HelpTooltip title="Target Provider" content="Provider driver: hetzner_cloud, sftpgo, reliablesite, or proxmox." />
                            </span>
                          </th>
                          <th className="p-3">
                            <span className="inline-flex items-center gap-1">
                              Execution Status
                              <HelpTooltip title="Status State Machine" content="Transitions: pending -> processing -> completed / failed." />
                            </span>
                          </th>
                          <th className="p-3 text-right">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        <tr className="hover:bg-foreground/[0.02]">
                          <td className="p-3 text-foreground/80 font-bold">#job-4892</td>
                          <td className="p-3 text-foreground">Provision Cloud VPS (cx32)</td>
                          <td className="p-3 text-foreground/70">hetzner_cloud</td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-semibold">
                              <CheckCircle2 className="w-3 h-3" /> completed
                            </span>
                          </td>
                          <td className="p-3 text-right text-foreground/50">4.2s</td>
                        </tr>
                        <tr className="hover:bg-foreground/[0.02]">
                          <td className="p-3 text-foreground/80 font-bold">#job-4893</td>
                          <td className="p-3 text-foreground">Create SFTPGo Quota (1TB)</td>
                          <td className="p-3 text-foreground/70">sftpgo</td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[11px] font-semibold">
                              <RefreshCw className="w-3 h-3 animate-spin" /> running
                            </span>
                          </td>
                          <td className="p-3 text-right text-foreground/50">1.8s</td>
                        </tr>
                        <tr className="hover:bg-foreground/[0.02]">
                          <td className="p-3 text-foreground/80 font-bold">#job-4894</td>
                          <td className="p-3 text-foreground">Dedicated PXE Reinstall (Debian 12)</td>
                          <td className="p-3 text-foreground/70">reliablesite</td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[11px] font-semibold">
                              pending
                            </span>
                          </td>
                          <td className="p-3 text-right text-foreground/50">0.0s</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Managed Services & Bare Metal Fleet</h3>
                      <p className="text-xs text-foreground/50">Direct orchestration of virtual servers, storage pools, and out-of-band IPMI KVM.</p>
                    </div>
                    <HelpTooltip
                      title="Direct Hardware Control"
                      badge="Zero Middleman"
                      content="CAMOS communicates directly with upstream hardware controllers using secure API tokens without 3rd party reselling bottlenecks."
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border border-border bg-foreground/[0.01] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-foreground">VPS-FSN1-0812</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono">running</span>
                      </div>
                      <div className="text-xs text-foreground/60 space-y-1">
                        <div>Plan: Cloud VPS Standard (4 vCPU / 8 GB)</div>
                        <div>IP: 195.201.88.14</div>
                        <div>Upstream ID: #hcloud-849201</div>
                      </div>
                      <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                        <span className="text-foreground/50 font-mono">Hetzner Cloud</span>
                        <HelpTooltip
                          title="Interactive VNC Console"
                          content="Launches a live HTML5 canvas RFB console session with full keyboard shortcut forwarding (Ctrl+Alt+Del, Esc, Tab)."
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-foreground/[0.01] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-foreground">DS-EPYC-3291</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono">running</span>
                      </div>
                      <div className="text-xs text-foreground/60 space-y-1">
                        <div>Hardware: AMD EPYC 7502P (32c/64t)</div>
                        <div>RAM: 128 GB ECC DDR4</div>
                        <div>Management: Out-of-band IPMI / KVM</div>
                      </div>
                      <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                        <span className="text-foreground/50 font-mono">Dedicated Server</span>
                        <HelpTooltip
                          title="IPMI / KVM Session Request"
                          badge="Out-of-band"
                          content="Generates temporary single-sign-on credentials and a Java/HTML5 KVM viewer url directly linked to the BMC controller."
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-foreground/[0.01] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-foreground">SFTP-BUCKET-902</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono">active</span>
                      </div>
                      <div className="text-xs text-foreground/60 space-y-1">
                        <div>Quota: 2,048 GB NVMe</div>
                        <div>Protocols: SFTP, FTPS, WebDAV</div>
                        <div>Bandwidth: Unlimited 1Gbps</div>
                      </div>
                      <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                        <span className="text-foreground/50 font-mono">SFTPGo Cluster</span>
                        <HelpTooltip
                          title="Sovereign Storage Quota"
                          content="Managed via SFTPGo REST API with auto-generated public keys and per-folder ACL restrictions."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">GoBD-Compliant Billing & Ledger</h3>
                      <p className="text-xs text-foreground/50">Native automated tax calculation, Stripe webhook idempotency, and tamper-proof PDF generation.</p>
                    </div>
                    <HelpTooltip
                      title="GoBD Compliance"
                      badge="German Tax Law"
                      content="Sequential invoice numbering without gaps (INV-YYYY-XXXXX), immutable audit trails, and strict calculation of 19% German VAT."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-4 rounded-lg border border-border bg-foreground/[0.01] space-y-2">
                      <div className="flex items-center justify-between text-foreground/70">
                        <span>Invoice #INV-2026-0042</span>
                        <span className="text-emerald-500 font-bold">PAID</span>
                      </div>
                      <div className="text-foreground/50">Client: ACME Technologies GmbH (DE312984920)</div>
                      <div className="pt-2 border-t border-border/50 space-y-1 text-foreground/80">
                        <div className="flex justify-between">
                          <span>Subtotal (Net)</span>
                          <span>€100.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>19% German VAT (USt.)</span>
                          <span>€19.00</span>
                        </div>
                        <div className="flex justify-between font-bold text-foreground pt-1 border-t border-border/30">
                          <span>Total Gross</span>
                          <span>€119.00</span>
                        </div>
                      </div>
                      <div className="pt-2 flex items-center justify-between text-[11px]">
                        <span className="text-foreground/40 font-mono">Stripe pi_3Nz92K...</span>
                        <div className="flex items-center gap-1 text-primary">
                          <FileText className="w-3.5 h-3.5" />
                          <span>PDF Available</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-foreground/[0.01] space-y-2">
                      <div className="flex items-center justify-between text-foreground/70">
                        <span>Webhook Dispatcher</span>
                        <span className="text-emerald-500 font-bold">HEALTHY</span>
                      </div>
                      <div className="text-foreground/50">Listener: POST /api/storefront/billing/webhook</div>
                      <div className="pt-2 border-t border-border/50 space-y-1 text-foreground/80">
                        <div className="flex justify-between">
                          <span>HMAC-SHA256 Verification</span>
                          <span className="text-emerald-500 font-bold">Constant-Time</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Idempotency Table</span>
                          <span>processed_events</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Auto-Provision Trigger</span>
                          <span>invoice.paid</span>
                        </div>
                      </div>
                      <div className="pt-2 text-[11px] text-foreground/40">
                        Processed 481 events with 0 duplicate allocations.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Simulated CAMOS Footer */}
            <div className="border-t border-border bg-foreground/[0.02] px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs text-foreground/50">
              <div className="flex items-center gap-3">
                <span>VaultScope CAMOS v2.4</span>
                <span>•</span>
                <span>Role: Super Administrator</span>
                <HelpTooltip
                  title="Role-Based Access Control (RBAC)"
                  badge="Security"
                  content="Admins hold granular scopes: billing:write, services:manage, support:reply, system:diagnostics."
                />
              </div>
              <div className="flex items-center gap-4">
                <a 
                  href="/docs/projects/camos" 
                  className="hover:text-foreground transition-colors flex items-center gap-1 font-medium"
                >
                  Operator Manual <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Breakdown Grid */}
      <section className="py-24 relative bg-background border-t border-border/[0.08]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-xs font-mono font-medium text-foreground/40 uppercase tracking-widest mb-12">
            Control Plane Capabilities
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border border-border">
            {FEATURES.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={`p-10 flex flex-col gap-6 border-border ${i % 3 !== 2 ? 'lg:border-r' : ''} ${i < 3 ? 'lg:border-b' : ''} ${i % 2 !== 1 ? 'md:border-r' : ''} ${i < 4 ? 'md:border-b' : ''} border-b`}
                >
                  <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0 rounded-lg bg-foreground/5">
                    <Icon className="w-4 h-4 text-foreground/70" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground tracking-tight mb-3">{item.title}</h3>
                    <p className="text-sm text-foreground/50 font-light leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-20 pt-12 border-t border-border/[0.08]">
            <h3 className="text-lg font-medium tracking-tight mb-6">Engineered for Sovereign Operations</h3>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-medium uppercase tracking-wider text-foreground/60">
              <span className="bg-foreground/5 px-3 py-1.5 border border-border rounded">Rust (Tokio / Axum)</span>
              <span className="bg-foreground/5 px-3 py-1.5 border border-border rounded">React 19 + TypeScript</span>
              <span className="bg-foreground/5 px-3 py-1.5 border border-border rounded">Tailwind CSS 4</span>
              <span className="bg-foreground/5 px-3 py-1.5 border border-border rounded">Argon2id Hashing</span>
              <span className="bg-foreground/5 px-3 py-1.5 border border-border rounded">PostgreSQL + SQLx</span>
              <span className="bg-foreground/5 px-3 py-1.5 border border-border rounded">Stripe REST + Webhooks</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

