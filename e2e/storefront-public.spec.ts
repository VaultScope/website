import { test, expect } from '@playwright/test';

/**
 * Test 1: Storefront Public Pages
 * Verifies all public pages load without authentication
 */

test.describe('Storefront Public Pages', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/VaultScope/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('pricing page loads', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('body')).toBeVisible();
    // Should not show 404 or error
    await expect(page.locator('text=404')).not.toBeVisible();
  });

  test('about page loads', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('body')).toBeVisible();
  });

  test('contact page loads', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('body')).toBeVisible();
  });

  test('infrastructure overview loads', async ({ page }) => {
    await page.goto('/infrastructure');
    await expect(page.locator('body')).toBeVisible();
  });

  test('infrastructure cloud page loads', async ({ page }) => {
    await page.goto('/infrastructure/cloud');
    await expect(page.locator('body')).toBeVisible();
  });

  test('infrastructure dedicated page loads', async ({ page }) => {
    await page.goto('/infrastructure/dedicated');
    await expect(page.locator('body')).toBeVisible();
  });

  test('German homepage loads', async ({ page }) => {
    await page.goto('/de/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('German pricing page loads', async ({ page }) => {
    await page.goto('/de/pricing');
    await expect(page.locator('body')).toBeVisible();
  });

  test('navigation works', async ({ page }) => {
    await page.goto('/');

    // Click Infrastructure dropdown to open it
    const infraMenu = page.locator('text=Infrastructure').first();
    await infraMenu.click();

    // Wait for dropdown to appear and click pricing
    await page.waitForTimeout(300);
    const pricingLink = page.locator('text=Pricing').first();
    await pricingLink.click();

    await expect(page).toHaveURL(/.*pricing/);
  });

  test('language switcher works', async ({ page }) => {
    await page.goto('/');

    // Find and click language switcher button (shows "DE" when in English mode)
    const languageSwitcher = page.locator('button:has-text("DE")').first();
    await expect(languageSwitcher).toBeVisible();
    await languageSwitcher.click();

    // Wait for content to update
    await page.waitForTimeout(1000);

    // Verify German content is now displayed (header menu)
    await expect(page.locator('text=Infrastruktur').first()).toBeVisible();

    // Verify language button now shows "EN" (meaning we're in German mode)
    await expect(page.locator('button:has-text("EN")').first()).toBeVisible();

    // Verify contact button in header is in German
    await expect(page.locator('button:has-text("KONTAKT")').first()).toBeVisible();
  });
});
