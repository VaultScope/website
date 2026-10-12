import { useEffect } from 'react';
import { DocHeader } from '../components/DocHeader';
import { DocPagination } from '../components/DocPagination';
import { Callout } from '../components/Callout';
import { CodeBlock } from '../components/CodeBlock';
import { Server, Monitor, Cpu, HardDrive, RefreshCw, Activity } from 'lucide-react';

const TOC = [
  { id: 'hardware-specs', label: 'Bare-Metal Architecture' },
  { id: 'ipmi-kvm', label: 'Out-of-Band IPMI / KVM Access' },
  { id: 'automated-pxe', label: 'Automated PXE Reinstallation' },
  { id: 'power-cycles', label: 'Hardware Power & PDU Control' },
  { id: 'hardware-diagnostics', label: 'Diagnostics & Rescue System' },
  { id: 'network-uplinks', label: 'Uplinks, VLANs & Secondary IPs' },
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
            <Cpu className="w-5 h-5 text-purple-400" />
            <span>Bare-Metal Single-Tenant Architecture</span>
          </h2>
          <p className="text-foreground/80">
            VaultScope Dedicated Servers provide raw, unvirtualized bare-metal hardware. There are zero noisy neighbors, no hypervisor overhead, and complete BIOS/UEFI level ownership of the server.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose my-4">
            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <h3 className="text-sm font-semibold text-foreground mb-1">100% Dedicated Compute</h3>
              <p className="text-xs text-foreground/60">
                Full physical cores from AMD EPYC 9004 or Intel Xeon Scalable processors with uninterrupted AVX-512 instructions.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <h3 className="text-sm font-semibold text-foreground mb-1">ECC Memory Subsystems</h3>
              <p className="text-xs text-foreground/60">
                Multi-channel Error-Correcting Code (ECC) DDR4/DDR5 RAM protecting databases against bit-flips and silent memory corruption.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-foreground/[0.01]">
              <h3 className="text-sm font-semibold text-foreground mb-1">Hardware & Software RAID</h3>
              <p className="text-xs text-foreground/60">
                Datacenter-grade NVMe PCIe Gen4/Gen5 SSD arrays pre-configured with RAID 1 mirroring or ZFS pool configurations.
              </p>
            </div>
          </div>
        </section>

        {/* IPMI / KVM Access */}
        <section id="ipmi-kvm" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Monitor className="w-5 h-5 text-blue-400" />
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

        {/* Automated PXE Reinstall */}
        <section id="automated-pxe" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-amber-400" />
            <span>Automated PXE Reinstallation</span>
          </h2>
          <p className="text-foreground/80">
            For rapid turnaround, VaultScope provides an automated Preboot Execution Environment (PXE) network installation system. You can re-image a physical server within 8 to 15 minutes without manual IPMI intervention.
          </p>

          <h3 className="text-base font-semibold text-foreground pt-1">PXE Installation Workflow:</h3>
          <ol className="list-decimal pl-5 space-y-2 text-foreground/80 text-xs">
            <li>Click <strong>Reinstall Operating System</strong> in your dedicated server management view.</li>
            <li>Select your target operating system:
              <ul className="list-disc pl-5 mt-1 space-y-0.5 text-foreground/60">
                <li>Ubuntu 24.04 / 22.04 LTS</li>
                <li>Debian 12 Bookworm</li>
                <li>Proxmox VE 8.2 (Enterprise Hypervisor)</li>
                <li>AlmaLinux 9 / Rocky Linux 9</li>
              </ul>
            </li>
            <li>Select your RAID configuration (RAID 1 Mirroring recommended for twin NVMe drives, or RAID 0 Striping for maximum capacity).</li>
            <li>Provide your public SSH key for automated root deployment.</li>
            <li>Click <strong>Trigger Automated PXE Install</strong>. The server is power-cycled, boots into the network PXE installer, partitions the physical drives, applies the OS image, and reboots into your fresh installation.</li>
          </ol>
        </section>

        {/* Hardware Power Cycles */}
        <section id="power-cycles" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Server className="w-5 h-5 text-rose-400" />
            <span>Hardware Power & PDU Control</span>
          </h2>
          <p className="text-foreground/80">
            Dedicated servers are wired to dual switched Power Distribution Units (PDUs) in our datacenters. In addition to ACPI soft signals, you can trigger true hardware electrical power cuts to reboot frozen hardware:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-foreground/80 text-xs">
            <li><strong>Chassis Power On / Off:</strong> Relays IPMI power state commands directly to the motherboard.</li>
            <li><strong>Cold PDU Power Cycle:</strong> Electrically cuts power to the chassis power supplies for 10 seconds before restoring power, forcing a complete electrical discharge and hardware cold reboot.</li>
          </ul>
        </section>

        {/* Diagnostics & Rescue System */}
        <section id="hardware-diagnostics" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>Hardware Diagnostics & Linux Rescue System</span>
          </h2>
          <p className="text-foreground/80">
            If you suspect hardware degradation (e.g. failing NVMe sectors or memory bit-errors), boot the server into the VaultScope RAM-based Linux Rescue environment to execute comprehensive hardware benchmarks:
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

        {/* Network Uplinks */}
        <section id="network-uplinks" className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-indigo-400" />
            <span>Network Uplinks, VLANs & Secondary IPs</span>
          </h2>
          <p className="text-foreground/80">
            VaultScope dedicated servers include 1 Gbps or 10 Gbps unmetered uplinks connected to our redundant Juniper backbone routers with direct peering at DE-CIX Frankfurt:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-foreground/80">
            <li><strong>Native IPv6 /64:</strong> Every dedicated server includes a dedicated routed <code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">/64</code> IPv6 subnet.</li>
            <li><strong>Secondary IPv4 Subnets:</strong> Additional IPv4 addresses (<code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">/29</code>, <code className="text-xs font-mono bg-foreground/5 px-1 py-0.5 rounded">/28</code>) can be routed to your server's primary MAC or configured on virtual bridge interfaces for virtualization (Proxmox/KVM).</li>
            <li><strong>vSwitch Private VLANs:</strong> Interconnect multiple dedicated servers and Cloud VPS instances across private layer-2 VLANs with zero public internet traversal.</li>
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
