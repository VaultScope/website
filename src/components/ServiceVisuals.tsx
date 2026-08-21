import { motion, type MotionValue, useTransform } from 'framer-motion';

// ─── Sparkline bar heights (static seed, randomised once) ────────────────────
const SPARK_HEIGHTS = [30, 55, 42, 70, 38, 62, 48, 80, 52, 44, 66, 35];

// ─── MetricBar ────────────────────────────────────────────────────────────────

const MetricBar = ({
  label, value, pct, accent = false, delay = 0,
}: {
  label: string; value: string; pct: MotionValue<string>; accent?: boolean; delay?: number;
}) => (
  <div className="mb-5 last:mb-0">
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] font-mono font-medium text-foreground/35 uppercase tracking-widest">{label}</span>
      <span className={`text-[10px] font-mono tabular-nums ${accent ? 'text-foreground/65' : 'text-foreground/42'}`}>{value}</span>
    </div>
    <div className="h-[3px] bg-foreground/8 w-full overflow-hidden">
      <motion.div
        className={`h-full ${accent ? 'bg-foreground/60' : 'bg-foreground/35'}`}
        style={{ width: pct }}
        initial={{ width: '2%' }}
        transition={{ delay, duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  </div>
);

// ─── StatusDot — animated ring + pulsing core ─────────────────────────────────

const StatusDot = ({ duration = 1.9 }: { duration?: number }) => (
  <span className="relative flex items-center justify-center w-4 h-4 shrink-0">
    {/* outer ping ring */}
    <motion.span
      animate={{ scale: [1, 1.9], opacity: [0.45, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeOut' }}
      className="absolute inset-0 rounded-full bg-foreground/30"
    />
    {/* inner solid dot */}
    <motion.span
      animate={{ opacity: [1, 0.4, 1] }}
      transition={{ duration, repeat: Infinity }}
      className="w-2 h-2 rounded-full bg-foreground/50 block"
    />
  </span>
);

// ─── NetworkSparkline ─────────────────────────────────────────────────────────

const NetworkSparkline = ({ progress }: { progress: MotionValue<number> }) => {
  const opacity = useTransform(progress, [0.25, 0.50], [0, 1]);

  return (
    <motion.div style={{ opacity }} className="px-5 pb-4">
      <div className="border-t border-border pt-4">
        <p className="text-[9px] text-foreground/22 uppercase tracking-widest mb-2.5 font-mono">
          Network Traffic
        </p>
        <div className="flex items-end gap-[3px] h-8">
          {SPARK_HEIGHTS.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-foreground/30 rounded-sm"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.05 * i, duration: 0.4, ease: 'easeOut' }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Cloud VPS Visual ─────────────────────────────────────────────────────────

export const CloudVPSVisual = ({ progress }: { progress: MotionValue<number> }) => {
  const cpuPct = useTransform(progress, [0.03, 0.65], ['2%',  '78%']);
  const ramPct = useTransform(progress, [0.03, 0.65], ['2%',  '62%']);
  const dskPct = useTransform(progress, [0.03, 0.65], ['2%',  '41%']);
  const netIn  = useTransform(progress, [0.03, 0.65], [0,      142]);
  const netOut = useTransform(progress, [0.03, 0.65], [0,       38]);
  const uptime = useTransform(progress, [0.03, 0.65], [0,     99.9]);

  const op    = useTransform(progress, [0, 0.05],   [0, 1]);
  const y     = useTransform(progress, [0, 0.07],   [24, 0]);
  const scale = useTransform(progress, [0, 0.07],   [0.94, 1]);
  const blur  = useTransform(progress, [0, 0.06],   ['blur(8px)', 'blur(0px)']);

  return (
    <motion.div
      style={{ opacity: op, y, scale, filter: blur }}
      className="w-full border border-border bg-background overflow-hidden"
    >
      {/* Header */}
      <div className="border-b border-border px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <StatusDot duration={1.9} />
          <span className="text-xs font-mono text-foreground/48 tracking-tight">vps-eu-01</span>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-widest text-foreground/28">Running</span>
      </div>

      {/* Metrics */}
      <div className="px-5 pt-5 pb-3">
        <MetricBar label="CPU"    value="78%"  pct={cpuPct} delay={0.0} />
        <MetricBar label="Memory" value="62%"  pct={ramPct} delay={0.1} />
        <MetricBar label="Disk"   value="41%"  pct={dskPct} delay={0.2} />
      </div>

      {/* Network sparkline */}
      <NetworkSparkline progress={progress} />

      {/* Network Mb/s */}
      <div className="px-5 pb-5">
        <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-[9px] text-foreground/22 uppercase tracking-widest mb-1.5 font-mono">Inbound</p>
            <motion.p className="text-sm font-mono text-foreground/50 tabular-nums">
              {useTransform(netIn, (v) => `${Math.round(v)} Mb/s`)}
            </motion.p>
          </div>
          <div>
            <p className="text-[9px] text-foreground/22 uppercase tracking-widest mb-1.5 font-mono">Outbound</p>
            <motion.p className="text-sm font-mono text-foreground/50 tabular-nums">
              {useTransform(netOut, (v) => `${Math.round(v)} Mb/s`)}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Uptime */}
      <div className="px-5 pb-5">
        <div className="border-t border-border pt-4 flex items-center justify-between">
          <span className="text-[9px] font-mono text-foreground/22 uppercase tracking-widest">Uptime</span>
          <motion.span className="text-xs font-mono text-foreground/48 tabular-nums">
            {useTransform(uptime, (v) => `${v.toFixed(1)}%`)}
          </motion.span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-5 py-3.5 grid grid-cols-2 gap-4 bg-foreground/[0.014]">
        <div>
          <p className="text-[9px] text-foreground/20 uppercase tracking-widest mb-0.5 font-mono">Location</p>
          <p className="text-xs font-mono text-foreground/42">EU · West</p>
        </div>
        <div>
          <p className="text-[9px] text-foreground/20 uppercase tracking-widest mb-0.5 font-mono">Isolation</p>
          <p className="text-xs font-mono text-foreground/42">Virtual · Isolated</p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Dedicated Visual ─────────────────────────────────────────────────────────

export const DedicatedVisual = ({ progress }: { progress: MotionValue<number> }) => {
  const cpuPct = useTransform(progress, [0.03, 0.65], ['2%', '100%']);
  const ramPct = useTransform(progress, [0.06, 0.68], ['2%', '100%']);
  const dskPct = useTransform(progress, [0.09, 0.71], ['2%', '100%']);
  const ioPct  = useTransform(progress, [0.12, 0.74], ['2%', '100%']);
  const fillP  = useTransform(progress, [0.03, 0.65], [0, 1]);

  const op    = useTransform(progress, [0, 0.05],   [0, 1]);
  const y     = useTransform(progress, [0, 0.07],   [24, 0]);
  const scale = useTransform(progress, [0, 0.07],   [0.94, 1]);
  const blur  = useTransform(progress, [0, 0.06],   ['blur(8px)', 'blur(0px)']);

  return (
    <motion.div
      style={{ opacity: op, y, scale, filter: blur }}
      className="w-full border border-border bg-background overflow-hidden"
    >
      {/* Header */}
      <div className="border-b border-border px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <StatusDot duration={2.3} />
          <span className="text-xs font-mono text-foreground/48 tracking-tight">srv-eu-dedicated-01</span>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-widest text-foreground/28">Dedicated</span>
      </div>

      {/* 100% exclusive label */}
      <div className="px-5 pt-4 pb-1">
        <p className="text-[9px] uppercase tracking-widest text-foreground/22 font-mono font-medium mb-4">
          Resource allocation — 100% exclusive
        </p>
        <MetricBar label="CPU"     value="100%" pct={cpuPct} accent delay={0.00} />
        <MetricBar label="Memory"  value="100%" pct={ramPct} accent delay={0.10} />
        <MetricBar label="Storage" value="100%" pct={dskPct} accent delay={0.20} />
        <MetricBar label="I/O"     value="100%" pct={ioPct}  accent delay={0.30} />
      </div>

      {/* No shared callout */}
      <div className="mx-5 mb-5 border border-foreground/8 px-4 py-3 bg-foreground/[0.016]">
        <div className="flex items-center gap-2 mb-1">
          <motion.span style={{ opacity: fillP }} className="w-1.5 h-1.5 rounded-full bg-foreground/45 block shrink-0" />
          <p className="text-[10px] font-medium text-foreground/38 uppercase tracking-widest">No shared tenants</p>
        </div>
        <p className="text-[11px] text-foreground/26 font-light">
          Every resource on this server belongs exclusively to you.
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-5 py-3.5 grid grid-cols-3 gap-4 bg-foreground/[0.014]">
        <div>
          <p className="text-[9px] text-foreground/20 uppercase tracking-widest mb-0.5 font-mono">Location</p>
          <p className="text-xs font-mono text-foreground/42">EU · West</p>
        </div>
        <div>
          <p className="text-[9px] text-foreground/20 uppercase tracking-widest mb-0.5 font-mono">Isolation</p>
          <p className="text-xs font-mono text-foreground/42">Physical · Full</p>
        </div>
        <div>
          <p className="text-[9px] text-foreground/20 uppercase tracking-widest mb-0.5 font-mono">Hypervisor</p>
          <p className="text-xs font-mono text-foreground/42">Proxmox</p>
        </div>
      </div>
    </motion.div>
  );
};
