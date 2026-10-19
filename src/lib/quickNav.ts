export interface QuickNavItem {
  id: string;
  label: string;
  path: string;
  description: string;
}

export const ALL_QUICK_NAV_ITEMS: QuickNavItem[] = [
  {
    id: 'vps',
    label: 'VPS',
    path: '/dashboard/vps',
    description: 'Cloud virtual private servers',
  },
  {
    id: 'ds',
    label: 'Dedicated',
    path: '/dashboard/ds',
    description: 'Single-tenant bare metal servers',
  },
  {
    id: 'odp',
    label: 'OCD Apps',
    path: '/dashboard/odp',
    description: 'One-click self-hosted applications',
  },
  {
    id: 'sftp',
    label: 'SFTP',
    path: '/dashboard/sftp',
    description: 'Encrypted SFTP storage vaults',
  },
  {
    id: 'billing',
    label: 'Invoices',
    path: '/dashboard/profile/billing',
    description: 'Subscriptions and PDF invoices',
  },
  {
    id: 'new',
    label: 'Deploy',
    path: '/dashboard/new',
    description: 'Provision new infrastructure',
  },
  {
    id: 'support',
    label: 'Tickets',
    path: '/dashboard/support',
    description: 'Engineering support desk',
  },
  {
    id: 'mfa',
    label: '2FA Security',
    path: '/dashboard/profile/mfa',
    description: 'Authenticator & recovery codes',
  },
  {
    id: 'logs',
    label: 'Activity Logs',
    path: '/dashboard/profile/logs',
    description: 'Audit trail & session history',
  },
];

export const DEFAULT_QUICK_NAV_IDS = ['vps', 'ds', 'odp', 'sftp', 'billing'];

const STORAGE_KEY = 'vs_quick_nav';

export function getQuickNavIds(): string[] {
  if (typeof window === 'undefined') return DEFAULT_QUICK_NAV_IDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_QUICK_NAV_IDS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const validIds = parsed.filter((id) =>
        ALL_QUICK_NAV_ITEMS.some((item) => item.id === id),
      );
      return validIds;
    }
  } catch {
    // Fallback to defaults
  }
  return DEFAULT_QUICK_NAV_IDS;
}

export function setQuickNavIds(ids: string[]): void {
  if (typeof window === 'undefined') return;
  const validIds = ids.filter((id) =>
    ALL_QUICK_NAV_ITEMS.some((item) => item.id === id),
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(validIds));
  window.dispatchEvent(new CustomEvent('vs-quick-nav-updated', { detail: validIds }));
}

export function getQuickNavItems(): QuickNavItem[] {
  const ids = getQuickNavIds();
  return ALL_QUICK_NAV_ITEMS.filter((item) => ids.includes(item.id));
}

export function getStoredUsername(): string {
  if (typeof window === 'undefined') return '';
  try {
    const direct = localStorage.getItem('vs_username');
    if (direct && direct.trim()) return direct.trim();

    const claimsRaw = localStorage.getItem('vs_claims');
    if (claimsRaw) {
      const claims = JSON.parse(claimsRaw);
      if (claims?.username && typeof claims.username === 'string') {
        return claims.username.trim();
      }
    }
  } catch {
    // Ignore storage read errors
  }
  return '';
}

export function setStoredUsername(username: string): void {
  if (typeof window === 'undefined') return;
  const clean = username.trim();
  if (clean) {
    localStorage.setItem('vs_username', clean);
  } else {
    localStorage.removeItem('vs_username');
  }
  try {
    const claimsRaw = localStorage.getItem('vs_claims');
    if (claimsRaw) {
      const claims = JSON.parse(claimsRaw);
      claims.username = clean;
      localStorage.setItem('vs_claims', JSON.stringify(claims));
    }
  } catch {
    // Ignore claims update error
  }
}
