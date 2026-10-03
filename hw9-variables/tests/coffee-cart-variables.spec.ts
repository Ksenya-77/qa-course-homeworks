import { test, expect } from '@playwright/test';

const baseUrl = 'https://coffee-cart.app/';

test('adds Espresso to cart using variables', async ({ page }) => {
    const espresso = page.locator('[data-test="Espresso"]');
    const cartLink = page.locator('[href="/cart"]');
    const checkout = page.locator('[data-test="checkout"]');

    await page.goto(baseUrl);
    await espresso.click();
    await expect(cartLink).toContainText('cart (1)');
    await expect(checkout).toContainText('Total: $10.00');
});

test('shows Espresso details in cart using variables', async ({ page }) => {
    const espresso = page.locator('[data-test="Espresso"]');
    const cartLink = page.locator('[href="/cart"]');

    await page.goto(baseUrl);
    
    await espresso.click();
    await cartLink.click();
    const espressoRow = page.locator(
        'ul:not(.cart-preview) > .list-item:has([aria-label="Add one Espresso"])'
    );
    await expect(espressoRow).toContainText('Espresso');
    await expect(espressoRow).toContainText('$10.00 x 1');
    await expect(espressoRow).toContainText('$10.00');
});

test('adds 2 drinks and verifies them in cart using variables', async ({ page }) => {
    const mocha = page.locator('[data-test="Mocha"]');
    const espressoMacchiato = page.locator('[data-test="Espresso_Macchiato"]');
    const cartLink = page.locator('[href="/cart"]');
    const checkout = page.locator('[data-test="checkout"]');

    await page.goto(baseUrl);

    await mocha.click();
    await espressoMacchiato.click();
    await cartLink.click();
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
    await expect(checkout).toContainText('Total: $20.00');
});

test('fills payment form and verifies entered values using variables', async ({ page }) => {
    const espresso = page.locator('[data-test="Espresso"]');
    const checkout = page.locator('[data-test="checkout"]');
    const header = page.locator('h1');
    const name = page.locator('#name');
    const email = page.locator('#email');

    await page.goto(baseUrl);

    await espresso.click();
    await expect(checkout).toContainText('Total: $10.00');
    await checkout.click();

    await expect(header).toContainText('Payment details');

    await name.fill('Oksana');
    await email.fill('oksana@test');
    await expect(name).toHaveValue('Oksana');
    await expect(email).toHaveValue('oksana@test');
});

test('completes payment successfully variables', async ({ page }) => {
    const espresso = page.locator('[data-test="Espresso"]');
    const mocha = page.locator('[data-test="Mocha"]');
    const cart = page.locator('[href="/cart"]');
    const checkout = page.locator('[data-test="checkout"]');
    const name = page.locator('#name');
    const email = page.locator('#email');
    const success = page.locator('.snackbar.success');
    const submitPayment = page.locator('#submit-payment');

    await page.goto(baseUrl);

    await espresso.click();
    await mocha.click();
    await expect(cart).toContainText('cart (2)');
    await cart.click();
    await expect(checkout).toContainText('Total: $18.00');
    await checkout.click();
    await name.fill('Oksana');
    await email.fill('oksana@test');
    await submitPayment.click();
    await expect(success).toContainText('Thanks for your purchase.');
});