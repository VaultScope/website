import { useEffect } from 'react';
import { DocHeader } from '../components/DocHeader';
import { DocPagination } from '../components/DocPagination';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

const TOC = [
  { id: 'quickstart', label: 'Automated Quickstart' },
  { id: 'docker', label: 'Production Docker' },
  { id: 'local-dev', label: 'Local Development' },
  { id: 'systemd', label: 'Bare-Metal Systemd' },
  { id: 'verification', label: 'Health Verification' },
];

export const StorefrontInstall = () => {
  useEffect(() => {
    document.title = 'Storefront Installation — VaultScope Docs';
  }, []);

  const automatedSnippet = `curl -fsSL https://raw.githubusercontent.com/VaultScope/website/dev/installer.sh | sudo bash`;

  const dockerSnippet = `# 1. Clone repository
git clone https://github.com/VaultScope/website.git
cd website

# 2. Build production image with build arguments
docker build -t vaultscope-storefront \\
  --build-arg VITE_API_URL=https://api.vaultscope.de/api \\
  --build-arg VITE_AUTHENTIK_URL=https://auth.vaultscope.de \\
  --build-arg VITE_OIDC_CLIENT_ID=vaultscope-storefront \\
  --build-arg VITE_OIDC_REDIRECT_URI=https://vaultscope.de/auth/callback .

# 3. Run container bound to host port 8080 (or 80/443)
docker run -d \\
  --name vaultscope-storefront \\
  --restart unless-stopped \\
  -p 8080:3000 \\
  vaultscope-storefront`;

  const localSnippet = `# 1. Clone storefront repository
git clone https://github.com/VaultScope/website.git
cd website

# 2. Install Node 20+ dependencies
npm install

# 3. Populate development environment variables
cp .env.example .env

# 4. Start local Vite HMR development server
npm run dev`;

  const caddyfileSnippet = `vaultscope.de {
    encode gzip zstd
    root * /var/www/vaultscope/dist
    file_server

    # SPA routing fallback for React Router
    try_files {path} /index.html

    header {
        X-Frame-Options "DENY"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
}`;

  return (
    <div className="space-y-8">
      <DocHeader
        breadcrumbs={[
          { label: 'Projects', path: '/docs/projects' },
          { label: 'Storefront', path: '/docs/projects/storefront' },
          { label: 'Installation' },
        ]}
        title="Storefront Installation"
        badge={{ label: 'Deployment Guide' }}
        description="Step-by-step instructions for deploying the VaultScope storefront via automated script, Docker container with Caddy, or local Node development."
        projectKey="storefront"
        tocItems={TOC}
      />

        <div className="space-y-12 text-sm leading-relaxed">
          {/* Automated Quickstart */}
          <section id="quickstart" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Automated Quickstart</h2>
            <p className="text-foreground/80">
              For Debian and Ubuntu Linux servers, the automated installer sets up Docker, pulls the latest release tag, writes your environment parameters, and configures Caddy with automated Let's Encrypt certificates.
            </p>
            <CodeBlock
              code={automatedSnippet}
              language="bash"
              title="Run Automated Installer"
            />
            <Callout type="info" title="Installer Scope">
              The installer will prompt you for your public domain name (e.g. <code className="font-mono text-foreground">vaultscope.de</code>) and your backend API endpoint before launching.
            </Callout>
          </section>

          {/* Production Docker */}
          <section id="docker" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Production Docker Setup</h2>
            <p className="text-foreground/80">
              The official Storefront <code className="font-mono text-foreground">Dockerfile</code> utilizes a two-stage build: a Node 20 Alpine builder that compiles the TypeScript/Vite bundle, followed by a minimal Caddy Alpine image serving the static output with gzip/zstd compression.
            </p>
            <CodeBlock
              code={dockerSnippet}
              language="bash"
              title="Build & Run Docker Container"
            />
            <Callout type="warning" title="Build Argument Notice">
              Because Vite embeds environment variables during static compilation, you must provide <code className="font-mono text-foreground">--build-arg VITE_*</code> values during <code className="font-mono text-foreground">docker build</code>. Passing them via <code className="font-mono text-foreground">docker run -e</code> will not alter static client bundles.
            </Callout>
          </section>

          {/* Local Development */}
          <section id="local-dev" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Local Development</h2>
            <p className="text-foreground/80">
              To contribute to the storefront or test custom theme modifications locally, ensure Node.js 20+ and npm 10+ are installed.
            </p>
            <CodeBlock
              code={localSnippet}
              language="bash"
              title="Local Setup Commands"
            />
            <p className="text-foreground/80">
              The Vite dev server will start at <code className="font-mono text-foreground">http://localhost:5173</code> with hot module replacement (HMR) enabled.
            </p>
          </section>

          {/* Bare-Metal Systemd */}
          <section id="systemd" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Bare-Metal Caddy Configuration</h2>
            <p className="text-foreground/80">
              If running directly on host hardware without Docker, compile the production distribution using <code className="font-mono text-foreground">npm run build</code> and point your system Caddy service at the resulting <code className="font-mono text-foreground">dist/</code> directory.
            </p>
            <CodeBlock
              code={caddyfileSnippet}
              language="caddyfile"
              title="/etc/caddy/Caddyfile"
            />
          </section>

          {/* Health Verification */}
          <section id="verification" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Health Verification</h2>
            <p className="text-foreground/80">
              Confirm your deployment is serving the Single Page Application index and responsive headers:
            </p>
            <CodeBlock
              code="curl -I https://vaultscope.de"
              language="bash"
              title="Verify HTTP Status"
            />
            <p className="text-foreground/80">
              Expected output should return <code className="font-mono text-foreground">HTTP/2 200</code> or <code className="font-mono text-foreground">HTTP/3 200</code> with the <code className="font-mono text-foreground">content-type: text/html</code> header.
            </p>
          </section>

          <DocPagination
            prev={{ title: 'Storefront Overview', path: '/docs/projects/storefront' }}
            next={{ title: 'Storefront Configuration', path: '/docs/projects/storefront/config' }}
          />
        </div>
    </div>
  );
};
