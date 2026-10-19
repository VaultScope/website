import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DocHeader } from '../components/DocHeader';
import { DocPagination } from '../components/DocPagination';
import { Callout } from '../components/Callout';

export const GettingStarted = () => {
  const location = useLocation();
  const isGerman = location.pathname.startsWith('/de');
  const getPath = (path: string) => (isGerman ? `/de${path}` : path);

  useEffect(() => {
    document.title = 'User Login & Account Guide — VaultScope Docs';
  }, []);

  return (
    <article className="space-y-10">
      <DocHeader
        breadcrumbs={[{ label: 'User Login & Account' }]}
        title="User Login & Account Guide"
        description="How to create your VaultScope account, verify your email address, sign in to the customer dashboard, and protect your account with Two-Factor Authentication (2FA)."
      />

      <div className="space-y-10 text-sm text-[var(--fg-muted)] leading-relaxed">
        {/* Step 1: Create an Account */}
        <section id="create-account" className="space-y-3 scroll-mt-28">
          <h2 className="text-xl font-semibold text-[var(--fg)] tracking-tight">
            1. Create an Account
          </h2>
          <p>
            To get started with VaultScope, create a customer account on the{' '}
            <Link to={getPath('/register')} className="text-[var(--accent-bright)] hover:underline">
              registration page (/register)
            </Link>
            :
          </p>
          <ol className="list-decimal pl-5 space-y-2.5">
            <li>
              <strong className="text-[var(--fg)]">Account Credentials:</strong> Enter your{' '}
              <strong>Username</strong>, <strong>Full Name</strong>, <strong>Email Address</strong>,
              and a strong <strong>Password</strong> (minimum 8 characters).
            </li>
            <li>
              <strong className="text-[var(--fg)]">Billing Address (with Autofill):</strong> Start
              typing your <strong>Street Address</strong>—VaultScope provides live address
              suggestions that automatically fill in your <strong>Postal Code (PLZ)</strong>,{' '}
              <strong>City</strong>, and <strong>Country</strong>. Browser native autofill is also
              supported across all address and phone fields.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Company &amp; EU VAT ID (Optional):</strong>{' '}
              Business customers can enter their <strong>Company</strong> name and{' '}
              <strong>EU VAT ID</strong> (e.g., <code className="font-mono text-xs text-[var(--fg)]">DE123456789</code>)
              directly during registration or manage and verify it via EU VIES later under{' '}
              <strong>Dashboard &rarr; Profile</strong>.
            </li>
          </ol>
        </section>

        {/* Step 2: Verify Your Email */}
        <section id="verify-email" className="space-y-3 scroll-mt-28">
          <h2 className="text-xl font-semibold text-[var(--fg)] tracking-tight">
            2. Verify Your Email
          </h2>
          <p>
            Right after creating your account, VaultScope sends a verification link to your email address. Click that link to confirm your email and unlock full account access.
          </p>
          <Callout type="info" title="Didn't receive the verification email?">
            Check your spam folder first. You can also request a fresh verification link at any time from <strong>Dashboard &rarr; Profile</strong>.
          </Callout>
        </section>

        {/* Step 3: Sign In */}
        <section id="sign-in" className="space-y-3 scroll-mt-28">
          <h2 className="text-xl font-semibold text-[var(--fg)] tracking-tight">
            3. Sign In to Dashboard
          </h2>
          <p>
            To access your services, SFTP credentials, or account settings, sign in at{' '}
            <Link to={getPath('/login')} className="text-[var(--accent-bright)] hover:underline font-mono">
              /login
            </Link>
            :
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Open the{' '}
              <Link to={getPath('/login')} className="text-[var(--fg)] underline hover:text-[var(--accent-bright)]">
                Sign In
              </Link>{' '}
              page using the <strong>Login</strong> button in the top navigation bar.
            </li>
            <li>
              Enter your registered <strong>Email</strong> and <strong>Password</strong>, then click <strong>Sign In</strong>.
            </li>
            <li>
              If you have enabled Two-Factor Authentication (2FA), enter the <strong>6-digit code</strong> from your authenticator app.
            </li>
            <li>
              Once signed in, you will be redirected to your <strong>Customer Dashboard</strong> (<code className="text-xs font-mono text-[var(--fg)]">/dashboard</code>).
            </li>
          </ol>
        </section>

        {/* Step 4: Two-Factor Authentication */}
        <section id="two-factor-auth" className="space-y-3 scroll-mt-28">
          <h2 className="text-xl font-semibold text-[var(--fg)] tracking-tight">
            4. Two-Factor Authentication (2FA)
          </h2>
          <p>
            We recommend enabling Two-Factor Authentication (TOTP) to protect your account. You can use any standard authenticator app (such as Ente Auth, Google Authenticator, 1Password, Bitwarden, or Apple Passwords).
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Sign in and open <strong>Dashboard &rarr; Profile &rarr; 2FA / Security</strong> (<code className="font-mono text-xs text-[var(--fg)]">/dashboard/profile/mfa</code>).
            </li>
            <li>
              Click <strong>Enable Two-Factor Authentication</strong> to generate your QR code and secret key.
            </li>
            <li>
              Scan the QR code with your authenticator app.
            </li>
            <li>
              Enter the <strong>6-digit code</strong> shown in your authenticator app to confirm and activate 2FA.
            </li>
          </ol>
        </section>

        <DocPagination
          prev={{
            title: 'Documentation Overview',
            path: '/docs',
          }}
          next={{
            title: 'SFTP Storage Guide',
            path: '/docs/customer/sftp',
          }}
        />
      </div>
    </article>
  );
};
