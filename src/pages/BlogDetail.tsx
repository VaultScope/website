import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { LocaleLink } from '../i18n';
import { SeoHead } from '../components/SeoHead';
import { marked } from 'marked';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Check,
  Copy,
  BookOpen,
} from 'lucide-react';
import { api } from '../lib/api';

export interface BlogArticle {
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

    api
      .get<BlogArticle>(`/storefront/blog/${slug}`)
      .then((res) => {
        setArticle(res);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const contentHtml = useMemo(() => {
    if (!article?.content) return '';
    return marked.parse(article.content) as string;
  }, [article?.content]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text)] pt-28 lg:pt-32 pb-24">
        <div className="vs-container py-20 text-center font-mono text-xs text-[var(--text-muted)]">
          Loading article...
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text)] pt-28 lg:pt-32 pb-24">
        <div className="vs-container">
          <div className="py-20 text-center space-y-4">
            <BookOpen className="w-6 h-6 text-[var(--text-faint)] mx-auto" />
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-[var(--text)]">Article not found.</h1>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                The requested article may have been unpublished or moved.
              </p>
            </div>
            <LocaleLink
              to="/resources/blog"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-[var(--line)] text-xs font-mono hover:border-[var(--accent-bright)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to blog overview</span>
            </LocaleLink>
          </div>
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(article.content);
  const authorDisplay =
    article.author?.name ||
    article.author_name ||
    (article.author_username ? `@${article.author_username}` : 'VaultScope Team');
  const authorRoleDisplay =
    article.author?.role ||
    (article.author_username ? `Published by @${article.author_username}` : 'VaultScope Author');
  const publishedDateFormatted = new Date(article.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <SeoHead
        title={article.title}
        description={
          article.excerpt ||
          (article.content ? article.content.substring(0, 160).replace(/[#*`\n]/g, ' ') : undefined)
        }
        path={`/resources/blog/${article.slug}`}
        image={article.image_url}
        type="article"
        publishedTime={article.published_at}
        author={article.author?.name || article.author_name}
      />

      <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text)] pt-28 lg:pt-32 pb-24">
        <div className="vs-container">
          <div className="mb-10 flex items-center justify-between">
            <LocaleLink
              to="/resources/blog"
              className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text)] transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to blog</span>
            </LocaleLink>

            <button
              onClick={copyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[var(--line)] text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent-bright)] transition-colors cursor-pointer"
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <article className="lg:col-span-8 space-y-10 min-w-0">
              <header className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  {article.category && (
                    <span className="text-xs font-mono text-[var(--accent-bright)]">
                      {article.category}
                    </span>
                  )}
                  {article.tags?.map((tag) => (
                    <span key={tag} className="text-[11px] font-mono text-[var(--text-muted)]">
                      #{tag}
                    </span>
                  ))}
                  <span className="text-[11px] font-mono text-[var(--text-faint)] flex items-center gap-1.5 tabular-nums">
                    <Clock className="w-3 h-3" />
                    {readingTime} min read
                  </span>
                  <span className="text-[11px] font-mono text-[var(--text-faint)] flex items-center gap-1.5 tabular-nums">
                    <Calendar className="w-3 h-3" />
                    {publishedDateFormatted}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[var(--text)] leading-tight">
                  {article.title}
                </h1>

                {article.excerpt && (
                  <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-[70ch]">
                    {article.excerpt}
                  </p>
                )}

                <div className="pt-2 lg:hidden">
                  <span className="text-xs font-semibold block text-[var(--text)]">
                    {authorDisplay}
                  </span>
                  <span className="text-[11px] text-[var(--text-faint)] font-mono">
                    {authorRoleDisplay}
                  </span>
                </div>

                {article.image_url && (
                  <div className="mt-6 w-full h-64 sm:h-96 overflow-hidden">
                    <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </header>

              <div
                className="markdown-preview max-w-none text-[var(--text-muted)] leading-relaxed text-sm sm:text-base [&_p]:max-w-[75ch] [&_li]:max-w-[75ch]"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              <footer className="pt-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-[var(--text)]">
                      Questions or feedback regarding this article?
                    </h4>
                    <p className="text-xs text-[var(--text-muted)]">
                      Reach out to our team directly via support tickets or join the community discussion.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <LocaleLink
                      to="/docs"
                      className="px-3.5 py-2 border border-[var(--line)] text-xs font-mono hover:border-[var(--accent-bright)] transition-colors"
                    >
                      Documentation
                    </LocaleLink>
                    <LocaleLink
                      to="/dashboard/support"
                      className="px-3.5 py-2 bg-[var(--accent)] text-white font-mono text-xs font-medium hover:bg-[var(--accent-bright)] transition-colors"
                    >
                      Contact SRE
                    </LocaleLink>
                  </div>
                </div>
              </footer>
            </article>

            {/* Right Sidebar: Dispatch Metadata Ledger */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 lg:pl-8 space-y-10">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent-bright)]">
                    Dispatch Metadata
                  </span>
                  <span className="text-[11px] font-mono text-[var(--text-faint)]">
                    #{article.slug.slice(0, 14)}
                  </span>
                </div>

                <dl className="space-y-3.5 text-xs">
                  <div className="flex items-start justify-between gap-4 pb-2">
                    <dt className="font-mono text-[var(--text-faint)]">Author</dt>
                    <dd className="text-right">
                      <span className="font-semibold text-[var(--text)] block">{authorDisplay}</span>
                      <span className="text-[11px] font-mono text-[var(--text-muted)]">{authorRoleDisplay}</span>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 pb-2">
                    <dt className="font-mono text-[var(--text-faint)]">Published</dt>
                    <dd className="font-mono text-[var(--text)] tabular-nums">{publishedDateFormatted}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 pb-2">
                    <dt className="font-mono text-[var(--text-faint)]">Reading Time</dt>
                    <dd className="font-mono text-[var(--text)] tabular-nums">{readingTime} min read</dd>
                  </div>
                  {article.category && (
                    <div className="flex items-center justify-between gap-4 pb-2">
                      <dt className="font-mono text-[var(--text-faint)]">Category</dt>
                      <dd className="font-mono text-[var(--accent-bright)]">{article.category}</dd>
                    </div>
                  )}
                </dl>

                {article.tags && article.tags.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-mono text-[var(--text-faint)] block">Topics</span>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-mono text-[var(--text-muted)]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text)]">
                  Related Infrastructure
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Explore technical reference documentation or provision dedicated compute and SFTP storage directly.
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <LocaleLink
                    to="/docs"
                    className="px-3.5 py-2 border border-[var(--line)] text-xs font-mono text-[var(--text)] hover:border-[var(--accent-bright)] transition-colors text-center"
                  >
                    System Documentation &rarr;
                  </LocaleLink>
                  <LocaleLink
                    to="/infrastructure"
                    className="px-3.5 py-2 border border-[var(--line)] text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--line-strong)] transition-colors text-center"
                  >
                    Browse Infrastructure Catalog
                  </LocaleLink>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
