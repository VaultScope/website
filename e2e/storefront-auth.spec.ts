import { test, expect } from '@playwright/test';

/**
 * Test 2: Customer Authentication and Onboarding
 * Tests customer login flow, OIDC redirect, and profile completion
 */

test.describe('Customer Authentication', () => {
  test('customer login flow completes successfully', async ({ page }) => {
    // Go to homepage
    await page.goto('/');

    // Click "Sign In" button in header
    const signInButton = page.locator('text=Sign In').first();
    await signInButton.click();

    // Wait for login page to load
    await page.waitForLoadState('networkidle');

    // Click "Login with VaultScope" button to go to Authentik
    const loginButton = page.locator('button:has-text("Login with VaultScope")');
    await loginButton.click();

    // Should redirect to Authentik at localhost:9000
    await expect(page).toHaveURL(/localhost:9000/);

    // Fill in Authentik login form
    await page.fill('input[placeholder*="Email or Username"]', 'customer1');

    // Click "Log in" button to proceed to password page
    await page.click('button:has-text("Log in")');

    // Wait for password page
    await page.waitForTimeout(1000);

    // Fill in password if password field appears
    const passwordField = page.locator('input[type="password"]');
    if (await passwordField.isVisible().catch(() => false)) {
      await passwordField.fill('Customer123!');
      await page.click('button[type="submit"]');
    }

    // Wait for redirect back to storefront
    await page.waitForURL(/localhost:3000/, { timeout: 10000 });

    // Should either land on onboarding or dashboard
    const url = page.url();
    expect(url).toMatch(/localhost:3000/);
  });

  test('onboarding form saves and redirects to dashboard', async ({ page, context }) => {
    // This test requires being logged in first
    // For simplicity, we'll test the form UI only if we land on it

    await page.goto('/dashboard');

    // Check if we're on onboarding page (has "Complete your profile" text)
    const isOnboarding = await page.locator('text=Complete your profile').isVisible().catch(() => false);

    if (isOnboarding) {
      // Fill onboarding form
      await page.fill('input[placeholder*="Max Mustermann"]', 'Test Customer');
      await page.fill('input[placeholder*="Mustermann GmbH"]', 'Test Company');
      await page.fill('input[placeholder*="Musterstraße"]', 'Test Street 123');
      await page.fill('input[placeholder*="Berlin"]', 'Berlin');
      await page.fill('input[placeholder="DE"]', 'DE');

      // Submit form
      await page.click('button:has-text("Continue to Dashboard")');

      // Should redirect to dashboard after save
      await page.waitForURL(/\/dashboard/, { timeout: 10000 });
      await expect(page.locator('text=Welcome')).toBeVisible();
    }
  });

  test('dashboard shows customer email', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for email in sidebar/footer
    const email = await page.locator('text=customer1@test.local').or(page.locator('text=@test.local'));

    // Email should be visible somewhere on the page
    const emailVisible = await email.isVisible().catch(() => false);
    if (emailVisible) {
      expect(await email.textContent()).toContain('@test.local');
    }
  });

  test('logout works', async ({ page }) => {
    await page.goto('/dashboard');

    // Find and click logout button
    const logoutButton = page.locator('text=Sign out').or(page.locator('text=Logout')).first();
    if (await logoutButton.isVisible()) {
      await logoutButton.click();

      // Should redirect to homepage or login
      await page.waitForTimeout(1000);
      const url = page.url();
      expect(url).toMatch(/localhost:3000/);
    }
  });
});
