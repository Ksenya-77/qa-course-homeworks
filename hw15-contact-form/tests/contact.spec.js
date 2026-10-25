
const { test, expect } = require('@playwright/test');

// Test data: three scenarios
const testData = [
    {
        id: 'All fields',
        name: 'Oksana',
        email: 'oksana@test.com',
        message: 'Some general question',
        subject: 'bug',
        priority: 'high',
        attachment: true,
        copyMe: true,
        shouldSucceed: true
    },
    {
        id: 'Required fields only',
        name: 'Oksana',
        email: 'oksana@test.com',
        message: 'Question about an article',
        subject: null,
        priority: null,
        attachment: false,
        copyMe: false,
        shouldSucceed: true
    },
    {
        id: 'Optional fields only',
        name: '',
        email: '',
        message: '',
        subject: 'feature',
        priority: 'low',
        attachment: true,
        copyMe: true,
        shouldSucceed: false
    }
];

// One test for each data object
for (const data of testData) {
    test(`Contact form: ${data.id}`, async ({ page }) => {

        // Open the contact form
        await page.goto('http://104.168.59.50/articles/contact');

        // Fill required fields
        if (data.name) {
            await page.getByTestId('contact-name').fill(data.name);
        }

        if (data.email) {
            await page.getByTestId('contact-email').fill(data.email);
        }

        if (data.message) {
            await page.getByTestId('contact-message').fill(data.message);
        }

        // Fill optional fields
        if (data.subject) {
            await page.getByTestId('contact-subject').selectOption(data.subject);
        }

        if (data.priority) {
            await page.getByTestId(`contact-priority-${data.priority}`).check();
        }

        if (data.copyMe) {
            await page.getByTestId('contact-copy-me').check();
        }

        // Attach an image if required
        if (data.attachment) {
            await page.getByTestId('contact-attachments').setInputFiles({
                name: 'test-image.png',
                mimeType: 'image/png',
                buffer: Buffer.from(
                    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lXcAAAAASUVORK5CYII=',
                    'base64'
                )
            });
        }

        // Submit the form
        await page.getByTestId('contact-submit').click();

        // Verify successful submission
        if (data.shouldSucceed) {
            await expect(
                page.getByTestId('contact-success')
            ).toBeVisible();

            await expect(
                page.getByRole('heading', { name: 'Дякуємо! 🎉' })
            ).toBeVisible();

            await expect(
                page.getByText(
                    `Ваше звернення надіслано. Ми відповімо на ${data.email}.`
                )
            ).toBeVisible();

            await expect(
                page.getByRole('button', { name: 'Надіслати ще одне' })
            ).toBeVisible();

        } else {
            // Verify the form was not submitted successfully
            await expect(
                page.getByTestId('contact-success')
            ).not.toBeVisible();

            // Verify validation errors for required fields
            await expect(
                page.getByText("обов'язкове поле", { exact: false })
            ).toHaveCount(2);

            await expect(
                page.getByText('некоректний email', { exact: false })
            ).toBeVisible();
        }
    });
}
