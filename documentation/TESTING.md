# Testing Guide

This document covers testing strategies, conventions, and best practices for the VaultScope Storefront.

## Testing Stack

- **Unit Testing**: Vitest + React Testing Library
- **E2E Testing**: Playwright
- **Assertion Library**: Built into Vitest
- **Test Utilities**: Custom test-utils with providers

## Test Types

### 1. Unit Tests

Test individual components and functions in isolation.

**Location**: Next to the file being tested

```
src/components/
├── Button.tsx
└── Button.test.tsx

src/lib/
├── auth.ts
└── auth.test.ts
```

**Example**:

```typescript
// Button.test.tsx
import { render, screen } from '../test/test-utils';
import { Button } from './Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button label="Click" onClick={onClick} />);
    
    screen.getByText('Click').click();
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

### 2. Integration Tests

Test user interactions and component integration.

**Location**: `*.interaction.test.tsx` next to the component

```
src/pages/
├── Contact.tsx
├── Contact.test.tsx              # Unit test
└── Contact.interaction.test.tsx   # Integration test
```

**Example**:

```typescript
// Contact.interaction.test.tsx
import { render, screen, waitFor } from '../test/test-utils';
import userEvent from '@testing-library/user-event';
import { Contact } from './Contact';

describe('Contact Form Integration', () => {
  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello!');
    
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/message sent/i)).toBeInTheDocument();
    });
  });

  it('shows validation errors', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });
});
```

### 3. E2E Tests

Test complete user flows in a real browser.

**Location**: `e2e/` directory

```
e2e/
├── auth.spec.ts
├── checkout.spec.ts
└── navigation.spec.ts
```

**Example**:

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('user can log in', async ({ page }) => {
    await page.goto('/');
    
    await page.click('text=Login');
    
    // Should redirect to Authentik
    await expect(page).toHaveURL(/auth\.vaultscope\.de/);
    
    // Fill credentials
    await page.fill('input[name="username"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'testpassword');
    await page.click('button[type="submit"]');
    
    // Should redirect back and show dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('text=Welcome')).toBeVisible();
  });
});
```

## Running Tests

### Unit & Integration Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npx vitest run src/components/Button.test.tsx

# Run tests matching pattern
npx vitest run --grep "Button"
```

### E2E Tests

```bash
# Run all E2E tests
npx playwright test

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific test file
npx playwright test e2e/auth.spec.ts

# Run in UI mode (interactive)
npx playwright test --ui

# Run with specific browser
npx playwright test --project=chromium
```

## Test Utilities

### Custom Render Function

```typescript
// src/test/test-utils.tsx
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { LocaleProvider } from '../i18n/context';

function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <LocaleProvider locale="en">
          {children}
        </LocaleProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Mocking API Calls

```typescript
import { vi } from 'vitest';
import * as apiModule from '../lib/api';

// Mock the entire API module
vi.mock('../lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// In test
const mockApi = apiModule.api as any;

mockApi.get.mockResolvedValue([
  { id: '1', name: 'Product 1' },
  { id: '2', name: 'Product 2' },
]);
```

### Mocking Authentication

```typescript
import * as authModule from '../lib/auth';

vi.mock('../lib/auth', () => ({
  isAuthenticated: vi.fn(() => true),
  getStoredClaims: vi.fn(() => ({
    sub: 'user_123',
    email: 'test@example.com',
    role: 'customer',
    audience: 'storefront',
    exp: Date.now() / 1000 + 3600,
    iat: Date.now() / 1000,
  })),
}));
```

## Writing Good Tests

### 1. Test User Behavior, Not Implementation

```typescript
// ✅ Good - Tests what user sees
it('shows welcome message after login', async () => {
  render(<Dashboard />);
  await waitFor(() => {
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });
});

// ❌ Bad - Tests implementation details
it('sets state after login', () => {
  const { result } = renderHook(() => useAuth());
  act(() => {
    result.current.setIsLoggedIn(true);
  });
  expect(result.current.isLoggedIn).toBe(true);
});
```

### 2. Use Accessible Queries

Prefer queries that match how users interact:

```typescript
// ✅ Best - Accessible to screen readers
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText(/email/i)
screen.getByText(/welcome/i)

// ⚠️ OK - But less accessible
screen.getByTestId('submit-button')

// ❌ Avoid - Implementation detail
screen.getByClassName('btn-primary')
```

### 3. Test Edge Cases

```typescript
describe('Form Validation', () => {
  it('accepts valid email', () => {
    // Test happy path
  });

  it('rejects invalid email format', () => {
    // Test validation
  });

  it('handles empty email', () => {
    // Test required field
  });

  it('trims whitespace', () => {
    // Test edge case
  });

  it('handles very long email', () => {
    // Test limits
  });
});
```

