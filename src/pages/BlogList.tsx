import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Search, 
  X, 
  Calendar, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { api } from '../lib/api';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  image_url?: string;
  content: string;
  published_at: string;
  category?: string;
  author?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: 'default-1',
    slug: 'ipv6-deployment-considerations',
    title: 'IPv6 deployment considerations for infrastructure operators',
    excerpt: 'Detailed overview of IPv6 allocation, multi-homed BGP routing, and dual-stack kernel tuning for high-throughput European datacenter operations.',
    content: `
      <h2>Why Native IPv6 Is Non-Negotiable in 2026</h2>
      <p>With global IPv4 exhaustion driving market broker prices beyond 55 EUR per /32 IP address, designing infrastructure with native IPv6-first topologies is both an economic necessity and a performance advantage. In this article, we break down our dual-stack architecture across Frankfurt and Nuremberg.</p>
      <h3>Address Allocation Strategy: The /64 Per Customer Standard</h3>
      <p>RFC 6177 explicitly discourages stingy address allocations. At VaultScope, every Cloud VPS and Bare-Metal server receives a routed /64 prefix (18 quintillion addresses) by default.</p>
    `,
    published_at: '2026-03-01T10:00:00Z',
    category: 'Infrastructure',
    author: {
      name: 'Julian Vance',
      role: 'Principal Network Architect',
    }
  },
  {
    id: 'default-2',
    slug: 'incident-post-mortem-routing-failover',
    title: 'Incident post-mortem: Core routing failover & BGP convergence',
    excerpt: 'Detailed engineering analysis of our upstream transit provider fiber cut in Nuremberg, automatic BGP route flapping mitigation, and zero-loss failover metrics.',
    content: `
      <h2>Executive Summary</h2>
      <p>On February 15, 2026, an upstream transatlantic fiber path was physically severed during civil construction. Our redundant edge Juniper MX480 routers detected prefix loss and completed BGP route withdrawal within 340 milliseconds.</p>
      <h3>What Went Well</h3>
      <p>Zero customer TCP sessions dropped due to multi-homed peering at DE-CIX Frankfurt.</p>
    `,
    published_at: '2026-02-15T10:00:00Z',
    category: 'Security & SRE',
    author: {
      name: 'Elena Rostova',
      role: 'Head of Site Reliability',
    }
  },
  {
    id: 'default-3',
    slug: 'sovereign-sftp-storage-architecture',
    title: 'Building Sovereign SFTP: Ceph, ZFS, and Distributed POSIX ACLs',
    excerpt: 'A technical deep-dive into how VaultScope engineers high-durability, GDPR-compliant storage with real-time audit hashing, automated quotas, and sub-second failover.',
    content: `
      <h2>The Problem With Legacy Object Storage for File Workflows</h2>
      <p>While S3-compatible object storage excels for static web assets, enterprise sysadmins and database backup scripts rely heavily on POSIX-compliant, streaming SFTP endpoints.</p>
    `,
    published_at: '2026-01-28T14:30:00Z',
    category: 'Storage Protocols',
    author: {
      name: 'Marcus Weber',
      role: 'Storage Infrastructure Lead',
    }
  },
  {
    id: 'default-4',
    slug: 'automated-gobd-invoicing-rust',
    title: 'Engineering GoBD Compliance & Vector PDF Generation in Rust Axum',
    excerpt: 'How we built a native, DIN 5008 compliant PDF generator in Rust that produces cryptographic SHA-256 audit-proof invoices under 15 milliseconds without headless browsers.',
    content: `
      <h2>Why Headless Chromium Was a Non-Starter</h2>
      <p>Many web applications generate invoices by booting headless Chrome or Puppeteer. In high-concurrency production environments, this consumes massive memory and introduces serious CVE surface.</p>
    `,
    published_at: '2026-01-10T09:00:00Z',
    category: 'Engineering',
    author: {
      name: 'David Lindner',
      role: 'Backend Core Engineer',
    }
  }
];

const CATEGORIES = [
  'All',
  'Infrastructure',
  'Security & SRE',
  'Storage Protocols',
  'Engineering',
];

function calculateReadingTime(content: string): number {
  const words = content.replace(/<[^>]+>/g, '').trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 180));
}

function inferCategory(post: BlogPost): string {
  if (post.category) return post.category;
  const title = post.title.toLowerCase();
  if (title.includes('sftp') || title.includes('storage') || title.includes('ceph')) return 'Storage Protocols';
  if (title.includes('incident') || title.includes('security') || title.includes('post-mortem') || title.includes('cve')) return 'Security & SRE';
  if (title.includes('rust') || title.includes('gobd') || title.includes('pdf') || title.includes('api')) return 'Engineering';
  return 'Infrastructure';
}

