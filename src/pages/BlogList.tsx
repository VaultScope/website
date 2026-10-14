import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SeoHead } from '../components/SeoHead';
import { 
  Search, 
  X, 
  Calendar, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Terminal,
  Server,
  HardDrive
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

// Procedural visual cover placeholder for articles without custom image_url
function ArticleCoverFallback({ title, tags }: { title: string; tags?: string[] }) {
  const primaryTag = tags?.[0]?.toLowerCase() || 'cloud';
  
  // Pick icon based on tag / title keywords
  const Icon = useMemo(() => {
    const t = (title + ' ' + (tags?.join(' ') || '')).toLowerCase();
    if (t.includes('sftp') || t.includes('storage') || t.includes('disk') || t.includes('ceph')) return HardDrive;
    if (t.includes('code') || t.includes('api') || t.includes('rust') || t.includes('linux')) return Terminal;
    if (t.includes('network') || t.includes('ipv6') || t.includes('switch') || t.includes('routing')) return Layers;
    return Server;
  }, [title, tags]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/60 flex items-center justify-center p-6 select-none border-b border-border/40">
      {/* Decorative Grid Lines */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Ambient Radial Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Center Icon & Graphic */}
      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-blue-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-[11px] font-mono tracking-wider uppercase text-blue-300/80 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
          #{primaryTag}
        </span>
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

        fetchedPosts.forEach(p => {
          if (Array.isArray(p.tags)) {
            p.tags.forEach(t => {
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
    return posts.filter(post => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        post.title.toLowerCase().includes(q) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(q)) ||
        post.content.toLowerCase().includes(q) ||
        (Array.isArray(post.tags) && post.tags.some(t => t.toLowerCase().includes(q)));
      
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

      <div className="min-h-screen bg-background text-foreground pt-28 lg:pt-32 pb-24 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[320px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Header Banner */}
          <div className="border-b border-border/80 pb-10 mb-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/60 backdrop-blur-sm text-xs font-mono text-muted-foreground shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>VaultScope Blog & Announcements</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              News, Guides & Updates
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
              Product updates, infrastructure tutorials, platform announcements, and articles from the VaultScope team.
            </p>
          </div>

          {/* Controls Bar: Search & Tag Filter Pills */}
          <div className="space-y-4 mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Tag / Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                    selectedTag === null
                      ? 'bg-foreground text-background font-semibold shadow-sm'
                      : 'bg-card border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                  }`}
                >
                  All Articles
                </button>
                {availableTags.map(tag => {
                  const isActive = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(isActive ? null : tag)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-blue-600 text-white font-medium shadow-sm'
                          : 'bg-card border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
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
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="blog-search"
                  type="text"
                  placeholder="Search articles & topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 bg-card border border-border rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Active Tag Indicator / Reset */}
            {selectedTag && (
              <div className="flex items-center gap-2 pt-1 text-xs font-mono text-muted-foreground">
                <span>Filtering by:</span>
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded font-medium">
                  #{selectedTag}
                </span>
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-blue-500 hover:underline ml-1 cursor-pointer"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-24 text-muted-foreground font-mono text-sm space-y-4">
              <div className="w-7 h-7 border-2 border-border border-t-foreground rounded-full animate-spin mx-auto" />
              <p>Loading technical articles...</p>
            </div>
          ) : posts.length === 0 ? (
            /* Global Zero State */
            <div className="text-center py-20 px-6 border border-border rounded-2xl bg-card/60 backdrop-blur-sm shadow-sm space-y-6 max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mx-auto shadow-inner">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">Dispatches in Progress</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Our systems engineering team is currently authoring deep dives into bare metal automation, storage clusters, and high-throughput networking.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/docs"
                  className="px-4 py-2 bg-foreground text-background font-mono text-xs font-semibold rounded-lg hover:bg-foreground/90 transition-colors shadow-sm"
                >
                  Explore Documentation
                </Link>
                <a
                  href="https://status.vaultscope.de/status/vs"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 border border-border text-xs font-mono text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                >
                  Platform Status &rarr;
                </a>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            /* Filter Search Zero State */
            <div className="text-center py-20 px-6 border border-border rounded-2xl bg-card/60 backdrop-blur-sm shadow-sm space-y-4">
              <BookOpen className="w-8 h-8 text-muted-foreground/50 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground">No matching articles found</h3>
                <p className="text-xs text-muted-foreground font-mono">
                  No published stories matched {searchQuery ? `"${searchQuery}"` : selectedTag ? `tag #${selectedTag}` : 'the selected criteria'}.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag(null);
                }}
                className="px-4 py-2 border border-border text-xs font-mono rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Featured Magazine Hero Article */}
              {featuredPost && (
                <div className="border border-border/80 rounded-2xl overflow-hidden bg-card hover:border-foreground/30 hover:shadow-xl dark:hover:shadow-blue-500/5 transition-all duration-300 group">
                  <div className="grid md:grid-cols-12 gap-0">
                    {/* Hero Cover Image / Visual */}
                    <div className="md:col-span-6 relative aspect-[16/10] md:aspect-auto overflow-hidden bg-muted/20">
                      {featuredPost.image_url ? (
                        <img 
                          src={featuredPost.image_url} 
                          alt={featuredPost.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                        />
                      ) : (
                        <ArticleCoverFallback title={featuredPost.title} tags={featuredPost.tags} />
                      )}
                    </div>

                    {/* Hero Content */}
                    <div className="p-8 md:p-10 md:col-span-6 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-blue-500/10 text-blue-500 border border-blue-500/20 font-medium">
                            Featured Article
                          </span>
                          <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
                            {calculateReadingTime(featuredPost.content)} min read
                          </span>
                          <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                            {new Date(featuredPost.published_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        <Link to={`/resources/blog/${featuredPost.slug}`}>
                          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground group-hover:text-blue-500 transition-colors leading-snug">
                            {featuredPost.title}
                          </h2>
                        </Link>

                        <p className="text-sm text-muted-foreground font-normal leading-relaxed line-clamp-3">
                          {featuredPost.excerpt || featuredPost.content.replace(/<[^>]+>/g, '').slice(0, 240) + '...'}
                        </p>

                        {/* Tag Chips */}
                        {featuredPost.tags && featuredPost.tags.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {featuredPost.tags.map(tag => (
                              <button
                                key={tag}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSelectedTag(selectedTag === tag ? null : tag);
                                }}
                                className={`px-2 py-0.5 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                                  selectedTag === tag
                                    ? 'bg-blue-600 text-white font-medium'
                                    : 'bg-muted/50 text-muted-foreground border border-border/60 hover:text-foreground hover:border-foreground/30'
                                }`}
                              >
                                #{tag}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-6 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-mono font-bold text-xs text-blue-500 shadow-inner shrink-0">
                            {(featuredPost.author?.name || featuredPost.author_name || featuredPost.author_username || 'V').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-xs font-semibold block text-foreground">
                              {featuredPost.author?.name || featuredPost.author_name || (featuredPost.author_username ? `@${featuredPost.author_username}` : 'VaultScope Team')}
                            </span>
                            <span className="text-[11px] text-muted-foreground font-mono">
                              {featuredPost.author?.role || (featuredPost.author_username ? `Published by @${featuredPost.author_username}` : 'VaultScope Author')}
                            </span>
                          </div>
                        </div>

                        <Link
                          to={`/resources/blog/${featuredPost.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-blue-500 hover:text-blue-400 group/link"
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
                  const readTime = calculateReadingTime(post.content);

                  return (
                    <article
                      key={post.id}
                      className="rounded-2xl border border-border/80 bg-card hover:border-foreground/30 hover:shadow-xl dark:hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between group overflow-hidden"
                    >
                      {/* Thumbnail Container */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/20">
                        {post.image_url ? (
                          <img 
                            src={post.image_url} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                          />
                        ) : (
                          <ArticleCoverFallback title={post.title} tags={post.tags} />
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-muted-foreground/70" />
                              {new Date(post.published_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-muted-foreground/70" />
                              {readTime} min read
                            </span>
                          </div>

                          <Link to={`/resources/blog/${post.slug}`} className="block">
                            <h3 className="text-base font-bold text-foreground group-hover:text-blue-500 transition-colors leading-snug line-clamp-2">
                              {post.title}
                            </h3>
                          </Link>

                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                            {post.excerpt || post.content.replace(/<[^>]+>/g, '').slice(0, 160) + '...'}
                          </p>

                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1 pt-1">
                              {post.tags.map(tag => (
                                <button
                                  key={tag}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSelectedTag(selectedTag === tag ? null : tag);
                                  }}
                                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                                    selectedTag === tag
                                      ? 'bg-blue-600 text-white font-medium'
                                      : 'bg-muted/50 text-muted-foreground border border-border/60 hover:text-foreground hover:border-foreground/30'
                                  }`}
                                >
                                  #{tag}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Card Footer */}
                        <div className="pt-4 border-t border-border/80 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-[10px] text-blue-500 shrink-0">
                              {(post.author?.name || post.author_name || post.author_username || 'V').charAt(0).toUpperCase()}
                            </div>
                            <span className="text-[11px] text-muted-foreground truncate max-w-[130px]">
                              {post.author?.name || post.author_name || (post.author_username ? `@${post.author_username}` : 'VaultScope Team')}
                            </span>
                          </div>

                          <Link
                            to={`/resources/blog/${post.slug}`}
                            className="text-blue-500 hover:text-blue-400 flex items-center gap-1 font-medium font-mono text-xs group/link"
                          >
                            <span>Read</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom SRE & Status Banner */}
          <div className="mt-20 p-8 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <h3 className="text-base font-semibold text-foreground">Transparent Infrastructure & SRE Dispatches</h3>
              </div>
              <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                Post-mortems and architecture updates are published transparently whenever network or datacenter events occur. Subscribe to status dispatches or inspect real-time metrics.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/docs"
                className="px-4 py-2 border border-border text-xs font-mono text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              >
                Docs
              </Link>
              <a
                href="https://status.vaultscope.de/status/vs"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-foreground text-background font-mono text-xs font-semibold rounded-lg hover:bg-foreground/90 transition-colors shadow-sm"
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
