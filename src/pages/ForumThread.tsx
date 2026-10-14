import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle2, 
  Lock, 
  FileQuestion 
} from 'lucide-react';

export interface ForumPost {
  id: string;
  author: string;
  timestamp: string;
  content: string;
  isOriginalPost?: boolean;
  isSolution?: boolean;
}

export interface ThreadDetail {
  id: string;
  title: string;
  category: string;
  status?: 'solved' | 'locked';
  posts: ForumPost[];
}

export function ForumThread() {
  const { category, threadId } = useParams<{ category: string; threadId: string }>();
  const [thread, setThread] = useState<ThreadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    if (!threadId) {
      setLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem(`vs_thread_${threadId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (!category || parsed.category === category)) {
          setThread(parsed);
          setLoading(false);
          return;
        }
      }

      // Check category threads if not in individual thread store
      if (category) {
        const catThreadsRaw = localStorage.getItem(`vs_forum_threads_${category}`);
        if (catThreadsRaw) {
          const catThreads = JSON.parse(catThreadsRaw);
          if (Array.isArray(catThreads)) {
            const found = catThreads.find(t => t.id === threadId);
            if (found) {
              const builtThread: ThreadDetail = {
                id: found.id,
                title: found.title,
                category: found.category,
                status: found.status,
                posts: [
                  {
                    id: '1',
                    author: found.author,
                    timestamp: found.timestamp,
                    isOriginalPost: true,
                    content: found.content || 'Discussion initiated.',
                  }
                ]
              };
              setThread(builtThread);
              setLoading(false);
              return;
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }

    setThread(null);
    setLoading(false);
  }, [category, threadId]);

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thread || !replyAuthor.trim() || !replyContent.trim()) return;

    const newPost: ForumPost = {
      id: Date.now().toString(),
      author: replyAuthor.trim(),
      timestamp: new Date().toISOString(),
      content: replyContent.trim(),
    };

    const updated: ThreadDetail = {
      ...thread,
      posts: [...thread.posts, newPost],
    };

    setThread(updated);

    try {
      localStorage.setItem(`vs_thread_${thread.id}`, JSON.stringify(updated));

      // Also update reply count in category threads
      if (category) {
        const catThreadsRaw = localStorage.getItem(`vs_forum_threads_${category}`);
        if (catThreadsRaw) {
          const catThreads = JSON.parse(catThreadsRaw);
          if (Array.isArray(catThreads)) {
            const idx = catThreads.findIndex(t => t.id === thread.id);
            if (idx !== -1) {
              catThreads[idx].replyCount = updated.posts.length - 1;
              catThreads[idx].lastActivity = newPost.timestamp;
              catThreads[idx].lastActivityAuthor = newPost.author;
              localStorage.setItem(`vs_forum_threads_${category}`, JSON.stringify(catThreads));
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }

    setReplyContent('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-28 lg:pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center font-mono text-xs text-foreground/40 space-y-3">
          <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto" />
          <p>Loading discussion...</p>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-28 lg:pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center border border-border rounded-xl bg-foreground/[0.01] space-y-4">
          <FileQuestion className="w-8 h-8 text-foreground/30 mx-auto" />
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-foreground">Discussion not found</h1>
            <p className="text-xs text-foreground/50 font-mono">
              The requested discussion thread could not be found or may have been archived.
            </p>
          </div>
          <Link
            to={category ? `/resources/forum/${category}` : '/resources/forum'}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-border text-xs font-mono rounded hover:bg-foreground/5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to {category ? category : 'forum'} channel</span>
          </Link>
        </div>
      </div>
    );
  }

  const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Forum';

  return (
    <>
      <Helmet>
        <title>{thread.title} — Community Forum — VaultScope</title>
        <meta name="description" content={`Community discussion: ${thread.title}`} />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground pt-28 lg:pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb navigation */}
          <Link
            to={`/resources/forum/${category}`}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-foreground/60 hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {categoryName} channel</span>
          </Link>

          {/* Thread header */}
          <header className="border-b border-border pb-8 mb-8 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-foreground/5 text-foreground/60 border border-border">
                {categoryName}
              </span>
              {thread.status === 'solved' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Solved
                </span>
              )}
              {thread.status === 'locked' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-foreground/5 text-foreground/40 border border-foreground/10">
                  <Lock className="w-3 h-3" />
                  Locked
                </span>
              )}
            </div>

            <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground leading-snug">
              {thread.title}
            </h1>
          </header>

          {/* Posts list */}
          <div className="space-y-6 mb-12">
            {thread.posts.map((post, index) => (
              <article
                key={post.id}
                className={`p-6 rounded-xl border transition-all ${
                  post.isSolution
                    ? 'border-emerald-500/30 bg-emerald-500/[0.02]'
                    : 'border-border bg-foreground/[0.01]'
                }`}
              >
                <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-border text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center font-semibold text-foreground">
                      {post.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{post.author}</span>
                        {post.isOriginalPost && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded border border-border bg-foreground/5 text-foreground/60">
                            Author
                          </span>
                        )}
                        {post.isSolution && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
                            Solution
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-foreground/40 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(post.timestamp).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <span className="text-foreground/30 font-mono">#{index + 1}</span>
                </div>

                <div className="text-sm text-foreground/80 leading-relaxed font-light whitespace-pre-wrap font-sans">
                  {post.content}
                </div>
              </article>
            ))}
          </div>

          {/* Reply composer */}
          {thread.status !== 'locked' ? (
            <div className="p-6 rounded-xl border border-border bg-foreground/[0.01] space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span>Post a Reply</span>
              </h3>

              <form onSubmit={handleAddReply} className="space-y-4">
                <div className="max-w-xs space-y-1">
                  <label className="text-xs font-mono text-foreground/60 block">Your Handle</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. dev_sarah"
                    value={replyAuthor}
                    onChange={(e) => setReplyAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs font-mono focus:outline-none focus:border-foreground/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-foreground/60 block">Message Content</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Contribute your insights or answer..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs font-mono focus:outline-none focus:border-foreground/40"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background font-mono text-xs font-medium hover:bg-foreground/90 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Reply</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-border bg-foreground/[0.01] text-xs font-mono text-foreground/50 text-center flex items-center justify-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              <span>This discussion is locked to new replies.</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
