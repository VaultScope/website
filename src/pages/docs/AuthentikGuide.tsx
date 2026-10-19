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
        description="Step-by-step instructions for configuring Authentik as the centralized identity provider for customer authentication and staff RBAC authorization."
        tocItems={TOC}
      />

        <div className="space-y-12 text-sm leading-relaxed">
          {/* Identity Architecture */}
          <section id="overview" className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">Identity Architecture</h2>
            <p className="text-[var(--text-secondary)]">
              VaultScope uses Authentik for centralized identity management, WebAuthn/TOTP multi-factor authentication, and federated Single Sign-On (SSO). Both the public Storefront and the CAMOS admin portal authenticate users via the OpenID Connect (OIDC) Authorization Code Flow with PKCE (Proof Key for Code Exchange).
            </p>
            <p className="text-[var(--text-secondary)]">
              When a user signs in, Authentik generates an RSA-signed JSON Web Token (JWT). The VAMOS API validates these tokens against Authentik's JWKS (JSON Web Key Set) discovery endpoint and extracts identity and permission claims.
            </p>
          </section>

          {/* Step 1: Create OAuth2 Provider */}
          <section id="create-provider" className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">1. Create OAuth2 Provider in Authentik</h2>
            <ol className="list-decimal pl-5 space-y-2 text-[var(--text-secondary)]">
              <li>Log in to your Authentik Administrative Interface (<code className="font-mono text-[var(--text)]">https://auth.your-domain.com</code>).</li>
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
              Always set <strong>Client Type</strong> to <code className="font-mono text-[var(--text)]">Public</code>. Public clients require PKCE (<code className="font-mono text-[var(--text)]">code_challenge</code> and <code className="font-mono text-[var(--text)]">code_verifier</code>), eliminating the need to expose client secrets in browser bundles.
            </Callout>
          </section>

          {/* Step 2: Register Applications */}
          <section id="create-apps" className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">2. Register Applications in Authentik</h2>
            <p className="text-[var(--text-secondary)]">
              Under <strong>Applications &rarr; Applications</strong>, create two distinct application entries bound to your newly created provider:
            </p>
            <div className="grid sm:grid-cols-2 border border-[var(--line)] divide-y sm:divide-y-0 sm:divide-x divide-[var(--line)] bg-[var(--bg-card)] not-prose">
              <div className="p-5 space-y-1.5">
                <h4 className="text-sm font-semibold text-[var(--text)]">Storefront App</h4>
                <p className="text-xs text-[var(--text-secondary)]"><strong>Name:</strong> VaultScope Storefront</p>
                <p className="text-xs text-[var(--text-secondary)]"><strong>Slug:</strong> <code className="font-mono text-[var(--text)]">vaultscope-storefront</code></p>
                <p className="text-xs text-[var(--text-secondary)]"><strong>Launch URL:</strong> <code className="font-mono text-[var(--text)]">https://vaultscope.de</code></p>
                <p className="text-xs text-[var(--text-secondary)]"><strong>Provider:</strong> VaultScope Core OIDC</p>
              </div>

              <div className="p-5 space-y-1.5">
                <h4 className="text-sm font-semibold text-[var(--text)]">CAMOS Admin App</h4>
                <p className="text-xs text-[var(--text-secondary)]"><strong>Name:</strong> VaultScope CAMOS Admin</p>
                <p className="text-xs text-[var(--text-secondary)]"><strong>Slug:</strong> <code className="font-mono text-[var(--text)]">vaultscope-camos</code></p>
                <p className="text-xs text-[var(--text-secondary)]"><strong>Launch URL:</strong> <code className="font-mono text-[var(--text)]">https://admin.vaultscope.de</code></p>
                <p className="text-xs text-[var(--text-secondary)]"><strong>Provider:</strong> VaultScope Core OIDC</p>
              </div>
            </div>
          </section>

          {/* Step 3: Configure Redirect URIs */}
          <section id="redirect-uris" className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">3. Configure Redirect URIs</h2>
            <p className="text-[var(--text-secondary)]">
              Authentik strictly validates redirect targets to prevent authorization code leakage. Ensure the following callback patterns are configured:
            </p>
            <div className="border border-[var(--line)] overflow-x-auto not-prose">
              <table className="w-full text-xs text-left">
                <thead className="bg-[var(--bg-elevated)] border-b border-[var(--line)] text-[var(--text-muted)] font-mono uppercase tracking-[0.06em]">
                  <tr>
                    <th className="px-4 py-2.5">Application</th>
                    <th className="px-4 py-2.5">Redirect Callback URI</th>
                    <th className="px-4 py-2.5">Post-Logout URI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)] text-[var(--text-secondary)] font-mono bg-[var(--bg-card)]">
                  <tr>
                    <td className="px-4 py-2.5 font-medium font-sans text-[var(--text)]">Storefront</td>
                    <td className="px-4 py-2.5">https://vaultscope.de/auth/callback</td>
                    <td className="px-4 py-2.5">https://vaultscope.de</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium font-sans text-[var(--text)]">CAMOS Admin</td>
                    <td className="px-4 py-2.5">https://admin.vaultscope.de/callback</td>
                    <td className="px-4 py-2.5">https://admin.vaultscope.de/login</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Step 4: Staff Group & Claims */}
          <section id="rbac-groups" className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">4. Staff Group & Scope Mapping</h2>
            <p className="text-[var(--text-secondary)]">
              Administrative access to CAMOS and VAMOS admin endpoints requires the <code className="font-mono text-[var(--text)]">vaultscope-admin</code> group:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-[var(--text-secondary)]">
              <li>In Authentik, go to <strong>Directory &rarr; Groups</strong> and create a group named <code className="font-mono text-[var(--text)]">vaultscope-admin</code>.</li>
              <li>Add all staff and engineering team members who require administrator access to this group.</li>
              <li>Navigate to <strong>Customization &rarr; Property Mappings</strong>, select <strong>Scope Mapping - OpenID 'groups'</strong>, and verify that user groups are emitted in the <code className="font-mono text-[var(--text)]">groups</code> or <code className="font-mono text-[var(--text)]">ak_groups</code> token claim.</li>
            </ol>
          </section>

          {/* Step 5: VAMOS Configuration */}
          <section id="backend-config" className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">5. VAMOS Token Verification</h2>
            <p className="text-[var(--text-secondary)]">
              Configure VAMOS to download and cache Authentik public signing keys:
            </p>
            <CodeBlock
              code={vamosConfig}
              language="ini"
              title="/opt/vaultscope/vamos/.env"
            />
            <p className="text-[var(--text-secondary)]">
              VAMOS queries <code className="font-mono text-[var(--text)]">/.well-known/openid-configuration</code> on boot and periodically refreshes the public key cache every 6 hours.
            </p>
          </section>

          {/* Troubleshooting */}
          <section id="troubleshooting" className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">Troubleshooting OIDC Flows</h2>
            <div className="border border-[var(--line)] divide-y divide-[var(--line)] bg-[var(--bg-card)] not-prose">
              <div className="p-4">
                <h4 className="text-xs font-semibold text-[var(--text)] font-mono">Error: redirect_uri_mismatch</h4>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Verify that the URL registered in Authentik exactly matches the URL sent by the client, including trailing slashes, protocol (<code className="font-mono text-[var(--text)]">https://</code>), and port.
                </p>
              </div>
              <div className="p-4">
                <h4 className="text-xs font-semibold text-[var(--text)] font-mono">Error: 403 Forbidden on CAMOS Admin</h4>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  The authenticated user is not in the <code className="font-mono text-[var(--text)]">vaultscope-admin</code> Authentik group. Ensure the group mapping is attached to the OIDC provider.
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
