import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LocaleLink } from '../i18n';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  MessageSquare,
  Plus,
  Search,
  X,
  Clock,
  User,
  CheckCircle2,
  Lock,
  Send,
  FileQuestion,
} from 'lucide-react';
import { getStoredUsername, setStoredUsername } from '../lib/quickNav';

export interface Thread {
  id: string;
  category: string;
  title: string;
  author: string;
  timestamp: string;
  replyCount: number;
  viewCount: number;
  lastActivity: string;
  lastActivityAuthor: string;
  status?: 'solved' | 'locked';
  content?: string;
}

export const CATEGORY_INFO: Record<string, { name: string; description: string; topics: string[] }> = {
  infrastructure: {
    name: 'Infrastructure',
    description: 'Cloud VPS, dedicated servers, hypervisors, KVM tuning, and deployment questions.',
    topics: ['Cloud VPS', 'Bare Metal', 'KVM', 'Kernel Tuning'],
  },
  storage: {
    name: 'Storage Protocols',
    description: 'Sovereign SFTP, Ceph distributed clusters, ZFS storage pools, and backup workflows.',
    topics: ['SFTP', 'Ceph', 'ZFS', 'Snapshots', 'POSIX Quotas'],
  },
  networking: {
    name: 'Networking & Routing',
    description: 'BGP peering, IPv6 dual-stack allocation, DE-CIX Frankfurt, WireGuard, and transit routes.',
    topics: ['BGP Peering', 'IPv6 /64', 'DE-CIX', 'Anycast', 'WireGuard'],
  },
  operations: {
    name: 'Operations & SRE',
    description: 'Monitoring, Prometheus telemetry, backup retention, incident procedures, and automation.',
    topics: ['Prometheus', 'Grafana', 'Backup Retention', 'SRE'],
  },
  security: {
    name: 'Security & Compliance',
    description: 'GoBD audit trails, GDPR data protection, EU infrastructure sovereignty, and zero-trust access.',
    topics: ['GoBD', 'GDPR', 'Audit Logging', 'SSH Keys'],
  },
  automation: {
    name: 'API & Automation',
    description: 'Storefront REST API, Terraform provider, infrastructure-as-code, and webhook events.',
    topics: ['REST API', 'Terraform', 'Webhooks', 'CLI'],
  },
  feedback: {
    name: 'Community Feedback & RFCs',
    description: 'Feature requests, platform proposals, developer suggestions, and roadmap ideas.',
    topics: ['Feature Requests', 'Roadmap', 'RFCs'],
  },
};

