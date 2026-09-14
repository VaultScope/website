import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface Post {
  id: string;
  author: string;
  timestamp: string;
  content: React.ReactNode;
  isOriginalPost?: boolean;
  isSolution?: boolean;
}

interface ThreadData {
  id: string;
  title: string;
  category: string;
  status?: 'solved' | 'locked';
  posts: Post[];
}

const THREAD_DATA: Record<string, ThreadData> = {
  'ipv6-config-new-vps': {
    id: 'ipv6-config-new-vps',
    title: 'IPv6 configuration on new VPS instances',
    category: 'infrastructure',
    status: 'solved',
    posts: [
      {
        id: '1',
        author: 'alex_m',
        timestamp: '2026-08-20T11:23:00Z',
        isOriginalPost: true,
        content: (
          <>
            <p className="mb-4">
              I just provisioned a new VPS in DE-FRA-01 and noticed IPv6 is enabled by default. The interface shows an address assigned, but I'm not seeing IPv6 connectivity when testing from the instance.
            </p>
            <p className="mb-4">
              IPv4 works fine. Running <code className="px-1 py-0.5 bg-foreground/5 text-xs font-mono">ip -6 addr</code> shows the address configured on eth0. Default route is present. But <code className="px-1 py-0.5 bg-foreground/5 text-xs font-mono">ping6 2001:4860:4860::8888</code> times out.
            </p>
            <p>
              Is there additional configuration required for IPv6 on new instances?
            </p>
          </>
        ),
      },
      {
        id: '2',
        author: 'network_ops',
        timestamp: '2026-08-20T12:41:00Z',
        content: (
          <>
            <p className="mb-4">
              Check if the IPv6 default gateway is responding. Try:
            </p>
            <pre className="bg-foreground/5 p-3 text-xs font-mono mb-4 overflow-x-auto">
              ip -6 route show default
            </pre>
            <p>
              Then ping the gateway address directly. If the gateway itself doesn't respond, that's your issue.
            </p>
          </>
        ),
      },
      {
        id: '3',
        author: 'alex_m',
        timestamp: '2026-08-20T13:08:00Z',
        content: (
          <>
            <p className="mb-4">
              Gateway is listed in routing table:
            </p>
            <pre className="bg-foreground/5 p-3 text-xs font-mono mb-4">
              default via fe80::1 dev eth0 metric 1024
            </pre>
            <p>
              But pinging <code className="px-1 py-0.5 bg-foreground/5 text-xs font-mono">fe80::1</code> also times out. No response.
            </p>
          </>
        ),
      },
      {
        id: '4',
        author: 'sysadmin_jane',
        timestamp: '2026-08-20T14:22:00Z',
        content: (
          <p>
            Firewall rules blocking ICMPv6? Check <code className="px-1 py-0.5 bg-foreground/5 text-xs font-mono">ip6tables -L -v</code> for any DROP rules on the INPUT or OUTPUT chains.
          </p>
        ),
      },
      {
        id: '5',
        author: 'alex_m',
        timestamp: '2026-08-20T15:47:00Z',
        content: (
          <p>
            No firewall rules configured yet. This is a fresh instance. <code className="px-1 py-0.5 bg-foreground/5 text-xs font-mono">ip6tables -L</code> shows all chains set to ACCEPT with no rules.
          </p>
        ),
      },
      {
        id: '6',
        author: 'infrastructure_admin',
        timestamp: '2026-08-21T09:15:00Z',
        isSolution: true,
        content: (
          <>
            <p className="mb-4">
              This is a known issue with instances provisioned between August 18-20. IPv6 gateway configuration was missing from the DHCP response due to a deployment issue in DE-FRA-01.
            </p>
            <p className="mb-4">
              <strong>Workaround:</strong>
            </p>
            <p className="mb-4">
              Add the correct gateway manually. Edit <code className="px-1 py-0.5 bg-foreground/5 text-xs font-mono">/etc/network/interfaces</code> (Debian/Ubuntu) or equivalent:
            </p>
            <pre className="bg-foreground/5 p-3 text-xs font-mono mb-4">
{`iface eth0 inet6 static
  address 2a01:xxxx:xxxx:xxxx::1/64
  gateway fe80::1`}
            </pre>
            <p className="mb-4">
              Then restart networking or reboot.
            </p>
            <p className="mb-4">
              <strong>Permanent fix:</strong>
            </p>
            <p>
              We deployed a corrected configuration to DE-FRA-01 on August 21. New instances provisioned after 08:00 UTC will have IPv6 working by default. Existing affected instances can either apply the workaround above or open a support ticket—we'll update the configuration remotely.
            </p>
          </>
        ),
      },
      {
        id: '7',
        author: 'alex_m',
        timestamp: '2026-08-21T10:34:00Z',
        content: (
          <p>
            Applied the manual gateway configuration. IPv6 now working. Thanks for the detailed explanation.
          </p>
        ),
      },
      {
        id: '8',
        author: 'network_ops',
        timestamp: '2026-08-22T09:34:00Z',
        content: (
          <p>
            Good to know this was deployment-related rather than instance-specific. Saved me some debugging time on a similar issue.
          </p>
        ),
      },
    ],
  },
  'backup-retention-policies': {
    id: 'backup-retention-policies',
    title: 'Best practices for backup retention policies',
    category: 'operations',
    posts: [
      {
        id: '1',
        author: 'infrastructure_admin',
        timestamp: '2026-08-19T10:45:00Z',
        isOriginalPost: true,
        content: (
          <>
            <p className="mb-4">
              Looking for feedback on backup retention strategies for production VPS infrastructure.
            </p>
            <p className="mb-4">
              Current policy:
            </p>
            <ul className="list-none space-y-2 mb-4 text-sm">
              <li className="pl-4 border-l-2 border-foreground/20">Daily backups: 7 days</li>
              <li className="pl-4 border-l-2 border-foreground/20">Weekly backups: 4 weeks</li>
              <li className="pl-4 border-l-2 border-foreground/20">Monthly backups: 6 months</li>
            </ul>
            <p>
              Is this reasonable for typical production workloads, or should we extend retention periods? Particularly interested in compliance requirements and cost vs. risk tradeoffs.
            </p>
          </>
        ),
      },
      {
        id: '2',
        author: 'sysadmin_jane',
        timestamp: '2026-08-19T11:23:00Z',
        content: (
          <>
            <p className="mb-4">
              Depends heavily on your compliance requirements. If you're subject to GDPR, financial regulations, or similar frameworks, you may need longer retention or conversely must delete backups after a specific period.
            </p>
            <p>
              For general SaaS infrastructure without specific regulations, your policy looks reasonable. One suggestion: consider keeping at least one annual backup for disaster recovery scenarios where corruption went unnoticed for months.
            </p>
          </>
        ),
      },
      {
        id: '3',
        author: 'ops_team',
        timestamp: '2026-08-19T14:56:00Z',
        content: (
          <>
            <p className="mb-4">
              We use a similar scheme but tier backups by environment:
            </p>
            <ul className="list-none space-y-2 mb-4 text-sm">
              <li className="pl-4 border-l-2 border-foreground/20">
                <strong>Production:</strong> Daily 14d, Weekly 8w, Monthly 12m
              </li>
              <li className="pl-4 border-l-2 border-foreground/20">
                <strong>Staging:</strong> Daily 7d, Weekly 4w
              </li>
              <li className="pl-4 border-l-2 border-foreground/20">
                <strong>Development:</strong> Daily 3d
              </li>
            </ul>
            <p>
              This balances cost against actual recovery needs. Production gets extended retention because restoration windows are less predictable. Non-production environments have tighter limits since issues are caught faster.
            </p>
          </>
        ),
      },
      {
        id: '4',
        author: 'alex_m',
        timestamp: '2026-08-20T08:12:00Z',
        content: (
          <p>
            Don't forget to test restoration periodically. I've seen too many backup policies that look good on paper but fail when actually needed because restoration was never validated.
          </p>
        ),
      },
      {
        id: '5',
        author: 'infrastructure_admin',
        timestamp: '2026-08-20T09:47:00Z',
        content: (
          <p>
            Good point on restoration testing. We currently test quarterly—restore to isolated instance, verify data integrity, document time required. Probably should automate this rather than manual quarterly checks.
          </p>
        ),
      },
      {
        id: '6',
        author: 'network_ops',
        timestamp: '2026-08-20T11:34:00Z',
        content: (
          <>
            <p className="mb-4">
              Also consider backup location. Are you storing backups in the same region as production infrastructure?
            </p>
            <p>
              We learned this the hard way—regional outage took down both production and backups simultaneously. Now we replicate critical backups to a secondary region with 24hr delay.
            </p>
          </>
        ),
      },
      {
        id: '7',
        author: 'sysadmin_jane',
        timestamp: '2026-08-20T13:21:00Z',
        content: (
          <p>
            Cross-region replication is good practice but verify the cost model. Some providers charge significant egress fees for inter-region transfer. Make sure the added reliability justifies the expense.
          </p>
        ),
      },
      {
        id: '8',
        author: 'infrastructure_admin',
        timestamp: '2026-08-21T14:12:00Z',
        content: (
          <>
            <p className="mb-4">
              Thanks for the feedback. Planning to implement:
            </p>
            <ol className="list-decimal list-inside space-y-2 mb-4 text-sm">
              <li>Extend production monthly retention to 12 months</li>
              <li>Add annual backup kept for 3 years</li>
              <li>Implement automated restoration testing monthly</li>
              <li>Replicate critical system backups to secondary region</li>
            </ol>
            <p>
              Will update thread once we have this deployed.
            </p>
          </>
        ),
      },
    ],
  },
};

