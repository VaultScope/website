import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip, Clock, HardDrive, User, BadgeCheck } from 'lucide-react';
import { Button } from '../../components/Shared';
import { api } from '../../lib/api';

interface TicketMessage {
  id: string;
  author_id: string;
  author_type: string;
  content: string;
  created_at: string;
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
}

export function SupportDetail() {
  const { id } = useParams();
  const [data, setData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (id) {
      api.get<TicketData>(`/storefront/tickets/${id}`)
        .then(res => {
          setData(res);
          setLoading(false);
        })
        .catch(console.error);
    }
  }, [id]);

  const handleReply = async () => {
    if (!reply.trim() || !id) return;
    setSending(true);
    try {
      const newMsg = await api.post<TicketMessage>(`/storefront/tickets/${id}/messages`, { content: reply });
      setData(prev => prev ? { ...prev, messages: [...prev.messages, newMsg] } : null);
      setReply('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Ticket not found</div>;

  const { ticket, messages } = data;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="pb-6 border-b border-border mb-8">
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
            </div>
          </div>
          <div className="text-xs text-muted-foreground space-y-1 text-right">
            {ticket.related_service_id && (
              <div>Related: <Link to={`/dashboard/vps/${ticket.related_service_id}`} className="text-foreground hover:underline inline-flex items-center gap-1"><HardDrive className="w-3 h-3" />Service</Link></div>
            )}
            <div>Created: {new Date(ticket.created_at).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

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
          </div>
        ))}
      </div>

      {/* Reply */}
      <div className="border border-border p-5">
        <textarea
          className="w-full bg-transparent border border-border p-4 text-sm min-h-[120px] mb-4 outline-none focus:border-foreground/30 transition-colors resize-none"
          placeholder="Type your reply..."
          value={reply}
          onChange={e => setReply(e.target.value)}
        ></textarea>
        <div className="flex justify-between items-center">
          <Button variant="ghost" className="h-8 px-3 text-xs gap-1.5">
            <Paperclip className="w-3.5 h-3.5" /> Attach
          </Button>
          <Button className="h-9 px-5 text-sm gap-2" onClick={handleReply} disabled={sending || !reply.trim()}>
            <Send className="w-3.5 h-3.5" /> {sending ? 'Sending...' : 'Send Reply'}
          </Button>
        </div>
      </div>
    </div>
  );
}
