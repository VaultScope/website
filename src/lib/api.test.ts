import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ApiClient', () => {
  let api: any;

  beforeEach(async () => {
    vi.resetModules();
    localStorage.clear();
    mockFetch.mockReset();
    const module = await import('./api');
    api = module.api;
  });

  describe('GET requests', () => {
    it('sends GET request with correct path', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve([{ id: '1', name: 'test' }]),
      });

      const result = await api.get('/storefront/services');
      expect(result).toEqual([{ id: '1', name: 'test' }]);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/storefront/services'),
        expect.objectContaining({ credentials: 'include' })
      );
    });

    it('includes Authorization header when token exists', async () => {
      localStorage.setItem('vs_token', 'my-jwt-token');
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await api.get('/storefront/services');
      const call = mockFetch.mock.calls[0];
      expect(call[1].headers['Authorization']).toBe('Bearer my-jwt-token');
    });

    it('does not include Authorization header when no token', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await api.get('/storefront/catalog');
      const call = mockFetch.mock.calls[0];
      expect(call[1].headers['Authorization']).toBeUndefined();
    });
  });

  describe('POST requests', () => {
    it('fetches CSRF token before mutation requests', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ token: 'csrf-abc' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ id: 'new-id' }),
        });

      await api.post('/storefront/orders', { product_id: 'p1' });

      expect(mockFetch).toHaveBeenCalledTimes(2);
      const csrfCall = mockFetch.mock.calls[0];
      expect(csrfCall[0]).toContain('/csrf');

      const postCall = mockFetch.mock.calls[1];
      expect(postCall[1].method).toBe('POST');
      expect(postCall[1].headers['x-csrf-token']).toBe('csrf-abc');
      expect(JSON.parse(postCall[1].body)).toEqual({ product_id: 'p1' });
    });

    it('does not fetch CSRF for GET requests', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await api.get('/storefront/services');
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('error handling', () => {
    it('throws with error message from response body', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve({ error: 'Invalid product ID' }),
      });

      await expect(api.get('/storefront/services')).rejects.toThrow('Invalid product ID');
    });

    it('throws with statusText when body has no error field', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new Error('not json')),
      });

      await expect(api.get('/storefront/services')).rejects.toThrow('Internal Server Error');
    });

    it('clears auth and throws on 401', async () => {
      localStorage.setItem('vs_token', 'old-token');
      localStorage.setItem('vs_claims', '{}');

      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' }),
      });

      await expect(api.get('/storefront/services')).rejects.toThrow('Unauthorized');
      expect(localStorage.getItem('vs_token')).toBeNull();
      expect(localStorage.getItem('vs_claims')).toBeNull();
    });
  });

  describe('DELETE requests', () => {
    it('sends DELETE with CSRF token', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ token: 'csrf-xyz' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ ok: true }),
        });

      await api.delete('/storefront/services/123');
      const deleteCall = mockFetch.mock.calls[1];
      expect(deleteCall[1].method).toBe('DELETE');
      expect(deleteCall[1].headers['x-csrf-token']).toBe('csrf-xyz');
    });
  });

  describe('PUT requests', () => {
    it('sends PUT with body and CSRF token', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ token: 'csrf-123' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ id: 'updated' }),
        });

      await api.put('/storefront/profile', { name: 'New Name' });
      const putCall = mockFetch.mock.calls[1];
      expect(putCall[1].method).toBe('PUT');
      expect(putCall[1].headers['x-csrf-token']).toBe('csrf-123');
      expect(JSON.parse(putCall[1].body)).toEqual({ name: 'New Name' });
    });
  });
});
