import { useEffect } from 'react';
import { DocHeader } from '../components/DocHeader';
import { DocPagination } from '../components/DocPagination';
import { Callout } from '../components/Callout';
import { CreditCard, FileText, CheckCircle2, Building, ShieldCheck, Mail } from 'lucide-react';

const TOC = [
  { id: 'gobd-compliance', label: 'GoBD & DIN 5008 Compliance' },
  { id: 'vat-taxation', label: '19% VAT & EU Reverse Charge' },
  { id: 'pdf-invoices', label: 'Downloading Vector PDF Invoices' },
  { id: 'payment-methods', label: 'Payment Methods & Cycles' },
  { id: 'accounting-cc', label: 'Automated Accounting Email CC' },
  { id: 'cancellation-terms', label: 'Cancellation & Prorated Billing' },
];

export const BillingGuide = () => {
  useEffect(() => {
    document.title = 'Billing, VAT & GoBD Invoices — VaultScope Customer Docs';
  }, []);

  return (
    <div className="space-y-8">
      <DocHeader
        breadcrumbs={[
          { label: 'Customer Guides', path: '/docs' },
          { label: 'Billing & Invoices' },
        ]}
        title="Billing, VAT & GoBD Invoices Guide"
        badge={{ label: 'Finance & Tax', variant: 'emerald' }}
        description="Comprehensive guide covering German GoBD tax compliance, DIN 5008 invoice layout standards, 19% VAT and EU B2B reverse charge exemptions, downloading vector PDF invoices, and automated accounting routing."
        tocItems={TOC}
      />

      <div className="space-y-12 text-sm leading-relaxed">
        {/* GoBD Compliance */}
        <section id="gobd-compliance" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>GoBD Compliance & DIN 5008 Standards</span>
          </h2>
          <p className="text-foreground/80">
            VaultScope's invoicing infrastructure is engineered strictly in accordance with the German principles of proper accounting (<abbr title="Grundsätze zur ordnungsmäßigen Führung und Aufbewahrung von Büchern, Aufzeichnungen und Unterlagen in elektronischer Form">GoBD</abbr>) and DIN 5008 business letter layout specifications.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose my-4">
            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <h3 className="text-sm font-semibold text-foreground mb-1">Unique Invoice Numbers</h3>
              <p className="text-xs text-foreground/60">
                Invoices are issued with unique sequential identifiers (<code className="font-mono bg-foreground/5 px-1 py-0.5 rounded">INV-...</code>) tracked in PostgreSQL.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <h3 className="text-sm font-semibold text-foreground mb-1">SHA-256 Document Checksum</h3>
              <p className="text-xs text-foreground/60">
                Each generated PDF invoice embeds a deterministic SHA-256 checksum over its core invoice fields for reference verification.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <h3 className="text-sm font-semibold text-foreground mb-1">Statutory Retention (§ 147 AO)</h3>
              <p className="text-xs text-foreground/60">
                Billing and invoice records are maintained in the database for statutory retention periods pursuant to German commercial and tax law (&sect; 147 AO / &sect; 14b UStG).
              </p>
            </div>
          </div>
        </section>

        {/* 19% VAT & Reverse Charge */}
        <section id="vat-taxation" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Building className="w-5 h-5 text-[var(--text-muted)]" />
            <span>German 19% VAT &amp; EU VIES Validation</span>
          </h2>
          <p className="text-foreground/80">
            Checkout and renewal invoices currently apply standard 19% German VAT (MwSt.). You can verify and store your EU VAT Identification Number on your billing profile:
          </p>

          <div className="border border-border rounded-lg overflow-hidden not-prose my-3">
            <table className="w-full text-xs">
              <thead className="bg-foreground/5 text-foreground/70 font-mono border-b border-border text-left">
                <tr>
                  <th className="p-3">Customer Type</th>
                  <th className="p-3">Tax Rate at Checkout</th>
                  <th className="p-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-3 font-medium text-foreground">Standard Checkout &amp; Renewals</td>
                  <td className="p-3 font-semibold text-amber-500">19% MwSt. (USt.)</td>
                  <td className="p-3 text-foreground/60">Standard 19% German VAT itemized clearly on order summaries and PDF invoices.</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-foreground">EU Business VAT ID</td>
                  <td className="p-3 font-semibold text-foreground">Verified on Profile</td>
                  <td className="p-3 text-foreground/60">Validate your EU VAT ID via the European Commission VIES service in Account Settings so it appears on invoices.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Callout type="tip" title="VIES VAT ID Validation">
            EU businesses can enter their VAT Identification Number (e.g. <code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">DE123456789</code>) under <strong>Dashboard &rarr; Profile &rarr; Account</strong> and click <strong>Verify</strong> to validate it against the European Commission VIES registry so it is printed on generated PDF invoices.
          </Callout>
        </section>

        {/* Vector PDF Invoices */}
        <section id="pdf-invoices" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[var(--text)]" />
            <span>Downloading Vector PDF Invoices</span>
          </h2>
          <p className="text-foreground/80">
            Every finalized invoice is compiled dynamically using our native Rust PDF rendering engine. Invoices feature:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-foreground/80 text-xs">
            <li>Vector typography with clean DIN 5008 alignment.</li>
            <li>Itemized breakdowns showing descriptions, net amounts, 19% VAT, and gross totals in EUR (&euro;).</li>
            <li>VaultScope provider details (Anton Schmidt, Einzelunternehmen, Sachsenheim, Germany).</li>
            <li>Document reference ID and SHA-256 verification checksum.</li>
          </ul>
          <p className="text-foreground/80">
            Download your invoices directly by clicking the <strong>PDF</strong> button in <strong>Dashboard &rarr; Profile &rarr; Billing</strong>, and pay open invoices online using the <strong>Pay Now</strong> button.
          </p>
        </section>

        {/* Payment Methods */}
        <section id="payment-methods" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-400" />
            <span>Payment Methods &amp; Billing Cycles</span>
          </h2>
          <p className="text-foreground/80">
            VaultScope processes payments securely via Stripe Checkout / Stripe Payment Element for both initial orders and open renewal invoices:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 not-prose my-3 text-xs">
            <div className="p-3 border border-border rounded">
              <span className="font-semibold block text-foreground mb-1">Credit &amp; Debit Cards</span>
              <p className="text-foreground/60">Visa, Mastercard, and major cards processed directly via Stripe.</p>
            </div>
            <div className="p-3 border border-border rounded">
              <span className="font-semibold block text-foreground mb-1">Wallets &amp; Instant Methods</span>
              <p className="text-foreground/60">Apple Pay, Google Pay, PayPal, and Klarna presented through Stripe Payment Element.</p>
            </div>
            <div className="p-3 border border-border rounded">
              <span className="font-semibold block text-foreground mb-1">SEPA Direct Debit</span>
              <p className="text-foreground/60">Supported SEPA bank payment options through Stripe.</p>
            </div>
          </div>
        </section>

        {/* Accounting Email CC */}
        <section id="accounting-cc" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Mail className="w-5 h-5 text-[var(--text-muted)]" />
            <span>Automated Accounting Email CC</span>
          </h2>
          <p className="text-foreground/80">
            Avoid manual invoice forwarding to your finance department or external tax advisor (<abbr title="Steuerberater">StB</abbr>). In <strong>Dashboard &rarr; Profile &rarr; Billing</strong>, configure an <strong>Invoice Dispatch Recipient (CC)</strong>.
          </p>
          <p className="text-foreground/80">
            Whenever an invoice is generated, our SMTP notification gateway will automatically deliver the official vector PDF attachment directly to your accounting inbox (e.g. <code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">rechnungen@yourcompany.de</code> or <code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">accounting@yourcompany.de</code>) in real time.
          </p>
        </section>

        {/* Cancellation Terms */}
        <section id="cancellation-terms" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Cancellation & Prorated Billing</span>
          </h2>
          <p className="text-foreground/80">
            We believe in honest, transparent cloud hosting with no lock-in traps:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-foreground/80 text-xs">
            <li><strong>Flexible Cancellation:</strong> Cancel any Cloud VPS or SFTP storage service at the end of the current billing cycle or immediately directly from your dashboard.</li>
            <li><strong>Grace Period:</strong> In the event of a failed card charge, an automated 7-day grace period is granted before services enter suspension, allowing you to update payment methods without downtime.</li>
          </ul>
        </section>

        <DocPagination
          prev={{
            title: 'Dedicated Bare-Metal Servers',
            path: '/docs/customer/dedicated',
          }}
          next={{
            title: 'Support Desk & SLAs',
            path: '/docs/customer/support',
          }}
        />
      </div>
    </div>
  );
};