export function ForumThread() {
  const { category, threadId } = useParams<{ category: string; threadId: string }>();

  const threadData = threadId ? THREAD_DATA[threadId] : undefined;

  if (!threadData || threadData.category !== category) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-sm text-foreground/60">Thread not found.</p>
        <Link to="/resources/forum" className="text-sm underline hover:text-foreground/80 mt-4 inline-block">
          ← Back to forum
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{threadData.title} — Community Forum — VaultScope</title>
      </Helmet>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <Link
          to={`/resources/forum/${category}`}
          className="text-sm text-foreground/60 hover:text-foreground/80 mb-8 inline-block"
        >
          ← {category.charAt(0).toUpperCase() + category.slice(1)}
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-xl font-medium">
              {threadData.title}
            </h1>
            {threadData.status === 'solved' && (
              <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 border border-green-500/20">
                Solved
              </span>
            )}
            {threadData.status === 'locked' && (
              <span className="text-xs px-2 py-1 bg-foreground/5 text-foreground/40 border border-foreground/10">
                Locked
              </span>
            )}
          </div>
        </header>

        <div className="space-y-4">
          {threadData.posts.map((post, index) => (
            <div
              key={post.id}
              className={`
                border border-foreground/10 p-6
                ${post.isSolution ? 'bg-green-500/[0.02] border-green-500/20' : ''}
              `}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-medium">{post.author}</span>
                    {post.isOriginalPost && (
                      <span className="text-xs px-2 py-0.5 bg-foreground/5 text-foreground/40 border border-foreground/10">
                        Author
                      </span>
                    )}
                    {post.isSolution && (
                      <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20">
                        Solution
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-foreground/40">
                    {new Date(post.timestamp).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div className="text-xs text-foreground/40">
                  #{index + 1}
                </div>
              </div>

              <div className="text-sm text-foreground/80 leading-relaxed">
                {post.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
