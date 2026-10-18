
const { test, expect } = require('@playwright/test');

// Функция авторизации
async function login(page, email, password) {
    await page.getByTestId('nav-sign-in').click();

    await page.getByTestId('auth-email').fill(email);
    await page.getByTestId('auth-password').fill(password);
    await page.getByTestId('auth-submit').click();

    // Проверяем, что пользователь авторизовался
    await expect(page.getByTestId('nav-new-article')).toBeVisible();
}

// Функция создания статьи
async function createArticle(page, title, description, body) {
    await page.getByTestId('nav-new-article').click();

    await page.getByTestId('editor-title').fill(title);
    await page.getByTestId('editor-description').fill(description);
    await page.getByTestId('editor-body').fill(body);

    await page.getByTestId('editor-submit').click();

    // Проверяем, что форма создания статьи закрылась
    await expect(page.getByTestId('editor-submit')).not.toBeVisible();
}

// Основной тест
test('Create 10 articles and verify Your Feed', async ({ page }) => {

    // 1. Открываем сайт
    await page.goto('http://104.168.59.50/articles');

    // 2. Авторизуемся под Oksana
    await login(page, 'oksana@example.com', process.env.TEST_PASSWORD);

    // 3. Создаём массив для названий статей
    const articleTitles = [];

    // 4. Создаём 10 уникальных статей через цикл for
    for (let i = 1; i <= 10; i++) {
        const title = `HW14 Article ${Date.now()}-${i}`;
        const description = `Description for article ${i}`;
        const body = `This is the body of article ${i}`;

        await createArticle(page, title, description, body);

        articleTitles.push(title);
    }

    // 5. Проверяем, что создали 10 названий
    expect(articleTitles).toHaveLength(10);

    console.log('Created articles:', articleTitles);

    // 6. Выходим из аккаунта Oksana
    await page.getByTestId('nav-profile').click();
    await page.getByRole('link', { name: 'Edit profile' }).click();
    await page.getByTestId('logout-button').click();

    await expect(page.getByTestId('nav-sign-in')).toBeVisible();

    // 7. Авторизуемся под OksanaReader
    await login(
        page,
        'OksanaReader@example.com',
        process.env.TEST_PASSWORD
    );

    // 8. Открываем Your Feed
    await page.getByTestId('nav-home').click();
    await page.getByTestId('feed-tab-your').click();

    // 9. Создаём Set для найденных статей
    const foundTitles = new Set();

    // 10. Проверяем статьи с учётом пагинации
    for (let pageNumber = 1; pageNumber <= 20; pageNumber++) {

        // Ждём появления статей
        await expect(
            page.getByRole('link', {
                name: /HW14 Article/,
            }).first()
        ).toBeVisible();

        // Ищем наши 10 статей на текущей странице
        for (const title of articleTitles) {
            const article = page.getByRole('link', {
                name: title,
                exact: false
            });

            if (await article.count() > 0) {
                foundTitles.add(title);
            }
        }

        // Если нашли все 10 статей, заканчиваем поиск
        if (foundTitles.size === articleTitles.length) {
            break;
        }

        // Ищем следующую страницу
        const nextPage = page.getByTestId(
            `pagination-page-${pageNumber + 1}`
        );

        // Если следующей страницы нет, выходим из цикла
        if (await nextPage.count() === 0) {
            break;
        }

        // Переходим на следующую страницу
        await nextPage.click();
    }

    // 11. Проверяем, что все 10 статей найдены
    expect(
        [...foundTitles],
        'All 10 created articles should appear in Your Feed'
    ).toEqual(expect.arrayContaining(articleTitles));

    expect(foundTitles.size).toBe(10);

    console.log('All 10 articles were found in Your Feed!');
});
