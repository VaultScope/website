import { useEffect } from 'react';
import { DocHeader } from '../components/DocHeader';
import { DocPagination } from '../components/DocPagination';
import { Callout } from '../components/Callout';
import { HelpCircle, MessageSquare, AlertTriangle, Image, Clock, Mail } from 'lucide-react';

const TOC = [
  { id: 'submitting-tickets', label: 'Opening a Support Ticket' },
  { id: 'priority-slas', label: 'Priority Levels & Response SLAs' },
  { id: 'realtime-updates', label: 'Real-Time Messaging & Updates' },
  { id: 'file-attachments', label: 'Diagnostic File Attachments (10MB)' },
  { id: 'smtp-alerts', label: 'Automated Email Notifications' },
  { id: 'outage-escalation', label: 'Emergency Production Escalation' },
];

export const SupportGuide = () => {
  useEffect(() => {
    document.title = 'Support Desk & SLAs — VaultScope Customer Docs';
  }, []);

  return (
    <div className="space-y-8">
      <DocHeader
        breadcrumbs={[
          { label: 'Customer Guides', path: '/docs' },
          { label: 'Support Desk & SLAs' },
        ]}
        title="Support Desk & SLAs Guide"
        badge={{ label: 'Customer Support', variant: 'blue' }}
        description="Comprehensive handbook for engaging VaultScope engineering support, understanding priority response SLAs, utilizing real-time live ticket updates, and attaching diagnostic screenshots up to 10MB."
        tocItems={TOC}
      />

      <div className="space-y-12 text-sm leading-relaxed">
        {/* Opening a Ticket */}
        <section id="submitting-tickets" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[var(--text)]" />
            <span>Opening a Support Ticket</span>
          </h2>
          <p className="text-foreground/80">
            VaultScope provides in-house technical support staffed exclusively by system administrators, Linux kernel engineers, and cloud architects &mdash; never outsourced first-tier call centers.
          </p>
          <p className="text-foreground/80">
            To submit a request, navigate to <strong>Dashboard &rarr; Support Desk &rarr; Open New Ticket</strong>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose my-4">
            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <h3 className="text-sm font-semibold text-foreground mb-1">1. Select Category</h3>
              <p className="text-xs text-foreground/60">
                Choose between Technical Infrastructure, Dedicated Bare-Metal, SFTP Storage, Billing & Accounting, or General Inquiry.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <h3 className="text-sm font-semibold text-foreground mb-1">2. Link Service ID</h3>
              <p className="text-xs text-foreground/60">
                Optionally link your ticket directly to the affected Cloud VPS or Dedicated Server. This immediately feeds hardware telemetries to our engineers.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <h3 className="text-sm font-semibold text-foreground mb-1">3. Detailed Symptoms</h3>
              <p className="text-xs text-foreground/60">
                Include reproduction steps, timestamps of occurrence, ping/traceroute outputs, or relevant kernel/dmesg log extracts.
              </p>
            </div>
          </div>
        </section>

        {/* Priority Levels & SLAs */}
        <section id="priority-slas" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>Priority Levels & Service Level Agreements (SLAs)</span>
          </h2>
          <p className="text-foreground/80">
            Tickets are triaged according to business impact:
          </p>

          <div className="border border-border rounded-lg overflow-hidden not-prose my-3">
            <table className="w-full text-xs">
              <thead className="bg-foreground/5 text-foreground/70 font-mono border-b border-border text-left">
                <tr>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Target First Response</th>
                  <th className="p-3">Definition & Typical Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-3 font-semibold text-rose-500">Critical (P1)</td>
                  <td className="p-3 font-mono font-bold text-foreground">&lt; 15 Minutes (24/7)</td>
                  <td className="p-3 text-foreground/70">Total production outage, hardware failure, unbootable bare-metal cluster, or hypervisor host disruption.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-amber-500">High (P2)</td>
                  <td className="p-3 font-mono font-medium text-foreground">&lt; 1 Hour</td>
                  <td className="p-3 text-foreground/70">Severe performance degradation, degraded RAID array, packet loss on primary network uplink.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[var(--text)]">Normal (P3)</td>
                  <td className="p-3 font-mono text-foreground">&lt; 4 Hours</td>
                  <td className="p-3 text-foreground/70">Standard operational requests, reverse DNS updates, ISO mounting assistance, sub-account setup.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-foreground/60">Low (P4)</td>
                  <td className="p-3 font-mono text-foreground">&lt; 12 Hours</td>
                  <td className="p-3 text-foreground/70">General product inquiries, billing questions, feature suggestions, or documentation feedback.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Real-Time Messaging */}
        <section id="realtime-updates" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <span>Real-Time Messaging & Updates</span>
          </h2>
          <p className="text-foreground/80">
            VaultScope's support desk incorporates real-time polling and WebSocket streaming. When chatting with our engineering staff:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-foreground/80 text-xs">
            <li><strong>Zero Manual Page Reloads:</strong> Incoming staff responses appear instantaneously in the conversation stream.</li>
            <li><strong>Live Status Indicators:</strong> Watch status transitions in real time as tickets transition from <em>Awaiting Staff Response</em> to <em>In Progress</em> or <em>Resolved</em>.</li>
            <li><strong>Markdown & Code Formatting:</strong> Format console logs, bash snippets, and configuration extracts using standard markdown fenced code blocks.</li>
          </ul>
        </section>

        {/* Diagnostic File Attachments */}
        <section id="file-attachments" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Image className="w-5 h-5 text-[var(--text-muted)]" />
            <span>Diagnostic File Attachments (10MB Limit)</span>
          </h2>
          <p className="text-foreground/80">
            To rapidly diagnose kernel panics, IPMI console errors, or routing issues, you can upload diagnostic attachments directly to any ticket message.
          </p>

          <Callout type="info" title="Attachment Security Requirements">
            <ul className="list-disc pl-5 space-y-1 text-xs text-foreground/80">
              <li><strong>Maximum File Size:</strong> 10 Megabytes (10MB) per attachment.</li>
              <li><strong>Allowed File Types:</strong> Diagnostic images only &mdash; PNG (<code className="font-mono bg-foreground/5 px-1 py-0.5 rounded">.png</code>), JPEG (<code className="font-mono bg-foreground/5 px-1 py-0.5 rounded">.jpg, .jpeg</code>), WebP (<code className="font-mono bg-foreground/5 px-1 py-0.5 rounded">.webp</code>), and GIF (<code className="font-mono bg-foreground/5 px-1 py-0.5 rounded">.gif</code>).</li>
              <li><strong>Binary Safety:</strong> Executable binaries (<code className="font-mono bg-foreground/5 px-1 py-0.5 rounded">.exe, .sh, .bat</code>) and archives (<code className="font-mono bg-foreground/5 px-1 py-0.5 rounded">.zip, .tar.gz</code>) are strictly blocked by our security gateway to prevent malware execution. Paste log text directly into the message body instead.</li>
            </ul>
          </Callout>
        </section>

        {/* Automated Email Alerts */}
        <section id="smtp-alerts" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Mail className="w-5 h-5 text-[var(--text-muted)]" />
            <span>Automated Email Notification Alerts</span>
          </h2>
          <p className="text-foreground/80">
            You don't need to keep your browser tab open. Whenever an engineer replies to your ticket, an automated SMTP notification email containing the full response and a direct deep link to the ticket is dispatched to your registered account email.
          </p>
        </section>

        {/* Emergency Production Escalation */}
        <section id="outage-escalation" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span>Emergency 24/7 Production Escalation</span>
          </h2>
          <p className="text-foreground/80">
            For catastrophic production events affecting multiple dedicated physical machines or critical enterprise clusters:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 text-foreground/80 text-xs">
            <li>Open a ticket marked with <strong>Critical (P1)</strong> priority.</li>
            <li>Our automated PagerDuty / Opsgenie dispatch immediately awakens on-call datacenter site reliability engineers in Nuremberg.</li>
            <li>Real-time status updates are simultaneously published to our independent status portal at <a href="https://status.vaultscope.de/status/vs" target="_blank" rel="noreferrer" className="underline hover:text-foreground">status.vaultscope.de</a>.</li>
          </ol>
        </section>

        <DocPagination
          prev={{
            title: 'Billing, VAT & GoBD Invoices',
            path: '/docs/customer/billing',
          }}
          next={{
            title: 'Documentation Overview',
            path: '/docs',
          }}
        />
      </div>
    </div>
  );
};
