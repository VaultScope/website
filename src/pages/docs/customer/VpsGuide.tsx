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
            <Terminal className="w-5 h-5 text-blue-400" />
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
            <span>Power & Lifecycle Actions</span>
          </h2>
          <p className="text-foreground/80">
            Inside your server detail view (<strong>Dashboard &rarr; Cloud VPS &rarr; [Server Name]</strong>), the power control center provides four primary actions:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-4">
            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <div className="flex items-center gap-2 font-semibold text-foreground text-sm mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Soft Reboot (ACPI)</span>
              </div>
              <p className="text-xs text-foreground/70">
                Sends a standard ACPI reboot signal to the operating system, allowing running database processes and background services to shut down gracefully and sync dirty pages to disk.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <div className="flex items-center gap-2 font-semibold text-foreground text-sm mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Graceful Shutdown</span>
              </div>
              <p className="text-xs text-foreground/70">
                Sends an ACPI shutdown command. Ideal before taking manual filesystem snapshots or modifying hardware spec configurations.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <div className="flex items-center gap-2 font-semibold text-foreground text-sm mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Force Stop (Power Cut)</span>
              </div>
              <p className="text-xs text-foreground/70">
                Immediately terminates the KVM virtualization process. Use when the kernel is completely unresponsive or locked in a kernel panic.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <div className="flex items-center gap-2 font-semibold text-foreground text-sm mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Hardware Reset</span>
              </div>
              <p className="text-xs text-foreground/70">
                Simulates pressing the physical chassis reset button. The instance is immediately restarted at the hypervisor level without waiting for OS shutdown hooks.
              </p>
            </div>
          </div>
        </section>

        {/* In-Browser noVNC Console */}
        <section id="web-console" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Monitor className="w-5 h-5 text-purple-400" />
            <span>Interactive In-Browser noVNC Console</span>
          </h2>
          <p className="text-foreground/80">
            If your server becomes unreachable over SSH due to a firewall misconfiguration, corrupted network configuration, or bootloader failure, the out-of-band HTML5 noVNC console provides direct graphical screen and keyboard access to the virtual monitor.
          </p>

          <div className="border border-border rounded-lg p-5 bg-foreground/[0.01] space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Key Features of the VaultScope Web Console:</h4>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-foreground/80">
              <li><strong>Dedicated Virtual Key Bar:</strong> Instant one-click triggers for special keystrokes that browsers usually trap: <kbd className="px-1.5 py-0.5 bg-foreground/10 border border-border rounded font-mono">Ctrl+Alt+Del</kbd>, <kbd className="px-1.5 py-0.5 bg-foreground/10 border border-border rounded font-mono">Esc</kbd>, <kbd className="px-1.5 py-0.5 bg-foreground/10 border border-border rounded font-mono">Tab</kbd>, and function keys <kbd className="px-1.5 py-0.5 bg-foreground/10 border border-border rounded font-mono">F1</kbd>-<kbd className="px-1.5 py-0.5 bg-foreground/10 border border-border rounded font-mono">F12</kbd>.</li>
              <li><strong>Clipboard Injection Drawer:</strong> Paste long scripts, public SSH keys, or complex database connection strings directly into the active terminal buffer without typing keystroke by keystroke.</li>
              <li><strong>Real-Time Latency Telemetry:</strong> Continuous WebSocket ping monitoring shows roundtrip milliseconds between your browser and the hypervisor host.</li>
              <li><strong>Zero Plugin Requirement:</strong> Pure HTML5 Canvas & WebSockets &mdash; no Java, Flash, or browser extensions needed.</li>
            </ul>
          </div>
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

        {/* Rescue Mode */}
        <section id="rescue-mode" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Shield className="w-5 h-5 text-rose-400" />
            <span>Rescue Environment & Root Password Recovery</span>
          </h2>
          <p className="text-foreground/80">
            If an operating system fails to boot after a kernel update or the root filesystem becomes corrupted, activate <strong>Rescue Mode</strong> from your server dashboard:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-foreground/80">
            <li>Click <strong>Enable Rescue Mode</strong> in the server actions menu and select Linux 64-bit rescue image.</li>
            <li>Reboot the server. The VM will boot into an in-memory Debian RAM disk.</li>
            <li>Connect via SSH using the temporary root credentials provided in the rescue dialog.</li>
            <li>Mount your disk and chroot to repair configuration files or reset the root password:</li>
          </ol>
          <CodeBlock
            language="bash"
            code={`# Locate your root partition (e.g. /dev/vda1 or /dev/sda1)
lsblk

# Mount root partition and system pseudofilesystems
mount /dev/vda1 /mnt
mount --bind /dev /mnt/dev
mount --bind /proc /mnt/proc
mount --bind /sys /mnt/sys

# Enter chroot environment
chroot /mnt

# Reset root password or edit /etc/ssh/sshd_config
passwd root

# Exit chroot and unmount
exit
umount -R /mnt
reboot`}
          />
        </section>

        {/* Reverse DNS (PTR) */}
        <section id="networking" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-400" />
            <span>Reverse DNS (PTR) & Network Setup</span>
          </h2>
          <p className="text-foreground/80">
            For mail servers (SMTP) and enterprise services requiring bidirectional hostname verification, configure your IP's Reverse DNS (PTR) record directly in the <strong>Networking</strong> tab of your VPS detail view.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-foreground/80">
            <li>Enter your Fully Qualified Domain Name (FQDN), e.g. <code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">mail.yourdomain.de</code>.</li>
            <li>Ensure that your domain's authoritative DNS has a corresponding forward <code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">A</code> (and <code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">AAAA</code> for IPv6) record pointing to your server's IP.</li>
            <li>PTR record updates propagate worldwide across global DNS caches within 15 to 30 minutes.</li>
          </ul>
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
