export interface OrderStateDisplay {
  value: string;
  label: string;
  badgeClass: string;
}

export function getOrderStateDisplay(state?: string | null): OrderStateDisplay {
  const normalized = (state || 'active').trim().toLowerCase();
  switch (normalized) {
    case 'payment_received':
      return {
        value: 'payment_received',
        label: 'Payment Received',
        badgeClass: 'bg-sky-500/15 text-sky-400 border border-sky-500/30',
      };
    case 'provisioning':
      return {
        value: 'provisioning',
        label: 'Provisioning (up to 7 business days)',
        badgeClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
      };
    case 'hardware_setup':
      return {
        value: 'hardware_setup',
        label: 'Hardware Setup & OS Install',
        badgeClass: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
      };
    case 'active':
      return {
        value: 'active',
        label: 'Active / Ready',
        badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      };
    case 'action_required':
      return {
        value: 'action_required',
        label: 'Action Required',
        badgeClass: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
      };
    case 'cancelled':
      return {
        value: 'cancelled',
        label: 'Cancelled',
        badgeClass: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
      };
    default:
      return {
        value: normalized,
        label: normalized.replace(/_/g, ' '),
        badgeClass: 'bg-[var(--bg-subtle)] text-[var(--fg-muted)] border border-[var(--line)]',
      };
  }
}
