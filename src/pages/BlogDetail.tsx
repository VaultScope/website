import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SeoHead } from '../components/SeoHead';
import { marked } from 'marked';
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

    api.get<BlogArticle>(`/storefront/blog/${slug}`)
      .then(res => {
        setArticle(res);
      })
      .catch(err => {
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
      <SeoHead
        title={article.title}
        description={article.excerpt || (article.content ? article.content.substring(0, 160).replace(/[#*`\n]/g, ' ') : undefined)}
        path={`/resources/blog/${article.slug}`}
        image={article.image_url}
        type="article"
        publishedTime={article.published_at}
        author={article.author?.name || article.author_name}
      />

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
                {article.category && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-blue-500/10 text-blue-500 border border-blue-500/20 font-medium">
                    {article.category}
                  </span>
                )}
                {article.tags?.map(tag => (
                  <span key={tag} className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-foreground/[0.04] text-foreground/70 border border-border">
                    #{tag}
                  </span>
                ))}
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
                <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-mono font-bold text-xs text-blue-500 shadow-inner shrink-0">
                  {(article.author?.name || article.author_name || article.author_username || 'V').charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="text-xs font-semibold block text-foreground">
                    {article.author?.name || article.author_name || (article.author_username ? `@${article.author_username}` : 'VaultScope Team')}
                  </span>
                  <span className="text-[11px] text-foreground/50 font-mono">
                    {article.author?.role || (article.author_username ? `Published by @${article.author_username}` : 'VaultScope Author')}
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
              className="markdown-preview max-w-none text-foreground/80 leading-relaxed text-sm sm:text-base"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {/* Article Footer */}
            <footer className="pt-10 border-t border-border space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl border border-border bg-foreground/[0.01]">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-foreground">Questions or feedback regarding this article?</h4>
                  <p className="text-xs text-foreground/60">
                    Reach out to our team directly via support tickets or join the community discussion.
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
