import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip, Clock, HardDrive, User, BadgeCheck, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../components/Shared';
import { api } from '../../lib/api';

interface TicketAttachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  content_type: string;
}

interface TicketMessage {
  id: string;
  author_id: string;
  author_type: string;
  content: string;
  attachments?: TicketAttachment[] | null;
  created_at: string;
}

interface UserService {
  id: string;
  name: string;
  hostname?: string;
  ip?: string;
  status: string;
}

interface Ticket {
  id: string;
  ticket_number: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  related_service_id?: string;
}

interface TicketData {
  ticket: Ticket;
  messages: TicketMessage[];
  related_service?: UserService | null;
}

export function SupportDetail() {
  const { id } = useParams();
  const [data, setData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [attachments, setAttachments] = useState<TicketAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;

    // Load ticket data
    api.get<TicketData>(`/storefront/tickets/${id}`)
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    // Real-time EventSource listener
    let es: EventSource | null = null;
    if (typeof window !== 'undefined' && typeof window.EventSource !== 'undefined') {
      const token = localStorage.getItem('vs_token') || '';
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const eventSourceUrl = `${apiBase}/storefront/tickets/${id}/events${token ? `?token=${encodeURIComponent(token)}` : ''}`;

      try {
        es = new window.EventSource(eventSourceUrl, { withCredentials: true });

        es.onopen = () => {
          setIsLive(true);
        };

        es.addEventListener('message', (event) => {
          try {
            const newMsg: TicketMessage = JSON.parse(event.data);
            setData(prev => {
              if (!prev) return prev;
              if (prev.messages.some(m => m.id === newMsg.id)) {
                return prev;
              }
              return {
                ...prev,
                messages: [...prev.messages, newMsg],
              };
            });
          } catch (err) {
            console.error('Failed to parse incoming ticket message:', err);
          }
        });

        es.onerror = () => {
          setIsLive(false);
        };
      } catch (e) {
        console.warn('Failed to initialize EventSource:', e);
      }
    }

    // Polling fallback every 3s to guarantee seamless live updates across all network conditions
    const pollInterval = setInterval(() => {
      api.get<TicketData>(`/storefront/tickets/${id}`)
        .then(res => {
          setData(prev => {
            if (!prev) return res;
            if (res.messages.length !== prev.messages.length || res.ticket.status !== prev.ticket.status) {
              return res;
            }
            return prev;
          });
        })
        .catch(() => {});
    }, 3000);

    return () => {
      es?.close();
      clearInterval(pollInterval);
    };
  }, [id]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !id) return;
    setUploadError(null);

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // 1. Image validation
      if (!file.type.startsWith('image/')) {
        setUploadError(`"${file.name}" is not an image. Only PNG, JPEG, WebP, and GIF images are permitted.`);
        continue;
      }
      // 2. 10MB size limit
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`"${file.name}" exceeds the 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const token = localStorage.getItem('vs_token') || '';

      for (const file of validFiles) {
        const formData = new FormData();
        formData.append('file', file);

        const csrfRes = await fetch(`${apiBase}/csrf`, { credentials: 'include' }).then(r => r.json()).catch(() => ({}));
        const csrfToken = csrfRes?.token || '';

        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        if (csrfToken) headers['x-csrf-token'] = csrfToken;

        const res = await fetch(`${apiBase}/storefront/tickets/${id}/attachments`, {
          method: 'POST',
          headers,
          body: formData,
          credentials: 'include',
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Upload failed (${res.status})`);
        }

        const uploaded: TicketAttachment = await res.json();
        setAttachments(prev => [...prev, uploaded]);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (attachId: string) => {
    setAttachments(prev => prev.filter(a => a.id !== attachId));
  };

  const handleReply = async () => {
    if ((!reply.trim() && attachments.length === 0) || !id) return;
    setSending(true);
    try {
      const newMsg = await api.post<TicketMessage>(`/storefront/tickets/${id}/messages`, {
        content: reply.trim() || 'Attached image(s)',
        attachments: attachments,
      });
      setData(prev => {
        if (!prev) return null;
        if (prev.messages.some(m => m.id === newMsg.id)) return prev;
        return { ...prev, messages: [...prev.messages, newMsg] };
      });
      setReply('');
      setAttachments([]);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Ticket not found</div>;

  const { ticket, messages, related_service } = data;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="pb-6 border-b border-border mb-6">
        <Link to="/dashboard/support" className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5 mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Tickets
        </Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-medium mb-1">{ticket.subject}</h1>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="font-mono">{ticket.ticket_number}</span>
              <span className="text-blue-400">{ticket.status.replace('_', ' ').toUpperCase()}</span>
              <span className="text-red-500">{ticket.priority.toUpperCase()}</span>
              {isLive && (
                <span className="text-green-500 flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
                </span>
              )}
            </div>
          </div>
          <div className="text-xs text-muted-foreground space-y-1 text-right">
            <div>Created: {new Date(ticket.created_at).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Linked Service Banner */}
      {related_service && (
        <div className="mb-6 p-4 border border-border bg-foreground/[0.02] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-border bg-background">
              <HardDrive className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground tracking-wider">Linked Service</div>
              <div className="text-sm font-medium flex items-center gap-2">
                <span>{related_service.name}</span>
                <span className="text-xs font-mono text-muted-foreground">({related_service.hostname || related_service.ip || related_service.id.slice(0, 8)})</span>
                <span className="text-[10px] px-1.5 py-0.5 border border-border uppercase font-mono text-green-500">
                  {related_service.status}
                </span>
              </div>
            </div>
          </div>
          <Link
            to={related_service.name.toLowerCase().includes('sftp') ? '/dashboard/sftp' : `/dashboard/vps/${related_service.id}`}
            className="text-xs text-foreground font-medium hover:underline inline-flex items-center gap-1 border border-border px-3 py-1.5"
          >
            Open Service &rarr;
          </Link>
        </div>
      )}

      {/* Messages */}
      <div className="space-y-0 mb-8">
        {messages.map(msg => (
          <div key={msg.id} className={`border border-border p-5 -mt-px first:mt-0 ${
            msg.author_type === 'staff' ? 'bg-foreground/[0.02]' : ''
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 flex items-center justify-center ${
                  msg.author_type === 'staff' ? 'text-blue-400' : 'text-foreground/50'
                }`}>
                  {msg.author_type === 'staff' ? <BadgeCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <span className="text-sm font-medium">{msg.author_type === 'staff' ? 'Support Staff' : 'You'}</span>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {new Date(msg.created_at).toLocaleString()}
              </span>
            </div>
            <div className="text-sm whitespace-pre-wrap leading-relaxed pl-8">
              {msg.content}
            </div>

            {/* Inline Attachments */}
            {msg.attachments && msg.attachments.length > 0 && (
              <div className="mt-3 pl-8 flex flex-wrap gap-2.5">
                {msg.attachments.map(att => (
                  <a
                    key={att.id}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block overflow-hidden border border-border bg-foreground/[0.03] rounded hover:border-foreground/40 transition-colors"
                    title={`${att.filename} (${(att.size / 1024).toFixed(0)} KB)`}
                  >
                    <img
                      src={att.url}
                      alt={att.filename}
                      className="h-28 w-28 object-cover rounded transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-background/80 backdrop-blur-xs px-1.5 py-0.5 text-[10px] truncate text-muted-foreground group-hover:text-foreground">
                      {att.filename}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reply */}
      <div className="border border-border p-5">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />

        {uploadError && (
          <div className="mb-3 text-xs text-red-500 bg-red-500/10 border border-red-500/20 p-2.5 rounded flex items-center justify-between">
            <span>{uploadError}</span>
            <button
              type="button"
              onClick={() => setUploadError(null)}
              className="text-red-500 hover:text-red-400 text-xs ml-2 font-mono"
            >
              ×
            </button>
          </div>
        )}

        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {attachments.map(att => (
              <div
                key={att.id}
                className="flex items-center gap-2 border border-border bg-foreground/[0.03] px-2.5 py-1 text-xs rounded"
              >
                <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                <span className="max-w-[150px] truncate">{att.filename}</span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  ({(att.size / 1024).toFixed(0)} KB)
                </span>
                <button
                  type="button"
                  onClick={() => removeAttachment(att.id)}
                  className="text-muted-foreground hover:text-red-500 ml-1 p-0.5"
                  title="Remove attachment"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          className="w-full bg-transparent border border-border p-4 text-sm min-h-[120px] mb-4 outline-none focus:border-foreground/30 transition-colors resize-none"
          placeholder="Type your reply..."
          value={reply}
          onChange={e => setReply(e.target.value)}
        ></textarea>
        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="ghost"
            className="h-8 px-3 text-xs gap-1.5"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Paperclip className="w-3.5 h-3.5" />
            {uploading ? 'Uploading...' : 'Attach Image (Max 10MB)'}
          </Button>
          <Button
            className="h-9 px-5 text-sm gap-2"
            onClick={handleReply}
            disabled={sending || uploading || (!reply.trim() && attachments.length === 0)}
          >
            <Send className="w-3.5 h-3.5" /> {sending ? 'Sending...' : 'Send Reply'}
          </Button>
        </div>
      </div>
    </div>
  );
}
