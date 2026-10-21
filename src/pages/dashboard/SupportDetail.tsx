import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  User,
  ShieldAlert,
  Paperclip,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { api } from '../../lib/api';

const API_BASE =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'vaultscope.de' ||
    window.location.hostname.endsWith('.vaultscope.de'))
    ? '/api'
    : import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function SupportDetail() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api
      .get(`/storefront/tickets/${id}`)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || typeof EventSource === 'undefined') return;
    const token = localStorage.getItem('vs_token');
    if (!token) return;

    const url = `${API_BASE}/storefront/tickets/${id}/events?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);

    es.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === 'message' && parsed.message) {
          setData((prev: any) => {
            if (!prev) return prev;
            const exists = (prev.messages || []).some((m: any) => m.id === parsed.message.id);
            if (exists) return prev;
            return {
              ...prev,
              messages: [...(prev.messages || []), parsed.message],
            };
          });
        }
      } catch {
        // Ignore malformed SSE events
      }
    };

    return () => {
      es.close();
    };
  }, [id]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !id) return;
    setUploadError('');

    for (const file of Array.from(files)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setUploadError('Only PNG, JPEG, WebP, and GIF images are permitted.');
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`File "${file.name}" exceeds the 10MB limit.`);
        continue;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        const uploaded = await api.post(`/storefront/tickets/${id}/attachments`, formData);
        setAttachments((prev) => [...prev, uploaded]);
      } catch (err: any) {
        setUploadError(err.message || 'Failed to upload image');
      } finally {
        setUploading(false);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (attId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attId));
  };

  const handleReply = async () => {
    if (!reply.trim() && attachments.length === 0) return;
    setSending(true);
    try {
      const msg: any = await api.post(`/storefront/tickets/${id}/messages`, {
        content: reply,
        attachments,
      });
      setData((prev: any) => {
        if (!prev) return prev;
        const exists = (prev.messages || []).some((m: any) => m.id === msg.id);
        return {
          ...prev,
          messages: exists ? prev.messages : [...(prev.messages || []), msg],
        };
      });
      setReply('');
      setAttachments([]);
    } catch (e: any) {
      setUploadError(e.message || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-12 text-center text-sm text-[var(--fg-muted)] font-mono">
        Loading...
      </div>
    );
  }

  if (!data || !data.ticket) {
    return (
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-12 text-center text-sm text-[var(--fg-muted)]">
        Ticket not found
      </div>
    );
  }

  const { ticket, messages } = data;

  return (
    <div className="space-y-6">
      <Link
        to="/dashboard/support"
        className="inline-flex items-center gap-1.5 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Tickets
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Columns: Ticket Header, Conversation Stream, and Reply Composer */}
        <div className="lg:col-span-8 space-y-6">
          {/* Ticket Header */}
          <div className="rounded-[6px] bg-[var(--bg-card)] border border-[var(--line)] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono text-[var(--accent-bright)]">
                  {ticket.ticket_number}
                </span>
                <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--fg)]">
                  {ticket.status?.toUpperCase()}
                </span>
                <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--fg-muted)]">
                  {(ticket.priority || 'normal').toUpperCase()}
                </span>
              </div>
              <h1 className="text-xl font-semibold tracking-tight text-[var(--fg)]">
                {ticket.subject}
              </h1>
              <div className="text-xs text-[var(--fg-faint)] font-mono">
                Opened {new Date(ticket.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Conversation Stream */}
          <div className="space-y-4">
            {(messages || []).map((msg: any) => {
              const isCustomer = msg.author_type === 'customer';
              return (
                <div
                  key={msg.id}
                  className={`rounded-[6px] p-6 space-y-3 border ${
                    isCustomer
                      ? 'bg-[var(--bg-card)] border-[var(--line)]'
                      : 'bg-[var(--accent-subtle)] border-[var(--accent)]/25'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {isCustomer ? (
                        <User className="w-4 h-4 text-[var(--fg-muted)] shrink-0" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
                      )}
                      <span className="text-xs font-semibold text-[var(--fg)]">
                        {isCustomer ? 'You' : 'Support Staff'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[var(--fg-faint)]">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-sm text-[var(--fg-muted)] leading-relaxed whitespace-pre-wrap pl-6 max-w-[75ch]">
                    {msg.content}
                  </div>

                  {Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                    <div className="pl-6 pt-2 flex flex-wrap gap-3">
                      {msg.attachments.map((att: any) => {
                        const imgUrl = att.url;
                        return (
                          <a
                            key={att.id || att.url}
                            href={imgUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block rounded-[6px] overflow-hidden bg-[var(--bg)] border border-[var(--line)] max-w-xs"
                          >
                            <img
                              src={imgUrl}
                              alt={att.filename || 'attachment'}
                              className="max-h-48 w-auto object-contain"
                            />
                            <div className="px-2.5 py-1 text-[10px] font-mono text-[var(--fg-faint)] truncate">
                              {att.filename}
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Minimal Reply Composer */}
          <div className="rounded-[6px] bg-[var(--bg-card)] border border-[var(--line)] p-6 space-y-4">
            <textarea
              rows={4}
              aria-label="Reply message"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply..."
              className="w-full rounded-[6px] bg-[var(--bg-subtle)] border border-[var(--line)] p-4 text-sm text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)] focus:ring-1 focus:ring-[var(--accent-bright)]"
            />

            {uploadError && (
              <div role="alert" className="text-xs text-[var(--err)]">
                {uploadError}
              </div>
            )}

            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-subtle)] border border-[var(--line)] text-xs font-mono text-[var(--fg)]"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[var(--accent-bright)]" />
                    <span className="truncate max-w-[160px]">{att.filename}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${att.filename}`}
                      onClick={() => removeAttachment(att.id)}
                      className="p-0.5 text-[var(--fg-faint)] hover:text-[var(--err)]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="vs-btn-secondary text-xs py-1.5 px-3.5"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  {uploading ? 'Uploading...' : 'Attach Image'}
                </button>
              </div>

              <button
                type="button"
                onClick={handleReply}
                disabled={sending || uploading}
                className="vs-btn-primary text-xs py-2 px-5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {sending ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Ticket Metadata & SLA Ledger */}
        <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
          <div className="rounded-[6px] bg-[var(--bg-card)] border border-[var(--line)] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[var(--line)] bg-[var(--bg-subtle)]">
              <h2 className="text-xs font-mono uppercase tracking-[0.06em] text-[var(--fg)]">
                Ticket Metadata
              </h2>
            </div>
            <dl className="divide-y divide-[var(--line)] text-xs">
              <div className="px-5 py-3 flex items-center justify-between gap-3">
                <dt className="text-[var(--fg-muted)]">Internal ID</dt>
                <dd className="font-mono text-[var(--accent-bright)]">#{ticket.id || id}</dd>
              </div>
              <div className="px-5 py-3 flex items-center justify-between gap-3">
                <dt className="text-[var(--fg-muted)]">Routing Queue</dt>
                <dd className="font-mono text-[var(--fg)]">Infrastructure NOC</dd>
              </div>
              <div className="px-5 py-3 flex items-center justify-between gap-3">
                <dt className="text-[var(--fg-muted)]">Messages</dt>
                <dd className="font-mono text-[var(--fg)]">{(messages || []).length} in thread</dd>
              </div>
              <div className="px-5 py-3 flex items-center justify-between gap-3">
                <dt className="text-[var(--fg-muted)]">Attachment Limit</dt>
                <dd className="font-mono text-[var(--fg)]">10 MB / file</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[6px] bg-[var(--bg-card)] border border-[var(--line)] p-5 space-y-2">
            <div className="text-xs font-semibold text-[var(--fg)]">Engineering Support</div>
            <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
              Attachments up to 10 MB (PNG, JPEG, WebP, GIF) are encrypted in transit and routed directly to the assigned infrastructure engineer.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
