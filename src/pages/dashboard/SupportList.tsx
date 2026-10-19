import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ArrowUpRight, LifeBuoy } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../components/Toast';
import { CustomSelect } from '../../components/Shared';

export function SupportList() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('support');
  const [priority, setPriority] = useState('normal');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadTickets = () => {
    setLoading(true);
    api
      .get('/storefront/tickets')
      .then((data) => {
        if (Array.isArray(data)) setTickets(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      const res: any = await api.post('/storefront/tickets', {
        subject,
        content,
        category,
        priority,
      });
      setShowNew(false);
      setSubject('');
      setContent('');
      if (res?.id) {
        navigate(`/dashboard/support/${res.id}`);
      } else {
        loadTickets();
      }
    } catch (err: any) {
      toast(err.message || 'Failed to create ticket', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const openTickets = tickets.filter(
    (t) => t.status !== 'resolved' && t.status !== 'closed'
  );
  const waitingCustomer = tickets.filter((t) => t.status === 'waiting_customer');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">Support</h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--fg-muted)]">
            <span>Direct access to VaultScope infrastructure engineers.</span>
            <span className="font-mono text-[var(--fg)]">{openTickets.length} open</span>
            <span className="font-mono text-[var(--warn)]">
              {waitingCustomer.length} awaiting your reply
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowNew((v) => !v)}
          className="vs-btn-primary text-xs py-2 px-4 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Open Ticket
        </button>
      </div>

      {showNew && (
        <form
          onSubmit={handleCreate}
          className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-6 sm:p-8 space-y-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--fg)]">New Support Ticket</h2>
            <button
              type="button"
              onClick={() => setShowNew(false)}
              className="text-xs text-[var(--fg-faint)] hover:text-[var(--fg)]"
            >
              Close
            </button>
          </div>

          <div>
            <label htmlFor="support-subject" className="block text-xs text-[var(--fg-muted)] mb-1.5">
              Subject
            </label>
            <input
              id="support-subject"
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="w-full rounded-xl bg-[var(--bg)] border border-[var(--line)] px-4 py-2.5 text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)] focus:ring-1 focus:ring-[var(--accent-bright)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="support-category" className="block text-xs text-[var(--fg-muted)] mb-1.5">
                Category
              </label>
              <CustomSelect
                id="support-category"
                name="category"
                value={category}
                onChange={setCategory}
                options={[
                  { value: 'support', label: 'Technical Support', hint: 'Compute, OS, or daemon issues' },
                  { value: 'billing', label: 'Billing', hint: 'Invoices, VAT, or payments' },
                  { value: 'network', label: 'Network / BGP', hint: 'Routing, rDNS, or DDoS' },
                  { value: 'sales', label: 'Sales', hint: 'Custom racks & volume quotes' },
                ]}
              />
            </div>
            <div>
              <label htmlFor="support-priority" className="block text-xs text-[var(--fg-muted)] mb-1.5">
                Priority
              </label>
              <CustomSelect
                id="support-priority"
                name="priority"
                value={priority}
                onChange={setPriority}
                options={[
                  { value: 'low', label: 'Low', hint: 'General inquiry' },
                  { value: 'normal', label: 'Normal', hint: 'Standard engineering SLA' },
                  { value: 'high', label: 'High', hint: 'Degraded workload' },
                  { value: 'urgent', label: 'Urgent', hint: 'Production outage' },
                ]}
              />
            </div>
          </div>

          <div>
            <label htmlFor="support-message" className="block text-xs text-[var(--fg-muted)] mb-1.5">
              Message
            </label>
            <textarea
              id="support-message"
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your issue..."
              className="w-full rounded-xl bg-[var(--bg)] border border-[var(--line)] px-4 py-2.5 text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--accent-bright)] focus:ring-1 focus:ring-[var(--accent-bright)]"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowNew(false)}
              className="px-4 py-2 rounded-lg text-xs text-[var(--fg-muted)] hover:text-[var(--fg)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="vs-btn-primary text-xs py-2 px-5 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-12 text-center text-sm text-[var(--fg-muted)] font-mono">
          Loading...
        </div>
      ) : tickets.length === 0 ? (
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] p-12 text-center space-y-2">
          <LifeBuoy className="w-7 h-7 text-[var(--fg-faint)] mx-auto" />
          <p className="text-sm text-[var(--fg-muted)]">No tickets found</p>
        </div>
      ) : (
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--line)] divide-y divide-[var(--line)] overflow-hidden">
          {tickets.map((tkt) => {
            const isOpen = tkt.status === 'open' || tkt.status === 'in_progress';
            const isWaiting = tkt.status === 'waiting_customer';
            return (
              <div
                key={tkt.id}
                className="hover:bg-[var(--bg-subtle)] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isWaiting
                          ? 'bg-[var(--warn)]'
                          : isOpen
                            ? 'bg-[var(--ok)]'
                            : 'bg-[var(--fg-faint)]'
                      }`}
                    />
                    <span className="text-xs font-mono text-[var(--accent-bright)]">
                      {tkt.ticket_number}
                    </span>
                    <span className="text-sm font-medium text-[var(--fg)] truncate">
                      {tkt.subject}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--fg-faint)] font-mono">
                    <span className="uppercase">{tkt.status}</span>
                    <span>·</span>
                    <span className="uppercase">{tkt.priority || 'normal'}</span>
                    <span>·</span>
                    <span>
                      Updated{' '}
                      {tkt.updated_at ? new Date(tkt.updated_at).toLocaleDateString() : '—'}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/dashboard/support/${tkt.id}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-elevated)] self-start sm:self-auto shrink-0 transition-colors"
                >
                  View
                  <ArrowUpRight className="w-3.5 h-3.5 text-[var(--accent-bright)]" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
