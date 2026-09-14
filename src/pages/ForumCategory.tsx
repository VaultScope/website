import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface Thread {
  id: string;
  title: string;
  author: string;
  timestamp: string;
  replyCount: number;
  viewCount: number;
  lastActivity: string;
  lastActivityAuthor: string;
  status?: 'solved' | 'locked';
}

const THREADS: Record<string, Thread[]> = {
  infrastructure: [
    {
      id: 'ipv6-config-new-vps',
      title: 'IPv6 configuration on new VPS instances',
      author: 'alex_m',
      timestamp: '2026-08-20T11:23:00Z',
      replyCount: 7,
      viewCount: 142,
      lastActivity: '2026-08-22T09:34:00Z',
      lastActivityAuthor: 'infrastructure_admin',
      status: 'solved',
    },
    {
      id: 'latency-fra-ams',
      title: 'Measuring latency between DE-FRA-01 and NL-AMS-02',
      author: 'network_ops',
      timestamp: '2026-08-18T14:56:00Z',
      replyCount: 4,
      viewCount: 89,
      lastActivity: '2026-08-19T08:12:00Z',
      lastActivityAuthor: 'alex_m',
    },
  ],
  operations: [
    {
      id: 'backup-retention-policies',
      title: 'Best practices for backup retention policies',
      author: 'infrastructure_admin',
      timestamp: '2026-08-19T10:45:00Z',
      replyCount: 12,
      viewCount: 234,
      lastActivity: '2026-08-21T14:12:00Z',
      lastActivityAuthor: 'sysadmin_jane',
    },
    {
      id: 'monitoring-disk-io',
      title: 'Monitoring disk I/O on dedicated servers',
      author: 'ops_team',
      timestamp: '2026-08-17T09:21:00Z',
      replyCount: 6,
      viewCount: 156,
      lastActivity: '2026-08-18T16:34:00Z',
      lastActivityAuthor: 'infrastructure_admin',
      status: 'solved',
    },
  ],
};

const CATEGORY_INFO: Record<string, { name: string; description: string }> = {
  infrastructure: {
    name: 'Infrastructure',
    description: 'VPS, dedicated servers, networking, and deployment questions.',
  },
  operations: {
    name: 'Operations',
    description: 'Monitoring, automation, incident response, and operational procedures.',
  },
};

export function ForumCategory() {
  const { category } = useParams<{ category: string }>();
  const [searchQuery, setSearchQuery] = useState('');

  if (!category || !CATEGORY_INFO[category]) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-sm text-foreground/60">Category not found.</p>
        <Link to="/resources/forum" className="text-sm underline hover:text-foreground/80 mt-4 inline-block">
          ← Back to forum
        </Link>
      </div>
    );
  }

  const threads = THREADS[category] || [];
  const filteredThreads = threads.filter(thread =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryInfo = CATEGORY_INFO[category];

  return (
    <>
      <Helmet>
        <title>{categoryInfo.name} — Community Forum — VaultScope</title>
      </Helmet>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <Link to="/resources/forum" className="text-sm text-foreground/60 hover:text-foreground/80 mb-8 inline-block">
          ← Forum
        </Link>

        <div className="mb-12">
          <h1 className="text-2xl font-medium mb-2">{categoryInfo.name}</h1>
          <p className="text-sm text-foreground/60">
            {categoryInfo.description}
          </p>
        </div>

        <div className="mb-8">
          <label htmlFor="thread-search" className="sr-only">Search threads</label>
          <input
            id="thread-search"
            type="text"
            placeholder="Search threads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 bg-background border border-foreground/10 text-sm focus:outline-none focus:border-foreground/30"
          />
        </div>

        {filteredThreads.length === 0 ? (
          <div className="text-sm text-foreground/40 py-8">
            No threads found.
          </div>
        ) : (
          <div className="border border-foreground/10">
            {filteredThreads.map((thread, index) => (
              <Link
                key={thread.id}
                to={`/resources/forum/${category}/${thread.id}`}
                className={`
                  flex items-center gap-6 p-4 hover:bg-foreground/[0.02] transition-colors
                  ${index !== 0 ? 'border-t border-foreground/10' : ''}
                `}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium truncate">
                      {thread.title}
                    </h3>
                    {thread.status === 'solved' && (
                      <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20">
                        Solved
                      </span>
                    )}
                    {thread.status === 'locked' && (
                      <span className="text-xs px-2 py-0.5 bg-foreground/5 text-foreground/40 border border-foreground/10">
                        Locked
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-foreground/40">
                    Started by {thread.author} · {new Date(thread.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                <div className="text-right text-xs text-foreground/40 min-w-[140px]">
                  <div>{thread.replyCount} {thread.replyCount === 1 ? 'reply' : 'replies'}</div>
                  <div>{thread.viewCount} views</div>
                  <div className="mt-1 text-foreground/30">
                    Last: {thread.lastActivityAuthor}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
