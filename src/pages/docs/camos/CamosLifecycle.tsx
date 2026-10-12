import { useEffect } from 'react';
import { DocHeader } from '../components/DocHeader';
import { DocPagination } from '../components/DocPagination';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

const TOC = [
  { id: 'upgrades', label: 'Upgrading CAMOS' },
  { id: 'cache', label: 'Cache Invalidation' },
  { id: 'backups', label: 'Backups' },
  { id: 'rollback', label: 'Rollback Procedure' },
  { id: 'uninstallation', label: 'Clean Uninstallation' },
];

export const CamosLifecycle = () => {
  useEffect(() => {
    document.title = 'CAMOS Lifecycle & Upgrades — VaultScope Docs';
  }, []);

  const upgradeDocker = `# 1. Pull release tag
cd /opt/vaultscope/camos
git fetch --tags
git checkout v1.4.0

# 2. Rebuild container image
docker build -t vaultscope-camos:v1.4.0 \\
  --build-arg VITE_API_URL=https://api.vaultscope.de/api \\
  --build-arg VITE_AUTHENTIK_URL=https://auth.vaultscope.de \\
  --build-arg VITE_OIDC_CLIENT_ID=vaultscope-camos \\
  --build-arg VITE_OIDC_REDIRECT_URI=https://admin.vaultscope.de/callback .

# 3. Swap container instances
docker stop vaultscope-camos
docker rm vaultscope-camos
docker run -d \\
  --name vaultscope-camos \\
  --restart unless-stopped \\
  -p 127.0.0.1:8081:80 \\
  vaultscope-camos:v1.4.0`;

  const uninstallSnippet = `# 1. Stop and remove Docker container
docker stop vaultscope-camos
docker rm vaultscope-camos
docker rmi vaultscope-camos

# 2. Remove Nginx site configuration
sudo rm -f /etc/nginx/sites-enabled/camos.conf
sudo rm -f /etc/nginx/sites-available/camos.conf
sudo nginx -s reload

# 3. Remove source directory
sudo rm -rf /opt/vaultscope/camos`;

  return (
    <div className="space-y-8">
      <DocHeader
        breadcrumbs={[
          { label: 'Projects', path: '/docs/projects' },
          { label: 'CAMOS', path: '/docs/projects/camos' },
          { label: 'Lifecycle & Upgrades' },
        ]}
        title="CAMOS Maintenance & Lifecycle"
        badge={{ label: 'Operations' }}
        description="Procedures for updating the CAMOS administrative portal, clearing frontend caches, configuration backups, and service removal."
        projectKey="camos"
        tocItems={TOC}
      />

        <div className="space-y-12 text-sm leading-relaxed">
          {/* Upgrades */}
          <section id="upgrades" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Upgrading to a New Release</h2>
            <p className="text-foreground/80">
              Follow these commands to deploy the latest release tag for CAMOS:
            </p>
            <CodeBlock
              code={upgradeDocker}
              language="bash"
              title="Upgrade Docker Image"
            />
          </section>

          {/* Cache Invalidation */}
          <section id="cache" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Static Cache Invalidation</h2>
            <p className="text-foreground/80">
              Vite automatically hashes JavaScript and CSS bundles (e.g. <code className="font-mono text-foreground">assets/index-a8f9c1.js</code>). However, <code className="font-mono text-foreground">index.html</code> must never be aggressively cached by proxies or browsers so that clients always load the latest bundle references.
            </p>
            <Callout type="tip" title="Nginx Cache Rule">
              Verify that your Nginx configuration contains <code className="font-mono text-foreground">add_header Cache-Control "no-cache, no-store, must-revalidate";</code> specifically for the root HTML location.
            </Callout>
          </section>

          {/* Backups */}
          <section id="backups" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Backups</h2>
            <p className="text-foreground/80">
              CAMOS is completely stateless; all administrative audit logs, product changes, and connector configurations are securely stored inside PostgreSQL by VAMOS. Back up only your <code className="font-mono text-foreground">.env</code> and web server host configurations:
            </p>
            <CodeBlock
              code="tar -czvf /var/backups/camos-config-$(date +%Y%m%d).tar.gz /opt/vaultscope/camos/.env /etc/nginx/sites-available/camos.conf"
              language="bash"
              title="Archive Admin Configurations"
            />
          </section>

          {/* Rollback */}
          <section id="rollback" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Rollback Procedure</h2>
            <p className="text-foreground/80">
              If an administrative build introduces an issue, roll back instantly by running the previous container tag:
            </p>
            <CodeBlock
              code={`docker stop vaultscope-camos\ndocker run -d --name vaultscope-camos --restart unless-stopped -p 127.0.0.1:8081:80 vaultscope-camos:v1.3.9`}
              language="bash"
              title="Roll Back Container"
            />
          </section>

          {/* Uninstallation */}
          <section id="uninstallation" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Clean Uninstallation</h2>
            <p className="text-foreground/80">
              To remove CAMOS from the host:
            </p>
            <CodeBlock
              code={uninstallSnippet}
              language="bash"
              title="Uninstall CAMOS"
            />
          </section>

          <DocPagination
            prev={{ title: 'CAMOS Configuration', path: '/docs/projects/camos/config' }}
            next={{ title: 'System Architecture', path: '/docs/architecture' }}
          />
        </div>
    </div>
  );
};
