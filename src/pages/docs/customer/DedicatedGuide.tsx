import { useEffect } from 'react';
import { DocHeader } from '../components/DocHeader';
import { DocPagination } from '../components/DocPagination';
import { Callout } from '../components/Callout';
import { CodeBlock } from '../components/CodeBlock';
import { Server, Monitor, Cpu, HardDrive, RefreshCw, Activity } from 'lucide-react';

const TOC = [
  { id: 'hardware-specs', label: 'Bare-Metal Architecture' },
  { id: 'ipmi-kvm', label: 'Out-of-Band IPMI / KVM Access' },
  { id: 'automated-pxe', label: 'OS Reinstallation' },
  { id: 'power-cycles', label: 'Power Controls' },
  { id: 'hardware-diagnostics', label: 'Hardware Diagnostics' },
  { id: 'network-uplinks', label: 'Network & IP Allocation' },
];

export const DedicatedGuide = () => {
  useEffect(() => {
    document.title = 'Dedicated Bare-Metal Servers Guide — VaultScope Customer Docs';
  }, []);

  return (
    <div className="space-y-8">
      <DocHeader
        breadcrumbs={[
          { label: 'Customer Guides', path: '/docs' },
          { label: 'Dedicated Servers' },
        ]}
        title="Dedicated Bare-Metal Servers Guide"
        badge={{ label: 'Bare Metal', variant: 'purple' }}
        description="Operational guide for managing single-tenant bare-metal dedicated servers, requesting out-of-band IPMI/KVM HTML5 consoles, executing automated PXE unattended OS deployments, and diagnosing hardware health."
        tocItems={TOC}
      />

      <div className="space-y-12 text-sm leading-relaxed">
        {/* Bare-Metal Architecture */}
        <section id="hardware-specs" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[var(--text)]" />
            <span>Bare-Metal Single-Tenant Architecture</span>
          </h2>
          <p className="text-foreground/80">
            VaultScope Dedicated Servers provide raw, unvirtualized bare-metal hardware. There are zero noisy neighbors, no hypervisor overhead, and complete BIOS/UEFI level ownership of the server.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose my-4">
            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <h3 className="text-sm font-semibold text-foreground mb-1">100% Dedicated Compute</h3>
              <p className="text-xs text-foreground/60">
                Dedicated physical processor cores according to the model and specification listed on the selected product tier.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <h3 className="text-sm font-semibold text-foreground mb-1">Dedicated Memory</h3>
              <p className="text-xs text-foreground/60">
                Unshared physical RAM (DDR4/DDR5 ECC or non-ECC depending on the selected server tier).
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <h3 className="text-sm font-semibold text-foreground mb-1">Dedicated Storage</h3>
              <p className="text-xs text-foreground/60">
                Physical NVMe/SSD drives provisioned according to your chosen bare-metal product specification.
              </p>
            </div>
          </div>
        </section>

        {/* IPMI / KVM Access */}
        <section id="ipmi-kvm" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Monitor className="w-5 h-5 text-[var(--text-muted)]" />
            <span>Out-of-Band IPMI / KVM Access</span>
          </h2>
          <p className="text-foreground/80">
            Every dedicated chassis features an out-of-band management controller (Baseboard Management Controller - BMC / IPMI 2.0 / Redfish). Even if the operating system has completely crashed or the primary network interface is disabled, you maintain independent remote management access.
          </p>

          <div className="border border-border rounded-lg p-5 bg-foreground/[0.01] space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Requesting an Out-of-Band KVM Session:</h4>
            <ol className="list-decimal pl-5 space-y-2 text-xs text-foreground/80">
              <li>Navigate to <strong>Dashboard &rarr; Dedicated Servers &rarr; [Your Server]</strong>.</li>
              <li>Click the <strong>Request IPMI / KVM Console</strong> button in the remote management section.</li>
              <li>The VaultScope provisioning orchestrator provisions an isolated, time-limited management session and generates secure HTML5 remote console credentials.</li>
              <li>Open the HTML5 console in your browser. You can access the physical BIOS setup, navigate GRUB bootloader options, and mount remote ISO images via virtual media.</li>
            </ol>
          </div>

          <Callout type="tip" title="Virtual Media ISO Mounting">
            You can mount custom OS images (e.g., customized Arch Linux, FreeBSD, pfSense, VMware ESXi) directly through the IPMI virtual media redirector to perform custom installations.
          </Callout>
        </section>

        {/* OS Reinstallation */}
        <section id="automated-pxe" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-amber-400" />
            <span>OS Reinstallation</span>
          </h2>
          <p className="text-foreground/80">
            You can trigger an automated OS reinstallation directly from your Dedicated Server detail page:
          </p>

          <h3 className="text-base font-semibold text-foreground pt-1">Reinstallation Workflow:</h3>
          <ol className="list-decimal pl-5 space-y-2 text-foreground/80 text-xs">
            <li>Open <strong>Dashboard &rarr; Dedicated &rarr; [Your Server]</strong> and click <strong>Reinstall OS</strong>.</li>
            <li>Confirm the reinstallation job in the dialog. Our background provisioning runner dispatches the reinstall task to the upstream provider API using your configured OS template.</li>
            <li>For custom partitioning, RAID layouts, or custom ISO installations, use the <strong>IPMI / KVM</strong> console or open a support ticket.</li>
          </ol>
        </section>

        {/* Power Controls */}
        <section id="power-cycles" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Server className="w-5 h-5 text-rose-400" />
            <span>Power Controls</span>
          </h2>
          <p className="text-foreground/80">
            From your Dedicated Server detail page, you can trigger upstream power actions:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-foreground/80 text-xs">
            <li><strong>Boot / Start:</strong> Powers on a stopped server via the provider API.</li>
            <li><strong>Hardware Reboot:</strong> Sends a reboot command to restart the machine.</li>
            <li><strong>Power Off:</strong> Sends a power-off command to shut down the machine.</li>
          </ul>
        </section>

        {/* Hardware Diagnostics */}
        <section id="hardware-diagnostics" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>Hardware Diagnostics</span>
          </h2>
          <p className="text-foreground/80">
            If you suspect hardware degradation (e.g. failing NVMe sectors or memory errors), run diagnostics via SSH or IPMI/KVM and attach the output to a support ticket:
          </p>

          <CodeBlock
            language="bash"
            code={`# Inspect NVMe SMART health attributes and wear leveling
smartctl -x /dev/nvme0n1
smartctl -x /dev/nvme1n1

# Run non-destructive self-test
smartctl -t short /dev/nvme0n1

# Check CPU temperature and thermal throttling
sensors

# Inspect memory subsystem errors
dmesg | grep -i -E "edac|mce|error"`}
          />
        </section>

        {/* Network & IP Allocation */}
        <section id="network-uplinks" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-[var(--text-muted)]" />
            <span>Network &amp; IP Allocation</span>
          </h2>
          <p className="text-foreground/80">
            Dedicated servers are provisioned with upstream network uplinks and IP assignments specified on the respective product tier:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-foreground/80">
            <li><strong>Primary IP Assignment:</strong> Your server&apos;s IPv4 address and hostname are displayed in the dashboard once provisioning completes.</li>
            <li><strong>Additional Networking Requests:</strong> For additional IP blocks, reverse DNS (PTR) changes, or custom routing requests, open a ticket in <strong>Dashboard &rarr; Support</strong>.</li>
          </ul>
        </section>

        <DocPagination
          prev={{
            title: 'Sovereign SFTP Storage',
            path: '/docs/customer/sftp',
          }}
          next={{
            title: 'Billing, VAT & GoBD Invoices',
            path: '/docs/customer/billing',
          }}
        />
      </div>
    </div>
  );
};
