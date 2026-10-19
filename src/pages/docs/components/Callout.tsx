import { Info, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'tip' | 'danger';
  title?: string;
  children: React.ReactNode;
}

export const Callout = ({ type = 'info', title, children }: CalloutProps) => {
  const styles = {
    info: {
      border: 'border-[var(--line-strong)]',
      bg: 'bg-white/[0.03]',
      iconText: 'text-[var(--text)]',
      icon: Info,
      defaultTitle: 'Note',
    },
    warning: {
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/[0.04]',
      iconText: 'text-amber-500',
      icon: AlertTriangle,
      defaultTitle: 'Warning',
    },
    tip: {
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/[0.04]',
      iconText: 'text-emerald-500',
      icon: CheckCircle2,
      defaultTitle: 'Best Practice',
    },
    danger: {
      border: 'border-rose-500/30',
      bg: 'bg-rose-500/[0.04]',
      iconText: 'text-rose-500',
      icon: ShieldAlert,
      defaultTitle: 'Caution',
    },
  }[type];

  const Icon = styles.icon;

  return (
    <div className={`my-5 p-4 rounded-lg border-l-4 ${styles.border} ${styles.bg} border-y border-r border-border text-sm leading-relaxed not-prose`}>
      <div className="flex items-center gap-2 mb-1.5 font-medium text-foreground">
        <Icon className={`w-4 h-4 shrink-0 ${styles.iconText}`} />
        <span className="text-xs uppercase tracking-wider font-mono font-semibold">{title || styles.defaultTitle}</span>
      </div>
      <div className="text-[var(--text-muted)] pl-6 text-[13px] leading-normal">
        {children}
      </div>
    </div>
  );
};
