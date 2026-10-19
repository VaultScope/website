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
              <h3 className="text-sm font-semibold text-foreground mb-1">Immutable Invoice Numbers</h3>
              <p className="text-xs text-foreground/60">
                Invoices follow gapless sequential numbering (<code className="font-mono bg-foreground/5 px-1 py-0.5 rounded">VS-INV-YYYY-XXXXX</code>) ensuring compliance during tax audits.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <h3 className="text-sm font-semibold text-foreground mb-1">SHA-256 Audit Hashes</h3>
              <p className="text-xs text-foreground/60">
                Each finalized invoice generates a cryptographic SHA-256 digest embedded in the database and PDF metadata to guarantee non-repudiation and tamper resistance.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <h3 className="text-sm font-semibold text-foreground mb-1">10-Year Archival Obligation</h3>
              <p className="text-xs text-foreground/60">
                Invoices are preserved securely on encrypted, read-only object storage fulfilling the statutory German commercial archival period (&sect; 147 AO).
              </p>
            </div>
          </div>
        </section>

        {/* 19% VAT & Reverse Charge */}
        <section id="vat-taxation" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Building className="w-5 h-5 text-[var(--text-muted)]" />
            <span>German 19% VAT & EU B2B Reverse Charge</span>
          </h2>
          <p className="text-foreground/80">
            Tax rates are determined based on your billing address and customer classification:
          </p>

          <div className="border border-border rounded-lg overflow-hidden not-prose my-3">
            <table className="w-full text-xs">
              <thead className="bg-foreground/5 text-foreground/70 font-mono border-b border-border text-left">
                <tr>
                  <th className="p-3">Customer Type & Region</th>
                  <th className="p-3">VAT Applied</th>
                  <th className="p-3">Requirements</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-3 font-medium text-foreground">Germany (B2C & B2B)</td>
                  <td className="p-3 font-semibold text-amber-500">19% MwSt. (USt.)</td>
                  <td className="p-3 text-foreground/60">Standard German statutory value-added tax applied to all domestic customers.</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-foreground">European Union B2B (Outside DE)</td>
                  <td className="p-3 font-semibold text-emerald-500">0% (Reverse Charge)</td>
                  <td className="p-3 text-foreground/60">Valid EU VAT ID verified real-time via the European Commission VIES database.</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-foreground">European Union B2C Consumers</td>
                  <td className="p-3 font-semibold text-foreground">Local Country VAT (OSS)</td>
                  <td className="p-3 text-foreground/60">Tax applied based on customer destination EU member state.</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-foreground">International / Non-EU (US, UK, CH, etc.)</td>
                  <td className="p-3 font-semibold text-emerald-500">0% (Export of Services)</td>
                  <td className="p-3 text-foreground/60">Tax-exempt international export transaction.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Callout type="tip" title="VIES VAT ID Validation">
            EU businesses can enter their VAT Identification Number (e.g. <code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">FR12345678901</code>) under <strong>Profile &rarr; Billing</strong>. Once validated against the European VIES gateway, subsequent invoices will automatically display your VAT ID and the mandatory statutory Reverse Charge notice (&sect; 13b UStG / Art. 196 EU VAT Directive).
          </Callout>
        </section>

        {/* Vector PDF Invoices */}
        <section id="pdf-invoices" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[var(--text)]" />
            <span>Downloading Vector PDF Invoices</span>
          </h2>
          <p className="text-foreground/80">
            Every paid or finalized invoice is compiled dynamically using our native Rust vector PDF rendering engine. Invoices feature:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-foreground/80 text-xs">
            <li>High-resolution vector typography with crisp corporate DIN 5008 alignment.</li>
            <li>Detailed itemized breakdowns showing service IDs, billing period dates, net amounts, 19% VAT rate, and gross totals in EUR (&euro;).</li>
            <li>VaultScope fiscal details: Tax office registration, Handelsregister HRB number, USt-IdNr., and SEPA IBAN/BIC banking credentials.</li>
            <li>Cryptographic verification barcode & SHA-256 integrity stamp.</li>
          </ul>
          <p className="text-foreground/80">
            Download your invoices directly by clicking the <strong>Download PDF</strong> button in <strong>Dashboard &rarr; Profile &rarr; Invoices</strong>.
          </p>
        </section>

        {/* Payment Methods */}
        <section id="payment-methods" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-400" />
            <span>Payment Methods & Billing Cycles</span>
          </h2>
          <p className="text-foreground/80">
            VaultScope supports modern automated payment methods for convenience:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 not-prose my-3 text-xs">
            <div className="p-3 border border-border rounded">
              <span className="font-semibold block text-foreground mb-1">Credit & Debit Cards</span>
              <p className="text-foreground/60">Visa, Mastercard, and American Express processed securely via PCI-DSS Level 1 tokenized Stripe Elements.</p>
            </div>
            <div className="p-3 border border-border rounded">
              <span className="font-semibold block text-foreground mb-1">SEPA Direct Debit</span>
              <p className="text-foreground/60">Automated recurring debit mandate for European bank accounts across the SEPA zone.</p>
            </div>
            <div className="p-3 border border-border rounded">
              <span className="font-semibold block text-foreground mb-1">Bank Wire Transfer</span>
              <p className="text-foreground/60">Direct bank transfer for enterprise annual contracts with payment terms up to 14 days net.</p>
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
