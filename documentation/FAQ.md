# Frequently Asked Questions (FAQ)

Common questions and answers about developing with the VaultScope Storefront.

## General

### What is VaultScope?

VaultScope is a complete infrastructure management platform consisting of:
- **Storefront** (this project): Customer-facing website and dashboard
- **API (vamos)**: Backend API and provisioning engine
- **Admin (camos)**: Staff administration panel

### What tech stack does the storefront use?

- **Frontend**: React 19 + TypeScript 6
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 4
- **Routing**: React Router 7
- **Testing**: Vitest + Playwright
- **Animations**: Framer Motion
- **3D Graphics**: Three.js

### Why React instead of Next.js?

The storefront is a client-side rendered SPA because:
1. Most content is behind authentication (dashboard)
2. Real-time interactions require client-side state
3. Simpler deployment (static hosting)
4. API handles SEO-critical pages

If SEO becomes critical, we can migrate to Next.js or add SSR.

## Setup & Installation

### Why does `npm install` take so long?

The project has many dependencies including Three.js and Tailwind CSS. First install takes 2-3 minutes. Subsequent installs are faster due to npm cache.

### Can I use Yarn or pnpm?

Yes, but npm is recommended for consistency. If using pnpm:

```bash
pnpm install
pnpm dev
```

### The dev server won't start. What do I do?

1. Check port 5174 isn't already in use:
   ```bash
   netstat -ano | findstr :5174  # Windows
   lsof -ti:5174  # macOS/Linux
   ```

2. Try a different port:
   ```bash
   npm run dev -- --port 3001
   ```

3. Clear cache and reinstall:
   ```bash
   rm -rf node_modules .vite
   npm install
   ```

### How do I set up Authentik for development?

See the API documentation for Authentik setup. You need:
1. Running Authentik instance
2. OAuth2 provider configured
3. Client ID: `vaultscope-storefront`
4. Redirect URI: `http://localhost:5174/auth/callback`

## Development

### How do I add a new page?

1. Create component in `src/pages/`:
   ```typescript
   // src/pages/NewPage.tsx
   export default function NewPage() {
     return <div>New Page</div>;
   }
   ```

2. Add route in `src/App.tsx`:
   ```typescript
   const NewPage = lazy(() => import('./pages/NewPage'));
   
   <Route path="/new-page" element={<NewPage />} />
   <Route path="/de/new-page" element={<NewPage />} />
   ```

3. Add navigation link:
   ```typescript
   <LocaleLink to="/new-page">New Page</LocaleLink>
   ```

### How do I add a translation?

1. Add to English: `src/i18n/locales/en/common.ts`
2. Add to German: `src/i18n/locales/de/common.ts`
3. Use in component:
   ```typescript
   const t = useTranslation('common');
   <span>{t('myNewKey')}</span>
   ```

See [I18N.md](I18N.md) for details.

### How do I call the API?

Use the centralized API client:

```typescript
import { api } from '../lib/api';

const products = await api.get<Product[]>('/storefront/catalog');
```

See [API_INTEGRATION.md](API_INTEGRATION.md) for details.

### How do I protect a route?

Wrap it in a ProtectedRoute component:

