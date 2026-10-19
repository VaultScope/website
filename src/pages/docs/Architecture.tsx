import { useEffect } from 'react';
import { DocHeader } from './components/DocHeader';
import { DocPagination } from './components/DocPagination';
import { CodeBlock } from './components/CodeBlock';
import { Layers, Zap, Database, Cpu } from 'lucide-react';

const TOC = [
  { id: 'overview', label: 'Ecosystem Architecture' },
  { id: 'components', label: 'System Components' },
  { id: 'data-flow', label: 'Provisioning Lifecycle Flow' },
  { id: 'security-boundaries', label: 'Security Boundaries' },
  { id: 'network-topology', label: 'Network & Port Topology' },
];

export const DocsArchitecture = () => {
  useEffect(() => {
    document.title = 'System Architecture — VaultScope Docs';
  }, []);

  return (
    <div className="space-y-8">
      <DocHeader
        breadcrumbs={[
          { label: 'Architecture' },
        ]}
        title="System Architecture & Data Flow"
        badge={{ label: 'Architecture Deep-Dive' }}
        description="High-level engineering design of the VaultScope ecosystem, detailing inter-service communication, asynchronous job execution, and cloud connector security."
        tocItems={TOC}
      />

        <div className="space-y-12 text-sm leading-relaxed">
          {/* Ecosystem Architecture */}
          <section id="overview" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Ecosystem Architecture</h2>
            <p className="text-foreground/80">
              VaultScope is architected as a decoupled, multi-tier hosting automation and infrastructure orchestration platform. Rather than a monolithic application, it separates client experiences, administrative operations, REST API routing, and asynchronous background worker daemons into purpose-built systems.
            </p>

            {/* Architecture Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-6">
              <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
                <div className="flex items-center gap-2 mb-2 text-foreground font-medium text-sm">
                  <Layers className="w-4 h-4 text-[var(--text-muted)]" />
                  <span>Client Tier (Storefront & CAMOS)</span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Decoupled Single Page Applications built with React 19 and compiled with Vite. Served via high-performance web servers (Caddy for Storefront, Nginx for CAMOS) with zero direct database exposure.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
                <div className="flex items-center gap-2 mb-2 text-foreground font-medium text-sm">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Central Brain (VAMOS Axum API)</span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Asynchronous Rust Axum gateway executing business logic, payment verifications, token parsing, and dispatching tasks to transactional PostgreSQL queues.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
                <div className="flex items-center gap-2 mb-2 text-foreground font-medium text-sm">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>State & Cache Tier (Postgres & Redis)</span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  PostgreSQL 16 as the ACID source of truth for services, invoices, and job queues. Redis 7 providing sub-millisecond distributed rate limiting and token validation cache.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
                <div className="flex items-center gap-2 mb-2 text-foreground font-medium text-sm">
                  <Cpu className="w-4 h-4 text-[var(--text)]" />
                  <span>Orchestration Tier (JobRunner & Connectors)</span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Tokio-driven background workers polling job tables to execute multi-step provisioning tasks against upstream providers (Hetzner Cloud, OVH, Proxmox) with AES-256-GCM encrypted credentials.
                </p>
              </div>
            </div>
          </section>

          {/* Components */}
          <section id="components" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">System Components</h2>
            <div className="border border-border rounded-lg overflow-hidden not-prose">
              <table className="w-full text-xs text-left">
                <thead className="bg-foreground/[0.03] border-b border-border text-foreground/60 font-mono">
                  <tr>
                    <th className="px-4 py-2.5">Component</th>
                    <th className="px-4 py-2.5">Runtime</th>
                    <th className="px-4 py-2.5">Protocol / Ports</th>
                    <th className="px-4 py-2.5">Access Scope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground/80">
                  <tr>
                    <td className="px-4 py-2.5 font-medium">Storefront</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">React 19 / Caddy</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">HTTPS (443) / HTTP/3</td>
                    <td className="px-4 py-2.5 text-foreground/60">Public Internet</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium">CAMOS Admin</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">React 19 / Nginx</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">HTTPS (443)</td>
                    <td className="px-4 py-2.5 text-foreground/60">VPN / Allowlisted IP</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium">VAMOS API</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">Rust / Tokio</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">HTTP (3000)</td>
                    <td className="px-4 py-2.5 text-foreground/60">Reverse Proxy / Internal</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium">VAMOS JobRunner</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">Rust / Tokio</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">Internal Daemon</td>
                    <td className="px-4 py-2.5 text-foreground/60">DB & Upstream Cloud APIs</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium">PostgreSQL</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">PostgreSQL 16</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">TCP (5432)</td>
                    <td className="px-4 py-2.5 text-foreground/60">Localhost / Private Network</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium">Redis</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">Redis 7</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">TCP (6379)</td>
                    <td className="px-4 py-2.5 text-foreground/60">Localhost / Private Network</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Provisioning Flow */}
          <section id="data-flow" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Provisioning Lifecycle Flow</h2>
            <p className="text-foreground/80">
              When a customer orders a cloud server on the Storefront, the request transitions through deterministic state changes:
            </p>

            <div className="space-y-3 not-prose">
              <div className="p-3.5 rounded-lg border border-border bg-foreground/[0.01] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-foreground/10 text-foreground font-mono text-xs flex items-center justify-center shrink-0">1</span>
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">Order Creation</h4>
                  <p className="text-xs text-foreground/70 mt-0.5">
                    Customer selects server specifications (location, OS, SSH key) in Storefront. Storefront dispatches <code className="font-mono text-foreground">POST /api/v1/orders</code> to VAMOS with the customer's Authentik bearer token.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-border bg-foreground/[0.01] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-foreground/10 text-foreground font-mono text-xs flex items-center justify-center shrink-0">2</span>
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">Invoice Generation & Payment</h4>
                  <p className="text-xs text-foreground/70 mt-0.5">
                    VAMOS validates coupons and tax rates, writes an invoice record to PostgreSQL, and initializes Stripe payment intent. Upon webhook confirmation, invoice transitions to <code className="font-mono text-foreground">PAID</code>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-border bg-foreground/[0.01] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-foreground/10 text-foreground font-mono text-xs flex items-center justify-center shrink-0">3</span>
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">Job Queue Enqueueing</h4>
                  <p className="text-xs text-foreground/70 mt-0.5">
                    VAMOS creates a service record in <code className="font-mono text-foreground">PROVISIONING</code> state and inserts a new task row into the <code className="font-mono text-foreground">jobs</code> table containing payload parameters (flavor, location, public SSH keys).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-border bg-foreground/[0.01] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-foreground/10 text-foreground font-mono text-xs flex items-center justify-center shrink-0">4</span>
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">Tokio Worker Execution & Connector Dispatch</h4>
                  <p className="text-xs text-foreground/70 mt-0.5">
                    The background JobRunner locks the job, retrieves the Hetzner Cloud API token, decrypts it using AES-256-GCM, and invokes <code className="font-mono text-foreground">HetznerCloudConnector::create_server</code>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-border bg-foreground/[0.01] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-foreground/10 text-foreground font-mono text-xs flex items-center justify-center shrink-0">5</span>
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">Completion & Live Telemetry</h4>
                  <p className="text-xs text-foreground/70 mt-0.5">
                    Upon Hetzner API confirmation, the IP address and server ID are recorded, the service status flips to <code className="font-mono text-foreground">ACTIVE</code>, and the customer receives an automated welcome email with access details.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Security Boundaries */}
          <section id="security-boundaries" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Security Boundaries</h2>
            <p className="text-foreground/80">
              The platform enforces defense-in-depth isolation across all tiers:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-foreground/70">
              <li><strong>Zero Direct DB Access:</strong> Storefront and CAMOS never connect directly to PostgreSQL or Redis; all data operations pass through authenticated VAMOS endpoints.</li>
              <li><strong>Encrypted Secret Store:</strong> Provider credentials stored in the database are encrypted at rest with authenticated AES-256-GCM. An attacker with raw SQL read access cannot decipher upstream API tokens without the host encryption key.</li>
              <li><strong>Separation of Staff & Customer Contexts:</strong> Authentik roles strictly partition customer tokens from staff tokens. Admin endpoints reject requests missing the required claims.</li>
            </ul>
          </section>

          {/* Network Topology */}
          <section id="network-topology" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Network & Port Topology</h2>
            <CodeBlock
              code={`+--------------------+       +--------------------+
|  Storefront (443)  |       |   CAMOS Admin (443)| (VPN Restricted)
+---------+----------+       +---------+----------+
          |                            |
          +------------+   +-----------+
                       |   |
                  HTTPS / JSON
                       |   |
                       v   v
            +----------------------+
            |   VAMOS API (:3000)   |
            +----------+-----------+
                       |
        +--------------+---------------+
        |                              |
        v                              v
+---------------+             +----------------+
| Postgres:5432 |             |   Redis:6379   |
+---------------+             +----------------+
        ^
        | Poll Jobs
+-------+--------------+
|   VAMOS JobRunner    | ----(AES-256-GCM Decrypt)----> Hetzner / Upstream Cloud
+----------------------+`}
              language="text"
              title="System Network Topology"
            />
          </section>

          <DocPagination
            prev={{ title: 'Projects Hub', path: '/docs/projects' }}
            next={{ title: 'Authentik OIDC Setup', path: '/docs/authentik' }}
          />
        </div>
    </div>
  );
};
