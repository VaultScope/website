# VaultScope Storefront E2E Tests

Comprehensive Playwright test suite for the VaultScope customer-facing storefront.

## Prerequisites

- Docker containers running (see `docker-compose.full-stack.yml`)
- Services accessible at:
  - Storefront: http://localhost:3000
  - Authentik: http://localhost:9000
  - API: http://localhost:8000

## Installation

```bash
# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install chromium
```

## Running Tests

```bash
# Run all tests
npm run test:e2e

# Run specific test file
npx playwright test e2e/storefront-public.spec.ts

# Run with UI mode (visual test runner)
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific test by name
npx playwright test -g "homepage loads"
```

## Test Coverage

### storefront-public.spec.ts
- ✅ Homepage loads
- ✅ All public pages (pricing, about, contact, infrastructure)
- ✅ German locale pages (/de/*)
- ✅ Navigation between pages
- ✅ Language switcher

### storefront-auth.spec.ts
- ✅ Customer login flow (OIDC redirect to Authentik)
- ✅ Profile onboarding form submission
- ✅ Dashboard loads after login
- ✅ User email displayed correctly
- ✅ Logout functionality

## Test Users

```
Customer: customer1 / Customer123!
```

## Viewing Results

```bash
# Open HTML report
npx playwright show-report

# View traces for failed tests
npx playwright show-trace trace.zip
```

## CI Integration

```yaml
# Example GitHub Actions
- name: Run E2E tests
  run: npm run test:e2e
```

## Troubleshooting

**Tests timeout:** Ensure Docker containers are running
**Auth fails:** Check Authentik is accessible at localhost:9000
**Navigation fails:** Clear browser state between test runs

## Writing New Tests

See existing tests for patterns. Key helpers:
- Use `.or()` to handle conditional UI elements
- Use `.catch(() => false)` to safely check visibility
- Always wait for navigation with `page.waitForURL()`
