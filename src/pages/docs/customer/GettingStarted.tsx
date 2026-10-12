import { useEffect } from 'react';
import { DocHeader } from '../components/DocHeader';
import { DocPagination } from '../components/DocPagination';
import { Callout } from '../components/Callout';
import { ShieldCheck, Key, Lock, UserCheck, AlertCircle } from 'lucide-react';

const TOC = [
  { id: 'account-creation', label: 'Account Registration' },
  { id: 'email-verification', label: 'Email Verification' },
  { id: 'totp-mfa', label: 'Two-Factor Authentication (2FA)' },
  { id: 'security-best-practices', label: 'Security & Access Control' },
  { id: 'data-sovereignty', label: 'GDPR & Data Sovereignty' },
];

export const GettingStarted = () => {
  useEffect(() => {
    document.title = 'Getting Started & Account Security — VaultScope Customer Docs';
  }, []);

  return (
    <div className="space-y-8">
      <DocHeader
        breadcrumbs={[
          { label: 'Customer Guides', path: '/docs' },
          { label: 'Getting Started' },
        ]}
        title="Getting Started & Account Security"
        badge={{ label: 'Customer Guide', variant: 'blue' }}
        description="Comprehensive guide to onboarding with VaultScope, setting up Multi-Factor Authentication (2FA), managing credentials, and understanding our German data sovereignty guarantees."
        tocItems={TOC}
      />

      <div className="space-y-12 text-sm leading-relaxed">
        {/* Account Registration */}
        <section id="account-creation" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-400" />
            <span>Account Registration</span>
          </h2>
          <p className="text-foreground/80">
            VaultScope provides a frictionless onboarding flow designed for developers, agencies, and enterprises. To register, navigate to the registration portal and provide your company or personal details.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose my-4">
            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <h3 className="text-sm font-semibold text-foreground mb-1">1. Organization Details</h3>
              <p className="text-xs text-foreground/60">
                Specify business or personal account type. For EU businesses, enter your VIES-registered VAT ID for automated tax exemption.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <h3 className="text-sm font-semibold text-foreground mb-1">2. Strong Password</h3>
              <p className="text-xs text-foreground/60">
                Choose a high-entropy password (minimum 12 characters). Passwords are securely hashed using Argon2id with salted parameters.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <h3 className="text-sm font-semibold text-foreground mb-1">3. Instant Provisioning</h3>
              <p className="text-xs text-foreground/60">
                Immediately after registration, access your customer dashboard to deploy Cloud VPS, Dedicated Servers, and SFTP Storage.
              </p>
            </div>
          </div>
        </section>

        {/* Email Verification */}
        <section id="email-verification" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-400" />
            <span>Email Verification</span>
          </h2>
          <p className="text-foreground/80">
            Upon submitting your registration, an automated cryptographically signed verification link is dispatched to your registered email address.
          </p>
          <Callout type="info" title="Verification Requirement">
            Unverified accounts have full read-only access to browse product catalogs and configure deployment templates, but active provisioning and invoice generation require a verified email address to prevent service abuse.
          </Callout>
          <p className="text-foreground/80">
            If you did not receive your verification email within 2 minutes:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-foreground/80">
            <li>Inspect your spam or junk mail folder.</li>
            <li>Verify that your corporate mail firewall allows deliveries from <code className="text-xs font-mono bg-foreground/5 px-1.5 py-0.5 rounded">noreply@vaultscope.de</code>.</li>
            <li>Click <strong>Resend Verification Email</strong> in your dashboard header alert.</li>
          </ul>
        </section>

        {/* TOTP MFA */}
        <section id="totp-mfa" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <span>Two-Factor Authentication (2FA / TOTP)</span>
          </h2>
          <p className="text-foreground/80">
            We strongly mandate enabling Time-based One-Time Password (TOTP) Two-Factor Authentication on all production accounts. 2FA prevents unauthorized infrastructure modifications even in the event of compromised credentials.
          </p>
          
          <h3 className="text-base font-semibold text-foreground pt-2">Step-by-Step Setup:</h3>
          <ol className="list-decimal pl-5 space-y-3 text-foreground/80">
            <li>
              Navigate to <strong>Dashboard &rarr; Profile &rarr; Multi-Factor Authentication (2FA)</strong>.
            </li>
            <li>
              Click <strong>Enable Two-Factor Authentication</strong> to generate an RFC 6238 TOTP seed.
            </li>
            <li>
              Scan the displayed QR code with your authenticator application of choice:
              <ul className="list-disc pl-5 mt-1 space-y-0.5 text-xs text-foreground/70">
                <li>1Password, Bitwarden, or KeePassXC</li>
                <li>Google Authenticator or Microsoft Authenticator</li>
                <li>Ente Auth or Apple Passwords</li>
              </ul>
            </li>
            <li>
              Enter the 6-digit verification code generated by your authenticator to verify synchronization.
            </li>
            <li>
              <strong>Crucial:</strong> Safely record your 8 emergency recovery backup codes in a password manager or physical vault. Each code can be used exactly once if you lose access to your primary 2FA device.
            </li>
          </ol>

          <Callout type="warning" title="Emergency Recovery Codes">
            Support agents cannot bypass 2FA without an extensive notarized identity verification procedure. Always store your backup codes offline.
          </Callout>
        </section>

        {/* Security Best Practices */}
        <section id="security-best-practices" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <span>Security & Access Control Best Practices</span>
          </h2>
          <p className="text-foreground/80">
            Follow these baseline operational guidelines to maximize the security posture of your hosted resources:
          </p>
          <div className="space-y-3 text-foreground/80">
            <div className="border border-border rounded-lg p-4 bg-foreground/[0.01]">
              <h4 className="font-semibold text-foreground text-sm mb-1">Enforce SSH Key-Only Authentication</h4>
              <p className="text-xs text-foreground/70">
                Disable password authentication on all Linux VPS instances by setting <code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">PasswordAuthentication no</code> in <code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">/etc/ssh/sshd_config</code>. Use Ed25519 elliptic-curve keys exclusively.
              </p>
            </div>
            <div className="border border-border rounded-lg p-4 bg-foreground/[0.01]">
              <h4 className="font-semibold text-foreground text-sm mb-1">Least-Privilege Sub-Accounts for SFTP</h4>
              <p className="text-xs text-foreground/70">
                Do not share root SFTP credentials with third-party vendors or automated CI/CD runners. Create scoped sub-users with restricted directory paths and read-only or write-only ACL masks.
              </p>
            </div>
            <div className="border border-border rounded-lg p-4 bg-foreground/[0.01]">
              <h4 className="font-semibold text-foreground text-sm mb-1">Audit Log Telemetry</h4>
              <p className="text-xs text-foreground/70">
                Review <strong>Dashboard &rarr; Profile &rarr; Activity Logs</strong> periodically to monitor IP addresses, authentication timestamps, and administrative actions performed across your account.
              </p>
            </div>
          </div>
        </section>

        {/* GDPR & Data Sovereignty */}
        <section id="data-sovereignty" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-emerald-400" />
            <span>GDPR Compliance & German Data Sovereignty</span>
          </h2>
          <p className="text-foreground/80">
            VaultScope is 100% founded, engineered, and operated within the European Union. All cloud virtualization nodes, dedicated bare-metal servers, and Ceph-backed storage clusters reside exclusively in certified Tier-3+ datacenter parks in Nuremberg and Falkenstein, Germany.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-foreground/80">
            <li><strong>ISO 27001 Certified:</strong> Datacenter facilities adhere to strict information security management standards.</li>
            <li><strong>Zero US Cloud CLOUD Act Exposure:</strong> VaultScope is not subject to foreign extraterritorial subpoena legislation.</li>
            <li><strong>Data Processing Agreement (DPA / AVV):</strong> A standard Art. 28 GDPR compliant Data Processing Agreement is available electronically for immediate execution within your dashboard.</li>
          </ul>
        </section>

        <DocPagination
          next={{
            title: 'Cloud VPS Management',
            path: '/docs/customer/vps',
          }}
        />
      </div>
    </div>
  );
};
