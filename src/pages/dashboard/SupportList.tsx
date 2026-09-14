import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
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

export function SupportList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', content: '', category: 'support', priority: 'normal' });
  const { error, success } = useToast();
  const navigate = useNavigate();

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
  }, [error]);

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.content.trim()) {
      error('Subject and message are required');
      return;
    }
    setSubmitting(true);
    try {
      const created = await api.post<Ticket>('/storefront/tickets', newTicket);
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
          <div className="grid grid-cols-2 gap-4">
            <select value={newTicket.category} onChange={e => setNewTicket({ ...newTicket, category: e.target.value })} className="border border-border bg-background p-2.5 text-sm focus:outline-none focus:border-foreground">
              <option value="support">General Support</option>
              <option value="abuse">Abuse Report</option>
              <option value="dmca">DMCA</option>
            </select>
            <select value={newTicket.priority} onChange={e => setNewTicket({ ...newTicket, priority: e.target.value })} className="border border-border bg-background p-2.5 text-sm focus:outline-none focus:border-foreground">
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
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
                    <div className="text-xs font-mono text-muted-foreground">{tkt.ticket_number}</div>
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
