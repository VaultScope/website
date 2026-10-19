import { motion, type MotionValue, useTransform, useMotionValue } from 'framer-motion';

const SPARK_HEIGHTS = [30, 55, 42, 70, 38, 62, 48, 80, 52, 44, 66, 35];

// ─── MetricBar (Ruled 2px Precision Bar) ──────────────────────────────────────

const MetricBar = ({
  label,
  value,
  pct,
  accent = false,
  delay = 0,
}: {
  label: string;
  value: string;
  pct: MotionValue<string>;
  accent?: boolean;
  delay?: number;
}) => (
  <div className="mb-4 last:mb-0">
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[11px] font-mono text-[var(--text-muted)]">{label}</span>
      <span
        className={`text-[11px] font-mono tabular-nums ${
          accent ? 'text-[var(--signal)]' : 'text-[var(--text)]'
        }`}
      >
        {value}
      </span>
    </div>
    <div className="h-[3px] bg-[var(--line)] w-full overflow-hidden">
      <motion.div
        className={`h-full ${accent ? 'bg-[var(--signal)]' : 'bg-[var(--text)]'}`}
        style={{ width: pct }}
        initial={{ width: '2%' }}
        transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  </div>
);

// ─── StatusSquare (2px LED Indicator) ─────────────────────────────────────────

const StatusSquare = ({ color = 'var(--ok)' }: { color?: string }) => (
  <span className="relative inline-flex items-center justify-center w-3 h-3 shrink-0">
    <span
      className="w-2 h-2 rounded-[1px] block"
      style={{ backgroundColor: color }}
    />
  </span>
);

// ─── NetworkSparkline ─────────────────────────────────────────────────────────

const NetworkSparkline = ({ progress }: { progress: MotionValue<number> }) => {
  const opacity = useTransform(progress, [0.2, 0.5], [0.4, 1]);

  return (
    <motion.div style={{ opacity }} className="px-5 pb-4">
      <div className="border-t border-[var(--line)] pt-4">
        <p className="text-[10px] text-[var(--text-faint)] mb-2.5 font-mono">
          Network throughput (Mb/s)
        </p>
        <div className="flex items-end gap-[3px] h-8">
          {SPARK_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-[var(--line-strong)]"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Cloud VPS Visual ─────────────────────────────────────────────────────────

export const CloudVPSVisual = ({ progress }: { progress?: MotionValue<number> }) => {
  const fallback = useMotionValue(1);
  const p = progress ?? fallback;

  const cpuPct = useTransform(p, [0.03, 0.65], ['12%', '78%']);
  const ramPct = useTransform(p, [0.03, 0.65], ['12%', '62%']);
  const dskPct = useTransform(p, [0.03, 0.65], ['12%', '41%']);
  const netIn = useTransform(p, [0.03, 0.65], [24, 142]);
  const netOut = useTransform(p, [0.03, 0.65], [8, 38]);
  const uptime = useTransform(p, [0.03, 0.65], [99.9, 99.9]);

  return (
    <div className="w-full border border-[var(--line)] bg-[var(--surface)] rounded-[2px] overflow-hidden">
      {/* Header */}
      <div className="border-b border-[var(--line)] px-5 py-3.5 flex items-center justify-between bg-[var(--ground)]">
        <div className="flex items-center gap-2.5">
          <StatusSquare color="var(--ok)" />
          <span className="text-xs font-mono text-[var(--text)]">vps-eu-01</span>
        </div>
        <span className="text-[11px] font-mono text-[var(--ok)]">Running</span>
      </div>

      {/* Metrics */}
      <div className="px-5 pt-5 pb-4">
        <MetricBar label="CPU (KVM vCore)" value="78%" pct={cpuPct} delay={0.0} />
        <MetricBar label="Memory (ECC)" value="62%" pct={ramPct} delay={0.1} />
        <MetricBar label="NVMe Storage" value="41%" pct={dskPct} delay={0.2} />
      </div>

      {/* Network sparkline */}
      <NetworkSparkline progress={p} />

      {/* Network Mb/s */}
      <div className="px-5 pb-4">
        <div className="border-t border-[var(--line)] pt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-[var(--text-faint)] mb-1 font-mono">Inbound</p>
            <motion.p className="text-sm font-mono text-[var(--text)] tabular-nums">
              {useTransform(netIn, (v) => `${Math.round(v)} Mb/s`)}
            </motion.p>
          </div>
          <div>
            <p className="text-[10px] text-[var(--text-faint)] mb-1 font-mono">Outbound</p>
            <motion.p className="text-sm font-mono text-[var(--text)] tabular-nums">
              {useTransform(netOut, (v) => `${Math.round(v)} Mb/s`)}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Uptime */}
      <div className="px-5 pb-4">
        <div className="border-t border-[var(--line)] pt-3.5 flex items-center justify-between">
          <span className="text-[10px] font-mono text-[var(--text-faint)]">Uptime SLA</span>
          <motion.span className="text-xs font-mono text-[var(--signal)] tabular-nums">
            {useTransform(uptime, (v) => `${v.toFixed(1)}%`)}
          </motion.span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--line)] px-5 py-3 grid grid-cols-2 gap-4 bg-[var(--ground)]">
        <div>
          <p className="text-[10px] text-[var(--text-faint)] mb-0.5 font-mono">Location</p>
          <p className="text-xs font-mono text-[var(--text-muted)]">EU · Central</p>
        </div>
        <div>
          <p className="text-[10px] text-[var(--text-faint)] mb-0.5 font-mono">Isolation</p>
          <p className="text-xs font-mono text-[var(--text-muted)]">Proxmox KVM</p>
        </div>
      </div>
    </div>
  );
};

