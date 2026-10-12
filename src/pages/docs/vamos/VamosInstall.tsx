import { useEffect } from 'react';
import { DocHeader } from '../components/DocHeader';
import { DocPagination } from '../components/DocPagination';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

const TOC = [
  { id: 'quickstart', label: 'Automated Quickstart' },
  { id: 'docker-compose', label: 'Docker Compose Stack' },
  { id: 'cargo-build', label: 'Local Cargo Compilation' },
  { id: 'systemd', label: 'Systemd Production Service' },
  { id: 'verification', label: 'Health Verification' },
];

export const VamosInstall = () => {
  useEffect(() => {
    document.title = 'VAMOS Installation — VaultScope Docs';
  }, []);

  const automatedSnippet = `curl -fsSL https://raw.githubusercontent.com/VaultScope/website/dev/installer.sh | sudo bash`;

  const dockerSnippet = `# 1. Clone VAMOS repository
git clone https://github.com/VaultScope/vamos.git
cd vamos

# 2. Copy and configure production environment
cp .env.example .env

# Generate cryptographically secure keys:
JWT_SECRET=$(openssl rand -base64 64)
ENCRYPTION_KEY=$(openssl rand -base64 32)
sed -i "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" .env
sed -i "s|ENCRYPTION_KEY=.*|ENCRYPTION_KEY=$ENCRYPTION_KEY|" .env

# 3. Start PostgreSQL, Redis, and VAMOS services
docker compose up -d --build

# 4. View container startup logs
docker compose logs -f api`;

  const cargoSnippet = `# 1. Ensure Rust 1.78+ and SQLx CLI are installed
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install sqlx-cli --no-default-features --features rustls,postgres

# 2. Create PostgreSQL database and execute migrations
createdb -U postgres vaultscope
cd crates/db
sqlx database create
sqlx migrate run
cd ../..

# 3. Compile optimized release binary
cargo build --release --bin vamos-api

# 4. Execute binary
./target/release/vamos-api`;

  const systemdSnippet = `[Unit]
Description=VAMOS API & Cloud Orchestration Daemon
After=network.target postgresql.service redis.service
Wants=postgresql.service redis.service

[Service]
Type=simple
User=vaultscope
Group=vaultscope
WorkingDirectory=/opt/vaultscope/vamos
EnvironmentFile=/opt/vaultscope/vamos/.env
ExecStart=/opt/vaultscope/vamos/target/release/vamos-api
Restart=always
RestartSec=5s
LimitNOFILE=65535

# Hardening
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/vaultscope/vamos/logs

[Install]
WantedBy=multi-user.target`;

  return (
    <div className="space-y-8">
      <DocHeader
        breadcrumbs={[
          { label: 'Projects', path: '/docs/projects' },
          { label: 'VAMOS', path: '/docs/projects/vamos' },
          { label: 'Installation' },
        ]}
        title="VAMOS Installation"
        badge={{ label: 'Deployment Guide' }}
        description="Instructions for provisioning the VAMOS backend API, background job worker, PostgreSQL database, and Redis cache."
        projectKey="vamos"
        tocItems={TOC}
      />

        <div className="space-y-12 text-sm leading-relaxed">
          {/* Quickstart */}
          <section id="quickstart" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Automated Quickstart</h2>
            <p className="text-foreground/80">
              The unified installer automatically provisions PostgreSQL 16, creates the database schema, compiles or pulls the latest VAMOS binary, and sets up systemd service units:
            </p>
            <CodeBlock
              code={automatedSnippet}
              language="bash"
              title="Automated Install Command"
            />
          </section>

          {/* Docker Compose */}
          <section id="docker-compose" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Docker Compose Stack</h2>
            <p className="text-foreground/80">
              For containerized environments, the root <code className="font-mono text-foreground">docker-compose.yml</code> orchestrates PostgreSQL, Redis, and VAMOS in a secure internal bridge network:
            </p>
            <CodeBlock
              code={dockerSnippet}
              language="bash"
              title="Launch Docker Compose"
            />
            <Callout type="tip" title="Automatic Migrations">
              When launching via Docker, the entrypoint script automatically runs pending SQLx database migrations before binding the HTTP listener.
            </Callout>
          </section>

          {/* Cargo Build */}
          <section id="cargo-build" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Bare-Metal Cargo Compilation</h2>
            <p className="text-foreground/80">
              To compile directly from source for maximum CPU optimization:
            </p>
            <CodeBlock
              code={cargoSnippet}
              language="bash"
              title="Compile and Migrate"
            />
          </section>

          {/* Systemd Service */}
          <section id="systemd" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Systemd Production Service</h2>
            <p className="text-foreground/80">
              Save the following service unit to <code className="font-mono text-foreground">/etc/systemd/system/vamos.service</code> for process supervision, auto-restarts, and security sandboxing:
            </p>
            <CodeBlock
              code={systemdSnippet}
              language="ini"
              title="/etc/systemd/system/vamos.service"
            />
            <CodeBlock
              code={`sudo systemctl daemon-reload\nsudo systemctl enable --now vamos\nsudo journalctl -u vamos -f`}
              language="bash"
              title="Activate Systemd Service"
            />
          </section>

          {/* Health Verification */}
          <section id="verification" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Health Verification</h2>
            <p className="text-foreground/80">
              Query the unauthenticated health endpoint to verify database connectivity and daemon uptime:
            </p>
            <CodeBlock
              code="curl -s http://localhost:3000/api/health | jq ."
              language="bash"
              title="Query Health Endpoint"
            />
            <CodeBlock
              code={`{\n  "status": "healthy",\n  "version": "1.4.0",\n  "database": "connected",\n  "redis": "connected",\n  "active_workers": 4\n}`}
              language="json"
              title="Expected Response"
            />
          </section>

          <DocPagination
            prev={{ title: 'VAMOS Overview', path: '/docs/projects/vamos' }}
            next={{ title: 'VAMOS Configuration', path: '/docs/projects/vamos/config' }}
          />
        </div>
    </div>
  );
};
