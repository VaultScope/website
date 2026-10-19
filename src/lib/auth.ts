export interface AuthClaims {
  sub: string;
  email: string;
  role: string;
  audience: 'admin' | 'storefront';
  exp: number;
  iat: number;
}

export function getStoredClaims(): AuthClaims | null {
  const raw = localStorage.getItem('vs_claims');
  if (!raw) return null;
  try {
    const claims: AuthClaims = JSON.parse(raw);
    if (claims.exp * 1000 < Date.now()) {
      logout();
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
  const isDe = window.location.pathname.startsWith('/de');
  const loginBase = isDe ? '/de/login' : '/login';
  const redirectTarget =
    customRedirect ?? `${window.location.pathname}${window.location.search}`;
  sessionStorage.setItem('vs_redirect', redirectTarget);
  window.location.href = `${loginBase}?redirect=${encodeURIComponent(redirectTarget)}`;
}

export function logout() {
  localStorage.removeItem('vs_token');
  localStorage.removeItem('vs_claims');
  localStorage.removeItem('vs_user_name');
  localStorage.removeItem('vs_preview_mode');
}
