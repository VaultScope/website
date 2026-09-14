# Architecture Overview

This document describes the architecture, design decisions, and technical patterns used in the VaultScope Storefront.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    VaultScope Storefront                     │
│                    (React 19 + Vite 8)                       │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTPS + JWT + CSRF
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                     VaultScope API                           │
│                   (Rust + Axum + SQLx)                       │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ OAuth2/OIDC
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    Authentik OIDC                            │
│                  (Identity Provider)                         │
└──────────────────────────────────────────────────────────────┘
```

## Application Architecture

### Layer Structure

```
┌────────────────────────────────────────┐
│           Presentation Layer           │
│         (React Components)             │
│  - Pages (Route Components)            │
│  - Reusable Components                 │
│  - UI Primitives                       │
└────────────────┬───────────────────────┘
                 │
┌────────────────▼───────────────────────┐
│          Business Logic Layer          │
│    - Custom Hooks                      │
│    - State Management                  │
│    - Form Validation                   │
└────────────────┬───────────────────────┘
                 │
┌────────────────▼───────────────────────┐
│         Data Access Layer              │
│    - API Client (lib/api.ts)           │
│    - Authentication (lib/auth.ts)      │
│    - Local Storage Management          │
└────────────────┬───────────────────────┘
                 │
┌────────────────▼───────────────────────┐
│          External Services             │
│    - VaultScope API                    │
│    - Authentik OIDC                    │
│    - Listmonk (Optional)               │
└────────────────────────────────────────┘
```

## Core Concepts

### Single Page Application (SPA)

The storefront is a client-side rendered SPA that:
- Loads once and updates the DOM dynamically
- Uses React Router for client-side navigation
- Lazy-loads route components for performance
- Communicates with the backend API via REST

### Component-Based Architecture

```
App
├── Router
│   ├── Layout (Header, Footer)
│   └── Routes
│       ├── Home (lazy)
│       ├── Pricing (lazy)
│       ├── Infrastructure (lazy)
│       │   ├── Overview (lazy)
│       │   ├── Cloud (lazy)
│       │   └── Dedicated (lazy)
│       ├── Dashboard (lazy, protected)
│       └── ...
└── Providers
    ├── HelmetProvider (SEO)
    └── LocaleContext (i18n)
```

### Authentication Flow

```
┌────────┐                    ┌──────────┐                  ┌──────────┐
│Browser │                    │  API     │                  │Authentik │
└───┬────┘                    └────┬─────┘                  └────┬─────┘
    │                              │                             │
    │ 1. Click "Login"             │                             │
    ├─────────────────────────────>│                             │
    │ POST /api/auth/init-login    │                             │
    │                              │                             │
    │ 2. Return state token        │                             │
    │<─────────────────────────────┤                             │
    │                              │                             │
    │ 3. Redirect to Authentik     │                             │
    ├──────────────────────────────┼────────────────────────────>│
    │ with state & client_id       │                             │
    │                              │                             │
    │ 4. User authenticates        │                             │
    │<─────────────────────────────┼─────────────────────────────┤
    │                              │                             │
    │ 5. Redirect back with code   │                             │
    ├─────────────────────────────>│                             │
    │ POST /api/auth/callback      │                             │
    │ { code, state }              │                             │
    │                              │                             │
    │                              │ 6. Exchange code for token  │
    │                              ├────────────────────────────>│
    │                              │<────────────────────────────┤
    │                              │                             │
    │ 7. Return JWT + claims       │                             │
    │<─────────────────────────────┤                             │
    │                              │                             │
    │ 8. Store token & claims      │                             │
    │    in localStorage           │                             │
    │                              │                             │
```

### API Communication

#### Request Flow

All API requests go through the centralized `api` client:

```typescript
// lib/api.ts
class ApiClient {
  - Fetches CSRF token on first mutating request
  - Attaches JWT token from localStorage
  - Attaches CSRF token for POST/PUT/DELETE
  - Handles 401 by clearing auth and redirecting
  - Returns typed responses
}
```

#### CSRF Protection

- CSRF token fetched from `/api/csrf` on first mutating request
- Token included in `x-csrf-token` header
- Token validated server-side
- Protects against Cross-Site Request Forgery

#### Error Handling

```typescript
try {
  const data = await api.post('/endpoint', payload);
} catch (error) {
  // API client throws Error with message
  toast.error(error.message);
}
```

## Design Patterns

### Lazy Loading

All route components are lazy-loaded to reduce initial bundle size:

```typescript
const Home = lazy(() => import('./pages/Home'));
const Pricing = lazy(() => import('./pages/Pricing'));
```

Benefits:
- Faster initial load
- Smaller initial JavaScript bundle
- Automatic code-splitting by route

### Custom Hooks

Reusable logic is extracted into custom hooks:

```typescript
// lib/hooks.ts
export function useAuth() {
  const [claims, setClaims] = useState<AuthClaims | null>(
    getStoredClaims()
  );
  
  return { claims, isAuthenticated: !!claims };
}
```

### Context for Cross-Cutting Concerns

React Context is used for:
- **LocaleContext**: Current language and translation function
- **AuthContext**: (Future) Authentication state
- **ThemeContext**: (Future) Dark/light mode

### Composition Over Configuration

Components are composed rather than configured:

```typescript
// ✅ Good - Composition
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// ❌ Avoid - Heavy configuration
<Card
  title="Title"
  content="Content"
  headerProps={{}}
  contentProps={{}}
