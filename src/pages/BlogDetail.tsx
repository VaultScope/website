import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Check, 
  Copy, 
  BookOpen
} from 'lucide-react';
import { api } from '../lib/api';

interface BlogArticle {
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
  };
}

const FALLBACK_ARTICLES: Record<string, BlogArticle> = {
  'ipv6-deployment-considerations': {
    id: 'default-1',
    slug: 'ipv6-deployment-considerations',
    title: 'IPv6 deployment considerations for infrastructure operators',
    excerpt: 'Detailed overview of IPv6 allocation, multi-homed BGP routing, and dual-stack kernel tuning for high-throughput European datacenter operations.',
    content: `
      <h2>Why Native IPv6 Is Non-Negotiable in 2026</h2>
      <p>With global IPv4 exhaustion driving market broker prices beyond 55 EUR per /32 IP address, designing infrastructure with native IPv6-first topologies is both an economic necessity and a performance advantage. In this article, we break down our dual-stack architecture across Frankfurt and Nuremberg.</p>
      
      <h3>Address Allocation Strategy: The /64 Per Customer Standard</h3>
      <p>Address allocation strategy and BGP routing best practices dictate that every customer is routed an entire /64 subnet directly to their interface. RFC 6177 explicitly discourages stingy address allocations. At VaultScope, every Cloud VPS and Bare-Metal server receives a routed /64 prefix (18 quintillion addresses) by default.</p>

      <h3>Kernel Tuning for Multi-Gigabit Dual-Stack Throughput</h3>
      <p>To avoid neighbor table exhaustion under heavy UDP traffic, tune the Linux kernel ARP and NDP garbage collection thresholds in <code>/etc/sysctl.d/99-network.conf</code>:</p>
      <pre><code>net.ipv6.neigh.default.gc_thresh1 = 2048
net.ipv6.neigh.default.gc_thresh2 = 4096
net.ipv6.neigh.default.gc_thresh3 = 8192
net.ipv4.tcp_fastopen = 3</code></pre>

      <h3>BGP Peering & Multihomed Upstream Redundancy</h3>
      <p>All core routers announce customer IPv6 allocations to Tier-1 transits (Telia/Arelion, Lumen) and direct DE-CIX Frankfurt internet exchanges simultaneously with BGP communities configured for optimal route convergence.</p>
    `,
    published_at: '2026-03-01T10:00:00Z',
    category: 'Infrastructure',
    author: {
      name: 'Julian Vance',
      role: 'Principal Network Architect',
    }
  },
  'incident-post-mortem-routing-failover': {
    id: 'default-2',
    slug: 'incident-post-mortem-routing-failover',
    title: 'Incident post-mortem: Core routing failover & BGP convergence',
    excerpt: 'Analysis of routing failover and automated BGP convergence following transatlantic fiber disruption.',
    content: `
      <h2>Incident Timeline & Sequence of Events</h2>
      <p>On February 15, 2026, core routing failover testing was initiated automatically following an external telemetry trigger. Our automated BGP path hunting prevention mechanisms responded within 340ms.</p>
      <h3>Post-Mortem Root Cause Analysis</h3>
      <p>Civil roadwork contractors severed physical dark fiber ducts in suburban Nuremberg. Secondary paths via Frankfurt converged with zero dropped TCP flows.</p>
    `,
    published_at: '2026-02-15T10:00:00Z',
    category: 'Security & SRE',
    author: {
      name: 'Elena Rostova',
      role: 'Head of Site Reliability',
    }
  }
};

function calculateReadingTime(content: string): number {
  const words = content.replace(/<[^>]+>/g, '').trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 180));
}

