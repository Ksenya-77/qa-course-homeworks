import { test, expect } from '@playwright/test';

test.describe('Sortable table - XPath', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://104.168.59.50/laboratory/interactions');
  });

  test('updates selected count when rows are selected and unselected', async ({ page }) => {
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

    await authorizationCheckbox.check();

    await expect(authorizationCheckbox).toBeChecked();
    await expect(selectedCount).toContainText('Вибрано: 1');

    await uploadCheckbox.check();

    await expect(uploadCheckbox).toBeChecked();
    await expect(selectedCount).toContainText('Вибрано: 2');

    await authorizationCheckbox.uncheck();

    await expect(authorizationCheckbox).not.toBeChecked();
    await expect(selectedCount).toContainText('Вибрано: 1');
  });

  test('sorts Test column and changes row order', async ({ page }) => {
    const sortButton = page.locator(
      '//button[@data-testid="interactions-sort-name"]'
    );

    const header = page.locator(
      '//button[@data-testid="interactions-sort-name"]/parent::th'
    );

    const testNames = page.locator(
      '//table[@data-testid="interactions-table"]//tbody/tr/td[2]'
    );

    await expect(header).toHaveAttribute('aria-sort', 'ascending');

    await expect(testNames).toHaveText([
      'Авторизація',
      'Завантаження файлу',
      'Пошук за тегом',
      'Створення статті',
    ]);

    await sortButton.click();

    await expect(header).toHaveAttribute('aria-sort', 'descending');

    await expect(testNames).toHaveText([
      'Створення статті',
      'Пошук за тегом',
      'Завантаження файлу',
      'Авторизація',
    ]);
  });

  test('sorts Status column and changes row order', async ({ page }) => {
    const sortButton = page.locator(
      '//button[@data-testid="interactions-sort-status"]'
    );

    const header = page.locator(
      '//button[@data-testid="interactions-sort-status"]/parent::th'
    );

    const statusCells = page.locator(
      '//table[@data-testid="interactions-table"]//tbody/tr/td[3]'
    );

    await expect(header).toHaveAttribute('aria-sort', 'none');

    await sortButton.click();

    await expect(header).toHaveAttribute('aria-sort', 'ascending');

    const ascendingStatuses = await statusCells.allTextContents();

    expect(ascendingStatuses).toEqual(
      [...ascendingStatuses].sort((a, b) => a.localeCompare(b))
    );

    await sortButton.click();

    await expect(header).toHaveAttribute('aria-sort', 'descending');

    const descendingStatuses = await statusCells.allTextContents();

    expect(descendingStatuses).toEqual(
      [...descendingStatuses].sort((a, b) => b.localeCompare(a))
    );
  });

  test('sorts Duration column and changes row order', async ({ page }) => {
    const sortButton = page.locator(
      '//button[@data-testid="interactions-sort-duration"]'
    );

    const header = page.locator(
      '//button[@data-testid="interactions-sort-duration"]/parent::th'
    );

    const durationCells = page.locator(
      '//table[@data-testid="interactions-table"]//tbody/tr/td[4]'
    );

    await expect(header).toHaveAttribute('aria-sort', 'none');

    await sortButton.click();

    await expect(header).toHaveAttribute('aria-sort', 'ascending');

    await expect(durationCells).toHaveText([
      '0.0 s',
      '5.7 s',
      '8.4 s',
      '12.1 s',
    ]);

    await sortButton.click();

    await expect(header).toHaveAttribute('aria-sort', 'descending');

    await expect(durationCells).toHaveText([
      '12.1 s',
      '8.4 s',
      '5.7 s',
      '0.0 s',
    ]);
  });
});