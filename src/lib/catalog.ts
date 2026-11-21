import { useCallback, useEffect, useState } from 'react';
import { api } from './api';

export interface RawCatalogProduct {
  id: string;
  name: string;
  category?: string;
  provider?: string;
  price?: number | string;
  billing_cycle?: string;
  specs?: Record<string, unknown> | null;
  stock?: number | null;
  user_limit?: number | null;
  trial_days?: number | null;
  hidden?: boolean;
  sort_order?: number;
  // Optional legacy top-level spec fallbacks
  cpu?: string | number;
  vcpu?: string | number;
  ram?: string | number;
  memory?: string | number;
  storage?: string | number;
  disk?: string | number;
  bandwidth?: string | number;
}

export interface NormalizedSpecs {
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  location: string;
  raw: Record<string, unknown>;
}

export type ProductCategoryFilter =
  | 'all'
  | 'cloud'
  | 'vps'
  | 'dedicated'
  | 'storage'
  | 'odp'
  | 'managed';

export interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  provider: string;
  netPrice: number;
  grossPrice: number;
  priceNet: number;
  priceGross: number;
  netMonthly: number;
  grossMonthly: number;
  formattedNet: string;
  formattedGross: string;
  netFormatted: string;
  grossFormatted: string;
  priceNetFormatted: string;
  priceGrossFormatted: string;
  billingCycle: string;
  stock: number | null;
  inStock: boolean;
  outOfStock: boolean;
  userLimit: number | null;
  trialDays: number;
  hasTrial: boolean;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  location: string;
  description?: string;
  target?: string;
  features: string[];
  specs: NormalizedSpecs;
  raw: RawCatalogProduct;
}

export const DEFAULT_TAX_RATE_PERCENT = 0;
export const VAT_MULTIPLIER = 1.19;

export interface StorefrontTaxConfig {
  taxMode: string;
  taxRatePercent: number;
  smallBusinessExempt: boolean;
  taxNotice: string | null;
}

export const SAFE_DEFAULT_TAX_CONFIG: StorefrontTaxConfig = {
  taxMode: 'small_business',
  taxRatePercent: 0,
  smallBusinessExempt: true,
  taxNotice: 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.',
};

export function parseStorefrontTaxConfig(raw: any): StorefrontTaxConfig {
  if (!raw || typeof raw !== 'object') {
    return SAFE_DEFAULT_TAX_CONFIG;
  }
  const hasExplicitRate =
    raw.tax_rate_percent !== undefined && raw.tax_rate_percent !== null;
  if (!hasExplicitRate && raw.small_business_exempt === undefined && !raw.tax_mode) {
    return SAFE_DEFAULT_TAX_CONFIG;
  }
  const parsedRate = Number(raw.tax_rate_percent);
  const taxRatePercent = Number.isFinite(parsedRate) && parsedRate >= 0 ? parsedRate : 0;
  const taxMode =
    typeof raw.tax_mode === 'string' && raw.tax_mode.trim()
      ? raw.tax_mode.trim()
      : taxRatePercent <= 0
        ? 'small_business'
        : 'exclusive';
  const smallBusinessExempt =
    typeof raw.small_business_exempt === 'boolean'
      ? raw.small_business_exempt
      : taxMode === 'small_business' || taxRatePercent <= 0;
  const taxNotice =
    typeof raw.tax_notice === 'string' && raw.tax_notice.trim()
      ? raw.tax_notice.trim()
      : smallBusinessExempt
        ? 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.'
        : null;
  return {
    taxMode,
    taxRatePercent: smallBusinessExempt ? 0 : taxRatePercent,
    smallBusinessExempt,
    taxNotice,
  };
}

export async function fetchStorefrontTaxConfig(): Promise<StorefrontTaxConfig> {
  if (typeof fetch !== 'function') {
    return SAFE_DEFAULT_TAX_CONFIG;
  }
  if (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'test') {
    return SAFE_DEFAULT_TAX_CONFIG;
  }
  try {
    const host = typeof window !== 'undefined' ? window.location.hostname : '';
    const base =
      host === 'vaultscope.de' || host.endsWith('.vaultscope.de')
        ? '/api'
        : import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const res = await fetch(`${base}/storefront/config`);
    if (!res.ok) return SAFE_DEFAULT_TAX_CONFIG;
    const json = await res.json();
    return parseStorefrontTaxConfig(json);
  } catch {
    return SAFE_DEFAULT_TAX_CONFIG;
  }
}

