import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  parseDecimalPrice,
  normalizeCatalogProduct,
  matchesProductCategory,
  useCatalogProducts,
} from './catalog';
import { api } from './api';

vi.mock('./api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('catalog normalization & hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('parseDecimalPrice', () => {
    it('parses numbers and formatted strings', () => {
      expect(parseDecimalPrice(12.5)).toBe(12.5);
      expect(parseDecimalPrice('19.99')).toBe(19.99);
      expect(parseDecimalPrice('€49.00')).toBe(49);
    });

    it('handles invalid, empty, or non-finite inputs safely', () => {
      expect(parseDecimalPrice('')).toBe(0);
      expect(parseDecimalPrice(null)).toBe(0);
      expect(parseDecimalPrice(undefined)).toBe(0);
      expect(parseDecimalPrice(Number.NaN)).toBe(0);
      expect(parseDecimalPrice('invalid')).toBe(0);
    });
  });

  describe('normalizeCatalogProduct', () => {
    it('normalizes nested specs, VAT gross calculation, and stock states', () => {
      const normalized = normalizeCatalogProduct({
        id: 'vps-1',
        name: 'VS-Cloud-4',
        category: 'VPS',
        provider: 'Hetzner',
        price: '10.00',
        stock: 5,
        trial_days: 7,
        specs: {
          cpu: 4,
          ram: 8,
          storage: 160,
          bandwidth: '20 TB',
          location: 'Falkenstein, DE',
          features: ['IPv4', 'IPv6'],
        },
      });

      expect(normalized.id).toBe('vps-1');
      expect(normalized.category).toBe('vps');
      expect(normalized.provider).toBe('hetzner');
      expect(normalized.netPrice).toBe(10);
      expect(normalized.grossPrice).toBe(11.9);
      expect(normalized.formattedNet).toBe('€10.00');
      expect(normalized.formattedGross).toBe('€11.90');
      expect(normalized.inStock).toBe(true);
      expect(normalized.outOfStock).toBe(false);
      expect(normalized.hasTrial).toBe(true);
      expect(normalized.cpu).toBe('4 vCPU');
      expect(normalized.ram).toBe('8 GB');
      expect(normalized.storage).toBe('160 GB NVMe');
      expect(normalized.bandwidth).toBe('20 TB');
      expect(normalized.location).toBe('Falkenstein, DE');
      expect(normalized.features).toEqual(['IPv4', 'IPv6']);
    });

    it('marks stock=0 as outOfStock and stock=null as inStock', () => {
      const zeroStock = normalizeCatalogProduct({
        id: 'ds-0',
        name: 'Sold Out Metal',
        stock: 0,
      });
      expect(zeroStock.inStock).toBe(false);
      expect(zeroStock.outOfStock).toBe(true);

      const unlimitedStock = normalizeCatalogProduct({
        id: 'vps-u',
        name: 'Unlimited VPS',
        stock: null,
      });
      expect(unlimitedStock.inStock).toBe(true);
      expect(unlimitedStock.outOfStock).toBe(false);
    });

    it('normalizes placeholder strings and non-positive numbers cleanly', () => {
      const normalized = normalizeCatalogProduct({
        id: 'sftp-1',
        name: 'SFTP Vault',
        category: 'storage',
        price: 5,
        specs: {
          cpu: 0,
          ram: '0',
          storage: 250,
          bandwidth: 'N/A',
          location: '-',
          description: '—',
          target: 'none',
          features: ['SSH Key Auth', '-', 'N/A', ''],
        },
      });

      expect(normalized.cpu).toBe('—');
      expect(normalized.ram).toBe('—');
      expect(normalized.storage).toBe('250 GB NVMe');
      expect(normalized.bandwidth).toBe('—');
      expect(normalized.location).toBe('Germany (EU-Central)');
      expect(normalized.description).toBeUndefined();
      expect(normalized.target).toBeUndefined();
      expect(normalized.features).toEqual(['SSH Key Auth']);
    });
  });

  describe('matchesProductCategory', () => {
    it('matches categories and providers accurately', () => {
      const vps = normalizeCatalogProduct({ id: '1', name: 'A', category: 'vps', provider: 'proxmox' });
      const ds = normalizeCatalogProduct({ id: '2', name: 'B', category: 'dedicated', provider: 'reliablesite' });
      const storage = normalizeCatalogProduct({ id: '3', name: 'C', category: 'sftp', provider: 'sftpgo' });
      const odp = normalizeCatalogProduct({ id: '4', name: 'D', category: 'odp' });

      expect(matchesProductCategory(vps, 'cloud')).toBe(true);
      expect(matchesProductCategory(vps, 'dedicated')).toBe(false);
      expect(matchesProductCategory(ds, 'dedicated')).toBe(true);
      expect(matchesProductCategory(storage, 'storage')).toBe(true);
      expect(matchesProductCategory(odp, 'odp')).toBe(true);
      expect(matchesProductCategory(odp, 'all')).toBe(true);
    });
  });

  describe('useCatalogProducts hook', () => {
    it('filters hidden products, sorts by sort_order, and transitions to ready', async () => {
      vi.mocked(api.get).mockResolvedValueOnce([
        { id: '2', name: 'Second', category: 'vps', price: 20, sort_order: 2 },
        { id: 'hidden-1', name: 'Hidden', category: 'vps', price: 5, hidden: true, sort_order: 0 },
        { id: '1', name: 'First', category: 'vps', price: 10, sort_order: 1 },
      ]);

      const { result } = renderHook(() => useCatalogProducts('cloud'));
      expect(result.current.status).toBe('loading');

      await waitFor(() => {
        expect(result.current.status).toBe('ready');
      });

      expect(result.current.products.map((p) => p.id)).toEqual(['1', '2']);
    });

    it('transitions to empty when no products match filter', async () => {
      vi.mocked(api.get).mockResolvedValueOnce([
        { id: '1', name: 'VPS Only', category: 'vps', price: 10 },
      ]);

      const { result } = renderHook(() => useCatalogProducts('dedicated'));

      await waitFor(() => {
        expect(result.current.status).toBe('empty');
      });
      expect(result.current.products).toHaveLength(0);
    });

    it('transitions to error when API call fails', async () => {
      vi.mocked(api.get).mockRejectedValueOnce(new Error('Network failure'));

      const { result } = renderHook(() => useCatalogProducts('all'));

      await waitFor(() => {
        expect(result.current.status).toBe('error');
      });
      expect(result.current.error).toBe('Network failure');
    });
  });
});
