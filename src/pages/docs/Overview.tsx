import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DocHeader } from './components/DocHeader';
import { DocPagination } from './components/DocPagination';

export const DocsOverview = () => {
  const location = useLocation();
  const isGerman = location.pathname.startsWith('/de');
  const getPath = (path: string) => (isGerman ? `/de${path}` : path);

  useEffect(() => {
    document.title = 'Documentation Overview — VaultScope';
  }, []);

  return (
    <article className="space-y-10">
      <DocHeader
        breadcrumbs={[{ label: 'Overview' }]}
        title="VaultScope Documentation"
        description="Clear, step-by-step guides for signing in to your VaultScope account and connecting to your SFTP Storage."
      />

      <div className="space-y-10 text-sm text-[var(--fg-muted)] leading-relaxed">
        {/* 1. Introduction */}
        <section id="welcome" className="space-y-3 scroll-mt-28">
          <h2 className="text-xl font-semibold text-[var(--fg)] tracking-tight">
            Introduction
          </h2>
          <p>
            Welcome to the VaultScope documentation. Here you will find straightforward instructions for managing your VaultScope customer account and connecting to your SFTP Storage.
          </p>
        </section>

        {/* 2. User Login & Account */}
        <section id="user-login" className="space-y-3 scroll-mt-28">
          <h2 className="text-xl font-semibold text-[var(--fg)] tracking-tight">
            User Login &amp; Account
          </h2>
          <p>
            Your VaultScope account gives you access to the customer dashboard where you can view your active storage, manage credentials, and configure Two-Factor Authentication (2FA).
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Registering:</strong> Create an account at{' '}
              <Link to={getPath('/register')} className="text-[var(--accent-bright)] hover:underline">
                /register
              </Link>{' '}
              with your account credentials, billing address (with live street, postal code, and city autofill), and optional company name and EU VAT ID.
            </li>
            <li>
              <strong>Signing in:</strong> Log in at{' '}
              <Link to={getPath('/login')} className="text-[var(--accent-bright)] hover:underline">
                /login
              </Link>{' '}
              to open your customer dashboard.
            </li>
            <li>
              <strong>Two-Factor Authentication (2FA):</strong> Protect your account with any TOTP authenticator app under <strong>Dashboard &rarr; Profile &rarr; 2FA / Security</strong>.
            </li>
          </ul>
          <p className="pt-1">
            Read the full{' '}
            <Link
              to={getPath('/docs/customer/getting-started')}
              className="text-[var(--accent-bright)] font-medium hover:underline"
            >
              User Login &amp; Account Guide &rarr;
            </Link>
          </p>
        </section>

        {/* 3. SFTP Storage */}
        <section id="sftp-overview" className="space-y-3 scroll-mt-28">
          <h2 className="text-xl font-semibold text-[var(--fg)] tracking-tight">
            SFTP Storage Guide
          </h2>
          <p>
            VaultScope SFTP Storage provides encrypted storage hosted in Germany. Once your storage plan is active, you can access it in three ways:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Built-in Web File Manager:</strong> Upload, download, and manage folders directly in your browser at <code className="font-mono text-xs text-[var(--fg)]">/web/client</code>.
            </li>
            <li>
              <strong>FTHR Clipping Preset:</strong> Copy a ready-to-use JSON configuration from your dashboard and paste it directly into FTHR.
            </li>
            <li>
              <strong>Standard SFTP Clients:</strong> Connect via FileZilla, WinSCP, Cyberduck, or the command line on port <code className="font-mono text-xs text-[var(--fg)]">2022</code>.
            </li>
          </ul>
          <p className="pt-1">
            Read the full{' '}
            <Link
              to={getPath('/docs/customer/sftp')}
              className="text-[var(--accent-bright)] font-medium hover:underline"
            >
              SFTP Storage Guide &rarr;
            </Link>
          </p>
        </section>

        {/* 4. Connection Details Table */}
        <section id="connection-details" className="space-y-4 scroll-mt-28">
          <h2 className="text-xl font-semibold text-[var(--fg)] tracking-tight">
            Connection Details
          </h2>
          <p>
            Use the following server settings when connecting to VaultScope SFTP Storage:
          </p>

          <div className="overflow-x-auto border border-[var(--line)] rounded-lg not-prose">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--bg-elevated)] text-[var(--fg-muted)] border-b border-[var(--line)]">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Setting</th>
                  <th className="py-2.5 px-4 font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                <tr>
                  <td className="py-2.5 px-4 text-[var(--fg-muted)]">Hostname</td>
                  <td className="py-2.5 px-4 font-mono text-[var(--fg)]">sftp.vaultscope.de</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-[var(--fg-muted)]">Port</td>
                  <td className="py-2.5 px-4 font-mono text-[var(--accent-bright)] font-semibold">2022</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-[var(--fg-muted)]">Protocol</td>
                  <td className="py-2.5 px-4 font-mono text-[var(--fg)]">SFTP (SSH)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-[var(--fg-muted)]">Username &amp; Password</td>
                  <td className="py-2.5 px-4 text-[var(--fg)]">
                    Shown in{' '}
                    <Link to={getPath('/dashboard/sftp')} className="text-[var(--accent-bright)] hover:underline">
                      Dashboard &rarr; SFTP Storage
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <DocPagination
          next={{
            title: 'User Login & Account Guide',
            path: '/docs/customer/getting-started',
          }}
        />
      </div>
    </article>
  );
};
