# Configuration Guide

This document covers all configuration options for the VaultScope Storefront.

## Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the application.

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | VaultScope API base URL | `http://localhost:3000/api` |
| `VITE_AUTHENTIK_URL` | Authentik OIDC provider URL | `https://auth.vaultscope.de` |
| `VITE_OIDC_CLIENT_ID` | OIDC client ID for storefront | `vaultscope-storefront` |
| `VITE_OIDC_REDIRECT_URI` | OAuth2 callback URL | `http://localhost:5174/auth/callback` |

### Optional Variables

| Variable | Description | Example | Default |
|----------|-------------|---------|---------|
| `VITE_LISTMONK_URL` | Newsletter service URL | `https://newsletter.vaultscope.de` | - |
| `VITE_LISTMONK_LIST_UUID` | Newsletter list UUID | `abc-123-def-456` | - |

## Environment Files

### Development (`.env`)

```bash
VITE_API_URL=http://localhost:3000/api
VITE_AUTHENTIK_URL=https://auth.vaultscope.de
VITE_OIDC_CLIENT_ID=vaultscope-storefront
VITE_OIDC_REDIRECT_URI=http://localhost:5174/auth/callback
```

### Production (`.env.production`)

```bash
VITE_API_URL=https://api.vaultscope.de/api
VITE_AUTHENTIK_URL=https://auth.vaultscope.de
VITE_OIDC_CLIENT_ID=vaultscope-storefront
VITE_OIDC_REDIRECT_URI=https://vaultscope.de/auth/callback
VITE_LISTMONK_URL=https://newsletter.vaultscope.de
VITE_LISTMONK_LIST_UUID=abc-123-def-456
```

### Environment Priority

Vite loads environment files in this order:

1. `.env.production.local` (production build only, git-ignored)
2. `.env.production` (production build only)
3. `.env.local` (git-ignored)
4. `.env`

## Build Configuration

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  
  // Path aliases
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  
  // Dev server configuration
  server: {
    port: 5174,
    host: true, // Listen on all addresses
    cors: true,
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: false, // Enable for debugging
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          three: ['three'],
        },
      },
    },
  },
  
  // Test configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
```

### TypeScript Configuration

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ... custom color scale
          950: '#172554',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:5174',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5174',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Runtime Configuration

### API Client

Configure API client in `src/lib/api.ts`:

```typescript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Timeout configuration
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
```

### Authentication

Configure in `src/lib/auth.ts`:

```typescript
const AUTHENTIK_URL = import.meta.env.VITE_AUTHENTIK_URL || 'https://auth.vaultscope.de';
const CLIENT_ID = import.meta.env.VITE_OIDC_CLIENT_ID || 'vaultscope-storefront';
const REDIRECT_URI = import.meta.env.VITE_OIDC_REDIRECT_URI || `${window.location.origin}/auth/callback`;

// Token expiration buffer (logout 5 minutes before actual expiration)
const EXPIRATION_BUFFER = 5 * 60; // 5 minutes in seconds
```

## Docker Configuration

### Dockerfile

```dockerfile
# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache HTML
    location ~* \.html$ {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  storefront:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=https://api.vaultscope.de/api
      - VITE_AUTHENTIK_URL=https://auth.vaultscope.de
      - VITE_OIDC_CLIENT_ID=vaultscope-storefront
      - VITE_OIDC_REDIRECT_URI=https://vaultscope.de/auth/callback
    restart: unless-stopped
```

## Performance Tuning

### Code Splitting

Vite automatically splits code by route. Configure manual chunks:

```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'ui-vendor': ['framer-motion', 'lucide-react'],
        'three-vendor': ['three'],
      },
    },
  },
},
```

### Asset Optimization

```typescript
// vite.config.ts
build: {
  assetsInlineLimit: 4096, // Inline assets < 4kb as base64
  cssCodeSplit: true, // Split CSS by chunk
},
```

### Lazy Loading Routes

```typescript
// Ensure all routes use lazy loading
const Home = lazy(() => import('./pages/Home'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

## Security Configuration

### Content Security Policy

Add CSP headers in nginx:

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.vaultscope.de https://auth.vaultscope.de; font-src 'self' data:;" always;
```

### CORS

CORS is handled by the API. Ensure storefront origin is in API `CORS_ORIGINS`:

```bash
# In VaultScope-API .env
CORS_ORIGINS=http://localhost:5174,https://vaultscope.de
```

## Monitoring & Logging

### Error Tracking (Future)

Add Sentry:

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 0.1,
});
```

### Analytics (Future)

Add analytics:

```typescript
// src/lib/analytics.ts
const ANALYTICS_ID = import.meta.env.VITE_GA_ID;

if (ANALYTICS_ID) {
  // Initialize Google Analytics or Plausible
}
```

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
npm install
npm run build
```

### Environment Variables Not Working

Remember:
1. Must be prefixed with `VITE_`
2. Must be set at **build time**, not runtime
3. Restart dev server after changing `.env`

### Port Conflicts

Change dev server port:

```bash
# In package.json
"dev": "vite --port 3001"

# Or via CLI
npm run dev -- --port 3001
```

## Related Documentation

- [Vite Configuration](https://vite.dev/config/)
- [TypeScript Configuration](https://www.typescriptlang.org/tsconfig)
- [Tailwind Configuration](https://tailwindcss.com/docs/configuration)
- [Playwright Configuration](https://playwright.dev/docs/test-configuration)
