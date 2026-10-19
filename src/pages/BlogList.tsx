import { useState, useEffect, useMemo } from 'react';
import { LocaleLink } from '../i18n';
import { SeoHead } from '../components/SeoHead';
import {
  Search,
  X,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Layers,
  Terminal,
  Server,
  HardDrive,
} from 'lucide-react';

import { api } from '../lib/api';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  image_url?: string;
  content: string;
  tags?: string[];
  published_at: string;
  category?: string;
  author_name?: string;
  author_username?: string;
  author_avatar?: string;
  author?: {
    name: string;
    role?: string;
    avatar?: string;
    username?: string;
  };
}

function calculateReadingTime(content: string): number {
  const words = content.replace(/<[^>]+>/g, '').trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 180));
}

function ArticleCoverFallback({ title, tags }: { title: string; tags?: string[] }) {
  const primaryTag = tags?.[0]?.toLowerCase() || 'cloud';

  const Icon = useMemo(() => {
    const t = (title + ' ' + (tags?.join(' ') || '')).toLowerCase();
    if (t.includes('sftp') || t.includes('storage') || t.includes('disk') || t.includes('ceph')) return HardDrive;
    if (t.includes('code') || t.includes('api') || t.includes('rust') || t.includes('linux')) return Terminal;
    if (t.includes('network') || t.includes('ipv6') || t.includes('switch') || t.includes('routing')) return Layers;
    return Server;
  }, [title, tags]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[var(--bg-elevated)] flex items-center justify-center p-6 select-none">
      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <div className="w-10 h-10 flex items-center justify-center text-[var(--accent-bright)]">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-xs font-mono text-[var(--accent-bright)]">#{primaryTag}</span>
      </div>
    </div>
  );
}

