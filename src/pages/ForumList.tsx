import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Search, 
  X, 
  Server, 
  HardDrive, 
  Network, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  MessageSquareQuote, 
  ArrowRight, 
  Users, 
  ExternalLink, 
  FileText, 
  Headphones, 
  Activity 
} from 'lucide-react';

export interface ForumCategory {
  slug: string;
  name: string;
  description: string;
  icon: typeof Server;
  topics: string[];
}

export const FORUM_CATEGORIES: ForumCategory[] = [
  {
    slug: 'infrastructure',
    name: 'Infrastructure',
    description: 'Cloud VPS, dedicated servers, hypervisors, KVM tuning, and deployment questions.',
    icon: Server,
    topics: ['Cloud VPS', 'Bare Metal', 'KVM', 'Kernel Tuning', 'Proxmox'],
  },
  {
    slug: 'storage',
    name: 'Storage Protocols',
    description: 'Sovereign SFTP, Ceph distributed clusters, ZFS storage pools, and backup workflows.',
    icon: HardDrive,
    topics: ['SFTP', 'Ceph', 'ZFS', 'Snapshots', 'POSIX Quotas'],
  },
  {
    slug: 'networking',
    name: 'Networking & Routing',
    description: 'BGP peering, IPv6 dual-stack allocation, DE-CIX Frankfurt, WireGuard, and transit routes.',
    icon: Network,
    topics: ['BGP Peering', 'IPv6 /64', 'DE-CIX', 'Anycast', 'WireGuard'],
  },
  {
    slug: 'operations',
    name: 'Operations & SRE',
    description: 'Monitoring, Prometheus telemetry, backup retention, incident procedures, and automation.',
    icon: Cpu,
    topics: ['Prometheus', 'Grafana', 'Backup Retention', 'SRE', 'Disaster Recovery'],
  },
  {
    slug: 'security',
    name: 'Security & Compliance',
    description: 'GoBD audit trails, GDPR data protection, ISO 27001 readiness, and zero-trust access.',
    icon: ShieldCheck,
    topics: ['GoBD', 'GDPR', 'Audit Logging', 'SSH Keys', 'Zero-Trust'],
  },
  {
    slug: 'automation',
    name: 'API & Automation',
    description: 'Storefront REST API, Terraform provider, infrastructure-as-code, and webhook events.',
    icon: Terminal,
    topics: ['REST API', 'Terraform', 'Webhooks', 'CLI', 'Rust Axum'],
  },
  {
    slug: 'feedback',
    name: 'Community Feedback & RFCs',
    description: 'Feature requests, platform proposals, developer suggestions, and roadmap ideas.',
    icon: MessageSquareQuote,
    topics: ['Feature Requests', 'Roadmap', 'RFCs', 'Wishlist'],
  },
];

export function ForumList() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = FORUM_CATEGORIES.filter(cat => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q) ||
      cat.topics.some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <Helmet>
        <title>Community Forum & Systems Exchange — VaultScope</title>
        <meta 
          name="description" 
          content="Connect with VaultScope engineers, infrastructure architects, and system operators. Technical discussions on VPS, sovereign SFTP, BGP routing, and security." 
        />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground pt-28 lg:pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Header Banner */}
          <div className="border-b border-border pb-10 mb-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-border bg-foreground/[0.02] text-xs font-mono text-foreground/70">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>VaultScope Community Exchange</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-semibold tracking-tight text-foreground">
              Technical Forum & Architecture
            </h1>
            <p className="text-base text-foreground/70 font-light max-w-2xl leading-relaxed">
              Open discussions, infrastructure topology sharing, operational best practices, and direct feedback channels with the VaultScope core team.
            </p>
          </div>

          {/* Ecosystem Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <a
              href="https://github.com/VaultScope/VaultScope"
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-xl border border-border bg-foreground/[0.01] hover:bg-foreground/[0.03] hover:border-foreground/30 transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-foreground">GitHub Discussions</span>
                <ExternalLink className="w-3.5 h-3.5 text-foreground/40 group-hover:text-foreground transition-colors" />
              </div>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Code snippets, RFCs, and open-source tooling contributions.
              </p>
            </a>

            <Link
              to="/resources/docs"
              className="p-4 rounded-xl border border-border bg-foreground/[0.01] hover:bg-foreground/[0.03] hover:border-foreground/30 transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-foreground">Documentation</span>
                <FileText className="w-3.5 h-3.5 text-foreground/40 group-hover:text-foreground transition-colors" />
              </div>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Guides for SFTP setup, IPv6 routing, and API integration.
              </p>
            </Link>

            <Link
              to="/support"
              className="p-4 rounded-xl border border-border bg-foreground/[0.01] hover:bg-foreground/[0.03] hover:border-foreground/30 transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-foreground">Technical Support</span>
                <Headphones className="w-3.5 h-3.5 text-foreground/40 group-hover:text-foreground transition-colors" />
              </div>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Direct tickets for billing, hardware diagnostics, and enterprise SLAs.
              </p>
            </Link>

            <a
              href="https://status.vaultscope.de/status/vs"
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-xl border border-border bg-foreground/[0.01] hover:bg-foreground/[0.03] hover:border-foreground/30 transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-foreground">Network Status</span>
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Real-time uptime metrics for Frankfurt and Nuremberg datacenters.
              </p>
            </a>
          </div>

          {/* Search Controls */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-foreground/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="forum-search"
                type="text"
                placeholder="Search categories & topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2 bg-foreground/[0.02] border border-border rounded-lg text-xs font-mono focus:outline-none focus:border-foreground/40 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Categories Grid */}
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16 border border-border rounded-xl bg-foreground/[0.01] space-y-3">
              <p className="text-sm font-semibold text-foreground">No categories match your search</p>
              <p className="text-xs text-foreground/50 font-mono">
                No discussion channel matching "{searchQuery}".
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-3.5 py-1.5 border border-border text-xs font-mono rounded hover:bg-foreground/5 transition-colors cursor-pointer"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Link
                    key={category.slug}
                    to={`/resources/forum/${category.slug}`}
                    className="p-6 rounded-xl border border-border bg-foreground/[0.01] hover:bg-foreground/[0.02] hover:border-foreground/30 transition-all flex flex-col justify-between group space-y-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-foreground/5 border border-border flex items-center justify-center text-foreground group-hover:scale-105 transition-transform">
                            <IconComponent className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <h2 className="text-base font-semibold text-foreground group-hover:underline">
                              {category.name}
                            </h2>
                            <span className="text-[11px] font-mono text-foreground/40">
                              /resources/forum/{category.slug}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-foreground/70 leading-relaxed font-light">
                        {category.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {category.topics.slice(0, 3).map(topic => (
                          <span
                            key={topic}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-foreground/[0.03] text-foreground/60 border border-border"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-mono text-foreground/60 group-hover:text-foreground transition-colors shrink-0">
                        <span>Enter channel</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Conduct notice */}
          <div className="mt-16 p-6 rounded-xl border border-border bg-foreground/[0.01] text-xs font-mono text-foreground/50 space-y-2">
            <div className="flex items-center gap-2 text-foreground/70 font-semibold">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Operator Community Guidelines</span>
            </div>
            <p className="leading-relaxed">
              VaultScope Forum is a collaborative technical space. Before posting configurations or kernel logs, ensure all sensitive credentials, private keys, and internal IP address spaces have been sanitized.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
