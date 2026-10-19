import { useState } from 'react';
import { LocaleLink } from '../i18n';
import { SeoHead } from '../components/SeoHead';
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
  Activity,
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
    description: 'GoBD audit trails, GDPR data protection, EU infrastructure sovereignty, and zero-trust access.',
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

  const filteredCategories = FORUM_CATEGORIES.filter((cat) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q) ||
      cat.topics.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <SeoHead
        title="Community Forum & Systems Exchange"
        description="Connect with VaultScope engineers, infrastructure architects, and system operators. Technical discussions on VPS, sovereign SFTP, BGP routing, and security."
        path="/resources/forum"
      />

      <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text)] pt-28 lg:pt-32 pb-24">
        <div className="vs-container">
          {/* Header */}
          <header className="pb-10 mb-10 space-y-3">
            <h1 className="text-3xl lg:text-5xl font-semibold tracking-tight text-[var(--text)]">
              Technical Forum &amp; Architecture
            </h1>
            <p className="text-base text-[var(--text-muted)] max-w-2xl leading-relaxed">
              Open discussions, infrastructure topology sharing, operational best practices, and direct feedback channels with the VaultScope core team.
            </p>
          </header>

          {/* Ecosystem Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 mb-10">
            <a
              href="https://github.com/VaultScope/VaultScope"
              target="_blank"
              rel="noreferrer"
              className="pt-4 border-t border-[var(--line)] hover:border-[var(--accent-bright)] transition-colors group flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-[var(--text)] group-hover:text-[var(--accent-bright)] transition-colors">GitHub Discussions</span>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--text-faint)] group-hover:text-[var(--accent-bright)] transition-colors" />
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Code snippets, RFCs, and open-source tooling contributions.
              </p>
            </a>

            <LocaleLink
              to="/docs"
              className="pt-4 border-t border-[var(--line)] hover:border-[var(--accent-bright)] transition-colors group flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-[var(--text)] group-hover:text-[var(--accent-bright)] transition-colors">Documentation</span>
                <FileText className="w-3.5 h-3.5 text-[var(--text-faint)] group-hover:text-[var(--accent-bright)] transition-colors" />
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Guides for SFTP setup, IPv6 routing, and API integration.
              </p>
            </LocaleLink>

            <LocaleLink
              to="/company/contact"
              className="pt-4 border-t border-[var(--line)] hover:border-[var(--accent-bright)] transition-colors group flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-[var(--text)] group-hover:text-[var(--accent-bright)] transition-colors">Technical Support</span>
                <Headphones className="w-3.5 h-3.5 text-[var(--text-faint)] group-hover:text-[var(--accent-bright)] transition-colors" />
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Direct tickets for billing, hardware diagnostics, and enterprise SLAs.
              </p>
            </LocaleLink>

            <a
              href="https://status.vaultscope.de/status/vs"
              target="_blank"
              rel="noreferrer"
              className="pt-4 border-t border-[var(--line)] hover:border-[var(--accent-bright)] transition-colors group flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-[var(--text)] group-hover:text-[var(--accent-bright)] transition-colors">Network Status</span>
                <Activity className="w-3.5 h-3.5 text-[var(--text-faint)] group-hover:text-[var(--accent-bright)] transition-colors" />
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Real-time uptime metrics for Frankfurt and Nuremberg datacenters.
              </p>
            </a>
          </div>

          {/* Search Controls */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-[var(--text-faint)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="forum-search"
                type="text"
                placeholder="Search categories & topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2 bg-[var(--bg-surface)] border border-[var(--line)] text-xs font-mono text-[var(--text)] focus:outline-none focus:border-[var(--accent-bright)] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-[var(--text)] cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Categories Grid */}
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-sm font-semibold text-[var(--text)]">No categories match your search</p>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                No discussion channel matching &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-3.5 py-1.5 border border-[var(--line)] text-xs font-mono hover:border-[var(--accent-bright)] transition-colors cursor-pointer"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {filteredCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <LocaleLink
                    key={category.slug}
                    to={`/resources/forum/${category.slug}`}
                    className="pt-6 border-t border-[var(--line)] hover:border-[var(--accent-bright)] transition-colors flex flex-col justify-between group space-y-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-[var(--accent)]/10 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent-bright)]">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <h2 className="text-base font-semibold text-[var(--text)] group-hover:text-[var(--accent-bright)] transition-colors">
                              {category.name}
                            </h2>
                            <span className="text-[11px] font-mono text-[var(--text-faint)]">
                              /resources/forum/{category.slug}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                        {category.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[var(--line)] flex items-center justify-between">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[var(--text-faint)]">
                        {category.topics.slice(0, 3).join(' · ')}
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] group-hover:text-[var(--accent-bright)] transition-colors shrink-0">
                        <span>Enter channel</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </LocaleLink>
                );
              })}
            </div>
          )}

          {/* Conduct notice */}
          <div className="mt-16 pt-6 text-xs font-mono text-[var(--text-muted)] space-y-2">
            <div className="flex items-center gap-2 text-[var(--text)] font-semibold">
              <Users className="w-4 h-4 text-[var(--accent-bright)]" />
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