// ─── Dedicated Visual ─────────────────────────────────────────────────────────

export const DedicatedVisual = ({ progress }: { progress?: MotionValue<number> }) => {
  const fallback = useMotionValue(1);
  const p = progress ?? fallback;

  const cpuPct = useTransform(p, [0.03, 0.65], ['20%', '100%']);
  const ramPct = useTransform(p, [0.06, 0.68], ['20%', '100%']);
  const dskPct = useTransform(p, [0.09, 0.71], ['20%', '100%']);
  const ioPct = useTransform(p, [0.12, 0.74], ['20%', '100%']);

  return (
    <div className="w-full border border-[var(--line)] bg-[var(--surface)] rounded-[2px] overflow-hidden">
      {/* Header */}
      <div className="border-b border-[var(--line)] px-5 py-3.5 flex items-center justify-between bg-[var(--ground)]">
        <div className="flex items-center gap-2.5">
          <StatusSquare color="var(--signal)" />
          <span className="text-xs font-mono text-[var(--text)]">srv-eu-dedicated-01</span>
        </div>
        <span className="text-[11px] font-mono text-[var(--signal)]">Dedicated</span>
      </div>

      {/* 100% exclusive label */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-[11px] text-[var(--text-muted)] font-mono mb-4">
          Resource allocation — 100% single-tenant
        </p>
        <MetricBar label="Physical CPU Cores" value="100%" pct={cpuPct} accent delay={0.0} />
        <MetricBar label="ECC DDR5 Memory" value="100%" pct={ramPct} accent delay={0.1} />
        <MetricBar label="Enterprise NVMe RAID" value="100%" pct={dskPct} accent delay={0.2} />
        <MetricBar label="10 GbE Uplinks" value="100%" pct={ioPct} accent delay={0.3} />
      </div>

      {/* No shared callout */}
      <div className="mx-5 my-4 border border-[var(--line-strong)] px-4 py-3 bg-[var(--ground)] rounded-[2px]">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 bg-[var(--signal)] block shrink-0" />
          <p className="text-xs font-medium text-[var(--text)]">Zero noisy neighbors</p>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          Every core, memory channel, and NVMe lane on this chassis belongs exclusively to your workload.
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--line)] px-5 py-3 grid grid-cols-3 gap-4 bg-[var(--ground)]">
        <div>
          <p className="text-[10px] text-[var(--text-faint)] mb-0.5 font-mono">Location</p>
          <p className="text-xs font-mono text-[var(--text-muted)]">EU · Central</p>
        </div>
        <div>
          <p className="text-[10px] text-[var(--text-faint)] mb-0.5 font-mono">Isolation</p>
          <p className="text-xs font-mono text-[var(--text-muted)]">Physical · Full</p>
        </div>
        <div>
          <p className="text-[10px] text-[var(--text-faint)] mb-0.5 font-mono">Hypervisor</p>
          <p className="text-xs font-mono text-[var(--text-muted)]">Proxmox VE</p>
        </div>
      </div>
    </div>
  );
};
