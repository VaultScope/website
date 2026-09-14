# API Integration Guide

This document explains how the VaultScope Storefront integrates with the VaultScope API (vamos).

## API Client Overview

All API communication goes through a centralized client located at `src/lib/api.ts`.

### Key Features

- **Automatic CSRF Protection**: Fetches and includes CSRF tokens
- **JWT Authentication**: Automatically attaches bearer tokens
- **Error Handling**: Centralized error handling with automatic auth cleanup
- **Type Safety**: Full TypeScript support with generics
- **Credentials**: Includes cookies for session management

## Using the API Client

### Basic Usage

```typescript
import { api } from '../lib/api';

// GET request
const products = await api.get<Product[]>('/storefront/catalog');

// POST request
const order = await api.post<Order>('/storefront/orders', {
  productId: 'prod_123',
  quantity: 1
});

// PUT request
const updated = await api.put<User>('/storefront/profile', {
  name: 'John Doe'
});

// DELETE request
await api.delete(`/storefront/orders/${orderId}`);
```

### Type Safety

Always provide the response type:

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
}

// ✅ Good - Type-safe
const products = await api.get<Product[]>('/storefront/catalog');
console.log(products[0].name); // TypeScript knows this is a string

// ❌ Bad - No type safety
const products = await api.get('/storefront/catalog');
console.log(products[0].name); // TypeScript can't help here
```

## API Endpoints

### Authentication

```typescript
// Initialize login (get state token)
POST /api/auth/init-login
Response: { state: string }

// Complete OIDC callback
POST /api/auth/callback/storefront
Body: { code: string, redirect_uri: string, state: string }
Response: { token: string, claims: AuthClaims }

// Logout (server-side session cleanup)
POST /api/auth/logout
Response: { success: true }
```

### CSRF Protection

```typescript
// Fetch CSRF token
GET /api/csrf
Response: { token: string }
```

The API client automatically fetches this on first mutating request.

### Storefront Catalog

```typescript
// List all products
GET /api/storefront/catalog
Response: Product[]

interface Product {
  id: string;
  name: string;
  description: string;
  category: 'vps' | 'dedicated' | 'odp';
  price_monthly: number;
  specs: {
    cpu?: string;
    ram?: string;
    storage?: string;
    bandwidth?: string;
  };
}
```

### Orders

```typescript
// Create new order
POST /api/storefront/orders
Body: {
  product_id: string;
  billing_cycle: 'monthly' | 'quarterly' | 'annually';
  config: Record<string, unknown>; // Product-specific configuration
}
Response: Order

// List user's orders
GET /api/storefront/orders
Response: Order[]

// Get specific order
GET /api/storefront/orders/:id
Response: Order

interface Order {
  id: string;
  user_id: string;
  product_id: string;
  status: 'pending' | 'provisioning' | 'active' | 'cancelled';
  created_at: string;
  service_id?: string; // Once provisioned
}
```

### Services

```typescript
// List user's active services
GET /api/storefront/services
Response: Service[]

// Get service details
GET /api/storefront/services/:id
Response: Service

// Perform service action
POST /api/storefront/services/:id/actions
Body: {
  action: 'restart' | 'stop' | 'start' | 'rebuild';
}
Response: { success: boolean; job_id: string }

interface Service {
  id: string;
  user_id: string;
  product_id: string;
  status: 'active' | 'suspended' | 'terminated';
  ip_address?: string;
  credentials?: {
    username: string;
    password: string; // Encrypted at rest
  };
  created_at: string;
  expires_at?: string;
}
```

### Invoices

```typescript
// List user's invoices
GET /api/storefront/invoices
Response: Invoice[]

// Get specific invoice
GET /api/storefront/invoices/:id
Response: Invoice

// Pay invoice (Stripe)
POST /api/storefront/invoices/:id/pay
Body: {
  payment_method_id: string; // Stripe payment method
}
Response: { success: boolean; payment_intent_id: string }

