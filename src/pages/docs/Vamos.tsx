import { useEffect } from 'react';

export const DocsVamos = () => {
  useEffect(() => {
    document.title = "VAMOS Documentation — VaultScope";
  }, []);

  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-foreground mb-6">VAMOS (API & Backend)</h1>
      <p className="text-xl text-foreground/50 font-light mb-12">Detailed architecture and operational mechanics of the VaultScope API Management & Operations System.</p>

      <h2>Architecture Overview</h2>
      <p>VAMOS is engineered in Rust to maximize performance, ensure memory safety, and handle highly concurrent workloads. It utilizes the Axum web framework for robust routing and middleware support, and SQLx for compile-time verified database interactions with PostgreSQL.</p>
      
      <h2>Centralized API Gateway</h2>
      <p>VAMOS acts as the sole communication layer for the entire ecosystem. It exposes distinct RESTful endpoint groups:</p>
      <ul>
        <li><code>/api/public/*</code> - Unauthenticated endpoints for the storefront catalog and webhook ingestions.</li>
        <li><code>/api/customer/*</code> - Endpoints requiring a valid customer session.</li>
        <li><code>/api/admin/*</code> - Highly restricted endpoints requiring staff authentication and specific RBAC permissions.</li>
      </ul>

      <h2>The Provisioning Engine (JobRunner)</h2>
      <p>One of the most critical components of VAMOS is the background <code>JobRunner</code> daemon. This asynchronous worker polls the database for pending jobs (e.g., Server Provisioning, OS Reinstallation, Suspension) and executes them.</p>
      <p>The JobRunner contains provider-specific connectors (e.g., Hetzner Cloud API, OVH API, Proxmox VE). When a provisioning task is picked up, it securely decrypts the necessary API keys using AES-256-GCM and makes the external requests to spin up the required infrastructure, updating the local database state upon completion.</p>

      <h2>Database Schema & Data Integrity</h2>
      <p>VAMOS relies on a robust PostgreSQL relational model. Key tables include:</p>
      <ul>
        <li><code>users</code> & <code>staff</code> - Handling authentication and roles.</li>
        <li><code>products</code> & <code>categories</code> - Defining the available infrastructure plans.</li>
        <li><code>services</code> & <code>instances</code> - Mapping customer purchases to actual upstream provider IDs.</li>
        <li><code>jobs</code> - The queue system for the JobRunner.</li>
        <li><code>invoices</code> & <code>transactions</code> - Financial ledgers synced with Stripe.</li>
      </ul>

      <h2>Security & Compliance Mechanisms</h2>
      <p>VAMOS enforces strict security protocols:</p>
      <ul>
        <li><strong>Role-Based Access Control (RBAC):</strong> Every admin endpoint is protected by middleware that checks the staff member's specific permissions (e.g., <code>can_view_billing</code>, <code>can_manage_infrastructure</code>).</li>
        <li><strong>Encryption at Rest:</strong> All sensitive configurations and upstream API keys are stored in the database in an encrypted format. They are only decrypted in memory during the execution of a background task.</li>
        <li><strong>Rate Limiting:</strong> Essential endpoints, particularly authentication and public forms, are rate-limited using a Redis-backed token bucket algorithm to prevent brute-force and DDoS attacks.</li>
      </ul>
    </div>
  );
};
