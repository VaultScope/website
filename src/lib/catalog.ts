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

export const VAT_MULTIPLIER = 1.19;

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

export function normalizeCatalogProduct(raw: RawCatalogProduct): CatalogProduct {
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
  const grossPrice = Math.round(netPrice * VAT_MULTIPLIER * 100) / 100;
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
      return cat === 'dedicated' || cat === 'bare-metal' || cat === 'ds' || prov === 'reliablesite';
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
  loading: boolean;
  error: string | null;
  errorMessage: string | null;
  status: 'loading' | 'error' | 'empty' | 'ready';
  refetch: () => void;
  reload: () => void;
}

export function useCatalogProducts(categoryFilter?: ProductCategoryFilter): UseCatalogResult {
  const [allProducts, setAllProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<RawCatalogProduct[]>('/storefront/catalog');
      if (!Array.isArray(data)) {
        setAllProducts([]);
      } else {
        const visible = data
          .filter((item) => !item.hidden)
          .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
          .map(normalizeCatalogProduct);
        setAllProducts(visible);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to reach the VAMOS catalog endpoint.';
      setError(msg);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

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
    loading,
    error,
    errorMessage: error,
    status,
    refetch: fetchCatalog,
    reload: fetchCatalog,
  };
}

