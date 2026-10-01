import { test, expect } from '@playwright/test';

test('adds Espresso to cart using CSS locators', async ({ page }) => {
    await page.goto('https://coffee-cart.app/');
    await page.locator('[data-test="Espresso"]').click();
    await expect(page.locator('[href="/cart"]')).toContainText('cart (1)');
    await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $10.00');
});

test('shows Espresso details in cart using CSS locators', async ({ page }) => {
    await page.goto('https://coffee-cart.app/');
    await page.locator('[data-test="Espresso"]').click();
    await page.locator('[href="/cart"]').click();
    const espressoRow = page.locator(
        'ul:not(.cart-preview) > .list-item:has([aria-label="Add one Espresso"])'
    );
    await expect(espressoRow).toContainText('Espresso');
    await expect(espressoRow).toContainText('$10.00 x 1');
    await expect(espressoRow).toContainText('$10.00');
});

test('adds 2 drinks and verifies them in cart using CSS locators', async ({ page }) => {
    await page.goto('https://coffee-cart.app/');
    await page.locator('[data-test="Mocha"]').click();
    await page.locator('[data-test="Espresso_Macchiato"]').click();
    await page.locator('[href="/cart"]').click();
    const mochaRow = page.locator(
        'ul:not(.cart-preview) > .list-item:has([aria-label="Add one Mocha"])'
    );
    await expect(mochaRow).toContainText('Mocha');
    await expect(mochaRow).toContainText('$8.00 x 1');
    await expect(mochaRow).toContainText('$8.00');
    const espressoMacchiatoRow = page.locator(
        'ul:not(.cart-preview) > .list-item:has([aria-label="Add one Espresso Macchiato"])'
    );
    await expect(espressoMacchiatoRow).toContainText('Espresso Macchiato');
    await expect(espressoMacchiatoRow).toContainText('$12.00 x 1');
    await expect(espressoMacchiatoRow).toContainText('$12.00');
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $20.00');
});

test('fills payment form and verifies entered values using CSS locators', async ({ page }) => {
    await page.goto('https://coffee-cart.app/');
    await page.locator('[data-test="Espresso"]').click();
    await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $10.00');
    await page.locator('[data-test="checkout"]').click();

    await expect(page.locator('h1')).toContainText('Payment details');

    await page.locator('#name').fill('Oksana');
    await page.locator('#email').fill('oksana@test');
    await expect(page.locator('#name')).toHaveValue('Oksana');
    await expect(page.locator('#email')).toHaveValue('oksana@test');
});

test('completes payment successfully locators', async ({ page }) => {
    await page.goto('https://coffee-cart.app/');
    await page.locator('[data-test="Espresso"]').click();
    await page.locator('[data-test="Mocha"]').click();
    await expect(page.locator('[href="/cart"]')).toContainText('cart (2)');
    await page.locator('[href="/cart"]').click();
    await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $18.00');
    await page.locator('[data-test="checkout"]').click();
    await page.locator('#name').fill('Oksana');
    await page.locator('#email').fill('oksana@test');
    await page.locator('#submit-payment').click();
    await expect(page.locator('.snackbar.success')).toContainText('Thanks for your purchase.');
});