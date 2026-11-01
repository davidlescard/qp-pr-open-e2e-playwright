import { test, expect } from '@fixtures/baseTest';

test('a failed API request shows an error and recovers on retry', { tag: '@regression' }, async ({ page, dashboardPage }) => {
    const isRunsList = (url: URL) => url.pathname === '/api/runs';
    await page.route(isRunsList, (route) => route.fulfill({ status: 500, json: { error: 'Internal server error' } }));

    await page.reload();
    await expect(dashboardPage.errorAlert).toContainText('Unable to load test runs');
    await expect(dashboardPage.rows).toHaveCount(0);

    await page.unroute(isRunsList);
    await dashboardPage.retryButton.click();
    await expect(dashboardPage.errorAlert).toBeHidden();
    await expect(dashboardPage.rows).toHaveCount(9);
});