function getStoredThreads(category: string): Thread[] {
  try {
    const raw = localStorage.getItem(`vs_forum_threads_${category}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

function saveStoredThreads(category: string, threads: Thread[]) {
  try {
    localStorage.setItem(`vs_forum_threads_${category}`, JSON.stringify(threads));
  } catch (e) {
    console.error(e);
  }
}

export function ForumCategory() {
  const { category } = useParams<{ category: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState(() => getStoredUsername());
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    if (category) {
      setThreads(getStoredThreads(category));
    }
    const storedUname = getStoredUsername();
    if (storedUname) {
      setNewAuthor((prev) => prev || storedUname);
    }
  }, [category]);

  if (!category || !CATEGORY_INFO[category]) {
    return (
      <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text)] pt-28 lg:pt-32 pb-24">
        <div className="vs-container">
          <div className="py-20 text-center border-t border-b border-[var(--line)] space-y-4">
            <FileQuestion className="w-6 h-6 text-[var(--text-faint)] mx-auto" />
            <h1 className="text-xl font-semibold text-[var(--text)]">Category not found</h1>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              The requested forum category does not exist or has been relocated.
            </p>
            <LocaleLink
              to="/resources/forum"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-[var(--line)] text-xs font-mono hover:border-[var(--accent-bright)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to forum overview</span>
            </LocaleLink>
          </div>
        </div>
      </div>
    );
  }

  const categoryInfo = CATEGORY_INFO[category];

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    const authorUsername = newAuthor.trim() || getStoredUsername();
    if (!newTitle.trim() || !authorUsername || !newContent.trim()) return;
    if (!getStoredUsername() && authorUsername) {
      setStoredUsername(authorUsername);
    }

    const threadId =
      newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') +
      '-' +
      Date.now().toString().slice(-4);

    const now = new Date().toISOString();
    const createdThread: Thread = {
      id: threadId,
      category,
      title: newTitle.trim(),
      author: authorUsername,
      timestamp: now,
      replyCount: 0,
      viewCount: 1,
      lastActivity: now,
      lastActivityAuthor: authorUsername,
      content: newContent.trim(),
    };

    const updated = [createdThread, ...threads];
    setThreads(updated);
    saveStoredThreads(category, updated);

    try {
      localStorage.setItem(
        `vs_thread_${threadId}`,
        JSON.stringify({
          id: threadId,
          title: createdThread.title,
          category,
          posts: [
            {
              id: '1',
              author: createdThread.author,
              timestamp: now,
              isOriginalPost: true,
              content: newContent.trim(),
            },
          ],
        })
      );
    } catch (err) {
      console.error(err);
    }

    setNewTitle('');
    setNewAuthor(getStoredUsername());
    setNewContent('');
    setShowNewThreadModal(false);
  };

  const filteredThreads = threads.filter((thread) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      thread.title.toLowerCase().includes(q) ||
      thread.author.toLowerCase().includes(q) ||
      (thread.content && thread.content.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <Helmet>
        <title>{categoryInfo.name} — Community Forum — VaultScope</title>
        <meta name="description" content={categoryInfo.description} />
      </Helmet>

      <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text)] pt-28 lg:pt-32 pb-24">
        <div className="vs-container">
          <LocaleLink
            to="/resources/forum"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text)] mb-8 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Categories</span>
          </LocaleLink>

          <header className="border-b border-[var(--line)] pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-mono text-[var(--accent-bright)] tabular-nums">
                Channel · {threads.length} {threads.length === 1 ? 'thread' : 'threads'}
              </p>
              <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-[var(--text)]">
                {categoryInfo.name}
              </h1>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {categoryInfo.description}
              </p>
            </div>

            <button
              onClick={() => setShowNewThreadModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-white font-mono text-xs font-medium hover:bg-[var(--accent-bright)] transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Start Discussion</span>
            </button>
          </header>

          {showNewThreadModal && (
            <div className="mb-10 py-6 border-t-2 border-[var(--accent)] border-b border-[var(--line)] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-[var(--text)] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[var(--accent-bright)]" />
                  <span>Start New Technical Discussion</span>
                </h3>
                <button
                  onClick={() => setShowNewThreadModal(false)}
                  className="text-[var(--text-faint)] hover:text-[var(--text)] p-1 cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateThread} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[var(--text-muted)] block">
                      Discussion Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dual-stack BGP announce with BIRD2 on Debian"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--line)] text-xs font-mono text-[var(--text)] focus:outline-none focus:border-[var(--accent-bright)]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[var(--text-muted)] block">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. sysadmin_mark"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--line)] text-xs font-mono text-[var(--text)] focus:outline-none focus:border-[var(--accent-bright)]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-muted)] block">
                    Message Body (Technical details, logs, config snippets)
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your architecture question or operational workflow..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--line)] text-xs font-mono text-[var(--text)] focus:outline-none focus:border-[var(--accent-bright)]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewThreadModal(false)}
                    className="px-3.5 py-1.5 border border-[var(--line)] text-xs font-mono hover:border-[var(--accent-bright)] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[var(--accent)] text-white font-mono text-xs font-medium hover:bg-[var(--accent-bright)] transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Discussion</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-[var(--text-faint)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="thread-search"
                type="text"
                placeholder="Search threads in this channel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2 bg-[var(--bg-surface)] border border-[var(--line)] text-xs font-mono text-[var(--text)] focus:outline-none focus:border-[var(--accent-bright)] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-[var(--text)] cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Threads Listing / Empty State */}
          {threads.length === 0 ? (
            <div className="text-center py-20 border-y border-[var(--line)] space-y-5">
              <div className="w-10 h-10 border border-[var(--accent)]/30 bg-[var(--accent)]/10 flex items-center justify-center mx-auto text-[var(--accent-bright)]">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-base font-semibold text-[var(--text)]">
                  No discussions in this channel yet
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono leading-relaxed">
                  Be the first operator to initiate a discussion, ask a question, or share an architecture setup in {categoryInfo.name}.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowNewThreadModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--accent)] text-white font-mono text-xs font-medium hover:bg-[var(--accent-bright)] transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Start First Discussion</span>
                </button>
                <LocaleLink
                  to="/docs"
                  className="px-4 py-2 border border-[var(--line)] font-mono text-xs text-[var(--text-muted)] hover:border-[var(--accent-bright)] transition-colors"
                >
                  View Documentation
                </LocaleLink>
              </div>
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="text-center py-16 border-y border-[var(--line)] space-y-3">
              <p className="text-sm font-semibold text-[var(--text)]">No threads match your search</p>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                No discussions matching &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-3.5 py-1.5 border border-[var(--line)] text-xs font-mono hover:border-[var(--accent-bright)] transition-colors cursor-pointer"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="border-t border-b border-[var(--line)] divide-y divide-[var(--line)]">
              {filteredThreads.map((thread) => (
                <LocaleLink
                  key={thread.id}
                  to={`/resources/forum/${category}/${thread.id}`}
                  className="py-5 transition-colors flex items-center justify-between gap-6 group block"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent-bright)] transition-colors truncate">
                        {thread.title}
                      </h3>
                      {thread.status === 'solved' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-500 uppercase tracking-wider shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          Solved
                        </span>
                      )}
                      {thread.status === 'locked' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[var(--text-faint)] uppercase tracking-wider shrink-0">
                          <Lock className="w-3 h-3" />
                          Locked
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--text-faint)]">
                      <span className="flex items-center gap-1 text-[var(--text-muted)]">
                        <User className="w-3 h-3" />
                        {thread.author}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(thread.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-xs font-mono text-[var(--text-muted)] shrink-0 tabular-nums">
                    <div>
                      {thread.replyCount} {thread.replyCount === 1 ? 'reply' : 'replies'}
                    </div>
                    <div className="text-[11px] text-[var(--text-faint)]">{thread.viewCount} views</div>
                  </div>
                </LocaleLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
