import { useEffect } from 'react';
import { DocHeader } from '../components/DocHeader';
import { DocPagination } from '../components/DocPagination';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

const TOC = [
  { id: 'env-matrix', label: 'Environment Variables' },
  { id: 'sample-env', label: 'Sample .env File' },
  { id: 'secrets-security', label: 'Secret Key Management' },
  { id: 'db-tuning', label: 'Database Connection Pool' },
  { id: 'job-queues', label: 'Job Worker Concurrency' },
];

export const VamosConfig = () => {
  useEffect(() => {
    document.title = 'VAMOS Configuration — VaultScope Docs';
  }, []);

  const sampleEnv = `# ==============================================================================
# VAMOS Backend Configuration
# ==============================================================================

# HTTP Server Listener
PORT=3000
BIND_ADDR=0.0.0.0
BASE_URL=https://api.vaultscope.de

# PostgreSQL Database (SQLx Connection Pool)
DATABASE_URL=postgres://vamos_user:SecurePass123!@localhost:5432/vaultscope
DB_MAX_CONNECTIONS=20
DB_MIN_CONNECTIONS=5

# Redis Distributed Cache & Rate Limiter
REDIS_URL=redis://127.0.0.1:6379/0

# Cryptography & Security Secrets
# Generate via: openssl rand -base64 64
JWT_SECRET=c29tZXNlY3JldGtleXRvYmVyZXBsYWNlZGluYXBw...
# Generate via: openssl rand -base64 32 (AES-256-GCM)
ENCRYPTION_KEY=MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI=

# Authentik OIDC Federation
AUTHENTIK_ISSUER_URL=https://auth.vaultscope.de/application/o/vaultscope/
AUTHENTIK_CLIENT_ID=vaultscope-backend
AUTHENTIK_AUDIENCE=vaultscope

# Worker Queue Configuration
JOB_WORKER_CONCURRENCY=8
JOB_POLL_INTERVAL_MS=1000

# Tracing & Logging (RUST_LOG)
RUST_LOG=info,vamos_api=debug,vamos_jobs=debug,sqlx=warn`;

  return (
    <div className="space-y-8">
      <DocHeader
        breadcrumbs={[
          { label: 'Projects', path: '/docs/projects' },
          { label: 'VAMOS', path: '/docs/projects/vamos' },
          { label: 'Configuration' },
        ]}
        title="VAMOS Configuration"
        badge={{ label: 'Engine Reference' }}
        description="Configuration matrix for database connection pooling, AES-256-GCM encryption secrets, Authentik OIDC validation, and background worker queues."
        projectKey="vamos"
        tocItems={TOC}
      />

        <div className="space-y-12 text-sm leading-relaxed">
          {/* Variables Table */}
          <section id="env-matrix" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Configuration Matrix</h2>
            <p className="text-foreground/80">
              VAMOS reads its configuration on startup from the host environment or a local <code className="font-mono text-foreground">.env</code> file. Missing required keys will cause the binary to fail fast with structured error messages.
            </p>

            <div className="border border-border rounded-lg overflow-hidden not-prose">
              <table className="w-full text-xs text-left">
                <thead className="bg-foreground/[0.03] border-b border-border text-foreground/60 font-mono">
                  <tr>
                    <th className="px-4 py-2.5">Variable</th>
                    <th className="px-4 py-2.5">Required</th>
                    <th className="px-4 py-2.5">Default / Format</th>
                    <th className="px-4 py-2.5">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground/80">
                  <tr>
                    <td className="px-4 py-2.5 font-mono font-medium text-foreground">DATABASE_URL</td>
                    <td className="px-4 py-2.5 font-mono text-rose-500 font-semibold">Yes</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">postgres://...</td>
                    <td className="px-4 py-2.5 text-foreground/60">Full PostgreSQL DSN connection string with credentials.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono font-medium text-foreground">REDIS_URL</td>
                    <td className="px-4 py-2.5 font-mono text-amber-500 font-semibold">Recommended</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">redis://127.0.0.1:6379/0</td>
                    <td className="px-4 py-2.5 text-foreground/60">Redis endpoint for token blacklisting and rate limits.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono font-medium text-foreground">JWT_SECRET</td>
                    <td className="px-4 py-2.5 font-mono text-rose-500 font-semibold">Yes</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">Base64 string (&ge; 64 bytes)</td>
                    <td className="px-4 py-2.5 text-foreground/60">HMAC-SHA256 signature key for internal session tokens.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono font-medium text-foreground">ENCRYPTION_KEY</td>
                    <td className="px-4 py-2.5 font-mono text-rose-500 font-semibold">Yes</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">Base64 string (32 bytes)</td>
                    <td className="px-4 py-2.5 text-foreground/60">AES-256-GCM master key used to encrypt provider API tokens.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono font-medium text-foreground">AUTHENTIK_ISSUER_URL</td>
                    <td className="px-4 py-2.5 font-mono text-rose-500 font-semibold">Yes</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">https://auth.../application/o/...</td>
                    <td className="px-4 py-2.5 text-foreground/60">OIDC discovery endpoint to validate Authentik JWTs.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono font-medium text-foreground">JOB_WORKER_CONCURRENCY</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/40">Optional</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">4</td>
                    <td className="px-4 py-2.5 text-foreground/60">Number of concurrent Tokio worker threads for background jobs.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Sample Env */}
          <section id="sample-env" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Production .env Specification</h2>
            <p className="text-foreground/80">
              Save the following template into your deployment directory:
            </p>
            <CodeBlock
              code={sampleEnv}
              language="ini"
              title="/opt/vaultscope/vamos/.env"
            />
          </section>

          {/* Secrets Management */}
          <section id="secrets-security" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Secret Key Management</h2>
            <p className="text-foreground/80">
              Never use default or placeholder keys in production. Both <code className="font-mono text-foreground">JWT_SECRET</code> and <code className="font-mono text-foreground">ENCRYPTION_KEY</code> must be randomly generated:
            </p>
            <CodeBlock
              code={`# 64-byte JWT secret\nopenssl rand -base64 64\n\n# 32-byte (256-bit) AES-GCM encryption key\nopenssl rand -base64 32`}
              language="bash"
              title="Generate Cryptographic Keys"
            />
            <Callout type="danger" title="Key Loss Warning">
              If <code className="font-mono text-foreground">ENCRYPTION_KEY</code> is lost or changed, previously encrypted provider tokens (such as Hetzner Cloud API keys) cannot be decrypted and must be re-entered through CAMOS.
            </Callout>
          </section>

          {/* DB Tuning */}
          <section id="db-tuning" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Database Connection Pool Tuning</h2>
            <p className="text-foreground/80">
              VAMOS uses SQLx asynchronous connection pools. In high-traffic deployments, tune <code className="font-mono text-foreground">DB_MAX_CONNECTIONS</code> to roughly 70% of your PostgreSQL <code className="font-mono text-foreground">max_connections</code> setting to leave headroom for background cron workers and administrative migrations.
            </p>
          </section>

          {/* Job Queues */}
          <section id="job-queues" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Job Worker Concurrency</h2>
            <p className="text-foreground/80">
              The <code className="font-mono text-foreground">JOB_WORKER_CONCURRENCY</code> controls how many server provisioning or cancellation jobs run simultaneously. For nodes managing 500+ cloud instances, set this to 8 or 16 workers.
            </p>
          </section>

          <DocPagination
            prev={{ title: 'VAMOS Installation', path: '/docs/projects/vamos/install' }}
            next={{ title: 'VAMOS Lifecycle & Upgrades', path: '/docs/projects/vamos/lifecycle' }}
          />
        </div>
    </div>
  );
};
