import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface BlogArticle {
  slug: string;
  title: string;
  date: string;
  category: string;
  author: string;
  readTime: string;
  content: React.ReactNode;
}

const ARTICLES: Record<string, BlogArticle> = {
  'ipv6-deployment-considerations': {
    slug: 'ipv6-deployment-considerations',
    title: 'IPv6 deployment considerations for infrastructure operators',
    date: '2026-08-19',
    category: 'Infrastructure',
    author: 'VaultScope Engineering',
    readTime: '8 min',
    content: (
      <>
        <p className="text-foreground/80 leading-relaxed mb-6">
          IPv6 adoption continues to accelerate. For infrastructure operators managing production workloads, the migration requires careful planning across network architecture, monitoring, and operational procedures.
        </p>

        <h2 className="text-lg font-medium mt-8 mb-4">Address allocation strategy</h2>
        <p className="text-foreground/80 leading-relaxed mb-6">
          Unlike IPv4's scarcity model, IPv6 provides sufficient address space for structured allocation. We recommend allocating /64 subnets per service rather than conserving addresses. This simplifies routing, enables SLAAC where appropriate, and future-proofs network segmentation.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-6">
          Document your allocation strategy. For multi-tenant infrastructure, reserve address ranges by customer, region, and service type. This prevents fragmentation and simplifies BGP announcements.
        </p>

        <h2 className="text-lg font-medium mt-8 mb-4">Dual-stack operation</h2>
        <p className="text-foreground/80 leading-relaxed mb-6">
          Maintain IPv4 connectivity during transition. Deploy dual-stack configurations across all customer-facing services. Monitor protocol preference—some clients will prefer IPv6 when available, potentially exposing latency or MTU issues not visible in IPv4-only operation.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-6">
          Test failover behavior. If IPv6 becomes unavailable, verify that services fall back to IPv4 within acceptable time windows. The inverse scenario is equally important.
        </p>

        <h2 className="text-lg font-medium mt-8 mb-4">Monitoring and observability</h2>
        <p className="text-foreground/80 leading-relaxed mb-6">
          Extend monitoring systems to track both protocols independently. Alert on IPv6-specific metrics: neighbor discovery failures, router advertisement timing, PMTU blackholes. IPv6 connectivity issues may not affect IPv4, making protocol-specific dashboards essential.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-6">
          Update logging infrastructure to handle 128-bit addresses. Verify that existing log parsing, geolocation, and abuse detection systems support IPv6 format.
        </p>

        <h2 className="text-lg font-medium mt-8 mb-4">Security considerations</h2>
        <p className="text-foreground/80 leading-relaxed mb-6">
          Review firewall rules. IPv6 requires ICMPv6 for proper operation—blocking all ICMP will break neighbor discovery and path MTU discovery. Allow ICMPv6 types 1, 2, 3, 4, 128, 129, 133-137 at minimum.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-6">
          Disable IPv6 on hosts that don't require it rather than leaving it configured but unmonitored. An unmanaged IPv6 stack presents attack surface without operational benefit.
        </p>

        <h2 className="text-lg font-medium mt-8 mb-4">Operational readiness</h2>
        <p className="text-foreground/80 leading-relaxed mb-6">
          Train operations teams on IPv6 debugging. Tools like <code className="px-1 py-0.5 bg-foreground/5 text-sm">ping6</code>, <code className="px-1 py-0.5 bg-foreground/5 text-sm">traceroute6</code>, and <code className="px-1 py-0.5 bg-foreground/5 text-sm">ip -6 route</code> function similarly to their IPv4 equivalents but require familiarity.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-6">
          Document rollback procedures. If critical issues emerge during deployment, operators must be able to disable IPv6 cleanly without disrupting IPv4 connectivity.
        </p>

        <h2 className="text-lg font-medium mt-8 mb-4">Customer communication</h2>
        <p className="text-foreground/80 leading-relaxed mb-6">
          Notify customers before enabling IPv6 on existing services. Some enterprise networks have misconfigured IPv6 that causes connection delays or failures. Provide clear documentation on disabling IPv6 client-side if needed.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-6">
          For new infrastructure provisioning, enable dual-stack by default. IPv6-first operation is now standard practice.
        </p>

        <div className="mt-12 pt-6 border-t border-foreground/10">
          <p className="text-xs text-foreground/40">
            Questions or corrections? Contact <a href="mailto:engineering@vaultscope.net" className="underline hover:text-foreground/60">engineering@vaultscope.net</a>
          </p>
        </div>
      </>
    ),
  },
  'incident-post-mortem-2026-08-12': {
    slug: 'incident-post-mortem-2026-08-12',
    title: 'Incident post-mortem: Network latency spike, 2026-08-12',
    date: '2026-08-14',
    category: 'Operations',
    author: 'VaultScope Operations',
    readTime: '12 min',
    content: (
      <>
        <div className="bg-foreground/5 border border-foreground/10 p-4 mb-8 text-sm">
          <div className="grid grid-cols-[120px_1fr] gap-y-2 gap-x-4">
            <span className="text-foreground/60">Incident ID:</span>
            <span className="font-mono">INC-2026-08-12-001</span>

            <span className="text-foreground/60">Detection:</span>
            <span>2026-08-12 14:23 UTC</span>

            <span className="text-foreground/60">Resolution:</span>
            <span>2026-08-12 15:47 UTC</span>

            <span className="text-foreground/60">Duration:</span>
            <span>1 hour 24 minutes</span>

            <span className="text-foreground/60">Affected region:</span>
            <span>DE-FRA-01</span>

            <span className="text-foreground/60">Severity:</span>
            <span>Medium</span>
          </div>
        </div>

        <h2 className="text-lg font-medium mt-8 mb-4">Summary</h2>
        <p className="text-foreground/80 leading-relaxed mb-6">
          On August 12, 2026, between 14:23 and 15:47 UTC, customers with infrastructure in DE-FRA-01 experienced elevated network latency. Median latency increased from baseline ~12ms to ~180ms. No connectivity loss occurred—services remained reachable but degraded.
        </p>

        <h2 className="text-lg font-medium mt-8 mb-4">Impact</h2>
        <p className="text-foreground/80 leading-relaxed mb-6">
          127 VPS instances, 8 dedicated servers, and 3 ODP deployments were affected. Customer-facing services with latency-sensitive workloads experienced degraded performance. API response times increased proportionally.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-6">
          No data loss occurred. Service availability remained above 99.9% throughout the incident.
        </p>

        <h2 className="text-lg font-medium mt-8 mb-4">Timeline (UTC)</h2>
        <div className="space-y-3 mb-6 text-sm">
          <div className="grid grid-cols-[80px_1fr] gap-4">
            <span className="text-foreground/60 font-mono">14:23</span>
            <span className="text-foreground/80">Automated monitoring detected latency increase in DE-FRA-01. Alert sent to on-call engineer.</span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-4">
            <span className="text-foreground/60 font-mono">14:27</span>
            <span className="text-foreground/80">On-call engineer confirmed incident. Began investigating network path between transit provider and internal infrastructure.</span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-4">
            <span className="text-foreground/60 font-mono">14:32</span>
            <span className="text-foreground/80">Status page updated: "Investigating elevated network latency in DE-FRA-01."</span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-4">
            <span className="text-foreground/60 font-mono">14:45</span>
            <span className="text-foreground/80">Identified root cause: BGP route flap at upstream transit provider causing traffic to route through suboptimal path via AMS instead of direct FRA peering.</span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-4">
            <span className="text-foreground/60 font-mono">14:52</span>
            <span className="text-foreground/80">Contacted transit provider NOC. Escalated to senior network engineer.</span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-4">
            <span className="text-foreground/60 font-mono">15:18</span>
            <span className="text-foreground/80">Transit provider identified misconfigured route filter on edge router FRA-PE-02. Route filter was rejecting our /22 announcement, causing failover to Amsterdam.</span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-4">
            <span className="text-foreground/60 font-mono">15:31</span>
            <span className="text-foreground/80">Transit provider applied configuration fix. BGP session re-established with correct route advertisement.</span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-4">
            <span className="text-foreground/60 font-mono">15:47</span>
            <span className="text-foreground/80">Latency returned to baseline. Monitoring confirmed stable routing. Incident resolved.</span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-4">
            <span className="text-foreground/60 font-mono">16:05</span>
            <span className="text-foreground/80">Status page updated: "Resolved."</span>
          </div>
        </div>

        <h2 className="text-lg font-medium mt-8 mb-4">Root cause</h2>
        <p className="text-foreground/80 leading-relaxed mb-6">
          Transit provider deployed updated route filtering policy to edge router FRA-PE-02 at 14:20 UTC. The new filter inadvertently rejected our AS's /22 prefix announcement due to an incorrect prefix-list entry.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-6">
          BGP automatically failed over to backup path via Amsterdam peering point. This secondary path added ~160ms latency due to geographic distance and additional transit hops.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-6">
          The failure was not immediately visible because connectivity remained intact—only latency degraded.
        </p>

        <h2 className="text-lg font-medium mt-8 mb-4">Contributing factors</h2>
        <ul className="list-none space-y-2 mb-6 text-foreground/80">
          <li className="pl-4 border-l-2 border-foreground/20">Transit provider's change management process did not include verification of customer prefix announcements post-deployment.</li>
          <li className="pl-4 border-l-2 border-foreground/20">Our monitoring detected latency increase within 3 minutes, but alerting threshold was set at +100ms sustained for 5 minutes—delaying initial notification slightly.</li>
          <li className="pl-4 border-l-2 border-foreground/20">BGP session remained up throughout the incident, making diagnosis non-obvious without examining routing tables.</li>
        </ul>

        <h2 className="text-lg font-medium mt-8 mb-4">Corrective actions</h2>
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">Completed</span>
              <span className="text-xs text-foreground/40">2026-08-13</span>
            </div>
            <p className="text-sm text-foreground/80">
              Worked with transit provider to implement automated route announcement validation in their deployment pipeline. Future configuration changes will verify customer prefixes are correctly advertised before deployment completes.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">Completed</span>
              <span className="text-xs text-foreground/40">2026-08-14</span>
            </div>
            <p className="text-sm text-foreground/80">
              Adjusted latency alerting threshold from +100ms sustained 5min to +50ms sustained 2min for production infrastructure. This reduces detection delay without increasing false positive rate.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">In progress</span>
              <span className="text-xs text-foreground/40">ETA 2026-08-30</span>
            </div>
            <p className="text-sm text-foreground/80">
              Deploying active BGP route monitoring to detect unexpected path changes. System will alert when traffic routes through non-primary paths, even if latency remains within acceptable range.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">Planned</span>
              <span className="text-xs text-foreground/40">ETA 2026-09-15</span>
            </div>
            <p className="text-sm text-foreground/80">
              Establishing automated runbook for BGP-related incidents. When routing anomaly is detected, on-call engineer will receive specific diagnostic commands and escalation contacts.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-foreground/10">
          <p className="text-xs text-foreground/40">
            Questions regarding this incident? Contact <a href="mailto:operations@vaultscope.net" className="underline hover:text-foreground/60">operations@vaultscope.net</a>
          </p>
        </div>
      </>
    ),
  },
};

export function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? ARTICLES[slug] : undefined;

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-sm text-foreground/60">Article not found.</p>
        <Link to="/resources/blog" className="text-sm underline hover:text-foreground/80 mt-4 inline-block">
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} — VaultScope</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link to="/resources/blog" className="text-sm text-foreground/60 hover:text-foreground/80 mb-8 inline-block">
          ← Blog
        </Link>

        <article>
          <header className="mb-8 pb-8 border-b border-foreground/10">
            <div className="flex items-center gap-3 text-xs text-foreground/40 mb-4">
              <span>{article.category}</span>
              <span>·</span>
              <span>{new Date(article.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}</span>
              <span>·</span>
              <span>{article.readTime}</span>
            </div>
            <h1 className="text-2xl font-medium mb-3 leading-tight">
              {article.title}
            </h1>
            <p className="text-sm text-foreground/60">
              {article.author}
            </p>
          </header>

          <div className="prose-sm">
            {article.content}
          </div>
        </article>
      </div>
    </>
  );
}
