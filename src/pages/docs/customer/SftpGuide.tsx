import { useEffect } from 'react';
import { DocHeader } from '../components/DocHeader';
import { DocPagination } from '../components/DocPagination';
import { Callout } from '../components/Callout';
import { CodeBlock } from '../components/CodeBlock';
import { FolderGit2, HardDrive, Users, Terminal, DownloadCloud } from 'lucide-react';

const TOC = [
  { id: 'connection-parameters', label: 'Connection Credentials' },
  { id: 'filezilla-guide', label: 'FileZilla Setup Guide' },
  { id: 'cyberduck-guide', label: 'Cyberduck & Mountain Duck' },
  { id: 'winscp-guide', label: 'WinSCP Setup' },
  { id: 'rclone-automation', label: 'Automated Backups with Rclone' },
  { id: 'sub-accounts-acls', label: 'Sub-Accounts & Directory ACLs' },
];

export const SftpGuide = () => {
  useEffect(() => {
    document.title = 'Sovereign SFTP Storage Guide — VaultScope Customer Docs';
  }, []);

  return (
    <div className="space-y-8">
      <DocHeader
        breadcrumbs={[
          { label: 'Customer Guides', path: '/docs' },
          { label: 'Sovereign SFTP Storage' },
        ]}
        title="Sovereign SFTP Storage Guide"
        badge={{ label: 'Secure Storage', variant: 'purple' }}
        description="Comprehensive tutorial for connecting to your high-durability, GDPR-compliant SFTP storage repository using FileZilla, Cyberduck, WinSCP, and configuring automated rclone cloud backup synchronization."
        tocItems={TOC}
      />

      <div className="space-y-12 text-sm leading-relaxed">
        {/* Connection Credentials */}
        <section id="connection-parameters" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-purple-400" />
            <span>Connection Parameters & Endpoints</span>
          </h2>
          <p className="text-foreground/80">
            VaultScope Sovereign SFTP Storage provides enterprise-grade SSH File Transfer Protocol access powered by distributed Ceph storage. All data is replicated across multiple independent storage nodes in German ISO 27001 datacenters.
          </p>

          <div className="border border-border rounded-lg overflow-hidden not-prose my-4">
            <table className="w-full text-xs">
              <thead className="bg-foreground/5 text-foreground/70 font-mono border-b border-border text-left">
                <tr>
                  <th className="p-3">Parameter</th>
                  <th className="p-3">Value</th>
                  <th className="p-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                <tr>
                  <td className="p-3 text-foreground/50">Protocol</td>
                  <td className="p-3 font-semibold text-foreground">SFTP (SSH File Transfer Protocol)</td>
                  <td className="p-3 text-foreground/60 font-sans">Do NOT use unencrypted FTP or FTPS</td>
                </tr>
                <tr>
                  <td className="p-3 text-foreground/50">Host / Server</td>
                  <td className="p-3 font-semibold text-foreground">sftp.vaultscope.de</td>
                  <td className="p-3 text-foreground/60 font-sans">Or custom endpoint listed in your dashboard</td>
                </tr>
                <tr>
                  <td className="p-3 text-foreground/50">Port</td>
                  <td className="p-3 font-semibold text-foreground">2222</td>
                  <td className="p-3 text-foreground/60 font-sans">Standard SFTP port is 2222, not default 22</td>
                </tr>
                <tr>
                  <td className="p-3 text-foreground/50">Username</td>
                  <td className="p-3 font-semibold text-foreground">vs_usr_&lt;account_id&gt;</td>
                  <td className="p-3 text-foreground/60 font-sans">Found in Dashboard &rarr; Storage</td>
                </tr>
                <tr>
                  <td className="p-3 text-foreground/50">Authentication</td>
                  <td className="p-3 font-semibold text-foreground">Password or Ed25519 Public Key</td>
                  <td className="p-3 text-foreground/60 font-sans">Public keys can be uploaded in dashboard</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Callout type="warning" title="Port 2222 Notice">
            Always specify port <strong>2222</strong> in your FTP/SFTP client. Attempting to connect on port 22 will result in a connection refused or timeout error.
          </Callout>
        </section>

        {/* FileZilla Guide */}
        <section id="filezilla-guide" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <DownloadCloud className="w-5 h-5 text-blue-400" />
            <span>FileZilla Setup Guide</span>
          </h2>
          <p className="text-foreground/80">
            FileZilla is the most popular cross-platform graphical client. We recommend saving your connection in the Site Manager rather than using the Quickconnect bar to persist keep-alive settings:
          </p>

          <ol className="list-decimal pl-5 space-y-2.5 text-foreground/80">
            <li>Open FileZilla and click <strong>File &rarr; Site Manager</strong> (or press <kbd className="px-1 py-0.5 bg-foreground/10 border border-border rounded font-mono text-xs">Ctrl+S</kbd> / <kbd className="px-1 py-0.5 bg-foreground/10 border border-border rounded font-mono text-xs">Cmd+S</kbd>).</li>
            <li>Click <strong>New Site</strong> and name it <em>VaultScope Storage</em>.</li>
            <li>In the <strong>Protocol</strong> dropdown, select <strong>SFTP - SSH File Transfer Protocol</strong>.</li>
            <li>Set <strong>Host</strong> to <code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">sftp.vaultscope.de</code> and <strong>Port</strong> to <code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">2222</code>.</li>
            <li>In <strong>Logon Type</strong>, choose <strong>Normal</strong> (if using password) or <strong>Key file</strong> (if using private SSH key).</li>
            <li>Enter your username and password or browse to your private key file.</li>
            <li>Switch to the <strong>Transfer Settings</strong> tab, check <strong>Limit number of simultaneous connections</strong> and set it to <strong>8</strong> for optimal throughput.</li>
            <li>Click <strong>Connect</strong>. On first connection, accept the host key fingerprint.</li>
          </ol>
        </section>

        {/* Cyberduck & Mountain Duck */}
        <section id="cyberduck-guide" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-amber-400" />
            <span>Cyberduck & Mountain Duck (macOS & Windows)</span>
          </h2>
          <p className="text-foreground/80">
            Cyberduck offers native integration with macOS Keychain and Windows Credential Manager. Mountain Duck allows mounting your VaultScope SFTP folder directly as a local disk drive in Finder or Windows Explorer.
          </p>

          <div className="space-y-2 text-foreground/80">
            <h4 className="font-semibold text-foreground">Cyberduck Configuration Steps:</h4>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs text-foreground/80">
              <li>Click <strong>Open Connection</strong> in the top toolbar.</li>
              <li>Select <strong>SFTP (SSH File Transfer Protocol)</strong> from the protocol dropdown.</li>
              <li>Server: <code className="font-mono bg-foreground/5 px-1 py-0.5 rounded">sftp.vaultscope.de</code> &mdash; Port: <code className="font-mono bg-foreground/5 px-1 py-0.5 rounded">2222</code>.</li>
              <li>Enter your username and password or select your private SSH key.</li>
              <li>Click <strong>Connect</strong>, then drag the connection to your Bookmarks shelf for one-click access.</li>
            </ol>
          </div>
        </section>

        {/* WinSCP Guide */}
        <section id="winscp-guide" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <span>WinSCP Setup</span>
          </h2>
          <p className="text-foreground/80">
            WinSCP is widely favored in Windows enterprise environments and supports directory synchronization, script automation, and Pageant SSH agent authentication:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-foreground/80 text-xs">
            <li>File protocol: <strong>SFTP</strong></li>
            <li>Host name: <code className="font-mono bg-foreground/5 px-1 py-0.5 rounded">sftp.vaultscope.de</code></li>
            <li>Port number: <code className="font-mono bg-foreground/5 px-1 py-0.5 rounded">2222</code></li>
            <li>User name & Password as provided in your storage dashboard.</li>
          </ul>
        </section>

        {/* Rclone Automation */}
        <section id="rclone-automation" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-rose-400" />
            <span>Automated Backups with Rclone</span>
          </h2>
          <p className="text-foreground/80">
            <code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">rclone</code> is the industry standard CLI tool for synchronizing files and automating off-site backups to your VaultScope repository.
          </p>

          <h3 className="text-base font-semibold text-foreground pt-1">1. Configure Rclone Remote</h3>
          <p className="text-foreground/80">
            Run <code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">rclone config</code> or paste this configuration directly into <code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">~/.config/rclone/rclone.conf</code>:
          </p>
          <CodeBlock
            language="ini"
            code={`[vaultscope]
type = sftp
host = sftp.vaultscope.de
port = 2222
user = vs_usr_1024
key_file = ~/.ssh/id_ed25519
use_insecure_cipher = false
md5sum_command = none
sha1sum_command = none`}
          />

          <h3 className="text-base font-semibold text-foreground pt-1">2. Run Sync or Automated Cron</h3>
          <CodeBlock
            language="bash"
            code={`# Test sync with dry-run
rclone sync /var/backups/ vaultscope:backups/ --dry-run

# Execute high-throughput synchronization (8 parallel transfers)
rclone sync /var/backups/ vaultscope:backups/ \\
  --transfers 8 \\
  --checkers 16 \\
  --fast-list \\
  --progress`}
          />

          <Callout type="tip" title="Nightly Cronjob Example">
            Add to your server's root crontab (<code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">crontab -e</code>) to back up databases every morning at 03:00 UTC:
            <pre className="mt-2 text-xs font-mono text-foreground/80 bg-foreground/5 p-2 rounded">
{`0 3 * * * rclone sync /var/backups/ vaultscope:nightly/ --transfers 8 >> /var/log/backup-vaultscope.log 2>&1`}
            </pre>
          </Callout>
        </section>

        {/* Sub-Accounts & ACLs */}
        <section id="sub-accounts-acls" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Sub-Accounts & Directory ACLs</span>
          </h2>
          <p className="text-foreground/80">
            Rather than sharing primary account credentials, create isolated sub-users with specific directory scopes and granular Access Control Lists (ACLs):
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose my-3">
            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <h4 className="font-semibold text-foreground text-sm mb-1">Scoped Root Directory</h4>
              <p className="text-xs text-foreground/60">
                Lock users inside <code className="font-mono bg-foreground/5 px-1 py-0.5 rounded">/clients/acme/</code> using chroot isolation. They cannot navigate outside their designated directory.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <h4 className="font-semibold text-foreground text-sm mb-1">Read-Only or Write-Only</h4>
              <p className="text-xs text-foreground/60">
                Configure append-only or write-only dropboxes for untrusted automated backup agents to prevent ransomware from wiping existing backups.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <h4 className="font-semibold text-foreground text-sm mb-1">Per-User Storage Quotas</h4>
              <p className="text-xs text-foreground/60">
                Impose hard or soft gigabyte limits per sub-user to prevent runaway log files from consuming total shared repository allocation.
              </p>
            </div>
          </div>
        </section>

        <DocPagination
          prev={{
            title: 'Cloud VPS Management',
            path: '/docs/customer/vps',
          }}
          next={{
            title: 'Dedicated Bare-Metal Servers',
            path: '/docs/customer/dedicated',
          }}
        />
      </div>
    </div>
  );
};