function isPlaceholderSpec(val: string): boolean {
  const lower = val.trim().toLowerCase();
  return (
    !lower ||
    lower === '-' ||
    lower === '–' ||
    lower === '—' ||
    lower === 'n/a' ||
    lower === 'none' ||
    lower === 'null' ||
    lower === 'undefined'
  );
}

function formatSpecValue(val: unknown, unitSuffix?: string): string {
  if (val === null || val === undefined || val === '') return '—';
  if (typeof val === 'number') {
    if (!Number.isFinite(val) || val <= 0) return '—';
    return unitSuffix ? `${val} ${unitSuffix}` : String(val);
  }
  const str = String(val).trim();
  if (isPlaceholderSpec(str) || /^0+(\.0+)?$/.test(str)) return '—';
  if (unitSuffix && /^\d+(\.\d+)?$/.test(str)) {
    return `${str} ${unitSuffix}`;
  }
  return str;
}

export function parseDecimalPrice(raw: unknown): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string') {
    const cleaned = raw.replace(/[^0-9.-]/g, '');
    const parsed = Number.parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export function normalizeCatalogProduct(
  raw: RawCatalogProduct,
  taxRatePercent: number = DEFAULT_TAX_RATE_PERCENT
): CatalogProduct {
  const specsObj: Record<string, unknown> =
    raw.specs && typeof raw.specs === 'object' && !Array.isArray(raw.specs)
      ? raw.specs
      : {};

  const cpuRaw =
    specsObj.cpu ??
    specsObj.vcpu ??
    specsObj.cores ??
    raw.cpu ??
    raw.vcpu;
  const ramRaw =
    specsObj.ram ??
    specsObj.memory ??
    raw.ram ??
    raw.memory;
  const storageRaw =
    specsObj.storage ??
    specsObj.disk ??
    specsObj.nvme ??
    specsObj.storage_gb ??
    specsObj.quota_gb ??
    raw.storage ??
    raw.disk;
  const bandwidthRaw =
    specsObj.bandwidth ??
    specsObj.network ??
    specsObj.port ??
    specsObj.traffic ??
    raw.bandwidth;
  const locationRaw =
    specsObj.location ??
    specsObj.region ??
    specsObj.datacenter;

  const netPrice = parseDecimalPrice(raw.price);
  const multiplier = 1 + Math.max(0, Number.isFinite(taxRatePercent) ? taxRatePercent : 0) / 100;
  const grossPrice = Math.round(netPrice * multiplier * 100) / 100;
  const formattedNet = netPrice <= 0 ? '€0.00' : `€${netPrice.toFixed(2)}`;
  const formattedGross = grossPrice <= 0 ? '€0.00' : `€${grossPrice.toFixed(2)}`;

  const stock =
    raw.stock === null || raw.stock === undefined
      ? null
      : Number(raw.stock);
  const inStock = stock === null || !Number.isFinite(stock) || stock < 0 || stock > 0;
  const trialDays = Number(raw.trial_days || 0);

  const cpu = formatSpecValue(cpuRaw, 'vCPU');
  const ram = formatSpecValue(ramRaw, 'GB');
  const storage = formatSpecValue(storageRaw, 'GB NVMe');
  const bandwidth = formatSpecValue(bandwidthRaw);
  const formattedLocation = formatSpecValue(locationRaw);
  const location =
    formattedLocation === '—' ? 'Germany (EU-Central)' : formattedLocation;

  const rawDesc =
    typeof specsObj.description === 'string'
      ? specsObj.description.trim()
      : typeof specsObj.desc === 'string'
        ? specsObj.desc.trim()
        : '';
  const description = rawDesc && !isPlaceholderSpec(rawDesc) ? rawDesc : undefined;

  const rawTarget =
    typeof specsObj.target === 'string'
      ? specsObj.target.trim()
      : typeof specsObj.workload === 'string'
        ? specsObj.workload.trim()
        : '';
  const target = rawTarget && !isPlaceholderSpec(rawTarget) ? rawTarget : undefined;

  const featuresRaw = specsObj.features;
  const features = Array.isArray(featuresRaw)
    ? featuresRaw
        .filter((f): f is string => typeof f === 'string')
        .map((f) => f.trim())
        .filter((f) => !isPlaceholderSpec(f))
    : [];

  return {
    id: String(raw.id),
    name: raw.name || 'Unnamed Plan',
    category: String(raw.category || 'vps').toLowerCase(),
    provider: String(raw.provider || '').toLowerCase(),
    netPrice,
    grossPrice,
    priceNet: netPrice,
    priceGross: grossPrice,
    netMonthly: netPrice,
    grossMonthly: grossPrice,
    formattedNet,
    formattedGross,
    netFormatted: formattedNet,
    grossFormatted: formattedGross,
    priceNetFormatted: formattedNet,
    priceGrossFormatted: formattedGross,
    billingCycle: String(raw.billing_cycle || 'monthly').toLowerCase(),
    stock,
    inStock,
    outOfStock: !inStock,
    userLimit:
      raw.user_limit === null || raw.user_limit === undefined
        ? null
        : Number(raw.user_limit),
    trialDays,
    hasTrial: trialDays > 0,
    cpu,
    ram,
    storage,
    bandwidth,
    location,
    description,
    target,
    features,
    specs: {
      cpu,
      ram,
      storage,
      bandwidth,
      location,
      raw: specsObj,
    },
    raw,
  };
}