### 4. Arrange-Act-Assert Pattern

```typescript
it('creates order successfully', async () => {
  // Arrange
  const mockProduct = { id: '1', name: 'VPS Basic', price: 5.99 };
  mockApi.get.mockResolvedValue([mockProduct]);
  mockApi.post.mockResolvedValue({ id: 'order_123', status: 'pending' });

  render(<ProductPage />);

  // Act
  await userEvent.click(screen.getByText('Order Now'));
  await userEvent.click(screen.getByText('Confirm'));

  // Assert
  await waitFor(() => {
    expect(screen.getByText(/order created/i)).toBeInTheDocument();
  });
});
```

### 5. Clean Up After Tests

```typescript
afterEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});
```

## Testing Patterns

### Testing Async Components

```typescript
it('loads products from API', async () => {
  mockApi.get.mockResolvedValue([
    { id: '1', name: 'Product 1' },
  ]);

  render(<ProductList />);

  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  expect(screen.getByText('Product 1')).toBeInTheDocument();
});
```

### Testing Error States

```typescript
it('shows error message on API failure', async () => {
  mockApi.get.mockRejectedValue(new Error('Network error'));

  render(<ProductList />);

  await waitFor(() => {
    expect(screen.getByText(/error loading products/i)).toBeInTheDocument();
  });
});
```

### Testing Forms

```typescript
it('validates form before submission', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  render(<ContactForm onSubmit={onSubmit} />);

  // Submit empty form
  await user.click(screen.getByRole('button', { name: /submit/i }));

  // Should show errors
  expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  
  // Should not call onSubmit
  expect(onSubmit).not.toHaveBeenCalled();
});
```

### Testing Protected Routes

```typescript
it('redirects to home when not authenticated', () => {
  vi.mocked(isAuthenticated).mockReturnValue(false);

  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/welcome to vaultscope/i)).toBeInTheDocument();
  expect(screen.queryByText(/dashboard/i)).not.toBeInTheDocument();
});
```

## Code Coverage

### Running Coverage

```bash
npm run test:coverage
```

### Coverage Thresholds

Current thresholds in `vite.config.ts`:

```typescript
test: {
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html', 'lcov'],
    thresholds: {
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
  },
},
```

### Viewing Coverage Report

After running coverage:

```bash
open coverage/index.html
```

## E2E Test Best Practices

### 1. Use Page Object Model

```typescript
// e2e/pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
    await this.page.click('text=Login');
  }

  async login(email: string, password: string) {
    await this.page.fill('input[name="username"]', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }

  async isLoggedIn() {
    return await this.page.locator('text=Welcome').isVisible();
  }
}

// In test
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.login('test@example.com', 'password');
expect(await loginPage.isLoggedIn()).toBe(true);
```

### 2. Use Fixtures for Test Data

```typescript
// e2e/fixtures.ts
export const testUser = {
  email: 'test@example.com',
  password: 'TestPassword123!',
};

export const testProduct = {
  id: 'prod_test_vps',
  name: 'Test VPS',
  price: 5.99,
};
```

### 3. Use beforeEach for Setup

```typescript
test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.click('text=Login');
    // ... complete login flow ...
  });

  test('shows user services', async ({ page }) => {
    // Test starts from dashboard
    await expect(page.locator('text=My Services')).toBeVisible();
  });
});
```

## Continuous Integration

### Running Tests in CI

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 22
      
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 22
      
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npx playwright test
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Debugging Tests

### Debug Unit Tests

```bash
# Run with Node debugger
node --inspect-brk ./node_modules/.bin/vitest run

# Then open chrome://inspect in Chrome
```

### Debug E2E Tests

```bash
# Run in headed mode with slow motion
npx playwright test --headed --slow-mo=1000

# Run with Playwright Inspector
npx playwright test --debug

# Take screenshots on failure (automatic)
npx playwright test
# Screenshots saved to test-results/
```

## Common Testing Pitfalls

### 1. Forgetting to await

```typescript
// ❌ Bad - Missing await
it('loads data', () => {
  render(<MyComponent />);
  expect(screen.getByText('Data')).toBeInTheDocument(); // Fails!
});

// ✅ Good - With await
it('loads data', async () => {
  render(<MyComponent />);
  await waitFor(() => {
    expect(screen.getByText('Data')).toBeInTheDocument();
  });
});
```

### 2. Not Cleaning Up Mocks

```typescript
// ❌ Bad - Mocks leak between tests
beforeAll(() => {
  vi.mock('../lib/api');
});

// ✅ Good - Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});
```

### 3. Testing Implementation Details

```typescript
// ❌ Bad - Tests state directly
expect(component.state.isLoading).toBe(true);

// ✅ Good - Tests what user sees
expect(screen.getByText(/loading/i)).toBeInTheDocument();
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
