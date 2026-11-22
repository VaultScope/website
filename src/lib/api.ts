import { clearAuthStorage, sanitizeRedirectPath } from './auth';

function resolveApiBase(): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'vaultscope.de' || host.endsWith('.vaultscope.de')) {
      return '/api';
    }
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
}

export const API_BASE = resolveApiBase();
const FALLBACK_API_BASE = 'https://api.vaultscope.de/api';
const IS_TEST = typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'test';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, IS_TEST ? 0 : ms));
}

class ApiClient {
  private csrfToken: string | null = null;
  private csrfPromise: Promise<void> | null = null;

  private getToken(): string | null {
    return localStorage.getItem('vs_token');
  }

  private async fetchCsrfToken() {
    if (this.csrfPromise) return this.csrfPromise;
    this.csrfPromise = fetch(`${API_BASE}/csrf`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json().catch(() => null);
        if (data && typeof data.token === 'string' && data.token.trim()) {
          this.csrfToken = data.token;
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        this.csrfPromise = null;
      });
    return this.csrfPromise;
  }

  private async fetchWithRetry(path: string, init: RequestInit): Promise<Response> {
    const isIdempotent = !init.method || init.method === 'GET' || init.method === 'HEAD';
    const maxAttempts = isIdempotent ? 3 : 1;
    const isProdVaultScope = API_BASE === '/api';
    let lastError: unknown;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const base =
        isProdVaultScope && attempt === 1 ? FALLBACK_API_BASE : API_BASE;
      try {
        const res = await fetch(`${base}${path}`, init);
        if (
          (res.status === 502 || res.status === 503 || res.status === 504 || res.status === 429) &&
          attempt < maxAttempts - 1
        ) {
          await sleep(180 * (attempt + 1));
          continue;
        }
        return res;
      } catch (err) {
        lastError = err;
        if (attempt < maxAttempts - 1) {
          await sleep(180 * (attempt + 1));
          continue;
        }
      }
    }
    throw lastError instanceof Error ? lastError : new Error('Network request failed');
  }

  private async request<T>(path: string, options: RequestInit = {}, retriedCsrf = false): Promise<T> {
    const token = this.getToken();
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    const headers: Record<string, string> = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...((options.headers as Record<string, string>) || {}),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const isMutating = Boolean(options.method && options.method !== 'GET' && options.method !== 'HEAD');
    if (isMutating) {
      if (!this.csrfToken) await this.fetchCsrfToken();
      if (this.csrfToken) {
        headers['x-csrf-token'] = this.csrfToken;
      }
    }

    const res = await this.fetchWithRetry(path, { ...options, headers, credentials: 'include' });

    if (res.status === 403 && isMutating && !retriedCsrf) {
      this.csrfToken = null;
      await this.fetchCsrfToken();
      if (this.csrfToken) {
        return this.request<T>(path, options, true);
      }
    }

    if (res.status === 401) {
      clearAuthStorage();
      if (typeof window !== 'undefined' && !path.startsWith('/storefront/auth/')) {
        const isDe = window.location.pathname === '/de' || window.location.pathname.startsWith('/de/');
        const loginBase = isDe ? '/de/login' : '/login';
        const defaultDashboard = isDe ? '/de/dashboard' : '/dashboard';
        const currentTarget = sanitizeRedirectPath(
          window.location.pathname + window.location.search,
          defaultDashboard,
        );
        if (!window.location.pathname.endsWith('/login')) {
          window.location.href = `${loginBase}?redirect=${encodeURIComponent(currentTarget)}`;
        }
      }
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(body.error || `API error ${res.status}`);
    }

    return res.json();
  }

  get<T>(path: string) {
    return this.request<T>(path);
  }

  post<T>(path: string, body?: unknown) {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request<T>(path, {
      method: 'POST',
      body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(path: string, body?: unknown) {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request<T>(path, {
      method: 'PUT',
      body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: 'DELETE',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }
}

export const api = new ApiClient();
