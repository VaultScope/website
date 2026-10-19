import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DocHeader } from '../components/DocHeader';
import { DocPagination } from '../components/DocPagination';
import { Callout } from '../components/Callout';
import { CodeBlock } from '../components/CodeBlock';

export const SftpGuide = () => {
  const location = useLocation();
  const isGerman = location.pathname.startsWith('/de');
  const getPath = (path: string) => (isGerman ? `/de${path}` : path);

  useEffect(() => {
    document.title = 'SFTP Storage Guide — VaultScope Docs';
  }, []);

  return (
    <article className="space-y-10">
      <DocHeader
        breadcrumbs={[{ label: 'SFTP Storage' }]}
        title="SFTP Storage Guide"
        description="How to find your SFTP credentials in the dashboard, manage files in your browser using the Web File Manager, copy your FTHR clipping preset, or connect with any SFTP client on port 2022."
      />

      <div className="space-y-10 text-sm text-[var(--fg-muted)] leading-relaxed">
        {/* 1. Connection Details */}
        <section id="connection-details" className="space-y-4 scroll-mt-28">
          <h2 className="text-xl font-semibold text-[var(--fg)] tracking-tight">
            1. Connection Details
          </h2>
          <p>
            Once your SFTP Storage plan or free trial is active, your connection details are displayed inside{' '}
            <Link to={getPath('/dashboard/sftp')} className="text-[var(--accent-bright)] hover:underline">
              Dashboard &rarr; SFTP Storage (/dashboard/sftp)
            </Link>
            .
          </p>

          <div className="overflow-x-auto border border-[var(--line)] rounded-lg not-prose">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--bg-elevated)] text-[var(--fg-muted)] border-b border-[var(--line)]">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Setting</th>
                  <th className="py-2.5 px-4 font-medium">Value</th>
                  <th className="py-2.5 px-4 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                <tr>
                  <td className="py-2.5 px-4 text-[var(--fg-muted)]">Protocol</td>
                  <td className="py-2.5 px-4 font-mono text-[var(--fg)]">SFTP (SSH File Transfer Protocol)</td>
                  <td className="py-2.5 px-4 text-[var(--fg-muted)]">Encrypted SFTP</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-[var(--fg-muted)]">Hostname</td>
                  <td className="py-2.5 px-4 font-mono text-[var(--fg)]">sftp.vaultscope.de</td>
                  <td className="py-2.5 px-4 text-[var(--fg-muted)]">Shown on your storage card</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-[var(--fg-muted)]">Port</td>
                  <td className="py-2.5 px-4 font-mono font-semibold text-[var(--accent-bright)]">2022</td>
                  <td className="py-2.5 px-4 text-[var(--fg-muted)]">Always use port 2022 (not 22)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-[var(--fg-muted)]">Username</td>
                  <td className="py-2.5 px-4 font-mono text-[var(--fg)]">Your SFTP username</td>
                  <td className="py-2.5 px-4 text-[var(--fg-muted)]">Copy from Dashboard &rarr; SFTP Storage</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-[var(--fg-muted)]">Password</td>
                  <td className="py-2.5 px-4 font-mono text-[var(--fg)]">Your SFTP password</td>
                  <td className="py-2.5 px-4 text-[var(--fg-muted)]">Shown in Dashboard on initial setup</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Callout type="warning" title="Important: Use Port 2022">
            VaultScope SFTP Storage runs on port <strong>2022</strong>. Make sure you enter <code className="font-mono">2022</code> in the port field of your SFTP client.
          </Callout>
        </section>

        {/* 2. Web File Manager */}
        <section id="web-file-manager" className="space-y-3 scroll-mt-28">
          <h2 className="text-xl font-semibold text-[var(--fg)] tracking-tight">
            2. Built-in Web File Manager
          </h2>
          <p>
            You can upload, download, and organize files directly in your browser without installing any software:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Go to{' '}
              <Link to={getPath('/dashboard/sftp')} className="text-[var(--fg)] underline hover:text-[var(--accent-bright)]">
                Dashboard &rarr; SFTP Storage
              </Link>
              .
            </li>
            <li>
              Click <strong>Open Web File Manager</strong> (or visit <code className="text-xs font-mono text-[var(--fg)]">/web/client</code>).
            </li>
            <li>
              Sign in with the <strong>Username</strong> and <strong>Password</strong> from your SFTP Storage card.
            </li>
          </ol>
        </section>

        {/* 3. FTHR Integration */}
        <section id="fthr-integration" className="space-y-3 scroll-mt-28">
          <h2 className="text-xl font-semibold text-[var(--fg)] tracking-tight">
            3. FTHR Clipping Preset
          </h2>
          <p>
            If you use <strong>FTHR</strong> for game clipping and automatic video uploads, you can copy a ready-made configuration directly from your dashboard:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Open{' '}
              <Link to={getPath('/dashboard/sftp')} className="text-[var(--fg)] underline hover:text-[var(--accent-bright)]">
                Dashboard &rarr; SFTP Storage
              </Link>
              .
            </li>
            <li>
              Click <strong>CONFIGURATIONS</strong> on your active storage card and select <strong>FTHR &mdash; Copy clipping JSON</strong>.
            </li>
            <li>
              Paste the copied JSON directly into FTHR:
            </li>
          </ol>

          <CodeBlock
            language="json"
            code={`{
  "username": "your_sftp_username",
  "password": "your_sftp_password",
  "port": 2022,
  "domain": "sftp.vaultscope.de",
  "providerName": "VaultScope"
}`}
          />
        </section>

        {/* 4. Desktop SFTP Clients & CLI */}
        <section id="sftp-clients" className="space-y-4 scroll-mt-28">
          <h2 className="text-xl font-semibold text-[var(--fg)] tracking-tight">
            4. SFTP Clients &amp; Command Line
          </h2>
          <p>
            You can connect from any standard SFTP client (such as FileZilla, WinSCP, or Cyberduck) or from your terminal:
          </p>

          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[var(--fg)]">FileZilla / WinSCP / Cyberduck:</strong> Choose protocol <strong>SFTP</strong>, set Host to <code className="font-mono text-xs text-[var(--fg)]">sftp.vaultscope.de</code>, set Port to <code className="font-mono text-xs text-[var(--accent-bright)]">2022</code>, and sign in with your dashboard username and password.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Command Line (macOS, Linux, Windows PowerShell):</strong> Pass <code className="font-mono text-xs text-[var(--fg)]">-P 2022</code> to the <code className="font-mono text-xs text-[var(--fg)]">sftp</code> command:
            </li>
          </ul>

          <CodeBlock
            language="bash"
            code={`sftp -P 2022 <your_username>@sftp.vaultscope.de`}
          />
        </section>

        <DocPagination
          prev={{
            title: 'User Login & Account Guide',
            path: '/docs/customer/getting-started',
          }}
        />
      </div>
    </article>
  );
};
