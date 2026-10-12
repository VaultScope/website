import { useEffect } from 'react';
import { DocHeader } from '../components/DocHeader';
import { DocPagination } from '../components/DocPagination';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

const TOC = [
  { id: 'upgrades', label: 'Upgrading Storefront' },
  { id: 'zero-downtime', label: 'Zero-Downtime Releases' },
  { id: 'backups', label: 'Backup Procedures' },
  { id: 'rollback', label: 'Rollback Strategy' },
  { id: 'uninstallation', label: 'Clean Uninstallation' },
];

export const StorefrontLifecycle = () => {
  useEffect(() => {
    document.title = 'Storefront Lifecycle & Maintenance — VaultScope Docs';
  }, []);

  const upgradeDocker = `# 1. Pull latest code from repository
cd /opt/vaultscope/website
git fetch --tags
git checkout v1.4.0

# 2. Rebuild the container image with new release assets
docker build -t vaultscope-storefront:v1.4.0 \\
  --build-arg VITE_API_URL=https://api.vaultscope.de/api \\
  --build-arg VITE_AUTHENTIK_URL=https://auth.vaultscope.de \\
  --build-arg VITE_OIDC_CLIENT_ID=vaultscope-storefront \\
  --build-arg VITE_OIDC_REDIRECT_URI=https://vaultscope.de/auth/callback .

# 3. Swap container instances
docker stop vaultscope-storefront
docker rm vaultscope-storefront
docker run -d \\
  --name vaultscope-storefront \\
  --restart unless-stopped \\
  -p 8080:3000 \\
  vaultscope-storefront:v1.4.0`;

  const backupSnippet = `# Create timestamped backup archive of storefront configs
tar -czvf /var/backups/vaultscope-storefront-$(date +%Y%m%d_%H%M%S).tar.gz \\
  /opt/vaultscope/website/.env \\
  /etc/caddy/Caddyfile \\
  /root/.local/share/caddy`;

  const uninstallSnippet = `# 1. Stop and remove Docker container
docker stop vaultscope-storefront
docker rm vaultscope-storefront
docker rmi vaultscope-storefront

# 2. (Optional) Remove source directory
sudo rm -rf /opt/vaultscope/website

# 3. If running via systemd / Caddy:
sudo systemctl stop caddy
sudo rm -f /etc/caddy/Caddyfile
sudo systemctl restart caddy`;

  return (
    <div className="space-y-8">
      <DocHeader
        breadcrumbs={[
          { label: 'Projects', path: '/docs/projects' },
          { label: 'Storefront', path: '/docs/projects/storefront' },
          { label: 'Lifecycle & Upgrades' },
        ]}
        title="Storefront Maintenance & Lifecycle"
        badge={{ label: 'Operations' }}
        description="Operational procedures for zero-downtime upgrades, asset cache invalidation, configuration backups, and clean service uninstallation."
        projectKey="storefront"
        tocItems={TOC}
      />

        <div className="space-y-12 text-sm leading-relaxed">
          {/* Upgrading */}
          <section id="upgrades" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Upgrading to a New Release</h2>
            <p className="text-foreground/80">
              When a new version of the Storefront is published, follow these instructions to pull git tags and build the updated production assets:
            </p>
            <CodeBlock
              code={upgradeDocker}
              language="bash"
              title="Docker Container Upgrade"
            />
          </section>

          {/* Zero-Downtime Releases */}
          <section id="zero-downtime" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Zero-Downtime Blue/Green Deployments</h2>
            <p className="text-foreground/80">
              To update the customer portal with 0ms interruption, launch the new container version on a secondary internal port (e.g. <code className="font-mono text-foreground">8081</code>), test its response, update your upstream proxy (e.g., Caddy or Nginx reverse proxy), and reload the proxy:
            </p>
            <CodeBlock
              code={`# Reload Caddy proxy configuration with zero dropped connections\nsudo caddy reload --config /etc/caddy/Caddyfile\n\n# Terminate the previous container once the new one receives traffic\ndocker stop vaultscope-storefront-old && docker rm vaultscope-storefront-old`}
              language="bash"
              title="Proxy Hot Reload"
            />
          </section>

          {/* Backups */}
          <section id="backups" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Backup Procedures</h2>
            <p className="text-foreground/80">
              Because the storefront is stateless, only the environment configuration files and Let's Encrypt TLS certificate keys managed by Caddy require automated backups.
            </p>
            <CodeBlock
              code={backupSnippet}
              language="bash"
              title="Backup Script"
            />
          </section>

          {/* Rollback */}
          <section id="rollback" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Rollback Strategy</h2>
            <p className="text-foreground/80">
              If a client bundle fails in production, immediately roll back by switching the Caddy upstream port or relaunching the previously tagged Docker image:
            </p>
            <CodeBlock
              code={`docker stop vaultscope-storefront\ndocker run -d --name vaultscope-storefront --restart unless-stopped -p 8080:3000 vaultscope-storefront:v1.3.9`}
              language="bash"
              title="Quick Container Rollback"
            />
          </section>

          {/* Uninstallation */}
          <section id="uninstallation" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Clean Uninstallation</h2>
            <p className="text-foreground/80">
              To remove the storefront service from a server while retaining backend customer data in VAMOS:
            </p>
            <CodeBlock
              code={uninstallSnippet}
              language="bash"
              title="Uninstall Storefront"
            />
            <Callout type="warning" title="SSL Certificates">
              Removing Caddy will remove automated ACME certificate management. If migrating domains, revoke certificates or copy keys to your new host first.
            </Callout>
          </section>

          <DocPagination
            prev={{ title: 'Storefront Configuration', path: '/docs/projects/storefront/config' }}
            next={{ title: 'VAMOS Backend Overview', path: '/docs/projects/vamos' }}
          />
        </div>
    </div>
  );
};
