import { useEffect } from 'react';
import { DocHeader } from '../components/DocHeader';
import { DocPagination } from '../components/DocPagination';
import { Callout } from '../components/Callout';
import { CodeBlock } from '../components/CodeBlock';
import { Terminal, Power, RefreshCw, Monitor, Shield, Network } from 'lucide-react';

const TOC = [
  { id: 'connecting-ssh', label: 'Connecting via SSH & Keys' },
  { id: 'power-management', label: 'Power & Lifecycle States' },
  { id: 'web-console', label: 'In-Browser noVNC Console' },
  { id: 'os-reinstall', label: 'Operating System Reinstall' },
  { id: 'rescue-mode', label: 'Rescue Environment & Recovery' },
  { id: 'networking', label: 'Reverse DNS (PTR) & Firewall' },
];

export const VpsGuide = () => {
  useEffect(() => {
    document.title = 'Cloud VPS Management — VaultScope Customer Docs';
  }, []);

  return (
    <div className="space-y-8">
      <DocHeader
        breadcrumbs={[
          { label: 'Customer Guides', path: '/docs' },
          { label: 'Cloud VPS Management' },
        ]}
        title="Cloud VPS Management Guide"
        badge={{ label: 'Virtual Servers', variant: 'blue' }}
        description="Comprehensive customer operations handbook for connecting to Cloud VPS via SSH, managing instance power states, using the interactive in-browser noVNC console, performing operating system reinstalls, and configuring reverse DNS."
        tocItems={TOC}
      />

      <div className="space-y-12 text-sm leading-relaxed">
        {/* Connecting via SSH */}
        <section id="connecting-ssh" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[var(--text)]" />
            <span>Connecting via SSH & Key Management</span>
          </h2>
          <p className="text-foreground/80">
            VaultScope Cloud VPS instances are provisioned with hardened SSH daemons. We strongly recommend configuring public key authentication using modern Edwards-curve Ed25519 keys rather than legacy RSA keys.
          </p>

          <h3 className="text-base font-semibold text-foreground pt-1">1. Generating an Ed25519 SSH Keypair</h3>
          <p className="text-foreground/80">
            On Linux, macOS, or Windows Terminal (PowerShell), execute:
          </p>
          <CodeBlock
            language="bash"
            code={`ssh-keygen -t ed25519 -C "admin@yourcompany.de"`}
          />
          <p className="text-foreground/80">
            This creates two files in your local <code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">~/.ssh/</code> directory:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-foreground/80 text-xs">
            <li><code className="font-mono bg-foreground/5 px-1 py-0.5 rounded">id_ed25519</code> &mdash; Your private key. Keep this private and never share it.</li>
            <li><code className="font-mono bg-foreground/5 px-1 py-0.5 rounded">id_ed25519.pub</code> &mdash; Your public key. Paste this into the VaultScope ordering form or dashboard.</li>
          </ul>

          <h3 className="text-base font-semibold text-foreground pt-1">2. Connecting to Your Instance</h3>
          <CodeBlock
            language="bash"
            code={`ssh -i ~/.ssh/id_ed25519 root@<SERVER_IP>`}
          />

          <Callout type="tip" title="Simplify with SSH Config">
            Add a host entry in <code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">~/.ssh/config</code> for quick single-word connections:
            <pre className="mt-2 text-xs font-mono text-foreground/80 bg-foreground/5 p-2 rounded">
{`Host vs-prod
    HostName 195.201.x.x
    User root
    IdentityFile ~/.ssh/id_ed25519`}
            </pre>
            Then simply type <code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">ssh vs-prod</code> to connect.
          </Callout>
        </section>

        {/* Power Management */}
        <section id="power-management" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Power className="w-5 h-5 text-emerald-400" />
            <span>Power &amp; Lifecycle Actions</span>
          </h2>
          <p className="text-foreground/80">
            Inside your server detail view (<strong>Dashboard &rarr; VPS &rarr; [Server Name]</strong>), the action bar provides the following power controls:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose my-4">
            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <div className="flex items-center gap-2 font-semibold text-foreground text-sm mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Start</span>
              </div>
              <p className="text-xs text-foreground/70">
                Boots a stopped virtual server instance via the provisioning job queue.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <div className="flex items-center gap-2 font-semibold text-foreground text-sm mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Restart</span>
              </div>
              <p className="text-xs text-foreground/70">
                Sends a reboot action to restart the running virtual server cleanly.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <div className="flex items-center gap-2 font-semibold text-foreground text-sm mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Stop</span>
              </div>
              <p className="text-xs text-foreground/70">
                Powers down the virtual machine when you need to take an instance offline.
              </p>
            </div>
          </div>
        </section>

        {/* In-Browser Console */}
        <section id="web-console" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Monitor className="w-5 h-5 text-[var(--text-muted)]" />
            <span>Out-of-Band Web Console</span>
          </h2>
          <p className="text-foreground/80">
            If your server becomes unreachable over SSH due to a firewall misconfiguration, corrupted network configuration, or bootloader failure, click the <strong>Console</strong> button in your VPS detail view to launch a secure out-of-band console session provided by the upstream hypervisor in a new browser tab.
          </p>
        </section>

        {/* Operating System Reinstall */}
        <section id="os-reinstall" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-amber-400" />
            <span>Operating System Reinstall</span>
          </h2>
          <p className="text-foreground/80">
            You can reinstall your virtual machine with a pristine distribution image at any time. VaultScope provides curated, regularly patched server images:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 not-prose my-2 text-xs">
            <div className="p-3 border border-border rounded text-center">
              <span className="font-semibold block text-foreground">Ubuntu Server</span>
              <span className="text-foreground/60 text-[11px]">24.04 & 22.04 LTS</span>
            </div>
            <div className="p-3 border border-border rounded text-center">
              <span className="font-semibold block text-foreground">Debian GNU/Linux</span>
              <span className="text-foreground/60 text-[11px]">12 (Bookworm)</span>
            </div>
            <div className="p-3 border border-border rounded text-center">
              <span className="font-semibold block text-foreground">AlmaLinux</span>
              <span className="text-foreground/60 text-[11px]">9 Enterprise</span>
            </div>
            <div className="p-3 border border-border rounded text-center">
              <span className="font-semibold block text-foreground">Alpine Linux</span>
              <span className="text-foreground/60 text-[11px]">3.20 Minimal</span>
            </div>
          </div>

          <Callout type="danger" title="Irreversible Data Loss">
            Reinstalling an operating system formats the primary NVMe disk partition. All existing data, databases, and configuration files will be wiped permanently. Back up any critical data before initiating a rebuild.
          </Callout>
        </section>

        {/* Recovery & Support */}
        <section id="rescue-mode" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Shield className="w-5 h-5 text-rose-400" />
            <span>Recovery &amp; Single-User Troubleshooting</span>
          </h2>
          <p className="text-foreground/80">
            If an operating system fails to boot after a kernel update or you lose SSH access, use the out-of-band <strong>Console</strong> button in your VPS detail page to access the boot menu / single-user mode, or contact support via <strong>Dashboard &rarr; Support</strong> if you need rescue environment assistance.
          </p>
        </section>

        {/* Reverse DNS (PTR) */}
        <section id="networking" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Network className="w-5 h-5 text-[var(--text-muted)]" />
            <span>Reverse DNS (PTR) &amp; Network Setup</span>
          </h2>
          <p className="text-foreground/80">
            For mail servers (SMTP) or services requiring custom Reverse DNS (PTR) records, ensure your domain has a matching forward <code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">A</code> / <code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">AAAA</code> record pointing to your server IP, then open a ticket in <strong>Dashboard &rarr; Support</strong> with your desired hostname so our team can configure the PTR entry.
          </p>
        </section>

        <DocPagination
          prev={{
            title: 'Getting Started & Security',
            path: '/docs/customer/getting-started',
          }}
          next={{
            title: 'Sovereign SFTP Storage',
            path: '/docs/customer/sftp',
          }}
        />
      </div>
    </div>
  );
};
