export interface AuthClaims {
  sub: string;
  email: string;
  role: string;
  audience: 'admin' | 'storefront';
  exp: number;
  iat: number;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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

export async function redirectToLogin() {
  window.location.href = '/login';
}

export async function devLoginCustomer(persona: string = 'customer1'): Promise<AuthClaims> {
  const res = await fetch(`${API_BASE}/auth/dev-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ persona }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Customer dev login failed');
  }

  const { token, claims } = await res.json();
  localStorage.setItem('vs_token', token);
  localStorage.setItem('vs_claims', JSON.stringify(claims));
  return claims;
}

export function logout() {
  localStorage.removeItem('vs_token');
  localStorage.removeItem('vs_claims');
  localStorage.removeItem('vs_user_name');
}
