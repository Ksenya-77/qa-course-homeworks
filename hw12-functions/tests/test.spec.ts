import { test, expect } from '@playwright/test';
import {
    clickOnEspresso,
    openCheckout,
    fillPaymentForm,
    setCheckbox
} from './page-actions';

// Test 1 - HW2: Coffee Cart
test('fills payment form and verifies entered values', async ({ page }) => {
    const name = 'Oksana';
    const email = 'oksana@test.ua';

    await page.goto('https://coffee-cart.app/');
    await clickOnEspresso(page);
    await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $10.00');
    await openCheckout(page);
    await expect(page.getByRole('heading', { name: 'Payment details' })).toBeVisible();
    await fillPaymentForm(page, name, email);
    await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue(name);
    await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(email);
});

// Test 2 - HW8: XPath
test('updates selected count when rows are selected and unselected', async ({ page }) => {
    await page.goto('http://104.168.59.50/laboratory/interactions');

    const selectedCount = page.locator(
        '//span[@data-testid="interactions-selected-count"]'
    );

    const authorizationCheckbox = page.locator(
        '//input[@aria-label="Вибрати Авторизація"]'
    );

    const uploadCheckbox = page.locator(
        '//input[@aria-label="Вибрати Завантаження файлу"]'
    );

    await expect(selectedCount).toContainText('Вибрано: 0');
    await setCheckbox(page, 'Авторизація', true);
    await expect(authorizationCheckbox).toBeChecked();
    await expect(selectedCount).toContainText('Вибрано: 1');
    await setCheckbox(page, 'Завантаження файлу', true);
    await expect(uploadCheckbox).toBeChecked();
    await expect(selectedCount).toContainText('Вибрано: 2');
    await setCheckbox(page, 'Авторизація', false);
    await expect(authorizationCheckbox).not.toBeChecked();
    await expect(selectedCount).toContainText('Вибрано: 1');
});