import { test, expect } from '@playwright/test';

test.describe('Registration', { tag: '@auth' }, () => {

test('registers a new user successfully', async ({ page }) => {
    const uniqueId = crypto.randomUUID();
    const username = `Oksana-${uniqueId}`;
    const email = `oksana-${uniqueId}@gmail.com`;
    await page.goto('/register');
    await page.getByTestId('auth-username').fill(username);
    await page.getByTestId('auth-email').fill(email);
    await page.getByTestId('auth-password').fill('Danylo0708');
    await page.getByTestId('register-confirm-password').fill('Danylo0708');
    await page.getByTestId('register-newsletter').uncheck();
    await page.getByTestId('register-terms').check();
    await page.getByTestId('auth-submit').click();
    await expect(page.getByTestId('nav-profile')).toContainText(username);
});


test('shows an error when registering with an already-used email', async ({ page }) => {

    const uniqueId = crypto.randomUUID();
    const username = `Oksana-${uniqueId}`;
    const email = `oksana-${uniqueId}@gmail.com`;
    const secondUsername = `Oksana-second-${uniqueId}`;
    await page.goto('/register');
    await page.getByTestId('auth-username').fill(username);
    await page.getByTestId('auth-email').fill(email);
    await page.getByTestId('auth-password').fill('Danylo0708');
    await page.getByTestId('register-confirm-password').fill('Danylo0708');
    await page.getByTestId('register-terms').check();
    await page.getByTestId('auth-submit').click();
    await expect(page.getByTestId('nav-profile')).toContainText(username);
    await page.goto('/register');
    await page.getByTestId('auth-username').fill(secondUsername);
    await page.getByTestId('auth-email').fill(email);
    await page.getByTestId('auth-password').fill('Danylo0708');
    await page.getByTestId('register-confirm-password').fill('Danylo0708');
    await page.getByTestId('register-terms').check();
    await page.getByTestId('auth-submit').click();
    await expect(
        page.getByTestId('error-messages').getByRole('paragraph')
    ).toContainText('body email або username вже зайняті'); 
});


test('shows validation error for invalid email during registration', async ({ page }) => {
    const uniqueId = crypto.randomUUID();
    const username = `Oksana-${uniqueId}`;
    const email = `oksana-${uniqueId}@com`;
    await page.goto('/register');
    await page.getByTestId('auth-username').fill(username);
    await page.getByTestId('auth-email').fill(email);
    await page.getByTestId('auth-password').fill('Danylo0708');
    await page.getByTestId('register-confirm-password').fill('Danylo0708');
    await page.getByTestId('register-terms').check();
    await page.getByTestId('auth-submit').click();
    await expect(
    page.getByTestId('error-messages').getByRole('paragraph')
    ).toContainText('email некоректний email'); 
});
});


test.describe('Login', { tag: '@auth' }, () => {

test('logs in successfully with valid credentials', async ({ page }) => {
   await page.goto('/login'); 
   await page.getByTestId('auth-email').fill('olena@example.com');
   await page.getByTestId('auth-password').fill('password');
   await page.getByTestId('auth-submit').click();
   await expect(page.getByTestId('nav-profile')).toContainText('olena');
});


test('shows an error when logging in with an incorrect password', async ({ page }) => {
    const password = 'wrongPassword123';
    await page.goto('/login'); 
    await page.getByTestId('auth-email').fill('olena@example.com');
    await page.getByTestId('auth-password').fill(password);
    await page.getByTestId('auth-submit').click();
    await expect(page.getByTestId('error-messages').getByRole('paragraph')).toContainText('email or password неправильні');
});


test('shows an error when logging in with a non-existent user', async ({ page }) => {
    const uniqueId = crypto.randomUUID();
    const email = `oksana-${uniqueId}@gmail.com`;
    const password = 'password';
    await page.goto('/login');
    await page.getByTestId('auth-email').fill(email);
    await page.getByTestId('auth-password').fill(password);
    await page.getByTestId('auth-submit').click();
    await expect(
        page.getByTestId('error-messages').getByRole('paragraph')
    ).toContainText('email or password неправильні');
});

});