import { useEffect } from 'react';
import { DocHeader } from '../components/DocHeader';
import { DocPagination } from '../components/DocPagination';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

const TOC = [
  { id: 'env-matrix', label: 'Environment Variables' },
  { id: 'sample-env', label: 'Sample .env File' },
  { id: 'authentik-client', label: 'Authentik Admin Client' },
  { id: 'rbac-roles', label: 'RBAC & Permission Mapping' },
  { id: 'session-timeout', label: 'Session Management' },
];

export const CamosConfig = () => {
  useEffect(() => {
    document.title = 'CAMOS Configuration — VaultScope Docs';
  }, []);

  const sampleEnv = `# ==============================================================================
# CAMOS Administrative Panel Configuration
# ==============================================================================

# VAMOS Backend API (Admin Endpoints)
VITE_API_URL=https://api.vaultscope.de/api

# Authentik OIDC Single Sign-On
VITE_AUTHENTIK_URL=https://auth.vaultscope.de
VITE_OIDC_CLIENT_ID=vaultscope-camos
VITE_OIDC_REDIRECT_URI=https://admin.vaultscope.de/callback

# Optional Inactivity Timeout (Minutes)
VITE_SESSION_TIMEOUT_MINUTES=30`;

  return (
    <div className="space-y-8">
      <DocHeader
        breadcrumbs={[
          { label: 'Projects', path: '/docs/projects' },
          { label: 'CAMOS', path: '/docs/projects/camos' },
          { label: 'Configuration' },
        ]}
        title="CAMOS Configuration"
        badge={{ label: 'Admin Reference' }}
        description="Detailed reference for CAMOS environment flags, Authentik administrator client settings, and role-based access control."
        projectKey="camos"
        tocItems={TOC}
      />

        <div className="space-y-12 text-sm leading-relaxed">
          {/* Environment Variables Table */}
          <section id="env-matrix" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Environment Variables</h2>
            <p className="text-foreground/80">
              The admin control plane requires the following build-time parameters:
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
                    <td className="px-4 py-2.5 font-mono text-foreground/60">https://api.vaultscope.de/api</td>
                    <td className="px-4 py-2.5 text-foreground/60">Target VAMOS REST API address.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono font-medium text-foreground">VITE_AUTHENTIK_URL</td>
                    <td className="px-4 py-2.5 font-mono text-rose-500 font-semibold">Yes</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">https://auth.vaultscope.de</td>
                    <td className="px-4 py-2.5 text-foreground/60">Authentik identity provider endpoint.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono font-medium text-foreground">VITE_OIDC_CLIENT_ID</td>
                    <td className="px-4 py-2.5 font-mono text-rose-500 font-semibold">Yes</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">vaultscope-camos</td>
                    <td className="px-4 py-2.5 text-foreground/60">OIDC client ID configured for admin access.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono font-medium text-foreground">VITE_OIDC_REDIRECT_URI</td>
                    <td className="px-4 py-2.5 font-mono text-rose-500 font-semibold">Yes</td>
                    <td className="px-4 py-2.5 font-mono text-foreground/60">https://admin.../callback</td>
                    <td className="px-4 py-2.5 text-foreground/60">Post-authentication callback URL.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Sample Env */}
          <section id="sample-env" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Sample Configuration File</h2>
            <CodeBlock
              code={sampleEnv}
              language="ini"
              title=".env"
            />
          </section>

          {/* Authentik Client */}
          <section id="authentik-client" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Authentik Admin Client Setup</h2>
            <p className="text-foreground/80">
              When creating the CAMOS application in Authentik:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-foreground/70">
              <li><strong>Client Type:</strong> Public (Authorization Code Flow with PKCE)</li>
              <li><strong>Redirect URIs:</strong> <code className="font-mono text-foreground">https://admin.vaultscope.de/callback</code></li>
              <li><strong>Post-Logout Redirect URIs:</strong> <code className="font-mono text-foreground">https://admin.vaultscope.de/login</code></li>
              <li><strong>Scopes:</strong> <code className="font-mono text-foreground">openid profile email groups</code></li>
            </ul>
          </section>

          {/* RBAC Roles */}
          <section id="rbac-roles" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">RBAC & Group Membership</h2>
            <p className="text-foreground/80">
              VAMOS enforces that access tokens submitted to <code className="font-mono text-foreground">/api/v1/admin/*</code> endpoints contain the <code className="font-mono text-foreground">vaultscope-admin</code> group in their claims. Regular users attempting to sign into CAMOS will be blocked at the API gateway layer.
            </p>
            <Callout type="warning" title="Group Claim Mapping">
              Ensure that your Authentik Scope Mapping for <code className="font-mono text-foreground">groups</code> includes the <code className="font-mono text-foreground">ak_groups</code> claim in the ID and access tokens.
            </Callout>
          </section>

          {/* Session Timeout */}
          <section id="session-timeout" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Staff Inactivity Timeout</h2>
            <p className="text-foreground/80">
              To comply with security audits, CAMOS tracks user interaction and terminates the administrative session after 30 minutes of idle time. The timer resets on keyboard or mouse input.
            </p>
          </section>

          <DocPagination
            prev={{ title: 'CAMOS Installation', path: '/docs/projects/camos/install' }}
            next={{ title: 'CAMOS Lifecycle & Upgrades', path: '/docs/projects/camos/lifecycle' }}
          />
        </div>
    </div>
  );
};
