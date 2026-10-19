import { useState } from 'react';
import { LocaleLink } from '../../i18n/context';

export function ReportDmca() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [infringingUrls, setInfringingUrls] = useState('');
  const [originalWork, setOriginalWork] = useState('');
  const [prepared, setPrepared] = useState(false);

  const mailtoHref = `mailto:info@vaultscope.de?subject=${encodeURIComponent(
    `[DMCA Notice] ${name || 'Copyright Infringement Notice'}`
  )}&body=${encodeURIComponent(
    `Claimant / Authorized Representative: ${name}\nContact Email: ${email}\n\nInfringing URL(s):\n${infringingUrls}\n\nOriginal Work / Evidence:\n${originalWork}\n\nSworn Statement: I state under penalty of perjury that I am the owner or authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.`
  )}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPrepared(true);
    window.location.href = mailtoHref;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-1">DMCA Takedown Notice</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Provide complete identification of the copyrighted work and the allegedly infringing material hosted on VaultScope infrastructure.
        </p>
      </div>

      {prepared && (
        <div className="p-4 border border-[var(--line-strong)] bg-[var(--bg-elevated)] space-y-2 text-xs">
          <p className="font-medium text-foreground">
            Your DMCA takedown request has been submitted and prepared for <span className="font-mono">info@vaultscope.de</span>.
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
          <label htmlFor="dmca-name" className="block text-xs font-mono uppercase tracking-[0.06em] text-muted-foreground mb-1.5">
            Your Full Name / Company
          </label>
          <input
            id="dmca-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-[var(--line)] bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[var(--accent-bright)] transition-colors"
          />
        </div>
        <div>
          <label htmlFor="dmca-email" className="block text-xs font-mono uppercase tracking-[0.06em] text-muted-foreground mb-1.5">
            Your Email
          </label>
          <input
            id="dmca-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-[var(--line)] bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[var(--accent-bright)] transition-colors"
          />
        </div>
        <div>
          <label htmlFor="dmca-infringing-urls" className="block text-xs font-mono uppercase tracking-[0.06em] text-muted-foreground mb-1.5">
            Infringing URL(s)
          </label>
          <textarea
            id="dmca-infringing-urls"
            required
            rows={3}
            value={infringingUrls}
            onChange={(e) => setInfringingUrls(e.target.value)}
            className="w-full rounded-md border border-[var(--line)] bg-background px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-[var(--accent-bright)] transition-colors"
          />
        </div>
        <div>
          <label htmlFor="dmca-original-work" className="block text-xs font-mono uppercase tracking-[0.06em] text-muted-foreground mb-1.5">
            Original Work URL(s) or Evidence
          </label>
          <textarea
            id="dmca-original-work"
            required
            rows={3}
            value={originalWork}
            onChange={(e) => setOriginalWork(e.target.value)}
            className="w-full rounded-md border border-[var(--line)] bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[var(--accent-bright)] transition-colors"
          />
        </div>
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input type="checkbox" required className="mt-1" />
          <span className="text-xs text-muted-foreground leading-relaxed">
            I state under penalty of perjury that I am the owner or authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
          </span>
        </label>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="submit"
            className="vs-btn-primary px-5 py-2.5 text-xs font-mono uppercase tracking-[0.06em] font-medium cursor-pointer"
          >
            Submit DMCA Notice
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
