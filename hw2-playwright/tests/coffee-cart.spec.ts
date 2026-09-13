import { test, expect } from '@playwright/test';

test('adds Espresso to cart', async ({ page }) => {
    await page.goto('https://coffee-cart.app/');
    await page.locator('[data-test="Espresso"]').click();
    await expect(page.getByRole('link', { name: 'Cart page' })).toContainText('cart (1)');
    await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $10.00');
});

test('shows Espresso details in cart', async ({ page }) => {
    await page.goto('https://coffee-cart.app/');
    await page.locator('[data-test="Espresso"]').click();
    await page.getByRole('link', { name: 'Cart page' }).click();
    const espressoRow = page.getByText('Espresso$10.00 x 1+-$10.00x');
    await expect(espressoRow).toContainText('Espresso');
    await expect(espressoRow).toContainText('$10.00 x 1');
    await expect(espressoRow).toContainText('$10.00');
});

test('adds 2 drinks and verifies them in cart', async ({ page }) => {
    await page.goto('https://coffee-cart.app/');
    await page.locator('[data-test="Mocha"]').click();
    await page.locator('[data-test="Espresso_Macchiato"]').click();
    await page.getByRole('link', { name: 'Cart page' }).click();
    const mochaRow = page.getByText('Mocha$8.00 x 1+-$8.00x');
    await expect(mochaRow).toContainText('Mocha');
    await expect(mochaRow).toContainText('$8.00 x 1');
    await expect(mochaRow).toContainText('$8.00');
    const espressoMacchiatoRow = page.getByText('Espresso Macchiato$12.00 x 1');
    await expect(espressoMacchiatoRow).toContainText('Espresso Macchiato');
    await expect(espressoMacchiatoRow).toContainText('$12.00 x 1');
    await expect(espressoMacchiatoRow).toContainText('$12.00');
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $20.00');
});

test('fills payment form and verifies entered values', async ({ page }) => {
    await page.goto('https://coffee-cart.app/');
    await page.locator('[data-test="Espresso"]').click();
    await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $10.00');
    await page.locator('[data-test="checkout"]').click();
    await expect(page.getByRole('heading', { name: 'Payment details' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Name' }).fill('Oksana');
    await page.getByRole('textbox', { name: 'Email' }).fill('oksana@test');
    await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('Oksana');
    await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('oksana@test');
});

test('completes payment successfully', async ({ page }) => {
    await page.goto('https://coffee-cart.app/');
    await page.locator('[data-test="Espresso"]').click();
    await page.locator('[data-test="Mocha"]').click();
    await expect(page.getByRole('link', { name: 'Cart page' })).toContainText('cart (2)');
    await page.getByRole('link', { name: 'Cart page' }).click();
    await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $18.00');
    await page.locator('[data-test="checkout"]').click();
    await page.getByRole('textbox', { name: 'Name' }).fill('Oksana');
    await page.getByRole('textbox', { name: 'Email' }).fill('oksana@test');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(
        page.getByRole('button', { name: 'Thanks for your purchase.' })
    ).toBeVisible();
});