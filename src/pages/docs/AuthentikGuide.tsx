import { useEffect } from 'react';
import { DocHeader } from './components/DocHeader';
import { DocPagination } from './components/DocPagination';
import { CodeBlock } from './components/CodeBlock';
import { Callout } from './components/Callout';

const TOC = [
  { id: 'overview', label: 'Identity Architecture' },
  { id: 'create-provider', label: '1. Create OAuth2 Provider' },
  { id: 'create-apps', label: '2. Register Applications' },
  { id: 'redirect-uris', label: '3. Configure Redirect URIs' },
  { id: 'rbac-groups', label: '4. Staff Group & Claims' },
  { id: 'backend-config', label: '5. VAMOS Token Verification' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
];

export const DocsAuthentikGuide = () => {
  useEffect(() => {
    document.title = 'Authentik OIDC Single Sign-On Guide — VaultScope Docs';
  }, []);

  const providerSettings = `Provider Name: VaultScope Core OIDC
Authorization Flow: default-authorization-flow
Client Type: Public
Redirect URIs:
  - https://vaultscope.de/auth/callback
  - https://admin.vaultscope.de/callback
  - http://localhost:5173/auth/callback (Local Dev)
Signing Key: Authentik Self-signed Certificate (or Let's Encrypt)
Scopes:
  - openid
  - profile
  - email
  - groups`;

  const vamosConfig = `# Authentik OIDC Issuer (Must match the Issuer Claim in Authentik)
AUTHENTIK_ISSUER_URL=https://auth.vaultscope.de/application/o/vaultscope/
AUTHENTIK_CLIENT_ID=vaultscope-backend
AUTHENTIK_AUDIENCE=vaultscope`;

  return (
    <div className="space-y-8">
      <DocHeader
        breadcrumbs={[
          { label: 'Guides' },
          { label: 'Authentik OIDC' },
        ]}
        title="Authentik OIDC Single Sign-On"
        badge={{ label: 'Authentication Guide' }}
        description="Step-by-step instructions for configuring Authentik as the centralized identity provider for customer authentication and staff RBAC authorization."
        tocItems={TOC}
      />

        <div className="space-y-12 text-sm leading-relaxed">
          {/* Identity Architecture */}
          <section id="overview" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Identity Architecture</h2>
            <p className="text-foreground/80">
              VaultScope uses Authentik for centralized identity management, WebAuthn/TOTP multi-factor authentication, and federated Single Sign-On (SSO). Both the public Storefront and the CAMOS admin portal authenticate users via the OpenID Connect (OIDC) Authorization Code Flow with PKCE (Proof Key for Code Exchange).
            </p>
            <p className="text-foreground/80">
              When a user signs in, Authentik generates an RSA-signed JSON Web Token (JWT). The VAMOS API validates these tokens against Authentik's JWKS (JSON Web Key Set) discovery endpoint and extracts identity and permission claims.
            </p>
          </section>

          {/* Step 1: Create OAuth2 Provider */}
          <section id="create-provider" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">1. Create OAuth2 Provider in Authentik</h2>
            <ol className="list-decimal pl-5 space-y-2 text-foreground/70">
              <li>Log in to your Authentik Administrative Interface (<code className="font-mono text-foreground">https://auth.your-domain.com</code>).</li>
              <li>Navigate to <strong>Applications &rarr; Providers</strong> and click <strong>Create</strong>.</li>
              <li>Select <strong>OAuth2/OpenID Provider</strong> and click <strong>Next</strong>.</li>
              <li>Configure the provider settings according to the specifications below:</li>
            </ol>
            <CodeBlock
              code={providerSettings}
              language="yaml"
              title="Authentik Provider Configuration"
            />
            <Callout type="tip" title="PKCE Requirement">
              Always set <strong>Client Type</strong> to <code className="font-mono text-foreground">Public</code>. Public clients require PKCE (<code className="font-mono text-foreground">code_challenge</code> and <code className="font-mono text-foreground">code_verifier</code>), eliminating the need to expose client secrets in browser bundles.
            </Callout>
          </section>

          {/* Step 2: Register Applications */}
          <section id="create-apps" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">2. Register Applications in Authentik</h2>
            <p className="text-foreground/80">
              Under <strong>Applications &rarr; Applications</strong>, create two distinct application entries bound to your newly created provider:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 not-prose">
              <div className="p-4 rounded-lg border border-border bg-foreground/[0.01] space-y-1.5">
                <h4 className="text-sm font-semibold text-foreground">Storefront App</h4>
                <p className="text-xs text-foreground/60"><strong>Name:</strong> VaultScope Storefront</p>
                <p className="text-xs text-foreground/60"><strong>Slug:</strong> vaultscope-storefront</p>
                <p className="text-xs text-foreground/60"><strong>Launch URL:</strong> https://vaultscope.de</p>
                <p className="text-xs text-foreground/60"><strong>Provider:</strong> VaultScope Core OIDC</p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-foreground/[0.01] space-y-1.5">
                <h4 className="text-sm font-semibold text-foreground">CAMOS Admin App</h4>
                <p className="text-xs text-foreground/60"><strong>Name:</strong> VaultScope CAMOS Admin</p>
                <p className="text-xs text-foreground/60"><strong>Slug:</strong> vaultscope-camos</p>
                <p className="text-xs text-foreground/60"><strong>Launch URL:</strong> https://admin.vaultscope.de</p>
                <p className="text-xs text-foreground/60"><strong>Provider:</strong> VaultScope Core OIDC</p>
              </div>
            </div>
          </section>

          {/* Step 3: Configure Redirect URIs */}
          <section id="redirect-uris" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">3. Configure Redirect URIs</h2>
            <p className="text-foreground/80">
              Authentik strictly validates redirect targets to prevent authorization code leakage. Ensure the following callback patterns are configured:
            </p>
            <div className="border border-border rounded-lg overflow-hidden not-prose">
              <table className="w-full text-xs text-left">
                <thead className="bg-foreground/[0.03] border-b border-border text-foreground/60 font-mono">
                  <tr>
                    <th className="px-4 py-2.5">Application</th>
                    <th className="px-4 py-2.5">Redirect Callback URI</th>
                    <th className="px-4 py-2.5">Post-Logout URI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground/80 font-mono">
                  <tr>
                    <td className="px-4 py-2.5 font-medium font-sans">Storefront</td>
                    <td className="px-4 py-2.5 text-foreground/60">https://vaultscope.de/auth/callback</td>
                    <td className="px-4 py-2.5 text-foreground/60">https://vaultscope.de</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium font-sans">CAMOS Admin</td>
                    <td className="px-4 py-2.5 text-foreground/60">https://admin.vaultscope.de/callback</td>
                    <td className="px-4 py-2.5 text-foreground/60">https://admin.vaultscope.de/login</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Step 4: Staff Group & Claims */}
          <section id="rbac-groups" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">4. Staff Group & Scope Mapping</h2>
            <p className="text-foreground/80">
              Administrative access to CAMOS and VAMOS admin endpoints requires the <code className="font-mono text-foreground">vaultscope-admin</code> group:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-foreground/70">
              <li>In Authentik, go to <strong>Directory &rarr; Groups</strong> and create a group named <code className="font-mono text-foreground">vaultscope-admin</code>.</li>
              <li>Add all staff and engineering team members who require administrator access to this group.</li>
              <li>Navigate to <strong>Customization &rarr; Property Mappings</strong>, select <strong>Scope Mapping - OpenID 'groups'</strong>, and verify that user groups are emitted in the <code className="font-mono text-foreground">groups</code> or <code className="font-mono text-foreground">ak_groups</code> token claim.</li>
            </ol>
          </section>

          {/* Step 5: VAMOS Configuration */}
          <section id="backend-config" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">5. VAMOS Token Verification</h2>
            <p className="text-foreground/80">
              Configure VAMOS to download and cache Authentik public signing keys:
            </p>
            <CodeBlock
              code={vamosConfig}
              language="ini"
              title="/opt/vaultscope/vamos/.env"
            />
            <p className="text-foreground/80">
              VAMOS queries <code className="font-mono text-foreground">/.well-known/openid-configuration</code> on boot and periodically refreshes the public key cache every 6 hours.
            </p>
          </section>

          {/* Troubleshooting */}
          <section id="troubleshooting" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Troubleshooting OIDC Flows</h2>
            <div className="space-y-3 not-prose">
              <div className="p-3 rounded-lg border border-border bg-foreground/[0.01]">
                <h4 className="text-xs font-semibold text-foreground font-mono">Error: redirect_uri_mismatch</h4>
                <p className="text-xs text-foreground/70 mt-1">
                  Verify that the URL registered in Authentik exactly matches the URL sent by the client, including trailing slashes, protocol (<code className="font-mono">https://</code>), and port.
                </p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-foreground/[0.01]">
                <h4 className="text-xs font-semibold text-foreground font-mono">Error: 403 Forbidden on CAMOS Admin</h4>
                <p className="text-xs text-foreground/70 mt-1">
                  The authenticated user is not in the <code className="font-mono">vaultscope-admin</code> Authentik group. Ensure the group mapping is attached to the OIDC provider.
                </p>
              </div>
            </div>
          </section>

          <DocPagination
            prev={{ title: 'System Architecture', path: '/docs/architecture' }}
            next={{ title: 'VAMOS API Reference', path: '/docs/api' }}
          />
        </div>
    </div>
  );
};
