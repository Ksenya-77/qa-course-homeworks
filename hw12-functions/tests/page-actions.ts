import type { Page } from '@playwright/test';

export async function clickOnEspresso(page: Page): Promise<void> {
    await page.locator('[data-test="Espresso"]').click();
}

export async function openCheckout(page: Page): Promise<void> {
    await page.locator('[data-test="checkout"]').click();
}

export async function fillPaymentForm(
    page: Page,
    name: string,
    email: string
): Promise<void> {
    await page.getByRole('textbox', { name: 'Name' }).fill(name);
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
}

export async function setCheckbox(
    page: Page,
    checkboxName: string,
    checked: boolean
): Promise<void> {
    const checkbox = page.locator(
        `//input[@aria-label="Вибрати ${checkboxName}"]`
    );

    await checkbox.setChecked(checked);
}