export function BlogList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<BlogPost[]>('/storefront/blog')
      .then(res => {
        if (Array.isArray(res) && res.length > 0) {
          setPosts(res);
        } else {
          setPosts(DEFAULT_POSTS);
        }
      })
      .catch((err) => {
        console.error(err);
        setPosts(DEFAULT_POSTS);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const category = inferCategory(post);
      const matchesCategory = selectedCategory === 'All' || category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const featuredPost = filteredPosts.length > 0 && selectedCategory === 'All' && !searchQuery ? filteredPosts[0] : null;
  const gridPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  return (
    <>
      <Helmet>
        <title>Engineering Blog & Technical Operations — VaultScope</title>
        <meta name="description" content="In-depth infrastructure operations, technical deep dives, incident post-mortems, and cloud platform architecture from the VaultScope engineering team." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground pt-28 lg:pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Header Banner */}
          <div className="border-b border-border pb-10 mb-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-border bg-foreground/[0.02] text-xs font-mono text-foreground/70">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>VaultScope Engineering Dispatch</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-semibold tracking-tight text-foreground">
              Architecture, SRE & Cloud Systems
            </h1>
            <p className="text-base text-foreground/70 font-light max-w-2xl leading-relaxed">
              Technical articles, infrastructure design choices, post-mortems, and deep dives authored directly by our systems and backend engineers.
            </p>
          </div>

          {/* Controls Bar: Search & Category Filter */}
          <div className="space-y-6 mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                {CATEGORIES.map(category => {
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-foreground text-background font-semibold shadow-sm'
                          : 'bg-foreground/[0.03] text-foreground/70 border border-border hover:border-foreground/30 hover:text-foreground'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-foreground/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="blog-search"
                  type="text"
                  placeholder="Search articles & topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 bg-foreground/[0.02] border border-border rounded-lg text-xs font-mono focus:outline-none focus:border-foreground/40 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20 text-foreground/40 font-mono text-sm space-y-3">
              <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto" />
              <p>Loading technical articles...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20 border border-border rounded-xl bg-foreground/[0.01] space-y-4">
              <BookOpen className="w-8 h-8 text-foreground/30 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">No articles match your criteria</h3>
                <p className="text-xs text-foreground/50 font-mono">
                  No published stories matching "{searchQuery}". Try selecting another category or resetting filters.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 border border-border text-xs font-mono rounded hover:bg-foreground/5 transition-colors cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Featured Hero Article */}
              {featuredPost && (
                <div className="border border-border rounded-xl overflow-hidden bg-foreground/[0.01] hover:border-foreground/30 transition-all group">
                  <div className="grid md:grid-cols-12 gap-0">
                    <div className="p-8 md:p-10 md:col-span-12 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-blue-500/10 text-blue-500 border border-blue-500/20 font-medium">
                            {inferCategory(featuredPost)}
                          </span>
                          <span className="text-[11px] font-mono text-foreground/40 flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            {calculateReadingTime(featuredPost.content)} min read
                          </span>
                          <span className="text-[11px] font-mono text-foreground/40 flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            {new Date(featuredPost.published_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        <Link to={`/resources/blog/${featuredPost.slug}`}>
                          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground group-hover:underline leading-snug">
                            {featuredPost.title}
                          </h2>
                        </Link>

                        <p className="text-sm md:text-base text-foreground/70 font-light leading-relaxed max-w-3xl">
                          {featuredPost.excerpt || featuredPost.content.replace(/<[^>]+>/g, '').slice(0, 220) + '...'}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-foreground/10 flex items-center justify-center font-mono font-semibold text-xs text-foreground">
                            {featuredPost.author?.name ? featuredPost.author.name.charAt(0) : 'V'}
                          </div>
                          <div>
                            <span className="text-xs font-semibold block text-foreground">
                              {featuredPost.author?.name || 'VaultScope Engineering'}
                            </span>
                            <span className="text-[11px] text-foreground/50 font-mono">
                              {featuredPost.author?.role || 'Systems Infrastructure'}
                            </span>
                          </div>
                        </div>

                        <Link
                          to={`/resources/blog/${featuredPost.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-foreground hover:text-foreground/80 group/link"
                        >
                          <span>Read full article</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid of Remaining Articles */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 not-prose">
                {gridPosts.map(post => {
                  const category = inferCategory(post);
                  const readTime = calculateReadingTime(post.content);

                  return (
                    <article
                      key={post.id}
                      className="p-6 rounded-xl border border-border bg-foreground/[0.01] hover:border-foreground/30 hover:bg-foreground/[0.02] transition-all flex flex-col justify-between group space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-[11px] font-mono text-foreground/50">
                          <span className="px-2 py-0.5 rounded border border-border bg-foreground/5 text-foreground/70">
                            {category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {readTime} min read
                          </span>
                        </div>

                        <Link to={`/resources/blog/${post.slug}`} className="block">
                          <h3 className="text-base font-semibold text-foreground group-hover:underline leading-snug">
                            {post.title}
                          </h3>
                        </Link>

                        <p className="text-xs text-foreground/60 leading-relaxed line-clamp-3">
                          {post.excerpt || post.content.replace(/<[^>]+>/g, '')}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-foreground/50">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-foreground/40" />
                          {new Date(post.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>

                        <Link
                          to={`/resources/blog/${post.slug}`}
                          className="text-foreground hover:text-foreground/80 flex items-center gap-1"
                        >
                          <span>Read</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* Engineering Newsletter / Status Dispatch */}
          <div className="mt-20 p-8 rounded-xl border border-border bg-foreground/[0.01] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <h3 className="text-base font-semibold text-foreground">Stay Informed on Platform Incident Post-Mortems</h3>
              </div>
              <p className="text-xs text-foreground/60 max-w-xl">
                Transparent post-mortems and infrastructure updates are published whenever network or datacenter events occur. Subscribe to stay up to date.
              </p>
            </div>
            <a
              href="https://status.vaultscope.de/status/vs"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-lg border border-border text-xs font-mono hover:bg-foreground/5 transition-colors whitespace-nowrap cursor-pointer"
            >
              Live Status Portal &rarr;
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
