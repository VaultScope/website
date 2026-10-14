import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, X, Server, Tag, AlertCircle, ChevronDown, MessageSquare, ExternalLink } from 'lucide-react';
import { Button } from '../../components/Shared';
import { api } from '../../lib/api';
import { useToast } from '../../components/Toast';

interface Ticket {
  id: string;
  ticket_number: string;
  subject: string;
  status: string;
  priority: string;
  updated_at: string;
  related_service_id?: string;
}

interface UserService {
  id: string;
  name: string;
  hostname?: string;
  ip?: string;
  status: string;
}

export function SupportList() {
  const [searchParams] = useSearchParams();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [services, setServices] = useState<UserService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    content: '',
    category: 'support',
    priority: 'normal',
    related_service_id: '',
  });
  const { error, success } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const serviceParam = searchParams.get('service_id');
    if (serviceParam) {
      setNewTicket(prev => ({ ...prev, related_service_id: serviceParam }));
      setShowNew(true);
    }
  }, [searchParams]);

  useEffect(() => {
    api.get<Ticket[]>('/storefront/tickets')
      .then(data => {
        setTickets(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        error('Failed to load tickets');
        setLoading(false);
      });

    api.get<UserService[]>('/storefront/services')
      .then(setServices)
      .catch(() => {});
  }, [error]);

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.content.trim()) {
      error('Subject and message are required');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        subject: newTicket.subject.trim(),
        content: newTicket.content.trim(),
        category: newTicket.category,
        priority: newTicket.priority,
        related_service_id: newTicket.related_service_id || undefined,
      };
      const created = await api.post<Ticket>('/storefront/tickets', payload);
      success('Ticket created');
      navigate(`/dashboard/support/${created.id}`);
    } catch (err: any) {
      error(err.message || 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const openCount = tickets.filter(t => t.status !== 'closed' && t.status !== 'resolved').length;
  const waitingCount = tickets.filter(t => t.status === 'waiting_customer').length;

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-light mb-1">Support</h1>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{openCount} open</span>
            {waitingCount > 0 && <span className="text-yellow-500">{waitingCount} awaiting your reply</span>}
          </div>
        </div>
        <Button onClick={() => setShowNew(true)} className="h-9 px-5 text-sm gap-2">
          <Plus className="w-3.5 h-3.5" /> Open Ticket
        </Button>
      </div>

      <div className="mb-6 p-4 border border-indigo-500/20 bg-indigo-500/5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-foreground">Discord Community & Developer Exchange</p>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                No Customer Support
              </span>
            </div>
            <p className="text-muted-foreground mt-0.5">
              We do not provide customer support on Discord (please open a ticket above for account & service issues). You are welcome to join our Discord to discuss new features, upcoming products, UI/UX improvements, and chat directly with the developers!
            </p>
          </div>
        </div>
        <a
          href="https://discord.gg/84kMAY2aKm"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded font-medium transition-colors shrink-0 whitespace-nowrap"
          title="Community & developer exchange (no customer support)"
        >
          <span>Join Discord</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {showNew && (
        <div className="border border-border mb-6 p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium">New Support Ticket</h2>
            <button onClick={() => setShowNew(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <input
            type="text"
            value={newTicket.subject}
            onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })}
            placeholder="Subject"
            className="w-full border border-border bg-transparent p-2.5 text-sm focus:outline-none focus:border-foreground"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                <Tag className="w-3.5 h-3.5 text-foreground/50" />
                <span>Category</span>
              </label>
              <div className="relative">
                <select 
                  value={newTicket.category} 
                  onChange={e => setNewTicket({ ...newTicket, category: e.target.value })} 
                  className="w-full border border-border bg-background p-2.5 pr-8 text-sm focus:outline-none focus:border-foreground appearance-none rounded cursor-pointer"
                >
                  <option value="support">General Support</option>
                  <option value="abuse">Abuse Report</option>
                  <option value="dmca">DMCA</option>
                </select>
                <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-foreground/50" />
                <span>Priority</span>
              </label>
              <div className="relative">
                <select 
                  value={newTicket.priority} 
                  onChange={e => setNewTicket({ ...newTicket, priority: e.target.value })} 
                  className="w-full border border-border bg-background p-2.5 pr-8 text-sm focus:outline-none focus:border-foreground appearance-none rounded cursor-pointer"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                <Server className="w-3.5 h-3.5 text-foreground/50" />
                <span>Related Service (Optional)</span>
              </label>
              <div className="relative">
                <select 
                  value={newTicket.related_service_id} 
                  onChange={e => setNewTicket({ ...newTicket, related_service_id: e.target.value })} 
                  className="w-full border border-border bg-background p-2.5 pr-8 text-sm focus:outline-none focus:border-foreground appearance-none rounded cursor-pointer"
                >
                  <option value="">None / General Inquiry</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.hostname || s.ip || s.id.slice(0, 8)})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
          <textarea
            value={newTicket.content}
            onChange={e => setNewTicket({ ...newTicket, content: e.target.value })}
            placeholder="Describe your issue..."
            rows={4}
            className="w-full border border-border bg-transparent p-2.5 text-sm focus:outline-none focus:border-foreground resize-none"
          />
          <div className="flex justify-end">
            <Button onClick={handleCreateTicket} disabled={submitting} className="h-9 px-5 text-sm">
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </Button>
          </div>
        </div>
      )}

      <div className="border border-border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border">
            <tr className="text-xs uppercase tracking-wider text-foreground/40">
              <th className="px-5 py-3 font-medium">Subject</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Priority</th>
              <th className="px-5 py-3 font-medium">Updated</th>
              <th className="px-5 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : tickets.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">No tickets found</td></tr>
            ) : (
              tickets.map(tkt => (
                <tr key={tkt.id} className="hover:bg-foreground/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium mb-0.5">{tkt.subject}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{tkt.ticket_number}</span>
                      {tkt.related_service_id && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-muted/60 text-muted-foreground px-1.5 py-0.5 rounded border border-border/50">
                          <Server className="w-3 h-3 text-blue-400" />
                          {services.find(s => s.id === tkt.related_service_id)?.name || 'Linked Service'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs ${
                      tkt.status === 'open' || tkt.status === 'in_progress' ? 'text-blue-400' :
                      tkt.status === 'waiting_customer' ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>
                      {tkt.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs ${
                      tkt.priority === 'high' || tkt.priority === 'critical' ? 'text-red-500' :
                      tkt.priority === 'normal' ? 'text-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {tkt.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground text-sm">{new Date(tkt.updated_at).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-right">
                    <Link to={`/dashboard/support/${tkt.id}`}>
                      <Button variant="outline" className="h-7 px-3 text-xs">View</Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
