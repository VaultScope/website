import { useEffect } from 'react';
import { DocHeader } from './components/DocHeader';
import { DocPagination } from './components/DocPagination';
import { CodeBlock } from './components/CodeBlock';

const TOC = [
  { id: 'cron-backups', label: '1. Automated DB Backups' },
  { id: 'job-triage', label: '2. Job Queue Triage' },
  { id: 'ssl-certificates', label: '3. SSL / ACME Triage' },
  { id: 'log-inspection', label: '4. Telemetry & Log Inspection' },
  { id: 'incident-checklist', label: '5. Incident Response Checklist' },
];

export const DocsRunbooks = () => {
  useEffect(() => {
    document.title = 'Production Operations Runbooks — VaultScope Docs';
  }, []);

  const cronScript = `#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/var/backups/vaultscope"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="$BACKUP_DIR/vamos_backup_$TIMESTAMP.dump"

mkdir -p "$BACKUP_DIR"

# 1. Take compressed custom PostgreSQL dump
pg_dump -U postgres -d vaultscope -Fc -f "$FILENAME"

# 2. Prune local backups older than 14 days
find "$BACKUP_DIR" -name "vamos_backup_*.dump" -mtime +14 -delete

# 3. (Optional) Sync to remote S3-compatible bucket
# aws s3 cp "$FILENAME" "s3://vaultscope-offsite-backups/db/"`;

  const jobSql = `-- Find all failed jobs in the last 24 hours
SELECT id, job_type, attempts, last_error, updated_at
FROM jobs
WHERE status = 'failed'
ORDER BY updated_at DESC
LIMIT 20;

-- Manually re-queue a stuck or failed job
UPDATE jobs
SET status = 'queued', attempts = 0, last_error = NULL, updated_at = NOW()
WHERE id = 'job_98a2f140';`;

  const journalSnippet = `# Stream live VAMOS API logs with error filtering
sudo journalctl -u vamos -f -p err..emerg

# Search for specific Hetzner Cloud API errors
sudo journalctl -u vamos --since "1 hour ago" | grep -i "hetzner"`;

  return (
    <div className="space-y-8">
      <DocHeader
        breadcrumbs={[
          { label: 'Runbooks' },
        ]}
        title="Production Operations Runbooks"
        badge={{ label: 'Operations & SRE' }}
        description="Standard operating procedures, disaster recovery scripts, job queue troubleshooting, and diagnostic workflows for on-call engineers."
        tocItems={TOC}
      />

        <div className="space-y-12 text-sm leading-relaxed">
          {/* Automated DB Backups */}
          <section id="cron-backups" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">1. Automated Database Backups</h2>
            <p className="text-foreground/80">
              Save the following bash script to <code className="font-mono text-foreground">/usr/local/bin/vaultscope-backup.sh</code> and configure executable permissions (<code className="font-mono text-foreground">chmod +x</code>):
            </p>
            <CodeBlock
              code={cronScript}
              language="bash"
              title="/usr/local/bin/vaultscope-backup.sh"
            />
            <p className="text-foreground/80">
              Install a nightly cron job under root crontab (<code className="font-mono text-foreground">crontab -e</code>):
            </p>
            <CodeBlock
              code="0 2 * * * /usr/local/bin/vaultscope-backup.sh >> /var/log/vaultscope-backup.log 2>&1"
              language="cron"
              title="Nightly Backup Cron"
            />
          </section>

          {/* Job Queue Triage */}
          <section id="job-triage" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">2. Job Queue Triage & Failure Recovery</h2>
            <p className="text-foreground/80">
              When an upstream cloud provider API (such as Hetzner Cloud) suffers an outage, provisioning tasks will exhaust their retry quota and enter the <code className="font-mono text-foreground">failed</code> state.
            </p>
            <p className="text-foreground/80">
              Operators can inspect failed jobs directly in the CAMOS UI under <strong>System &rarr; Job Queue</strong>, or query the database directly via SQL:
            </p>
            <CodeBlock
              code={jobSql}
              language="sql"
              title="PostgreSQL Job Queue Diagnostics"
            />
          </section>

          {/* SSL ACME */}
          <section id="ssl-certificates" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">3. SSL Certificate & ACME Triage</h2>
            <p className="text-foreground/80">
              Caddy automatically provisions Let's Encrypt certificates for the Storefront. If a certificate fails to renew:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-foreground/70">
              <li>Verify that port 80 and 443 are unobstructed by host firewalls: <code className="font-mono text-foreground">sudo ufw status</code>.</li>
              <li>Verify DNS propagation for domain A and AAAA records: <code className="font-mono text-foreground">dig +short A vaultscope.de</code>.</li>
              <li>Inspect Caddy internal TLS logs: <code className="font-mono text-foreground">docker logs vaultscope-storefront | grep tls</code>.</li>
            </ul>
          </section>

          {/* Log Inspection */}
          <section id="log-inspection" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">4. Telemetry & Log Inspection</h2>
            <p className="text-foreground/80">
              VAMOS utilizes Tokio's <code className="font-mono text-foreground">tracing</code> ecosystem. Logs are emitted to standard output in structured JSON or human-readable format according to the <code className="font-mono text-foreground">RUST_LOG</code> configuration:
            </p>
            <CodeBlock
              code={journalSnippet}
              language="bash"
              title="Systemd Journal Queries"
            />
          </section>

          {/* Incident Response Checklist */}
          <section id="incident-checklist" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">5. Incident Response Checklist</h2>
            <div className="border border-border rounded-lg p-4 bg-foreground/[0.01] space-y-2 not-prose text-xs">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Severity 1: Complete Storefront or API Outage</span>
              </div>
              <ol className="list-decimal pl-5 space-y-1 text-foreground/70 leading-relaxed">
                <li>Check VAMOS daemon status: <code className="font-mono">sudo systemctl status vamos</code>.</li>
                <li>Check PostgreSQL connection limit: <code className="font-mono">SELECT count(*) FROM pg_stat_activity;</code>.</li>
                <li>Check Redis memory consumption: <code className="font-mono">redis-cli info memory</code>.</li>
                <li>Check host disk space and inode exhaustion: <code className="font-mono">df -h && df -i</code>.</li>
              </ol>
            </div>
          </section>

          <DocPagination
            prev={{ title: 'VAMOS API Reference', path: '/docs/api' }}
            next={{ title: 'Projects Hub', path: '/docs/projects' }}
          />
        </div>
    </div>
  );
};
