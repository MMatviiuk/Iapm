/**
 * E2E TEST: Medication Flow
 * Tests complete user journey from registration to adding medication
 */

import { test, expect } from '@playwright/test';

test.describe('Medication Flow - Patient Role', () => {
  test.beforeEach(async ({ page }) => {
    // Start from landing page
    await page.goto('/');
  });

  test('User can register, add medication, and mark as taken', async ({ page }) => {
    // 1. Click Sign Up
    await page.click('text=Sign Up');
    await expect(page).toHaveURL(/.*signup/);

    // 2. Select Patient role
    await page.click('[data-testid="role-patient"]');

    // 3. Fill registration form
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Test');
    await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'SecurePass123!');

    // 4. Submit registration
    await page.click('button:has-text("Create Account")');

    // 5. Wait for dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Dashboard');

    // 6. Click Add Medication
    await page.click('button:has-text("Add Medication")');

    // 7. Fill medication form - Step 1: Essential Info
    await page.fill('input[name="name"]', 'Aspirin');
    await page.fill('input[name="dosage"]', '100mg');
    await page.selectOption('select[name="form"]', 'Tablets');
    await page.fill('input[name="quantity"]', '1');

    // Next to Step 2
    await page.click('button:has-text("Next")');

    // 8. Fill Step 2: When to Take
    await page.selectOption('select[name="frequency"]', 'once daily');
    await page.fill('input[name="time"]', '08:00');
    await page.selectOption('select[name="mealTiming"]', 'with meal');

    // Next to Step 3
    await page.click('button:has-text("Next")');

    // 9. Step 3: Optional - Can skip or fill
    await page.click('button:has-text("Skip")'); // Skip for now

    // 10. Medication added - verify toast
    await expect(page.locator('text=Medication added')).toBeVisible({ timeout: 5000 });

    // 11. Verify medication appears in list
    await expect(page.locator('text=Aspirin')).toBeVisible();
    await expect(page.locator('text=100mg')).toBeVisible();
    await expect(page.locator('text=08:00')).toBeVisible();

    // 12. Mark as taken
    await page.click('button:has-text("Mark as Taken")');

    // 13. Verify marked as taken
    await expect(page.locator('text=Taken ✓')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('button:has-text("Mark as Taken")')).toBeDisabled();
  });

  test('User can edit existing medication', async ({ page }) => {
    // Login as existing user
    await page.goto('/login');
    await page.fill('input[name="email"]', 'patient@demo.com');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button:has-text("Login")');

    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

    // Go to Medications page
    await page.click('text=All Medications');

    // Click Edit on first medication
    await page.click('[data-testid="edit-medication"]:first-of-type');

    // Change dosage
    await page.fill('input[name="dosage"]', '200mg');

    // Save
    await page.click('button:has-text("Save")');

    // Verify toast
    await expect(page.locator('text=Medication updated')).toBeVisible({ timeout: 5000 });

    // Verify updated dosage
    await expect(page.locator('text=200mg')).toBeVisible();
  });

  test('User can delete medication with confirmation', async ({ page }) => {
    // Login as existing user
    await page.goto('/login');
    await page.fill('input[name="email"]', 'patient@demo.com');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button:has-text("Login")');

    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

    // Go to Medications page
    await page.click('text=All Medications');

    // Count medications before delete
    const medicationsCountBefore = await page.locator('[data-testid="medication-card"]').count();

    // Click Delete on first medication
    await page.click('[data-testid="delete-medication"]:first-of-type');

    // Confirm deletion
    await page.click('button:has-text("Delete")');

    // Verify toast
    await expect(page.locator('text=Medication deleted')).toBeVisible({ timeout: 5000 });

    // Verify medication count decreased
    const medicationsCountAfter = await page.locator('[data-testid="medication-card"]').count();
    expect(medicationsCountAfter).toBe(medicationsCountBefore - 1);
  });

  test('User can view medication history', async ({ page }) => {
    // Login as existing user
    await page.goto('/login');
    await page.fill('input[name="email"]', 'patient@demo.com');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button:has-text("Login")');

    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

    // Go to History page
    await page.click('text=History');
    await expect(page).toHaveURL(/.*history/);

    // Verify history table exists
    await expect(page.locator('table')).toBeVisible();

    // Verify table headers
    await expect(page.locator('th:has-text("Medication")')).toBeVisible();
    await expect(page.locator('th:has-text("Date")')).toBeVisible();
    await expect(page.locator('th:has-text("Time")')).toBeVisible();
    await expect(page.locator('th:has-text("Status")')).toBeVisible();
  });

  test('User can view weekly schedule', async ({ page }) => {
    // Login as existing user
    await page.goto('/login');
    await page.fill('input[name="email"]', 'patient@demo.com');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button:has-text("Login")');

    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

    // Go to Week View
    await page.click('text=Week View');
    await expect(page).toHaveURL(/.*week/);

    // Verify week view table
    await expect(page.locator('table')).toBeVisible();

    // Verify days of week
    await expect(page.locator('th:has-text("Monday")')).toBeVisible();
    await expect(page.locator('th:has-text("Tuesday")')).toBeVisible();
    await expect(page.locator('th:has-text("Wednesday")')).toBeVisible();
  });
});

test.describe('Authentication Flow', () => {
  test('User can login with valid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'patient@demo.com');
    await page.fill('input[name="password"]', 'demo123');

    await page.click('button:has-text("Login")');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('User cannot login with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');

    await page.click('button:has-text("Login")');

    // Should show error toast
    await expect(page.locator('text=Invalid credentials')).toBeVisible({ timeout: 5000 });

    // Should stay on login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('User can logout', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'patient@demo.com');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button:has-text("Login")');

    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

    // Click logout
    await page.click('[data-testid="logout-button"]');

    // Should redirect to landing page
    await expect(page).toHaveURL('/', { timeout: 5000 });
  });

  test('Remember me checkbox persists session', async ({ page, context }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'patient@demo.com');
    await page.fill('input[name="password"]', 'demo123');

    // Check remember me
    await page.check('input[type="checkbox"]');

    await page.click('button:has-text("Login")');

    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

    // Close page and open new page
    await page.close();
    const newPage = await context.newPage();
    await newPage.goto('/');

    // Should still be logged in
    await expect(newPage).toHaveURL(/.*dashboard/);
  });
});

test.describe('Mobile Responsive', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size

  test('Mobile navigation works correctly', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'patient@demo.com');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button:has-text("Login")');

    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

    // Verify bottom navigation exists on mobile
    await expect(page.locator('[data-testid="bottom-nav"]')).toBeVisible();

    // Click Today in bottom nav
    await page.click('[data-testid="bottom-nav"] button:has-text("Today")');
    await expect(page).toHaveURL(/.*today/);

    // Verify burger menu exists
    await expect(page.locator('[data-testid="burger-menu"]')).toBeVisible();
  });

  test('Add medication form is responsive on mobile', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'patient@demo.com');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button:has-text("Login")');

    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

    // Click Add Medication
    await page.click('button:has-text("Add Medication")');

    // Verify form is visible and inputs are large enough for mobile
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toBeVisible();

    // Input should be at least 48px tall (mobile touch target)
    const box = await nameInput.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(48);
  });
});
