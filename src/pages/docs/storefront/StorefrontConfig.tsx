import { useEffect } from 'react';
import { DocHeader } from '../components/DocHeader';
import { DocPagination } from '../components/DocPagination';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

const TOC = [
  { id: 'env-matrix', label: 'Environment Variables' },
  { id: 'env-sample', label: 'Sample .env File' },
  { id: 'build-mechanics', label: 'Vite Build Mechanics' },
  { id: 'i18n-routing', label: 'i18n & Locale Routing' },
  { id: 'security-headers', label: 'Security Headers' },
];

export const StorefrontConfig = () => {
  useEffect(() => {
    document.title = 'Storefront Configuration — VaultScope Docs';
  }, []);

  const sampleEnv = `# ==============================================================================
# VaultScope Storefront Configuration
# ==============================================================================

# Backend REST API Endpoint (VAMOS)
VITE_API_URL=https://api.vaultscope.de/api

# Authentik OIDC Identity Federation
VITE_AUTHENTIK_URL=https://auth.vaultscope.de
VITE_OIDC_CLIENT_ID=vaultscope-storefront
VITE_OIDC_REDIRECT_URI=https://vaultscope.de/auth/callback

# Optional Payment Gateway (Stripe Elements)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51Pxxxxxxxxxxxxxxxxxxxx

# Optional Newsletter & Transactional Subscription (Listmonk)
VITE_LISTMONK_URL=https://subscribe.vaultscope.de`;

  return (
    <div className="space-y-8">
      <DocHeader
        breadcrumbs={[
          { label: 'Projects', path: '/docs/projects' },
          { label: 'Storefront', path: '/docs/projects/storefront' },
          { label: 'Configuration' },
        ]}
        title="Storefront Configuration"
        badge={{ label: 'Reference' }}
        description="Detailed guide to Vite build parameters, Authentik client settings, internationalization routing rules, and HTTP security headers."
        projectKey="storefront"
        tocItems={TOC}
      />

        <div className="space-y-12 text-sm leading-relaxed">
          {/* Environment Variables Table */}
          <section id="env-matrix" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Environment Variables</h2>
            <p className="text-foreground/80">
              The storefront expects the following build-time parameters. Variables prefixed with <code className="font-mono text-foreground">VITE_</code> are inlined by the compiler during production bundling.
            </p>

            <div className="border border-border rounded-lg overflow-hidden not-prose">
              <table className="w-full text-xs text-left">
                <thead className="bg-foreground/[0.03] border-b border-border text-foreground/60 font-mono">
                  <tr>
                    <th className="px-4 py-2.5">Variable</th>
                    <th className="px-4 py-2.5">Required</th>
                    <th className="px-4 py-2.5">Default / Example</th>
                    <th className="px-4 py-2.5">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground/80">
                  <tr>
                    <td className="px-4 py-2.5 font-mono font-medium text-foreground">VITE_API_URL</td>
                    <td className="px-4 py-2.5 font-mono text-rose-500 font-semibold">Yes</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">https://api.domain.com/api</td>
                    <td className="px-4 py-2.5 text-foreground/60">Public base URL for VAMOS REST API endpoints.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono font-medium text-foreground">VITE_AUTHENTIK_URL</td>
                    <td className="px-4 py-2.5 font-mono text-rose-500 font-semibold">Yes</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">https://auth.domain.com</td>
                    <td className="px-4 py-2.5 text-foreground/60">Base URL of the Authentik identity provider.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono font-medium text-foreground">VITE_OIDC_CLIENT_ID</td>
                    <td className="px-4 py-2.5 font-mono text-rose-500 font-semibold">Yes</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">vaultscope-storefront</td>
                    <td className="px-4 py-2.5 text-foreground/60">OAuth2 Public Client ID defined in Authentik.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono font-medium text-foreground">VITE_OIDC_REDIRECT_URI</td>
                    <td className="px-4 py-2.5 font-mono text-rose-500 font-semibold">Yes</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">https://domain.com/auth/callback</td>
                    <td className="px-4 py-2.5 text-foreground/60">Registered OAuth2 callback URL on the storefront.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono font-medium text-foreground">VITE_STRIPE_PUBLISHABLE_KEY</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/40">Optional</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">pk_live_...</td>
                    <td className="px-4 py-2.5 text-foreground/60">Stripe publishable API key for embedded card checkout.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono font-medium text-foreground">VITE_LISTMONK_URL</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/40">Optional</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">https://subscribe.domain.com</td>
                    <td className="px-4 py-2.5 text-foreground/60">Endpoint for subscription newsletters and updates.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Sample Env File */}
          <section id="env-sample" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Sample Configuration File</h2>
            <p className="text-foreground/80">
              Create a <code className="font-mono text-foreground">.env</code> file in the project root directory when building or running locally:
            </p>
            <CodeBlock
              code={sampleEnv}
              language="ini"
              title=".env"
            />
          </section>

          {/* Build Mechanics */}
          <section id="build-mechanics" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Vite Build Mechanics</h2>
            <p className="text-foreground/80">
              Because Vite uses static asset replacement, string values like <code className="font-mono text-foreground">import.meta.env.VITE_API_URL</code> are replaced with static literals during the <code className="font-mono text-foreground">npm run build</code> step.
            </p>
            <Callout type="warning" title="Container Runtime Injections">
              Setting environment variables inside a running Docker container via <code className="font-mono text-foreground">docker run -e</code> will have no effect on JavaScript files that are already bundled. Always supply build arguments or rebuild the image when updating endpoints.
            </Callout>
          </section>

          {/* i18n & Locale Routing */}
          <section id="i18n-routing" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">i18n & German Locale Routing</h2>
            <p className="text-foreground/80">
              VaultScope supports native English and German (<code className="font-mono text-foreground">de-DE</code>). All German routes are mounted with the <code className="font-mono text-foreground">/de/</code> URL prefix (e.g. <code className="font-mono text-foreground">/de/pricing</code>, <code className="font-mono text-foreground">/de/docs/projects/storefront</code>).
            </p>
            <p className="text-foreground/80">
              When authoring internal navigation links in the storefront, always use the <code className="font-mono text-foreground">&lt;LocaleLink /&gt;</code> component or calculate the localized path using <code className="font-mono text-foreground">useLocation()</code> to preserve the active language context.
            </p>
          </section>

          {/* Security Headers */}
          <section id="security-headers" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Caddy Security Headers</h2>
            <p className="text-foreground/80">
              In production, the Caddy web server enforces modern HTTP headers to defend against clickjacking, MIME-type sniffing, and unauthorized framing:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-foreground/70">
              <li><code className="font-mono text-foreground">X-Frame-Options: DENY</code>: Prevents embedding within external iframes.</li>
              <li><code className="font-mono text-foreground">X-Content-Type-Options: nosniff</code>: Stops browsers from guessing content types.</li>
              <li><code className="font-mono text-foreground">Strict-Transport-Security: max-age=31536000; includeSubDomains</code>: Enforces HTTPS.</li>
              <li><code className="font-mono text-foreground">Referrer-Policy: strict-origin-when-cross-origin</code>: Protects referrer privacy.</li>
            </ul>
          </section>

          <DocPagination
            prev={{ title: 'Storefront Installation', path: '/docs/projects/storefront/install' }}
            next={{ title: 'Storefront Lifecycle & Updates', path: '/docs/projects/storefront/lifecycle' }}
          />
        </div>
    </div>
  );
};
