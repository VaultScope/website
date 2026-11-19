export interface AuthClaims {
  sub: string;
  email: string;
  role: string;
  audience: 'admin' | 'storefront';
  exp: number;
  iat: number;
  username?: string;
}

function resolveAuthApiBase(): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'vaultscope.de' || host.endsWith('.vaultscope.de')) {
      return '/api';
    }
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
}

function getSafeOrigin(): string {
  if (
    typeof window !== 'undefined' &&
    window.location?.origin &&
    window.location.origin !== 'null'
  ) {
    return window.location.origin;
  }
  return 'https://vaultscope.de';
}

function defaultDashboardPath(): string {
  if (typeof window !== 'undefined') {
    const p = window.location.pathname;
    if (p === '/de' || p.startsWith('/de/')) {
      return '/de/dashboard';
    }
  }
  return '/dashboard';
}

function hasControlChars(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code <= 0x1f || code === 0x7f) return true;
  }
  return false;
}

/**
 * Validates and normalizes post-auth redirect targets to same-origin relative paths,
 * rejecting external origins, protocol-relative/backslash URLs, control chars, and auth loops.
 */
export function sanitizeRedirectPath(
  raw: string | null | undefined,
  fallback = defaultDashboardPath(),
): string {
  if (!raw || typeof raw !== 'string') return fallback;
  const trimmed = raw.trim();
  if (!trimmed) return fallback;
  if (hasControlChars(trimmed)) return fallback;
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return fallback;
  }
  const pathPart = trimmed.split(/[?#]/)[0];
  if (pathPart.includes('\\')) return fallback;

  try {
    const origin = getSafeOrigin();
    const parsed = new URL(trimmed, origin);
    if (parsed.origin !== origin) return fallback;

    const safe = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    if (!safe.startsWith('/') || safe.startsWith('//') || safe.startsWith('/\\')) {
      return fallback;
    }

    const normalizedPath = parsed.pathname.replace(/^\/de(?=\/|$)/, '') || '/';
    if (
      normalizedPath === '/login' ||
      normalizedPath.startsWith('/login/') ||
      normalizedPath === '/register' ||
      normalizedPath.startsWith('/register/')
    ) {
      return fallback;
    }

    return safe;
  } catch {
    return fallback;
  }
}

/**
 * Validates external or relative URLs against an explicit protocol allowlist before
 * rendering in href/src attributes or passing to window.open.
 */
export function sanitizeSafeUrl(
  url?: string | null,
  allowRelative = false,
  allowedProtocols: readonly string[] = ['https:', 'http:'],
): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (hasControlChars(trimmed)) return null;

  if (allowRelative && trimmed.startsWith('/')) {
    if (trimmed.startsWith('//') || trimmed.startsWith('/\\')) return null;
    const pathPart = trimmed.split(/[?#]/)[0];
    if (pathPart.includes('\\')) return null;
    try {
      const origin = getSafeOrigin();
      const parsed = new URL(trimmed, origin);
      if (parsed.origin !== origin) return null;
      const safe = `${parsed.pathname}${parsed.search}${parsed.hash}`;
      if (!safe.startsWith('/') || safe.startsWith('//')) return null;
      return safe;
    } catch {
      return null;
    }
  }

  try {
    const parsed = new URL(trimmed);
    if (!allowedProtocols.includes(parsed.protocol.toLowerCase())) {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}

export function clearAuthStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('vs_token');
  localStorage.removeItem('vs_claims');
  localStorage.removeItem('vs_user_name');
  localStorage.removeItem('vs_username');
  localStorage.removeItem('vs_preview_mode');
  sessionStorage.removeItem('vs_redirect');
}

export function getStoredClaims(): AuthClaims | null {
  const raw = localStorage.getItem('vs_claims');
  if (!raw) return null;
  try {
    const claims: AuthClaims = JSON.parse(raw);
    if (!claims || typeof claims.exp !== 'number' || claims.exp * 1000 < Date.now()) {
      clearAuthStorage();
      return null;
    }
    return claims;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getStoredClaims() !== null;
}

export function getToken(): string | null {
  if (!isAuthenticated()) return null;
  return localStorage.getItem('vs_token');
}

export async function redirectToLogin(customRedirect?: string) {
  const isDe =
    typeof window !== 'undefined' &&
    (window.location.pathname === '/de' || window.location.pathname.startsWith('/de/'));
  const loginBase = isDe ? '/de/login' : '/login';
  const defaultDashboard = isDe ? '/de/dashboard' : '/dashboard';
  const rawTarget =
    customRedirect ?? `${window.location.pathname}${window.location.search}`;
  const redirectTarget = sanitizeRedirectPath(rawTarget, defaultDashboard);
  sessionStorage.setItem('vs_redirect', redirectTarget);
  window.location.href = `${loginBase}?redirect=${encodeURIComponent(redirectTarget)}`;
}

export function logout() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('vs_token') : null;
  if (token && typeof fetch === 'function') {
    try {
      void fetch(`${resolveAuthApiBase()}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Best-effort server-side session revocation
    }
  }
  clearAuthStorage();
}