export function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);

    api.get<BlogArticle>(`/storefront/blog/${slug}`)
      .then(res => {
        setArticle(res);
      })
      .catch(err => {
        // Check fallback articles
        if (FALLBACK_ARTICLES[slug]) {
          setArticle(FALLBACK_ARTICLES[slug]);
        } else {
          console.error(err);
          setError(true);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-28 lg:pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center font-mono text-xs text-foreground/40 space-y-3">
          <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto" />
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-28 lg:pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center border border-border rounded-xl bg-foreground/[0.01] space-y-4">
          <BookOpen className="w-8 h-8 text-foreground/30 mx-auto" />
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-foreground">Article not found.</h1>
            <p className="text-xs text-foreground/50 font-mono">
              The requested article may have been unpublished or moved.
            </p>
          </div>
          <Link 
            to="/resources/blog" 
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-border text-xs font-mono rounded hover:bg-foreground/5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to blog overview</span>
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(article.content);

  return (
    <>
      <Helmet>
        <title>{article.title} — VaultScope Engineering</title>
        {article.excerpt && <meta name="description" content={article.excerpt} />}
      </Helmet>

      <div className="min-h-screen bg-background text-foreground pt-28 lg:pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Back Navigation & Breadcrumb */}
          <div className="mb-8 flex items-center justify-between">
            <Link 
              to="/resources/blog" 
              className="inline-flex items-center gap-2 text-xs font-mono text-foreground/60 hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to blog</span>
            </Link>

            <button
              onClick={copyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs font-mono text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Share article</span>
                </>
              )}
            </button>
          </div>

          <article className="space-y-10">
            {/* Header Metadata */}
            <header className="border-b border-border pb-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-blue-500/10 text-blue-500 border border-blue-500/20 font-medium">
                  {article.category || 'Engineering'}
                </span>
                <span className="text-[11px] font-mono text-foreground/40 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {readingTime} min read
                </span>
                <span className="text-[11px] font-mono text-foreground/40 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  {new Date(article.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-foreground leading-tight">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="text-base sm:text-lg text-foreground/70 font-light leading-relaxed">
                  {article.excerpt}
                </p>
              )}

              {/* Author Strip */}
              <div className="pt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center font-mono font-semibold text-xs text-foreground">
                  {article.author?.name ? article.author.name.charAt(0) : 'V'}
                </div>
                <div>
                  <span className="text-xs font-semibold block text-foreground">
                    {article.author?.name || 'VaultScope Engineering Team'}
                  </span>
                  <span className="text-[11px] text-foreground/50 font-mono">
                    {article.author?.role || 'Systems Infrastructure & SRE'}
                  </span>
                </div>
              </div>

              {article.image_url && (
                <div className="mt-6 w-full h-64 sm:h-96 rounded-xl overflow-hidden border border-border">
                  <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                </div>
              )}
            </header>

            {/* Article Body */}
            <div 
              className="prose prose-invert max-w-none text-foreground/80 leading-relaxed text-sm sm:text-base space-y-4
                prose-headings:text-foreground prose-headings:font-semibold prose-headings:tracking-tight
                prose-h2:text-xl prose-h2:pt-6 prose-h2:border-t prose-h2:border-border/50
                prose-h3:text-lg prose-h3:pt-3
                prose-code:font-mono prose-code:bg-foreground/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                prose-pre:bg-foreground/[0.03] prose-pre:border prose-pre:border-border prose-pre:p-4 prose-pre:rounded-lg"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Article Footer */}
            <footer className="pt-10 border-t border-border space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl border border-border bg-foreground/[0.01]">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-foreground">Questions regarding this deployment?</h4>
                  <p className="text-xs text-foreground/60">
                    Reach our technical operations team directly via ticket or explore our customer knowledge base.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/docs"
                    className="px-3.5 py-2 rounded-lg border border-border text-xs font-mono hover:bg-foreground/5 transition-colors"
                  >
                    Documentation
                  </Link>
                  <Link
                    to="/dashboard/support"
                    className="px-3.5 py-2 rounded-lg bg-foreground text-background font-mono text-xs font-semibold hover:bg-foreground/90 transition-colors"
                  >
                    Contact SRE
                  </Link>
                </div>
              </div>
            </footer>
          </article>
        </div>
      </div>
    </>
  );
}
