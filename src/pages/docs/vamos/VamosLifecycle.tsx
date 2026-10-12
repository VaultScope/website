import { useEffect } from 'react';
import { DocHeader } from '../components/DocHeader';
import { DocPagination } from '../components/DocPagination';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

const TOC = [
  { id: 'upgrades', label: 'Upgrading VAMOS' },
  { id: 'migrations', label: 'SQLx Database Migrations' },
  { id: 'backups', label: 'PostgreSQL Backups' },
  { id: 'restore', label: 'Disaster Recovery' },
  { id: 'uninstallation', label: 'Uninstallation' },
];

export const VamosLifecycle = () => {
  useEffect(() => {
    document.title = 'VAMOS Lifecycle & Upgrades — VaultScope Docs';
  }, []);

  const upgradeDocker = `# 1. Pull latest git tag
cd /opt/vaultscope/vamos
git fetch --tags
git checkout v1.4.0

# 2. Rebuild container and restart stack
docker compose down
docker compose up -d --build

# 3. Verify health and pending jobs
curl -f http://localhost:3000/api/health`;

  const migrationSnippet = `# Navigate to database migrations crate
cd /opt/vaultscope/vamos/crates/db

# Check status of applied and pending migrations
sqlx migrate info

# Run pending database migrations
sqlx migrate run

# (Emergency Rollback) Revert the most recent migration
sqlx migrate revert`;

  const backupSnippet = `# Create timestamped binary pg_dump backup
BACKUP_DIR="/var/backups/vaultscope"
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/vamos_db_$(date +%Y%m%d_%H%M%S).dump"

pg_dump -U postgres -d vaultscope -Fc -f "$BACKUP_FILE"

# Verify backup file size
ls -lh "$BACKUP_FILE"`;

  const restoreSnippet = `# 1. Stop VAMOS daemon to prevent write conflicts
sudo systemctl stop vamos

# 2. Terminate active database sessions
psql -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'vaultscope' AND pid <> pg_backend_pid();"

# 3. Restore database from dump archive
pg_restore -U postgres -d vaultscope --clean --if-exists /var/backups/vaultscope/vamos_db_20260916.dump

# 4. Restart VAMOS
sudo systemctl start vamos`;

  const uninstallSnippet = `# 1. Stop and disable systemd service
sudo systemctl stop vamos
sudo systemctl disable vamos
sudo rm -f /etc/systemd/system/vamos.service
sudo systemctl daemon-reload

# 2. Drop PostgreSQL database and role
dropdb -U postgres vaultscope
dropuser -U postgres vamos_user

# 3. Remove application binaries and configuration
sudo rm -rf /opt/vaultscope/vamos`;

  return (
    <div className="space-y-8">
      <DocHeader
        breadcrumbs={[
          { label: 'Projects', path: '/docs/projects' },
          { label: 'VAMOS', path: '/docs/projects/vamos' },
          { label: 'Lifecycle & Upgrades' },
        ]}
        title="VAMOS Maintenance & Migrations"
        badge={{ label: 'Database & Operations' }}
        description="Operational workflows for running SQLx schema migrations, applying binary updates, executing consistent PostgreSQL backups, and recovering from disaster."
        projectKey="vamos"
        tocItems={TOC}
      />

        <div className="space-y-12 text-sm leading-relaxed">
          {/* Upgrades */}
          <section id="upgrades" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Upgrading VAMOS</h2>
            <p className="text-foreground/80">
              Before updating VAMOS binaries, always verify that no long-running provisioning tasks are in an active <code className="font-mono text-foreground">running</code> state in the job queue.
            </p>
            <CodeBlock
              code={upgradeDocker}
              language="bash"
              title="Docker Upgrade Procedure"
            />
          </section>

          {/* Migrations */}
          <section id="migrations" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">SQLx Database Migrations</h2>
            <p className="text-foreground/80">
              Database schema changes in VAMOS are managed via SQLx versioned migrations located in <code className="font-mono text-foreground">crates/db/migrations</code>. Each migration is executed inside a transaction and tracked in the <code className="font-mono text-foreground">_sqlx_migrations</code> table.
            </p>
            <CodeBlock
              code={migrationSnippet}
              language="bash"
              title="Inspect & Apply SQLx Migrations"
            />
            <Callout type="warning" title="Backup First">
              Always execute a database dump prior to running migrations that include column drops or schema alterations.
            </Callout>
          </section>

          {/* Backups */}
          <section id="backups" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">PostgreSQL Database Backups</h2>
            <p className="text-foreground/80">
              We recommend taking daily compressed custom-format (<code className="font-mono text-foreground">-Fc</code>) dumps using <code className="font-mono text-foreground">pg_dump</code>:
            </p>
            <CodeBlock
              code={backupSnippet}
              language="bash"
              title="Create Database Backup"
            />
          </section>

          {/* Restore */}
          <section id="restore" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Disaster Recovery & Restore</h2>
            <p className="text-foreground/80">
              To restore a database dump onto a fresh host or after unexpected data corruption:
            </p>
            <CodeBlock
              code={restoreSnippet}
              language="bash"
              title="Restore Database from Backup"
            />
          </section>

          {/* Uninstallation */}
          <section id="uninstallation" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Clean Uninstallation</h2>
            <p className="text-foreground/80">
              To completely decommission VAMOS from a host:
            </p>
            <CodeBlock
              code={uninstallSnippet}
              language="bash"
              title="Decommission VAMOS Daemon"
            />
          </section>

          <DocPagination
            prev={{ title: 'VAMOS Configuration', path: '/docs/projects/vamos/config' }}
            next={{ title: 'CAMOS Admin Overview', path: '/docs/projects/camos' }}
          />
        </div>
    </div>
  );
};
