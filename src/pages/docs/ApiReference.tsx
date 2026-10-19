import { useEffect } from 'react';
import { DocHeader } from './components/DocHeader';
import { DocPagination } from './components/DocPagination';
import { CodeBlock } from './components/CodeBlock';
import { Callout } from './components/Callout';

const TOC = [
  { id: 'overview', label: 'API Conventions' },
  { id: 'auth-headers', label: 'Authentication' },
  { id: 'rate-limits', label: 'Rate Limiting' },
  { id: 'storefront-api', label: 'Storefront Endpoints' },
  { id: 'admin-api', label: 'Admin Endpoints' },
  { id: 'errors', label: 'Error Responses' },
];

export const DocsApiReference = () => {
  useEffect(() => {
    document.title = 'VAMOS REST API Reference — VaultScope Docs';
  }, []);

  const authExample = `# Query customer services with Bearer token
curl -X GET https://api.vaultscope.de/api/storefront/services \\
  -H "Authorization: Bearer <ACCESS_TOKEN>" \\
  -H "Accept: application/json"`;

  const orderExample = `curl -X POST https://api.vaultscope.de/api/storefront/orders \\
  -H "Authorization: Bearer <ACCESS_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "product_id": "0195f8d0-7c4b-7b20-9a10-000000000001",
    "hostname": "node-01.example.com",
    "os_template": "debian-12",
    "billing_cycle": "monthly"
  }'`;

  const errorExample = `{
  "error": "Resource not found",
  "code": "SERVICE_NOT_FOUND",
  "details": {
    "service_id": "0195f8d0-7c4b-7b20-9a10-000000000099",
    "timestamp": "2026-09-16T14:30:00Z"
  }
}`;

  return (
    <div className="space-y-8">
      <DocHeader
        breadcrumbs={[
          { label: 'API Reference' },
        ]}
        title="VAMOS REST API Reference"
        description="Technical reference for VAMOS REST endpoints, authentication headers, rate limiting behavior, and error representations."
        tocItems={TOC}
      />

      <div className="space-y-12 text-sm leading-relaxed">
        {/* Conventions */}
        <section id="overview" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight">API Conventions</h2>
          <p className="text-foreground/80">
            The VAMOS REST API is served under <code className="font-mono text-foreground">https://api.vaultscope.de/api</code>. All request bodies must be JSON, and responses are formatted with UTF-8 encoding. Timestamps are formatted per ISO 8601 (<code className="font-mono text-foreground">YYYY-MM-DDTHH:MM:SSZ</code>), and monetary values are serialized as decimal strings.
          </p>
        </section>

        {/* Authentication */}
        <section id="auth-headers" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight">Authentication</h2>
          <p className="text-foreground/80">
            With the exception of public catalog listings and health checks, all endpoints require an HTTP <code className="font-mono text-foreground">Authorization</code> header containing a valid Bearer token:
          </p>
          <CodeBlock
            code={authExample}
            language="bash"
            title="Authenticate with Bearer Token"
          />
        </section>

        {/* Rate Limits */}
        <section id="rate-limits" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight">Rate Limiting</h2>
          <p className="text-foreground/80">
            VAMOS utilizes a distributed token bucket algorithm backed by Redis. Responses include standard rate limiting headers:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-foreground/70">
            <li><code className="font-mono text-foreground">X-RateLimit-Limit</code>: Maximum allowed requests in the current window.</li>
            <li><code className="font-mono text-foreground">X-RateLimit-Remaining</code>: Number of requests left in the active window.</li>
            <li><code className="font-mono text-foreground">X-RateLimit-Reset</code>: Epoch timestamp (in seconds) when the bucket refills.</li>
          </ul>
          <Callout type="warning" title="HTTP 429 Too Many Requests">
            Clients exceeding the rate quota will receive an HTTP 429 status code with a <code className="font-mono text-foreground">Retry-After</code> header in seconds.
          </Callout>
        </section>

        {/* Storefront Endpoints */}
        <section id="storefront-api" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight">Storefront Endpoints</h2>
          <div className="border border-border overflow-hidden not-prose">
            <table className="w-full text-xs text-left">
              <thead className="bg-foreground/[0.03] border-b border-border text-foreground/60 font-mono">
                <tr>
                  <th className="px-4 py-2.5">Method</th>
                  <th className="px-4 py-2.5">Path</th>
                  <th className="px-4 py-2.5">Auth</th>
                  <th className="px-4 py-2.5">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground/80">
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">GET</td>
                  <td className="px-4 py-2.5 font-mono text-foreground">/api/storefront/catalog</td>
                  <td className="px-4 py-2.5 font-mono text-foreground/50">Public</td>
                  <td className="px-4 py-2.5 text-foreground/70">List published products, hardware specifications, and net EUR pricing.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-foreground font-bold">POST</td>
                  <td className="px-4 py-2.5 font-mono text-foreground">/api/storefront/orders</td>
                  <td className="px-4 py-2.5 font-mono text-foreground/70">Customer</td>
                  <td className="px-4 py-2.5 text-foreground/70">Submit a new order and initiate payment/provisioning workflow.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">GET</td>
                  <td className="px-4 py-2.5 font-mono text-foreground">/api/storefront/services</td>
                  <td className="px-4 py-2.5 font-mono text-foreground/70">Customer</td>
                  <td className="px-4 py-2.5 text-foreground/70">Retrieve all active and pending infrastructure services for the authenticated account.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-foreground font-bold">POST</td>
                  <td className="px-4 py-2.5 font-mono text-foreground">/api/storefront/services/:id/restart</td>
                  <td className="px-4 py-2.5 font-mono text-foreground/70">Customer</td>
                  <td className="px-4 py-2.5 text-foreground/70">Execute power or lifecycle actions (start, stop, restart, reinstall, cancel).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">GET</td>
                  <td className="px-4 py-2.5 font-mono text-foreground">/api/storefront/invoices</td>
                  <td className="px-4 py-2.5 font-mono text-foreground/70">Customer</td>
                  <td className="px-4 py-2.5 text-foreground/70">List customer invoices, payment status, and downloadable PDF documents.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">GET</td>
                  <td className="px-4 py-2.5 font-mono text-foreground">/api/storefront/tickets</td>
                  <td className="px-4 py-2.5 font-mono text-foreground/70">Customer</td>
                  <td className="px-4 py-2.5 text-foreground/70">List and manage customer support tickets and replies.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <CodeBlock
            code={orderExample}
            language="bash"
            title="Create Order Example"
          />
        </section>

        {/* Admin Endpoints */}
        <section id="admin-api" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight">CAMOS Admin Endpoints</h2>
          <div className="border border-border overflow-hidden not-prose">
            <table className="w-full text-xs text-left">
              <thead className="bg-foreground/[0.03] border-b border-border text-foreground/60 font-mono">
                <tr>
                  <th className="px-4 py-2.5">Method</th>
                  <th className="px-4 py-2.5">Path</th>
                  <th className="px-4 py-2.5">Required Role</th>
                  <th className="px-4 py-2.5">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground/80">
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">GET</td>
                  <td className="px-4 py-2.5 font-mono text-foreground">/api/admin/dashboard</td>
                  <td className="px-4 py-2.5 font-mono text-foreground/70">vaultscope-admin</td>
                  <td className="px-4 py-2.5 text-foreground/70">Aggregate platform metrics, revenue summary, and job queue counters.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">GET</td>
                  <td className="px-4 py-2.5 font-mono text-foreground">/api/admin/jobs</td>
                  <td className="px-4 py-2.5 font-mono text-foreground/70">vaultscope-admin</td>
                  <td className="px-4 py-2.5 text-foreground/70">Filter and inspect queued, running, and failed background provisioning jobs.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">GET</td>
                  <td className="px-4 py-2.5 font-mono text-foreground">/api/admin/audit</td>
                  <td className="px-4 py-2.5 font-mono text-foreground/70">vaultscope-admin</td>
                  <td className="px-4 py-2.5 text-foreground/70">Inspect platform audit logs and administrative security events.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">GET</td>
                  <td className="px-4 py-2.5 font-mono text-foreground">/api/admin/connectors</td>
                  <td className="px-4 py-2.5 font-mono text-foreground/70">vaultscope-admin</td>
                  <td className="px-4 py-2.5 text-foreground/70">List configured cloud provider connectors (credentials masked at rest).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Errors */}
        <section id="errors" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight">Error Representation</h2>
          <p className="text-foreground/80">
            When an API request fails, VAMOS returns an appropriate HTTP 4xx or 5xx status code with a deterministic error object:
          </p>
          <CodeBlock
            code={errorExample}
            language="json"
            title="Standard Error JSON"
          />
        </section>

        <DocPagination
          prev={{ title: 'Authentik OIDC Setup', path: '/docs/authentik' }}
          next={{ title: 'Production Runbooks', path: '/docs/runbooks' }}
        />
      </div>
    </div>
  );
};