export function matchesProductCategory(
  product: CatalogProduct,
  target: ProductCategoryFilter
): boolean {
  if (target === 'all') return true;
  const cat = product.category;
  const prov = product.provider;
  switch (target) {
    case 'cloud':
    case 'vps':
      return cat === 'vps' || cat === 'cloud' || prov === 'hetzner' || prov === 'proxmox';
    case 'dedicated':
      return cat === 'dedicated' || cat === 'bare-metal' || cat === 'ds' || prov === 'vaultscope_dedicated' || prov === 'reliablesite';
    case 'storage':
      return cat === 'sftp' || cat === 'storage' || prov === 'sftpgo';
    case 'odp':
      return cat === 'odp' || cat === 'ocd';
    case 'managed':
      return cat === 'managed';
    default:
      return false;
  }
}

export interface UseCatalogResult {
  products: CatalogProduct[];
  allProducts: CatalogProduct[];
  taxConfig: StorefrontTaxConfig;
  loading: boolean;
  error: string | null;
  errorMessage: string | null;
  status: 'loading' | 'error' | 'empty' | 'ready';
  refetch: () => void;
  reload: () => void;
}

export function useCatalogProducts(categoryFilter?: ProductCategoryFilter): UseCatalogResult {
  const [rawProducts, setRawProducts] = useState<RawCatalogProduct[]>([]);
  const [taxConfig, setTaxConfig] = useState<StorefrontTaxConfig>(SAFE_DEFAULT_TAX_CONFIG);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, fetchedTaxConfig] = await Promise.all([
        api.get<RawCatalogProduct[]>('/storefront/catalog'),
        fetchStorefrontTaxConfig(),
      ]);
      setTaxConfig(fetchedTaxConfig);
      if (!Array.isArray(data)) {
        setRawProducts([]);
      } else {
        const visibleRaw = data
          .filter((item) => !item.hidden)
          .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0));
        setRawProducts(visibleRaw);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to reach the VAMOS catalog endpoint.';
      setError(msg);
      setRawProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const allProducts = rawProducts.map((item) =>
    normalizeCatalogProduct(item, taxConfig.taxRatePercent)
  );

  const products =
    categoryFilter && categoryFilter !== 'all'
      ? allProducts.filter((p) => matchesProductCategory(p, categoryFilter))
      : allProducts;

  const status: 'loading' | 'error' | 'empty' | 'ready' = loading
    ? 'loading'
    : error
      ? 'error'
      : products.length === 0
        ? 'empty'
        : 'ready';

  return {
    products,
    allProducts,
    taxConfig,
    loading,
    error,
    errorMessage: error,
    status,
    refetch: fetchCatalog,
    reload: fetchCatalog,
  };
}

