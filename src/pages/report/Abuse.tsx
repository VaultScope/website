import { useState } from 'react';
import { LocaleLink } from '../../i18n/context';

export function ReportAbuse() {
  const [email, setEmail] = useState('');
  const [target, setTarget] = useState('');
  const [evidence, setEvidence] = useState('');
  const [prepared, setPrepared] = useState(false);

  const mailtoHref = `mailto:info@vaultscope.de?subject=${encodeURIComponent(
    `[Abuse Report] ${target || 'Network Abuse'}`
  )}&body=${encodeURIComponent(
    `Reporter Email: ${email}\nOffending IP / URL: ${target}\n\nLogs & Evidence:\n${evidence}`
  )}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPrepared(true);
    window.location.href = mailtoHref;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-1">Report Network Abuse</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Provide the offending IP address or URL along with timestamped logs. Submitting opens your email client addressed to{' '}
          <span className="font-mono text-foreground">info@vaultscope.de</span>, or you can open an authenticated ticket in the customer portal.
        </p>
      </div>

      {prepared && (
        <div className="p-4 border border-[var(--line-strong)] bg-[var(--bg-elevated)] space-y-2 text-xs">
          <p className="font-medium text-foreground">
            Your abuse report has been submitted and prepared for <span className="font-mono">info@vaultscope.de</span>.
          </p>
          <p className="text-muted-foreground">
            If your email client did not open automatically,{' '}
            <a href={mailtoHref} className="text-foreground underline underline-offset-4">
              click here to send via email
            </a>{' '}
            or{' '}
            <LocaleLink to="/dashboard/support" className="text-foreground underline underline-offset-4">
              submit a ticket in the Support Desk
            </LocaleLink>.
          </p>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="abuse-email" className="block text-xs font-mono uppercase tracking-[0.06em] text-muted-foreground mb-1.5">
            Your Email
          </label>
          <input
            id="abuse-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="security@example.com"
            className="w-full rounded-md border border-[var(--line)] bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[var(--accent-bright)] transition-colors"
          />
        </div>
        <div>
          <label htmlFor="abuse-target" className="block text-xs font-mono uppercase tracking-[0.06em] text-muted-foreground mb-1.5">
            Offending IP or URL
          </label>
          <input
            id="abuse-target"
            type="text"
            required
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="e.g. 192.0.2.10 or https://example.com"
            className="w-full rounded-md border border-[var(--line)] bg-background px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-[var(--accent-bright)] transition-colors"
          />
        </div>
        <div>
          <label htmlFor="abuse-evidence" className="block text-xs font-mono uppercase tracking-[0.06em] text-muted-foreground mb-1.5">
            Logs or Evidence
          </label>
          <textarea
            id="abuse-evidence"
            required
            rows={5}
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            className="w-full rounded-md border border-[var(--line)] bg-background px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-[var(--accent-bright)] transition-colors"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="submit"
            className="vs-btn-primary px-5 py-2.5 text-xs font-mono uppercase tracking-[0.06em] font-medium cursor-pointer"
          >
            Submit Report
          </button>
          <LocaleLink
            to="/dashboard/support"
            className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            Existing customer? Open a Support Ticket →
          </LocaleLink>
        </div>
      </form>
    </div>
  );
}
