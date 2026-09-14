# Development Guide

This guide covers development workflows, best practices, and conventions for the VaultScope Storefront.

## Development Environment

### Recommended IDE Setup

- **VS Code** with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features
  - React Developer Tools

- **WebStorm** or **IntelliJ IDEA Ultimate** also work well

### Browser DevTools

Install these browser extensions for better development experience:

- **React DevTools** - Inspect React component hierarchy
- **Redux DevTools** (if using Redux)
- **Lighthouse** - Performance auditing

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Shared.tsx      # Shared utilities and components
│   ├── Toast.tsx       # Toast notification system
│   └── WaitlistForm.tsx # Newsletter signup form
├── i18n/               # Internationalization
│   ├── locales/        # Translation files
│   │   ├── de/         # German translations
│   │   └── en/         # English translations
│   └── AGENTS.md       # I18n system documentation
├── lib/                # Core utilities
│   ├── api.ts          # API client with CSRF protection
│   ├── auth.ts         # Authentication utilities
│   ├── hooks.ts        # Custom React hooks
│   └── types.ts        # TypeScript type definitions
├── pages/              # Route components (lazy-loaded)
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Pricing.tsx
│   └── ...
├── test/               # Test utilities and setup
│   └── test-utils.tsx  # Testing library setup
├── App.tsx             # Main application component
├── index.css           # Global styles (Tailwind)
└── main.tsx            # Application entry point
```

## Coding Standards

### TypeScript

- **Strict mode enabled**: All code must pass TypeScript strict checks
- **Explicit types**: Prefer explicit type annotations for function signatures
- **Avoid `any`**: Use `unknown` if the type is truly unknown, then narrow it

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  role: string;
}

function getUser(id: string): Promise<User> {
  return api.get<User>(`/users/${id}`);
}

// ❌ Bad
function getUser(id: any): Promise<any> {
  return api.get(`/users/${id}`);
}
```

### React Components

- **Functional components only**: No class components
- **Hooks**: Use React 19 hooks
- **Lazy loading**: Pages must be lazy-loaded via `React.lazy()`
- **Props interface**: Every component with props must have an interface

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={variant === 'primary' ? 'btn-primary' : 'btn-secondary'}>
      {label}
    </button>
  );
}

// ❌ Bad
export function Button(props: any) {
  return <button {...props}>{props.label}</button>;
}
```

### Styling

- **Tailwind first**: Use Tailwind utility classes
- **clsx for conditionals**: Use `clsx` with `tailwind-merge` for conditional classes
- **No inline styles**: Avoid `style` prop unless absolutely necessary
- **Responsive**: Mobile-first approach

```tsx
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...classes: (string | boolean | undefined)[]) => twMerge(clsx(classes));

// ✅ Good
<div className={cn(
  'px-4 py-2 rounded-lg',
  isActive && 'bg-blue-500 text-white',
  !isActive && 'bg-gray-200 text-gray-700'
)}>
  Content
</div>

// ❌ Bad
<div style={{ padding: '8px 16px', borderRadius: '8px', ...activeStyles }}>
  Content
</div>
```

## State Management

### Local State

Use React hooks for component-level state:

```typescript
const [isOpen, setIsOpen] = useState(false);
const [data, setData] = useState<User | null>(null);
```

### Shared State

For state shared across routes, use:
- **Context API**: For authentication state, theme, locale
- **URL params**: For filters, pagination, search

### Server State

API data is fetched and cached using standard fetch with `React.use()` or effects:

```typescript
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  api.get<Product[]>('/products')
    .then(setProducts)
    .finally(() => setLoading(false));
}, []);
```

## API Integration

See [API_INTEGRATION.md](API_INTEGRATION.md) for detailed API integration patterns.

### API Client

Always use the centralized `api` client from `lib/api.ts`:

```typescript
import { api } from '../lib/api';

// GET request
const products = await api.get<Product[]>('/storefront/catalog');

// POST request
const order = await api.post<Order>('/storefront/orders', {
  productId: '123',
  quantity: 1
});
```

The API client automatically handles:
- CSRF token fetching and inclusion
- JWT token authentication
- Error handling and 401 redirects
- JSON serialization

## Internationalization

See [I18N.md](I18N.md) for comprehensive i18n documentation.

### Using Translations

```typescript
import { useTranslation } from '../i18n/useTranslation';

function MyComponent() {
  const t = useTranslation('common');
  
  return <h1>{t('welcome')}</h1>;
}
```

### Adding Translations

1. Add keys to `src/i18n/locales/en/<namespace>.ts`
2. Add German translations to `src/i18n/locales/de/<namespace>.ts`
3. Use the translation in your component

## Testing

See [TESTING.md](TESTING.md) for comprehensive testing guide.

### Unit Tests

```bash
npm test
```

Place tests next to the component:
```
src/components/
  ├── Button.tsx
  └── Button.test.tsx
```

### E2E Tests

```bash
npx playwright test
```

Place E2E tests in `e2e/`:
```
e2e/
  ├── auth.spec.ts
  ├── checkout.spec.ts
  └── navigation.spec.ts
```

## Git Workflow

### Branch Naming

- `main` - Production-ready code
- `dev` - Development branch
- `feature/<name>` - New features
- `fix/<name>` - Bug fixes
- `docs/<name>` - Documentation changes

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user profile page
fix: resolve authentication redirect loop
docs: update API integration guide
chore: upgrade dependencies
test: add tests for checkout flow
```

### Pull Request Process

1. Create feature branch from `dev`
2. Make your changes
3. Ensure tests pass: `npm test`
4. Ensure linting passes: `npm run lint`
5. Create PR to `dev` branch
6. Request review
7. Merge after approval

## Performance Optimization

### Lazy Loading

All route components are lazy-loaded:

```typescript
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
```

### Code Splitting

Vite automatically code-splits:
- Each route is a separate chunk
- Dependencies are shared via intelligent chunking
- Use dynamic imports for large libraries

### Image Optimization

- Use WebP format with PNG/JPG fallbacks
- Provide multiple sizes for responsive images
- Lazy load images below the fold

### Bundle Analysis

```bash
npm run build
npx vite-bundle-visualizer
```

## Debugging

### Development Tools

```typescript
// Check authentication state
console.log('Auth:', getStoredClaims());

// Check API base URL
console.log('API:', import.meta.env.VITE_API_URL);
```

### Common Issues

1. **CORS errors**: Ensure API CORS_ORIGINS includes dev server
2. **Auth failures**: Check Authentik redirect URI matches exactly
3. **Build errors**: Clear cache and rebuild
   ```bash
   rm -rf node_modules .vite dist
   npm install
   npm run build
   ```

## Hot Tips

- Use `React.memo()` for expensive components
- Debounce search inputs
- Use `useCallback` and `useMemo` judiciously (measure first!)
- Keep components small and focused
- Test edge cases: empty states, loading states, error states

## Resources

- [React 19 Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