export function BlogList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<BlogPost[]>('/storefront/blog').catch(() => [] as BlogPost[]),
      api.get<string[]>('/storefront/blog/tags').catch(() => [] as string[]),
    ])
      .then(([postData, tagData]) => {
        const fetchedPosts = Array.isArray(postData) ? postData : [];
        setPosts(fetchedPosts);

        const validTagStrings = Array.isArray(tagData)
          ? tagData.filter((t): t is string => typeof t === 'string')
          : [];
        const tagSet = new Set<string>(validTagStrings);

        fetchedPosts.forEach((p) => {
          if (Array.isArray(p.tags)) {
            p.tags.forEach((t) => {
              if (typeof t === 'string' && t.trim()) tagSet.add(t.trim().toLowerCase());
            });
          }
        });
        setAvailableTags(Array.from(tagSet).sort());
      })
      .catch((err) => {
        console.error(err);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(q)) ||
        post.content.toLowerCase().includes(q) ||
        (Array.isArray(post.tags) && post.tags.some((t) => t.toLowerCase().includes(q)));

      const matchesTag = !selectedTag || (Array.isArray(post.tags) && post.tags.includes(selectedTag));

      return matchesSearch && matchesTag;
    });
  }, [posts, searchQuery, selectedTag]);

  const featuredPost = filteredPosts.length > 0 && !searchQuery && !selectedTag ? filteredPosts[0] : null;
  const gridPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  return (
    <>
      <SeoHead
        title="Engineering Blog & Technical Insights"
        description="Deep dives into cloud architecture, Rust backend development, Linux storage systems, and infrastructure automation."
        path="/resources/blog"
      />

      <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text)] pt-28 lg:pt-32 pb-24">
        <div className="vs-container">
          {/* Header */}
          <header className="pb-10 mb-10 space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[var(--text)]">
              News, Guides &amp; Updates
            </h1>
            <p className="text-base text-[var(--text-muted)] max-w-2xl leading-relaxed">
              Product updates, infrastructure tutorials, platform announcements, and articles from the VaultScope team.
            </p>
          </header>

          {/* Controls Bar: Search & Topic Filter */}
          <div className="space-y-4 mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Topic Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-3 py-1.5 text-xs font-mono transition-colors whitespace-nowrap cursor-pointer border ${
                    selectedTag === null
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)] font-medium'
                      : 'bg-transparent border-[var(--line)] text-[var(--text-muted)] hover:border-[var(--accent-bright)] hover:text-[var(--text)]'
                  }`}
                >
                  All Articles
                </button>
                {availableTags.map((tag) => {
                  const isActive = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(isActive ? null : tag)}
                      className={`px-3 py-1.5 text-xs font-mono transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                        isActive
                          ? 'bg-[var(--accent)] text-white border-[var(--accent)] font-medium'
                          : 'bg-transparent border-[var(--line)] text-[var(--text-muted)] hover:border-[var(--accent-bright)] hover:text-[var(--text)]'
                      }`}
                    >
                      <span>#{tag}</span>
                      {isActive && <span className="text-[10px] leading-none">&times;</span>}
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[var(--text-faint)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="blog-search"
                  type="text"
                  placeholder="Search articles & topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 bg-[var(--bg-surface)] border border-[var(--line)] text-xs font-mono text-[var(--text)] focus:outline-none focus:border-[var(--accent-bright)] transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-[var(--text)] p-0.5"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {selectedTag && (
              <div className="flex items-center gap-2 pt-1 text-xs font-mono text-[var(--text-muted)]">
                <span>Filtering by:</span>
                <span className="text-[var(--accent-bright)] font-medium">#{selectedTag}</span>
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-[var(--text)] hover:underline ml-1 cursor-pointer"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-20 text-center font-mono text-xs text-[var(--text-muted)]">
              Loading technical articles...
            </div>
          ) : posts.length === 0 ? (
            <div className="py-20 px-6 text-center space-y-6 max-w-2xl mx-auto">
              <div className="w-10 h-10 flex items-center justify-center text-[var(--accent-bright)] mx-auto">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-[var(--text)]">No Articles Published Yet</h3>
                <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
                  Our systems engineering team is authoring articles on bare-metal automation, storage clusters, and high-throughput networking.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <LocaleLink
                  to="/docs"
                  className="px-4 py-2 border border-[var(--line)] text-xs font-mono text-[var(--text)] hover:border-[var(--accent-bright)] transition-colors"
                >
                  Explore Documentation
                </LocaleLink>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-20 px-6 text-center space-y-4">
              <BookOpen className="w-6 h-6 text-[var(--text-faint)] mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-[var(--text)]">No matching articles found</h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  No published stories matched {searchQuery ? `"${searchQuery}"` : selectedTag ? `tag #${selectedTag}` : 'the selected criteria'}.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag(null);
                }}
                className="px-4 py-2 border border-[var(--line)] text-xs font-mono hover:border-[var(--accent-bright)] transition-colors cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Featured Article */}
              {featuredPost && (
                <div className="py-8 group">
                  <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-center">
                    <div className="md:col-span-6 relative aspect-[16/10] overflow-hidden bg-[var(--bg-elevated)]">
                      {featuredPost.image_url ? (
                        <img
                          src={featuredPost.image_url}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ArticleCoverFallback title={featuredPost.title} tags={featuredPost.tags} />
                      )}
                    </div>

                    <div className="md:col-span-6 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs font-mono text-[var(--accent-bright)]">Featured Dispatch</span>
                          <span className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1.5 tabular-nums">
                            <Clock className="w-3.5 h-3.5 text-[var(--text-faint)]" />
                            {calculateReadingTime(featuredPost.content)} min read
                          </span>
                          <span className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1.5 tabular-nums">
                            <Calendar className="w-3.5 h-3.5 text-[var(--text-faint)]" />
                            {new Date(featuredPost.published_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        <LocaleLink to={`/resources/blog/${featuredPost.slug}`}>
                          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent-bright)] transition-colors leading-snug">
                            {featuredPost.title}
                          </h2>
                        </LocaleLink>

                        <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3">
                          {featuredPost.excerpt || featuredPost.content.replace(/<[^>]+>/g, '').slice(0, 240) + '...'}
                        </p>

                        {featuredPost.tags && featuredPost.tags.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {featuredPost.tags.map((tag) => (
                              <button
                                key={tag}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSelectedTag(selectedTag === tag ? null : tag);
                                }}
                                className="text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--accent-bright)] transition-colors cursor-pointer"
                              >
                                #{tag}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <span className="text-xs font-semibold block text-[var(--text)]">
                            {featuredPost.author?.name ||
                              featuredPost.author_name ||
                              (featuredPost.author_username ? `@${featuredPost.author_username}` : 'VaultScope Team')}
                          </span>
                          <span className="text-[11px] text-[var(--text-faint)] font-mono">
                            {featuredPost.author?.role ||
                              (featuredPost.author_username
                                ? `Published by @${featuredPost.author_username}`
                                : 'VaultScope Author')}
                          </span>
                        </div>

                        <LocaleLink
                          to={`/resources/blog/${featuredPost.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[var(--accent-bright)] hover:underline group/link"
                        >
                          <span>Read full article</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                        </LocaleLink>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid of Remaining Articles */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 not-prose">
                {gridPosts.map((post) => {
                  const readTime = calculateReadingTime(post.content);

                  return (
                    <article
                      key={post.id}
                      className="pt-2 transition-colors flex flex-col justify-between group overflow-hidden"
                    >
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--bg-elevated)] mb-5">
                        {post.image_url ? (
                          <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                        ) : (
                          <ArticleCoverFallback title={post.title} tags={post.tags} />
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] tabular-nums">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[var(--text-faint)]" />
                              {new Date(post.published_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[var(--text-faint)]" />
                              {readTime} min read
                            </span>
                          </div>

                          <LocaleLink to={`/resources/blog/${post.slug}`} className="block">
                            <h3 className="text-base font-semibold text-[var(--text)] group-hover:text-[var(--accent-bright)] transition-colors leading-snug line-clamp-2">
                              {post.title}
                            </h3>
                          </LocaleLink>

                          <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3">
                            {post.excerpt || post.content.replace(/<[^>]+>/g, '').slice(0, 160) + '...'}
                          </p>

                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              {post.tags.map((tag) => (
                                <button
                                  key={tag}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSelectedTag(selectedTag === tag ? null : tag);
                                  }}
                                  className="text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--accent-bright)] transition-colors cursor-pointer"
                                >
                                  #{tag}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="pt-4 flex items-center justify-between text-xs">
                          <span className="text-[11px] font-mono text-[var(--text-muted)] truncate max-w-[140px]">
                            {post.author?.name ||
                              post.author_name ||
                              (post.author_username ? `@${post.author_username}` : 'VaultScope Team')}
                          </span>

                          <LocaleLink
                            to={`/resources/blog/${post.slug}`}
                            className="text-[var(--accent-bright)] hover:underline flex items-center gap-1 font-medium font-mono text-xs group/link"
                          >
                            <span>Read</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                          </LocaleLink>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom SRE & Status Banner */}
          <div className="mt-20 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-[var(--text)]">
                Transparent Infrastructure &amp; SRE Dispatches
              </h3>
              <p className="text-xs text-[var(--text-muted)] max-w-xl leading-relaxed">
                Post-mortems and architecture updates are published transparently whenever network or datacenter events occur. Subscribe to status dispatches or inspect real-time metrics.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <LocaleLink
                to="/docs"
                className="px-4 py-2 border border-[var(--line)] text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent-bright)] transition-colors"
              >
                Docs
              </LocaleLink>
              <a
                href="https://status.vaultscope.de/status/vs"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[var(--accent)] text-white font-mono text-xs font-medium hover:bg-[var(--accent-bright)] transition-colors"
              >
                Live Status Portal &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
