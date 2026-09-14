import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  author: string;
  readTime: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'ipv6-deployment-considerations',
    title: 'IPv6 deployment considerations for infrastructure operators',
    excerpt: 'Technical requirements and operational considerations when migrating production infrastructure to IPv6-first addressing.',
    date: '2026-08-19',
    category: 'Infrastructure',
    author: 'VaultScope Engineering',
    readTime: '8 min',
  },
  {
    slug: 'incident-post-mortem-2026-08-12',
    title: 'Incident post-mortem: Network latency spike, 2026-08-12',
    excerpt: 'Root cause analysis of elevated network latency observed in DE-FRA-01 region on August 12, 2026. Impact, resolution timeline, and preventive measures.',
    date: '2026-08-14',
    category: 'Operations',
    author: 'VaultScope Operations',
    readTime: '12 min',
  },
];

export function BlogList() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = BLOG_POSTS.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Blog — VaultScope</title>
        <meta name="description" content="Infrastructure operations, technical updates, and incident post-mortems from VaultScope." />
      </Helmet>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-2xl font-medium mb-2">Blog</h1>
          <p className="text-sm text-foreground/60">
            Infrastructure operations, technical updates, and incident post-mortems.
          </p>
        </div>

        <div className="mb-8">
          <label htmlFor="blog-search" className="sr-only">Search articles</label>
          <input
            id="blog-search"
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 bg-background border border-foreground/10 text-sm focus:outline-none focus:border-foreground/30"
          />
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-sm text-foreground/40 py-8">
            No articles found.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/resources/blog/${post.slug}`}
                className="block border border-foreground/10 p-6 hover:border-foreground/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h2 className="text-base font-medium mb-2 hover:text-foreground/80">
                      {post.title}
                    </h2>
                    <p className="text-sm text-foreground/60 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-foreground/40">
                  <span>{post.category}</span>
                  <span>·</span>
                  <span>{new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                  <span>·</span>
                  <span>{post.author}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
