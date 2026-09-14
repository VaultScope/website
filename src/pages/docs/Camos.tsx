import { useEffect } from 'react';

export const DocsCamos = () => {
  useEffect(() => {
    document.title = "CAMOS Documentation — VaultScope";
  }, []);

  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-foreground mb-6">CAMOS (Admin Panel)</h1>
      <p className="text-xl text-foreground/50 font-light mb-12">Guide to the Client Administration & Management Operations System.</p>

      <h2>Overview</h2>
      <p>CAMOS is the internal control plane for the VaultScope ecosystem. Built as a separate React application, it provides staff with the tools necessary to manage the entire platform without requiring direct database access.</p>
      
      <h2>Product & Catalog Management</h2>
      <p>Through CAMOS, administrators can dynamically shape the storefront offerings. This includes:</p>
      <ul>
        <li>Creating and deprecating product plans (VPS, Dedicated, etc.).</li>
        <li>Setting pricing, billing cycles, and promotional discounts.</li>
        <li>Mapping product plans to specific upstream providers (e.g., linking a "Cloud-Basic" plan to a Hetzner CX11 instance).</li>
      </ul>

      <h2>Service & Infrastructure Oversight</h2>
      <p>Staff have a global view of all deployed infrastructure across the ecosystem. Key capabilities include:</p>
      <ul>
        <li>Monitoring the health and provisioning status of all instances.</li>
        <li>Executing administrative overrides, such as manual suspensions, unsuspensions, or forced rebuilds.</li>
        <li>Viewing detailed logs from the VAMOS JobRunner to troubleshoot failed provisioning attempts.</li>
      </ul>

      <h2>Customer Support & Ticketing</h2>
      <p>CAMOS features a fully integrated support desk. Staff can view incoming tickets, categorize them (Support, Abuse, Billing), and respond directly to customers. The system also supports internal notes and ticket escalation pathways.</p>

      <h2>Financial & Billing Management</h2>
      <p>Administrators with billing permissions can oversee the financial health of the platform. This includes viewing aggregate MRR (Monthly Recurring Revenue), managing individual customer invoices, issuing manual refunds via Stripe, and applying account credits.</p>

      <h2>Security & Access Control</h2>
      <p>Access to CAMOS is strictly governed by the VAMOS RBAC system. The UI dynamically adapts based on the authenticated staff member's permissions. For example, a support agent without billing permissions will not see the Financials tab, and any manual attempts to hit the API endpoints will be rejected by VAMOS.</p>
    </div>
  );
};