```typescript
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

### Why are there so many test files?

We use multiple test types:
- `*.test.tsx`: Unit tests
- `*.interaction.test.tsx`: Integration tests
- `e2e/*.spec.ts`: End-to-end tests

This ensures comprehensive coverage. See [TESTING.md](TESTING.md).

## Authentication

### Why use OIDC instead of custom auth?

OIDC provides:
- Industry-standard security
- Single Sign-On capability
- Centralized user management
- MFA support (via Authentik)

### Where are tokens stored?

JWT tokens are in `localStorage`:
- `vs_token`: The JWT token
- `vs_claims`: Parsed claims (user info)

### How long do tokens last?

Default: 1 hour. Configured in the API. After expiration, users must re-authenticate.

### Can I implement "remember me"?

Not currently. This would require refresh tokens, which need API support.

### How do I test authentication locally?

You need:
1. Running VaultScope-API
2. Running Authentik instance
3. Valid user account in Authentik

Or mock authentication in tests:

```typescript
vi.mock('../lib/auth', () => ({
  isAuthenticated: vi.fn(() => true),
  getStoredClaims: vi.fn(() => mockClaims),
}));
```

## API Integration

### Why do I get CORS errors?

Ensure the API's `CORS_ORIGINS` includes your dev server:

```bash
# In VaultScope-API .env
CORS_ORIGINS=http://localhost:5174,http://localhost:5173
```

### Why do I get CSRF errors?

The API client fetches CSRF tokens automatically. If failing:
1. Check API `/api/csrf` endpoint is accessible
2. Verify Redis is running (API stores CSRF tokens there)
3. Ensure cookies are being sent (`credentials: 'include'`)

### How do I test without the API?

Mock API responses in tests:

```typescript
vi.mock('../lib/api', () => ({
  api: {
    get: vi.fn().mockResolvedValue(mockData),
    post: vi.fn().mockResolvedValue(mockResponse),
  },
}));
```

For development, you can create a mock API server.

### Why are API calls slow?

Check:
1. API server is running and accessible
2. Network tab in DevTools for actual request time
3. Database query performance (API side)
4. No unnecessary waterfall requests

## Styling

### Why use Tailwind instead of CSS Modules?

Tailwind provides:
- Consistent design system
- Faster development (no context switching)
- Smaller bundle size (PurgeCSS removes unused styles)
- Great responsive/dark mode utilities

### How do I customize colors?

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#3b82f6',
        // ... more shades
      },
    },
  },
},
```

### Can I use CSS-in-JS?

You can, but Tailwind is preferred for consistency. If you need dynamic styles:

```typescript
<div style={{ width: `${progress}%` }}>
```

### How do I handle dark mode?

Not currently implemented. To add:

1. Enable in Tailwind config:
   ```javascript
   darkMode: 'class',
   ```

2. Use dark variants:
   ```tsx
   <div className="bg-white dark:bg-gray-900">
   ```

## Testing

### Tests are slow. How do I speed them up?

1. Run specific test:
   ```bash
   npx vitest run src/components/Button.test.tsx
   ```

2. Run in parallel (default):
   ```bash
   npx vitest run --poolOptions.threads.singleThread=false
   ```

3. Skip E2E tests during development:
   ```bash
   npm test  # Unit tests only
   ```

### How do I debug a failing test?

```bash
# Run with UI
npx vitest --ui

# Run in watch mode
npx vitest --watch

# For Playwright
npx playwright test --debug
```

### Tests pass locally but fail in CI. Why?

Common causes:
1. **Timing issues**: Add `waitFor()` for async operations
2. **Environment differences**: Check Node/browser versions
3. **Flaky tests**: Add retries in `playwright.config.ts`
4. **Missing dependencies**: Ensure CI installs all deps

## Deployment

### How do I build for production?

```bash
npm run build
```

Output is in `dist/` directory.

### Where can I deploy?

- **Static hosting**: Netlify, Vercel, Cloudflare Pages
- **Container**: Docker + any container host
- **CDN**: CloudFront, Fastly
- **VPS**: nginx or Apache

See [DEPLOYMENT.md](DEPLOYMENT.md).

### Do environment variables work after build?

**No!** Vite replaces `import.meta.env.VITE_*` at **build time**. You need separate builds for each environment:

```bash
# Production build
npm run build

# Staging build (with staging .env)
cp .env.staging .env
npm run build
```

### How do I enable HTTPS in development?

```bash
# Generate certificate
mkcert localhost

# Update vite.config.ts
server: {
  https: {
    key: './localhost-key.pem',
    cert: './localhost.pem',
  },
}
```

## Performance

### Why is the initial load slow?

1. **Development mode**: Use production build for real performance
2. **Large bundles**: Check bundle analyzer
3. **Network**: Check API response times
4. **Images**: Optimize images (WebP, proper sizing)

### How do I analyze bundle size?

```bash
npm run build
npx vite-bundle-visualizer
```

### Why is Three.js bundle so large?

Three.js is ~500kb minified. If not using 3D features:
1. Remove Three.js import
2. Remove 3D components
3. Remove from dependencies

### How do I optimize images?

1. Use WebP format
2. Provide multiple sizes
3. Lazy load below-the-fold images
4. Use CDN for large images

## Troubleshooting

### I see "Failed to fetch" errors

1. Check API is running: `curl http://localhost:3000/api/health`
2. Check `VITE_API_URL` in `.env`
3. Check CORS configuration
4. Check browser console for exact error

### Authentication redirects in a loop

1. Clear localStorage: `localStorage.clear()`
2. Check `VITE_OIDC_REDIRECT_URI` matches exactly
3. Check Authentik redirect URI configuration
4. Check for JavaScript errors in console

### Styles aren't applying

1. Check Tailwind is imported in `index.css`
2. Check class names are correct
3. Clear browser cache
4. Restart dev server

### TypeScript errors everywhere

1. Check TypeScript version: `npx tsc --version`
2. Clear TypeScript cache:
   ```bash
   rm -rf node_modules/.vite
   ```
3. Reinstall dependencies: `npm install`

## Contributing

### How do I contribute?

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

### What's the coding standard?

- TypeScript strict mode
- Functional components + hooks
- Tailwind for styling
- Tests for new features
- Follow existing patterns

### How do I report a bug?

Open an issue on [GitHub](https://github.com/VaultScope/website/issues) with:
1. Description of the bug
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots if applicable
5. Browser/OS information

## Getting Help

### Where can I get help?

- **Documentation**: Check `/documentation` folder
- **GitHub Issues**: [github.com/VaultScope/website/issues](https://github.com/VaultScope/website/issues)
- **Email**: support@vaultscope.de

### How do I request a feature?

Open a GitHub issue with the "feature request" label describing:
1. What you want to achieve
2. Why it's valuable
3. How you envision it working

## Related Documentation

- [Getting Started](GETTING_STARTED.md)
- [Development Guide](DEVELOPMENT.md)
- [Architecture](ARCHITECTURE.md)
- [API Integration](API_INTEGRATION.md)
- [Testing](TESTING.md)
- [Deployment](DEPLOYMENT.md)
