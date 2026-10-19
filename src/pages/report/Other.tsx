import { useState } from 'react';
import { LocaleLink } from '../../i18n/context';

export function ReportOther() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [prepared, setPrepared] = useState(false);

  const mailtoHref = `mailto:info@vaultscope.de?subject=${encodeURIComponent(
    `[Issue Report] ${subject || 'General Compliance Inquiry'}`
  )}&body=${encodeURIComponent(
    `Reporter Email: ${email}\nSubject: ${subject}\n\nDescription:\n${description}`
  )}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPrepared(true);
    window.location.href = mailtoHref;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-1">Report Other Issue</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Report security disclosures, trademark concerns, or general compliance inquiries directly to our operations team.
        </p>
      </div>

      {prepared && (
        <div className="p-4 border border-[var(--line-strong)] bg-[var(--bg-elevated)] space-y-2 text-xs">
          <p className="font-medium text-foreground">
            Your report has been submitted successfully and prepared for <span className="font-mono">info@vaultscope.de</span>.
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
          <label htmlFor="other-email" className="block text-xs font-mono uppercase tracking-[0.06em] text-muted-foreground mb-1.5">
            Your Email
          </label>
          <input
            id="other-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-[var(--line)] bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[var(--accent-bright)] transition-colors"
          />
        </div>
        <div>
          <label htmlFor="other-subject" className="block text-xs font-mono uppercase tracking-[0.06em] text-muted-foreground mb-1.5">
            Subject
          </label>
          <input
            id="other-subject"
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-md border border-[var(--line)] bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[var(--accent-bright)] transition-colors"
          />
        </div>
        <div>
          <label htmlFor="other-description" className="block text-xs font-mono uppercase tracking-[0.06em] text-muted-foreground mb-1.5">
            Description
          </label>
          <textarea
            id="other-description"
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-[var(--line)] bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[var(--accent-bright)] transition-colors"
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
