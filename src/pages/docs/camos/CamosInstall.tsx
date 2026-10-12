import { useEffect } from 'react';
import { DocHeader } from '../components/DocHeader';
import { DocPagination } from '../components/DocPagination';
import { CodeBlock } from '../components/CodeBlock';

const TOC = [
  { id: 'quickstart', label: 'Automated Quickstart' },
  { id: 'docker', label: 'Docker Container Setup' },
  { id: 'local-dev', label: 'Local Development' },
  { id: 'nginx', label: 'Nginx Virtual Host' },
  { id: 'verification', label: 'Verification' },
];

export const CamosInstall = () => {
  useEffect(() => {
    document.title = 'CAMOS Installation — VaultScope Docs';
  }, []);

  const automatedSnippet = `curl -fsSL https://raw.githubusercontent.com/VaultScope/website/dev/installer.sh | sudo bash`;

  const dockerSnippet = `# 1. Clone CAMOS admin repository
git clone https://github.com/VaultScope/camos.git
cd camos

# 2. Build production Docker image with build arguments
docker build -t vaultscope-camos \\
  --build-arg VITE_API_URL=https://api.vaultscope.de/api \\
  --build-arg VITE_AUTHENTIK_URL=https://auth.vaultscope.de \\
  --build-arg VITE_OIDC_CLIENT_ID=vaultscope-camos \\
  --build-arg VITE_OIDC_REDIRECT_URI=https://admin.vaultscope.de/callback .

# 3. Launch container bound to internal port 8081
docker run -d \\
  --name vaultscope-camos \\
  --restart unless-stopped \\
  -p 127.0.0.1:8081:80 \\
  vaultscope-camos`;

  const localSnippet = `# 1. Clone repository
git clone https://github.com/VaultScope/camos.git
cd camos

# 2. Install dependencies
npm install

# 3. Configure local environment
cp .env.example .env

# 4. Start Vite development server
npm run dev`;

  const nginxSnippet = `server {
    listen 443 ssl http2;
    server_name admin.vaultscope.de;

    ssl_certificate /etc/letsencrypt/live/admin.vaultscope.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.vaultscope.de/privkey.pem;

    # Optional: Restrict access to office or VPN subnets
    allow 10.0.0.0/8;
    allow 100.64.0.0/10; # Tailscale CGNAT range
    deny all;

    root /var/www/vaultscope-camos/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}`;

  return (
    <div className="space-y-8">
      <DocHeader
        breadcrumbs={[
          { label: 'Projects', path: '/docs/projects' },
          { label: 'CAMOS', path: '/docs/projects/camos' },
          { label: 'Installation' },
        ]}
        title="CAMOS Installation"
        badge={{ label: 'Deployment Guide' }}
        description="Instructions for installing the CAMOS admin control plane using Docker, automated shell installer, or local development mode."
        projectKey="camos"
        tocItems={TOC}
      />

        <div className="space-y-12 text-sm leading-relaxed">
          {/* Automated Quickstart */}
          <section id="quickstart" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Automated Quickstart</h2>
            <p className="text-foreground/80">
              The automated script sets up CAMOS alongside VAMOS and Storefront on single-node management hosts:
            </p>
            <CodeBlock
              code={automatedSnippet}
              language="bash"
              title="Run Automated Installer"
            />
          </section>

          {/* Docker Container */}
          <section id="docker" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Docker Container Deployment</h2>
            <p className="text-foreground/80">
              CAMOS is bundled into an Nginx Alpine container. In production, bind the container port to localhost (<code className="font-mono text-foreground">127.0.0.1:8081</code>) and front it with your reverse proxy:
            </p>
            <CodeBlock
              code={dockerSnippet}
              language="bash"
              title="Build & Run Docker Container"
            />
          </section>

          {/* Local Dev */}
          <section id="local-dev" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Local Development</h2>
            <p className="text-foreground/80">
              To test administrative controls and UI components locally:
            </p>
            <CodeBlock
              code={localSnippet}
              language="bash"
              title="Start Local Development Server"
            />
          </section>

          {/* Nginx Virtual Host */}
          <section id="nginx" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Nginx Virtual Host with Network Restrictions</h2>
            <p className="text-foreground/80">
              We strongly advise enforcing IP-based access controls on the CAMOS administrative subdomain:
            </p>
            <CodeBlock
              code={nginxSnippet}
              language="nginx"
              title="/etc/nginx/sites-available/camos.conf"
            />
          </section>

          {/* Verification */}
          <section id="verification" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Health Verification</h2>
            <p className="text-foreground/80">
              Test that your virtual host responds with HTTP 200 and loads the admin entrypoint:
            </p>
            <CodeBlock
              code="curl -I https://admin.vaultscope.de"
              language="bash"
              title="Verify Virtual Host"
            />
          </section>

          <DocPagination
            prev={{ title: 'CAMOS Overview', path: '/docs/projects/camos' }}
            next={{ title: 'CAMOS Configuration', path: '/docs/projects/camos/config' }}
          />
        </div>
    </div>
  );
};
