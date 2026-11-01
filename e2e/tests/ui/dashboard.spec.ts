import { test, expect } from '@fixtures/baseTest';

test('dashboard shows the seeded test runs', { tag: '@smoke' }, async ({ dashboardPage }) => {
    await expect(dashboardPage.heading).toBeVisible();
    await expect(dashboardPage.rows).toHaveCount(9); //header row + 8 seeded test runs
    await expect(dashboardPage.runLink('Login Flow')).toBeVisible();
});

test.describe('runs grid', { tag: '@regression' }, () => {
    test('declared columns match the header', async ({ dashboardPage }) => {
        await dashboardPage.runsTable.verifyColumns();
    });

    test('finds cells by row value with and without a reference column', async ({ dashboardPage }) => {
        const { runsTable } = dashboardPage;
        await expect(runsTable.getCell('Status', 'Reporting Export', 'Name')).toHaveText('passed');
        await expect(runsTable.getCell('Branch', 'Reporting Export')).toHaveText('release/1.2');
        await expect(runsTable.getCell('Name', 1)).toHaveText('Login Flow');
    });

    test('sorts by a column header', async ({ dashboardPage }) => {
        const { runsTable } = dashboardPage;
        await runsTable.clickHeader('Name');
        await expect(runsTable.getHeader('Name')).toHaveAttribute('aria-sort', 'ascending');
        const names = await runsTable.getColumnValues('Name');
        expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    });
});