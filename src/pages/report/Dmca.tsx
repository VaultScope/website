import { useState } from 'react';

export function ReportDmca() {
  const [submitted, setSubmitted] = useState(false);
  
  if (submitted) return <div className="p-8 border border-border bg-foreground/5 text-center">Your DMCA takedown request has been submitted successfully.</div>;

  return (
    <div>
      <h2 className="text-xl font-medium mb-4">DMCA Takedown Notice</h2>
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
        <div>
          <label className="block text-sm font-medium mb-1">Your Full Name / Company</label>
          <input type="text" required className="w-full border border-border bg-background p-2 text-sm focus:outline-none focus:border-foreground" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Your Email</label>
          <input type="email" required className="w-full border border-border bg-background p-2 text-sm focus:outline-none focus:border-foreground" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Infringing URL(s)</label>
          <textarea required rows={3} className="w-full border border-border bg-background p-2 text-sm focus:outline-none focus:border-foreground"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Original Work URL(s) or Evidence</label>
          <textarea required rows={3} className="w-full border border-border bg-background p-2 text-sm focus:outline-none focus:border-foreground"></textarea>
        </div>
        <div className="flex items-start gap-2">
          <input type="checkbox" required className="mt-1" />
          <span className="text-xs text-muted-foreground">I state under penalty of perjury that I am the owner or authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</span>
        </div>
        <button className="bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-foreground/90 transition-colors cursor-pointer">Submit DMCA Notice</button>
      </form>
    </div>
  );
}
