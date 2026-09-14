import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface ForumCategory {
  slug: string;
  name: string;
  description: string;
  threadCount: number;
  postCount: number;
  latestThread?: {
    title: string;
    author: string;
    timestamp: string;
  };
}

const CATEGORIES: ForumCategory[] = [
  {
    slug: 'infrastructure',
    name: 'Infrastructure',
    description: 'VPS, dedicated servers, networking, and deployment questions.',
    threadCount: 47,
    postCount: 312,
    latestThread: {
      title: 'IPv6 configuration on new VPS instances',
      author: 'alex_m',
      timestamp: '2026-08-22T09:34:00Z',
    },
  },
  {
    slug: 'operations',
    name: 'Operations',
    description: 'Monitoring, automation, incident response, and operational procedures.',
    threadCount: 28,
    postCount: 184,
    latestThread: {
      title: 'Best practices for backup retention policies',
      author: 'infrastructure_admin',
      timestamp: '2026-08-21T14:12:00Z',
    },
  },
];

export function ForumList() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = CATEGORIES.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Community Forum — VaultScope</title>
        <meta name="description" content="Technical discussions, infrastructure questions, and operational knowledge sharing." />
      </Helmet>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-2xl font-medium mb-2">Community Forum</h1>
          <p className="text-sm text-foreground/60">
            Technical discussions, infrastructure questions, and operational knowledge sharing.
          </p>
        </div>

        <div className="mb-8">
          <label htmlFor="forum-search" className="sr-only">Search categories</label>
          <input
            id="forum-search"
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 bg-background border border-foreground/10 text-sm focus:outline-none focus:border-foreground/30"
          />
        </div>

        {filteredCategories.length === 0 ? (
          <div className="text-sm text-foreground/40 py-8">
            No categories found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCategories.map((category) => (
              <Link
                key={category.slug}
                to={`/resources/forum/${category.slug}`}
                className="block border border-foreground/10 p-6 hover:border-foreground/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h2 className="text-base font-medium mb-2">
                      {category.name}
                    </h2>
                    <p className="text-sm text-foreground/60">
                      {category.description}
                    </p>
                  </div>
                  <div className="text-right text-xs text-foreground/40 min-w-[80px]">
                    <div>{category.threadCount} threads</div>
                    <div>{category.postCount} posts</div>
                  </div>
                </div>

                {category.latestThread && (
                  <div className="text-xs text-foreground/40 pt-4 border-t border-foreground/5">
                    Latest: <span className="text-foreground/60">{category.latestThread.title}</span>
                    {' · '}
                    {category.latestThread.author}
                    {' · '}
                    {new Date(category.latestThread.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