/>
```

## Data Flow

### Unidirectional Data Flow

```
User Action
    ↓
Event Handler
    ↓
API Request (via api.ts)
    ↓
Server Response
    ↓
State Update (useState)
    ↓
Re-render
```

### State Management Strategy

| State Type | Solution | Example |
|------------|----------|---------|
| Server Data | `useState` + `useEffect` | Product catalog, user profile |
| Form State | `useState` | Input values, validation errors |
| UI State | `useState` | Modal open/closed, selected tab |
| Global State | Context API | Authentication, locale, theme |
| URL State | React Router params/search | Filters, pagination, selected product |

## Routing

### Route Structure

```
/                           → Home
/pricing                    → Pricing
/infrastructure/overview    → Infrastructure Overview
/infrastructure/cloud       → Cloud Infrastructure
/infrastructure/dedicated   → Dedicated Servers
/about                      → About
/contact                    → Contact
/dashboard                  → Customer Dashboard (protected)

/de/*                       → German versions (same structure)
```

### Locale-Aware Routing

German routes are prefixed with `/de/`:

```typescript
// LocaleLink component automatically prefixes URLs
<LocaleLink to="/pricing">Pricing</LocaleLink>
// Renders: <a href="/de/pricing"> when locale is 'de'
```

## Security Architecture

### Defense in Depth

1. **OIDC Authentication**: Industry-standard OAuth2 flow
2. **JWT Tokens**: Signed tokens with expiration
3. **CSRF Protection**: Token-based CSRF validation
4. **CORS**: Strict origin checking (enforced by API)
5. **XSS Prevention**: React automatically escapes output
6. **Secure Storage**: Tokens in localStorage with automatic expiration
7. **HTTPS Only**: Production enforces HTTPS

### Token Management

```typescript
// Tokens stored in localStorage
localStorage.setItem('vs_token', jwt);
localStorage.setItem('vs_claims', JSON.stringify(claims));

// Automatic expiration check
const claims = getStoredClaims();
if (claims.exp * 1000 < Date.now()) {
  logout(); // Clears tokens and redirects
}
```

## Performance Considerations

### Code Splitting

- Route-based code splitting via `React.lazy()`
- Vite automatically creates optimized chunks
- Shared dependencies are extracted into common chunks

### Bundle Optimization

```bash
# Production build uses:
- Minification (Terser)
- Tree-shaking (removes unused code)
- CSS optimization (PurgeCSS via Tailwind)
- Asset compression (Gzip/Brotli)
```

### Caching Strategy

- **HTML**: No cache (always fetch latest)
- **JS/CSS**: Immutable (content-hashed filenames)
- **Images**: Long cache (content-hashed)

## Internationalization Architecture

See [I18N.md](I18N.md) for complete details.

### Translation Loading

```
App starts
    ↓
Detect locale (URL or browser)
    ↓
Load translations for locale
    ↓
Provide via Context
    ↓
Components access via useTranslation()
```

### Namespace Organization

- `common`: Shared strings
- `nav`: Navigation
- `home`: Homepage-specific
- `pricing`: Pricing page
- `infrastructure`: Infrastructure pages
- `waitlistForm`: Newsletter form

## Build System

### Vite Configuration

```typescript
// vite.config.ts
- React plugin for JSX/Fast Refresh
- Tailwind via @tailwindcss/vite
- TypeScript type checking
- Path aliases (@ for src/)
- Environment variable injection
- Production optimizations
```

### Environment Variables

Vite exposes variables prefixed with `VITE_`:

```typescript
import.meta.env.VITE_API_URL
import.meta.env.VITE_AUTHENTIK_URL
```

These are **replaced at build time**, not runtime.

## Testing Architecture

See [TESTING.md](TESTING.md) for complete details.

### Test Types

1. **Unit Tests**: Components, hooks, utilities
2. **Integration Tests**: User interactions, forms
3. **E2E Tests**: Full user flows

### Test Structure

```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx       ← Unit test
├── pages/
│   ├── Home.tsx
│   ├── Home.test.tsx         ← Unit test
│   └── Home.interaction.test.tsx ← Integration test
└── test/
    └── test-utils.tsx        ← Test helpers

e2e/
├── auth.spec.ts              ← E2E test
└── checkout.spec.ts          ← E2E test
```

## Deployment Architecture

### Production Build

```bash
npm run build
# Creates optimized bundle in dist/
```

### Deployment Options

1. **Static Hosting**: Netlify, Vercel, Cloudflare Pages
2. **Container**: Docker image with nginx
3. **CDN**: CloudFront, Fastly

### Environment-Specific Configuration

Use `.env.production` for production values:

```bash
VITE_API_URL=https://api.vaultscope.de/api
VITE_AUTHENTIK_URL=https://auth.vaultscope.de
```

## Future Considerations

### Potential Enhancements

- **Server-Side Rendering (SSR)**: For better SEO and initial load
- **Progressive Web App (PWA)**: Offline support, installability
- **State Management Library**: Redux Toolkit or Zustand for complex state
- **GraphQL**: If API evolves to GraphQL
- **Micro-frontends**: If system grows to multiple teams

### Scalability

Current architecture scales well for:
- ✅ 1,000s of concurrent users
- ✅ 100s of pages/routes
- ✅ Multiple languages
- ✅ Distributed teams

May need refactoring at:
- ⚠️ 10,000s of components
- ⚠️ Complex real-time features
- ⚠️ Heavy client-side computation
