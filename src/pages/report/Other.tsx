import { useState } from 'react';

export function ReportOther() {
  const [submitted, setSubmitted] = useState(false);
  
  if (submitted) return <div className="p-8 border border-border bg-foreground/5 text-center">Your report has been submitted successfully.</div>;

  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Report Other Issue</h2>
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
        <div>
          <label className="block text-sm font-medium mb-1">Your Email</label>
          <input type="email" required className="w-full border border-border bg-background p-2 text-sm focus:outline-none focus:border-foreground" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input type="text" required className="w-full border border-border bg-background p-2 text-sm focus:outline-none focus:border-foreground" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea required rows={5} className="w-full border border-border bg-background p-2 text-sm focus:outline-none focus:border-foreground"></textarea>
        </div>
        <button className="bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-foreground/90 transition-colors cursor-pointer">Submit Report</button>
      </form>
    </div>
  );
}
