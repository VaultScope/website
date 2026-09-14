import { useEffect } from 'react';

export const DocsStorefront = () => {
  useEffect(() => {
    document.title = "Customer Experience Documentation — VaultScope";
  }, []);

  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-foreground mb-6">Customer Experience (Storefront)</h1>
      <p className="text-xl text-foreground/50 font-light mb-12">Deep dive into the VaultScope customer-facing web application.</p>

      <h2>Overview</h2>
      <p>The VaultScope Storefront is built using modern web technologies including React 18, Vite, React Router v6, and Tailwind CSS. It is designed to be highly responsive, accessible, and fast, offering a frictionless user experience from product browsing to post-deployment management.</p>
      
      <h2>Dynamic Product Catalog</h2>
      <p>The storefront queries the VAMOS API in real-time to display the most up-to-date product configurations, stock availability, and pricing. Products are dynamically categorized into Cloud (VPS), Dedicated, and Managed solutions, allowing customers to easily filter and select the infrastructure that meets their exact needs.</p>
      
      <h2>Automated Ordering Workflow</h2>
      <p>When a customer selects a product, they are guided through a step-by-step configuration wizard. This wizard collects all necessary deployment parameters (e.g., Operating System, Region, SSH Keys) and calculates the final pricing dynamically. Once the order is confirmed, the application interfaces securely with Stripe for payment processing.</p>
      
      <h2>Customer Dashboard</h2>
      <p>Upon successful authentication, users are redirected to their centralized dashboard. The dashboard provides comprehensive management capabilities:</p>
      <ul>
        <li><strong>Service Monitoring:</strong> Real-time status indicators (provisioning, active, suspended) for all deployed infrastructure.</li>
        <li><strong>Instance Management:</strong> Actions such as rebooting, rebuilding, and accessing the console of VPS and Dedicated servers.</li>
        <li><strong>Financials:</strong> Viewing past invoices, current billing cycles, and managing payment methods via the Stripe Billing Portal.</li>
        <li><strong>Support Tickets:</strong> A built-in ticketing system allowing customers to open new inquiries and communicate directly with support staff.</li>
        <li><strong>Profile & Security:</strong> Managing personal information and enforcing Multi-Factor Authentication (MFA).</li>
      </ul>

      <h2>Authentication & Security Implementation</h2>
      <p>The frontend relies entirely on VAMOS for authentication state. It uses secure HTTP-only cookies to store session tokens, mitigating XSS risks. Additionally, every mutating request includes an `axum_csrf` token to prevent Cross-Site Request Forgery attacks.</p>
    </div>
  );
};