interface Invoice {
  id: string;
  user_id: string;
  amount: number;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  due_date: string;
  created_at: string;
  line_items: LineItem[];
}
```

### Support Tickets

```typescript
// Create ticket
POST /api/storefront/tickets
Body: {
  subject: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  department_id?: string;
}
Response: Ticket

// List user's tickets
GET /api/storefront/tickets
Response: Ticket[]

// Get ticket with messages
GET /api/storefront/tickets/:id
Response: TicketWithMessages

// Reply to ticket
POST /api/storefront/tickets/:id/messages
Body: {
  message: string;
}
Response: TicketMessage
```

### Profile

```typescript
// Get user profile
GET /api/storefront/profile
Response: UserProfile

// Update profile
PUT /api/storefront/profile
Body: Partial<UserProfile>
Response: UserProfile

interface UserProfile {
  id: string;
  email: string;
  name: string;
  company?: string;
  address?: Address;
  phone?: string;
}
```

## Error Handling

### Error Response Format

All API errors follow this format:

```json
{
  "error": "Human-readable error message"
}
```

### HTTP Status Codes

| Code | Meaning | Client Behavior |
|------|---------|----------------|
| 200 | Success | Parse and use response |
| 400 | Bad Request | Show error to user |
| 401 | Unauthorized | Clear auth and redirect to login |
| 403 | Forbidden | Show "Access Denied" message |
| 404 | Not Found | Show "Not Found" message |
| 422 | Validation Error | Show validation errors to user |
| 429 | Rate Limited | Show "Too many requests" message |
| 500 | Server Error | Show generic error message |

### Example Error Handling

```typescript
try {
  const order = await api.post<Order>('/storefront/orders', orderData);
  toast.success('Order created successfully!');
  navigate(`/dashboard/orders/${order.id}`);
} catch (error) {
  // API client throws Error with message from API
  toast.error(error.message);
  // Could be: "Insufficient funds", "Invalid product", etc.
}
```

### 401 Handling

The API client automatically handles 401 responses:

```typescript
if (res.status === 401) {
  localStorage.removeItem('vs_token');
  localStorage.removeItem('vs_claims');
  window.location.href = '/dashboard';
  throw new Error('Unauthorized');
}
```

This ensures expired or invalid tokens are cleaned up immediately.

## CSRF Protection

### How It Works

1. **First Mutating Request**: Client detects no CSRF token
2. **Fetch Token**: `GET /api/csrf` returns `{ token: "abc123" }`
3. **Store Token**: Client stores token in memory
4. **Include in Requests**: All POST/PUT/DELETE include `x-csrf-token: abc123` header
5. **Server Validation**: Server validates token, rejects if missing/invalid

### Implementation

```typescript
class ApiClient {
  private csrfToken: string | null = null;
  private csrfPromise: Promise<void> | null = null;

  private async fetchCsrfToken() {
    if (this.csrfPromise) return this.csrfPromise;
    
    this.csrfPromise = fetch(`${API_BASE}/csrf`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        this.csrfToken = data.token;
      });
    
    return this.csrfPromise;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    // ... other code ...

    if (options.method && options.method !== 'GET' && options.method !== 'HEAD') {
      if (!this.csrfToken) await this.fetchCsrfToken();
      if (this.csrfToken) {
        headers['x-csrf-token'] = this.csrfToken;
      }
    }

    // ... rest of request ...
  }
}
```

## Authentication Flow

### Login

```typescript
import { redirectToLogin } from '../lib/auth';

// User clicks login button
async function handleLogin() {
  await redirectToLogin();
  // User is redirected to Authentik
}
```

### Callback

```typescript
// AuthCallback.tsx
import { handleCallback } from '../lib/auth';

const code = searchParams.get('code');
const state = searchParams.get('state');

if (code && state) {
  try {
    const claims = await handleCallback(code, state);
    // Token and claims are now stored
    navigate('/dashboard');
  } catch (error) {
    toast.error(error.message);
  }
}
```

### Logout

```typescript
import { logout } from '../lib/auth';

