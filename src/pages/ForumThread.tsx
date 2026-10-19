import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LocaleLink } from '../i18n';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  MessageSquare,
  Send,
  Clock,
  CheckCircle2,
  Lock,
  FileQuestion,
} from 'lucide-react';
import { getStoredUsername, setStoredUsername } from '../lib/quickNav';

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
  const [replyAuthor, setReplyAuthor] = useState(() => getStoredUsername());
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    const storedUname = getStoredUsername();
    if (storedUname && !replyAuthor) {
      setReplyAuthor(storedUname);
    }
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

      if (category) {
        const catThreadsRaw = localStorage.getItem(`vs_forum_threads_${category}`);
        if (catThreadsRaw) {
          const catThreads = JSON.parse(catThreadsRaw);
          if (Array.isArray(catThreads)) {
            const found = catThreads.find((t) => t.id === threadId);
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
                  },
                ],
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
    const authorUsername = replyAuthor.trim() || getStoredUsername();
    if (!thread || !authorUsername || !replyContent.trim()) return;
    if (!getStoredUsername() && authorUsername) {
      setStoredUsername(authorUsername);
    }

    const newPost: ForumPost = {
      id: Date.now().toString(),
      author: authorUsername,
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

      if (category) {
        const catThreadsRaw = localStorage.getItem(`vs_forum_threads_${category}`);
        if (catThreadsRaw) {
          const catThreads = JSON.parse(catThreadsRaw);
          if (Array.isArray(catThreads)) {
            const idx = catThreads.findIndex((t) => t.id === thread.id);
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
      <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text)] pt-28 lg:pt-32 pb-24">
        <div className="vs-container py-20 text-center font-mono text-xs text-[var(--text-muted)]">
          Loading discussion...
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text)] pt-28 lg:pt-32 pb-24">
        <div className="vs-container">
          <div className="py-20 text-center border-t border-b border-[var(--line)] space-y-4">
            <FileQuestion className="w-6 h-6 text-[var(--text-faint)] mx-auto" />
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-[var(--text)]">Discussion not found</h1>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                The requested discussion thread could not be found or may have been archived.
              </p>
            </div>
            <LocaleLink
              to={category ? `/resources/forum/${category}` : '/resources/forum'}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-[var(--line)] text-xs font-mono hover:border-[var(--accent-bright)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to {category ? category : 'forum'} channel</span>
            </LocaleLink>
          </div>
        </div>
      </div>
    );
  }

  const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Forum';
  const participants = Array.from(new Set(thread.posts.map((p) => p.author)));

  return (
    <>
      <Helmet>
        <title>{thread.title} — Community Forum — VaultScope</title>
        <meta name="description" content={`Community discussion: ${thread.title}`} />
      </Helmet>

      <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text)] pt-28 lg:pt-32 pb-24">
        <div className="vs-container">
          <LocaleLink
            to={`/resources/forum/${category}`}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text)] mb-8 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {categoryName} channel</span>
          </LocaleLink>

          <header className="border-b border-[var(--line)] pb-8 mb-10 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono text-[var(--accent-bright)]">{categoryName}</span>
              {thread.status === 'solved' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-500 uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3" />
                  Solved
                </span>
              )}
              {thread.status === 'locked' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--text-faint)] uppercase tracking-wider">
                  <Lock className="w-3 h-3" />
                  Locked
                </span>
              )}
            </div>

            <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-[var(--text)] leading-snug max-w-[72ch]">
              {thread.title}
            </h1>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 min-w-0">
              {/* Posts list */}
              <div className="border-t border-b border-[var(--line)] divide-y divide-[var(--line)] mb-10">
                {thread.posts.map((post, index) => (
                  <article
                    key={post.id}
                    className={`py-6 transition-colors ${
                      post.isSolution ? 'pl-4 border-l-2 border-emerald-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 pb-3 mb-4 text-xs font-mono">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="font-semibold text-[var(--text)]">{post.author}</span>
                          {post.isOriginalPost && (
                            <span className="text-[10px] text-[var(--accent-bright)] uppercase tracking-wider">
                              Author
                            </span>
                          )}
                          {post.isSolution && (
                            <span className="text-[10px] text-emerald-500 uppercase tracking-wider">
                              Solution
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[var(--text-faint)] flex items-center gap-1">
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

                      <span className="text-[var(--text-faint)] font-mono">#{index + 1}</span>
                    </div>

                    <div className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap font-sans max-w-[75ch]">
                      {post.content}
                    </div>
                  </article>
                ))}
              </div>

              {/* Reply composer */}
              {thread.status !== 'locked' ? (
                <div className="pt-2 space-y-4">
                  <h3 className="text-sm font-semibold text-[var(--text)] flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[var(--accent-bright)]" />
                    <span>Post a Reply</span>
                  </h3>

                  <form onSubmit={handleAddReply} className="space-y-4">
                    <div className="max-w-xs space-y-1">
                      <label className="text-xs font-mono text-[var(--text-muted)] block">Username</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. dev_sarah"
                        value={replyAuthor}
                        onChange={(e) => setReplyAuthor(e.target.value)}
                        className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--line)] text-xs font-mono text-[var(--text)] focus:outline-none focus:border-[var(--accent-bright)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-[var(--text-muted)] block">Message Content</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Contribute your insights or answer..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--line)] text-xs font-mono text-[var(--text)] focus:outline-none focus:border-[var(--accent-bright)]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white font-mono text-xs font-medium hover:bg-[var(--accent-bright)] transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Reply</span>
                    </button>
                  </form>
                </div>
              ) : (
                <div className="py-4 border-t border-b border-[var(--line)] text-xs font-mono text-[var(--text-muted)] text-center flex items-center justify-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  <span>This discussion is locked to new replies.</span>
                </div>
              )}
            </div>

            {/* Right Sidebar: Thread Ledger & Guidelines */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 lg:border-l lg:border-[var(--line)] lg:pl-8 space-y-8">
              <div className="space-y-4">
                <div className="border-b border-[var(--line)] pb-3 flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent-bright)]">
                    Thread Metadata
                  </span>
                  <span className="text-[11px] font-mono text-[var(--text-faint)]">
                    #{thread.id.slice(0, 10)}
                  </span>
                </div>

                <dl className="space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-[var(--line)]/60 pb-2.5">
                    <dt className="font-mono text-[var(--text-faint)]">Channel</dt>
                    <dd className="font-mono text-[var(--accent-bright)]">/{category || 'forum'}</dd>
                  </div>
                  <div className="flex items-center justify-between border-b border-[var(--line)]/60 pb-2.5">
                    <dt className="font-mono text-[var(--text-faint)]">Total Posts</dt>
                    <dd className="font-mono text-[var(--text)] tabular-nums">{thread.posts.length}</dd>
                  </div>
                  <div className="flex items-center justify-between border-b border-[var(--line)]/60 pb-2.5">
                    <dt className="font-mono text-[var(--text-faint)]">Participants</dt>
                    <dd className="font-mono text-[var(--text)] tabular-nums">{participants.length} active</dd>
                  </div>
                  <div className="flex items-center justify-between pb-1">
                    <dt className="font-mono text-[var(--text-faint)]">Reply State</dt>
                    <dd className="font-mono text-[var(--text)]">
                      {thread.status === 'locked' ? 'Read-only' : 'Accepting replies'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="border-t border-[var(--line)] pt-6 space-y-2.5">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text)]">
                  Sanitization Reminder
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Redact private SSH keys, bearer tokens, and non-public management endpoints before posting configuration snippets or kernel logs.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
