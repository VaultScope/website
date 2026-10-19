const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private csrfToken: string | null = null;
  private csrfPromise: Promise<void> | null = null;

  private getToken(): string | null {
    return localStorage.getItem('vs_token');
  }

  private async fetchCsrfToken() {
    if (this.csrfPromise) return this.csrfPromise;
    this.csrfPromise = fetch(`${API_BASE}/csrf`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        this.csrfToken = data.token;
      })
      .catch(console.error)
      .finally(() => {
        this.csrfPromise = null;
      });
    return this.csrfPromise;
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

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers, credentials: 'include' });

    if (res.status === 403 && isMutating && !retriedCsrf) {
      this.csrfToken = null;
      await this.fetchCsrfToken();
      if (this.csrfToken) {
        return this.request<T>(path, options, true);
      }
    }

    if (res.status === 401) {
      localStorage.removeItem('vs_token');
      localStorage.removeItem('vs_claims');
      if (typeof window !== 'undefined' && !path.startsWith('/storefront/auth/')) {
        const isDe = window.location.pathname === '/de' || window.location.pathname.startsWith('/de/');
        const loginBase = isDe ? '/de/login' : '/login';
        const currentTarget = window.location.pathname + window.location.search;
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