function handleLogout() {
  logout(); // Clears localStorage
  navigate('/');
}
```

## Request/Response Examples

### Creating an Order

```typescript
// Request
POST /api/storefront/orders
Headers: {
  "Authorization": "Bearer eyJhbGc...",
  "x-csrf-token": "abc123",
  "Content-Type": "application/json"
}
Body: {
  "product_id": "prod_vps_basic",
  "billing_cycle": "monthly",
  "config": {
    "hostname": "my-server",
    "os": "ubuntu-22.04"
  }
}

// Response
{
  "id": "ord_123",
  "user_id": "user_456",
  "product_id": "prod_vps_basic",
  "status": "pending",
  "created_at": "2026-09-15T12:00:00Z"
}
```

### Listing Products

```typescript
// Request
GET /api/storefront/catalog

// Response
[
  {
    "id": "prod_vps_basic",
    "name": "Basic VPS",
    "description": "Perfect for small projects",
    "category": "vps",
    "price_monthly": 5.99,
    "specs": {
      "cpu": "1 vCore",
      "ram": "1 GB",
      "storage": "25 GB SSD",
      "bandwidth": "1 TB"
    }
  },
  // ... more products
]
```

## Rate Limiting

The API enforces rate limits per IP address:

- **Anonymous**: 60 requests per minute
- **Authenticated**: 300 requests per minute

When rate limited, the API returns 429 with:

```json
{
  "error": "Too many requests. Please try again later."
}
```

## Best Practices

### 1. Always Handle Errors

```typescript
// ✅ Good
try {
  const data = await api.get<Product[]>('/storefront/catalog');
  setProducts(data);
} catch (error) {
  toast.error(`Failed to load products: ${error.message}`);
  setProducts([]);
}

// ❌ Bad
const data = await api.get<Product[]>('/storefront/catalog');
setProducts(data); // Unhandled promise rejection if it fails
```

### 2. Show Loading States

```typescript
const [loading, setLoading] = useState(true);

useEffect(() => {
  api.get<Product[]>('/storefront/catalog')
    .then(setProducts)
    .catch(error => toast.error(error.message))
    .finally(() => setLoading(false));
}, []);

if (loading) return <Spinner />;
```

### 3. Use TypeScript Interfaces

Define interfaces for all API responses:

```typescript
// types.ts
export interface Product {
  id: string;
  name: string;
  // ... all fields
}

// Component
const products = await api.get<Product[]>('/storefront/catalog');
```

### 4. Debounce Search Requests

```typescript
import { useDebouncedValue } from '../lib/hooks';

const [search, setSearch] = useState('');
const debouncedSearch = useDebouncedValue(search, 500);

useEffect(() => {
  if (debouncedSearch) {
    api.get<Product[]>(`/storefront/catalog?search=${debouncedSearch}`)
      .then(setProducts);
  }
}, [debouncedSearch]);
```

### 5. Avoid Waterfall Requests

```typescript
// ✅ Good - Parallel
const [products, services] = await Promise.all([
  api.get<Product[]>('/storefront/catalog'),
  api.get<Service[]>('/storefront/services'),
]);

// ❌ Bad - Waterfall (slower)
const products = await api.get<Product[]>('/storefront/catalog');
const services = await api.get<Service[]>('/storefront/services');
```

## Troubleshooting

### CORS Errors

If you see CORS errors, ensure:

1. API `CORS_ORIGINS` includes dev server: `http://localhost:5174`
2. Requests include `credentials: 'include'` (API client does this automatically)

### CSRF Token Errors

If CSRF validation fails:

1. Check that API `/api/csrf` endpoint is accessible
2. Verify cookies are being sent (`credentials: 'include'`)
3. Clear browser cookies and try again

### 401 Errors

If you're getting unexpected 401s:

1. Check token is in localStorage: `localStorage.getItem('vs_token')`
2. Verify token hasn't expired: Check `exp` in claims
3. Ensure API is using correct JWT secret

### API Not Reachable

1. Verify API is running: `curl http://localhost:3000/api/health`
2. Check `VITE_API_URL` in `.env`
3. Check firewall/network settings
