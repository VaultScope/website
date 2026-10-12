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
curl -X GET https://api.vaultscope.de/api/v1/services \\
  -H "Authorization: Bearer <AUTHENTIK_ACCESS_TOKEN>" \\
  -H "Accept: application/json"`;

  const orderExample = `curl -X POST https://api.vaultscope.de/api/v1/orders \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "product_id": "vps-kvm-4g",
    "location": "fsn1",
    "billing_period": "monthly",
    "os_image": "ubuntu-24.04",
    "ssh_key_ids": ["key_98a72e81"]
  }'`;

  const errorExample = `{
  "error": "Resource not found",
  "code": "SERVICE_NOT_FOUND",
  "details": {
    "service_id": "srv_88f912",
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
        badge={{ label: 'v1.4 Spec' }}
        description="Technical reference for VAMOS REST endpoints, authentication protocols, rate limiting behavior, and error representations."
        tocItems={TOC}
      />

        <div className="space-y-12 text-sm leading-relaxed">
          {/* Conventions */}
          <section id="overview" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">API Conventions</h2>
            <p className="text-foreground/80">
              The VAMOS REST API is served under <code className="font-mono text-foreground">https://api.vaultscope.de/api</code>. All request bodies must be JSON, and responses are formatted with UTF-8 encoding. Timestamps are formatted per ISO 8601 (<code className="font-mono text-foreground">YYYY-MM-DDTHH:MM:SSZ</code>).
            </p>
          </section>

          {/* Authentication */}
          <section id="auth-headers" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Authentication</h2>
            <p className="text-foreground/80">
              With the exception of public catalog listings and health checks, all endpoints require an HTTP <code className="font-mono text-foreground">Authorization</code> header containing an Authentik-issued Bearer token:
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
              <li><code className="font-mono text-foreground">X-RateLimit-Limit</code>: Maximum allowed requests in the current window (e.g., 120 per minute).</li>
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
            <div className="border border-border rounded-lg overflow-hidden not-prose">
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
                    <td className="px-4 py-2.5 font-mono text-emerald-500 font-bold">GET</td>
                    <td className="px-4 py-2.5 font-mono text-foreground">/api/v1/catalog/products</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/40">Public</td>
                    <td className="px-4 py-2.5 text-foreground/60">List active cloud products, RAM/vCPU specs, and pricing.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono text-blue-500 font-bold">POST</td>
                    <td className="px-4 py-2.5 font-mono text-foreground">/api/v1/orders</td>
                    <td className="px-4 py-2.5 font-mono text-rose-500">Customer</td>
                    <td className="px-4 py-2.5 text-foreground/60">Submit a new server order and generate an unpaid invoice.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono text-emerald-500 font-bold">GET</td>
                    <td className="px-4 py-2.5 font-mono text-foreground">/api/v1/services</td>
                    <td className="px-4 py-2.5 font-mono text-rose-500">Customer</td>
                    <td className="px-4 py-2.5 text-foreground/60">Retrieve all cloud instances owned by the calling user.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono text-blue-500 font-bold">POST</td>
                    <td className="px-4 py-2.5 font-mono text-foreground">/api/v1/services/:id/reboot</td>
                    <td className="px-4 py-2.5 font-mono text-rose-500">Customer</td>
                    <td className="px-4 py-2.5 text-foreground/60">Trigger a graceful ACPI or hard reset on a running VM.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono text-emerald-500 font-bold">GET</td>
                    <td className="px-4 py-2.5 font-mono text-foreground">/api/v1/invoices</td>
                    <td className="px-4 py-2.5 font-mono text-rose-500">Customer</td>
                    <td className="px-4 py-2.5 text-foreground/60">List customer invoices, payment status, and PDF links.</td>
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
            <div className="border border-border rounded-lg overflow-hidden not-prose">
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
                    <td className="px-4 py-2.5 font-mono text-emerald-500 font-bold">GET</td>
                    <td className="px-4 py-2.5 font-mono text-foreground">/api/v1/admin/dashboard</td>
                    <td className="px-4 py-2.5 font-mono text-rose-500">vaultscope-admin</td>
                    <td className="px-4 py-2.5 text-foreground/60">Active node metrics, monthly recurring revenue, and job throughput.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono text-emerald-500 font-bold">GET</td>
                    <td className="px-4 py-2.5 font-mono text-foreground">/api/v1/admin/jobs</td>
                    <td className="px-4 py-2.5 font-mono text-rose-500">vaultscope-admin</td>
                    <td className="px-4 py-2.5 text-foreground/60">Filter and inspect queued, running, and failed background jobs.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono text-blue-500 font-bold">POST</td>
                    <td className="px-4 py-2.5 font-mono text-foreground">/api/v1/admin/jobs/:id/retry</td>
                    <td className="px-4 py-2.5 font-mono text-rose-500">vaultscope-admin</td>
                    <td className="px-4 py-2.5 text-foreground/60">Reset attempt counter and re-queue a failed provisioning task.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono text-emerald-500 font-bold">GET</td>
                    <td className="px-4 py-2.5 font-mono text-foreground">/api/v1/admin/connectors</td>
                    <td className="px-4 py-2.5 font-mono text-rose-500">vaultscope-admin</td>
                    <td className="px-4 py-2.5 text-foreground/60">List configured cloud providers (tokens masked with asterisks).</td>
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
